// Define the types for card suits and ranks
export type Suit = "Hearts" | "Diamonds" | "Clubs" | "Spades";
export type Value =
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | "Jack"
  | "Queen"
  | "King"
  | "Ace";

export interface CardProps {
  suit: Suit;
  value: Value;
}

// Create a function to generate a deck of cards
export function generateDeck(): CardProps[] {
  const suits: Suit[] = ["Hearts", "Diamonds", "Clubs", "Spades"];
  const values: Value[] = [
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    "Jack",
    "Queen",
    "King",
    "Ace",
  ];
  const deck: CardProps[] = [];

  suits.forEach((suit) => {
    values.forEach((value) => {
      deck.push({ suit, value });
    });
  });

  return deck;
}

export function shuffleDeck(deck: CardProps[]): CardProps[] {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
