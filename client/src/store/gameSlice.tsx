import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { castDraft } from "immer";
import { isPartiallyEmittedExpression } from "typescript";
import { message } from "./lobbySlice";

function getUserIndex(id: string, players: player[]) {
  return players.findIndex((el: player) => el.id === id);
}

export type card = {
  value: string;
  color: string;
  special: boolean;
  description: string;
};

export type player = {
  username: string;
  id: string;
  numberOfCards: number;
  cards?: card[];
  waiting: boolean;
  stopped: number;
};

type centerCards = {
  latestCard: card;
  numberOfCards: number;
};

type spareCards = {
  numberOfCards: number;
};

export type initialGameType =
  | {
      id: string;
      lobbyId: string;
      players: player[];
      direction: number;
      winners: string[];
      centerCards: centerCards;
      spareCards: spareCards;
      state: "started" | "ended";
      turn: string;
      lobbyChat: message[];
      specialActive: boolean;
    }
  | { state: "loading" };

const gameSlice = createSlice({
  name: "game",
  initialState: {
    game: { state: "loading" } as initialGameType,
  },
  reducers: {
    setNewGame: (state, action: PayloadAction<initialGameType>) => {
      console.log("setnewgame", action.payload);
      state.game = action.payload;
    },
    endGame: (state) => {
      state.game.state = "ended";
    },
    userWon: (state, action: PayloadAction<string>) => {
      if (state.game.state === "started") {
        state.game.players.findIndex(
          (user: player) => user.id === action.payload
        );
      }
    },
    receiveMessageGame: (state, action: PayloadAction<message>) => {
      console.log("receive mess", action.payload);
      if (state.game.state !== "loading") {
        if (
          !state.game.lobbyChat.some(
            (e) =>
              e.author === action.payload.author &&
              e.message === action.payload.message &&
              e.createdAt === action.payload.createdAt
          )
        ) {
          state.game.lobbyChat.push(action.payload);
        }
      }
    },
    changeCardsNumber: (state, action: PayloadAction<player>) => {
      if (state.game.state === "started") {
        console.log("change cards number", action.payload);
        let index = state.game.players.findIndex(
          (el: player) => el.id === action.payload.id
        );
        state.game.players[index].numberOfCards = action.payload.numberOfCards;
        /* if (index >= state.game.players.length - 1) {
          state.game.turn = state.game.players[0].id;
        } else {
          state.game.turn = state.game.players[index + 1].id;
        } */

        let value = index;
        do {
          console.log(value);
          if (
            state.game.direction === 1 &&
            value >= state.game.players.length - 1
          ) {
            value = 0;
          } else if (state.game.direction === -1 && value === 0) {
            value = state.game.players.length - 1;
          } else {
            value += state.game.direction;
          }
          if (state.game.players[value].stopped > 0)
            state.game.players[value].stopped -= 1;
        } while (state.game.players[value].stopped > 0);

        console.log(value);
        state.game.turn = state.game.players[value].id;
      }
    },
    changeCenterCard: (state, action: PayloadAction<card>) => {
      if (state.game.state === "started") {
        console.log("change latest card center", action.payload);
        state.game.centerCards.latestCard = action.payload;
      }
    },
    changeSpareCards: (state, action: PayloadAction<number>) => {
      if (state.game.state === "started") {
        state.game.spareCards.numberOfCards = action.payload;
      }
    },
    /* changeYoursCard: (state, action: PayloadAction<player & card>) => {
      if (state.game.state === "finished") {
        let playerIndex = state.game.players.findIndex(
          (el: player) => el.id === action.payload.id
        );

        state.game.players[playerIndex].cards?.splice(
          state.game.players[playerIndex].cards?.findIndex(
            (el: card) =>
              el.value === action.payload.value &&
              el.color === action.payload.color
          ) || 0,
          state.game.players[playerIndex].cards?.findIndex(
            (el: card) =>
              el.value === action.payload.value &&
              el.color === action.payload.color
          )
            ? 1
            : 0
        );
      }
    }, */
    changeYoursCard: (state, action: PayloadAction<any>) => {
      console.log("give you cards", action.payload);
      if (state.game.state === "started") {
        console.log("give you cards 2", action.payload);
        let playerIndex = getUserIndex(
          action.payload.user.id,
          state.game.players
        );
        state.game.players[playerIndex].cards = action.payload.cards;
      } else {
        console.log("asdasdasd");
      }
    },
  },
});

const { actions } = gameSlice;
export const {
  setNewGame,
  changeCardsNumber,
  changeCenterCard,
  changeYoursCard,
  //giveYouCards,
  changeSpareCards,
  userWon,
  endGame,
  receiveMessageGame,
} = actions;
export default gameSlice.reducer;
