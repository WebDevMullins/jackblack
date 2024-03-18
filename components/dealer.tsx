import Card from "@/app/card";
import CardBack from "@/app/card-back";
import { CardProps } from "@/app/deck";
import calculateHandValue from "@/lib/calculateHandValue";

interface DealerProps {
  dealerHand: CardProps[];
  dealerHandValue: number | undefined;
  stand: boolean;
  pregameState: boolean;
}

const Dealer = ({
  dealerHand,
  dealerHandValue,
  stand,
  pregameState,
}: DealerProps) => {
  return (
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
              <Card suit={dealerHand[0].suit} value={dealerHand[0].value} />
            )}
            <CardBack />
          </>
        )}
      </div>
    </div>
  );
};
export default Dealer;
