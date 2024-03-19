import { useEffect, useState } from "react";

import { CardProps, generateFourDecks, shuffleDeck } from "@/app/deck";
import calculateHandValue from "./calculateHandValue";

const TESTING = true;

export interface GameState {
  deck: CardProps[];
  dealerHand: CardProps[];
  playerHands: {
    cards: CardProps[];
    value: number | undefined;
    state: "inProgress" | "stand";
    outcome: string | undefined;
  }[];
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
      state: "inProgress" | "stand";
      outcome: string | undefined;
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

  const isGameOver =
    gameOver === true && playerHands.every((hand) => hand.state === "stand");

  useEffect(() => {
    calculateWinner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

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
          state: "inProgress",
          outcome: "",
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
        {
          cards: newPlayerHand,
          value: calculateHandValue(newPlayerHand),
          state: "inProgress",
          outcome: "",
        },
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
        updatedPlayerHands[index].cards.push(newCard);
        updatedPlayerHands[index].value = calculateHandValue(
          updatedPlayerHands[index].cards,
        );
        setDeck(deck);
        setPlayerHands(updatedPlayerHands);
        setHandIndex(index);
        if (updatedPlayerHands[index].value! > 21) {
          if (index === playerHands.length - 1) {
            updatedPlayerHands[index].state = "stand";
            setPlayerHands(updatedPlayerHands);
            setGameOver(true);
            setStand(true);
          } else {
            updatedPlayerHands[index].state = "stand";
            setPlayerHands(updatedPlayerHands);
            setHandIndex(index + 1);
          }
        }

        if (updatedPlayerHands[index].value === 21) {
          playerStand(index);
        }
      }
    }
  };
  const playerStand = (index: number) => {
    if (!gameOver) {
      if (!split) {
        setTimeout(() => {
          const updatedPlayerHands = [...playerHands];
          updatedPlayerHands[handIndex].state = "stand";
          setPlayerHands(updatedPlayerHands);
          setStand(true);
        }, 500);
        if (!stand && playerHandValue !== 21) {
          setDoubledDown(false);
          dealerHit();
        }
      } else {
        setTimeout(() => {
          const updatedPlayerHands = [...playerHands];
          updatedPlayerHands[handIndex].state = "stand";
          setPlayerHands(updatedPlayerHands);
          if (playerHands.every((hand) => hand.state === "stand")) {
            setStand(true);
            dealerHit();
            // setGameOver(true);
          }
        }, 500);
        if (index !== playerHands.length - 1) {
          setHandIndex(index + 1);
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
      playerHands[handIndex].cards.length === 2 &&
      playerHands[handIndex].cards[0].value ===
        playerHands[handIndex].cards[1].value &&
      playerBalance >= bet
    ) {
      const newDeck = [...deck];
      const firstCard = newDeck.pop();
      const secondCard = newDeck.pop();

      if (firstCard && secondCard) {
        const newPlayerHands = [...playerHands];
        newPlayerHands.splice(index, 1, {
          cards: [playerHands[index].cards[0], firstCard],
          value: calculateHandValue([playerHands[index].cards[0], firstCard]),
          state: "inProgress",
          outcome: "",
        });
        newPlayerHands.splice(index + 1, 0, {
          cards: [playerHands[index].cards[1], secondCard],
          value: calculateHandValue([playerHands[index].cards[1], secondCard]),
          state: "inProgress",
          outcome: "",
        });

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
    const handResults: string[] = []; // Store the result for each hand

    // Clear previous outcome
    setOutcome("");

    // Check if all hands' state is 'stand'
    const allHandsStand = playerHands.every((hand) => hand.state === "stand");

    if (split && !allHandsStand) {
      result = "Not all hands have stood";
    } else {
      // Calculate winner for each hand
      playerHands.forEach((hand, index) => {
        const handValue = hand.value;
        if (handValue === undefined) {
          result = "No player hand available";
        } else if (dealerHandValue === undefined) {
          result = "No dealer hand available";
        } else if (handValue > 21) {
          result = "Dealer Wins!";
        } else if (handValue === 21 && hand.cards.length === 2) {
          result = "JackBlack!";
          setPlayerBalance((prevBalance) => prevBalance + bet * 2.5);
        } else if (dealerHandValue === 21 && dealerHand.length === 2) {
          result = "Dealer JackBlack!";
        } else if (dealerHandValue > 21) {
          result = "Player Wins!";
          setPlayerBalance((prevBalance) => prevBalance + bet * 2);
        } else if (handValue > dealerHandValue) {
          result = "Player Wins!";
          setPlayerBalance((prevBalance) => prevBalance + bet * 2);
        } else if (dealerHandValue > handValue) {
          result = "Dealer Wins!";
        } else {
          result = "Push!";
          setPlayerBalance((prevBalance) => prevBalance + bet);
        }
        handResults.push(result); // Store the result for each hand
        playerHands[index].outcome = result; // Update outcome for each hand
      });
    }

    setOutcome(handResults.toString()); // Update outcome state with all hand results

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
