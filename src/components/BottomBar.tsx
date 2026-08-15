import { useState } from "react";

import type { Game } from "../types/Game";
import { GameEngine } from "../game/GameEngine";
import PokeButton from "./PokeButton";

interface Props {
    game: Game;
    engine: GameEngine;
    setGame: React.Dispatch<React.SetStateAction<Game>>;
    playerId: string;
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function BottomBar({
    game,
    engine,
    setGame,
    playerId,
    setStatusMessage
}: Props) {

    function submit() {
        const result = isClueGiver
            ? engine.submitClue(game, text)
            : engine.submitGuess(game, playerId, text);

        if (!result.success) {
            setStatusMessage(result.message ?? "");
            return;
        }

        setStatusMessage("");
        setText("");
        setGame({ ...game });
    }

    const [text, setText] = useState("");

    const isClueGiver = game.currentRound?.clueGiverId === playerId;

    const player = game.players.find(player => player.id === playerId);

    

    if (!player) {
        return null;
    }

    return (
        <div className="bottom-bar">
            <span>
                Score: {player.score} 
            </span>
            <span>
                Color: {player.color}
            </span>
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        submit();
                    }
                }}
            />
            <PokeButton onClick={submit}>
                {isClueGiver ? "Add Clue" : "Guess!"}
            </PokeButton>
        </div>
    );
}