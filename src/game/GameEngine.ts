import type { Game } from "../types/Game";
import type { Player } from "../types/Player";
import type { Settings } from "../types/Settings";
import type { Round } from "../types/Round";
import type { GameResult } from "../types/GameResult";
import type { Answer } from "../types/Answer";
import type { Guess } from "../types/Guess";
import { validateClue } from "./clueValidator";
import { GamePhase } from "../types/GamePhase";
import { RoundPhase } from "../types/RoundPhase";
import { loadAnswers } from "./answerLoader";
import { shuffle } from "./shuffle";
import { getPlayer } from "../game/getPlayer.ts";
import { normalizeForComparison } from "./stringHelpers";


export class GameEngine {
	
	private drawAnswer(game: Game): Answer {
		if (game.remainingAnswers.length === 0) {
			throw new Error("No answers remaining.");
		}

		const nextAnswer = game.remainingAnswers.shift();

		if (!nextAnswer) {
			throw new Error("Unable to draw answer.");
		}
		
		if (!game.currentRound) {
			throw new Error("No active round.");
		}
		
		game.currentRound.recentGuesses = [];

		return {
			id: nextAnswer.id,
			text: nextAnswer.text,
			guessed: false,
			guessedBy: null
		};
	}
	
	private clampScore(score: number): number {
		return Math.max(-99, Math.min(99, score));
	}

    createGame(id: string, hostId: string, settings: Settings): Game {

        return {
            id,
			hostId,
            players: [],
            settings,
            currentRound: null,
            roundNumber: 0,
            usedAnswers: [],
            phase: GamePhase.Lobby,
			remainingAnswers: []
        };

    }
	
	addPlayer(game: Game, player: Player): void {

		game.players.push(player);

	}
	
	createRound(game: Game, clueGiverId: string): Round {

		return {
			clueGiverId,
			answers: [],
			clues: [],
			selectedClues: [],
			phase: RoundPhase.Playing,
			playersLockedOut: [],
			recentGuesses: []
		};
	}
	
	startGame(game: Game): GameResult {

		if (game.players.length < 3) {
			return {
				success: false,
				message: "At least 3 players are required."
			};
		}
		
		if (game.settings.categories < 1) {
			return {
				success: false,
				message: "At least 1 answer category is required."
			};
		}
		
		const giverOrder = game.players.map(player => player.id);
		
		game.clueGiverOrder = shuffle(giverOrder);

		game.remainingAnswers =
			shuffle(loadAnswers(game.settings.categories));

		game.roundNumber = 0;

		game.phase = GamePhase.Rounds;
		
		this.startRound(game);
		
		return {
			success: true
		}

	}
	
	startRound(game: Game): void {

		game.currentRound = null;

		const clueGiverId = game.clueGiverOrder[game.roundNumber];

		game.currentRound = this.createRound(game, clueGiverId);
		
		game.currentRound.answers.push(this.drawAnswer(game));
	}

	submitClue(game: Game, clueText: string): GameResult {
		if (!game.currentRound) {
			return {
				success: false,
				message: "There is no active round."
			};
		}
		
		if (game.currentRound.phase !== RoundPhase.Playing) {
			return {
				success: false,
				message: "OAK: This isn't the time to use that!"
			};
		}		
		
		if (game.currentRound.clues.length >= 40) {
			return {
				success: false,
				message: "The clue bank is full."
			};

		}
		
		const answer = game.currentRound.answers[game.currentRound.answers.length-1];
		
		const result = validateClue(clueText, answer.text);

		if (!result.success) {
			return result;
		}

		game.currentRound.clues.push({
			text: clueText.trim().toUpperCase(),
			pass: false
		});

		return {
			success: true
		};

	}
	
