import type { Player } from "../types/Player";
import Badge from "./Badge";
import { getContrastingColor } from "./contrastingColor";
import { scoreOverride } from "../game/GameClient";

interface Props {
    player: Player;
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
    scoreOverrideActive: boolean;
}

export default function ScoreCard({ player, setStatusMessage, scoreOverrideActive }: Props) {

    async function clickScoreOverride(pos: boolean) {

        const result = await scoreOverride(player.id, pos);

        if (!result.success) {
            setStatusMessage(result.message ?? "");
            return;
        }

        setStatusMessage("");
    }

    return (
        <div className="w-full max-w-64 min-w-44 grid h-20 grid-cols-[4rem_12rem] items-center">
            <div 
                className="z-10 h-20 aspect-square" 
                onClick={() => {if (scoreOverrideActive) {clickScoreOverride(true)}}} 
                onContextMenu={(e) => {e.preventDefault(); if (scoreOverrideActive) {clickScoreOverride(false);}}}
            >
                <Badge player={player} />
            </div>
            <div className="pl-3">
            <div className="clip-path-score bg-black p-[3px] pl-2 -ml-14 h-14">
                <div className="clip-path-score h-full w-full flex flex-col justify-center pl-10 font-bold">
                    <div className="flex-1 w-full text-lg leading-none pt-2 pb-1 pl-5"
                        style={{backgroundColor: player.color, color:getContrastingColor(player.color)}}>
                        {player.name}
                    </div>
                    <div className="flex-1 text-2xl leading-none text-black pb-1.5 pl-5 bg-white">
                        {player.score}
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}