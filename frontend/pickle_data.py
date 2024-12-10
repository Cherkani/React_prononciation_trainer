import pickle
import pandas as pd
import json

# Load the .pickle file
with open("C:\\Users\\lenovo\\Downloads\\updated_data_de_en_fr.pickle", "rb") as pickle_file:
    data = pickle.load(pickle_file)

# Check if the data is a DataFrame
if isinstance(data, pd.DataFrame):
    # Filter only the French sentences (assuming the column is named 'French')
    if 'fr_sentence' in data.columns:
        french_sentences = data['fr_sentence'].dropna().tolist()  # Drop NaN values and convert to list
    else:
        raise ValueError("The column 'French' does not exist in the DataFrame.")
else:
    raise TypeError("The loaded data is not a DataFrame.")

# Save the French sentences as JSON
with open("french_sentences.json", "w", encoding="utf-8") as json_file:
    json.dump(french_sentences, json_file, ensure_ascii=False, indent=4)

print("Conversion complete. Saved French sentences as french_sentences.json.")
