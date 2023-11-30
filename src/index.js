import { palabras } from './diccionario.js';
const MENSAJE = document.getElementById('mensaje');
const DICCIONARIO = palabras;
const ESTADO = {
  secret: DICCIONARIO[Math.floor(Math.random() * DICCIONARIO.length)].toLowerCase(),
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill('')),
  filaActual: 0,
  columnaActual: 0,
};

function dibujarGrilla(contenedor) {
  const GRID = document.createElement('div');
  GRID.className = 'grid';

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      dibujarCaja(GRID, i, j);
    }
  }

  contenedor.appendChild(GRID);
}

function actualizarGrilla() {
  for (let i = 0; i < ESTADO.grid.length; i++) {
    for (let j = 0; j < ESTADO.grid[i].length; j++) {
      const BOX = document.getElementById(`box${i}${j}`);
      BOX.textContent = ESTADO.grid[i][j];
    }
  }
}

function dibujarCaja(contenedor, row, col, letra = '') {
  const box = document.createElement('div');
  box.className = 'box';
  box.textContent = letra;
  box.id = `box${row}${col}`;


  contenedor.appendChild(box);
  return box;
}

function obtenerPalabraActual() {
  return ESTADO.grid[ESTADO.filaActual].reduce((prev, curr) => prev + curr).toLowerCase();
}

function esPalabraInvalida(word) {
  return DICCIONARIO.includes(word.toLowerCase());
}

function obtenerNumOcurrenciasSecreto(palabra, letter) {
  let result = 0;
  for (let i = 0; i < palabra.length; i++) {
    if (palabra[i] === letter) {
      result++;
    }
  }
  return result;
}

function obtenerPosicionOcurrencia(word, letter, position) {
  let result = 0;
  for (let i = 0; i <= position; i++) {
    if (word[i] === letter) {
      result++;
    }
  }
  return result;
}

