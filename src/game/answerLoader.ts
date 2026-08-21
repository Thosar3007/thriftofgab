import pokemon from "../data/pokemon.json";
import games from "../data/games.json";
import pkmncharacters from "../data/pkmncharacters.json";
import pkmnitems from "../data/pkmnitems.json";
import animals from "../data/animals.json";
import objects from "../data/objects.json";
import people from "../data/people.json";
import places from "../data/places.json";
import actions from "../data/actions.json";
import starwars from "../data/starwars.json";
import bridgerton from "../data/bridgerton.json";
import type { AnswerDefinition } from "../types/AnswerDefinition";

export function loadAnswers(categories: string[]): AnswerDefinition[] {

    let answers: AnswerDefinition[] = [];

    if (categories.includes("Pokemon")) {
        answers.push(...pokemon);
    }

    if (categories.includes("Games")) {
        answers.push(...games);
    }
	
	if (categories.includes("PkmnCharacters")) {
        answers.push(...pkmncharacters);
    }
	
	if (categories.includes("PkmnItems")) {
        answers.push(...pkmnitems);
    }
	
	if (categories.includes("animals")) {
        answers.push(...animals);
    }
	
	if (categories.includes("objects")) {
        answers.push(...objects);
    }
	
	if (categories.includes("actions")) {
        answers.push(...actions);
    }

	if (categories.includes("people")) {
        answers.push(...people);
    }

	if (categories.includes("places")) {
        answers.push(...places);
    }	

	if (categories.includes("StarWars")) {
        answers.push(...starwars);
    }

	if (categories.includes("Bridgerton")) {
        answers.push(...bridgerton);
    }
	
    return answers;
}