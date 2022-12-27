import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";

function Pagination(props) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(props.totalItems / props.itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => {
    if (
      number < props.maxPageNumberLimit + 1 &&
      number > props.minPageNumberLimit
    ) {
      return (
        <TouchableOpacity
          key={number}
          style={[
            styles.pages,
            props.currentPage === number
              ? styles.activePage
              : styles.inactivePage,
          ]}
          onPress={() => props.paginate(number)}
        >
          <Text style={styles.pageNumber}>{number}</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  });

  return (
    <View style={styles.pagination}>
      <TouchableOpacity
        onPress={props.handlePrevbtn}
        disabled={props.currentPage === pageNumbers[0]}
        style={[
          styles.btn,
          props.currentPage === pageNumbers[0]
            ? styles.inactiveBtn
            : styles.activeBtn,
        ]}
      >
        <Text style={styles.btnText}>Prev</Text>
      </TouchableOpacity>
      {renderPageNumbers}
      <TouchableOpacity
        style={[
          styles.btn,
          props.currentPage === pageNumbers[pageNumbers.length - 1]
            ? styles.inactiveBtn
            : styles.activeBtn,
        ]}
        onPress={props.handleNextbtn}
        disabled={props.currentPage === pageNumbers[pageNumbers.length - 1]}
      >
        <Text style={styles.btnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 35,
    borderRadius: 5,
    borderColor: "grey",
    borderWidth: 1,
  },
  activeBtn: {
    backgroundColor: "#7c0000b4",
  },
  inactiveBtn: {
    backgroundColor: "#7c00006c",
  },
  btnText: {
    color: "#fff",
  },
  pages: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    marginRight: 5,
    height: 25,
    width: 25,
    borderRadius: 5,
    backgroundColor: "transparent",
    borderColor: "grey",
    borderWidth: 1,
  },
  activePage: {
    backgroundColor: "#7c0000b4",
  },
  inactivePage: {
    backgroundColor: "transparent",
  },
  pageNumber: {
    color: "#fff",
  },
});

export default Pagination;
