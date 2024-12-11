import requests  # Import the requests library
from flask import Flask, jsonify, request, send_from_directory
import random
import json
import os
import subprocess
import time

app = Flask(__name__)

# Define services to be run in separate processes
services = [
    {"name": "record", "port": 5001, "script": "record.py"},
    {"name": "transcribe", "port": 5002, "script": "transcribe.py"},
    {"name": "feedback", "port": 5003, "script": "feedback.py"},
]

processes = []

# Start the services
for service in services:
    process = subprocess.Popen(["python", service["script"]])
    processes.append(process)
    print(f"Starting service {service['name']} on port {service['port']}")

# Wait for services to be ready
time.sleep(5)

# Load French sentences from JSON file
with open('./french_sentences.json', 'r', encoding='utf-8') as f:
    french_sentences = json.load(f)

@app.route('/')
def index():
    return send_from_directory('./template/', 'index.html')

@app.route('/get_sentence', methods=['GET'])
def get_sentence():
    selected_sentence = random.choice(french_sentences)
    return jsonify({"sentence": selected_sentence})

@app.route('/process_audio', methods=['POST'])
def process_audio():
    data = request.json
    recognized_text = data.get('recognized_text')
    selected_sentence = data.get('selected_sentence')

    if not recognized_text or not selected_sentence:
        return jsonify({"error": "Missing recognized text or selected sentence"}), 400

    # Simuler une comparaison et un feedback
    match = recognized_text.strip().lower() == selected_sentence.strip().lower()
    feedback = "Bien joué!" if match else "Essayez encore."

    return jsonify({"recognized_text": recognized_text, "feedback": feedback, "match": match})

if __name__ == "__main__":
    app.run(port=5000)

# Terminate the services at the end
for process in processes:
    process.terminate()