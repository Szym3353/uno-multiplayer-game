import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { Routes, Route } from "react-router-dom";
import useCommon from "./hooks/useCommon";

//Page Components
import Game from "./pages/Game";
import Homepage from "./pages/Homepage";
import Lobby from "./pages/Lobby";
import Login from "./pages/Login";
import Register from "./pages/Register";

//Css
import "./styles/main.css";
import "./styles/buttons.css";
import useCheckPathname from "./hooks/useCheckPathname";
import useTitle from "./hooks/useTitle";

function App() {
  const { user } = useCommon();
  const { data, loading } = useQuery(CHECK_QUERY, {
    variables: { id: user && user.id },
  });

  //Check pathname. If logged user is in game or lobby change his path to this particular page.
  useCheckPathname(data);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lobby/:id" element={<Lobby />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;

const CHECK_QUERY = gql`
  query checkIfInLobby($id: String!) {
    checkIfInLobby(id: $id) {
      id
      gameState
      gameId
      userInGame
    }
  }
`;
