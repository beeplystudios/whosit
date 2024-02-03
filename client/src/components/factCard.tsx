interface FactCardProps {
    facts: string[],
    guesses: string[],
}

const FactCard: React.FC<FactCardProps> = ({facts, guesses}) => {
    return (
        <div className="flex flex-col gap-2 ">
            <div className="">
                {facts.map(fact => (
                    <div>{fact}</div>
                ))}
            </div>
            <div>
                {guesses.map(guess => (
                    <div>{guess}</div>
                ))}
            </div>
        </div>
    )
}

export default FactCard;