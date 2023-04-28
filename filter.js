const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon/';

const searchInput = document.querySelector('#search-name');
const searchNumber = document.querySelector('#pokemon-search');
const searchButton = document.querySelector('#search-button');
const pokemonContainer = document.querySelector('.pokemon-container');
const gifLoader = document.querySelector('.loader');
const resetContainer = document.querySelector('#reset');

let currentPokemon; // [name, id, image_front, image_back, ability_name, weight]

let currentPokemonId = 152;
let pokemonRequests = [];
let pokemonInContainer = [];

const getPokemonTemplate = () => {
    return `
    <div class="card-pokemon"> 
        <h3>${currentPokemon.name} - ID: ${currentPokemon.id}</h3>
        
        <div class="contenedor">
            <img class="back" src="${currentPokemon.image_back}" alt="${currentPokemon.name}" />
            <img class="top" src="${currentPokemon.image_front}" alt="${currentPokemon.name}" />
        </div>
        
        <p>Habilidad: ${currentPokemon.ability}</p>
        <p>Peso: ${currentPokemon.weight}</p>
    </div>
    `
}

const renderPokemon = () => {
    const template = getPokemonTemplate();
    pokemonContainer.innerHTML += template;

};

const fetchPokemon = (current) => {

    gifLoader.style.display = "none";

    if (pokemonRequests.includes(current)) {
        alert("Ya tienes este POKEMÓN en tu listado!")  
        return;
    } else {
        pokemonRequests.push(current);
    }

    fetch (`${POKEMON_URL}${current}`)
        .then((res) => res.json())
        .then((response) => {
        
            if (pokemonInContainer.includes(response.id)) {
                alert("Ya tienes este POKEMÓN en tu listado!");
                return;
            } else {
                pokemonInContainer.push(response.id);
            }

            currentPokemon = {
                name: response.name,
                id: response.id,
                image_front: response.sprites.other.dream_world.front_default,
                image_back: response.sprites.other.home.front_shiny,
                ability: response.abilities[0].ability.name,
                weight: response.weight,
            };

            renderPokemon();
        })
        .catch(() => {
            pokemonRequests.pop();
            alert("Por favor, debes introducir un valor que sea válido!");
        })

}

const handleSearch = (event) => { 
    const value = searchInput.value.toLowerCase() ? searchInput.value.toLowerCase() : parseInt(searchNumber.value);

    if (searchInput.value && searchNumber.value) {
        searchInput.value = '';
        searchNumber.value = '';
        return alert("Por favor, busca por el nombre o por el ID del POKEMÓN")
    }

    gifLoader.style.display = "block";

    searchInput.value = '';
    searchNumber.value = '';

    setTimeout(() => fetchPokemon(value), 1000)
    
};

resetContainer.addEventListener('click', () => {
    pokemonContainer.innerHTML = "";
    searchInput.value = '';
    searchNumber.value = '';
    pokemonRequests = [];
    pokemonInContainer = [];
})

searchNumber.value = currentPokemonId;
fetchPokemon(currentPokemonId);
searchNumber.value = '';
searchButton.addEventListener('click', handleSearch);