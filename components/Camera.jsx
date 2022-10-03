import { Camera, CameraType } from "expo-camera";
import MediaLibrary from "expo-media-library";
import { useRef, useState } from "react";
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";

export default function Camera({ setTakenImages }) {
  const CameraRef = useRef();
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
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
  const toggleCameraType = () => {
    setType((prev) =>
      prev === CameraType.back ? CameraType.front : CameraType.back
    );
  };
  const takePicture = () => {
    CameraRef.current.takePicTureAsync({
      onPictureSave: async (image) => {
        const asset = await MediaLibrary.createAssetAsync(image.uri);
        let album = await MediaLibrary.getAlbumAsync("ImageTaken");
        if (album == null)
          await MediaLibrary.createAlbumAsync("ImageTaken", asset, false);
        else await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        setTakenImages((prev) => [...prev, image.uri]);
      },
    });
  };
  return (
    <Camera ref={CameraRef} style={styles.camera} type={type}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={toggleCameraType}
      >
        <View style={styles.button}>
          <Text style={styles.text}>Flip Camera</Text>
        </View>
      </TouchableOpacity>
      <TouchableHighlight
        style={styles.buttonContainer}
        underlayColor={"white"}
        onPress={takePicture}
      >
        <View style={styles.button}>
          <Text style={styles.text}>Take Picture</Text>
        </View>
      </TouchableHighlight>
    </Camera>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
