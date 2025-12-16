import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import { productApiSlice } from "./slices/productSlice";
import { bidApiSlice } from "./slices/bidApiSlice";
import { batchApiSlice } from "./slices/batchApiSlice";
import { buyerApi } from "./slices/buyerApiSlice";
import { adminApi } from "./slices/adminApiSlice";
import { adminStatsApi } from "./slices/adminStatsApiSlice";

import unreadReducer from "./slices/unreadSlice";

import sellerUnreadReducer from "./slices/sellerUnreadSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [productApiSlice.reducerPath]: productApiSlice.reducer,
    [bidApiSlice.reducerPath]: bidApiSlice.reducer,
    [batchApiSlice.reducerPath]: batchApiSlice.reducer,
    [buyerApi.reducerPath]: buyerApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [adminStatsApi.reducerPath]: adminStatsApi.reducer,
    unread: unreadReducer,
    sellerUnread:sellerUnreadReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      productApiSlice.middleware,
      bidApiSlice.middleware,
      batchApiSlice.middleware,
      buyerApi.middleware,
      adminApi.middleware,
      adminStatsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
