import { EvolutionEntry, PokemonDisplayInfo, PokeSearch } from "@/Interfaces/PokeInfo";


const LAST_GEN5_POKEMON = 649;

export const fetchPokemonFromSearch = async (
    userInput: string
): Promise<PokeSearch | null> => {
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${userInput.toLowerCase()}/`
    );
    if (!response.ok) return null;

    const data: PokeSearch = await response.json();

    if (data.id > LAST_GEN5_POKEMON) return null;

    return data;
};


export const extractPokemonDisplayInfo = (
    pokeData: PokeSearch
): PokemonDisplayInfo => {
    return {
        defaultSprite: pokeData.sprites.front_default,
        shinySprite: pokeData.sprites.front_shiny,
        name:
            pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1),
        id: pokeData.id,
        moves: pokeData.moves.map((item) => item.move.name).join(", "),
        abilities: pokeData.abilities
            .map((item) => item.ability.name)
            .join(", "),
        types: pokeData.types.map((item) => item.type.name).join(", "),
    };
};

export const fetchPokemonLocation = async (
    pokemonId: number
): Promise<string> => {
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}/encounters`
    );
    const data = await response.json();

    if (data.length > 0) {
        return data[0].location_area.name;
    }
    return "N/A. This Pokemon does not have a location.";
};

export const getEvolutionData = async (
    pokemonName: string
): Promise<EvolutionEntry[]> => {
    const speciesRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemonName.toLowerCase()}`
    );
    const speciesData = await speciesRes.json();

    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();

    const evolutionDetails: EvolutionEntry[] = [];
    let currentStep = evoData.chain;

    while (currentStep) {
        const name: string = currentStep.species.name;
        const pokeRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        const pokeData = await pokeRes.json();

        evolutionDetails.push({
            name,
            sprite: pokeData.sprites.front_default,
        });

        currentStep = currentStep.evolves_to[0];
    }

    return evolutionDetails;
};