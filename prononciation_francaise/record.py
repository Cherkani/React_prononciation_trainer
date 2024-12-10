import sounddevice as sd
import scipy.io.wavfile as wavfile

def record_audio(duration=5, filename="output.wav"):
    sample_rate = 44100  # Standard sample rate for audio
    recording = sd.rec(int(duration * sample_rate), samplerate=sample_rate, channels=1, dtype="int16")
    sd.wait()
    wavfile.write(filename, sample_rate, recording)
    return filename
