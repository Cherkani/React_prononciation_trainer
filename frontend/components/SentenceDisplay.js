import React, { useState } from "react";
import axios from "axios";
import "./SentenceDisplay.css";

const SentenceDisplay = () => {
  const [sentence, setSentence] = useState("");

  const getSentence = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get_sentence");
      console.log(response.data); // Vérifiez la réponse de l'API
      setSentence(response.data.sentence);
    } catch (error) {
      console.error("Error fetching sentence:", error);
    }
  };

  const readSentence = () => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "fr-FR"; // Définir la langue sur le français
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="sentence-display">
      <div id="sentence" className="sentence">
        {sentence || 'Cliquez sur "Obtenir une phrase" pour commencer'}
      </div>
      <button onClick={getSentence} className="button">
        Obtenir une phrase
      </button>
      <button onClick={readSentence} className="button">
        Écouter la phrase
      </button>
    </div>
  );
};

export default SentenceDisplay;
