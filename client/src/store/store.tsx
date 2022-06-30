import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import lobbyReducer from "./lobbySlice";
import gameReducer from "./gameSlice";

const store = configureStore({
  reducer: {
    userReducer,
    lobbyReducer,
    gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
