import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UnreadState {
  [key: string]: number; // key = `${buyerId}_${batchId}`
}

const initialState: UnreadState = {};

const unreadSlice = createSlice({
  name: "unread",
  initialState,
  reducers: {
    setUnread: (
      state,
      action: PayloadAction<{ key: string; count: number }>
    ) => {
      state[action.payload.key] = action.payload.count;
    },
    setUnreadMap: (state, action: PayloadAction<UnreadState>) => {
      return action.payload; // Replace state with new map
    },
    incrementUnread: (state, action: PayloadAction<{ key: string }>) => {


      state[action.payload.key] = (state[action.payload.key] || 0) + 1;
    },
    resetUnread: (state, action: PayloadAction<{ key: string }>) => {
      state[action.payload.key] = 0;
    },
  },
});

export const { setUnread, incrementUnread, resetUnread,setUnreadMap } = unreadSlice.actions;
export default unreadSlice.reducer;
