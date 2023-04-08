import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { Alert, Button, StyleSheet, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import isURL from "validator/lib/isURL";
import { ensureDirExist } from "../utils";

export default function InputLink({ setArrImage, ...props }) {
  const [input, setInput] = useState("");

  const handleSaveLink = async () => {
    try {
      if (isURL(input)) {
        const linkDir = FileSystem.documentDirectory + "linkImage/";
        const check = await ensureDirExist(linkDir, true);
        const linkUri = linkDir + "link.txt";
        let initData = "";
        if (check) {
          initData = await FileSystem.readAsStringAsync(linkUri);
        }
        await FileSystem.writeAsStringAsync(linkUri, initData + input + ",");
        setArrImage((prev) => [...prev, input]);
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
