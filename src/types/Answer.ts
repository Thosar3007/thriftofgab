export interface Answer {
	
	id: string;

    text: string;

    guessed: boolean;

    guessedBy?: string | null;

}