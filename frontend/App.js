import React, { useState } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import SentenceDisplay from "./components/SentenceDisplay";
import RecordButton from "./components/RecordButton";
import FeedbackDisplay from "./components/FeedbackDisplay";

const App = () => {
  const [recognizedText, setRecognizedText] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <SentenceDisplay />
      <RecordButton onRecognizedText={setRecognizedText} />
      <FeedbackDisplay recognizedText={recognizedText} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
