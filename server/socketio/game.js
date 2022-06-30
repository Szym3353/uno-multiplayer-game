const Lobby = require("../models/lobby");
const User = require("../models/user");
const Game = require("../models/game");
const {
  cards,
  shuffle,
  getTurn,
  reShuffleCards,
} = require("../util/cardsFuncs");

module.exports.startGame = async (io, socket, data) => {
  try {
    const lobby = await Lobby.findById(data.lobbyId);

    let startingWithCards = 20;

    let shuffledCards = shuffle(cards);

    const gameUsers = lobby.users.map((user, index) => {
      return {
        username: user.username,
        id: user.id,
        cards: shuffledCardsForUser(index),
        stopped: 0,
      };
    });

    function shuffledCardsForUser(index) {
      let returnedValue = [];
      for (let i = 0; i < startingWithCards; i++) {
        returnedValue.push(shuffledCards[i + startingWithCards * index]);
      }
      return returnedValue;
    }

    //console.log(shuffledCards[0], gameUsers[0].cards[0]);
    /* console.log(
      "test",
      shuffledCards.length,
      shuffledCards.slice(
        gameUsers.length * startingWithCards + 1,
        shuffledCards.length
      ).length
    );

    console.log(
      "another test",
      shuffledCards[15],
      shuffledCards[gameUsers.length * startingWithCards + 1]
    ); */
    /* let spareCards = shuffledCards.slice(
      gameUsers.length * startingWithCards + 1,
      shuffledCards.length
    ); */
    //console.log("Test on new game", spareCards);
    const newGame = new Game({
      lobbyId: data.lobbyId,
      players: gameUsers,
      spareCards: shuffledCards.slice(
        gameUsers.length * startingWithCards + 2,
        shuffledCards.length
      ),
      centerCards: [shuffledCards[gameUsers.length * startingWithCards + 1]],
      winners: [],
      direction: 1,
      turn: gameUsers[0].id,
      state: "started",
      specialActive: false,
      onPlus: 0,
    });

    newGame.save();

    lobby.gameId = newGame._id;
    lobby.gameState = "started";
    lobby.users = lobby.users.map((el) => ({
      id: el.id,
      username: el.username,
      stillInGame: true,
    }));

    lobby.save();

    io.to(`${data.lobbyId}`).emit("starting-game", { gameId: newGame._id });
  } catch (error) {
    console.log(error);
  }
};

