import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { getStreamInfo } from "../features/channelSlice";

function Channels(props) {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const selectChannel = () => {
    props.streamInfo["countryName"] = props.countries.filter(
      (country) => country.code === props.streamInfo.country
    )[0].name;

    props.streamInfo["flag"] = props.countries.filter(
      (country) => country.code === props.streamInfo.country
    )[0].flag;

    props.streamInfo["url"] = props.streamUrl.filter(
      (stream) => stream.channel === props.streamInfo.id
    )[0]
      ? props.streamUrl.filter(
          (stream) => stream.channel === props.streamInfo.id
        )[0].url
      : "";

    dispatch(getStreamInfo(props.streamInfo));
    navigation.navigate("Stream");
  };

  return (
    <TouchableOpacity style={styles.channels} onPress={() => selectChannel()}>
      <View style={styles.channel}>
        <View style={styles.channelContainer}>
          <Image
            style={styles.channelLogo}
            resizeMode="contain"
            source={
              props.streamInfo.logo
                ? {
                    uri: props.streamInfo.logo,
                  }
                : require("../assets/noLogo.png")
            }
          />
        </View>
      </View>
      <Text style={styles.channelName}>
        {props.streamInfo.name.length > 22
          ? `${props.streamInfo.name.substring(0, 19)}...`
          : props.streamInfo.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  channels: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
    minWidth: 150,
    marginTop: 10,
  },
  channel: {
    width: 130,
    height: 70,
    position: "relative",
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  channelContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  channelLogo: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  channelName: {
    fontSize: 12,
    color: "#fff",
  },
});

export default Channels;
