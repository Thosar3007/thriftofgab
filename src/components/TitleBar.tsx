import { useState } from "react";

interface Props {
    title: string;
    colorModeToggle: () => void;
}

export default function TitleBar({
    title,
    colorModeToggle
}: Props) {

    const [showHelp, setShowHelp] = useState(false);

    return (

        <div className="flex w-full items-center justify-center rounded-lg border border-gold bg-gradient-to-r from-light via-dark to-light shadow-md shadow-slate-900/15 tracking-wide text-[#1E3557]">
            <div>
                {showHelp && <div className="z-20 inset-0 fixed top-0 w-auto h-auto md:h-min md:m-auto md:max-w-[90vw] flex items-center justify-center text-center border-1 border-dark rounded-lg bg-gold">
                    <div className="w-full md:w-auto h-full flex flex-col border-5 border-gold rounded-lg bg-dark text-white font-bold md:p-5">
                        <div className="flex flex-col h-full md:h-max items-center md:justify-between gap-1">
                            <div className="flex flex-col gap-1.5 md:gap-4 items-center px-2 py-1 md:p-5 text-xs md:text-base">
                                <p className="text-lg md:text-2xl underline">
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
                            <div className="flex items-start justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowHelp(false)}
                                    className="cursor-pointer text-xs flex w-auto m-1 md:m-2 border border-gold bg-dark border-2 rounded-full pt-1  pb-1.5 px-3.5 font-bold md:text-lg md:pt-1.75 md:pb-2"
                                >
                                    Let's Play!
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
            {title && (
                <div className="flex items-center justify-center font-bold -skew-x-25 text-2xl md:text-3xl bg-[linear-gradient(-3deg,var(--color-gold),var(--color-gold),#F4F8FA,var(--color-gold),var(--color-gold))] bg-clip-text text-transparent [-webkit-text-stroke:1px_navy]">
                    {title}
                </div>
            )}
            <div onClick={()=>colorModeToggle()} className="cursor-pointer absolute flex h-[1.2rem] md:h-[1.7rem] border rounded-full aspect-square bg-gold justify-center items-center text-sm md:text-lg font-bold right-16">☾</div>
            <div onClick={()=>setShowHelp(!showHelp)} className="cursor-pointer absolute flex h-[1.2rem] md:h-[1.7rem] border rounded-full aspect-square bg-gold justify-center items-center text-sm md:text-lg font-bold right-8">?</div>
        </div>

    );

}