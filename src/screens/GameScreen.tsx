import type { Game } from "../types/Game";
import ClueOutputZone from "../components/ClueOutputZone";
import ClueBank from "../components/ClueBank";
import AnswerList from "../components/AnswerList";
import InputPanel from "../components/InputPanel.tsx";
import GuessList from "../components/GuessList.tsx";
import Badge from "../components/Badge.tsx";

import { getPlayer } from "../game/getPlayer.ts";
import CurrentScores from "../components/CurrentScores.tsx";
import PokeButton from "../components/PokeButton.tsx";
import { passAnswer, scoreRound, continueGame } from "../game/GameClient.ts";

interface Props {
    game: Game;
    playerId?: string;
    statusMessage: string;
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function GameScreen({game, playerId, statusMessage, setStatusMessage}: Props) {

    if (!game.currentRound) {
        return 
    }
    const clueGiver = getPlayer(game, game.currentRound.clueGiverId);

    const isClueGiver = (playerId===clueGiver.id)

    async function passButton() {

        const result = await passAnswer();

        if (!result.success) {
            setStatusMessage(result.message ?? "");
            return;
        }

        setStatusMessage("");

    }

    async function clickScoreRound() {

        const result = await scoreRound();

        if (!result.success) {
            setStatusMessage(result.message ?? "");
            return;
        }

        setStatusMessage("");

    }

    async function clickNextRound() {

        const result = await continueGame();

        if (!result.success) {
            setStatusMessage(result.message ?? "");
            return;
        }

        setStatusMessage("");

    }

    if (!playerId) return (
        <div>Error - How'd you get here without a player Id?</div>
    )

    return (
        <div className="flex h-full min-h-0 flex-col p-3 gap-1">
            <div className="flex h-[18vh] min-h-[8rem] max-h-[12rem] gap-10 px-10">
                <div className="flex h-[8rem] max-h-full self-center items-center justify-center"><Badge player={clueGiver}/></div>
                <div className="flex min-h-0 grow-5"><ClueOutputZone game={game} /></div>
                {game.settings.useTypedGuesses ? <div className="flex min-h-0 grow-1"><GuessList round={game.currentRound} /></div> : ""}
            </div>

            <div className="flex-1 flex gap-2 w-full">
                <div className="flex grow-1">
                    <ClueBank
                        game={game}
                        playerId={playerId}
                        setStatusMessage={setStatusMessage}
                    />
                </div>
                <div className="flex basis-0">
                    <AnswerList 
                        game={game}
                        isClueGiver={isClueGiver}
                        setStatusMessage={setStatusMessage}
                    />
                </div>
            </div>

            <div className="grid grid-cols-[1fr_1fr_1fr] items-center min-h-[10ch] gap-1">
                <div className="flex w-full justify-end">
                    {game.currentRound.phase==="ReadyToScore" && game.hostId===playerId && <div className="flex w-fit h-full align-items-right justify-end justify-self-end px-4 py-5.5 rounded-lg border border-dark bg-white shadow-md"><PokeButton onClick={clickScoreRound}>Score the Round!</PokeButton></div>}
                    {game.currentRound.phase==="RoundScored" && game.hostId===playerId && <div className="flex w-fit h-full align-items-right justify-end justify-self-end px-4 py-5.5 rounded-lg border border-dark bg-white shadow-md"><PokeButton onClick={clickNextRound}>{(game.roundNumber < game.players.length-1) ? "Start the Next Round!" : "Final Scores!"}</PokeButton></div>}
                    {game.currentRound.phase==="Playing" && playerId===clueGiver.id && <div className="flex w-[10rem] h-full align-items-right justify-end justify-self-end px-4 py-5.5 rounded-lg border border-dark bg-white shadow-md"><PokeButton onClick={passButton}>PASS</PokeButton></div>}
                </div>
                {(game.settings.useTypedGuesses || isClueGiver) && <InputPanel
                    game={game}
                    playerId={playerId}
                    setStatusMessage={setStatusMessage}
                />}
                {statusMessage ? 
                    <div className="p-3">
                        {statusMessage}
                    </div>
                : <div></div>}
            </div>
            <div className="flex p-3 h-fit justify-center">
                <CurrentScores players={game.players} setStatusMessage={setStatusMessage} scoreOverrideActive={isClueGiver && !game.settings.useTypedGuesses} />
            </div>
        </div>
    );
}