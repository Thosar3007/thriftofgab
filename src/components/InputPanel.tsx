import { useState } from "react";

import type { Game } from "../types/Game";
import { submitClue, submitGuess, resetSelectedClues } from "../game/GameClient";
import PokeButton from "./PokeButton";
import Panel from "./Panel";

interface Props {
    game: Game;
    playerId: string;
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function InputPanel({
    game,
    playerId,
    setStatusMessage
}: Props) {

    async function clickSubmitClue() {

        const result = await submitClue(text);

        if (!result.success) {
            setStatusMessage(result.message ?? "");
            return;
        }

        setStatusMessage("");
        setText("");
    }

    async function clickSubmitGuess() {

        const result = await submitGuess(text);

        if (!result.success) {
            setStatusMessage(result.message ?? "");
            return;
        }

        setStatusMessage("");
        setText("");
    }

    async function resetClueOutput() {

        const result = await resetSelectedClues();

        if (!result.success) {
            setStatusMessage(result.message ?? "");
            return;
        }

        setStatusMessage("");

    }

    const [text, setText] = useState("");

    const isClueGiver = game.currentRound?.clueGiverId === playerId;

    const player = game.players.find(player => player.id === playerId);

    if (!player) {
        return null;
    }

    return (
        <div className="w-min">
            <Panel>
                <div className="h-full w-min flex flex-col gap-2 items-center justify-center md:flex-row">
                    <div className="flex grow-1 items-center justify-center">{isClueGiver && <PokeButton onClick={resetClueOutput}>Clue Reset!</PokeButton>}</div>
                    <input
                        className="border-b border-1 rounded-lg p-2 bg-white grow-2"
                        placeholder="Type here!"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                {(isClueGiver ? clickSubmitClue : clickSubmitGuess)()};
                            }
                        }}
                    />
                    <div className="flex grow-1 items-center justify-center"><PokeButton onClick={isClueGiver ? clickSubmitClue : clickSubmitGuess}>
                        {isClueGiver ? "Add Clue" : "Guess!"}
                    </PokeButton></div>
                </div>
            </Panel>
        </div>
    );
}