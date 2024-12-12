import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import axios from "axios";

const RandomWordsApp = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getNextWord = () => {
    if (words.length > 0) {
      const nextIndex = (currentIndex + 1) % words.length;
      setCurrentIndex(nextIndex);
      setCurrentWord(words[nextIndex]);
      console.log("Next word:", words[nextIndex]); // Log the next word
    }
  };

  useEffect(() => {
    // Charger les mots depuis l'API
    axios
      .get("http://localhost:5000/get_sentences") // Assurez-vous que l'API renvoie plusieurs phrases
      .then((response) => {
        if (response.data && response.data.sentences) {
          setWords(response.data.sentences); // Stocker les mots dans l'état
          console.log("Words loaded:", response.data.sentences); // Log the loaded words
          setCurrentWord(response.data.sentences[0]); // Afficher le premier mot après le chargement
        } else {
          console.error("Réponse de l'API invalide:", response.data);
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des mots:", error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.word}>{currentWord}</Text>
      <TouchableOpacity style={styles.button} onPress={getNextWord}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  word: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF8C00",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RandomWordsApp;
