import { CardProps } from "@/app/deck"

// Function to calculate the total value of a hand
export default function calculateHandValue(cards: CardProps[]): number {
  let sum = 0;
  let numAces = 0;

  for (const card of cards) {
    if (typeof card.value === 'number') {
      sum += card.value;
    } else if (card.value !== 'Ace') {
      // Face cards have a value of 10
      sum += 10;
    } else {
      // Ace card
      numAces++;
      sum += 11; // Assume Ace value as 11 initially
    }
  }

  // Adjust Ace values if necessary
  while (sum > 21 && numAces > 0) {
    sum -= 10; // Change Ace value from 11 to 1
    numAces--;
  }

  return sum;
}
