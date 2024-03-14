"use client";

import Card from "./card";
import CardBack from "./card-back";

import { Button } from "@/components/ui/button";
import calculateHandValue from "@/lib/calculateHandValue";
import { useBlackjackGame } from "@/lib/game";

export default function HomePage() {
  const {
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
                {pregameState ? 0 : calculateHandValue([dealerHand[0]])}
              </h3>
            )}
            <div className="flex gap-2">
              {stand ? (
                dealerHand.map((card, index) => (
                  <Card key={index} suit={card.suit} value={card.value} />
                ))
              ) : (
                <>
                  {pregameState ? (
                    <CardBack />
                  ) : (
                    <Card
                      suit={dealerHand[0].suit}
                      value={dealerHand[0].value}
                    />
                  )}
                  <CardBack />
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-y-4">
            <h2 className="text-xl text-primary">
              Player - ${playerBalance} - Bet: ${bet}
            </h2>
            <h3 className="text-primary">{playerHandValue ?? 0}</h3>
            <div className="flex flex-wrap gap-2">
              {pregameState ? (
                <>
                  <CardBack />
                  <CardBack />
                </>
              ) : (
                <>
                  {playerHand.map((card, index) => (
                    <Card key={index} suit={card.suit} value={card.value} />
                  ))}
                </>
              )}
            </div>
          </div>
          <div className="flex gap-x-4">
            <Button disabled={pregameState} onClick={playerHit}>
              Hit
            </Button>
            <Button disabled={pregameState} onClick={playerStand}>
              Stand
            </Button>
          </div>
          <div className="flex gap-x-4">
            <Button
              disabled={!pregameState || bet > 0}
              onClick={() => placeBet(1)}
            >
              Bet $1
            </Button>
            <Button
              disabled={!pregameState || bet > 0 || playerBalance < 5}
              onClick={() => placeBet(5)}
            >
              Bet $5
            </Button>
            <Button
              disabled={!pregameState || bet > 0 || playerBalance < 25}
              onClick={() => placeBet(25)}
            >
              Bet $25
            </Button>
            <Button
              disabled={!pregameState || bet > 0 || playerBalance < 50}
              onClick={() => placeBet(50)}
            >
              Bet $50
            </Button>
            <Button disabled={!pregameState || bet === 0} onClick={startGame}>
              Deal
            </Button>
          </div>
          {gameOver && (
            <div className="flex flex-col justify-center gap-y-4">
              <h2 className="text-center text-2xl text-primary">{outcome}</h2>
              <Button onClick={startBetting}>Play Again</Button>
            </div>
          )}
        </div>
      ) : (
        <Button onClick={startBetting}>Start Game</Button>
      )}
    </main>
  );
}
