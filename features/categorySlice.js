import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  isStreambarOpen: false,
  category: "",
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    toggleSidebar: (state, action) => {
      state.isSidebarOpen = !state.isSidebarOpen;
      state.isStreambarOpen = false;
    },
    toggleStreambar: (state, action) => {
      state.isStreambarOpen = !state.isStreambarOpen;
      state.isSidebarOpen = false;
    },
    resetSidebars: (state, action) => {
      state.isStreambarOpen = false;
      state.isSidebarOpen = false;
    },
    getCategory: (state, action) => {
      state.category = action.payload;
    },
  },
});

export const { getCategory, toggleSidebar, toggleStreambar, resetSidebars } =
  categorySlice.actions;

export default categorySlice.reducer;
