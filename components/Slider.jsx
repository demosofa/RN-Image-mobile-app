import { useKeenSliderNative } from "keen-slider/react-native";
import { Button, Image, View } from "react-native";

export default function Slider({ arrImage, ...props }) {
  const slider = useKeenSliderNative({
    slides: arrImage.length,
  });
  return (
    <View {...props}>
      <Button onPress={slider.prev} style={styles.button} title="Prev" />
      <View style={styles.slider} {...slider.containerProps}>
        {arrImage.map((uri, index) => (
          <View key={uri + index} {...slider.slidesProps[index]}>
            <Image source={{ uri }} style={styles.slide} />
          </View>
        ))}
      </View>
      <Button onPress={slider.next} style={styles.button} title="Next" />
    </View>
  );
}

const styles = {
  button: {
    flex: 1,
    width: 50,
    height: 50,
  },
  slider: {
    flex: 4,
    height: "80%",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  slide: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  text: {
    color: "white",
    fontSize: 30,
  },
};
