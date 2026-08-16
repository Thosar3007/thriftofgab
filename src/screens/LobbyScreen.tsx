import { useState } from "react";
import type { Settings } from "../types/Settings.ts";
import type { Game } from "../types/Game.ts";
import { startGame, updatePlayer, updateSettings } from "../game/GameClient.ts";
import Panel from "../components/Panel.tsx";
import ScoreCard from "../components/ScoreCard.tsx";
import PokeButton from "../components/PokeButton.tsx";

interface Props {
    game: Game;
    playerId?: string;
    statusMessage: string;
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function LobbyScreen({game, playerId, statusMessage, setStatusMessage}: Props) {
    const isHost = (game.hostId === playerId);
    const [text, setText] = useState("");
    const [color, setColor] = useState('#3b82f6');
    const [avatar, setAvatar] = useState<string | undefined>();
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setColor(e.target.value);
    };

    const pokemonCategories = [
        { label: "Pokemon", value: "Pokemon" },
        { label: "Pokemon Characters", value: "PkmnCharacters" },
        { label: "Pokemon Game Titles", value: "Games" },
        { label: "Pokemon Items", value: "PkmnItems" },
    ];

    const genericCategories = [
        { label: "People", value: "people" },
        { label: "Places", value: "places" },
        { label: "Objects", value: "objects" },
        { label: "Animals", value: "animals" },
        { label: "Actions", value: "actions" }
    ];

    const handleCategoryChange = (categoryValue: string, isChecked: boolean) => {

        const updatedSettings = {
            ...game.settings,
            categories: isChecked
                ? [...game.settings.categories, categoryValue]
                : game.settings.categories.filter(cat => cat !== categoryValue)
        };

        clickUpdateSettings(updatedSettings);
        console.log(JSON.stringify(game.settings));
    };

    const handleModeChange = (isChecked: boolean) => {

        const updatedSettings = {
            ...game.settings,
            useTypedGuesses: isChecked
        };

        clickUpdateSettings(updatedSettings);
        console.log(JSON.stringify(game.settings));
    };

