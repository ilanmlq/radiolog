import pyaudio
# === Audio Processing ===
# PyAudio format
FORMAT = pyaudio.paInt16
# Rate in Hz
RATE = 48000
# Frame duration in milliseconds
FRAME_DURATION_MS = 30
# Frame size in samples
FRAME_SIZE = int(RATE * FRAME_DURATION_MS / 1000)
# Number of channels for the MAYA44 sound card
CHANNELS_PER_DEVICE = 4

# === Voice Activity Detection (VAD) ===
# Mode for webrtcvad (1-3). 3 is the most aggressive.
VAD_MODE = 3
# RMS threshold to consider a frame as potential speech.
# This may need adjustment based on the microphone and environment.
THRESHOLD_VOICE_DETECTION = 400
# How many silent frames to wait for before ending the exchange.
# Calculated as: (duration_in_ms / FRAME_DURATION_MS)
MAX_SILENT_FRAMES = int(1000 / FRAME_DURATION_MS)

# === Firebase & Conversation Logic ===
# Time in milliseconds to wait before creating a new conversation
# for a new exchange on the same radio channel.
THRESHOLD_DELAY_ASSIGN_CONVERSATION_MS = 30 * 1000  # 30 seconds


# Directory to save recorded exchanges
COLLECTION_FIREBASE_EXCHANGES_DIR = "echanges"

# Directory to save recorded conversations
COLLECTION_FIREBASE_CONVERSATIONS_NAME = "conversations"