module.exports.playCard = async (io, socket, data, callBackFunc) => {
  try {
    console.log("PLAYCARD CARD", data.card);
    const game = await Game.findById(data.gameId);
    const lobby = await Lobby.findById(game.lobbyId);

    let playerIndex = game.players.findIndex((el) => el.id === data.userId);

    function throwCardMid() {
      let playerIndex = game.players.findIndex((el) => el.id === data.userId);

      if (!data.middle) {
        if (data.card.value !== "color") {
          game.players[playerIndex].cards.splice(
            game.players[playerIndex].cards.findIndex(
              (card) =>
                card.value == data.card.value && card.color == data.card.color
            ),
            1
          );
        } else {
          game.players[playerIndex].cards.splice(
            game.players[playerIndex].cards.findIndex(
              (card) => card.value === "color" && card.color === "black"
            ),
            1
          );
        }
      } else if (data.middle) {
        game.spareCards.shift();
      }
    }

    //checkTurn
    if (game.turn !== data.userId) {
      callBackFunc("turn", null);
      throw new Error("To nie twój ruch.");
    }

    //checkCard
    if (!game.specialActive) {
      console.log(
        "CHECK CARD 1",
        game.centerCards[game.centerCards.length - 1],
        "====================",
        data.card
      );
      //if(data.)
      if (
        game.centerCards[game.centerCards.length - 1].value ===
          data.card.value ||
        game.centerCards[game.centerCards.length - 1].color ===
          data.card.color ||
        data.card.value === "color"
      ) {
        console.log("CHECK CARD 2");
        if (data.card.special && data.card.value !== "rev") {
          console.log("CHECK CARD 3");
          if (data.card.value === "+2") {
            game.onPlus += 2;
          }
          if (data.card.value === "stop") {
            game.onPlus += 1;
          }
          game.specialActive = true;
          callBackFunc(null, {
            specialActive: game.specialActive,
            onPlus: game.onPlus,
          });
        }
        throwCardMid();
      } else {
        callBackFunc("match", null);
        throw new Error("Ta karta nie pasuje");
      }
    } else if (game.specialActive) {
      console.log("CHECK CARD 4");
      if (
        game.centerCards[game.centerCards.length - 1].value === data.card.value
      ) {
        console.log("check kurwa");
        throwCardMid();
        if (data.card.value === "+2") {
          game.onPlus += 2;
        }
        if (data.card.value === "stop") {
          game.onPlus += 1;
        }
      } else {
        callBackFunc("tak", null);
        throw new Error("Ta karta nie pasuje");
      }

      console.log("CHECK CARD 5");
      /* if (data.card.value === "rev") {
        console.log("CHECK CARD 6");
        if (
          game.centerCards[game.centerCards.length - 1].value ===
            data.card.value ||
          game.centerCards[game.centerCards.length - 1].color ===
            data.card.color
        ) {
          console.log("CHECK CARD 7");
          game.direction = -game.direction;
          throwCardMid();
        }
      } */
    }
    callBackFunc(null, "");

    //checkCard
    /* if (!game.specialActive) {
      if (
        game.centerCards[game.centerCards.length - 1].value !==
          data.card.value &&
        game.centerCards[game.centerCards.length - 1].color !== data.card.color
      ) {
        throw new Error("Ta karta nie pasuje.");
      }
      if (game.turn !== data.userId) {
        throw new Error("To nie twój ruch.");
      }
      if (data.card.special) {
        setSpecialThisTurn = true;
        //game.specialActive = true;
      }
    } else if (game.specialActive && !data.card.special) {
      throw new Error("Ta karta nie pasuje.");
    } else if (game.specialActive && data.card.special) {
      if (
        game.centerCards[game.centerCards.length - 1].value !==
          data.card.value &&
        game.centerCards[game.centerCards.length - 1].color !== data.card.color
      ) {
        throw new Error("Ta karta nie pasuje.");
      }
      if (game.turn !== data.userId) {
        throw new Error("To nie twój ruch.");
      }
    } */

    /* else if(game.specialActive && !data.card.special){
    }else if(game.specialActive  && data.card.special){
      switch (data.card.value){
        case 'stop': 

      }
    } */

    /* let playerIndex = game.players.findIndex((el) => el.id === data.userId);

    if (!data.middle) {
      game.players[playerIndex].cards.splice(
        game.players[playerIndex].cards.findIndex(
          (card) =>
            card.value == data.card.value && card.color == data.card.color
        ),
        1
      );
    } else if (data.middle) {
      game.spareCards.shift();
    } */

    //special cards effect
    /* if (data.card.special) {
      if (data.card.value === "rev") {
        console.log("check1", game.direction);
        game.direction = -game.direction;
        console.log("check2", game.direction);
      }
    } */
    /* if(data.card.special){
      switch(data.card.value){
        case 'stop':
          if(game.specialActive){
            console.log('check1')
            
          }
          break;
      }
    } */

    //Zmiana ruchu i środkowej karty
    game.centerCards.push(data.card);
    game.turn = getTurn(game, data.userId);

    //checkWin
    if (game.players[playerIndex].cards.length === 0) {
      console.log("czy win");
      game.winners.push(game.players[playerIndex].id);
    }

    //checkEnd
    if (game.winners.length >= game.players.length / 2) {
      console.log(
        "to sie wgl ten?",
        game.winners.length,
        game.players.length / 2
      );
      game.state = "ended";
      lobby.gameState = "ended";
      lobby.save();
    }

    game.save();

    io.to(`${game.lobbyId}`).emit("played-card", {
      user: {
        id: data.userId,
        numberOfCards: game.players[playerIndex].cards.length,
      },
      cards: game.players[playerIndex].cards,
      card: data.card,
      activatedSpecial: game.specialActive,
      win: game.winners.includes(game.players[playerIndex].id),
      end: game.state === "ended",
      turn: game.turn,
    });

    /* let newNumberOfCards = 0;
    let newPlayers = checkGame.players.map((player) => {
      if (player.id === data.userId) {
        for (let i = 0; i < player.cards.length; i++) {
          if (
            player.cards[i].value === data.card.value &&
            player.cards[i].color === data.card.color
          ) {
            player.cards.splice(i, 1);
            newNumberOfCards = player.cards.length;
            break;
          }
        }
        return player;
      } else {
        return player;
      }
    });

    const res = await Game.findByIdAndUpdate(data.gameId, {
      $push: { centerCards: data.card },
      $set: { players: newPlayers, turn: getTurn(checkGame, data.userId) },
    });
    console.log("emituje do", data.lobbyId);
     */
  } catch (error) {
    console.log(error);
  }
};

