"use client";

import Card from "./card";
import CardBack from "./card-back";

import { Button } from "@/components/ui/button";
import calculateHandValue from "@/lib/calculateHandValue";
import { useBlackjackGame } from "@/lib/game"

export default function HomePage() {
  const {
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
  } = useBlackjackGame();

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
          </div>
          {gameOver && (
            <div className="flex flex-col justify-center gap-y-4">
              <h2 className="text-center text-2xl text-primary">
                {calculateWinner()}
              </h2>
              <Button onClick={startGame}>Play Again</Button>
            </div>
          )}
        </div>
      ) : (
        <Button onClick={startGame}>Start Game</Button>
      )}
    </main>
  );
}
