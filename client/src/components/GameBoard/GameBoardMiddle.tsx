import React, { useEffect, useRef } from "react";
import useCards from "../../hooks/useCards";
import useCommon from "../../hooks/useCommon";

const GameBoardMiddle = () => {
  let checkFirstCardDiv = useRef<HTMLDivElement>(null);
  let checkFirstCardInnerDiv = useRef<HTMLDivElement>(null);

  const { game } = useCommon();
  const {
    checkFirstCard,
    handlePlayCard,
    handleTakeCard,
    handleCheckCard,
    getCardName,
    colorSelect,
  } = useCards();

  const handleSelColor = (color: string) => {
    console.log("handleSelColor", colorSelect);
    if (colorSelect) {
      handlePlayCard({ ...colorSelect, color }, checkFirstCard ? true : false);
    }
  };

  useEffect(() => {
    if (checkFirstCard) {
      if (
        checkFirstCardDiv.current !== null &&
        checkFirstCardInnerDiv.current !== null
      ) {
        checkFirstCardDiv.current.classList.add("check-first-card-anim");
        checkFirstCardInnerDiv.current.classList.add(
          "check-first-card-inner-anim"
        );
      }
    }
  }, [checkFirstCard]);

  return (
    <div className="game-middle">
      <img
        className="card uno-spare"
        src="https://i.ibb.co/nLwFPvT/uno-bg.png"
        onClick={() => handleCheckCard()}
      />
      {colorSelect && (
        <div className="color-select-container">
          <button
            onClick={() => handleSelColor("red")}
            className="color-select color-select-red"
          ></button>
          <button
            onClick={() => handleSelColor("blue")}
            className="color-select color-select-blue"
          ></button>
          <button
            onClick={() => handleSelColor("green")}
            className="color-select color-select-green"
          ></button>
          <button
            onClick={() => handleSelColor("yellow")}
            className="color-select color-select-yellow"
          ></button>
        </div>
      )}
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
                src={`${getCardName(checkFirstCard)}`}
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
      {game.state !== "loading" && (
        <img
          className="card uno-mid"
          src={`${getCardName(game.centerCards.latestCard)}`}
        />
      )}
    </div>
  );
};

export default GameBoardMiddle;
