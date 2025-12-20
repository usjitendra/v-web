import { configureStore } from "@reduxjs/toolkit";
import { apiMaster } from "./slices/apiMaster";
import { categoryApi } from "./slices/categoryApi"

export const store = configureStore({
  reducer: {
    [apiMaster.reducerPath]: apiMaster.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMaster.middleware, categoryApi.middleware),
  
});
