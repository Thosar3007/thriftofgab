import Panel from "./Panel";
import type { Round } from "../types/Round";
import { useEffect, useRef } from "react";

interface Props {
    round: Round | null;
}

export default function RecentGuesses({ round }: Props) {

    const scrollBox = useRef<HTMLDivElement>(null);
    const isNearBottom = useRef(true);

    function handleScroll() {
        const container = scrollBox.current;
        if (!container) return;

        const threshold = 1; 
        const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;

        isNearBottom.current = (distanceFromBottom <= threshold);
    };

    if (!round) {
        return (
            <Panel title="Recent Guesses">
                <div></div>
            </Panel>
        );
    }

    const guesses = round.recentGuesses.slice(-5).reverse();

    useEffect(() => {
        const container = scrollBox.current;
        if (!container) return;

        if (!isNearBottom.current) {
        container.scrollTop = container.scrollHeight;
        }
    }, [guesses]);

    return (
        <Panel title="Recent Guesses">

            <div ref={scrollBox} className="flex flex-col-reverse h-full min-h-0 gap-1 overflow-auto scrollbar-none w-full p-3">

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