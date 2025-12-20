import { configureStore } from "@reduxjs/toolkit";
import { apiMaster } from "./slices/apiMaster";

export const store = configureStore({
  reducer: {
    [apiMaster.reducerPath]: apiMaster.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMaster.middleware),
});
