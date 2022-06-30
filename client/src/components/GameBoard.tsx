import React, { useEffect, useState } from "react";
import useCards from "../hooks/useCards";
import useCommon from "../hooks/useCommon";
import { card, player } from "../store/gameSlice";

//CSS
import "../styles/gameboard.css";
import "../styles/colorSelect.css";

//Components
import GameBoardMiddle from "./GameBoard/GameBoardMiddle";
import GameBoardPlayer from "./GameBoard/GameBoardPlayer";

type props = {
  handleShowChat: any;
};

const GameBoard = ({ handleShowChat }: props) => {
  const { user, game } = useCommon();
  const { getCardName, handlePlayCard, colorSelect, checkFirstCard } =
    useCards();

  function getYoursCards() {
    if (game.state === "started" && user) {
      let test = game.players.filter((el: player) => el.id === user.id)[0];
      if (test.cards) {
        return test.cards;
      } else {
        return [];
      }
    }
    return [];
  }

  return (
    <>
      {game.state !== "loading" && (
        <>
          <div className="box-noLimit centered game-container">
            {game.players.map((e: player) => {
              return <GameBoardPlayer turn={e.id === game.turn} {...e} />;
            })}
            <button
              onClick={handleShowChat}
              className="chat-button main-button button-style-1"
            >
              Czat
            </button>

            <GameBoardMiddle />
            <div className="game-user-cards">
              {getYoursCards().map((card: card) => {
                return (
                  <img
                    src={`${getCardName(card)}`}
                    className="game-user-card"
                    onClick={() => handlePlayCard(card, false)}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default GameBoard;

<>
  {/* {game.state !== "loading" ? (
        <div className="game-board">
          {game.players.map((e: player, i) => {
            return (
              <div
                className={`game-player ${game.turn === e.id && "his-turn"} ${
                  i == 4 && "stopped"
                }`}
              >
                <img
                  src="https://via.placeholder.com/150"
                  className="game-player-pfp"
                />
                <div className="game-player-info">
                  <p className="game-player-username">{e.username}</p>
                  <div className="game-player-cards">
                    {[...Array(e.numberOfCards)].map((e: card) => {
                      return (
                        <img
                          src="https://i.ibb.co/nLwFPvT/uno-bg.png"
                          className=" card game-player-card"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          {game.players.length - 1 < 9
            ? [...Array(9 - game.players.length - 1)].map((e: any, i) => {
                return <div className="game-player board-empty-player"></div>;
              })
            : ""}
          <div className="game-middle">
            <img
              className="card uno-spare"
              src="https://i.ibb.co/nLwFPvT/uno-bg.png"
              onClick={() => handleCheckCard()}
            />
            {checkFirstCard && (
              <>
                <div className="check-first-card" ref={checkFirstCardDiv}>
                  <div
                    className="check-first-card-inner"
                    ref={checkFirstCardInnerDiv}
                  >
                    <img
                      className="card check-first-card-front"
                      src="https://i.ibb.co/nLwFPvT/uno-bg.png"
                    />
                    <img
                      className="card check-first-card-back"
                      src={`/cards/${getCardName(checkFirstCard)}.png`}
                    />
                  </div>
                </div>
                <div className="check-first-buttons">
                  <button
                    className="check-first-button"
                    onClick={() => handlePlayCard(checkFirstCard, true)}
                  >
                    Graj
                  </button>
                  <button
                    className="check-first-button"
                    onClick={() => handleTakeCard(1)}
                  >
                    Weź
                  </button>
                </div>
              </>
            )}
            <img
              className="card uno-mid"
              src={`/cards/${
                getCardName(game.centerCards.latestCard) || "1cz"
              }.png`}
            />
          </div>
          <div className="game-loggedUser-cards">
            {getYoursCards().map((e: card) => {
              return (
                <img
                  src={`/cards/${getCardName(e) || "1cz"}.png`}
                  className=" card game-loggedUser-card"
                  onClick={() => handlePlayCard(e, false)}
                />
              );
            })}
          </div>
          <div className="game-bottom-buttons">
            <button className="game-bottom-button main-button button-style-1">
              Czat
            </button>
          </div>
        </div>
      ) : (
        ""
      )} */}
</>;
