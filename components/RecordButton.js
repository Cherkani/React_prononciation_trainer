import React, { useState, useRef } from "react";
import { View, Button, StyleSheet } from "react-native";
import axios from "axios";

const RecordButton = ({ onRecognizedText }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
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
      onRecognizedText(audioText);
      getFeedback(audioText);
    };

    recognition.onerror = function (event) {
      alert("Erreur lors de la reconnaissance vocale : " + event.error);
    };
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
      audioChunksRef.current = [];
    };
    mediaRecorderRef.current.start();
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    recognition.stop();
    setIsRecording(false);
  };

  const playAudio = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const getFeedback = async (recognizedText) => {
    try {
      const response = await axios.post("http://localhost:5003/feedback", {
        recognized_text: recognizedText,
        reference_phrase: document.getElementById("sentence").innerText,
      });
      console.log("Feedback:", response.data);
    } catch (error) {
      console.error("Error getting feedback:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Commencer l'enregistrement"
        onPress={startRecording}
        disabled={isRecording}
      />
      <Button
        title="Arrêter l'enregistrement"
        onPress={stopRecording}
        disabled={!isRecording}
      />
      <Button
        title="Réécouter l'enregistrement"
        onPress={playAudio}
        disabled={!audioURL}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    margin: 20,
  },
});

export default RecordButton;
