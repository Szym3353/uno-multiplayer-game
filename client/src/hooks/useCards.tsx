import { useEffect, useState } from "react";
import { socket } from "../socketio";
import { card } from "../store/gameSlice";
import useCommon from "./useCommon";

export default function useCards() {
  const { game, user } = useCommon();
  const [checkFirstCard, setCheckFirstCard] = useState<null | card>(null);
  const [colorSelect, setColorSelect] = useState<false | card>(false);

  useEffect(() => {
    console.log("useCardstest", colorSelect);
  }, [colorSelect]);

  function getCardName(card: card) {
    let nameColor = "";
    switch (card.color) {
      case "red":
        nameColor = "cz";
        break;
      case "blue":
        nameColor = "b";
        break;
      case "yellow":
        nameColor = "ż";
        break;
      case "green":
        nameColor = "z";
        break;
      case "black":
        nameColor = "black";
    }

    return `/cards/${card.value}${nameColor}.png`;
  }

  const handlePlayCard = (card: card, middle: boolean) => {
    console.log("play card check 1", checkFirstCard, colorSelect, card);
    if (game.state === "started" && user) {
      if (card.color !== "black") {
        console.log("play card check 3", card);
        socket.emit(
          "play-card",
          {
            userId: user.id,
            card,
            gameId: game.id,
            middle,
          },
          (err: any, res: any) => {
            console.log("Callback1", res, err);
            if (err === null) {
              console.log("Callback2", res, err);
              console.log("tu sie coś ten?");
              setCheckFirstCard(null);
              setColorSelect(false);
            } else {
              console.log(err);
            }
          }
        );
      } else {
        console.log("play card check 2", card);
        setColorSelect(card);
      }
    }
  };

  const handleTakeCard = (number: number) => {
    if (game.state === "started" && user) {
      socket.emit("take-card", {
        number,
        userId: user.id,
        gameId: game.id,
      });
      setCheckFirstCard(null);
    }
  };

  const handleCheckCard = () => {
    if (game.state === "started" && user) {
      if (game.turn === user.id) {
        socket.emit(
          "check-first",
          {
            gameId: game.id,
            userId: user.id,
          },
          (err: any, res: card) => {
            console.log("res test", res, err);
            if (res) {
              setCheckFirstCard(res);
            }
          }
        );
        /* socket.emit("take-card", {
          number,
          userId: user.id,
          gameId: game.id,
        }); */
      }
    }
  };

  return {
    getCardName,
    checkFirstCard,
    handlePlayCard,
    handleTakeCard,
    handleCheckCard,
    colorSelect,
  };
}
