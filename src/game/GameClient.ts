import { socket } from "../network/socket";
import type { GameResult } from "../types/GameResult";
import type { Settings } from "../types/Settings";

export function submitGuess(
    guessText: string
): Promise<GameResult> {

    return new Promise(resolve => {

        socket.emit(
            "submitGuess",
            guessText,
            (result: GameResult) => {

                resolve(result);

            }
        );

    });

}

export function submitClue(
    clueText: string
): Promise<GameResult> {

    return new Promise(resolve => {

        socket.emit(
            "submitClue",
            clueText,
            (result: GameResult) => {

                resolve(result);

            }
        );

    });

}

export function selectClue(
    clueIndex: number
): Promise<GameResult> {

    return new Promise(resolve => {

        socket.emit(
            "selectClue",
            clueIndex,
            (result: GameResult) => {

                resolve(result);

            }
        );

    });

}

export function resetSelectedClues(): Promise<GameResult> {

    return new Promise(resolve => {

        socket.emit("resetSelectedClues", (result: GameResult) => {

            resolve(result);

        });

    });

}

export function passAnswer(): Promise<GameResult> {

    return new Promise(resolve => {

        socket.emit("passAnswer", (result: GameResult) => {

            resolve(result);

        });

    });

}

export function startGame(): Promise<GameResult> {

    return new Promise(resolve => {

        socket.emit("startGame", (result: GameResult) => {

            resolve(result);

        });

    });

}

export function updatePlayer(name: string, color: string, avatar: string | undefined): Promise<GameResult> {

    return new Promise(resolve => {

        socket.emit(
            "updatePlayer",
            name,
            color,
			avatar,
            (result: GameResult) => {

                resolve(result);

            }
        );

    });

}

export function updateSettings(settings: Settings): Promise<GameResult> {

    return new Promise(resolve => {

        socket.emit(
            "updateSettings",
            settings,
            (result: GameResult) => {

                resolve(result);

            }
        );

    });

}

export function continueGame(): Promise<GameResult> {

    return new Promise(resolve => {

        socket.emit("continueGame", (result: GameResult) => {

            resolve(result);
        });
    });
}

export function scoreRound(): Promise<GameResult> {

    return new Promise(resolve => {

        socket.emit("scoreRound", (result: GameResult) => {

            resolve(result);
        });
    });
}

export function scoreOverride(playerId: string, pos: boolean): Promise<GameResult> {

    return new Promise(resolve => {

        socket.emit(
            "scoreOverride",
            playerId,
            pos,
            (result: GameResult) => {

                resolve(result);
            }
        );
    });
}

export function answerOverride(guesserId: string): Promise<GameResult> {

    return new Promise(resolve => {

        socket.emit(
            "answerOverride",
            guesserId,
            (result: GameResult) => {

                resolve(result);
            }
        );
    });
}
