import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";

import unreadReducer from "./slices/unreadSlice";
import sellerUnreadReducer from "./slices/sellerUnreadSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,

    unread: unreadReducer,
    sellerUnread: sellerUnreadReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
