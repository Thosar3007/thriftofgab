import { useState } from "react";

interface Props {
    title: string;
}

export default function TitleBar({
    title
}: Props) {

    const [showHelp, setShowHelp] = useState(false);

    return (

        <div className="flex w-full items-center justify-center rounded-lg border border-gold bg-gradient-to-r from-light via-dark to-light shadow-md shadow-slate-900/15 tracking-wide">
            <div>
                {showHelp && <div className="z-1 inset-0 fixed top-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-auto h-auto flex items-center justify-center text-center border-1 border-dark rounded-lg bg-gold">
                    <div className="w-full md:w-auto h-full md:h-auto flex flex-col border-5 border-gold rounded-lg bg-dark text-white font-bold md:p-5">
                        <div className="flex flex-col h-full md:h-auto items-center md:justify-between gap-1">
                            <div className="flex flex-col gap-3 md:gap-4 items-center p-2 md:p-5 text-xs md:text-m">
                                <p className="text-xl md:text-2xl underline">
                                    To Play
                                </p>
                                <p>
                                    Each Round there is a Clue Giver. Everyone else is a Guesser. The Game is over once everyone has been the Clue Giver for one full Round.
                                </p>
                                <p>
                                    The Clue Giver can put words into the Clue Bank. They can then click on words in their Clue Bank to put them into the Clue Output. Their goal is to get the Guessers to guess the words in the Answers list. Only one word in the Answers list will be visible at a time.
                                </p>
                                <p>
                                    Guessers try to guess the current answer based on the Clue Output zone, but they only get one guess each time the Clue Output zone changes! Try to think about your answer before you lock yourself out, but not too long or another Guesser might get it correct before you!
                                </p>
                                <p>
                                    At the end of each Round, the Round is scored! Guessers get 1 point for each correct Answer they guessed, and Clue Givers get 1 point for each Blue slot left in their Clue Bank. Clue Givers can lose points if they start to fill the Red slots in their Clue Bank, so try to think of words that might be useful for a range of potential Answers. To get the most points, your Word Bank needs to be THRIFTY!!!
                                </p>
                            </div>
                            <div className="flex items-start justify-end pr-2">
                                <button
                                    type="button"
                                    onClick={() => setShowHelp(false)}
                                    className="cursor-pointer flex w-auto m-1 md:m-2 border border-gold bg-dark border-2 rounded-full pt-1.75  pb-2 px-3.5 font-bold"
                                >
                                    Let's Play!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
            {title && (
                <div className="flex items-center justify-center font-bold -skew-x-25 text-2xl md:text-3xl bg-[linear-gradient(-3deg,var(--color-gold),var(--color-gold),var(--color-background),var(--color-gold),var(--color-gold))] bg-clip-text text-transparent [-webkit-text-stroke:1px_navy]">
                    {title}
                </div>
            )}
            <div onClick={()=>setShowHelp(!showHelp)} className="cursor-pointer absolute h-[1.2rem] md:h-[1.7rem] border-1 rounded-full aspect-square bg-gold justify-center text-center items-center text-sm md:text-l font-bold right-8">?</div>
        </div>

    );

}