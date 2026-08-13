import type { GameResult } from "../types/GameResult";
import { normalizeForComparison } from "./stringHelpers";

function normalizeClue(clue: string): string {
    return clue.trim().toUpperCase();
}

export function validateClue(
    clueText: string,
    answerText: string
): GameResult {

    const clue = normalizeClue(clueText);
    const answer = answerText.toUpperCase();

    // Length
    if (clue.length < 3 || clue.length > 15) {
        return {
            success: false,
            message: "Clues must be between 3 and 15 characters."
        };
    }

    // No spaces
    if (clue.includes(" ")) {
        return {
            success: false,
            message: "Clues may not contain spaces."
        };
    }

    // Allowed characters
    const validCharacters = /^[A-ZÀ-ÖØ-Ý-]+$/u;

    if (!validCharacters.test(clue)) {
        return {
            success: false,
            message: "Clues contain invalid characters."
        };
    }

    // Maximum one hyphen
    const hyphenCount = clue.split("-").length - 1;

    if (hyphenCount > 1) {
        return {
            success: false,
            message: "Only one hyphen is allowed."
        };
    }

    // Clues of 4+ letters may not appear inside the answer (ignoring spaces and hyphens).
    const comparisonClue = normalizeForComparison(clue);
    const comparisonAnswer = normalizeForComparison(answer);

    if (
        comparisonClue.length >= 4 &&
        comparisonAnswer.includes(comparisonClue)
    ) {
        return {
            success: false,
            message: "Clue contains too much of the answer."
        };
    }

    return {
        success: true,
        message: ""
    };
}