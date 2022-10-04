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
    }
  };
  return (
    <View {...props}>
      <TextInput value={input} onChangeText={setInput} />
      <Button onPress={handleSaveLink} title="Save Link" />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
