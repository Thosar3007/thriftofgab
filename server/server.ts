import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { GameEngine } from "../src/game/GameEngine.ts";
import { v4 as uuidv4 } from "uuid";
import type { Game } from "../src/types/Game";
import type { GameResult } from "../src/types/GameResult";
import type { Socket } from "socket.io";
import type { Player } from "../src/types/Player";
import type { Settings } from "../src/types/Settings";

const DEBUG_AUTOFILL_PLAYERS = false;

const app = express();
app.use(express.static(path.join(process.cwd(), "..", "dist")));

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3001;

const io = new Server(httpServer);

const games = new Map<string, Game>();
const playerGames = new Map<string, string>();
const sockets = new Map<string, Socket>();
const hostRecoveryTimers = new Map<string, NodeJS.Timeout>();

const engine = new GameEngine();




function generateRoomCode(): string {

    const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let code = "";

    for (let i = 0; i < 4; i++) {
        code += letters[Math.floor(Math.random() * letters.length)];
    }

    return code;
}

function getGameForSocket(socketId: string): Game | null {
	const gameId = playerGames.get(socketId);
	
	if (!gameId) {
		return null;
	}
	
	return games.get(gameId) ?? null;
}

function getPlayerForSocket(socketId: string): Player | null {

    const game = getGameForSocket(socketId);

    if (!game) {
        return null;
    }

    return (
        game.players.find(
            player => player.socketId === socketId
        ) ?? null
    );
}

function runGameAction(
    socket: Socket,
    callback: (result: GameResult) => void,
    action: (game: Game, player: Player) => GameResult
	) {

		const game = getGameForSocket(socket.id);

		if (!game) {

			callback({
				success: false,
				message: "You are not in a game."
			});

			return;
		}
		
		const player = getPlayerForSocket(socket.id);

		if (!player) {
			callback({
				success: false,
				message: "Player not found."
			});
			return;
		}

		const result = action(game, player);

		if (result.success) {
			io.to(game.id).emit("gameUpdated", game);
		}

		callback(result);
}

function addTestPlayers(game: Game) {

    engine.addPlayer(game, {
        id: "CPU1",
        name: "Sarah",
        color: "#ff4444",
        score: 0,
        isHost: false,
		connected: true
    });

    engine.addPlayer(game, {
        id: "CPU2",
        name: "Mike",
        color: "#44aa44",
        score: 0,
        isHost: false,
		connected: true
    });

    engine.addPlayer(game, {
        id: "CPU3",
        name: "Emily",
        color: "#4444ff",
        score: 0,
        isHost: false,
		connected: true
    });

}

function destroyGame(game: Game) {

    const timer = hostRecoveryTimers.get(game.id);

    if (timer) {
        clearTimeout(timer);
        hostRecoveryTimers.delete(game.id);
    }

    for (const player of game.players) {

        if (player.socketId) {
            playerGames.delete(player.socketId);
        }

    }

    games.delete(game.id);

}

function startHostRecoveryTimer(game: Game) {

    if (hostRecoveryTimers.has(game.id)) {
        return;
    }

    console.log(
        `Host ${game.hostId} disconnected from ${game.id}. ` +
        `Starting 10-minute recovery timer.`
    );

    const timer = setTimeout(() => {

        hostRecoveryTimers.delete(game.id);

        const currentGame = games.get(game.id);

        if (!currentGame) {
            return;
        }

        const currentHost = currentGame.players.find(
            player => player.id === currentGame.hostId
        );

        // Host came back during the grace period.
        if (currentHost?.connected) {
            return;
        }

        const connectedPlayers = currentGame.players.filter(
            player => player.connected
        );

        if (connectedPlayers.length === 0) {

            io.to(currentGame.id).emit("gameClosed");

            destroyGame(currentGame);

            return;
        }

        const newHost =
            connectedPlayers[
                Math.floor(Math.random() * connectedPlayers.length)
            ];

        currentGame.hostId = newHost.id;

        for (const player of currentGame.players) {
            player.isHost = player.id === newHost.id;
        }

        console.log(
            `Player ${newHost.id} is now host of ${currentGame.id}.`
        );

        io.to(currentGame.id).emit("gameUpdated", currentGame);

    }, 10 * 60 * 1000);

    hostRecoveryTimers.set(game.id, timer);
}


function cancelHostRecoveryTimer(game: Game) {

    const timer = hostRecoveryTimers.get(game.id);

    if (!timer) {
        return;
    }

    clearTimeout(timer);
    hostRecoveryTimers.delete(game.id);

}

