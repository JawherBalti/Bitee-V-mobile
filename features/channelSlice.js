import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  streamInfo: {},
  searchedChannel: "",
};

export const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    getSearchedChannel: (state, action) => {
      state.searchedChannel = action.payload;
    },
    getStreamInfo: (state, action) => {
      state.streamInfo = action.payload;
    },
  },
});

export const { getStreamInfo, getSearchedChannel } = channelSlice.actions;

export default channelSlice.reducer;
