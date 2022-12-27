import React from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch, faBars } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { getSearchedChannel } from "../features/channelSlice";
import { toggleSidebar } from "../features/categorySlice";

function Header() {
  const dispatch = useDispatch();

  return (
    <View style={styles.header}>
      <Image style={styles.logo} source={require("../assets/logo.png")} />
      <View style={styles.input}>
        <TextInput
          style={styles.textInput}
          onChangeText={(e) => dispatch(getSearchedChannel(e))}
          placeholder="Find A Channel"
          placeholderTextColor="grey"
          keyboardType="default"
        />
        <FontAwesomeIcon icon={faSearch} color="#fff" />
      </View>
      <TouchableOpacity onPress={() => dispatch(toggleSidebar())}>
        <FontAwesomeIcon icon={faBars} color="#fff" size={35} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    padding: 10,
  },
  logo: {
    height: "100%",
    width: "12%",
  },
  input: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 15,
    height: 35,
    width: "55%",
  },
  textInput: {
    color: "#fff",
  },
});

export default Header;
