const userResolver = require("./user.js");
const lobbyResolver = require("./lobby");
const gameResolver = require("./game.js");

module.exports = {
  Query: {
    ...userResolver.Query,
    ...lobbyResolver.Query,
    ...gameResolver.Query,
  },
  Mutation: {
    ...userResolver.Mutation,
    ...lobbyResolver.Mutation,
    ...gameResolver.Mutation,
  },
};
