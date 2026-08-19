import sys
import time
import threading
import collections
import os
import requests
import json
from queue import Queue
from dotenv import load_dotenv
import pyaudio
import questionary
import paramiko

from config import FORMAT, RATE, FRAME_SIZE, FRAME_DURATION_MS, CHANNELS_PER_DEVICE, MAX_SILENT_FRAMES
from audio_utils import extract_channel, is_likely_speech, record_exchange

load_dotenv()

def load_channel_config():
    config_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'configCanaux.json')
    if os.path.exists(config_path):
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except Exception:
            return None
    return None

def check_required_env_vars():
    required_keys = ['SFTP_HOST', 'SFTP_PORT', 'SFTP_USERNAME', 'SFTP_PASSWORD', 'SFTP_REMOTE_DIR']
    missing = [key for key in required_keys if not os.getenv(key)]
    if missing:
        print("ERREUR : Variables manquantes dans le fichier .env :")
        for key in missing:
            print(f"   - {key}")
        print("\nVérifiez que votre fichier s'appelle exactement '.env' et qu'il est au bon endroit.")
        sys.exit(1)

    if not os.getenv("SFTP_PASSWORD") and not os.getenv("SFTP_PRIVATE_KEY"):
        print("ERREUR : vous devez définir SFTP_PASSWORD ou SFTP_PRIVATE_KEY dans le .env")
        sys.exit(1)

check_required_env_vars()

SFTP_HOST         = os.getenv("SFTP_HOST")
SFTP_PORT         = int(os.getenv("SFTP_PORT", "22"))
SFTP_USERNAME     = os.getenv("SFTP_USERNAME")
SFTP_PASSWORD     = os.getenv("SFTP_PASSWORD")
SFTP_REMOTE_DIR   = os.getenv("SFTP_REMOTE_DIR").rstrip("/")

RECORDER_API_URL  = os.getenv('API_BASE_URL', '').rstrip('/')
RECORDER_API_ENABLED = bool(RECORDER_API_URL)

if RECORDER_API_ENABLED:
    print(f"API recorder activée → {RECORDER_API_URL}")
else:
    print("API recorder désactivée (API_BASE_URL absent du .env)")

audio_driver = pyaudio.PyAudio()


# --- UPLOAD VERS SFTP ---

def ensure_remote_dir(sftp, remote_directory):
    parts = remote_directory.strip("/").split("/")
    current = ""
    for part in parts:
        current += f"/{part}"
        try:
            sftp.stat(current)
        except IOError:
            sftp.mkdir(current)

def create_sftp_client():
    ssh = paramiko.SSHClient()
    ssh.load_system_host_keys()
    # RejectPolicy reste la politique sûre par défaut

    connect_kwargs = {
        "hostname": SFTP_HOST,
        "port": SFTP_PORT,
        "username": SFTP_USERNAME,
        "password": SFTP_PASSWORD,
        "timeout": 10,
    }

    ssh.connect(**connect_kwargs)
    sftp = ssh.open_sftp()
    return ssh, sftp

def upload_to_sftp(local_filepath, canal_number, audio_duration):
    ssh = None
    sftp = None

    try:
        filename = os.path.basename(local_filepath)
        object_name = f"canal_{canal_number}_{filename}"
        remote_path = f"{SFTP_REMOTE_DIR}/{object_name}"

        ssh, sftp = create_sftp_client()
        ensure_remote_dir(sftp, SFTP_REMOTE_DIR)
        sftp.put(local_filepath, remote_path)

        print(f"[Canal {canal_number}] Upload SFTP réussi : {remote_path}")
        notify_recorder(object_name, canal_number, audio_duration)

    except Exception as error:
        print(f"[Canal {canal_number}] Erreur upload SFTP : {error}")

    finally:
        if sftp:
            sftp.close()
        if ssh:
            ssh.close()


# --- NOTIFICATION DU RECORDER ---

def notify_recorder(object_name, canal_number, audio_duration):
    if not RECORDER_API_ENABLED:
        return

    record_url = f"{RECORDER_API_URL}"
    payload = {
        "canalNumber": canal_number,
        "fileName": object_name,
        "duration": audio_duration
    }

    try:
        response = requests.post(record_url, json=payload, timeout=1000)

        if response.status_code == 201:
            data = response.json()
            job_id = data["id"]
            print(f"[Canal {canal_number}] Transcription lancée → job {job_id}")
        else:
            print(f"[Canal {canal_number}] Recorder a refusé ({response.status_code}) : {response.text}")

    except Exception as error:
        print(f"[Canal {canal_number}] Erreur notification recorder : {error}")


# --- DÉTECTION ET ENREGISTREMENT ---

