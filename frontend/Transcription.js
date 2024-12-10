import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, Animated, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5"; // Correct import for FontAwesome5

const SpeechToTextApp = () => {
  const [message, setMessage] = useState(""); // State to hold the message
  const micScale = useRef(new Animated.Value(1)).current; // Animation scale for the mic

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

  const handleNoSuccess = () => {
    setMessage("No success message");
  };

  const handleSuccess = () => {
    setMessage("Success message");
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
          {/* Microphone button */}
          <TouchableOpacity style={styles.microphoneButton} onPress={handleRecord}>
            <Animated.View
              style={[styles.outerCircle, { transform: [{ scale: micScale }] }]} // Apply animation to outer circle
            >
              <Icon name="microphone-alt" size={80} color="#FFFAF0" /> {/* Correct icon */}
            </Animated.View>
          </TouchableOpacity>

          {/* Phrase text */}
          <Text style={styles.phraseText}>Phrase: Le ciel est bleu</Text>

          {/* Output text with validation */}
          <View style={styles.outputContainer}>
            <Text style={styles.outputText}>Le ciel est bleu</Text>
            <View style={styles.iconRow}>
              <TouchableOpacity onPress={handleNoSuccess} style={styles.iconContainer}>
                <Image
                  source={require("./assets/icons/erreur.png")} // Path to error image
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSuccess} style={styles.iconContainer}>
                <Image
                  source={require("./assets/icons/verifie.png")} // Path to success image
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Message Display at Bottom */}
        {message !== "" && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        )}
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
  phraseText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  outputContainer: {
    backgroundColor: "#FFE4B5",
    padding: 20,
    borderRadius: 15,
    width: "95%",
    maxWidth: 600,
    marginTop: 20,
    alignItems: "center",
  },
  outputText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10, // Add space between text and icons
  },
  iconRow: {
    flexDirection: "row", // Align icons horizontally
    justifyContent: "space-between", // Spread icons evenly
    width: "80%", // Set width for alignment
    marginTop: 10, // Add space between text and icons
  },
  iconContainer: {
    alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
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
});

export default SpeechToTextApp;
