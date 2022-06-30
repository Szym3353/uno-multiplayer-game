import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwt from "jwt-decode";

type stateInterface = {
  id: string;
  username: string;
  token: string;
  email: string;
};

function setInitialState(): stateInterface | false {
  if (localStorage["user"]) {
    if (localStorage.getItem("user")) {
      return jwt(localStorage.getItem("user") || "");
    } else {
      return false;
    }
  }
  return false;
}
const user: stateInterface | boolean = setInitialState();

const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user,
  },
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      console.log("DZIAŁAM KURWA ", action.payload.token);
      localStorage.setItem("user", action.payload.token);
      const user: stateInterface = jwt(action.payload.token);
      console.log("kurwa user", user);
      state.user = user;
      return state;
    },
  },
});

const { actions, reducer } = userSlice;
export const { setUser } = actions;
export default reducer;
/* state.username: action.payload.username,
        state.token: action.payload.token,
        state.email: action.payload.email */
