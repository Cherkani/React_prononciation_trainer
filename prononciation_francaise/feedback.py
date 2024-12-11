from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/feedback', methods=['POST'])
def feedback():
    recognized_text = request.json.get('recognized_text', "").strip().lower()
    reference_phrase = request.json.get('reference_phrase', "").strip().lower()

    # Feedback par mot
    reference_words = reference_phrase.split()
    recognized_words = recognized_text.split()
    feedback = []

    for ref_word, recog_word in zip(reference_words, recognized_words):
        if ref_word == recog_word:
            feedback.append(f"Correct: '{recog_word}'")
        else:
            feedback.append(f"Incorrect: You said '{recog_word}', should be '{ref_word}'")

    # Mots en trop / manquants
    if len(reference_words) < len(recognized_words):
        extra_words = recognized_words[len(reference_words):]
        feedback.append(f"Extra words: {' '.join(extra_words)}")
    elif len(reference_words) > len(recognized_words):
        missing_words = reference_words[len(recognized_words):]
        feedback.append(f"Missing words: {' '.join(missing_words)}")

    match = recognized_text == reference_phrase
    return jsonify({"match": match, "feedback": feedback})

if __name__ == "__main__":
    app.run(port=5003)
