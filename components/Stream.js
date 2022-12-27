import React, { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import StreamHeader from "./StreamHeader";
import StreamSidebar from "./StreamSidebar";
import { Video } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";

const Stream = () => {
  const [streamError, setStreamError] = useState(false);

  const streamInfo = useSelector((state) => state.channel.streamInfo);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const setOrientation = () => {
    if (Dimensions.get("window").height > Dimensions.get("window").width) {
      //Device is in portrait mode
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      //Device is in landscape mode
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  };

  return (
    <SafeAreaView style={styles.streamContainer}>
      <StreamSidebar />
      <View style={styles.stream}>
        <StreamHeader />
        {streamError ? (
          <Text style={styles.streamError}>Stream Not Available!</Text>
        ) : (
          <Video
            style={styles.video}
            source={{ uri: streamInfo.url }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            shouldPlay
            isLooping
            useNativeControls
            resizeMode="contain"
            onFullscreenUpdate={setOrientation}
            onError={(err) => setStreamError(true)}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  streamContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  stream: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
  streamError: {
    color: "#fff",
    marginTop: 150,
  },
  video: {
    marginTop: 10,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 3,
  },
  channels: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: "auto",
    flexWrap: "wrap",
  },
});

export default Stream;
