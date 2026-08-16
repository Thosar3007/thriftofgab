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
import Panel from "../components/Panel.tsx";

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
        <div className="flex h-full min-h-0 p-3 gap-1 flex-col">
            <div className="flex flex-col min-h-[8rem] gap-3 px-10 md:flex-row md:max-h-[12rem] md:h-[18vh] md:gap-10">
                <div className="flex flex-col h-[8rem] max-h-full self-center items-center justify-center gap-1">
                    <div className="text-xl color-dark font-bold underline">Clue Giver</div>
                    <Badge player={clueGiver}/>
                </div>
                <div className="flex min-h-0 grow-5 order-3 md:order-2"><ClueOutputZone game={game} /></div>
                {game.settings.useTypedGuesses ? <div className="flex min-h-0 grow-1 order-2 md:order-3"><GuessList round={game.currentRound} /></div> : ""}
            </div>

            <div className="flex-1 flex flex-col gap-2 w-full justify-center items-center md:flex-row">
                <div className={`${!isClueGiver ? "hidden" : ""} grow-1 order-2 md:flex md:order-1`}>
                    <ClueBank
                        game={game}
                        playerId={playerId}
                        setStatusMessage={setStatusMessage}
                    />
                </div>
                <div className="flex basis-0 order-1 w-full md:w-auto md:order-2">
                    <AnswerList 
                        game={game}
                        isClueGiver={isClueGiver}
                        setStatusMessage={setStatusMessage}
                    />
                </div>
            </div>

            <div className="flex flex-col justify-center items-center min-h-[10ch] gap-1 md:flex-row">
                <div className="flex flex-1 w-min justify-end order-3 md:order-1">
                    {game.currentRound.phase==="ReadyToScore" && game.hostId===playerId && <div className="flex w-fit h-full align-items-right justify-end justify-self-end px-4 py-5.5 rounded-lg border border-dark bg-white shadow-md"><PokeButton onClick={clickScoreRound}>Score the Round!</PokeButton></div>}
                    {game.currentRound.phase==="RoundScored" && game.hostId===playerId && <div className="flex w-fit h-full align-items-right justify-end justify-self-end px-4 py-5.5 rounded-lg border border-dark bg-white shadow-md"><PokeButton onClick={clickNextRound}>{(game.roundNumber < game.players.length-1) ? "Start the Next Round!" : "Final Scores!"}</PokeButton></div>}
                    {game.currentRound.phase==="Playing" && playerId===clueGiver.id && <div className="flex w-[10rem] h-full align-items-right justify-end justify-self-end px-4 py-5.5 rounded-lg border border-dark bg-white shadow-md"><PokeButton onClick={passButton}>PASS</PokeButton></div>}
                </div>
                {(game.settings.useTypedGuesses || isClueGiver) && <div className="flex flex-1 order-2"><InputPanel
                    game={game}
                    playerId={playerId}
                    setStatusMessage={setStatusMessage}
                /></div>}
                <div className="flex flex-1 order-4">
                    {statusMessage ? 
                        <Panel>
                            {statusMessage}
                        </Panel>
                    : <div></div>}
                </div>
            </div>
            <div className="flex p-3 h-fit justify-center">
                <CurrentScores players={game.players} setStatusMessage={setStatusMessage} scoreOverrideActive={isClueGiver && !game.settings.useTypedGuesses} />
            </div>
        </div>
    );
}