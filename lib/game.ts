import { useEffect, useState } from "react";

import {
  CardProps,
  generateFourDecks,
  shuffleDeck,
} from "@/app/deck";
import calculateHandValue from "./calculateHandValue";

export interface GameState {
  deck: CardProps[];
  dealerHand: CardProps[];
  playerHand: CardProps[];
  playerHand2: CardProps[];
  dealerHandValue: number | undefined;
  playerHandValue: number | undefined;
  playerHandValue2: number | undefined;
  gameStarted: boolean;
  gameOver: boolean;
  stand: boolean;
  bet: number;
  playerBalance: number;
  pregameState: boolean;
  outcome: string;
  split: boolean;
  startBetting: () => void;
  startGame: () => void;
  playerHit: () => void;
  playerStand: () => void;
  calculateWinner: (bet: number) => string;
  placeBet: (bet: number) => void;
  playerDoubleDown: () => void;
  playerSplit: () => void;
}

export const useBlackjackGame = (): GameState => {
  const [deck, setDeck] = useState<CardProps[]>([]);
  const [dealerHand, setDealerHand] = useState<CardProps[]>([]);
  const [playerHand, setPlayerHand] = useState<CardProps[]>([]);
  const [playerHand2, setPlayerHand2] = useState<CardProps[]>([]);
  const [dealerHandValue, setDealerHandValue] = useState<number>();
  const [playerHandValue, setPlayerHandValue] = useState<number>();
  const [playerHandValue2, setPlayerHandValue2] = useState<number>();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [stand, setStand] = useState<boolean>(false);
  const [bet, setBet] = useState<number>(0);
  const [betHand2, setBetHand2] = useState<number>(0);
  const [playerBalance, setPlayerBalance] = useState<number>(100);
  const [pregameState, setPregameState] = useState<boolean>(true);
  const [outcome, setOutcome] = useState<string>("");
  const [doubledDown, setDoubledDown] = useState<boolean>(false);
  const [split, setSplit] = useState<boolean>(false);

  useEffect(() => {
    calculateWinner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver === true]);

  const startBetting = () => {
    if (playerBalance > 0) {
      resetGame();
      setPregameState(true);
      setGameStarted(true);
    } else {
      alert("Game Over! You're out of money!");
    }
  };

  const startGame = () => {
    const newDeck = shuffleDeck(generateFourDecks());
    const newPlayerHand = [newDeck.pop()!, newDeck.pop()!];
    const newDealerHand = [newDeck.pop()!, newDeck.pop()!];
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameStarted(true);
    setPregameState(false);
    setPlayerHandValue(calculateHandValue(newPlayerHand));
    setDealerHandValue(calculateHandValue(newDealerHand));

    // Check if the player has blackjack
    if (calculateHandValue(newPlayerHand) === 21) {
      playerStand();
    }
  };

  const playerHit = () => {
    if (!gameOver) {
      if (
        (playerHandValue! === 21 && !split) ||
        (playerHandValue2! === 21 && split)
      ) {
        playerStand();
        return;
      }
      const newCard = deck.pop();
      if (newCard) {
        if (!split) {
          const newPlayerHand = [...playerHand, newCard];
          const newPlayerHandValue = calculateHandValue(newPlayerHand);
          setPlayerHand(newPlayerHand);
          setDeck(deck);
          setPlayerHandValue(newPlayerHandValue);
          if (newPlayerHandValue > 21) {
            if (split) {
              playerStand();
            } else {
              setGameOver(true);
              setStand(true);
            }
          }
          if (newPlayerHandValue === 21) {
            playerStand();
          }
        } else {
          const newPlayerHand2 = [...playerHand2, newCard];
          const newPlayerHandValue2 = calculateHandValue(newPlayerHand2);
          setPlayerHand2(newPlayerHand2);
          setDeck(deck);
          setPlayerHandValue2(newPlayerHandValue2);
          if (newPlayerHandValue2 > 21) {
            setGameOver(true);
            setStand(true);
          }
          if (newPlayerHandValue2 === 21) {
            playerStand();
          }
        }
      }
    }
  };

  const playerStand = () => {
    if (!gameOver) {
      if (!split) {
        setTimeout(() => {
          setStand(true);
        }, 500);
        if (!stand && playerHandValue !== 21) {
          setDoubledDown(false);
          dealerHit();
        }
      } else {
        setTimeout(() => {
          setStand(true);
        }, 500);
        if (!stand && playerHandValue2 !== 21) {
          setDoubledDown(false);
          dealerHit();
        }
      }
    }
  };

  const dealerHit = () => {
    let newDealerHand = [...dealerHand];
    let newDealerHandValue = dealerHandValue!;

    const hitDealer = () => {
      if (newDealerHandValue >= 17) {
        setGameOver(true);
        return;
      }

      const newCard = deck.pop();
      if (newCard) {
        newDealerHand.push(newCard);
        newDealerHandValue = calculateHandValue(newDealerHand);
        setDealerHand(newDealerHand);
        setDealerHandValue(newDealerHandValue);

        if (newDealerHandValue > 21) {
          setGameOver(true);
        }

        if (newDealerHandValue >= 17) {
          setGameOver(true);
        }

        setTimeout(hitDealer, 1500);
      }
    };

    setTimeout(hitDealer, 1500);
  };

  const placeBet = (bet: number) => {
    if (!pregameState || bet > playerBalance) {
      return;
    }
    setBet(bet);
    setPlayerBalance(playerBalance - bet);
  };

  const playerDoubleDown = () => {
    if (
      !gameOver &&
      !stand &&
      !doubledDown &&
      ((playerHand.length === 2 && !split) ||
        (playerHand2.length === 2 && split))
    ) {
      if (playerBalance >= bet) {
        setBet(bet * 2);
        setPlayerBalance(playerBalance - bet);
        playerHit();
        playerStand();
      } else {
        alert("You don't have enough money to double down!");
      }
    }
  };

  const playerSplit = () => {
    if (
      !gameOver &&
      playerHand.length === 2 &&
      playerHand[0].value === playerHand[1].value &&
      playerBalance >= bet
    ) {
      const newPlayerHand = [playerHand[0], deck.pop()!];
      const newPlayerHand2 = [playerHand[1], deck.pop()!];
      setSplit(true);
      setPlayerHand(newPlayerHand);
      setPlayerHand2(newPlayerHand2);
      setPlayerHandValue(calculateHandValue(newPlayerHand));
      setPlayerHandValue2(calculateHandValue(newPlayerHand2));
      setPlayerBalance(playerBalance - bet);
      setBetHand2(bet * 2);
    }
  };

  const calculateWinner = () => {
    let result = "";
    setOutcome(""); // Clear previous outcome
    setPlayerBalance((playerBalance) => {
      let newPlayerBalance = playerBalance; // Initialize with previous balance
      if (!split || (split && !stand)) {
        if (playerHandValue! > 21) {
          result = "Dealer Wins!";
        } else if (playerHandValue! === 21 && playerHand.length === 2) {
          result = "JackBlack!";
          newPlayerBalance += bet * 2.5; // Add 2.5 times the bet to balance
        } else if (dealerHandValue! === 21 && dealerHand.length === 2) {
          result = "Dealer JackBlack!";
        } else if (dealerHandValue! > 21) {
          result = "Player Wins!";
          newPlayerBalance += bet * 2; // Double the bet and add to balance
        } else if (playerHandValue! > dealerHandValue!) {
          result = "Player Wins!";
          newPlayerBalance += bet * 2; // Double the bet and add to balance
        } else if (dealerHandValue! > playerHandValue!) {
          result = "Dealer Wins!";
        } else {
          result = "Push!";
          newPlayerBalance += bet; // Return the bet to the player
        }
      } else {
        if (playerHandValue2! > 21) {
          result += "Dealer Wins!";
        } else if (playerHandValue2! === 21 && playerHand2.length === 2) {
          result += "JackBlack!";
          newPlayerBalance += bet * 2.5; // Add 2.5 times the bet to balance
        } else if (dealerHandValue! > 21) {
          result += "Player Wins!";
          newPlayerBalance += bet * 2; // Double the bet and add to balance
        } else if (playerHandValue2! > dealerHandValue!) {
          result += "Player Wins!";
          newPlayerBalance += bet * 2; // Double the bet and add to balance
        } else if (dealerHandValue! > playerHandValue2!) {
          result += "Dealer Wins!";
        } else {
          result += "Push!";
          newPlayerBalance += bet; // Return the bet to the player
        }
      }
      setOutcome(result); // Update outcome state
      return newPlayerBalance; // Return the updated balance
    });
    return result;
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setStand(false);
    setDealerHand([]);
    setPlayerHand([]);
    setPlayerHand2([]);
    setDealerHandValue(undefined);
    setPlayerHandValue(undefined);
    setPlayerHandValue2(undefined);
    setSplit(false);
    setBet(0);
  };

  return {
    deck,
    dealerHand,
    playerHand,
    playerHand2,
    dealerHandValue,
    playerHandValue,
    playerHandValue2,
    gameStarted,
    gameOver,
    stand,
    bet,
    playerBalance,
    pregameState,
    outcome,
    split,
    startBetting,
    startGame,
    playerHit,
    playerStand,
    calculateWinner,
    placeBet,
    playerDoubleDown,
    playerSplit,
  };
};
