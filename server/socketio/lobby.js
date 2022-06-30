const Lobby = require("../models/lobby");
const User = require("../models/user");
const Game = require("../models/game");

function genCode(length) {
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports.createLobby = async (io, socket, data) => {
  console.log(data);

  const user = await User.findOne({ _id: data.hostId });

  let code;

  do {
    code = genCode(6);
    var lobby = await Lobby.findOne({ code });
  } while (lobby);

  const newLobby = new Lobby({
    host: { id: data.hostId, username: user.username },
    users: [{ id: data.hostId, username: user.username, stillInGame: false }],
    code,
    gameState: "waiting",
    state: "finished",
    lobbyChat: [
      {
        message: `${user.username} dołączył do pokoju`,
        author: user.username,
        createdAt: new Date().toISOString(),
        messageType: "system",
      },
    ],
  });

  await newLobby.save();

  socket.join(`${newLobby._id}`);

  io.to(`${newLobby._id}`).emit("join-lobby-homepage", {
    lobbyId: newLobby._id,
    userId: socket.id,
  });
};

module.exports.connectToLobby = async (io, socket, data, callBackFunc) => {
  try {
    console.log("connect to lobby", data);
    const user = await User.findOne({ _id: data.userId });

    const lobby = await Lobby.findOne({ code: data.code });

    if (!lobby) {
      callBackFunc("Błędny kod");
      throw new Error("Niepoprawny kod");
    }

    lobby.users.push({
      id: data.userId,
      username: user.username,
      stillInGame: false,
    });

    lobby.lobbyChat.push({
      message: `${user.username} dołączył do pokoju`,
      author: user.username,
      createdAt: new Date().toISOString(),
      messageType: "system",
    });

    await lobby.save();
    /* const res = await Lobby.findByIdAndUpdate(data.code, {
      $push: {
        users: { id: data.userId, username: user.username, stillInGame: false },
        lobbyChat: {
          message: `${user.username} dołączył do pokoju`,
          author: user.username,
          createdAt: new Date().toISOString(),
          messageType: "system",
        },
      },
    }); */
    socket.join(`${lobby._id}`);
    io.to(`${lobby._id}`).emit("join-lobby-homepage", {
      lobbyId: lobby._id,
    });
    io.to(`${lobby._id}`).emit("join-lobby", {
      lobbyId: lobby._id,
      user: {
        id: data.userId,
        username: user.username,
      },
      message: {
        message: `${user.username} dołączył do pokoju`,
        author: user.username,
        createdAt: new Date().toISOString(),
        messageType: "system",
      },
    });
  } catch (error) {}
};

module.exports.leaveLobby = async (io, socket, data) => {
  try {
    const lobby = await Lobby.findById(data.lobbyId);

    lobby.users = lobby.users.filter((el) => el.id !== data.userId);

    if (lobby.users.length == 0) {
      await Lobby.findByIdAndDelete(data.lobbyId);
    } else {
      lobby.save();
    }

    io.to(`${data.lobbyId}`).emit("user-left-lobby", {
      userId: data.userId,
      kick: data.kick,
    });

    return {
      ...lobby._doc,
      id: lobby._id,
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports.kickUser = async (io, socket, data, callBackFunc) => {
  try {
    const lobby = await Lobby.findById(data.lobbyId);

    if (lobby.host.id !== data.hostId) {
      callBackFunc("Nie masz odpowiednich uprawnien", null);
      throw new Error("Nie masz odpowiednich uprawnien");
    }

    lobby.users = lobby.users.filter((el) => el.id !== data.kickedUserId);

    lobby.save();
    callBackFunc(null, data.kickedUserId);
  } catch (error) {}
};

module.exports.getWaitingUsers = async (io, socket, data, callBackFunc) => {
  try {
    const game = await Game.findById(data.gameId);
    if (game.players.length > 0) {
      callBackFunc(
        null,
        game.players.map((el) => el.id)
      );
    }
  } catch (error) {
    callBackFunc(error, null);
  }
};
