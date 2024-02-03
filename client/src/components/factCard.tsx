interface FactCardProps {
  facts: string[];
  guesses: string[];
}

const FactCard: React.FC<FactCardProps> = ({ facts, guesses }) => {
  return (
    <div className="flex flex-col gap-2 p-2 bg-neutral-300 rounded-md">
      <ol className="flex-grow list-decimal list-inside">
        {facts.map((fact) => (
          <li key={fact}>{fact}</li>
        ))}
      </ol>
      <div className="flex gap-1 flex-wrap">
        {guesses.map((guess) => (
          <div key={guess} className="bg-amber-200 px-1 rounded-sm">
            {guess}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FactCard;