	selectClue(game: Game, clueIndex: number): GameResult {
		if (!game.currentRound) {
			return {
				success: false,
				message: "No active round."
			};
		}
		
		if (game.currentRound.phase !== RoundPhase.Playing) {
			return {
				success: false,
				message: "OAK: This isn't the time to use that!"
			};
		}
		
		if (clueIndex < 0 || clueIndex >= game.currentRound.clues.length) {
			return {
				success: false,
				message: "No such clue exists."
			};
		}
		
		const clue = game.currentRound.clues[clueIndex];

		if (clue.pass) {
			return {
				success: false,
				message: "Clue is PASS"
			};
		}
		
		if (game.currentRound.selectedClues.length >= 9) {
			return {
				success: false,
				message: "Clue Output Zone is full"
			};
		}
		
		game.currentRound.selectedClues.push(clueIndex);
		game.currentRound.playersLockedOut = [];
		
		return {
			success:true
		}
	}
	
	resetSelectedClues(game: Game): GameResult {
		if (!game.currentRound) {
			return {
				success: false,
				message: "There is no active round."
			};
		}
		
		if (game.currentRound.phase !== RoundPhase.Playing) {
			return {
				success: false,
				message: "OAK: This isn't the time to use that!"
			};
		}
		
		game.currentRound.selectedClues = [];
		return {
			success: true
		}
	}
	
	submitGuess(game: Game, playerId: string, guessText: string): GameResult {
		if (!game.currentRound) {
			return {
				success: false,
				message: "There is no active round."
			};
		}

		if (game.currentRound.phase !== RoundPhase.Playing) {
			return {
				success: false,
				message: "OAK: This isn't the time to use that!"
			};
		}
		
		if (game.currentRound.selectedClues.length === 0) {
			return {
				success: false,
				message: "There are no clues to guess from."
			};
		}

		if (playerId === game.currentRound.clueGiverId) {
			return {
				success: false,
				message: "The clue giver cannot guess."
			};
		}

		if (game.currentRound.playersLockedOut.includes(playerId)) {
			return {
				success: false,
				message: "You have already guessed."
			};
		}

		const currentAnswer =
			game.currentRound.answers[
				game.currentRound.answers.length - 1
			];

		game.currentRound.playersLockedOut.push(playerId);
		
		const guess: Guess = { text: guessText, playerId: playerId }
		
		game.currentRound.recentGuesses.push(guess);

		if (
			normalizeForComparison(guessText) !==
			normalizeForComparison(currentAnswer.text)
		) {
			return {
				success: true,
				correct: false
			};
		}

		currentAnswer.guessed = true;
		currentAnswer.guessedBy = playerId;

		const guessedCount =
			game.currentRound.answers.filter(
				answer => answer.guessed
			).length;

		if (guessedCount >= 10) {
			game.currentRound.phase = RoundPhase.ReadyToScore;

			return {
				success: true,
				correct: true
			};
		}

		game.currentRound.selectedClues = [];
		game.currentRound.answers.push(this.drawAnswer(game));

		return {
			success: true,
			correct: true
		};
	}
	
	pass(game: Game): GameResult {

		if (!game.currentRound) {
			return {
				success: false,
				message: "There is no active round."
			};
		}
		
		if (game.currentRound.phase !== RoundPhase.Playing) {
			return {
				success: false,
				message: "OAK: This isn't the time to use that!"
			};
		}

		if (game.currentRound.clues.length >= 40) {
			return {
				success: false,
				message: "The clue bank is full."
			};
		}

		game.currentRound.clues.push({
			text: "PASS",
			pass: true
		});
		
		game.currentRound.selectedClues = [];
		game.currentRound.answers[game.currentRound.answers.length-1]=this.drawAnswer(game);

		return {
			success: true
		};
	}
	
	scoreRound(game: Game): GameResult {
		if (!game.currentRound) {
			return {
				success: false,
				message: "There is no active round."
			};
		}
		if (game.currentRound.phase !== RoundPhase.ReadyToScore) {
			return {
				success: false,
				message: "The round is not ready to be scored."
			};
		}
		for (const answer of game.currentRound.answers) {
			if (!answer.guessed || !answer.guessedBy) {
				continue;
			}
			const player = getPlayer(game, answer.guessedBy);
			if (player) {
				player.score = this.clampScore(player.score + 1);
			}
			
		}
		const clueGiver = getPlayer(game, game.currentRound.clueGiverId);
		const roundScore = 25 - game.currentRound.clues.length;
		if (clueGiver) {
			clueGiver.score = this.clampScore(clueGiver.score + roundScore);
		}
		
		game.currentRound.phase = RoundPhase.RoundScored;
		return {
			success: true
		}
	}
	
