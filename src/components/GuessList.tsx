import Panel from "./Panel";
import type { Round } from "../types/Round";

interface Props {
    round: Round | null;
}

export default function RecentGuesses({ round }: Props) {

    if (!round) {
        return (
            <Panel title="Recent Guesses">
                <div></div>
            </Panel>
        );
    }

    const guesses = round.recentGuesses.slice(-5).reverse();

    return (
        <Panel title="Recent Guesses">

            <div className="flex flex-col-reverse h-full min-h-0 gap-1 overflow-hidden w-full p-3">

                {guesses.map((guess, index) => (
                    <div key={index} className="clip-path-hex flex items-center bg-black justify-center p-1 w-full aspect-[9.5/1] disabled:cursor-default">
                        <div className="relative clip-path-hex flex items-center justify-center w-full disabled:cursor-default bg-[#FFE55A]">
                            <div className={"font-bold text-base text-center leading-none whitespace-wrap overflow-hidden p-1"}>
                                {guess.text}
                            </div>
                        </div>
                    </div>
                ))}

            </div>

        </Panel>
    );

}