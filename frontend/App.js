import React, { useState } from "react";
import "./App.css";
import SentenceDisplay from "./components/SentenceDisplay";
import RecordButton from "./components/RecordButton";
import FeedbackDisplay from "./components/FeedbackDisplay";

const App = () => {
  const [recognizedText, setRecognizedText] = useState("");

  return (
    <div className="container">
      <div className="background">
        <div className="content">
          <SentenceDisplay />
          <RecordButton onRecognizedText={setRecognizedText} />
          <FeedbackDisplay recognizedText={recognizedText} />
        </div>
      </div>
    </div>
  );
};

export default App;
