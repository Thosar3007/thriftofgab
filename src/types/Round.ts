import type { Answer } from "./Answer";
import type { Guess } from "./Guess";
import type { Clue } from "./Clue";
import { RoundPhase } from "./RoundPhase";

export interface Round {
	clueGiverId: string;
	answers: Answer[];
	clues: Clue[];
	selectedClues: number[];
	phase: RoundPhase;
	playersLockedOut: string[];
	recentGuesses: Guess[];
}