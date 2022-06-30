const { Schema, model } = require("mongoose");

const gameSchema = new Schema(
  {
    lobbyId: String,
    players: [
      {
        username: String,
        id: String,
        stopped: Number,
        cards: [
          {
            value: String,
            color: String,
            special: Boolean,
            description: String,
          },
        ],
      },
    ],
    spareCards: [
      {
        value: String,
        color: String,
        special: Boolean,
        description: String,
      },
    ],
    centerCards: [
      {
        value: String,
        color: String,
        special: Boolean,
        description: String,
      },
    ],
    winners: [],
    direction: Number,
    turn: String,
    state: String,
    specialActive: Boolean,
    onPlus: Number,
  },
  {
    collection: "game",
  }
);

module.exports = model("Game", gameSchema);
