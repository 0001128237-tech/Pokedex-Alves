
let pokemonAtual = null;
let numPokemon = "";


const numberDisplay = document.getElementById("number-display");
const infoScreen = document.getElementById("info-screen");
const mainScreen = document.getElementById("main-screen");
function leituraTeclado(tecla) {
    if (numPokemon.length >= 4) {
        return;
    }

    numPokemon += tecla;
    numberDisplay.innerText = numPokemon;
}


function apagar() {
    numPokemon = numPokemon.slice(0, -1);

    numberDisplay.innerText = numPokemon || "000";

    if (numPokemon === "") {
        infoScreen.innerText = "Aguardando dados...";
        mainScreen.innerHTML = "Nenhum Pokémon carregado";
        pokemonAtual = null;
    }
}


async function consultarApi(id) {
    infoScreen.innerText = "Carregando Pokémon...";
    mainScreen.innerText = "Carregando imagem...";

    try {
        
        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${id}`
        );

        if (!resposta.ok) {
            throw new Error("Pokémon não encontrado.");
        }

        const data = await resposta.json();

        
        pokemonAtual = data.id;
        numPokemon = String(data.id);

        numberDisplay.innerText =
            "#" + String(data.id).padStart(3, "0");

        
        mainScreen.innerHTML = "";

        const imagem = document.createElement("img");

        imagem.src = data.sprites.front_default;
        imagem.alt = data.name;
        imagem.style.maxWidth = "100%";
        imagem.style.maxHeight = "100%";

        mainScreen.appendChild(imagem);

        
        const tipos = data.types
            .map(tipo => tipo.type.name)
            .join(", ");

        
        let regiao = "Não identificada";

        try {
            const respostaEspecie = await fetch(data.species.url);

            if (!respostaEspecie.ok) {
                throw new Error("Erro ao consultar a espécie.");
            }

            const especie = await respostaEspecie.json();

            
            const regioes = {
                "generation-i": "Kanto",
                "generation-ii": "Johto",
                "generation-iii": "Hoenn",
                "generation-iv": "Sinnoh",
                "generation-v": "Unova",
                "generation-vi": "Kalos",
                "generation-vii": "Alola",
                "generation-viii": "Galar",
                "generation-ix": "Paldea"
            };

            regiao = regioes[especie.generation.name]
                || "Não identificada";

        } catch (erroRegiao) {
            console.log("Erro ao consultar região:", erroRegiao);
        }

        // Mostra as informações na tela
        infoScreen.innerHTML = `
            <strong>${data.name.toUpperCase()}</strong><br>
            Número: ${data.id}<br>
            Tipo: ${tipos}<br>
            Altura: ${data.height / 10} m<br>
            Peso: ${data.weight / 10} kg<br>
            Região: ${regiao}
        `;

    } catch (erro) {
        pokemonAtual = null;

        infoScreen.innerText =
            "Pokémon não encontrado ou erro na conexão.";

        mainScreen.innerText = "Nenhum Pokémon carregado";

        numberDisplay.innerText = "000";

        console.log("Erro na consulta:", erro);
    }
}

function buscarPokemon() {
    if (numPokemon === "") {
        infoScreen.innerText = "Digite um número primeiro.";
        return;
    }

    const id = Number(numPokemon);

    if (!Number.isInteger(id) || id < 1 || id > 1025) {
        infoScreen.innerText = "Digite um número entre 1 e 1025.";
        return;
    }

    consultarApi(id);
}

for (let i = 1; i <= 9; i++) {
    document.getElementById(`key-${i}`)
        .addEventListener("click", function() {
            leituraTeclado(String(i));
        });
}
document.getElementById("key-10")
    .addEventListener("click", function() {
        leituraTeclado("0");
    });


document.getElementById("btn-white-left")
    .addEventListener("click", buscarPokemon);


document.getElementById("btn-white-right")
    .addEventListener("click", apagar);


function trocarPokemon(valor) {
    if (pokemonAtual === null) {
        infoScreen.innerText = "Pesquise um Pokémon primeiro.";
        return;
    }

    const novoId = pokemonAtual + valor;

    if (novoId < 1 || novoId > 1025) {
        infoScreen.innerText = "Não existe Pokémon nesse número.";
        return;
    }

    consultarApi(novoId);
}


document.getElementById("btn-left")
    .addEventListener("click", function() {
        trocarPokemon(-1);
    });


document.getElementById("btn-right")
    .addEventListener("click", function() {
        trocarPokemon(1);
    });

document.getElementById("btn-up")
    .addEventListener("click", function() {
        trocarPokemon(10);
    });


document.getElementById("btn-down")
    .addEventListener("click", function() {
        trocarPokemon(-10);
    });