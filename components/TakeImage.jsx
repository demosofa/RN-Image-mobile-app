import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";

export default function TakeImage({ setArrImage, openCamera, ...props }) {
  const CameraRef = useRef();
  const [type, setType] = useState(CameraType.back);

  useEffect(() => {
    const backhandler = BackHandler.addEventListener(
      "hardwareBackPress",
      function () {
        openCamera(false);
        return true;
      }
    );
    return () => backhandler.remove();
  }, []);

  const toggleCameraType = () => {
    setType((prev) =>
      prev === CameraType.back ? CameraType.front : CameraType.back
    );
  };
  const takePicture = async () => {
    try {
      let { uri } = await CameraRef.current.takePictureAsync();
      if (type == CameraType.front) {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          uri,
          [{ rotate: 180 }, { flip: ImageManipulator.FlipType.Vertical }],
          { compress: 1 }
        );
        uri = manipulatedImage.uri;
      }
      const asset = await MediaLibrary.createAssetAsync(uri);
      let album = await MediaLibrary.getAlbumAsync("ImageTaken");
      if (album == null)
        await MediaLibrary.createAlbumAsync("ImageTaken", asset, false);
      else await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      setArrImage((prev) => [...prev, uri]);
      openCamera(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Camera ref={CameraRef} type={type} {...props}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={toggleCameraType}
      >
        <View style={styles.button}>
          <Text style={styles.text}>Flip Camera</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonContainer}
        underlayColor={"white"}
        onPress={takePicture}
      >
        <View style={styles.button}>
          <Text style={styles.text}>Take Picture</Text>
        </View>
      </TouchableOpacity>
    </Camera>
  );
}

const styles = StyleSheet.create({
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
