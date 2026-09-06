export interface Player {
	
	socketid?: string;

    id: string;

    name: string;

    color: string;

    score: number;

    isHost: boolean;
	
	connected: boolean;
	
	avatar?: string;

}