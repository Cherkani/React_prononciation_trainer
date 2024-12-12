import React, { useState } from "react";
import axios from "axios";

const FeedbackDisplay = ({ recognizedText }) => {
  const [feedback, setFeedback] = useState("");
  const [match, setMatch] = useState(false);

  const compareText = async () => {
    try {
      const response = await axios.post("http://localhost:5003/feedback", {
        recognized_text: recognizedText,
        reference_phrase: document.getElementById("sentence").innerText,
      });
      setFeedback(response.data.feedback.join("\n"));
      setMatch(response.data.match);
    } catch (error) {
      console.error("Error comparing text:", error);
    }
  };

  React.useEffect(() => {
    if (recognizedText) {
      compareText();
    }
  }, [recognizedText]);

  return (
    <div>
      <div id="feedback">
        {match ? "Correspondance : Oui" : "Correspondance : Non"}
      </div>
      <div id="recognizedText"></div>
      <div id="correctText"></div>
      <div id="comparison">{feedback}</div>
    </div>
  );
};

export default FeedbackDisplay;
