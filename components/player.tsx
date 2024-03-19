import CardBack from "@/app/card-back";
import { CardProps } from "@/app/deck";
import ActionButtons from "./action-buttons";
import PlayerHands from "./player-hands";

interface PlayerProps {
  bet: number;
  gameOver: boolean;
  playerBalance: number;
  playerDoubleDown: (handIndex: number) => void;
  playerHands: {
    cards: CardProps[];
    value: number | undefined;
    state: string;
    outcome: string | undefined;
  }[];
  playerHandValue: number | undefined;
  playerHit: (handIndex: number) => void;
  playerSplit: (handIndex: number) => void;
  playerStand: (handIndex: number) => void;
  split: boolean;
  stand: boolean;
  pregameState: boolean;
  handIndex: number;
}

const Player = ({
  bet,
  gameOver,
  playerBalance,
  playerDoubleDown,
  playerHands,
  playerHit,
  playerSplit,
  playerStand,
  split,
  stand,
  pregameState,
  handIndex,
}: PlayerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <h2 className="text-xl text-primary">
        Player - ${playerBalance.toFixed(2)}
      </h2>

      <h3 className="text-lg text-primary">Bet: ${bet}</h3>
      <div className="flex flex-wrap gap-2">
        {pregameState ? (
          <>
            <CardBack />
            <CardBack />
          </>
        ) : (
          <div className="flex flex-col gap-y-8">
            <PlayerHands
              bet={bet}
              gameOver={gameOver}
              playerBalance={playerBalance}
              playerDoubleDown={() => playerDoubleDown(handIndex)}
              playerHands={playerHands}
              playerHit={() => playerHit(handIndex)}
              playerSplit={() => playerSplit(handIndex)}
              playerStand={() => playerStand(handIndex)}
              pregameState={pregameState}
              stand={stand}
              handIndex={handIndex}
            />
            <div className="flex gap-x-4">
              <ActionButtons
                bet={bet}
                gameOver={gameOver}
                playerBalance={playerBalance}
                playerDoubleDown={() => playerDoubleDown(handIndex)}
                playerHand={playerHands[handIndex].cards}
                playerHit={() => playerHit(handIndex)}
                playerSplit={() => playerSplit(handIndex)}
                playerStand={() => playerStand(handIndex)}
                pregameState={pregameState}
                stand={stand}
                handIndex={handIndex}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Player;
