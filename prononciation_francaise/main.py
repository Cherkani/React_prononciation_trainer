from record import record_audio
from transcribe import transcribe
from feedback import provide_feedback
import os

if __name__ == "__main__":
    # Step 1: Record audio
    print("Recording audio...")
    audio_file = record_audio(duration=5)

    # Step 2: Transcribe speech
    print("Transcribing audio...")
    recognized_text = transcribe(audio_file, language="fr-FR")
    print(f"Recognized Text: {recognized_text}")

    # Step 3: Provide feedback
    reference_phrase = "Le ciel est bleu"
    print("Analyzing feedback...")
    result = provide_feedback(recognized_text, reference_phrase)

    # Display Results
    print("\nFeedback:")
    for line in result['feedback']:
        print(line)
    print(f"\nMatch: {'Yes' if result['match'] else 'No'}")

    # Cleanup: Delete temporary audio file
    if os.path.exists(audio_file):
        os.remove(audio_file)
