import { CardProps } from "@/app/deck";
import { Button } from "./ui/button";

interface ActionButtonsProps {
  playerHit: (handIndex: number) => void;
  playerStand: (handIndex: number) => void;
  playerDoubleDown: (handIndex: number) => void;
  playerSplit: (handIndex: number) => void;
  pregameState: boolean;
  gameOver: boolean;
  stand: boolean;
  bet: number;
  playerBalance: number;
  playerHand: CardProps[];
  handIndex: number;
}

const ActionButtons = ({
  playerHit,
  playerStand,
  playerDoubleDown,
  playerSplit,
  pregameState,
  gameOver,
  stand,
  bet,
  playerBalance,
  playerHand,
  handIndex,
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-x-4">
      <Button
        disabled={pregameState || gameOver || stand || handIndex > playerHand.length}
        onClick={() => playerHit(handIndex)}
      >
        Hit
      </Button>
      <Button
        disabled={pregameState || gameOver || stand}
        onClick={() => playerStand(handIndex)}
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
        onClick={() => playerDoubleDown(handIndex)}
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
        onClick={() => playerSplit(handIndex)}
      >
        Split
      </Button>
    </div>
  );
};
export default ActionButtons;
