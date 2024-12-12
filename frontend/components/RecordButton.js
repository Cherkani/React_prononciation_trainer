import React, { useState } from "react";

const RecordButton = ({ onRecognizedText }) => {
  const [isRecording, setIsRecording] = useState(false);
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
    };

    recognition.onerror = function (event) {
      alert("Erreur lors de la reconnaissance vocale : " + event.error);
    };
  }

  const startRecording = () => {
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognition.stop();
    setIsRecording(false);
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>
        Commencer l'enregistrement
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Arrêter l'enregistrement
      </button>
    </div>
  );
};

export default RecordButton;