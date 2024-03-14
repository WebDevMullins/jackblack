"use client";

import { useState } from "react";

import Card from "./card";
import CardBack from "./card-back";
import { CardProps, generateDeck, shuffleDeck } from "./deck";

import { Button } from "@/components/ui/button";
import calculateHandValue from "@/lib/calculateHandValue";

export default function HomePage() {
  const [deck, setDeck] = useState<CardProps[]>([]);
  const [dealerHand, setDealerHand] = useState<CardProps[]>([]);
  const [playerHand, setPlayerHand] = useState<CardProps[]>([]);
  const [dealerHandValue, setDealerHandValue] = useState<number>();
  const [playerHandValue, setPlayerHandValue] = useState<number>();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [stand, setStand] = useState<boolean>(false);

  const startGame = () => {
    const deck = shuffleDeck(generateDeck());
    const playerHand = [deck.pop()!, deck.pop()!];
    const dealerHand = [deck.pop()!, deck.pop()!];
    setDeck(deck);
    setPlayerHand(playerHand);
    setDealerHand(dealerHand);
    setGameStarted(true);
    setGameOver(false);
    setStand(false);
    setPlayerHandValue(calculateHandValue(playerHand));
    setDealerHandValue(calculateHandValue(dealerHand));
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

        // Check if player busts
        if (newPlayerHandValue > 21) {
          setGameOver(true);
          setStand(true);
          calculateWinner();
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
      // Check if dealer reached 17 or more
      if (newDealerHandValue >= 17) {
        setGameOver(true);
        calculateWinner();
        return;
      }

      const newCard = deck.pop();
      if (newCard) {
        newDealerHand.push(newCard);
        newDealerHandValue = calculateHandValue(newDealerHand);
        setDealerHand(newDealerHand);
        setDealerHandValue(newDealerHandValue);

        // Check if dealer busts
        if (newDealerHandValue > 21) {
          setGameOver(true);
          calculateWinner();
          return;
        }

        // Check if dealer reached 17 or more
        if (newDealerHandValue >= 17) {
          setGameOver(true);
          calculateWinner();
          return;
        }

        // Continue hitting after 1 second
        setTimeout(hitDealer, 1500);
      }
    };

    // Start hitting after 1 second
    setTimeout(hitDealer, 1500);
  };

  const calculateWinner = () => {
    if (playerHandValue! > 21) {
      return "Dealer Wins!";
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

  return (
    <main className="dark flex min-h-screen flex-col items-center gap-y-16 bg-background p-24">
      <h1 className="text-6xl font-bold text-primary">JackBlack</h1>
      {gameStarted ? (
        <div className="flex flex-col items-center justify-center gap-y-24">
          <div className="flex flex-col items-center justify-center gap-y-4">
            <h2 className="text-xl text-primary">Dealer</h2>
            {stand ? (
              <h3 className="text-primary">{dealerHandValue}</h3>
            ) : (
              <h3 className="text-primary">
                {calculateHandValue([dealerHand[0]])}
              </h3>
            )}
            <div className="flex gap-2">
              {stand ? (
                dealerHand.map((card, index) => (
                  <Card key={index} suit={card.suit} value={card.value} />
                ))
              ) : (
                <>
                  <Card suit={dealerHand[0].suit} value={dealerHand[0].value} />
                  <CardBack />
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-4">
            <h2 className="text-xl text-primary">Player</h2>
            <h3 className="text-primary">{playerHandValue}</h3>
            <div className="flex flex-wrap gap-2">
              {playerHand.map((card, index) => (
                <Card key={index} suit={card.suit} value={card.value} />
              ))}
            </div>
          </div>
          <div className="flex gap-x-4">
            <Button onClick={handleHit}>Hit</Button>
            <Button onClick={handleStand}>Stand</Button>
            <Button onClick={startGame}>Play Again</Button>
          </div>
          {gameOver && (
            <h2 className="text-2xl text-primary">{calculateWinner()}</h2>
          )}
        </div>
      ) : (
        <Button onClick={startGame}>Start Game</Button>
      )}
    </main>
  );
}
