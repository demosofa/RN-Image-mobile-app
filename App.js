import { useEffect, useMemo, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { TakeImage, InputLink, Slider } from "./components";

export default function App() {
  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const [linkImages, setLinkImages] = useState([]);
  const [takenImages, setTakenImages] = useState([]);
  const [openCamera, setOpenCamera] = useState(false);
  const arrImage = useMemo(
    () => [...linkImages, ...takenImages],
    [linkImages, takenImages]
  );
  useEffect(() => {
    const runEffect = async () => {
      try {
        const takenImageArr = async () => {
          let album = await MediaLibrary.getAlbumAsync("ImageTaken");
          if (!album) return [];
          const imageFiles = await MediaLibrary.getAssetsAsync({
            album,
            mediaType: "photo",
          });
          const uriArr = imageFiles.assets.map((asset) => asset.uri);
          return uriArr;
        };
        let result = await takenImageArr();
        setTakenImages(result);

        // const linkDir = FileSystem.documentDirectory + "linkImage/link.txt";
        // await FileSystem.deleteAsync(linkDir);
        // const dirInfo = await FileSystem.getInfoAsync(linkDir);
        // console.log(dirInfo);

        const ensureDirExist = async () => {
          const linkDir = FileSystem.documentDirectory + "linkImage/";
          const dirInfo = await FileSystem.getInfoAsync(linkDir);
          if (!dirInfo.exists)
            await FileSystem.makeDirectoryAsync(linkDir, {
              intermediates: true,
            });
        };
        const linkImageArr = async () => {
          const linkDir = FileSystem.documentDirectory + "linkImage/link.txt";
          ensureDirExist();
          const links = await FileSystem.readAsStringAsync(linkDir);
          const uriArr = links.split(",").filter((value) => value !== "");
          return uriArr;
        };
        result = await linkImageArr();
        setLinkImages(result);
      } catch (error) {
        Alert.alert(error.message);
      }
    };
    runEffect();
  }, []);

  console.log(linkImages);

  if (!permission) return null;
  if (!permission.granted)
    return (
      <View>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  if (permission.granted && openCamera)
    return (
      <TakeImage
        style={styles.camera}
        setTakenImages={setTakenImages}
        openCamera={setOpenCamera}
      />
    );
  return (
    <View style={styles.container}>
      <InputLink style={styles.inputContainer} setLinkImages={setLinkImages} />
      {arrImage.length ? (
        <Slider style={styles.slideContainer} arrImage={arrImage} />
      ) : (
        <Text>There is any image to display</Text>
      )}
      <Button
        onPress={() => setOpenCamera((prev) => !prev)}
        title="Open Camera"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flex: 1,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  slideContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
});
