import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5"; // Correct import for FontAwesome5
import axios from "axios";

const SpeechToTextApp = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current sentence index
  const [message, setMessage] = useState(""); // State to hold the message
  const micScale = useRef(new Animated.Value(1)).current; // Animation scale for the mic
  const [frenchSentences, setFrenchSentences] = useState([]); // State for dynamic sentences
  const [recording, setRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [match, setMatch] = useState(false);
  const recognition = useRef(null);

  useEffect(() => {
    // Charger les phrases françaises depuis l'API
    axios
      .get("http://localhost:5000/get_sentence")
      .then((response) => {
        if (response.data && response.data.sentence) {
          setFrenchSentences([response.data.sentence]); // Stocker les phrases dans l'état
        } else {
          console.error("Réponse de l'API invalide:", response.data);
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des phrases:", error);
      });

    // Initialiser l'API Web Speech
    if (!("webkitSpeechRecognition" in window)) {
      alert("Désolé, votre navigateur ne supporte pas l'API Web Speech.");
    } else {
      recognition.current = new webkitSpeechRecognition();
      recognition.current.lang = "fr-FR"; // Définir la langue sur le français
      recognition.current.continuous = false;
      recognition.current.interimResults = false;

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedText(transcript);
        processAudio(transcript);
      };

      recognition.current.onerror = (event) => {
        console.error("Erreur lors de la reconnaissance vocale:", event.error);
      };
    }
  }, []);

  // Function to start the pulsating animation
  const startPulsating = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(micScale, {
          toValue: 1.2, // Scale up
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(micScale, {
          toValue: 1, // Scale down
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startPulsating(); // Start the animation when the component mounts
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % frenchSentences.length);
  };

  const handleMicPress = () => {
    if (recording) {
      // Arrêter l'enregistrement et traiter l'audio
      setRecording(false);
      recognition.current.stop();
    } else {
      // Démarrer l'enregistrement
      setRecording(true);
      recognition.current.start();
      startPulsating();
    }
  };

  const processAudio = (transcript) => {
    axios
      .post("http://localhost:5000/process_audio", {
        recognized_text: transcript,
        selected_sentence: frenchSentences[currentIndex],
      })
      .then((response) => {
        setFeedback(response.data.feedback);
        setMatch(response.data.match);
        setMessage(response.data.recognized_text);
      })
      .catch((error) => {
        console.error("Erreur lors du traitement de l'audio:", error);
      });
  };

  return (
    <View style={styles.container}>
      {frenchSentences.length > 0 ? (
        <Text style={styles.sentence}>{frenchSentences[currentIndex]}</Text>
      ) : (
        <Text style={styles.sentence}>Chargement des phrases...</Text>
      )}
      <TouchableOpacity onPress={handleNext} style={styles.button}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleMicPress} style={styles.micButton}>
        <Animated.View style={{ transform: [{ scale: micScale }] }}>
          <Icon name="microphone" size={30} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.feedback}>{feedback}</Text>
      <Text style={styles.recognizedText}>{recognizedText}</Text>
      <Text style={styles.match}>
        {match ? "Correspondance : Oui" : "Correspondance : Non"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  sentence: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  micButton: {
    padding: 20,
    backgroundColor: "#FF0000",
    borderRadius: 50,
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
  },
  feedback: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
  },
  recognizedText: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
  },
  match: {
    marginTop: 20,
    fontSize: 18,
    color: "#333",
  },
});

export default SpeechToTextApp;