function revelarPalabra(adivinar) {
  const row = ESTADO.filaActual;
  const animation_duration = 500;
  adivinar = adivinar.toLowerCase();
  const secret = ESTADO.secret.toLowerCase();

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`);
    const letra = box.textContent.toLowerCase();
    const keyTile = document.getElementById(`Key${letra.toUpperCase()}`)
    const numOcurrenciasSecreto = obtenerNumOcurrenciasSecreto(secret, letra);
    const numOcurrenciasAdivinanza = obtenerNumOcurrenciasSecreto(adivinar, letra);
    const posicionLetra = obtenerPosicionOcurrencia(adivinar, letra, i);

    setTimeout(() => {
      if (!esPalabraInvalida(adivinar)) {
        box.classList.add('invalid');
        if (keyTile && !keyTile.classList.contains('right')) {
          keyTile.classList.add('invalid');
        }
      } else if (
        numOcurrenciasAdivinanza > numOcurrenciasSecreto &&
        posicionLetra > numOcurrenciasSecreto
      ) {
        box.classList.add('empty');
        if (keyTile && !keyTile.classList.contains('right')) {
          keyTile.classList.add('empty');
        }
      } else {
        if (letra === secret[i]) {
          box.classList.add('right');
          if (keyTile) {
            keyTile.classList.add('right');
          }
        } else if (secret.includes(letra)) {
          box.classList.add('wrong');
          if (keyTile && !keyTile.classList.contains('right')) {
            keyTile.classList.add('wrong');
          }
        } else {
          box.classList.add('empty');
          if (keyTile && !keyTile.classList.contains('right')) {
            keyTile.classList.add('empty');
          }
        }
      }
    }, ((i + 1) * animation_duration) / 2);

    box.classList.add('animated');
    box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
  }
  
  const GANASTE = adivinar === secret;
  const PERDISTE = ESTADO.filaActual === 5;

  function showMessage(message) {
    // Get the message element
    const mensaje = document.getElementById('mensaje');
  
    // Reset the animation
    mensaje.style.animation = 'none';
    mensaje.offsetHeight; // Trigger reflow
    mensaje.style.animation = null; 
  
    // Set the new message
    mensaje.textContent = message;
  }

  setTimeout(() => {
    if (GANASTE) {
      showMessage('Felicidades, ganaste! 😀');
    } else if (PERDISTE) {
      showMessage(`Perdiste!, la palabra secreta era: ${ESTADO.secret}.`);
    } else {
      showMessage(`La palabra ingresada no es válida`);
    }
  }, 3 * animation_duration);
}


function esLetra(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}

function agregarLetra(letra) {
  if (ESTADO.columnaActual === 5) return;
  ESTADO.grid[ESTADO.filaActual][ESTADO.columnaActual] = letra;
  ESTADO.columnaActual++;
}

function removerLetra() {
  if (ESTADO.columnaActual === 0) return;
  ESTADO.grid[ESTADO.filaActual][ESTADO.columnaActual - 1] = '';
  ESTADO.columnaActual--;
}

function iniciar() {
  const juego = document.getElementById('juego');
  dibujarGrilla(juego);

  console.log(`La palabra secreta es: ${ESTADO.secret}`);

  // Listen for Key Press
  document.addEventListener("keyup", (e) => {
    processInputKeyboard(e);
  })
}

let keyboard = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫" ]
]

for (let i = 0; i < keyboard.length; i++) {
    let currRow = keyboard[i];
    let keyboardRow = document.createElement("div");
    keyboardRow.classList.add("keyboard-row");

    for (let j = 0; j < currRow.length; j++) {
        let keyTile = document.createElement("div");

        let key = currRow[j];
        keyTile.innerText = key;
        if (key == "Enter") {
            keyTile.id = "Enter";
        }
        else if (key == "⌫") {
            keyTile.id = "Backspace";
        }
        else if ("A" <= key && key <= "Z") {
            keyTile.id = "Key" + key;
        } 

        keyTile.addEventListener("click", processKey);

        if (key == "Enter") {
            keyTile.classList.add("enter-key-tile");
        } else {
            keyTile.classList.add("key-tile");
        }
        keyboardRow.appendChild(keyTile);
    }
    document.body.appendChild(keyboardRow);
}

function processKey(e) {
    e = { "code" : this.id };
    processInputScreen(e);
}

function processInputKeyboard(e) {
  if (ESTADO.filaActual >= 6) return; // Si ya se han llenado todas las filas, termina el juego

  if ("KeyA" <= e.code && e.code <= "KeyZ") {
    if (ESTADO.columnaActual < 5) { // Si aún no se han llenado todas las columnas de la fila actual
      agregarLetra(e.code[3]); // Agrega la letra a la grilla
    }
  } else if (e.code == "Backspace") {
    removerLetra(); // Remueve la última letra ingresada en la fila actual
  } else if (e.code == "Enter") {
    const palabra = obtenerPalabraActual();
    if (esPalabraInvalida(palabra)) {
      revelarPalabra(palabra);
      ESTADO.filaActual++;
      ESTADO.columnaActual = 0;
    } else {
      MENSAJE.textContent = `Esa palabra no existe en este juego, no hay presupuesto 😔.`;
    }
  }

  actualizarGrilla(); // Actualiza la grilla en el DOM

  if (ESTADO.filaActual === 5) {
    alert(`Perdiste!, la palabra secreta era: ${ESTADO.secret}.`);
  }
}

function processInputScreen(e) {
  if (ESTADO.filaActual >= 6) return; // Si ya se han llenado todas las filas, termina el juego

  if ("KeyA" <= e.code && e.code <= "KeyZ") {
    if (ESTADO.columnaActual < 5) { // Si aún no se han llenado todas las columnas de la fila actual
      agregarLetra(e.code[3]); // Agrega la letra a la grilla
    }
  } else if (e.code == "Backspace") {
    removerLetra(); // Remueve la última letra ingresada en la fila actual
  } else if (e.code == "Enter") {
    const palabra = obtenerPalabraActual();
    if (esPalabraInvalida(palabra)) {
      revelarPalabra(palabra);
      ESTADO.filaActual++;
      ESTADO.columnaActual = 0;
    } else {
      alert('Palabra invalida!');
    }
  }

  actualizarGrilla(); // Actualiza la grilla en el DOM

  if (ESTADO.filaActual === 5) {
    alert(`Perdiste!, la palabra secreta era: ${ESTADO.secret}.`);
  }
}
iniciar();