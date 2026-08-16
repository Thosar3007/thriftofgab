import './index.css'
import { useState, useEffect } from 'react';
import { socket } from "./network/socket.ts";

import type { Game } from './types/Game.ts';

import GameScreen from "./screens/GameScreen";
import LandingScreen from './screens/LandingScreen';
import LobbyScreen from "./screens/LobbyScreen.tsx";
import TitleBar from './components/TitleBar.tsx';
import GameOverScreen from "./screens/GameOverScreen.tsx";
import FooterBar from './components/FooterBar.tsx';

function App() {

    const [game, setGame] = useState<Game | undefined>(undefined);

    const [myPlayerId, setMyPlayerId] = useState<string>();

    const [statusMessage, setStatusMessage] = useState("");

    function hostGame() {
        socket.emit("hostGame")
    }

    function joinGame(gameId:string) {
        const playerId = localStorage.getItem("playerId");
        socket.emit("joinGame", gameId, playerId)
    }

    // useEffect(() => {

    //     socket.on("lobbyCreated", (gameId, playerId) => {

    //         console.log("Lobby created:", gameId, playerId);

    //         localStorage.setItem("playerId", playerId);

    //     });

    //     return () => {

    //         socket.off("lobbyCreated");

    //     };

    // }, []);

    useEffect(() => {

        socket.on("joinSucceeded", ({ gameId, id }) => {

            console.log("Join Succeeded", gameId, id)

            localStorage.setItem("playerId", id);

            setMyPlayerId(id);

        });

        socket.on("joinFailed", () => {

            console.log("Room doesn't exist.");

        });
        
    return () => {

        socket.off("joinSucceeded");
        socket.off("joinFailed");

    };

    }, []);

    useEffect(() => {

        socket.on("gameUpdated", (game: Game) => {
            setGame(game);
        });

        return () => {
            socket.off("gameUpdated");
        };

    }, []);


return (
    <div className="min-h-screen flex flex-col w-full justify-start pt-2 pb-4 px-5 bg-background text-navy">
        <TitleBar title="Thrift of Gab" />
        {(!game) && <LandingScreen onHost={hostGame} onJoin={joinGame} />}
        {(game?.phase === "Lobby") && myPlayerId && <LobbyScreen game={game} playerId={myPlayerId} statusMessage={statusMessage} setStatusMessage={setStatusMessage} />}
        {(game?.phase === "Rounds") && myPlayerId && <GameScreen game={game} playerId={myPlayerId} statusMessage={statusMessage} setStatusMessage={setStatusMessage} />}
        {(game?.phase === "GameOver") && myPlayerId && <GameOverScreen game={game} playerId={myPlayerId} statusMessage={statusMessage} setStatusMessage={setStatusMessage} />}
        <FooterBar game={game} />
    </div>
);
}

export default App;