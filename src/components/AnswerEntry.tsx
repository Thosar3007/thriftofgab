import type { Answer } from "../types/Answer";
import Badge from "./Badge";
import { getPlayer } from "../game/getPlayer";
import type { Game } from "../types/Game";

interface Props {
    index: number;
    answer?: Answer | undefined;
    game: Game;
}

export default function AnswerEntry({
    index,
    answer,
    game,
}: Props) {

    let textSize = "text-lg";

    if (answer && answer.text.length > 20)
        textSize = "text-base";

    if (answer && answer.text.length > 25)
        textSize = "text-sm";
    

    return (
        <div className={`${(answer==undefined || answer.guessed)? "hidden" : ""} clip-path-hex md:flex items-center bg-black justify-center p-1 w-full aspect-[9.5/1] disabled:cursor-default`}>
            <div className="relative clip-path-hex flex items-center justify-center w-full h-full disabled:cursor-default" style={answer?.guessed ? {backgroundColor: "var(--color-selected)"} : {backgroundColor: "var(--color-blue)"}}>
                <div className={`${textSize} font-bold text-center leading-none whitespace-nowrap overflow-hidden min-w-[25ch]`}>
                    {answer ? answer.text : index + 1}
                </div>
                {answer?.guessedBy ? <div className="absolute h-[80%] left-3"><Badge player={getPlayer(game, answer.guessedBy)} /></div> : ""}
            </div>
        </div>
    );
}