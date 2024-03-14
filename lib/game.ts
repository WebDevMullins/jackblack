import { useState } from "react";

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
  startGame: () => void;
  handleHit: () => void;
  handleStand: () => void;
  calculateWinner: () => string;
}

export const useBlackjackGame = (): GameState => {
  const [deck, setDeck] = useState<CardProps[]>([]);
  const [dealerHand, setDealerHand] = useState<CardProps[]>([]);
  const [playerHand, setPlayerHand] = useState<CardProps[]>([]);
  const [dealerHandValue, setDealerHandValue] = useState<number>();
  const [playerHandValue, setPlayerHandValue] = useState<number>();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [stand, setStand] = useState<boolean>(false);

  const startGame = () => {
    const newDeck = shuffleDeck(generateDeck());
    const newPlayerHand = [newDeck.pop()!, newDeck.pop()!];
    const newDealerHand = [newDeck.pop()!, newDeck.pop()!];
    setDeck(newDeck);
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameStarted(true);
    setGameOver(false);
    setStand(false);
    setPlayerHandValue(calculateHandValue(newPlayerHand));
    setDealerHandValue(calculateHandValue(newDealerHand));
  };

  const handleHit = () => {
    if (!gameOver) {
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
      }
    }
  };

  const handleStand = () => {
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

  const calculateWinner = () => {
    if (playerHandValue! > 21) {
      return "Dealer Wins!";
    } else if (playerHandValue! === 21 && playerHand.length === 2) {
      return "JackBlack!";
    } else if (dealerHandValue! === 21 && dealerHand.length === 2) {
      return "Dealer JackBlack!";
    } else if (dealerHandValue! > 21) {
      return "Player Wins!";
    } else if (playerHandValue! > dealerHandValue!) {
      return "Player Wins!";
    } else if (dealerHandValue! > playerHandValue!) {
      return "Dealer Wins!";
    } else {
      return "Push!";
    }
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
    startGame,
    handleHit,
    handleStand,
    calculateWinner,
  };
};