    async function handleAvatarUpload(
        event: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            const avatar = await processAvatar(file);

            setAvatar(avatar);

        } catch (error) {
            console.error("Avatar processing failed", error);
        }
    }

    function processAvatar(
        file: File,
        size = 1000
    ): Promise<string> {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = () => {

                const img = new Image();

                img.onload = () => {

                    const canvas = document.createElement("canvas");
                    canvas.width = size;
                    canvas.height = size;

                    const ctx = canvas.getContext("2d");

                    if (!ctx) {
                        reject("Could not create canvas");
                        return;
                    }

                    const minDimension = Math.min(
                        img.width,
                        img.height
                    );

                    const sourceX = 
                        (img.width - minDimension) / 2;

                    const sourceY =
                        (img.height - minDimension) / 2;


                    ctx.drawImage(
                        img,
                        sourceX,
                        sourceY,
                        minDimension,
                        minDimension,
                        0,
                        0,
                        size,
                        size
                    );


                    resolve(
                        canvas.toDataURL(
                            "image/jpeg",
                            0.85
                        )
                    );
                };

                img.onerror = reject;

                img.src = reader.result as string;
            };

            reader.onerror = reject;

            reader.readAsDataURL(file);
        });
    }

    async function clickUpdateSettings(newSettings: Settings) {

        const result = await updateSettings(newSettings);

        if (!result.success) {
            setStatusMessage(result.message ?? "");
            return;
        }

        setStatusMessage("");
    }

    async function clickSavePlayer() {

        const result = await updatePlayer(text, color, avatar);

        if (!result.success) {
            setStatusMessage(result.message ?? "");
            return;
        }

        setStatusMessage("");
    }

    async function clickStartGame() {

        const result = await startGame();

        if (!result.success) {
            setStatusMessage(result.message ?? "");
            return;
        }

        setStatusMessage("");

    }

    return (
        <div className="grid grid-cols-1 gap-1 m-1 items-center justify-center md:grid-cols-[max-content_1fr_max-content] md:grid-rows-[auto_auto_1fr_auto] md:flex-1">
            <div className="h-min w-[14rem] justify-self-center">
                <Panel>
                    <div className="flex w-full items-center justify-center justify-self-center font-bold">
                        Room Code: {game.id}
                    </div>
                </Panel>
            </div>
            <div className="h-full md:row-span-3 md:col-span-2">
                <Panel title="Settings">
                    <div className="flex flex-col justify-between w-full gap-2">
                        <div className="flex flex-col gap-2 w-full md:flex-row ">
                            <div className="flex flex-col flex-1 h-full justify-between">
                                <div className="flex flex-col h-fit">
                                    <Panel title="Pokemon Categories">
                                        <div className="flex flex-col w-fit gap-2 p-2">
                                            {pokemonCategories.map((cat, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 cursor-pointer"
                                                        checked={game.settings.categories.includes(cat.value)}
                                                        disabled={!isHost}
                                                        onChange={(e) => handleCategoryChange(cat.value, e.target.checked)}
                                                    />
                                                    <span>{cat.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Panel>
                                </div>
                            </div>
                            <div className="flex flex-1 h-fit">
                                <Panel title="Generic Categories">
                                    <div className="flex flex-col gap-2 p-2">
                                        {genericCategories.map((cat, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 cursor-pointer"
                                                    checked={game.settings.categories.includes(cat.value)}
                                                    disabled={!isHost}
                                                    onChange={(e) => handleCategoryChange(cat.value, e.target.checked)}
                                                />
                                                <span>{cat.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Panel>
                            </div>
                        </div>
                        <div className="flex flex-col h-fit w-fit">
                            <Panel title="Game Mode">
                                <div className="flex items-center justify-center gap-2 p-2">
                                    
                                        <div className="flex w-[25ch] items-center gap-2 p-2">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 cursor-pointer"
                                                checked={game.settings.useTypedGuesses}
                                                disabled={!isHost}
                                                onChange={(e) => handleModeChange(e.target.checked)}
                                            />
                                            <span>Use Typed Guesses</span>
                                        </div>
                                        <div className="flex w-fit p-2">
                                            When using typed guesses, everything is scored automatically. Without typed guesses, it is assumed that the clue giver can hear verbal guesses from the guessers. The clue giver will manually assign who guessed an answer correctly, and can penalize guessers who guess when they are not supposed to by right-clicking on their score card to subtract points.
                                        </div>

                                </div>
                            </Panel>
                        </div>
                    </div>
                </Panel>
            </div>
            <div className="">
                <Panel>
                    <div className="w-full flex flex-col items-center justify-center gap-2">
                        <div className="flex">
                            <input
                                    className="w-[14rem] border-b border-1 bg-white rounded-lg p-2"
                                    placeholder="Pick Your Name And Color!"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                            />
                            <input 
                                className="rounded-full w-[35px] h-[35px] aspect-circle border-1 border-b m-1 p-1 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none [&::-moz-color-swatch]:rounded-full [&::-moz-color-swatch]:border-none"
                                type="color" 
                                value={color} 
                                onChange={handleColorChange} 
                                style={{ cursor: 'pointer', backgroundColor: color}}
                            />
                        </div>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                            disabled={!(avatar===undefined)}
                        />
                        <label
                            htmlFor="avatar-upload"
                            className="cursor-pointer"
                        >
                            {avatar ? <img src={avatar} className="rounded-full border h-[6ch]" onClick={() => setAvatar(undefined)} /> : <div className="rounded-full border px-4 py-2">
                                Upload Avatar
                            </div>}
                        </label>
                        <div>
                            <PokeButton 
                                onClick={clickSavePlayer}>
                                    Save Player Changes
                            </PokeButton>
                        </div>
                    </div>
                </Panel>
            </div>
            <div className="h-full md:row-span-2">
                <Panel>
                    <div className="flex flex-col gap-1 justify-start items-center w-full">
                        {game.players.map(player => (
                            <ScoreCard player={player} setStatusMessage={setStatusMessage} scoreOverrideActive={false} />
                        ))}
                    </div>
                </Panel>
            </div>
            <div className="p-1 h-full md:col-span-1">
                {statusMessage && <Panel>
                    {statusMessage}
                </Panel>}
            </div>
            <div className="flex items-center justify-center justify-self-center w-min p-1 md:col-3 md:justify-self-end">
                {isHost &&
                <div className="w-[15rem]">
                    <Panel>
                        <PokeButton
                            onClick={clickStartGame}>
                            Start Game!
                        </PokeButton>
                    </Panel>
                </div>}
            </div>
        </div>
    )
}