import type { Player } from "./Player";
import type { Round } from "./Round";
import type { Settings } from "./Settings";
import { GamePhase } from "./GamePhase";

export interface Game {
	id: string;
	
    players: Player[];

    hostId: string;

    settings: Settings;
	
	clueGiverOrder: string[];

    currentRound: Round | null;
	
	roundNumber: number;

    phase: GamePhase;
	
	remainingAnswers: string[];
}