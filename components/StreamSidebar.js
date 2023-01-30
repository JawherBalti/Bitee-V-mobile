import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { resetSidebars } from "../features/categorySlice";

let moveAnimation = new Animated.Value(0);

const StreamSidebar = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const streamInfo = useSelector((state) => state.channel.streamInfo);
  const isStreambarOpen = useSelector(
    (state) => state.category.isStreambarOpen
  );

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    getFavoriteChannels();
  }, []);

  useEffect(() => {
    inFavorite();
  }, [streamInfo.name]);

  useEffect(() => {
    if (isStreambarOpen) {
      openSidebarAnimation();
    }
    if (!isStreambarOpen) {
      closeSidebarAnimation();
    }
  }, [isStreambarOpen]);

  const goBack = () => {
    dispatch(resetSidebars());
    navigation.navigate("Content");
  };

  const addToFavorites = async (channelObj) => {
    const data = await AsyncStorage.getItem("@rn-iptv:favorites");
    const favoritesList = JSON.parse(data);
    let channelExist = favoritesList.find((ch) => ch.name === channelObj.name);
    if (!channelExist) {
      favoritesList.push(channelObj);
      setFavoriteChannels(favoritesList);
      setIsFavorite(true);
    } else {
      setFavoriteChannels(favoritesList);
    }
  };

  const removeFromFavorites = async () => {
    const data = await AsyncStorage.getItem("@rn-iptv:favorites");
    const favoritesList = JSON.parse(data);
    const index = favoritesList
      .map((favorite) => favorite.name)
      .indexOf(streamInfo.name);
    favoritesList.splice(index, 1);
    setFavoriteChannels(favoritesList);
    setIsFavorite(false);
  };

  const setFavoriteChannels = async (channels) => {
    try {
      await AsyncStorage.setItem(
        "@rn-iptv:favorites",
        JSON.stringify(channels)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getFavoriteChannels = async () => {
    try {
      JSON.parse(await AsyncStorage.getItem("@rn-iptv:favorites"));
    } catch (err) {
      console.log(err);
    }
  };

  const inFavorite = async () => {
    const data = await AsyncStorage.getItem("@rn-iptv:favorites");
    const favoritesList = JSON.parse(data);
    favoritesList.some((favorite) => favorite.name === streamInfo.name)
      ? setIsFavorite(true)
      : setIsFavorite(false);
  };

  const openSidebarAnimation = () => {
    Animated.timing(moveAnimation, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebarAnimation = () => {
    Animated.timing(moveAnimation, {
      toValue: -Dimensions.get("window").width / 2,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <Animated.View style={[styles.streamSidebar, styles.openAnimation]}>
        <LinearGradient
          style={{ flexGrow: 1 }}
          colors={["rgb(0, 0, 0)", "rgba(38, 38, 38, 0.749)", "rgb(0, 0, 0)"]}
        >
          <ScrollView>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => goBack()}
              delayPressIn={5}
              delayPressOut={5}
              delayLongPress={5}
            >
              <FontAwesomeIcon icon={faChevronLeft} style={styles.backIcon} />
              <Text
                style={{
                  color: "#fff",
                }}
              >
                Back
              </Text>
            </TouchableOpacity>
            {isFavorite ? (
              <TouchableOpacity
                style={styles.favoriteBtn}
                onPress={removeFromFavorites}
              >
                <FontAwesomeIcon icon={faStar} color="yellow" size={15} />
                <Text style={styles.favoriteText}>Remove From Favorites</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.favoriteBtn}
                onPress={() => addToFavorites(streamInfo)}
              >
                <FontAwesomeIcon icon={faStar} color="#fff" size={15} />
                <Text style={styles.favoriteText}>Add To Favorites</Text>
              </TouchableOpacity>
            )}
            <Text
              style={{
                color: "#fff",
                padding: 10,
              }}
            >
              Channel Name:
            </Text>
            <Text
              style={{
                color: "#fff",
                padding: 10,
                fontSize: 11,
                marginLeft: 10,
              }}
            >
              {streamInfo.name}
            </Text>
            <Text
              style={{
                color: "#fff",
                padding: 10,
              }}
            >
              Country:
            </Text>
            <Text
              style={{
                color: "#fff",
                padding: 10,
                fontSize: 11,
                marginLeft: 10,
              }}
            >
              {streamInfo.flag} {" " + streamInfo.countryName}
            </Text>

            <Text
              style={{
                color: "#fff",
                padding: 10,
              }}
            >
              Languages:
            </Text>
            {streamInfo.languages?.map((language) => (
              <Text
                key={language}
                style={{
                  color: "#fff",
                  padding: 10,
                  fontSize: 11,
                  marginLeft: 10,
                }}
              >
                {language.toUpperCase()}
              </Text>
            ))}
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  backBtn: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
  },
  favoriteBtn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7c00006c",
    padding: 10,
  },
  favoriteText: {
    color: "#fff",
    fontSize: 11,
    marginLeft: 10,
  },
  backIcon: { color: "#fff", padding: 10 },
  streamSidebar: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width / 2,
    flex: 1,
    position: "absolute",
    zIndex: 99,
  },
  openAnimation: {
    transform: [
      {
        translateX: moveAnimation,
      },
    ],
  },
});

export default StreamSidebar;
