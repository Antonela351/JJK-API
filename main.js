let currentRound = 1;
let correctChar = null;
let usedIndexes = [];

// Base de datos local: conserva tus pistas premium en español
const characters = [
    { name: "Yuji Itadori", img: "itadori.jpg", clue: "Un recipiente anómalo capaz de resistir el veneno más letal de la historia sin perder el control de su propia alma. Su estilo de combate altera el espacio-tiempo mediante un desfase en el impacto de su energía." },
    { name: "Megumi Fushiguro", img: "megumi.jpg", clue: "Heredero de una técnica ancestral basada en las sombras. Su destino está ligado a un ritual de subyugación suicida que involucra a un general divino incontrolable." },
    { name: "Nobara Kugisaki", img: "nobara.jpg", clue: "Utiliza herramientas mundanas imbuidas con su esencia para atacar el núcleo espiritual de sus objetivos a larga distancia, manifestando su poder a través de la resonancia y la necrosis." },
    { name: "Satoru Gojo", img: "gojo.jpg", clue: "Poseedor de una anomalía ocular hereditaria que le permite procesar el procesamiento atómico del espacio. Su sola existencia alteró el equilibrio de poder del mundo entero desde su nacimiento." },
    { name: "Ryomen Sukuna", img: "sukuna.jpg", clue: "El Rey de las Maldiciones, un filósofo del egoísmo absoluto que corta y desmantela todo a su paso. Su técnica culinaria de combate divide la realidad en trazos invisibles." },
    { name: "Kento Nanami", img: "nanami.jpg", clue: "Un antiguo oficinista que rige su combate bajo un estricto contrato de horarios. Su técnica fuerza un punto débil matemático dividiendo el cuerpo del rival en una proporción exacta de 7:3." },
    { name: "Suguru Geto", img: "geto.jpg", clue: "Su doctrina radical buscaba la extinción total de los no-hechiceros para detener la filtración de energía maldita. Su arsenal consistía en ingerir esferas concentradas de lamentos." },
    { name: "Maki Zenin", img: "maki.jpg", clue: "Rechazada por su propio clan debido a una restricción celestial que eliminó su energía maldita a cambio de otorgarle sentidos sobrehumanos y una dureza física inigualable." },
    { name: "Toge Inumaki", img: "inumaki.jpg", clue: "Se comunica exclusivamente mediante ingredientes de bolas de arroz para evitar que la autoridad de sus palabras rompa la garganta de sus aliados o destruya la mente de sus enemigos." },
    { name: "Panda", img: "panda.jpg", clue: "Un cadáver mutado de manera abrupta por el Director Yaga. Posee tres núcleos internos independientes que representan personalidades y estilos de combate completamente distintos." },
    { name: "Yuta Okkotsu", img: "yuta.jpg", clue: "Un hechicero de grado especial que inicialmente maldijo al alma de su amiga de la infancia. Su capacidad de almacenamiento de energía maldita es teóricamente superior a la del portador del Ilimitado." },
    { name: "Aoi Todo", img: "todo.jpg", clue: "Un excéntrico estudiante de Kioto con un coeficiente intelectual brillante. Su técnica se activa con un simple aplauso, intercambiendo la posición de dos objetos que contengan energía." },
    { name: "Mahito", img: "mahito.jpg", clue: "Una maldición nacida del odio y el miedo entre humanos. Su destreza le permite remodelar la forma de las almas con solo tocarlas, cambiando la biología de sus víctimas a voluntad." },
    { name: "Jogo", img: "jogo.jpg", clue: "Una maldición de grado especial nacida del temor a la tierra y los volcanes. Su arrogancia lo llevó a desafiar al hechicero más fuerte, terminando calcinado por un desplégueme de poder superior." },
    { name: "Hanami", img: "hanami.jpg", clue: "Manifestación del ecosistema terrestre que busca erradicar a la humanidad para salvar al planeta. Se comunica mediante vibraciones y un lenguaje invertido directo a la mente." },
    { name: "Toji Fushiguro", img: "toji.jpg", clue: "El 'Asesino de Hechiceros'. Cero energía maldita absoluta, pero capaz de burlar las barreras automáticas más complejas y portar un arsenal oculto dentro de un espíritu simbiótico." },
    { name: "Choso", img: "choso.jpg", clue: "El mayor de las Pinturas de la Muerte. Su devoción fraternal le permite percibir el estado vital de sus hermanos sin importar la distancia, usando su propia sangre como proyectil sólido." },
    { name: "Mei Mei", img: "meimei.jpg", clue: "Una cazadora impulsada netamente por transacciones financieras. Lleva consigo un hacha gigante y manipula aves para que realicen votos de sacrificio suicida contra sus objetivos." },
    { name: "Yuki Tsukumo", img: "yuki.jpg", clue: "Una de las pocas chamanes de grado especial. Su investigación se centra en erradicar la energía maldita en lugar de gestionarla, y su técnica le otorga una masa virtual inimaginable." }
];

