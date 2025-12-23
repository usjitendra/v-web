import { configureStore } from "@reduxjs/toolkit";
import { apiMaster } from "./slices/apiMaster";
import { categoryApi } from "./slices/categoryApi"
import { subcategoryApi } from "./slices/subcategoryApi";

export const store = configureStore({
  reducer: {
    [apiMaster.reducerPath]: apiMaster.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [subcategoryApi.reducerPath]: subcategoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMaster.middleware, categoryApi.middleware, subcategoryApi.middleware),
  
});
