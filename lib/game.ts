import { useEffect, useState } from "react";

import { CardProps, generateDeck, shuffleDeck } from "@/app/deck";
import calculateHandValue from "./calculateHandValue";

export interface GameState {
  deck: CardProps[];
  dealerHand: CardProps[];
  playerHand: CardProps[];
  dealerHandValue: number | undefined;
  playerHandValue: number | undefined;
  gameStarted: boolean;
  gameOver: boolean;
  stand: boolean;
  bet: number;
  playerBalance: number;
  pregameState: boolean;
  outcome: string;
  startBetting: () => void;
  startGame: () => void;
  playerHit: () => void;
  playerStand: () => void;
  calculateWinner: (bet: number) => string;
  placeBet: (bet: number) => void;
}

export const useBlackjackGame = (): GameState => {
  const [deck, setDeck] = useState<CardProps[]>([]);
  const [dealerHand, setDealerHand] = useState<CardProps[]>([]);
  const [playerHand, setPlayerHand] = useState<CardProps[]>([]);
  const [dealerHandValue, setDealerHandValue] = useState<number>();
  const [playerHandValue, setPlayerHandValue] = useState<number>();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [stand, setStand] = useState<boolean>(false);
  const [bet, setBet] = useState<number>(0);
  const [playerBalance, setPlayerBalance] = useState<number>(100);
  const [pregameState, setPregameState] = useState<boolean>(true);
  const [outcome, setOutcome] = useState<string>("");

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
    const newDeck = shuffleDeck(generateDeck());
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
      if (playerHandValue! === 21) {
        playerStand();
        return;
      }
      const newCard = deck.pop();
      if (newCard) {
        const newPlayerHand = [...playerHand, newCard];
        const newPlayerHandValue = calculateHandValue(newPlayerHand);
        setPlayerHand(newPlayerHand);
        setDeck(deck);
        setPlayerHandValue(newPlayerHandValue);

        if (newPlayerHandValue > 21) {
          setGameOver(true);
          setStand(true);
        }

        if (newPlayerHandValue === 21) {
          playerStand();
          return;
        }
      }
    }
  };

  const playerStand = () => {
    if (!gameOver) {
      setTimeout(() => {
        setStand(true);
      }, 500);
      dealerHit();
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

  const calculateWinner = () => {
    let result = "";
    setOutcome(""); // Clear previous outcome
    setPlayerBalance((playerBalance) => {
      let newPlayerBalance = playerBalance; // Initialize with previous balance
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
    setDealerHandValue(undefined);
    setPlayerHandValue(undefined);
    setBet(0);
  };

  return {
    deck,
    dealerHand,
    playerHand,
    dealerHandValue,
    playerHandValue,
    gameStarted,
    gameOver,
    stand,
    bet,
    playerBalance,
    pregameState,
    outcome,
    startBetting,
    startGame,
    playerHit,
    playerStand,
    calculateWinner,
    placeBet,
  };
};
