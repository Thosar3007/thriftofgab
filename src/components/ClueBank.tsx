import type { Game } from "../types/Game";
import { selectClue } from "../game/GameClient";
import Panel from "./Panel";
import ClueButton from "./ClueButton";

interface Props {
    game: Game;
    playerId: string;
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function ClueBank({
    game,
    playerId,
    setStatusMessage
}: Props) {

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
            <div className="h-full w-full flex flex-col md:grid md:grid-flow-col md:grid-cols-4 md:grid-rows-10 gap-1 pb-2">
                {rows.map((_, index) => {

                    const clue = clues[index];
                    const length = clues.length + 2;
                    const hidden = (length < index)

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
                            hideMobile={hidden}
                        />
                    );
                })}
            </div>
        </Panel>
    );
}