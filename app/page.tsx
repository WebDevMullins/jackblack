"use client";

import { useBlackjackGame } from "@/lib/game";

import Bet from "@/components/bet";
import Dealer from "@/components/dealer";
import Player from "@/components/player";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const {
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
    handIndex
  } = useBlackjackGame();

  return (
    <main className="dark flex min-h-screen flex-col items-center gap-y-16 bg-background p-24">
      <h1 className="text-6xl font-bold text-primary">JackBlack</h1>
      {gameStarted ? (
        <div className="flex flex-col items-center justify-center gap-y-24">
          <Dealer
            dealerHand={dealerHand}
            dealerHandValue={dealerHandValue}
            stand={stand}
            pregameState={pregameState}
          />
          <Player
            bet={bet}
            gameOver={gameOver}
            playerBalance={playerBalance}
            playerDoubleDown={() => playerDoubleDown(handIndex)}
            playerHands={playerHands}
            playerHandValue={playerHandValue}
            playerHit={() => playerHit(handIndex)}
            playerSplit={() => playerSplit(handIndex)}
            playerStand={ () => playerStand(handIndex)}
            pregameState={pregameState}
            split={split}
            stand={stand}
            handIndex={handIndex}
          />
          {pregameState && (
            <Bet
              bet={bet}
              placeBet={placeBet}
              playerBalance={playerBalance}
              pregameState={pregameState}
              startGame={startGame}
            />
          )}
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
