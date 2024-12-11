from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes by default

@app.route('/transcribe', methods=['POST'])
def transcribe_audio():
    data = request.json
    audio_file_path = data.get('audio_file')  # Expecting a file path

    if not audio_file_path:
        return jsonify({"error": "Missing audio file path"}), 400

    recognizer = sr.Recognizer()

    try:
        with sr.AudioFile(audio_file_path) as source:
            print(f"Processing file: {audio_file_path}")
            audio = recognizer.record(source)
            print("Audio successfully recorded.")

            recognized_text = recognizer.recognize_google(audio, language="fr-FR")
            return jsonify({"recognized_text": recognized_text})

    except sr.UnknownValueError:
        print("Speech Recognition could not understand audio")
        return jsonify({"error": "Speech Recognition could not understand audio"}), 400
    except sr.RequestError as e:
        print(f"Error with the recognition service: {e}")
        return jsonify({"error": f"Error with the recognition service: {e}"}), 500
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(port=5002)