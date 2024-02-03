import FactCard from "./factCard";

interface FactCardGridProps {
  factses: string[][];
  guesseses: string[][];
}

const FactCardGrid: React.FC<FactCardGridProps> = ({ factses, guesseses }) => {
  return (
    <div className="grid gap-2 p-2 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
      {factses.map((facts, i) => (
        <FactCard facts={facts} guesses={guesseses[i]} key={i} />
      ))}
    </div>
  );
};

export default FactCardGrid;
