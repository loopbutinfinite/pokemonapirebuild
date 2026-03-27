'use client';

import { EvolutionEntry, PokemonDisplayInfo } from "@/Interfaces/PokeInfo";
import { fetchPokemonFromSearch, extractPokemonDisplayInfo, fetchPokemonLocation, getEvolutionData } from "@/lib/Fetches";
import { GetFromLocalStorage, RemoveFromLocalStorage, SaveToLocalStorage } from "@/lib/LocalStorage";
import { Button, Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [pokemonInfo, setPokemonInfo] = useState<PokemonDisplayInfo | null>(null);
  const [pokemonLocation, setPokemonLocation] = useState("");
  const [evolutionPath, setEvolutionPath] = useState("");
  const [evolutions, setEvolutions] = useState<EvolutionEntry[]>([]);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleOpenFavorites = () => {
    const storedFavorites = GetFromLocalStorage();
    setFavorites(storedFavorites);
    setIsOpen(true);
  };

  const loadPokemon = async (identifier: string | number) => {
    setError("");

    const pokeData = await fetchPokemonFromSearch(String(identifier));

    if (!pokeData) {
      setError("This is limited to only Gen 1-5 Pokemon, or the Pokemon was not found. Please try again.");
      setPokemonInfo(null);
      return;
    }

    const displayInfo = extractPokemonDisplayInfo(pokeData);
    setPokemonInfo(displayInfo);

    const location = await fetchPokemonLocation(pokeData.id);
    setPokemonLocation(location);

    const evos = await getEvolutionData(pokeData.name);
    setEvolutions(evos);

    if (evos.length <= 1) {
      setEvolutionPath("N/A. This Pokemon does not evolve.");
    } else {
      const pathNames = evos.map(
        (p) => p.name.charAt(0).toUpperCase() + p.name.slice(1)
      );
      setEvolutionPath(pathNames.join(" -> "));
    }
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    await loadPokemon(searchInput.trim());
  };

  const handleRandom = async () => {
    const randomID = Math.floor(Math.random() * 649) + 1;
    await loadPokemon(randomID);
  };

  return (
    <div className="dark:bg-[#022b3a] bg-[#022b3a]">
      <Drawer className="dark:bg-[#1E2939] bg-[#1E2939]" open={isOpen} onClose={handleClose}>
        <h1 className="text-[28px] font-bold">Favorites List</h1>
        <div className="mt-4">
          {favorites.length === 0 ? (
            <p className="text-white text-[24px] font-bold"></p>
          ) : (
            favorites.map((name, index) => (
              <div
                key={index}
                onClick={async () => {
                  await loadPokemon(name);
                  setIsOpen(false);
                }}
                className="cursor-pointer text-white text-xl mb-2 hover:underline"
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </div>
            ))
          )}
        </div>
      </Drawer>
      <main className="bg-[#1f7a8c] md:mx-15 mx-5 rounded-[20px]">
        <section className="place-items-center mt-15 grid grid-cols-3 pt-5">
          <div>
            <a type="button" onClick={handleOpenFavorites}>
              <Image
                src="/assets/pokeball-favorite-icon-filled.png"
                className="w-[50px] h-[50px]"
                width={50}
                height={50}
                alt="Favorites"
              />
            </a>
            <p className="text-white text-center text-[20px]">Favorites</p>
          </div>
          <input
            type="text"
            placeholder="Enter Pokemon (Gen 1-5) Name or ID #"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-[#D9D9D9] text-black text-[28px] placeholder:text-black placeholder:opacity-50 placeholder:font-bold placeholder:ps-3 rounded-[5px] lg:w-[150%] w-[125%] h-[65px] border-[1px] border-black"
          />
          <div>
            <a onClick={handleRandom} className="cursor-pointer">
              <Image
                src="/assets/pokeball-favorite-icon-colored.png"
                className="w-[50px] h-[50px]"
                width={50}
                height={50}
                alt="Random Pokemon"
              />
            </a>
            <p className="text-white text-[20px]">Random</p>
          </div>
        </section>
        {error && (
          <p className="text-red-300 text-center mt-3 text-lg">{error}</p>
        )}
        <section className="place-items-center text-center text-white mt-9">
          <div className="grid place-items-center grid-cols-2 gap-14">
            <div className="grid place-items-center">
              <a onClick={() => {
                if (pokemonInfo?.name) {
                  SaveToLocalStorage(pokemonInfo.name);
                  setFavorites(GetFromLocalStorage());
                }
              }} className="cursor-pointer">
                <Image
                  src="/assets/icon-check.png"
                  className="w-[35px] h-[35px]"
                  width={35}
                  height={35}
                  alt="Save to favorites"
                />
              </a>
              <p className="text-[18px] lg:text-[24px]">Save to Favorites</p>
            </div>
            <div className="grid place-items-center">
              <a onClick={() => {
                if (pokemonInfo?.name) {
                  RemoveFromLocalStorage(pokemonInfo.name);
                  setFavorites(GetFromLocalStorage());
                }
              }} className="cursor-pointer">
                <Image
                  src="/assets/icon-no-cross.png"
                  className="w-[35px] h-[35px]"
                  width={35}
                  height={35}
                  alt="Remove from favorites"
                />
              </a>
              <p className="text-[18px] lg:text-[24px]">Remove from Favorites</p>
            </div>
          </div>
          <p className="md:text-7xl text-5xl font-bold">
            {pokemonInfo?.name ?? "Pokemon Name"}
          </p>
          <p className="md:text-5xl text-4xl mt-3 font-semibold">
            {pokemonInfo ? `#${pokemonInfo.id}` : "#Pokedex Number"}
          </p>
        </section>
        <section className="grid md:grid-cols-2 md:grid-rows-1 grid-cols-1 grid-rows-2 place-items-center mt-2">
          <div>
            {pokemonInfo?.defaultSprite && (
              <img
                src={pokemonInfo.defaultSprite}
                width={300}
                height={300}
                alt="Default Form"
              />
            )}
            <p className="text-center text-[32px] font-bold text-white">Default Form</p>
          </div>
          <div>
            {pokemonInfo?.shinySprite && (
              <img
                src={pokemonInfo.shinySprite}
                width={300}
                height={300}
                alt="Shiny Form"
              />
            )}
            <p className="text-center text-[32px] font-bold text-white">Shiny Form</p>
          </div>
        </section>
        <article className="mt-10 py-3 text-3xl w-fit rounded-10 text-center text-black bg-[#e1e5f2] mx-auto px-5">
          <p className="text-[28px] lg:text-[32px]">Pokemon's Evolution Path:</p>
          <p className="text-[30px]">{evolutionPath || "Stage1 -> Stage2 -> Stage3"}</p>
        </article>
        <section className="place-items-center grid md:grid-cols-3 md:grid-rows-1 grid-cols-1 grid-rows-3 mt-8 mb-15 sm:mb-5">
          {[0, 1, 2].map((index) =>
            evolutions[index]?.sprite ? (
              <img
                key={index}
                src={evolutions[index].sprite}
                width={200}
                height={200}
                alt={`Evolution ${index + 1}`}
              />
            ) : (
              <div key={index} className="w-[150px] h-[150px]" />
            )
          )}
        </section>
        <section className="grid grid-cols-1 text-[28px] lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 md:mt-10 lg:pb-10 pb-5 place-items-center mx-5 mb-15 gap-2 md:gap-5">
          {[
            { info: "Pokemon's Types:", value: pokemonInfo?.types },
            { info: "Pokemon's Abilities:", value: pokemonInfo?.abilities },
            { info: "Pokemon's Location:", value: pokemonLocation },
            { info: "Pokemon's Moves:", value: pokemonInfo?.moves },
          ].map(({ info, value }) => (
            <article
              key={info}
              className="block h-full w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-[#bfdbf7] dark:border-gray-700 overflow-y-auto mt-5 mb-5"
            >
              <p className="text-black underline text-[25px]">{info}</p>
              <p className="font-normal text-[18px] text-gray-900 dark:text-gray-900 h-[200px]">
                {value || "Pokemon info will be displayed here."}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div >
  );
}