import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import MediaLibrary from "expo-media-library";
import FileSystem from "expo-file-system";
import { Camera, InputLink, Slider } from "./components";

export default function App() {
  const [linkImages, setLinkImages] = useState([]);
  const [takenImages, setTakenImages] = useState([]);
  const [openCamera, setOpenCamera] = useState(false);
  useEffect(() => {
    const ensureDirExist = async () => {
      const linkDir = FileSystem.cacheDirectory + "linkImage/";
      const dirInfo = await FileSystem.getInfoAsync(linkDir);
      if (!dirInfo.exists)
        await FileSystem.makeDirectoryAsync(linkDir, { intermediates: true });
    };
    setTakenImages(async () => {
      const album = await MediaLibrary.getAlbumAsync("ImageTaken");
      const imageFiles = await MediaLibrary.getAssetsAsync({
        album,
        mediaType: "photo",
      });
      return imageFiles.assets.map((asset) => asset.uri);
    });
    setLinkImages(async () => {
      const linkDir = FileSystem.documentDirectory + "linkImage/link.txt";
      ensureDirExist();
      const links = await FileSystem.readAsStringAsync(linkDir);
      return links.split(",");
    });
  }, []);
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <InputLink setLinkImages={setLinkImages} />
      <Button onPress={setOpenCamera} title="Open Camera" />
      {openCamera && <Camera setTakenImages={setTakenImages} />}
      <Slider linkImages={linkImages} takenImages={takenImages} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
