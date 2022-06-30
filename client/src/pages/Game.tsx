import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ChatMessages from "../components/ChatMessages";
import EndBox from "../components/EndBox";
import ErrorBox from "../components/ErrorBox";
import GameBoard from "../components/GameBoard";
import Loading from "../components/Loading";
import useChat from "../hooks/useChat";
import useCommon from "../hooks/useCommon";
import useTitle from "../hooks/useTitle";
import { socket } from "../socketio";
import {
  changeCardsNumber,
  changeCenterCard,
  changeSpareCards,
  changeYoursCard,
  endGame,
  player,
  setNewGame,
  userWon,
} from "../store/gameSlice";
import { endGameState } from "../store/lobbySlice";

import "../styles/game.css";

const Game = () => {
  const { id } = useParams();
  const { dispatch, game, user } = useCommon();

  const [chatShow, setChatShow] = useState(false);
  const gameChatContainer = useRef<HTMLDivElement>(null);

  const { setChatMessage, sendMessage, chatMessage } = useChat(
    user ? user.username : "",
    game.state !== "loading" ? game.lobbyId : "",
    true
  );

  useTitle(
    `Gra: ${
      game.state !== "loading" &&
      game.players[game.players.findIndex((el: player) => el.id == game.turn)]
        .username
    }`
  );

  const { data, loading, error } = useQuery(QUERY_GAME, {
    variables: { id, userId: user && user.id },
  });

  useEffect(() => {
    console.log("gamestarting", data, loading, error);
  }, [data, loading, error]);

  useEffect(() => {
    if (data) {
      dispatch(setNewGame(data.getGame));
      socket.emit("rejoin-lobby", { rejoinId: data.getGame.lobbyId });
    }
  }, [data]);

  const handleShowChat = () => {
    setChatShow((prev: boolean) => !prev);
  };

  useEffect(() => {
    socket.on("played-card", (socketData) => {
      dispatch(changeCardsNumber(socketData.user));
      dispatch(changeCenterCard(socketData.card));
      if (user && user.id === socketData.user.id) {
        dispatch(changeYoursCard(socketData));
      }
      if (socketData.win) {
        dispatch(userWon(socketData.user.id));
      }
      if (socketData.end) {
        dispatch(endGameState());
        dispatch(endGame());
      }
    });
    socket.on("took-card", (socketData) => {
      console.log("took-card");
      dispatch(changeCardsNumber(socketData.user));
      dispatch(changeSpareCards(socketData.cards.length));
      if (user && user.id === socketData.user.id) {
        dispatch(changeYoursCard(socketData));
      }
    });
    return () => {
      socket.off("played-card");
      socket.off("took-card");
    };
  }, []);

  return (
    <div className="container">
      {!loading ? (
        !error ? (
          data && game.state !== "loading" ? (
            <>
              {game.state === "ended" && <EndBox />}
              <div
                className={`${
                  chatShow && "game-chat-show"
                } game-chat-container`}
                ref={gameChatContainer}
              >
                <div className=" game-chat-messages lobby-chat-messages">
                  <ChatMessages lobbyChat={game.lobbyChat} />
                </div>
                <form onSubmit={(e) => sendMessage(e)}>
                  <input
                    onChange={(e) => setChatMessage(e.target.value)}
                    type="text"
                    className="game-chat-input"
                    value={chatMessage}
                  />
                </form>
              </div>
              <GameBoard handleShowChat={handleShowChat} />
            </>
          ) : (
            <div className="box centered">Ta gra nie istnieje.</div>
          )
        ) : (
          <ErrorBox errorMessage="Can't get game" errorDetails={error} />
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Game;

const QUERY_GAME = gql`
  query getGame($id: String!, $userId: String!) {
    getGame(id: $id, userId: $userId) {
      id
      lobbyId
      state
      turn
      players {
        id
        username
        numberOfCards
        stopped
        cards {
          value
          color
          special
          description
        }
      }
      direction
      winners
      lobbyChat {
        message
        author
        createdAt
        messageType
      }
      centerCards {
        latestCard {
          color
          value
          special
          description
        }
        numberOfCards
      }
      spareCards {
        numberOfCards
      }
      specialActive
      onPlus
    }
  }
`;