io.on("connection", socket => {

    console.log("Connected:", socket.id);
	
	sockets.set(socket.id, socket);

	socket.on("hostGame", () => {

		const gameId = generateRoomCode();
		
		const id = uuidv4();
		
		const host: Player = {

			socketId: socket.id,
			
			id: id,

			name: "Player 1",

			color: "#FF0000",

			score: 0,
			
			connected: true,
			
			isHost: true
		};
		
		const settings: Settings = {
            
			useTypedGuesses: true,
            
			categories: [],
            
			maxPlayers: 6
        };

		const game = engine.createGame(
			gameId,
			host.id,
			settings
		);
		
		engine.addPlayer(game, host);
		
		if (DEBUG_AUTOFILL_PLAYERS) {
			addTestPlayers(game);
		}
		
		games.set(gameId, game);
		
		playerGames.set(socket.id, gameId);

		socket.join(gameId);
		
		socket.emit("joinSucceeded", { gameId, id });

		io.to(game.id).emit("gameUpdated", game);

	});
	
	socket.on("joinGame", (gameId: string, playerId: string | null) => {

		const game = games.get(gameId);

		if (!game) {

			socket.emit("joinFailed");

			return;
		}
		
		let player: Player | undefined = game.players.find(p => p.id === playerId);

		if (player?.socketId) {
			playerGames.delete(player.socketId);
		}

		if (player) {

			player.socketId = socket.id;
			player.connected = true;

			playerGames.set(socket.id, gameId);

			socket.join(gameId);

			if (player.id === game.hostId) {
				cancelHostRecoveryTimer(game);
			}

			const id = player.id;

			socket.emit("joinSucceeded", { gameId, id });

			io.to(gameId).emit("gameUpdated", game);

			return;
		}
		
		const id = uuidv4();

		player = {

			socketId: socket.id,
			
			id: id,

			name: "Player " + (game.players.length + 1),

			color: "#FF0000",

			score: 0,
			
			isHost: false,
			
			connected: true

		};

		engine.addPlayer(game, player);

		playerGames.set(socket.id, gameId);

		socket.join(gameId);

		socket.emit("joinSucceeded", { gameId, id });

		io.to(gameId).emit("gameUpdated", game);

	});
	
	socket.on("updatePlayer", (name: string, color: string, avatar: string | undefined, callback) => {
			runGameAction(
				socket,
				callback,
				(game, player) =>
					engine.updatePlayer(
						game,
						player.id,
						name,
						color,
						avatar
					)
			);

		}
	);
	
	socket.on("updateSettings", (settings: Settings, callback) => {
			runGameAction(
				socket,
				callback,
				game =>
					engine.updateSettings(
						game,
						settings
					)
			);

		}
	);
	
	socket.on("passAnswer", callback => {

		runGameAction(
			socket,
			callback,
			game => engine.pass(game)
		);

	});
	
	socket.on("continueGame", callback => {

		runGameAction(
			socket,
			callback,
			game => engine.continueGame(game)
		);

	});
	
	socket.on("scoreRound", callback => {

		runGameAction(
			socket,
			callback,
			game => engine.scoreRound(game)
		);

	});
	
	socket.on("startGame", callback => {

		runGameAction(
			socket,
			callback,
			game => engine.startGame(game)
		);

	});

	socket.on("resetSelectedClues", callback => {

		runGameAction(
			socket,
			callback,
			game => engine.resetSelectedClues(game)
		);

	});
	
	socket.on("selectClue", (clueIndex: number, callback) => {

			runGameAction(
				socket,
				callback,
				game => engine.selectClue(game, clueIndex)
			);

		}
	);
	
	socket.on("submitClue", (clueText: string, callback) => {

			runGameAction(
				socket,
				callback,
				game => engine.submitClue(game, clueText)
			);

		}
	);
	
	socket.on("submitGuess", (guessText: string, callback) => {

			runGameAction(
				socket,
				callback,
				(game, player) => engine.submitGuess(game, player.id, guessText)
			);

		}
	);
	
	socket.on("scoreOverride", (playerId: string, pos: boolean, callback) => {

			runGameAction(
				socket,
				callback,
				game => engine.scoreOverride(game, playerId, pos)
			);

		}
	);
	
	socket.on("answerOverride", (guesserId: string, callback) => {

			runGameAction(
				socket,
				callback,
				(game, player) => engine.answerOverride(game, player.id, guesserId)
			);

		}
	);
	
	socket.on(
		"kickPlayer",
		(
			targetPlayerId: string,
			callback: (result: GameResult) => void
		) => {

			const game = getGameForSocket(socket.id);

			if (!game) {
				callback({
					success: false,
					message: "You are not in a game."
				});
				return;
			}

			const host = getPlayerForSocket(socket.id);

			if (!host) {
				callback({
					success: false,
					message: "Player not found."
				});
				return;
			}

			if (game.hostId !== host.id) {
				callback({
					success: false,
					message: "Only the host can kick players."
				});
				return;
			}

			if (targetPlayerId === host.id) {
				callback({
					success: false,
					message: "You cannot kick yourself."
				});
				return;
			}

			const target = game.players.find(
				player => player.id === targetPlayerId
			);

			if (!target) {
				callback({
					success: false,
					message: "Player not found."
				});
				return;
			}

			if (target.socketId) {

				const targetSocket = sockets.get(target.socketId);

				if (targetSocket) {
					targetSocket.emit("kicked");
					targetSocket.disconnect(true);
				}

				playerGames.delete(target.socketId);
			}

			game.players = game.players.filter(
				player => player.id !== targetPlayerId
			);

			if (game.clueGiverOrder) {
				game.clueGiverOrder =
					game.clueGiverOrder.filter(
						id => id !== targetPlayerId
					);
			}

			io.to(game.id).emit("gameUpdated", game);

			callback({
				success: true
			});

		}
	);
	
	socket.on("disconnect", () => {

		const game = getGameForSocket(socket.id);

		sockets.delete(socket.id);

		if (!game) {
			return;
		}

		const player = getPlayerForSocket(socket.id);

		if (!player) {
			playerGames.delete(socket.id);
			return;
		}

		console.log(
			`Player ${player.id} disconnected from game ${game.id}.`
		);

		playerGames.delete(socket.id);

		engine.disconnectPlayer(game, player.id);

		if (player.id === game.hostId) {
			startHostRecoveryTimer(game, player.id);
		}

		io.to(game.id).emit("gameUpdated", game);

	});


});

httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on ${PORT}`);
});