import type { Player } from "../types/Player";
import ScoreCard from "./ScoreCard";

interface Props {
    players: Player[];
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
    scoreOverrideActive: boolean;
}

export default function CurrentScores({ players, setStatusMessage, scoreOverrideActive }: Props) {
    return (
        <div className="flex justify-center items-end gap-3 px-3 pb-3 flex-wrap h-fit">
            {players.map(player => (
                <ScoreCard
                    key={player.id}
                    player={player}
                    setStatusMessage={setStatusMessage}
                    scoreOverrideActive={scoreOverrideActive}
                />
            ))}
        </div>
    );
}