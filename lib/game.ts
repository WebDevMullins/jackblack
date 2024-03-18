import { useEffect, useState } from "react";

import { CardProps, generateFourDecks, shuffleDeck } from "@/app/deck";
import calculateHandValue from "./calculateHandValue";

const TESTING = true;

export interface GameState {
  deck: CardProps[];
  dealerHand: CardProps[];
  playerHands: { cards: CardProps[]; value: number | undefined }[];
  dealerHandValue: number | undefined;
  playerHandValue: number | undefined;
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
  playerHit: (index: number) => void;
  playerStand: (index: number) => void;
  calculateWinner: () => string;
  placeBet: (bet: number) => void;
  playerDoubleDown: (index: number) => void;
  playerSplit: (index: number) => void;
  handIndex: number;
}

export const useBlackjackGame = (): GameState => {
  const [deck, setDeck] = useState<CardProps[]>([]);
  const [dealerHand, setDealerHand] = useState<CardProps[]>([]);
  const [playerHands, setPlayerHands] = useState<
    {
      cards: CardProps[];
      value: number | undefined;
    }[]
  >([]);
  const [dealerHandValue, setDealerHandValue] = useState<number>();
  const [playerHandValue, setPlayerHandValue] = useState<number>();
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [stand, setStand] = useState<boolean>(false);
  const [bet, setBet] = useState<number>(0);
  const [playerBalance, setPlayerBalance] = useState<number>(100);
  const [pregameState, setPregameState] = useState<boolean>(true);
  const [outcome, setOutcome] = useState<string>("");
  const [doubledDown, setDoubledDown] = useState<boolean>(false);
  const [split, setSplit] = useState<boolean>(false);
  const [handIndex, setHandIndex] = useState<number>(0);

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
    setHandIndex(0);
    if (TESTING) {
      const testingPlayerHand: CardProps[] = [
        { suit: "Hearts", value: "Ace" },
        { suit: "Hearts", value: "Ace" },
      ];
      const testingDealerHand: CardProps[] = [
        { suit: "Hearts", value: 2 },
        { suit: "Hearts", value: 3 },
      ];
      setDeck(shuffleDeck(generateFourDecks()));
      setPlayerHands([
        {
          cards: testingPlayerHand,
          value: calculateHandValue(testingPlayerHand),
        },
      ]);
      setDealerHand(testingDealerHand);
      setGameStarted(true);
      setPregameState(false);
      setPlayerHandValue(calculateHandValue(testingPlayerHand));
      setDealerHandValue(calculateHandValue(testingDealerHand));

      // Check if the player has blackjack
      if (calculateHandValue(testingPlayerHand) === 21) {
        playerStand(0);
      }
    } else {
      const newDeck = shuffleDeck(generateFourDecks());
      const newPlayerHand = [newDeck.pop()!, newDeck.pop()!];
      const newDealerHand = [newDeck.pop()!, newDeck.pop()!];
      setDeck(newDeck);
      setPlayerHands([
        { cards: newPlayerHand, value: calculateHandValue(newPlayerHand) },
      ]);
      setDealerHand(newDealerHand);
      setGameStarted(true);
      setPregameState(false);
      setPlayerHandValue(calculateHandValue(newPlayerHand));
      setDealerHandValue(calculateHandValue(newDealerHand));

      // Check if the player has blackjack
      if (calculateHandValue(newPlayerHand) === 21) {
        playerStand(0);
      }
    }
  };

  const playerHit = (index: number) => {
    if (!gameOver) {
      const newCard = deck.pop();
      if (newCard) {
        const updatedPlayerHands = [...playerHands];
        updatedPlayerHands[handIndex].cards.push(newCard);
        updatedPlayerHands[handIndex].value = calculateHandValue(
          updatedPlayerHands[handIndex].cards,
        );
        setDeck(deck);
        setPlayerHands(updatedPlayerHands);
        setHandIndex(index);
        if (updatedPlayerHands[handIndex].value! > 21) {
          setGameOver(true);
          setStand(true);
        }

        if (updatedPlayerHands[handIndex].value === 21) {
          playerStand(handIndex);
        }
      }
    }
  };
  const playerStand = (index: number) => {
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
        setHandIndex(index + 1);
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

  const playerDoubleDown = (index: number) => {
    if (!gameOver && !stand && !doubledDown) {
      setHandIndex(index);
      if (playerBalance >= bet) {
        setBet(bet * 2);
        setPlayerBalance(playerBalance - bet);
        playerHit(handIndex);
        playerStand(handIndex);
      } else {
        alert("You don't have enough money to double down!");
      }
    }
  };

  const playerSplit = (index: number) => {
    if (
      !gameOver &&
      playerHands.length === 1 &&
      playerHands[0].cards.length === 2 &&
      playerHands[0].cards[0].value === playerHands[0].cards[1].value &&
      playerBalance >= bet
    ) {
      const newDeck = [...deck];
      const firstCard = newDeck.pop();
      const secondCard = newDeck.pop();

      if (firstCard && secondCard) {
        const newPlayerHands = [
          {
            cards: [playerHands[handIndex].cards[0], firstCard],
            value: calculateHandValue([
              playerHands[handIndex].cards[0],
              firstCard,
            ]),
          },
          {
            cards: [playerHands[handIndex].cards[1], secondCard],
            value: calculateHandValue([
              playerHands[handIndex].cards[1],
              secondCard,
            ]),
          },
        ];

        setPlayerHands(newPlayerHands);
        setDeck(newDeck);
        setPlayerBalance(playerBalance - bet);
        setSplit(true);
        setHandIndex(index);
      }
    }
  };

  const calculateWinner = () => {
    let result = "";
    setOutcome(""); // Clear previous outcome

    const playerHandValue =
      playerHands.length > 0 ? playerHands[handIndex].value : undefined;

    // Calculate player balance based on the current balance
    setPlayerBalance((playerBalance) => {
      let newPlayerBalance = playerBalance; // Initialize with previous balance

      if (playerHandValue === undefined) {
        // Handle the case when player hand value is undefined
        result = "No player hand available";
      } else if (dealerHandValue === undefined) {
        // Handle the case when dealer hand value is undefined
        result = "No dealer hand available";
      } else if (playerHandValue > 21) {
        result = "Dealer Wins!";
      } else if (
        playerHandValue === 21 &&
        playerHands[handIndex].cards.length === 2
      ) {
        result = "JackBlack!";
        newPlayerBalance += bet * 2.5; // Add 2.5 times the bet to balance
      } else if (dealerHandValue === 21 && dealerHand.length === 2) {
        result = "Dealer JackBlack!";
      } else if (dealerHandValue > 21) {
        result = "Player Wins!";
        newPlayerBalance += bet * 2; // Double the bet and add to balance
      } else if (playerHandValue > dealerHandValue) {
        result = "Player Wins!";
        newPlayerBalance += bet * 2; // Double the bet and add to balance
      } else if (dealerHandValue > playerHandValue) {
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
    setPlayerHands([]);
    setDealerHandValue(undefined);
    setPlayerHandValue(undefined);
    setSplit(false);
    setBet(0);
    setHandIndex(0);
  };

  return {
    deck,
    dealerHand,
    playerHands,
    dealerHandValue,
    playerHandValue,
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
    handIndex,
  };
};
