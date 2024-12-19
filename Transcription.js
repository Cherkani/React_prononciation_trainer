import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, ImageBackground, TouchableOpacity, Animated } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const Transcription = () => {
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
              <View style={styles.innerCircle}>
                <Icon name="mic" size={80} color="#FFFAF0" />
              </View>
            </Animated.View>
          </TouchableOpacity>

          {/* Phrase text */}
          <Text style={styles.phraseText}>Phrase: Le ciel est bleu</Text>

          {/* Output text with validation */}
          <View style={styles.outputContainer}>
            <Text style={styles.outputText}>Le ciel est bleu</Text>
            {/* Validation Icons */}
            <View style={styles.validationIcons}>
              <TouchableOpacity onPress={handleNoSuccess}>
                <Icon name="close" size={40} color="#FF6347" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSuccess}>
                <Icon name="check" size={40} color="#32CD32" />
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
    backgroundColor: "#FF8C00", // Vibrant orange matching message container
  },
  innerCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFA07A", // Slightly softer orange for contrast
  },
  phraseText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  outputContainer: {
    backgroundColor: "#FFE4B5", // Light beige to match the background tones
    padding: 30,
    borderRadius: 15,
    width: "95%",
    maxWidth: 600,
    marginTop: 20,
    alignItems: "center",
  },
  outputText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  validationIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  messageContainer: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    backgroundColor: "#FF8C00", // Vibrant orange for the message container
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

export default Transcription;
