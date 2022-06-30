const gql = require("graphql-tag");

module.exports = gql`
  type User {
    id: ID!
    email: String!
    username: String!
    password: String!
    token: String!
  }
  type lobbyUser {
    id: String!
    username: String!
    stillInGame: Boolean
  }
  type message {
    message: String!
    author: String!
    createdAt: String!
    messageType: String!
  }
  type Lobby {
    id: ID!
    gameState: String!
    gameId: String
    host: lobbyUser
    users: [lobbyUser]
    code: String
    state: String
    lobbyChat: [message]
    userInGame: Boolean
  }
  type token {
    token: String!
  }
  type centerCards {
    latestCard: card
    numberOfCards: Int!
    cards: [card]
  }
  type card {
    value: String!
    color: String!
    special: Boolean!
    description: String!
  }
  type filteredGamePlayer {
    username: String!
    id: String!
    numberOfCards: Int!
    cards: [card]
    stopped: Int!
  }
  type FilteredGame {
    id: ID!
    lobbyId: String!
    players: [filteredGamePlayer!]
    direction: Int!
    winners: [String]
    centerCards: centerCards
    spareCards: centerCards
    state: String!
    turn: String!
    lobbyChat: [message]
    specialActive: Boolean
    onPlus: Int
  }
  type Query {
    getUser(id: String!): User
    getLobby(id: String!): Lobby
    getGame(id: String!, userId: String!): FilteredGame
    checkIfInLobby(id: String!): Lobby
  }
  type Mutation {
    register(
      username: String!
      password: String!
      confirmPassword: String!
      email: String!
    ): token!
    login(email: String!, password: String!): token!
    userLeftLobby(userId: String!, lobbyId: String!): Lobby
  }
`;
