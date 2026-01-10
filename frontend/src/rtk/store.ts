import { configureStore } from "@reduxjs/toolkit";
import { apiMaster } from "./slices/apiMaster";
import { categoryApi } from "./slices/categoryApi";
import { subcategoryApi } from "./slices/subcategoryApi";
import { doctorApi } from "./slices/doctorApi";
import { hospitalApi } from "./slices/hospitalApiSlice";
import { commanApiSlice } from "./slices/commanApiSlice";
import { dropdownApi } from "./slices/dropdownApiSlice";
import { bookingApi } from "./slices/bookingApiSlice";
import { contactApi } from "./slices/contactApiSlice";
import { blogApi } from "./slices/blogApiSlice";
import { seoApi } from "./slices/seoApiSlice";

export const store = configureStore({
  reducer: {
    [apiMaster.reducerPath]: apiMaster.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [subcategoryApi.reducerPath]: subcategoryApi.reducer,
    [doctorApi.reducerPath]: doctorApi.reducer,
    [hospitalApi.reducerPath]: hospitalApi.reducer,
    [commanApiSlice.reducerPath]: commanApiSlice.reducer,
    [dropdownApi.reducerPath]: dropdownApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [blogApi.reducerPath]: blogApi.reducer,
    [seoApi.reducerPath]: seoApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiMaster.middleware,
      categoryApi.middleware,
      subcategoryApi.middleware,
      doctorApi.middleware,
      hospitalApi.middleware,
      commanApiSlice.middleware,
      dropdownApi.middleware,
      bookingApi.middleware,
      contactApi.middleware,
      blogApi.middleware,
      seoApi.middleware
    ),
});
