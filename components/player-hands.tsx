import Card from "@/app/card";
import { CardProps } from "@/app/deck";
import ActionButtons from "./action-buttons";

interface PlayerHandProps {
  bet: number;
  gameOver: boolean;
  playerBalance: number;
  playerDoubleDown: (handIndex: number) => void;
  playerHands: {
    cards: CardProps[];
    value: number | undefined;
  }[];
  playerHit: (handIndex: number) => void;
  playerSplit: (index: number) => void;
  playerStand: (handIndex: number) => void;
  pregameState: boolean;
  stand: boolean;
  handIndex: number;
}

const PlayerHands = ({
  bet,
  gameOver,
  playerBalance,
  playerDoubleDown,
  playerHands,
  playerHit,
  playerSplit,
  playerStand,
  pregameState,
  stand,
}: PlayerHandProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8">
      {playerHands.map((hand, index) => (
        <div key={index} className="flex flex-col justify-center items-center gap-y-8">
          <h3 className="text-primary">{hand.value ?? 0}</h3>
          <div className="flex justify-center gap-x-2">
            {hand.cards.map((card, cardIndex) => (
              <Card key={cardIndex} suit={card.suit} value={card.value} />
            ))}
          </div>
          <div className="flex gap-x-4">
            <ActionButtons
              bet={bet}
              gameOver={gameOver}
              playerBalance={playerBalance}
              playerDoubleDown={() => playerDoubleDown(index)}
              playerHand={hand.cards}
              playerHit={() => playerHit(index)}
              playerSplit={() => playerSplit(index)}
              playerStand={() => playerStand(index)}
              pregameState={pregameState}
              stand={stand}
              handIndex={index}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
export default PlayerHands;