	continueGame(game: Game): GameResult {
		if (!game.currentRound) {
			return {
				success: false,
				message: "There is no active round."
			};
		}

		if (game.currentRound.phase !== RoundPhase.RoundScored) {
			return {
				success: false,
				message: "The round has not been scored."
			};
		}

		game.roundNumber++;

		if (game.roundNumber >= game.players.length) {

			game.phase = GamePhase.GameOver;

			return {
				success: true
			};
		}

		this.startRound(game);

		return {
			success: true
		};		
	}
	
	updatePlayer(game: Game, playerId: string, name: string, color: string, avatar: string | undefined): GameResult {

		const player = getPlayer(game, playerId);

		if (!player) {
			return {
				success: false,
				message: "Player not found."
			};
		}

		if (name.trim().length === 0) {
			return {
				success: false,
				message: "Please enter a name."
			};
		}

		player.name = name.trim().slice(0,15);
		player.color = color;
		player.avatar = avatar;

		return {
			success: true
		};
	}
	
	disconnectPlayer(game: Game, playerId: string): GameResult {

		const player = getPlayer(game, playerId);

		if (!player) {
			return {
				success: false,
				message: "Player not found."
			};
		}

		player.connected = false;
		player.socketId = "";

		return {
			success: true
		};
	}
	
	removePlayer(game: Game, playerId: string): GameResult {

		const player = getPlayer(game, playerId);

		if (!player) {
			return {
				success: false,
				message: "Player not found."
			};
		}
		
		if (game.currentRound.clueGiver === playerId) {
			game.currentRound.phase = ReadyToScore;
			scoreRound(game);
		}
		
		game.players = game.players.filter(i => i.id !== playerId);
		
		game.clueGiverOrder = game.clueGiverOrder.filter(i => i !== playerId);

		return {
			success: true
		};
	}
	
	updateSettings(game: Game, settings: Settings): GameResult {

		if (!game) {
			return {
				success: false,
				message: "Game not found."
			};
		}
		
		game.settings = settings;
		
		return {
			success: true
		};
	}
	
	scoreOverride(game: Game, playerId: string, pos: boolean): GameResult {
		
		const player = getPlayer(game, playerId);

		if (!player) {
			return {
				success: false,
				message: "Player not found."
			};
		}
		
		if (game.settings.useTypedGuesses) {
			return {
				success: false,
				message: "Wrong Game Mode."
			};
		}

		if (pos) {
			player.score++
		} else {
			player.score--
		}

		return {
			success: true
		};
	}
	
	answerOverride(game: Game, playerId: string, guesserId: string): GameResult {
		
		if (!game.currentRound) {
			return {
				success: false,
				message: "There is no active round."
			};
		}
		
		if (game.settings.useTypedGuesses) {
			return {
				success: false,
				message: "Wrong Game Mode."
			};
		}
		
		if (!game.currentRound.clueGiverId === playerId) {
			return {
				success: false,
				message: "Only the Clue Giver assigns correct answers."
			};
		}
		
		if (game.currentRound.clueGiverId === guesserId) {
			return {
				success: false,
				message: "You can't give a correct answer to yourself!"
			};
		}
		
		const currentAnswer =
			game.currentRound.answers[
				game.currentRound.answers.length - 1
			];

		currentAnswer.guessed = true;
		currentAnswer.guessedBy = guesserId;

		const guessedCount =
			game.currentRound.answers.filter(
				answer => answer.guessed
			).length;

		if (guessedCount >= 10) {
			game.currentRound.phase = RoundPhase.ReadyToScore;

			return {
				success: true,
				correct: true
			};
		}

		game.currentRound.selectedClues = [];
		game.currentRound.answers.push(this.drawAnswer(game));

		return {
			success: true,
			correct: true
		};
	}
}

