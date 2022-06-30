const Lobby = require("../models/lobby");
const User = require("../models/user");

module.exports.sendMessage = async (io, socket, data) => {
  console.log("chat data", data);
  await Lobby.findByIdAndUpdate(data.lobbyId, {
    $push: {
      lobbyChat: {
        message: data.chatMessage,
        author: data.username,
        createdAt: new Date().toISOString(),
        messageType: "user",
      },
    },
  });
  io.to(data.lobbyId).emit("receive-message", {
    message: data.chatMessage,
    author: data.username,
    createdAt: new Date().toISOString(),
    messageType: "user",
  });
};