def listen_channel(canal_number, input_index, pa_instance, audio_queue=None, direct_stream=None):
    pre_buffer = collections.deque(maxlen=MAX_SILENT_FRAMES)
    is_recording = False
    recorded_frames = []
    consecutive_silent_frames = 0

    print(f"[Canal {canal_number}] Prêt à écouter.")
    try:
        while True:
            if audio_queue:
                raw_frame = audio_queue.get()
                if raw_frame is None:
                    break
            elif direct_stream:
                raw_frame = direct_stream.read(FRAME_SIZE, exception_on_overflow=False)
            else:
                break

            frame_size_bytes = 2880
            for offset in range(0, len(raw_frame), frame_size_bytes):
                frame = raw_frame[offset:offset + frame_size_bytes]
                if len(frame) < frame_size_bytes:
                    continue

                is_speech = is_likely_speech(frame)

                if not is_recording:
                    pre_buffer.append((frame, is_speech))
                    speech_count = sum(1 for _, s in pre_buffer if s)
                    if len(pre_buffer) > 0 and speech_count / len(pre_buffer) > 0.8:
                        is_recording = True
                        recorded_frames.extend([f for f, _ in pre_buffer])
                        pre_buffer.clear()
                        consecutive_silent_frames = 0
                        print(f"\n[Canal {canal_number}] Voix détectée !")
                else:
                    recorded_frames.append(frame)
                    if is_speech:
                        consecutive_silent_frames = 0
                    else:
                        consecutive_silent_frames += 1

                    if consecutive_silent_frames >= MAX_SILENT_FRAMES:
                        _, saved_filepath, _, _ = record_exchange(recorded_frames, canal_number, pa_instance)
                        if saved_filepath:
                            audio_duration = max(1, round(len(recorded_frames) * FRAME_DURATION_MS / 1000))
                            print(f"[Canal {canal_number}] Enregistré ({audio_duration}s) → {os.path.basename(saved_filepath)}")
                            upload_thread = threading.Thread(
                                target=upload_to_sftp,
                                args=(saved_filepath, canal_number, audio_duration)
                            )
                            upload_thread.daemon = True
                            upload_thread.start()

                        is_recording = False
                        recorded_frames = []
                        consecutive_silent_frames = 0
                        pre_buffer.clear()

    except Exception as error:
        print(f"[Canal {canal_number}] Erreur : {error}")


# --- MODES D'ENTRÉE ---

def reader_loop(stream, input_to_canal_mapping, sample_size, channel_queues):
    try:
        while stream.is_active():
            raw_data = stream.read(FRAME_SIZE * CHANNELS_PER_DEVICE, exception_on_overflow=False)
            for input_index, canal_number in input_to_canal_mapping.items():
                frame = extract_channel(raw_data, sample_size, CHANNELS_PER_DEVICE, input_index - 1)
                channel_queues[canal_number].put(frame)
    except Exception:
        pass
    finally:
        for queue in channel_queues.values():
            queue.put(None)

def run_maya_mode(pa_instance, device_index, channel_mapping_config=None):
    if channel_mapping_config:
        input_to_canal = {m['input']: m['radio'] for m in channel_mapping_config if m.get('active', False)}
    else:
        input_choices = ["Input 1", "Input 2", "Input 3", "Input 4"]
        selected_inputs = questionary.checkbox("Canaux physiques à activer :", choices=input_choices).ask()
        if not selected_inputs:
            return
        input_to_canal = {}
        for label in selected_inputs:
            input_idx = int(label.split()[-1])
            canal_num = int(questionary.text(f"N° Radio pour {label} (1-4) :").ask())
            input_to_canal[input_idx] = canal_num

    channel_queues = {canal: Queue() for canal in input_to_canal.values()}
    sample_size = pa_instance.get_sample_size(FORMAT)

    stream = pa_instance.open(
        format=FORMAT, channels=CHANNELS_PER_DEVICE, rate=RATE,
        input=True, input_device_index=device_index,
        frames_per_buffer=FRAME_SIZE * CHANNELS_PER_DEVICE
    )

    for input_idx, canal_num in input_to_canal.items():
        listener = threading.Thread(
            target=listen_channel,
            args=(canal_num, input_idx, pa_instance, channel_queues[canal_num])
        )
        listener.daemon = True
        listener.start()

    reader = threading.Thread(
        target=reader_loop,
        args=(stream, input_to_canal, sample_size, channel_queues)
    )
    reader.daemon = True
    reader.start()

    if channel_mapping_config:
        print("\nDémarrage automatique. Ctrl+C pour arrêter.")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            pass
    else:
        input("Appuyez sur Entrée pour arrêter...\n")

    stream.stop_stream()
    stream.close()

def run_simple_mode(pa_instance, device_index):
    canal_choices = [f"Canal {i}" for i in range(1, 9)]
    selected = questionary.checkbox("Canaux radio à écouter :", choices=canal_choices).ask()
    if not selected:
        return

    canal_numbers = [int(c.split()[-1]) for c in selected]
    active_streams = []

    for canal_num in canal_numbers:
        stream = pa_instance.open(format=FORMAT, channels=1, rate=RATE, input=True, input_device_index=device_index)
        active_streams.append(stream)
        listener = threading.Thread(
            target=listen_channel,
            args=(canal_num, 1, pa_instance),
            kwargs={"direct_stream": stream}
        )
        listener.daemon = True
        listener.start()

    input("Appuyez sur Entrée pour arrêter...\n")
    for stream in active_streams:
        stream.stop_stream()
        stream.close()

def main():
    try:
        config = load_channel_config()
        available_devices = []
        auto_device_index = None

        for i in range(audio_driver.get_device_count()):
            device_info = audio_driver.get_device_info_by_index(i)
            if device_info["maxInputChannels"] > 0:
                label = f"[{i}] {device_info['name']}"
                available_devices.append((label, i))
                if config and config.get('default_device_name', '').upper() in device_info['name'].upper():
                    auto_device_index = i

        if auto_device_index is not None and config:
            run_maya_mode(audio_driver, auto_device_index, config['mapping'])
        else:
            if not available_devices:
                print("Aucun périphérique audio d'entrée trouvé.")
                return
            choice = questionary.select("Carte son :", choices=[d[0] for d in available_devices]).ask()
            selected_device_index = next(i for label, i in available_devices if label == choice)
            maya_device_index = next((i for label, i in available_devices if "MAYA44" in label.upper()), None)

            if selected_device_index == maya_device_index:
                run_maya_mode(audio_driver, selected_device_index)
            else:
                run_simple_mode(audio_driver, selected_device_index)

    finally:
        audio_driver.terminate()

if __name__ == "__main__":
    main()
