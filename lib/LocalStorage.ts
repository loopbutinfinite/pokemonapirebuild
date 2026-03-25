export const SaveToLocalStorage = (pokemonName:string) => {
    let favorites = GetFromLocalStorage();
    if (!favorites.includes(pokemonName)) {
        favorites.push(pokemonName);
        localStorage.setItem("pokemonFavorites", JSON.stringify(favorites));
    }
};

export const GetFromLocalStorage = () => {
    let data = localStorage.getItem("pokemonFavorites");
    if(!data) return [];
    return JSON.parse(data); 
};

export const RemoveFromLocalStorage = (pokemonName: string) => {
    let favorites = GetFromLocalStorage();

    const updatedFavorites = favorites.filter(
        (name: string) => name !== pokemonName
    );

    localStorage.setItem("pokemonFavorites", JSON.stringify(updatedFavorites));
};