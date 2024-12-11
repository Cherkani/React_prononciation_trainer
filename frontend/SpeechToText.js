import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
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

  // Load the sentences from JSON on mount
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

  const handleRecord = () => {
    setMessage("Recording started...");
  };

  const handleNextSentence = () => {
    if (currentIndex < frenchSentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setMessage(""); // Clear the message when moving to the next sentence
    } else {
      setMessage("No more sentences available.");
    }
  };

  const handlePreviousSentence = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setMessage(""); // Clear the message when moving to the previous sentence
    } else {
      setMessage("This is the first sentence.");
    }
  };

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
      {/* Background with opacity */}
      <ImageBackground
        source={{
          uri: "https://marketplace.canva.com/EAF6DEqEaro/1/0/900w/canva-orange-white-cartoon-illustrative-funny-cat-phone-wallpaper-W05PU8BDltw.jpg",
        }}
        style={styles.background}
        imageStyle={{ opacity: 0.3 }}
      >
        <View style={styles.content}>
          {/* Microphone Button */}
          <TouchableOpacity
            style={styles.microphoneButton}
            onPress={handleMicPress}
          >
            <Animated.View
              style={[styles.outerCircle, { transform: [{ scale: micScale }] }]} // Apply animation to outer circle
            >
              <Icon name="microphone-alt" size={80} color="#FFFAF0" />{" "}
              {/* Correct icon */}
            </Animated.View>
          </TouchableOpacity>

          {/* Card for Sentence */}
          {frenchSentences.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardText}>
                {frenchSentences[currentIndex]}
              </Text>
            </View>
          )}

          {/* Navigation Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handlePreviousSentence}
            >
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNextSentence}
            >
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Message Display at Bottom */}
        {message !== "" && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}
        <Text style={styles.feedback}>{feedback}</Text>
        <Text style={styles.recognizedText}>{recognizedText}</Text>
        <Text style={styles.match}>
          {match ? "Correspondance : Oui" : "Correspondance : Non"}
        </Text>
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
  card: {
    backgroundColor: "#FFE4B5",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    maxWidth: 600,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  navButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  microphoneButton: {
    marginBottom: 30,
  },
  outerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF8C00",
  },
  messageContainer: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    backgroundColor: "#FF8C00",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
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
