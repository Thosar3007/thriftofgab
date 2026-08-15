import type { Player } from "../types/Player";
import { getContrastingColor } from "./contrastingColor";

interface Props {
    player: Player;
}

export default function Badge({
    player
}: Props) {

    if (!player.name[0]) {
        return;
    }

    return (

        <div className="relative flex min-h-0 h-full rounded-full bg-black p-[1px] shadow-md aspect-square">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white p-[1px] aspect-square">
                {player.avatar ? <img className="h-full w-full rounded-full aspect-square border-b border-1" src={player.avatar} /> : 
                <svg
                    viewBox="0 0 100 100"
                    className="h-full w-full rounded-full aspect-square select-none"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r="50"
                        fill={player.color}
                    />

                    <text
                        x="50"
                        y="50"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="70"
                        fontWeight="900"
                        fill={getContrastingColor(player.color)}
                        dy=".1em"
                    >
                        {player.name[0].toUpperCase()}
                    </text>
                </svg>}
            </div>
        </div>

    );

}