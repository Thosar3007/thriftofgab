import type { player } from "../types/player";
import type { game } from "../types/Game";

export function getPlayer(game: Game, playerId: string): player | undefined {

	return game.players.find(player => player.id === playerId);
}