import React, { useState } from "react";
import axios from "axios";

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

  return (
    <div>
      <div id="sentence">
        {sentence || 'Cliquez sur "Obtenir une phrase" pour commencer'}
      </div>
      <button onClick={getSentence}>Obtenir une phrase</button>
    </div>
  );
};

export default SentenceDisplay;
