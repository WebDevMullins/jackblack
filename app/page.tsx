"use client";

import { useState } from "react";

import Card from "./card";
import CardBack from "./card-back";
import { CardProps, generateDeck, shuffleDeck } from "./deck";

import { Button } from "@/components/ui/button";
import calculateHandValue from "@/lib/calculateHandValue"

export default function HomePage() {
  const [deck, setDeck] = useState<CardProps[]>([]);
  const [dealerHand, setDealerHand] = useState<CardProps[]>([]);
  const [playerHand, setPlayerHand] = useState<CardProps[]>([]);
  const [dealerHandValue, setDealerHandValue] = useState<CardProps[]>([]);
  const [playerHandValue, setPlayerHandValue] = useState<CardProps[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    const deck = shuffleDeck(generateDeck());
    const playerHand = [deck.pop()!, deck.pop()!];
    const dealerHand = [deck.pop()!, deck.pop()!];
    setDeck(deck);
    setPlayerHand(playerHand);
    setDealerHand(dealerHand);
    setGameStarted(true);
    setGameOver(false);
    calculateHandValue(playerHand);

  };

  const handleHit = () => {
    if (!gameOver) {
      const newCard = deck.pop();
      if (newCard) {
        setPlayerHand([...playerHand, newCard]);
        setDeck(deck);
      }
    }
  };

  const handleStand = () => {
    if (!gameOver) {
      setGameOver(true);
    }
  };

  return (
    <main className="bg-background dark flex min-h-screen flex-col items-center gap-y-16 p-24">
      <h1 className="text-primary text-6xl font-bold">JackBlack</h1>
      {gameStarted ? (
        <div className="flex flex-col items-center justify-center gap-y-24">
          <div className="flex flex-col items-center justify-center gap-y-4">
            <h2 className="text-primary text-xl">Dealer Cards:</h2>
            <div className="flex gap-2">
              <Card suit={dealerHand[0].suit} value={dealerHand[0].value} />
              {/* Display only the first card of the dealer */}
              <CardBack />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-4">
            <h2 className="text-primary text-xl">Player Cards:</h2>
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
        </div>
      ) : (
        <Button onClick={startGame}>Start Game</Button>
      )}
    </main>
  );
}
