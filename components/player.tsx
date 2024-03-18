import Card from "@/app/card";
import CardBack from "@/app/card-back";
import { CardProps } from "@/app/deck";
import { Button } from "./ui/button";

interface PlayerProps {
  bet: number;
  gameOver: boolean;
  playerBalance: number;
  playerDoubleDown: () => void;
  playerHand: CardProps[];
  playerHandValue: number | undefined;
  playerHit: () => void;
  playerSplit: () => void;
  playerStand: () => void;
  split: boolean;
  stand: boolean;
  pregameState: boolean;
}

const Player = ({
  bet,
  gameOver,
  playerBalance,
  playerDoubleDown,
  playerHand,
  playerHandValue,
  playerHit,
  playerSplit,
  playerStand,
  split,
  stand,
  pregameState,
}: PlayerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <h2 className="text-xl text-primary">
        Player - ${playerBalance.toFixed(2)}
      </h2>

      <h3 className="text-lg text-primary">Bet: ${bet}</h3>
      <h3 className="text-primary">{playerHandValue ?? 0}</h3>
      <div className="flex flex-wrap gap-2">
        {pregameState ? (
          <>
            <CardBack />
            <CardBack />
          </>
        ) : (
          <div className="flex flex-col gap-y-24">
            <div className="flex justify-center gap-x-2">
              {playerHand.map((card, index) => (
                <Card key={index} suit={card.suit} value={card.value} />
              ))}
            </div>
            {/* {split &&
                    playerHand2.map((card, index) => (
                      <Card key={index} suit={card.suit} value={card.value} />
                    ))} */}

            <div className="flex gap-x-4">
              <Button
                disabled={pregameState || gameOver || stand}
                onClick={playerHit}
              >
                Hit
              </Button>
              <Button
                disabled={pregameState || gameOver || stand}
                onClick={playerStand}
              >
                Stand
              </Button>
              <Button
                disabled={
                  pregameState ||
                  gameOver ||
                  stand ||
                  playerHand.length > 2 ||
                  playerBalance < bet
                }
                onClick={playerDoubleDown}
              >
                Double Down
              </Button>
              <Button
                disabled={
                  pregameState ||
                  gameOver ||
                  playerHand.length > 2 ||
                  playerHand[0].value !== playerHand[1].value ||
                  playerBalance < bet
                }
                onClick={playerSplit}
              >
                Split
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Player;
