import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import * as FileSystem from "expo-file-system";
import isURL from "validator/lib/isURL";

export default function InputLink({ setLinkImages, ...props }) {
  const [input, setInput] = useState("");

  const handleSaveLink = async () => {
    if (isURL(input)) {
      const fileUri = FileSystem.documentDirectory + "linkImage/link.txt";
      await FileSystem.writeAsStringAsync(fileUri, input + ",");
      setLinkImages((prev) => [...prev, input]);
      setInput("");
    }
  };
  return (
    <View {...props}>
      <TextInput style={styles.input} value={input} onChangeText={setInput} />
      <Button onPress={handleSaveLink} title="Save Link" />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    margin: 8,
  },
});
