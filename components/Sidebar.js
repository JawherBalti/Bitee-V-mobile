import React, { useEffect, useState } from "react";
import {
  Animated,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getCategory } from "../features/categorySlice";
import { LinearGradient } from "expo-linear-gradient";
import { getSearchedChannel } from "../features/channelSlice";

let moveAnimation = new Animated.Value(0);

function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-2);

  const isSidebarOpen = useSelector((state) => state.category.isSidebarOpen);

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("https://iptv-org.github.io/api/categories.json")
      .then((res) =>
        setCategories(res.data.filter((category) => category.name !== "XXX"))
      );
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      openSidebarAnimation();
    }
    if (!isSidebarOpen) {
      closeSidebarAnimation();
    }
  }, [isSidebarOpen]);

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

  const selectedCategory = (index, category) => {
    setSelectedIndex(index);
    dispatch(getSearchedChannel(""));
    dispatch(getCategory(category));
  };

  return (
    <>
      <Animated.View style={[styles.sidebar, styles.openAnimation]}>
        <LinearGradient
          colors={["rgb(0, 0, 0)", "rgba(38, 38, 38, 0.749)", "rgb(0, 0, 0)"]}
        >
          <ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor:
                  selectedIndex === -2 ? "#7c00006c" : "transparent",
              }}
              delayPressIn={5}
              delayPressOut={5}
              delayLongPress={5}
              onPress={() => selectedCategory(-2, "All")}
            >
              <Text style={styles.text}>All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor:
                  selectedIndex === -1 ? "#7c00006c" : "transparent",
              }}
              delayPressIn={5}
              delayPressOut={5}
              delayLongPress={5}
              onPress={() => selectedCategory(-1, "Favorites")}
            >
              <Text style={styles.text}>Favorites</Text>
            </TouchableOpacity>
            {categories.map((item, index) => (
              <TouchableOpacity
                key={item.name}
                style={{
                  backgroundColor:
                    selectedIndex === index ? "#7c00006c" : "transparent",
                }}
                onPress={() => selectedCategory(index, item.name)}
              >
                <Text style={styles.text}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width / 2,
    flex: 1,
    position: "absolute",
    zIndex: 99,
    paddingBottom: 13,
  },
  text: {
    color: "#fff",
    padding: 10,
  },

  openAnimation: {
    transform: [
      {
        translateX: moveAnimation,
      },
    ],
  },
});
export default Sidebar;
