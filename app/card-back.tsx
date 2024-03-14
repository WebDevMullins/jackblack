import Image from "next/image";

const CardBack = () => {
  return (
    <Image
      src={`/images/cards/back.svg`}
      alt={`cardback`}
      width={100}
      height={150}
      className="rounded"
    />
  );
};
export default CardBack;
