const { Schema, model } = require("mongoose");

const lobbySchema = new Schema(
  {
    host: {
      id: String,
      username: String,
    },
    state: String,
    gameState: String,
    gameId: String,
    lobbyChat: [
      {
        message: String,
        author: String,
        createdAt: String,
        messageType: String,
      },
    ],
    users: [
      {
        username: String,
        id: String,
        stillInGame: Boolean,
      },
    ],
    code: String,
  },
  {
    collection: "lobby",
  }
);

module.exports = model("Lobby", lobbySchema);
