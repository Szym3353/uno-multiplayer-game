import { useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socketio";
import { FaUserTimes, FaCrown } from "react-icons/fa";
import {
  joinLobby,
  leaveLobby,
  message,
  receiveMessageLobby,
  setNewLobby,
  startingGameLobby,
  userLeft,
  userLeftGame,
} from "../store/lobbySlice";
import gql from "graphql-tag";

import "../styles/lobby.css";
import useCommon from "../hooks/useCommon";
import useChat from "../hooks/useChat";
import useTitle from "../hooks/useTitle";
import Loading from "../components/Loading";
import ChatMessages from "../components/ChatMessages";

const Lobby = () => {
  const { id } = useParams();
  const { navigate, dispatch, user, lobby } = useCommon();
  useTitle(`Lobby ${lobby.state === "finished" && lobby.users.length}/9`);

  const { data, loading: loadingData } = useQuery(FETCH_LOBBY, {
    variables: { id },
  });

  const { setChatMessage, sendMessage, chatMessage } = useChat(
    user ? user.username : "",
    lobby.state === "finished" ? lobby.id : "",
    false
  );

  const handleLeave = () => {
    socket.emit("leave-lobby", {
      userId: user && user.id,
      lobbyId: lobby.state === "finished" && lobby.id,
    });
    dispatch(leaveLobby());
    navigate("/");
  };

  const handleStart = () => {
    socket.emit("start-game", {
      lobbyId: lobby.state === "finished" && lobby.id,
    });
  };

  const kickUser = (kickedUserId: string) => {
    socket.emit(
      "kick-user",
      {
        lobbyId: lobby.state === "finished" && lobby.id,
        hostId: user && user.id,
        kickedUserId,
      },
      (err: any, res: any) => {
        if (res) {
          socket.emit("leave-lobby", {
            userId: res,
            lobbyId: lobby.state === "finished" && lobby.id,
            kick: true,
          });
        }
      }
    );
  };

  socket.on("join-lobby", (socketData) => {
    if (lobby.state === "finished") {
      if (!lobby.users.some((e) => e.id === socketData.user.id)) {
        dispatch(joinLobby(socketData.user));
        dispatch(receiveMessageLobby(socketData.message));
      }
    }
  });

  useEffect(() => {
    socket.on("starting-game", (socketData) => {
      dispatch(startingGameLobby(socketData.gameId));
      navigate(`/game/${socketData.gameId}`);
    });
    socket.on("user-left-game", (socketData) => {
      dispatch(userLeftGame(socketData.userId));
    });
    socket.on("user-left-lobby", (socketData) => {
      dispatch(userLeft(socketData.userId));
      if (user) {
        if (socketData.kick && socketData.userId === user.id) {
          navigate("/");
        }
      }
    });
    return () => {
      socket.off("join-lobby");
      socket.off("user-left-lobby");
      socket.off("starting-game");
      socket.off("user-left-game");
    };
  }, []);

  useEffect(() => {
    if (!loadingData && data) {
      console.log("dispatchuje", data.getLobby);
      //socket.emit("rejoin-lobby", { rejoinId: id });
      dispatch(setNewLobby(data.getLobby));
    }
    /* if (lobby.state === "finished") {
      if (lobby.gameState === "ended") {
        socket.emit(
          "get-users-still-in-game",
          { gameId: lobby.gameId },
          (err: any, res: string[]) => {
            if (res) {
              dispatch(setUsersStillInGame(res));
            }
          }
        );
      }
    } */
  }, [data]);

  return (
    <div className="container">
      {!loadingData ? (
        data ? (
          lobby.state === "finished" && (
            <div className="box centered">
              <div className="lobby-top">
                <div>
                  <h3 className="lobby-title">
                    Pokój użytkownika {lobby.host.username}
                  </h3>
                  <p className="lobby-id">id: {lobby.id}</p>
                  <p className="lobby-code">
                    Kod: <b>{lobby.code}</b>
                  </p>
                </div>
                <div>
                  <button
                    className="main-button button-style-2 leave-lobby-button"
                    onClick={handleLeave}
                  >
                    Opuść lobby
                  </button>
                </div>
              </div>
              {user && lobby.host.id === user.id && (
                <div className="lobby-manage-buttons">
                  <button
                    onClick={handleStart}
                    className="main-button button-style-1 lobby-button"
                  >
                    Rozpocznij gre
                  </button>
                  <button className="main-button button-style-2 lobby-button">
                    Ustawienia
                  </button>
                </div>
              )}
              <p className="lobby-users-title">
                Użytkownicy: <b>{lobby.users.length} / 10</b>
              </p>
              <div className="lobby-users box">
                {lobby.users.map(
                  (uzytkownik: {
                    username: string;
                    id: string;
                    stillInGame: boolean;
                  }) => {
                    return (
                      <div key={uzytkownik.id} className={`lobby-user`}>
                        <img
                          src="https://via.placeholder.com/150"
                          className={`lobby-user-pfp ${
                            uzytkownik.stillInGame && "in-game"
                          }`}
                        />
                        <p className={`lobby-user-username `}>
                          <span
                            className={`${uzytkownik.stillInGame && "in-game"}`}
                          >
                            {uzytkownik.username}
                          </span>
                          {uzytkownik.stillInGame && (
                            <p className="in-game-info">Wciąż w grze</p>
                          )}
                        </p>
                        {user &&
                          lobby.host.id === user.id &&
                          uzytkownik.id !== user.id && (
                            <div className="lobby-user-menu">
                              <button className="lobby-user-menuButton">
                                <FaCrown />
                              </button>
                              <button
                                onClick={() => kickUser(uzytkownik.id)}
                                className="lobby-user-menuButton lobby-user-kickButton"
                              >
                                <FaUserTimes />
                              </button>
                            </div>
                          )}
                      </div>
                    );
                  }
                )}
              </div>
              <div className="lobby-chat box">
                <div className="lobby-chat-messages">
                  <ChatMessages lobbyChat={lobby.lobbyChat} />
                </div>
                <form onSubmit={(e) => sendMessage(e)}>
                  <input
                    onChange={(e) => setChatMessage(e.target.value)}
                    type="text"
                    className="lobby-chat-input"
                    value={chatMessage}
                  />
                </form>
              </div>
            </div>
          )
        ) : (
          "To lobby nie istnieje"
        )
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Lobby;

const FETCH_LOBBY = gql`
  query getLobby($id: String!) {
    getLobby(id: $id) {
      id
      state
      host {
        id
        username
      }
      users {
        id
        username
        stillInGame
      }
      lobbyChat {
        message
        author
        createdAt
        messageType
      }
      gameState
      code
    }
  }
`;

const LEAVE_LOBBY = gql`
  mutation userLeftLobby($userId: String!, $lobbyId: String!) {
    userLeftLobby(userId: $userId, lobbyId: $lobbyId) {
      id
    }
  }
`;

{
  /* <div className="container">
      {!loadingData && data ? (
        lobby.state === "finished" && (
          <div className="box centered">
            <div className="lobby-top">
              <div>
                <h3 className="lobby-title">
                  Pokój użytkownika {lobby.host.username}
                </h3>
                <p className="lobby-id">id: {lobby.id}</p>
                <p className="lobby-code">
                  Kod: <b>#{lobby.code}</b>
                </p>
              </div>
              <div>
                <button
                  className="main-button button-style-2 leave-lobby-button"
                  onClick={handleLeave}
                >
                  Opuść lobby
                </button>
              </div>
            </div>
            {user && lobby.host.id === user.id && (
              <div className="lobby-manage-buttons">
                <button
                  onClick={handleStart}
                  className="main-button button-style-1 lobby-button"
                >
                  Rozpocznij gre
                </button>
                <button className="main-button button-style-2 lobby-button">
                  Ustawienia
                </button>
              </div>
            )}
            <p className="lobby-users-title">
              Użytkownicy: <b>{lobby.users.length} / 9</b>
            </p>
            <div className="lobby-users box">
              {lobby.users.map(
                (uzytkownik: {
                  username: string;
                  id: string;
                  stillInGame: boolean;
                }) => {
                  return (
                    <div key={uzytkownik.id} className={`lobby-user`}>
                      <img
                        src="https://via.placeholder.com/150"
                        className={`lobby-user-pfp ${
                          uzytkownik.stillInGame && "in-game"
                        }`}
                      />
                      <p className={`lobby-user-username `}>
                        <span
                          className={`${uzytkownik.stillInGame && "in-game"}`}
                        >
                          {uzytkownik.username}
                        </span>
                        {uzytkownik.stillInGame && (
                          <p className="in-game-info">Wciąż w grze</p>
                        )}
                      </p>
                      <div className="lobby-user-menu">
                        <button className="lobby-user-menuButton">k</button>
                        <button className="lobby-user-menuButton">O</button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
            <div className="lobby-chat box">
              <div className="lobby-chat-messages">
                {lobby.lobbyChat
                  .slice(0)
                  .reverse()
                  .map((message: message, i: number) => {
                    return (
                      <p
                        key={i}
                        className={`lobby-chat-message message-${message.messageType}`}
                      >
                        {message.messageType === "user" && (
                          <>
                            <span className="chat-message-time">{`[${
                              message.createdAt.split("T")[1].split(".")[0]
                            }]`}</span>
                            <span className="chat-message-author">
                              {" "}
                              {message.author}:
                            </span>
                          </>
                        )}
                        <span className="chat-message-message">{` ${message.message}`}</span>
                      </p>
                    );
                  })}
              </div>
              <form onSubmit={(e) => sendMessage(e)}>
                <input
                  onChange={(e) => setChatMessage(e.target.value)}
                  type="text"
                  className="lobby-chat-input"
                  value={chatMessage}
                />
              </form>
            </div>
          </div>
        )
      ) : (
        <div className="box centered">To lobby nie istnieje.</div>
      )}
    </div> */
}
