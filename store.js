import { configureStore } from "@reduxjs/toolkit";
import channelReducer from "./features/channelSlice";
import categoryReducer from "./features/categorySlice";

export const store = configureStore({
  reducer: {
    channel: channelReducer,
    category: categoryReducer,
  },
});
