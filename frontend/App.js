import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import SpeechToTextApp from "./SpeechToText"; // Import your SpeechToTextApp component
// import RandomWordsApp from "./RandomWordsApp";

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SpeechToTextApp />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF", // Optional: background color for the entire app
  },
});

export default App;
