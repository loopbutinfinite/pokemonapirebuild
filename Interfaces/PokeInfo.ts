export interface PokeSearch {
    abilities: FullAbility[],
    id: number,
    location_area_encounters:string,
    moves: FullMoves[],
    name: string
    sprites: Sprite
    types:FullTypes[]
}

export interface PokemonDisplayInfo {
    defaultSprite: string;
    shinySprite: string;
    name: string;
    id: number;
    moves: string;
    abilities: string;
    types: string;
}

export interface Ability {
    name: string,
    url: string
}

export interface FullAbility{
    ability: Ability,
    is_hidden: boolean,
    slot: number
}

export interface Move{
    name: string, 
    url: string
}

export interface FullMoves{
    move: Move,
    version_group_details:[],
}

export interface Sprite{
    front_default: string,
    front_shiny: string
}

export interface Type{
    name: string,
    url: string
}

export interface FullTypes{
    slot: number, 
    type: Type
}

export interface EvolutionEntry{
    name: string, 
    sprite: string
}