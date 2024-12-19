import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import axios from "axios";

const FeedbackDisplay = ({ recognizedText }) => {
  const [feedback, setFeedback] = useState("");
  const [match, setMatch] = useState(false);

  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .replace(/\s{2,}/g, " ")
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
    <View style={styles.container}>
      <Text style={styles.feedback}>{feedback}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: 20,
  },
  feedback: {
    fontSize: 16,
    color: match ? "green" : "red",
  },
});

export default FeedbackDisplay;