// Petición AJAX integrada para actualizar las imágenes locales por las URLs de internet de la API
function cargarImagenesDesdeAPI() {
    let url = "https://api.jikan.moe/v4/anime/51009/characters";
    let xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                let response = JSON.parse(this.responseText);
                let personajesAPI = response.data;

                // Cruzamos los datos: si el nombre de tu array coincide con la API, le inyectamos su imagen real
                characters.forEach(localChar => {
                    let encontrado = personajesAPI.find(apiChar => 
                        apiChar.character.name.toLowerCase().includes(localChar.name.toLowerCase()) || 
                        localChar.name.toLowerCase().includes(apiChar.character.name.toLowerCase())
                    );
                    if (encontrado) {
                        localChar.img = encontrado.character.images.jpg.image_url;
                    }
                });

                console.log("Imágenes de la API enlazadas correctamente a la base de datos.");
            } else {
                console.error("No se pudieron cargar las imágenes de la API. Código: " + this.status);
            }
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send();
}

function startGame() {
    currentRound = 1;
    usedIndexes = [];
    document.getElementById('reveal-correct').innerText = ""; 
    showScreen('game-screen');
    setupRound();
}

function setupRound() {
    document.getElementById('current-round').innerText = currentRound;
    
    document.getElementById('quiz-content').classList.remove('hidden');
    document.getElementById('feedback-container').classList.add('hidden');

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * characters.length);
    } while (usedIndexes.includes(randomIndex));
    
    usedIndexes.push(randomIndex);
    correctChar = characters[randomIndex];

    document.getElementById('clue-text').innerText = correctChar.clue;

    let options = [correctChar.name];
    while(options.length < 5) {
        let rName = characters[Math.floor(Math.random() * characters.length)].name;
        if(!options.includes(rName)) options.push(rName);
    }
    
    options.sort(() => Math.random() - 0.5);

    const container = document.getElementById('options-container');
    container.innerHTML = '';
    options.forEach(name => {
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.innerText = name;
        btn.onclick = () => check(name);
        container.appendChild(btn);
    });
}

function check(selected) {
    if(selected === correctChar.name) {
        showFeedback();
    } else {
        document.getElementById('reveal-correct').innerText = `El hechicero/maldición era: ${correctChar.name}`;
        showScreen('game-over-screen');
    }
}

function showFeedback() {
    document.getElementById('quiz-content').classList.add('hidden');
    
    document.getElementById('feedback-name').innerText = correctChar.name;
    // Mostrará la URL directa de internet proporcionada por la API
    document.getElementById('character-img').src = correctChar.img;
    
    document.getElementById('feedback-container').classList.remove('hidden');
}

function nextRound() {
    if(currentRound < 5) { 
        currentRound++;
        setupRound();
    } else {
        showScreen('victory-screen');
    }
}

function showScreen(id) {
    const ids = ['start-screen', 'game-screen', 'game-over-screen', 'victory-screen'];
    ids.forEach(s => document.getElementById(s).classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

function goToHome() { 
    showScreen('start-screen'); 
}

// Al cargar la ventana, llamamos inmediatamente a la API para preparar el juego
window.onload = () => {
    cargarImagenesDesdeAPI();
    console.log("Energía Maldita Estabilizada.");
};