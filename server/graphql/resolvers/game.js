const { ApolloError } = require("apollo-server-express");
const { default: mongoose } = require("mongoose");
const Game = require("../../models/game");
const Lobby = require("../../models/lobby");

module.exports = {
  Query: {
    async getGame(_, { id, userId }) {
      try {
        console.log("GET GAMEEEEEEEEEEEEEEEEEEEE");
        if (!mongoose.isValidObjectId(id)) {
          throw new Error("Ta gra nie istnieje");
        }
        if (!mongoose.isValidObjectId(userId)) {
          throw new Error("Niepoprawne id użytkownika");
        }
        const game = await Game.findById(id);
        if (!game) {
          throw new Error("Ta gra nie istnieje");
        }
        console.log("checkIfGame", game ? true : false);
        let lobby;
        if (game) {
          lobby = await Lobby.findById(game.lobbyId);
        }
        console.log("================", "found game", game);

        let filteredPlayersData = game.players.map((playerData) => {
          //console.log("[FILTEREDPLAYERSDATA] playerData", playerData);
          if (playerData.id === userId) {
            return {
              username: playerData.username,
              id: playerData.id,
              numberOfCards: playerData.cards.length,
              stopped: playerData.stopped,
              cards: playerData.cards,
            };
          } else {
            return {
              username: playerData.username,
              id: playerData.id,
              stopped: playerData.stopped,
              numberOfCards: playerData.cards.length,
            };
          }
        });

        //console.log("==========", filteredPlayersData, "=================");

        let centerCards = {
          latestCard: game.centerCards[game.centerCards.length - 1],
          numberOfCards: game.centerCards.length,
        };

        let spareCards = {
          numberOfCards: game.spareCards.length,
        };

        return {
          id: game._id,
          lobbyId: game.lobbyId,
          players: filteredPlayersData,
          direction: game.direction,
          winners: game.winners,
          centerCards,
          spareCards,
          state: game.state,
          turn: game.turn,
          lobbyChat: lobby.lobbyChat || [],
        };
      } catch (error) {
        throw new ApolloError(error);
      }
    },
  },
  Mutation: {},
};
