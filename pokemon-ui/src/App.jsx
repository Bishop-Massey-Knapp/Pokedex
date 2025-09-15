import { useState } from "react";
import "./App.css";
import pokedexBase from "./assets/pokedex-base.png";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const fetchPokemon = async (nameOrId) => {
    try {
      setError("");
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPokemon({
        name: data.name,
        id: data.id,
        sprite: data.sprites.front_default,
        types: data.types.map((t) => t.type.name),
      });
    } catch {
      setPokemon(null);
      setError("Pokémon not found!");
    }
  };

  const fetchRandomPokemon = async () => {
    for (let i = 0; i < 5; i++) {
      const randomId = Math.floor(Math.random() * 898) + 1;
      try {
        setError("");
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPokemon({
          name: data.name,
          id: data.id,
          sprite: data.sprites.front_default,
          types: data.types.map((t) => t.type.name),
        });
        return; // Success, exit function
      } catch {
        // Try again
      }
    }
    setPokemon(null);
    setError("Pokémon not found!");
  };

  return (
    <div className="pokedex">
      <img src={pokedexBase} alt="Pokedex shell" className="pokedex-base" />

      {/* Screen: only image or error/message */}
      <div className="screen">
        {pokemon ? (
          <div className="pixelify-sans screen-content">
            <img src={pokemon.sprite} alt={pokemon.name} className="sprite" />
          </div>
        ) : error ? (
          <div className="error-message pixelify-sans">
            {error}
          </div>
        ) : (
          <p className="pixelify-sans">Enter a Pokémon below</p>
        )}
      </div>

      {/* Info container: outside of .screen */}
      {pokemon && (
        <div className="pokemon-info-container pixelify-sans">
          <span className="pokemon-id">{`#${pokemon.id}`}</span>
          <h2>{pokemon.name}</h2>
          <div className="pokemon-types-bar">
            {pokemon.types.map((type) => (
              <span key={type} className="pokemon-type pixelify-sans">{type}</span>
            ))}
          </div>
        </div>
      )}

      {/* Search controls */}
      <div className="controls pixelify-sans">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name or ID"
        />
        <button onClick={() => fetchPokemon(query)}>Search</button>
        <button onClick={fetchRandomPokemon}>
          Random
        </button>
      </div>
    </div>
  );
}

export default App;
