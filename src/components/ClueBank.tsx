import type { Game } from "../types/Game";
import { selectClue } from "../game/GameClient";
import Panel from "./Panel";
import ClueButton from "./ClueButton";

interface Props {
    game: Game;
    //engine: GameEngine;
    //setGame: React.Dispatch<React.SetStateAction<Game>>;
    playerId: string;
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function ClueBank({
    game,
    //engine,
    //setGame,
    playerId,
    setStatusMessage
}: Props) {

    // function clickClue(index: number) {
    //     const result = selectClue(game, index);
    //     if (!result.success) {
    //         setStatusMessage(result.message ?? "");
    //         return;
    //     }
    //     setStatusMessage("");
    //     setGame({ ...game });
    // }

    async function clickClue(index: number) {

        const result = await selectClue(index);

        if (!result.success) {
            setStatusMessage(result.message ?? "");
            return;
        }

        setStatusMessage("");

    }

    const rows = Array.from({ length: 40 });
    if (!game.currentRound)
        {
            return
        }
    const clues = game.currentRound.clues;
    const selected = game.currentRound.selectedClues;
    const clueGiver = game.currentRound.clueGiverId===playerId

    return (
        <Panel title="Clue Bank">
            <div className="h-full w-full grid grid-flow-col grid-cols-4 grid-rows-10 gap-1 pb-2">
                {rows.map((_, index) => {

                    const clue = clues[index];

                    let state: "empty" | "filled" | "pass" | "selected" = "empty";

                    if (clue?.pass)
                        state = "pass";
                    else if (selected.includes(index))
                        state = "selected";
                    else if (clue)
                        state = "filled";

                    return (
                        <ClueButton
                            key={index}
                            index={index}
                            clue={clue}
                            state={state}
                            clueGiver={clueGiver}
                            onClick={() => clickClue(index)}
                        />
                    );
                })}
            </div>
        </Panel>
    );
}