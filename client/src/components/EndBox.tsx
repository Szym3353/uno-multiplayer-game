import React from "react";
import useCommon from "../hooks/useCommon";
import { socket } from "../socketio";
import { player } from "../store/gameSlice";

const EndBox = () => {
  const { navigate, game, user } = useCommon();

  //Button func
  const handleLeaveGame = () => {
    if (game.state === "ended" && user) {
      socket.emit(
        "leave-game",
        {
          gameId: game.id,
          userId: user.id,
        },
        (err: any, res: any) => {
          if (res.lobbyId) {
            navigate(`/lobby/${res.lobbyId}`);
          } else {
            navigate("/");
          }
        }
      );
    }
  };

  return (
    <div className="end-screen-container">
      <div className="end-box">
        <h3 className="box-header">Koniec gry</h3>
        <ul className="end-users">
          {game.state !== "loading" &&
            game.winners.map((user: string, index: number) => {
              return (
                <li className="end-user">
                  {
                    game.players[
                      game.players.findIndex((el: any) => el.id === user)
                    ].username
                  }
                  <span className="plus-end-points">
                    {" "}
                    + {(game.winners.length - index) * 1000}
                  </span>
                </li>
              );
            })}
          {game.state !== "loading" &&
            game.players
              .filter((el: player) => !game.winners.includes(el.id))
              .map((user: player) => {
                return (
                  <li className="end-user">
                    {user.username}
                    <span className="end-points"> 00</span>
                  </li>
                );
              })}
        </ul>
        <button
          onClick={handleLeaveGame}
          className="homepage-lobbybutton leave-game-button"
        >
          Opuść gre
        </button>
      </div>
    </div>
  );
};

export default EndBox;
