import { Button } from "./ui/button";

interface BetProps {
  pregameState: boolean;
  bet: number;
  playerBalance: number;
  placeBet: (bet: number) => void;
  startGame: () => void;
}

const Bet = ({
  pregameState,
  bet,
  playerBalance,
  placeBet,
  startGame,
}: BetProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-4">
        <Button disabled={!pregameState || bet > 0} onClick={() => placeBet(1)}>
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
      </div>
      <Button disabled={!pregameState || bet === 0} onClick={startGame}>
        Deal
      </Button>
    </div>
  );
};
export default Bet;
