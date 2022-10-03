import { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
import Permission from "expo-permissions";
import FileSystem from "expo-file-system";
import isURL from "validator/lib/isURL";

export default function InputLink({ setLinkImages }) {
  const [input, setInput] = useState("");

  const handleSaveLink = async () => {
    const { status } = await Permission.askAsync(Permission.MEDIA_LIBRARY);
    if (isURL(input) && status === "granted") {
      const fileUri = FileSystem.documentDirectory + "linkImage/link.txt";
      await FileSystem.writeAsStringAsync(fileUri, input + ",");
      setLinkImages((prev) => [...prev, input]);
    }
  };
  return (
    <View style={styles.container}>
      <TextInput value={input} onChangeText={setInput} />
      <Button onPress={handleSaveLink} title="Save Link" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
