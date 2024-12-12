import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FeedbackDisplay.css";

const FeedbackDisplay = ({ recognizedText }) => {
  const [feedback, setFeedback] = useState("");
  const [match, setMatch] = useState(false);

  const normalizeText = (text) => {
    return text
      .normalize("NFD") // Normaliser les caractères accentués
      .replace(/[\u0300-\u036f]/g, "") // Supprimer les diacritiques
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // Supprimer la ponctuation et les tirets
      .replace(/\s{2,}/g, " ") // Remplacer les espaces multiples par un seul espace
      .trim()
      .toLowerCase();
  };

  const compareText = async () => {
    try {
      const response = await axios.post("http://localhost:5003/feedback", {
        recognized_text: normalizeText(recognizedText),
        reference_phrase: normalizeText(
          document.getElementById("sentence").innerText
        ),
      });
      setFeedback(response.data.feedback.join("\n"));
      setMatch(response.data.match);
    } catch (error) {
      console.error("Error comparing text:", error);
    }
  };

  useEffect(() => {
    if (recognizedText) {
      compareText();
    }
  }, [recognizedText]);

  return (
    <div className="feedback-display">
      <div id="feedback" className="feedback">
        {match ? "Correspondance : Oui" : "Correspondance : Non"}
      </div>
      <div id="recognizedText" className="recognized-text"></div>
      <div id="correctText" className="correct-text"></div>
      <div id="comparison" className="comparison">
        {feedback}
      </div>
    </div>
  );
};

export default FeedbackDisplay;
