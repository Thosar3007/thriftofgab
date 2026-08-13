import type { Game } from "../types/Game";
import AnswerEntry from "./AnswerEntry";
import Badge from "./Badge";
import Panel from "./Panel";
import { answerOverride } from "../game/GameClient";


interface Props { 
    game: Game; 
    isClueGiver: boolean; 
    setStatusMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function AnswerList({ game, isClueGiver, setStatusMessage }: Props) {

    const currentRound = game.currentRound;
    const rows = Array.from({ length: 10 });

    if (!currentRound) {
        return (
            <Panel title="Answers">
                <div className="flex flex-col gap-1">
                    {rows.map((_, index) => {
                            let text = "_____________________";
                            return (
                                <div key={index}>
                                    {index + 1}. {text}
                                </div>
                            );
                    })}
                </div>
            </Panel>
        )
    }

    async function clickAnswerOverride(guesserId: string) {

        const result = await answerOverride(guesserId);

        if (!result.success) {
            setStatusMessage(result.message ?? "");
            return;
        }

        setStatusMessage("");

    }

    return (
        <Panel title="Answers">
            <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-col gap-2 w-full">
                    {rows.map((_, index) => {

                        const answer = currentRound.answers[index];

                        return (
                            <AnswerEntry index={index} key={index} answer={(isClueGiver || answer?.guessed) ? answer : undefined} game={game} />
                        );
                    })}
                </div>
                {(isClueGiver && !(game.settings.useTypedGuesses)) && 
                <div className="flex">
                    <Panel title="Click to Assign Correct Guess">
                        <div className="flex w-full justify-center gap-1">
                            {game.players.map((player, index) => {
                                if (!(game.currentRound?.clueGiverId === player.id)) {
                                    return (
                                        <div className="flex justify-around p-2 gap-2 flex-1" key={index} onClick={() => clickAnswerOverride(player.id)}>
                                            <Badge player={player} />
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </Panel>
                </div>}
            </div>
        </Panel>
    );
}