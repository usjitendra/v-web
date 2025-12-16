import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SellerUnreadState {
  [key: string]: number;
}

const initialState: SellerUnreadState = {};

const sellerUnreadSlice = createSlice({
  name: "sellerUnread",
  initialState,
  reducers: {
    setSellerUnread: (
      state,
      action: PayloadAction<{ key: string; count: number }>
    ) => {
      state[action.payload.key] = action.payload.count;
    },

    incrementSellerUnread: (
      state,
      action: PayloadAction<{ key: string }>
    ) => {
      state[action.payload.key] = (state[action.payload.key] || 0) + 1;
    },

resetSellerUnread: (
  state,
  action: PayloadAction<{ sellerId: number }>
) => {
  Object.keys(state).forEach((key) => {
    if (key.startsWith(`${action.payload.sellerId}_`)) {
      state[key] = 0;
    }
  });
},

    setSellerUnreadMap: (
      _state,
      action: PayloadAction<SellerUnreadState>
    ) => {
      return action.payload;
    },
  },
});

export const {
  setSellerUnread,
  incrementSellerUnread,
  resetSellerUnread,
  setSellerUnreadMap,
} = sellerUnreadSlice.actions;

export default sellerUnreadSlice.reducer;
