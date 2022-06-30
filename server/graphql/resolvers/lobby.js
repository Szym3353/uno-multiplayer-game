const Lobby = require("../../models/lobby");
const Game = require("../../models/game");

module.exports = {
  Query: {
    async getLobby(_, { id }) {
      console.log("getLobby", id);
      try {
        const lobby = await Lobby.findOne({ _id: id });

        if (lobby.gameState === "ended") {
          const game = await Game.findById(lobby.gameId);
          let usersStillInGame = game.players.map((el) => el.id);
          console.log("asd", usersStillInGame);
          lobby.users = lobby.users.map((el) => ({
            ...el,
            stillInGame: usersStillInGame.includes(el.id) ? true : false,
          }));
          lobby.save();
        }
        return {
          ...lobby._doc,
          id: lobby._id,
        };
      } catch (err) {
        return new Error("Could not find any lobby with this id");
      }
    },
    async checkIfInLobby(_, { id }) {
      console.log("checkIfInLobby");
      try {
        console.log(id);
        const res = await Lobby.findOne({ "users.id": id });
        const gameCheck = await Game.findOne({ "players.id": id });
        console.log(res);
        return {
          ...res._doc,
          id: res._id,
          userInGame: gameCheck ? true : false,
        };
      } catch (error) {
        console.log("a");
      }
    },
  },
  Mutation: {
    async userLeftLobby(_, { userId, lobbyId }) {
      console.log("leftLobby", userId, lobbyId);
      try {
        const lobby = await Lobby.findByIdAndUpdate(lobbyId, {
          $pull: { users: { id: userId } },
        });

        if (lobby.users.length == 0) {
          console.log("usuwam lobby");
          await Lobby.findByIdAndDelete(lobbyId);
        }

        return {
          ...lobby._doc,
          id: lobby._id,
        };
      } catch (error) {
        console.log(error);
      }
    },
  },
};
