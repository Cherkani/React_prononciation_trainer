import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";

const SentenceDisplay = () => {
  const [sentence, setSentence] = useState("");

  const getSentence = async () => {
    try {
      const response = await axios.get("http://localhost:5000/get_sentence");
      setSentence(response.data.sentence);
    } catch (error) {
      console.error("Error fetching sentence:", error);
    }
  };

  const readSentence = () => {
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = "fr-FR";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <View style={styles.container}>
      <Text id="sentence" style={styles.sentence}>
        {sentence || 'Cliquez sur "Obtenir une phrase" pour commencer'}
      </Text>
      <Button title="Obtenir une phrase" onPress={getSentence} />
      <Button title="Écouter la phrase" onPress={readSentence} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: 20,
  },
  sentence: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default SentenceDisplay;
