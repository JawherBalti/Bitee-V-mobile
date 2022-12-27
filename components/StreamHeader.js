import React from "react";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch, faBars } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { getSearchedChannel } from "../features/channelSlice";
import { toggleStreambar } from "../features/categorySlice";

function StreamHeader() {
  const dispatch = useDispatch();

  return (
    <View style={styles.header}>
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <TouchableOpacity onPress={() => dispatch(toggleStreambar())}>
        <FontAwesomeIcon icon={faBars} color="#fff" size={35} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: 360,
    padding: 10,
  },
  logo: {
    height: "100%",
    width: "12%",
    padding: 20,
    marginRight: "70%",
  },
});

export default StreamHeader;
