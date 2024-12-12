import React, { useState, useRef } from "react";
import axios from "axios";
import "./RecordButton.css";

const RecordButton = ({ onRecognizedText }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  let recognition;

  if (!("webkitSpeechRecognition" in window)) {
    alert("Désolé, votre navigateur ne supporte pas l'API Web Speech.");
  } else {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function (event) {
      const audioText = event.results[0][0].transcript.trim().toLowerCase();
      document.getElementById(
        "recognizedText"
      ).innerText = `Texte reconnu : ${audioText}`;
      onRecognizedText(audioText);
      getFeedback(audioText);
    };

    recognition.onerror = function (event) {
      alert("Erreur lors de la reconnaissance vocale : " + event.error);
    };
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
      audioChunksRef.current = [];
    };
    mediaRecorderRef.current.start();
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    recognition.stop();
    setIsRecording(false);
  };

  const playAudio = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const getFeedback = async (recognizedText) => {
    try {
      const response = await axios.post("http://localhost:5003/feedback", {
        recognized_text: recognizedText,
        reference_phrase: document.getElementById("sentence").innerText,
      });
      console.log("Feedback:", response.data);
    } catch (error) {
      console.error("Error getting feedback:", error);
    }
  };

  return (
    <div className="record-button">
      <button
        onClick={startRecording}
        disabled={isRecording}
        className="button"
      >
        Commencer l'enregistrement
      </button>
      <button
        onClick={stopRecording}
        disabled={!isRecording}
        className="button"
      >
        Arrêter l'enregistrement
      </button>
      <button onClick={playAudio} disabled={!audioURL} className="button">
        Réécouter l'enregistrement
      </button>
    </div>
  );
};

export default RecordButton;
