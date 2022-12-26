import { useEffect, useMemo, useState } from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Camera } from "expo-camera";
import { TakeImage, InputLink, Slider } from "./components";
import { ensureDirExist } from "./utils";

export default function App() {
  const [cameraPermission, requestCameraPermission] =
    Camera.useCameraPermissions({ request: true });
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions(
    { request: true }
  );
  const [arrImage, setArrImage] = useState([]);
  const [openCamera, setOpenCamera] = useState(false);

  const handleOpenCamera = async () => {
    if (!cameraPermission.granted) await requestCameraPermission();
    if (!mediaPermission.granted) await requestMediaPermission();
    setOpenCamera((prev) => !prev);
  };
  useEffect(() => {
    const runEffect = async () => {
      try {
        // const linkDir = FileSystem.documentDirectory + "linkImage/link.txt";
        // await FileSystem.deleteAsync(linkDir);
        // const dirInfo = await FileSystem.getInfoAsync(linkDir);
        // console.log(dirInfo);

        const linkImageArr = async () => {
          const linkDir = FileSystem.documentDirectory + "linkImage/";
          const linkUri = linkDir + "link.txt";
          const check = await ensureDirExist(linkUri);
          if (!check) return [];
          const links = await FileSystem.readAsStringAsync(linkUri);
          const uriArr = links.split(",").filter((value) => value !== "");
          return uriArr;
        };
        result = await linkImageArr();
        setArrImage(result);

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
        if (mediaPermission && mediaPermission.granted) {
          let result = await takenImageArr();
          setArrImage(result);
        }
      } catch (error) {
        console.log(error);
      }
    };
    runEffect();
  }, [mediaPermission]);

  if (openCamera && cameraPermission.granted && mediaPermission.granted)
    return (
      <TakeImage
        style={styles.camera}
        setArrImage={setArrImage}
        openCamera={setOpenCamera}
      />
    );
  return (
    <View style={styles.container}>
      <InputLink style={styles.inputContainer} setArrImage={setArrImage} />
      {arrImage.length ? (
        <Slider style={styles.slideContainer} arrImage={arrImage} />
      ) : (
        <Text>There is any image to display</Text>
      )}
      <Button onPress={handleOpenCamera} title="Open Camera" />
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
