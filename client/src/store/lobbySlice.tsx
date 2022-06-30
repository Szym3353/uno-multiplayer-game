import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type user = {
  id: string;
  username: string;
  stillInGame: boolean;
};

export type message = {
  message: string;
  author: string;
  createdAt: string;
  messageType: "system" | "user";
};

type stateInterface =
  | {
      id: string;
      host: user;
      users: user[];
      code: string;
      lobbyChat: message[];
      gameState: string;
      gameId: string;
      state: "finished";
    }
  | { state: "loading" };

/* function setInitialState(): stateInterface | false {
  if (localStorage["lobby"]) {
    if (localStorage.getItem("lobby")) {
      return JSON.parse(localStorage.getItem("lobby") || "");
    } else {
      return false;
    }
  }
  return false;
} */

//const lobby: stateInterface = { state: "loading" };

const lobbySlice = createSlice({
  name: "lobby",
  initialState: {
    lobby: { state: "loading" } as stateInterface,
  },
  reducers: {
    setNewLobby: (state, action: PayloadAction<any>) => {
      console.log("set new lobby", action.payload);
      state.lobby = action.payload;
    },
    startingGameLobby: (state, action: PayloadAction<any>) => {
      if (state.lobby.state === "finished") {
        console.log("check", action.payload);
        state.lobby.gameState = "started";
        state.lobby.gameId = action.payload;
      }
    },
    endGameState: (state) => {
      if (state.lobby.state === "finished") {
        state.lobby.gameState = "ended";
      }
    },
    userLeftGame: (state, action: PayloadAction<string>) => {
      if (state.lobby.state === "finished") {
        let index = state.lobby.users.findIndex(
          (user: user) => user.id === action.payload
        );
        state.lobby.users[index].stillInGame = false;
      }
    },
    setUsersStillInGame: (state, action: PayloadAction<string[]>) => {
      if (state.lobby.state === "finished") {
        if (action.payload) {
          //state.lobby.usersStillInGame = action.payload;
        }
      }
    },
    joinLobby: (state, action: PayloadAction<any>) => {
      console.log("[store] DOŁĄCZAM UZYTKOWNIKA DO TABELI", action.payload);
      if (state.lobby.state === "finished") {
        if (!state.lobby.users.some((e) => e.id === action.payload.id)) {
          state.lobby.users.push(action.payload);
        }
      }
    },
    userLeft: (state, action: PayloadAction<any>) => {
      console.log("userLeft", action.payload);
      if (state.lobby.state === "finished") {
        state.lobby.users = state.lobby.users.filter(
          (el) => el.id != action.payload
        );
      }
    },
    receiveMessageLobby: (state, action: PayloadAction<any>) => {
      console.log("receive mess", action.payload);
      if (state.lobby.state === "finished") {
        if (
          !state.lobby.lobbyChat.some(
            (e) =>
              e.author === action.payload.author &&
              e.message === action.payload.message &&
              e.createdAt === action.payload.createdAt
          )
        ) {
          state.lobby.lobbyChat.push(action.payload);
        }
      }
    },
    leaveLobby: (state) => {
      console.log("leaveLobby");
      if (state.lobby) {
        state.lobby = { state: "loading" };
      }
    },
  },
});

const { actions } = lobbySlice;
export const {
  setNewLobby,
  joinLobby,
  leaveLobby,
  userLeft,
  receiveMessageLobby,
  startingGameLobby,
  endGameState,
  setUsersStillInGame,
  userLeftGame,
} = actions;
export default lobbySlice.reducer;
