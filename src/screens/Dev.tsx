import { useState } from "react";
import { engine } from "../game/engine";
import React from 'react';
import { GameEngine } from "../game/GameEngine.ts";
import type { Settings } from "../types/Settings.ts";
import type { Player } from "../types/Player.ts";
import { getPlayer } from "../game/getPlayer.ts";

export default DevScreen;

function DevScreen() {
    const [game, setGame] = useState(() => {

        const settings: Settings = {
            useTypedGuesses: true,
            categories: ["Games"],
            maxPlayers: 6
        };

        const game = engine.createGame("ABCD", settings);

        const harold: Player = {
            id: "A",
            name: "Harold",
            color: "Blue",
            score: 0,
            isHost: true
        };

        engine.addPlayer(game, harold);

        engine.addPlayer(game, {
            id: "B",
            name: "Sarah",
            color: "Red",
            score: 0,
            isHost: false
        });
        
        engine.addPlayer(game, {
            id: "C",
            name: "Mike",
            color: "Green",
            score: 0,
            isHost: false
        });

        engine.startGame(game);

        return game;

    });

    const [clue, setClue] = useState("");

    return (
        <div>
            <div>
                <p>Clue Giver: {getPlayer(game, game.currentRound!.clueGiverId).name}</p>
                <p>Players Who Guessed: {game.currentRound?.playersLockedOut.map(player => player).join(" ")}</p>
                <p>Scores</p>
                <p>{game.players.map(player => {return(player.name+" ("+player.color+") : "+player.score)}).join(" ")}</p>
            </div>
            <input
                value={clue}
                onChange={(e) => setClue(e.target.value)}
            />

            <button
                onClick={() => {
                    const result = engine.submitClue(game, clue);
                    setGame({...game});
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }
                    setClue("");
                }}
            >
                Submit
            </button>

            <ul>
                {game.currentRound?.clues.map((clue, index) => (
                <li
                    key={index}
                    onClick={() => {
                        engine.selectClue(
                            game,
                            index
                        );
                        setGame({...game});
                    }}
                >
                    {clue.text}
                </li>
                ))}
            </ul>
            <p>
                Current Answer:
                {" "}
                {game.currentRound?.answers[
                    game.currentRound.answers.length - 1
                ]?.text}
            </p>
            <div>
                <p>Clue Output Zone</p>
                <p>{game.currentRound?.selectedClues.map(index => game.currentRound?.clues[index]?.text).join(" ")}</p>
            </div>
        </div>
    )
}