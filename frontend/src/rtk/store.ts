import { configureStore } from "@reduxjs/toolkit";
import { apiMaster } from "./slices/apiMaster";
import { categoryApi } from "./slices/categoryApi";
import { subcategoryApi } from "./slices/subcategoryApi";
import { doctorApi } from "./slices/doctorApi";
import { hospitalApi } from "./slices/hospitalApiSlice";

export const store = configureStore({
  reducer: {
    [apiMaster.reducerPath]: apiMaster.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [subcategoryApi.reducerPath]: subcategoryApi.reducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
    [hospitalApi.reducerPath]: hospitalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiMaster.middleware,
      categoryApi.middleware,
      subcategoryApi.middleware,
      doctorApi.middleware,
      hospitalApi.middleware
    ),
});
