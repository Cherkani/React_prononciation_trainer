import speech_recognition as sr

def transcribe(audio_file, language="fr-FR"):
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_file) as source:
            audio = recognizer.record(source)
            recognized_text = recognizer.recognize_google(audio, language=language)
            return recognized_text
    except sr.UnknownValueError:
        return "Speech not recognized."
    except sr.RequestError as e:
        return f"Speech recognition service error: {e}"
