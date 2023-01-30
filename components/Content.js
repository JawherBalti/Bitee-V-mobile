import React, { useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";
import Spinner from "react-native-loading-spinner-overlay";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Channels from "./Channels";
import Pagination from "./Pagination";
import { getSearchedChannel } from "../features/channelSlice";

function Content() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [streams, setStreams] = useState([]);
  const [streamUrls, setStreamUrls] = useState([]);
  const [countries, setCountries] = useState([]);
  const [searchedChannels, setSearchedChannels] = useState([]);
  const [filterededChannels, setFilteredChannels] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [channelsPerPage] = useState(10);
  const [itemsList, setItemsList] = useState(0);
  const [pageNumberLimit] = useState(5);
  const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
  const [minPageNumberLimit, setminPageNumberLimit] = useState(0);

  const searchedChannel = useSelector((state) => state.channel.searchedChannel);
  const category = useSelector((state) => state.category.category);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const lastOrder = currentPage * channelsPerPage;
  const firstOrder = lastOrder - channelsPerPage;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    if (isFocused) {
      getFavoriteChannels();
    }
  }, [isFocused]);

  useEffect(() => {
    if (!searchedChannel) {
      setItemsList(streams.length);
    } else {
      paginate(1);
      setItemsList(
        streams.filter((stream) =>
          stream.name.toLowerCase().includes(searchedChannel)
        ).length
      );
      setSearchedChannels(
        streams.filter((stream) =>
          stream.name.toLowerCase().includes(searchedChannel)
        )
      );
    }
  }, [searchedChannel]);

  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = () => {
    setLoading(true);
    setError(false);
    dispatch(getSearchedChannel(""));

    axios
      .get("https://iptv-org.github.io/api/streams.json")
      .then((res) => setStreamUrls(res.data))
      .catch((err) => console.log(err));

    axios
      .get("https://iptv-org.github.io/api/countries.json      ")
      .then((res) => setCountries(res.data))
      .catch((err) => console.log(err));

    axios
      .get("https://iptv-org.github.io/api/channels.json")
      .then((res) => {
        setLoading(false);
        setStreams(
          res.data.filter((stream) =>
            stream.categories.some((cat) => cat !== "xxx")
          )
        );
        if (category !== "") dispatch(getSearchedChannel(""));
        if (category === "Favorites") {
          setFilteredChannels(favorites);
        } else {
          setFilteredChannels(
            res.data.filter((stream) =>
              stream.categories.some((cat) => cat === category.toLowerCase())
            )
          );
        }

        setItemsList(
          res.data.filter((stream) =>
            stream.categories.some((cat) => cat !== "xxx")
          ).length
        );

        if (category === "" || category === "All") {
          setItemsList(
            res.data.filter((stream) =>
              stream.categories.some((cat) => cat !== "xxx")
            ).length
          );
        } else if (category === "Favorites") setItemsList(favorites.length);
        else
          setItemsList(
            res.data.filter((stream) =>
              stream.categories.some((cat) => cat === category.toLowerCase())
            ).length
          );
      })
      .catch((err) => setError(true));
    paginate(1);
    setminPageNumberLimit(0);
    setmaxPageNumberLimit(5);
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
      const value = JSON.parse(
        await AsyncStorage.getItem("@rn-iptv:favorites")
      );
      if (value) {
        setFavoriteChannels(value);
        setFavorites(value);
      } else {
        setFavoriteChannels([]);
        setFavorites([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextbtn = () => {
    setCurrentPage(currentPage + 1);

    if (currentPage + 1 > maxPageNumberLimit) {
      setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };

  const handlePrevbtn = () => {
    setCurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit === 0) {
      setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };

  return (
    <SafeAreaView style={styles.contentContainer}>
      {error ? (
        <View style={styles.errorContent}>
          <Text style={styles.text}>
            Check Your Internet Connection And Try Again!
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
            <Text style={styles.text}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Sidebar />
          <View style={styles.content}>
            <Header />
            {!loading ? (
              <>
                {!searchedChannel ? (
                  <View style={styles.channels}>
                    {category === "" || category === "All" ? (
                      <>
                        {streams.slice(firstOrder, lastOrder).map((stream) => (
                          <Channels
                            key={stream.id}
                            streamInfo={stream}
                            streamUrl={streamUrls}
                            countries={countries}
                          />
                        ))}
                      </>
                    ) : category === "Favorites" ? (
                      <View style={styles.channels}>
                        {filterededChannels
                          .slice(firstOrder, lastOrder)
                          .map((stream) => (
                            <Channels
                              key={stream.id}
                              streamInfo={stream}
                              streamUrl={streamUrls}
                              countries={countries}
                            />
                          ))}
                      </View>
                    ) : (
                      <View style={styles.channels}>
                        {filterededChannels
                          .slice(firstOrder, lastOrder)

                          .filter(
                            (stream) =>
                              stream.categories.length &&
                              stream.categories.some(
                                (cat) => cat === category.toLowerCase()
                              )
                          )
                          .map((stream) => (
                            <Channels
                              key={stream.id}
                              streamInfo={stream}
                              streamUrl={streamUrls}
                              countries={countries}
                            />
                          ))}
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={styles.channels}>
                    {searchedChannels
                      .slice(firstOrder, lastOrder)
                      .filter((stream) => {
                        return (
                          stream.name
                            .toLowerCase()
                            .indexOf(searchedChannel.toLowerCase()) !== -1
                        );
                      })
                      .map((stream) => (
                        <Channels
                          key={stream.id}
                          streamInfo={stream}
                          streamUrl={streamUrls}
                          countries={countries}
                        />
                      ))}
                  </View>
                )}
              </>
            ) : (
              <View style={styles.errorContent}>
                <Spinner
                  textContent="Loading"
                  visible={loading}
                  color="#7c0000ff"
                  textStyle={styles.text}
                />
              </View>
            )}
            <Pagination
              itemsPerPage={channelsPerPage}
              totalItems={itemsList}
              paginate={paginate}
              currentPage={currentPage}
              maxPageNumberLimit={maxPageNumberLimit}
              minPageNumberLimit={minPageNumberLimit}
              handleNextbtn={handleNextbtn}
              handlePrevbtn={handlePrevbtn}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
  errorContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  showBar: {
    position: "absolute",
    display: "flex",
    zIndex: 99,
  },
  hideBar: {
    position: "absolute",
    display: "none",
    zIndex: 99,
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
  text: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
  retryBtn: {
    backgroundColor: "#7c0000ff",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default Content;
