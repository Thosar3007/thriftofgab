import type { Game } from "../types/Game";
import Panel from "./Panel";

interface Props { game: Game; }

export default function ClueOutputZone({ game }: Props) {

    const currentRound = game.currentRound;

    if (!currentRound) { return null; }

    const clueTexts = currentRound.selectedClues.map(index => {
        return currentRound.clues[index]?.text ?? "";
    });

    return (

        <Panel title="Clue Output">
            <div className="clip-path-hex flex items-center bg-black justify-center p-1 w-full h-full disabled:cursor-default">
                <div className="relative clip-path-hex flex items-center justify-center w-full h-full min-h-15 disabled:cursor-default bg-selected">
                    <div className={"font-bold text-xl text-center leading-8 whitespace-wrap overflow-hidden"}>
                        {clueTexts.join(" ")}
                    </div>
                </div>
            </div>
        </Panel>

    );
}