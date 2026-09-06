import PokeButton from "../components/PokeButton";
import { useState } from "react";


interface Props {
    onHost: () => void;
    onJoin: (gameId:string) => void;
}

export default function LandingScreen({
    onHost,
    onJoin
    }: Props) {

    const [text, setText] = useState("");

    return (
        <div className="flex flex-col w-full items-center justify-center p-5 px-10">
            
                <div className="w-[12rem] grow-2 p-3">
                    <PokeButton onClick={onHost}>Host a Game!</PokeButton>
                </div>
                <div className="flex flex-col grow-1 w-[12rem] items-center p-3 gap-1">
                    <PokeButton onClick={() => onJoin(text)}>Join a Game!</PokeButton>
                    <input
                        className="border-b border-1 rounded-lg p-2 w-full bg-white text-black"
                        placeholder="Game Code Here!"
                        value={text}
                        onChange={(e) => setText(e.target.value.toUpperCase())}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                {onJoin}
                            }
                        }}
                    />
                </div>
            
        </div>
    )
}