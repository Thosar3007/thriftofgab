import { useMemo } from "react";
import React from 'react';
import type { Game } from "../types/Game.ts";
import type { Player } from "../types/Player.ts";
import { getPlayer } from "../game/getPlayer.ts";
import CurrentScores from "../components/CurrentScores.tsx";
import PokeButton from "../components/PokeButton.tsx";

interface Props {
    game: Game;
    playerId?: string;
    statusMessage: string;
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function GameOverScreen({game, playerId, statusMessage, setStatusMessage}: Props) {
    const players = game.players;

    const { topPlayers, otherPlayers } = useMemo(() => {
        if (players.length === 0) {
        return { topPlayers: [], otherPlayers: [] };
        }

        let maxScore = -Infinity;
        let top: Player[] = [];
        let others: Player[] = [];

        for (const player of players) {
        if (player.score > maxScore) {
            others.push(...top);
            maxScore = player.score;
            top = [player]; 
        } else if (player.score === maxScore) {
            top.push(player);
        } else {
            others.push(player);
        }
        }

        return { topPlayers: top, otherPlayers: others };
    }, [players]); 

    function RefreshButton() {
        window.location.reload();
    }

    return (
        <div className="flex flex-col h-full w-full items-center justify-between p-4">
            <div className="flex flex-col w-full items-center justify-start gap-3">
                <div className="flex min-w-[25rem] items-center justify-center rounded-lg border border-gold bg-gradient-to-r from-light via-dark to-light shadow-md shadow-slate-900/15 tracking-wide mb-3">
                    <div className="flex min-h-[7rem] px-3 items-center justify-center font-bold -skew-x-25 text-5xl bg-[linear-gradient(-3deg,var(--color-gold),var(--color-gold),var(--color-background),var(--color-gold),var(--color-gold))] bg-clip-text text-transparent [-webkit-text-stroke:1px_navy]">
                        {topPlayers.map((player, index) => (
                                <span key={player.id}>{player.name}{!(index===topPlayers.length-1) ? " and " : " win"}{topPlayers.length>1 ? "" : "s"}!</span>
                            ))}
                    </div>
                </div>
                <CurrentScores players={topPlayers} setStatusMessage={setStatusMessage} scoreOverrideActive={false} />
                <CurrentScores players={otherPlayers} setStatusMessage={setStatusMessage} scoreOverrideActive={false} />
            </div>
            <div className="flex justify-self-end self-end">
                <PokeButton onClick={RefreshButton}>
                    Start A New Game!
                </PokeButton>
            </div>
        </div>
    )
}