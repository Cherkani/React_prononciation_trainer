import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";

const SentenceDisplay = ({ sentence, getSentence, readSentence }) => (
  <View style={styles.sentenceContainer}>
    <Text id="sentence" style={styles.sentence}>
      {sentence || 'Cliquez sur "Obtenir une phrase" pour commencer'}
    </Text>
    <Button title="Obtenir une phrase" onPress={getSentence} />
    <Button title="Écouter la phrase" onPress={readSentence} />
  </View>
);

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
    <View style={styles.recordButtonContainer}>
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
    <View style={styles.feedbackContainer}>
      <Text style={styles.feedbackText}>{feedback}</Text>
    </View>
  );
};

const SpeechToTextApp = () => {
  const [sentence, setSentence] = useState("");
  const [recognizedText, setRecognizedText] = useState("");
  const micScale = useRef(new Animated.Value(1)).current;

  const startPulsating = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(micScale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(micScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startPulsating();
  }, []);

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
      <ImageBackground
        source={{
          uri: "https://marketplace.canva.com/EAF6DEqEaro/1/0/900w/canva-orange-white-cartoon-illustrative-funny-cat-phone-wallpaper-W05PU8BDltw.jpg",
        }}
        style={styles.background}
        imageStyle={{ opacity: 0.3 }}
      >
        <View style={styles.content}>
          <TouchableOpacity style={styles.microphoneButton} onPress={() => {}}>
            <Animated.View
              style={[styles.outerCircle, { transform: [{ scale: micScale }] }]}
            >
              <Icon name="microphone-alt" size={80} color="#FFFAF0" />
            </Animated.View>
          </TouchableOpacity>
          <SentenceDisplay
            sentence={sentence}
            getSentence={getSentence}
            readSentence={readSentence}
          />
          <RecordButton onRecognizedText={setRecognizedText} />
          <FeedbackDisplay recognizedText={recognizedText} />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 100,
  },
  microphoneButton: {
    marginBottom: 50,
  },
  outerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF8C00",
  },
  sentenceContainer: {
    alignItems: "center",
    margin: 20,
  },
  sentence: {
    fontSize: 18,
    marginBottom: 10,
  },
  recordButtonContainer: {
    alignItems: "center",
    margin: 20,
  },
  feedbackContainer: {
    alignItems: "center",
    margin: 20,
  },
  feedbackText: {
    fontSize: 16,
    color: "#333",
  },
});

export default SpeechToTextApp;
