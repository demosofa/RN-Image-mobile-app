import { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import * as FileSystem from "expo-file-system";
import Toast from "react-native-toast-message";
import isURL from "validator/lib/isURL";

export default function InputLink({ setLinkImages, ...props }) {
  const [input, setInput] = useState("");

  const handleSaveLink = async () => {
    try {
      if (isURL(input)) {
        const fileUri = FileSystem.documentDirectory + "linkImage/link.txt";
        const prevData = await FileSystem.readAsStringAsync(fileUri);
        await FileSystem.writeAsStringAsync(fileUri, prevData + input + ",");
        setLinkImages((prev) => [...prev, input]);
        setInput("");
      } else
        Toast.show({ type: "error", text1: "This input is not like an URL" });
    } catch (error) {
      Alert.alert("Error", error.message);
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
