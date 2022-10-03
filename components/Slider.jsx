import { useKeenSliderNative } from "keen-slider/react-native";
import { Button, Image, Text, View } from "react-native";

export default function Slider({ takenImages, linkImages }) {
  const slider = useKeenSliderNative({ slides: 6 });
  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          let currentIdx = slider.track.details.abs;
          if (currentIdx - 1 >= 0) slider.moveToIdx(currentIdx - 1);
        }}
        style={styles.button}
        title="Prev"
      />
      <View style={styles.slider} {...slider.containerProps}>
        {[...Array(6).keys()].map((item, index) => {
          return (
            <View key={index} {...slider.slidesProps[index]}>
              <View style={{ ...styles.slide, backgroundColor: colors[index] }}>
                {/* <Image source={{ uri: item }} style={styles.image} /> */}
                <Text style={styles.text}>Slide {index + 1}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <Button
        onPress={() => {
          let currentIdx = slider.track.details.abs;
          if (currentIdx + 1 <= 5) slider.moveToIdx(currentIdx + 1);
        }}
        style={styles.button}
        title="Next"
      />
    </View>
  );
}

const colors = [
  "#407CFE",
  "#FF6540",
  "#6AFC52",
  "#3FD2FA",
  "#FF3E5E",
  "#8A45FF",
];

const styles = {
  container: {
    width: "100%",
    height: "300%",
    marginLeft: "32px",
    marginRight: "32px",
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: "50px",
    height: "50px",
  },
  slider: {
    backgroundColor: "#fff",
    overflow: "hidden",
    width: "100%",
    height: "100%",
  },
  slide: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  text: {
    color: "white",
    fontSize: 30,
  },
};
