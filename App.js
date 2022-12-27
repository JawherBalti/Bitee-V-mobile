import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import Content from "./components/Content";
import Stream from "./components/Stream";
import { store } from "./store";

const Stack = createNativeStackNavigator();

const myTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

function App() {
  return (
    <NavigationContainer theme={myTheme}>
      <Provider store={store}>
        <ImageBackground
          style={{ flexGrow: 1 }}
          source={require("./assets/bg.jpg")}
          resizeMode="cover"
        >
          <LinearGradient
            style={{ flexGrow: 1 }}
            colors={["#000000e6", "#00000080", "#000000e6"]}
          >
            <Stack.Navigator>
              <Stack.Screen name="Content" component={Content} />
              <Stack.Screen name="Stream" component={Stream} />
            </Stack.Navigator>
          </LinearGradient>
        </ImageBackground>
      </Provider>
    </NavigationContainer>
  );
}

export default App;
