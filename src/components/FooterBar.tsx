import { useState, useEffect } from "react";
import type { Game } from "../types/Game";
import avatarGif from "../assets/AvatarGIF.gif";

interface FooterBarProps {
    game: Game | undefined;
}

export default function FooterBar({game}: FooterBarProps) {

    const [showBugReport, setShowBugReport] = useState(false);
    const [showDonate, setShowDonate] = useState(false);

    useEffect(() => {
        if (!(showBugReport || showDonate)) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setShowBugReport(false);
                setShowDonate(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showBugReport, showDonate]);

    const [bugDescription, setBugDescription] = useState("");
    const [bugExpected, setBugExpected] = useState("");
    const [bugAdditional, setBugAdditional] = useState("");
    const [bugEmail, setBugEmail] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleBugSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);
        setSubmitError("");

        const formData = new FormData(e.currentTarget);

        if (game) {
            const gameStateJson = JSON.stringify(game, null, 2);

            const gameStateFile = new File(
                [gameStateJson],
                "thrift-of-gab-game-state.json",
                {
                    type: "application/json",
                }
            );

            formData.append("gameState", gameStateFile);
        }

        try {
            const response = await fetch(
                "https://usebasin.com/f/292068a3ef17",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Submission failed");
            }

            setShowBugReport(false);

            setBugDescription("");
            setBugExpected("");
            setBugAdditional("");
            setBugEmail("");

        } catch (error) {
            console.error(error);
            setSubmitError(
                "Something went wrong sending your report. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };
    

    return (

        <div className="flex flex-col md:flex-row text-center items-center justify-center rounded-lg border border-gold bg-gradient-to-r from-light via-dark to-light shadow-md shadow-slate-900/15 tracking-wide mt-auto mb-3 gap-0 md:gap-4 text-gold">
            <div 
                className="hover:underline cursor-pointer" 
                onClick={()=>{
                    setShowBugReport(!showBugReport);
                    setShowDonate(false);
                }}
                >
                    Something broken? Tell Thosar!
            </div>
            <div className="border-gold h-0 w-[80vw] border-1 my-1 md:w-3"></div>
            <div 
                className="hover:underline cursor-pointer" 
                onClick={()=>{
                    setShowDonate(!showDonate);
                    setShowBugReport(false);
                }}
                >
                    Having fun? Support the Game!
            </div>
            {showBugReport && <div className="fixed inset-0 md:m-[10vh_10vw] w-auto h-auto flex items-center justify-center text-center border-5 border-dark rounded-lg bg-dark">
                <form onSubmit={handleBugSubmit} className="w-full h-full flex flex-col p-3 border border-dark rounded-lg bg-background text-dark ">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl md:text-2xl underline">
                            Report a Bug
                        </h2>

                        <button
                            type="button"
                            onClick={() => setShowBugReport(false)}
                            className="cursor-pointer md:m-2 border border-dark bg-gold border rounded-full pt-2  pb-2.25 px-4 font-bold text-sm h-10 md:text-base md:h-auto"
                        >
                            Close
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 text-left overflow-y-auto">

                        <div>
                            <label className="block mb-1">
                                What happened?
                            </label>

                            <textarea
                                name="description"
                                value={bugDescription}
                                onChange={(e) => setBugDescription(e.target.value)}
                                placeholder="Tell me what went wrong..."
                                className="w-full md:min-h-32 rounded-lg border border-dark bg-white p-3 text-black resize-y"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-1">
                                What did you expect to happen?
                            </label>

                            <textarea
                                name="expectation"
                                value={bugExpected}
                                onChange={(e) => setBugExpected(e.target.value)}
                                placeholder="What should have happened instead?"
                                className="w-full md:min-h-24 rounded-lg border border-dark bg-white p-3 text-black resize-y"
                            />
                        </div>

                        <div>
                            <label className="block mb-1">
                                Anything else?
                            </label>

                            <textarea
                                name="additional"
                                value={bugAdditional}
                                onChange={(e) => setBugAdditional(e.target.value)}
                                placeholder="Anything else that might help?"
                                className="w-full md:min-h-24 rounded-lg border border-dark bg-white p-3 text-black resize-y"
                            />
                        </div>

                        <div>
                            <label className="block mb-1">
                                Email <span className="text-sm">(optional)</span>
                            </label>

                            <input
                                name="email"
                                type="email"
                                value={bugEmail}
                                onChange={(e) => setBugEmail(e.target.value)}
                                placeholder="Only if you'd like a response"
                                className="w-full rounded-lg border border-dark bg-white p-3 text-black resize-y"
                            />
                        </div>

                    </div>

                    <div className="flex justify-center md:justify-end gap-0 md:gap-4 mt-3 items-center">
                        {submitError && (
                            <div className="text-red-400 text-center">
                                {submitError}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowBugReport(false)}
                            className="cursor-pointer m-1 md:m-2 border border-dark bg-gold border rounded-full pt-2  pb-2.25 px-4 font-bold text-sm h-10 md:text-base md:h-auto"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="cursor-pointer m-1 md:m-2 border border-dark bg-gold border rounded-full pt-2  pb-2.25 px-4 font-bold text-sm h-10 md:text-base md:h-auto"
                            disabled={isSubmitting || !bugDescription.trim()}
                        >
                            {isSubmitting ? "Sending..." : "Submit Bug Report"}
                        </button>
                    </div>
                </form>
            </div>}
            {showDonate && <div className="fixed inset-0 top-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-auto md:h-min flex items-center justify-center text-center border-1 border-dark rounded-lg bg-gold">
                <div className="w-auto h-full md:h-min flex flex-col p-3 border-5 border-gold rounded-lg bg-dark text-white font-bold justify-center">
                    <div className="flex flex-col items-center justify-between gap-2">

                        <div className="flex flex-col md:grid md:grid-cols-[1fr_2fr] justify-between align-center gap-2">
                            <img className="flex order-2 md:order-1" src={avatarGif} />
                            <div className="flex flex-col gap-2 items-center justify-center order-1 md:order-2">
                                <p>
                                    Having fun with Thrift of Gab?
                                </p>
                                <p>
                                    Thosar accepts cookies.
                                </p>
                            </div>
                        </div>
                        <p>
                            No pressure! Playing the game is already appreciated!
                        </p>
                        <div className="flex flex-col md:flex-row items-center justify-center order-3 md:items-start md:justify-end pr-2">
                            <button
                                type="button"
                                onClick={() => window.open("https://ko-fi.com/thosar", "_blank")}
                                className="cursor-pointer flex w-auto m-2 border border-gold bg-dark border-2 rounded-full pt-2  pb-2.25 px-4 font-bold"
                            >
                                Buy Thosar a Cookie
                            </button>
                        
                            <button
                                type="button"
                                onClick={() => setShowDonate(false)}
                                className="cursor-pointer flex w-auto m-2 border border-gold bg-dark border-2 rounded-full pt-1.75  pb-2 px-3.5 font-bold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>}
        </div>

    );

}