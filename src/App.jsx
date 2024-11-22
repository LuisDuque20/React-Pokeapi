import React, { useState } from 'react';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', height: '', weight: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const pokemonInput = e.target.pokemonInput.value.toLowerCase();
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonInput}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Pokemon no encontrado');
        }
        return response.json();
      })
      .then((data) => {
        setError(null);

        const newPokemon = {
          id: data.id,
          name: data.name.toUpperCase(),
          sprite: data.sprites.front_default,
          height: data.height / 10,
          weight: data.weight / 10,
          types: data.types.map((typeInfo) => typeInfo.type.name).join(', '),
          abilities: data.abilities.map((abilityInfo) => abilityInfo.ability.name).join(', '),
        };

        setPokemonList((prevList) => [newPokemon, ...prevList]);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleDelete = (id) => {
    setPokemonList((prevList) => prevList.filter((pokemon) => pokemon.id !== id));
  };

  const handleEdit = (pokemon) => {
    setIsEditing(pokemon.id);
    setEditForm({
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
    });
  };

  const handleSaveEdit = (id) => {
    setPokemonList((prevList) =>
      prevList.map((pokemon) =>
        pokemon.id === id
          ? { ...pokemon, name: editForm.name, height: editForm.height, weight: editForm.weight }
          : pokemon
      )
    );
    setIsEditing(null);
  };

  return (
    <div className="container">
      <h1>Información de Pokemon</h1>
      <form id="pokemonForm" onSubmit={handleSubmit}>
        <label htmlFor="pokemonInput">Nombre o ID: </label>
        <input
          type="text"
          id="pokemonInput"
          name="pokemonInput"
          placeholder="Ejemplo: Nidoking o 34"
          required
        />
        <button type="submit">Buscar Pokémon</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div id="pokemonInfo">
        {pokemonList.map((pokemon) => (
          <div key={pokemon.id} className="pokemon-container">
            {isEditing === pokemon.id ? (
              <div>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
                <input
                  type="number"
                  value={editForm.height}
                  onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                />
                <input
                  type="number"
                  value={editForm.weight}
                  onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
                />
                <button onClick={() => handleSaveEdit(pokemon.id)}>Guardar</button>
              </div>
            ) : (
              <div>
                <h2>{pokemon.name}</h2>
                <p><strong>ID:</strong> {pokemon.id}</p>
                <img src={pokemon.sprite} alt={pokemon.name} />
                <p><strong>Altura:</strong> {pokemon.height} m</p>
                <p><strong>Peso:</strong> {pokemon.weight} kg</p>
                <p><strong>Tipo(s):</strong> {pokemon.types}</p>
                <p><strong>Habilidades:</strong> {pokemon.abilities}</p>
              </div>
            )}

            <button onClick={() => handleDelete(pokemon.id)}>Eliminar</button>
            {isEditing !== pokemon.id && (
              <button onClick={() => handleEdit(pokemon)}>Editar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