module.exports.checkFirst = async (io, socket, data, callBackFunc) => {
  try {
    let game = await Game.findById(data.gameId);
    callBackFunc(null, reShuffleCards(game, 1)[0]);
  } catch (error) {
    callBackFunc(error, null);
  }
};

module.exports.takeCard = async (io, socket, data) => {
  try {
    const game = await Game.findById(data.gameId);

    //basic check
    if (!game) {
      throw new Error("Gra o tym id nie istnieje.");
    }
    if (game.turn !== data.userId) {
      throw new Error("To nie twój ruch.");
    }

    let playerIndex = game.players.findIndex((el) => el.id === data.userId);

    /* if (game.spareCards.length < data.number) {
      if (game.centerCards.length > 1) {
        let newCards = shuffle(
          game.centerCards.slice(0, game.centerCards.length - 2)
        );
        game.centerCards.splice(0, game.centerCards.length - 1);
        game.spareCards = [...game.spareCards, ...newCards];
      }
    } */

    //define how much cards need to take and other vars
    let useNumber = data.number;

    //checkIfSpecialIsActive
    if (game.specialActive) {
      let lastCard = game.centerCards[game.centerCards.length - 1];
      if (lastCard.value === "+2") {
        useNumber = game.onPlus;
        game.onPlus = 0;
      }
      if (lastCard.value === "stop") {
        game.players[playerIndex].stopped = game.onPlus;
        game.onPlus = 0;
      }
      game.specialActive = false;
    }

    //check if able to take cards from spare, if not - take from center and reshuffle
    game.spareCards = reShuffleCards(game, useNumber);

    //take cards from spare
    let sliceCards = game.spareCards.slice(0, useNumber);
    game.spareCards.splice(0, useNumber);

    //give spare cards to player
    game.players[playerIndex].cards = [
      ...game.players[playerIndex].cards,
      ...sliceCards,
    ];

    //change turn
    game.turn = getTurn(game, data.userId);

    game.save();
    io.to(`${game.lobbyId}`).emit("took-card", {
      user: {
        id: game.players[playerIndex].id,
        numberOfCards: game.players[playerIndex].cards.length,
        stopped: game.players[playerIndex].stopped,
      },
      cards: game.players[playerIndex].cards,
      turn: game.turn,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.leaveGame = async (io, socket, data, callBackFunc) => {
  console.log("leaveGame", data);
  try {
    const game = await Game.findById(data.gameId);
    game.players = game.players.filter((el) => el.id !== data.userId);
    game.save();
    const lobby = await Lobby.findById(game.lobbyId);
    if (lobby) {
      io.to(`${game.lobbyId}`).emit("user-left-game", {
        userId: data.userId,
      });
      callBackFunc(null, { lobbyId: game.lobbyId });
    } else {
      callBackFunc(null, null);
    }
  } catch (err) {
    callBackFunc(err, null);
  }
};
