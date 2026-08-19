import os
import wave
import webrtcvad
import numpy as np
from datetime import datetime
import pyaudio
from config import VAD_MODE, THRESHOLD_VOICE_DETECTION, RATE, COLLECTION_FIREBASE_EXCHANGES_DIR, FORMAT

# Initialize VAD
try:
    vad = webrtcvad.Vad(VAD_MODE)
except Exception as e:
    print(f"Failed to initialize VAD: {e}")
    # Handle error appropriately, maybe exit or use a fallback
    vad = None

def extract_channel(raw_data, sample_width, num_channels, target_channel):
    frame_count = len(raw_data) // (sample_width * num_channels)
    return b''.join(raw_data[i * num_channels * sample_width + target_channel * sample_width:
                             i * num_channels * sample_width + (target_channel + 1) * sample_width]
                    for i in range(frame_count))

def calculate_rms(frame_bytes, sample_width=2):
    dtype = np.int16 if sample_width == 2 else np.int8
    audio_array = np.frombuffer(frame_bytes, dtype=dtype)
    if audio_array.size == 0:
        return 0.0
    rms = np.sqrt(np.mean(np.square(audio_array.astype(np.float32))))
    return rms

def is_likely_speech(frame):
    if not vad:
        # Fallback if VAD initialization failed
        return calculate_rms(frame) >= THRESHOLD_VOICE_DETECTION
    # Ensure frame is of correct length for VAD
    # webrtcvad requires 10, 20, or 30 ms frames
    # RATE is 48000, so for 16-bit audio, 30ms is 48000 * 2 * 0.03 = 2880 bytes
    # Let's ensure we are feeding it the right size
    # This part is tricky if frame sizes vary. Assuming fixed frame size from main.py
    try:
        is_speech_vad = vad.is_speech(frame, RATE)
    except Exception as e:
        # print(f"VAD processing error: {e}") # Can be noisy
        is_speech_vad = False # Assume not speech if error

    return calculate_rms(frame) >= THRESHOLD_VOICE_DETECTION and is_speech_vad

def record_exchange(frames, canal_radio, pa):
    dt = datetime.now()
    ts_str = dt.strftime("%Y-%m-%d_%H-%M-%S")
    ts_ms = int(dt.timestamp() * 1000)
    filename = f"echange_canal_{canal_radio}_{ts_str}.wav"

    try:
        os.makedirs(COLLECTION_FIREBASE_EXCHANGES_DIR, exist_ok=True)
        path = os.path.join(COLLECTION_FIREBASE_EXCHANGES_DIR, filename)

        with wave.open(path, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(pyaudio.get_sample_size(FORMAT))
            wf.setframerate(RATE)
            wf.writeframes(b''.join(frames))

        print(f"[Canal {canal_radio}] Exchange recorded: {filename}")
        return filename, path, ts_ms, ts_str
    except IOError as e:
        print(f"[Canal {canal_radio}] Error saving exchange file: {e}")
        return None, None, None, None
    except Exception as e:
        print(f"[Canal {canal_radio}] An unexpected error occurred during recording: {e}")
        return None, None, None, None
