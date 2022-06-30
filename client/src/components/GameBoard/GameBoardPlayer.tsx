import React from "react";
import { player, card } from "../../store/gameSlice";

type props = {
  turn: boolean;
};

const GameBoardPlayer = ({
  id,
  numberOfCards,
  username,
  stopped,
  turn,
}: player & props) => {
  return (
    <div
      className={`game-player ${stopped > 0 && "game-player-stopped"}`}
      key={id}
    >
      <span className="game-player-circle game-player-numberOfCards">
        {numberOfCards}
      </span>
      {stopped > 0 && (
        <span className="game-player-circle game-player-stopInfo">
          {stopped}
        </span>
      )}
      <img
        src="https://via.placeholder.com/150"
        className={`game-player-pfp ${turn && "game-player-turn"}`}
      />
      <div className="game-player-cards">
        {[...Array(numberOfCards > 7 ? 7 : numberOfCards)].map(
          (e: card, i: number) => {
            return (
              <img
                src="/cards/cardBg.png"
                className="game-player-card"
                key={i}
              />
            );
          }
        )}
      </div>
      <p className="game-player-username">{username}</p>
    </div>
  );
};

export default GameBoardPlayer;
