const Lobby = require("../models/lobby");
const User = require("../models/user");
const { sendMessage } = require("./chat");
const {
  startGame,
  playCard,
  takeCard,
  checkFirst,
  leaveGame,
} = require("./game");
const {
  createLobby,
  connectToLobby,
  leaveLobby,
  getWaitingUsers,
  kickUser,
} = require("./lobby");

module.exports.handleConnection = (io, socket) => {
  console.log(`connected to socket by: ${socket.id}`);

  //lobby
  socket.on("create-lobby", (data) => createLobby(io, socket, data));
  socket.on("connect-to-lobby", (data, callBackFunc) =>
    connectToLobby(io, socket, data, callBackFunc)
  );
  socket.on("rejoin-lobby", (data) => {
    socket.join(`${data.rejoinId}`);
  });
  socket.on("send-message", (data) => sendMessage(io, socket, data));
  socket.on("get-users-still-in-game", (data, callBackFunc) =>
    getWaitingUsers(io, socket, data, callBackFunc)
  );
  socket.on("kick-user", (data, callBackFunc) =>
    kickUser(io, socket, data, callBackFunc)
  );
  socket.on("leave-lobby", (data) => {
    leaveLobby(io, socket, data);
  });

  //game
  socket.on("start-game", (data) => startGame(io, socket, data));
  socket.on("leave-game", (data, callBackFunc) =>
    leaveGame(io, socket, data, callBackFunc)
  );
  socket.on("play-card", (data, callBackFunc) =>
    playCard(io, socket, data, callBackFunc)
  );
  socket.on("take-card", (data) => takeCard(io, socket, data));
  socket.on("check-first", (data, callBackFunc) =>
    checkFirst(io, socket, data, callBackFunc)
  );
};
