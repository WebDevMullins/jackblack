import Image from "next/image";
import { CardProps } from "./deck";

const Card = ({ suit, value }: CardProps) => {
  return (
    <Image
      src={`/images/cards/${suit}/${value}.svg`}
      alt={`${value} of ${suit}`}
      width={100}
      height={150}
      className="rounded"
    />
  );
};
export default Card;
