const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { handleConnection } = require("./socketio");

const cors = require("cors");

require("dotenv").config();

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  /* app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true
    })
  ); */

  const io = socketIo(httpServer, {
    cors: {
      origin: "http://localhost:3000",
    },
  });

  const typeDefs = require("./graphql/typedefs");
  const resolvers = require("./graphql/resolvers");

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  io.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  io.on("connection", (socket) => handleConnection(io, socket));

  await server.start();
  server.applyMiddleware({
    app,
    //cors: { origin: "http://localhost:3000", credentials: true },
    cors: { origin: "*", credentials: true },
  });

  await mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

  await new Promise((resolve) => httpServer.listen({ port: 5000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);

  /* mongoose
    .connect(process.env.DB_URL, { useNewUrlParser: true })
    .then(() => {
      console.log("Database Connected");
      return httpServer.listen({ port: process.env.SERVER_PORT });
    })
    .then((res) => {
      console.log(`Server running at ${res.url}`);
    }); */
}

startApolloServer();

/* mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Database Connected");
    return server.listen({ port: process.env.SERVER_PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
 */
