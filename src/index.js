import { palabras } from './diccionario.js';
const diccionario = palabras;
const estado = {
  secret: diccionario[Math.floor(Math.random() * diccionario.length)].toLowerCase(),
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill('')),
  filaActual: 0,
  columnaActual: 0,
};

function dibujarGrilla(contenedor) {
  const grid = document.createElement('div');
  grid.className = 'grid';

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      dibujarCaja(grid, i, j);
    }
  }

  contenedor.appendChild(grid);
}

function actualizarGrilla() {
  for (let i = 0; i < estado.grid.length; i++) {
    for (let j = 0; j < estado.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`);
      box.textContent = estado.grid[i][j];
    }
  }
}

function dibujarCaja(contenedor, row, col, letter = '') {
  const box = document.createElement('div');
  box.className = 'box';
  box.textContent = letter;
  box.id = `box${row}${col}`;


  contenedor.appendChild(box);
  return box;
}

function obtenerPalabraActual() {
  return estado.grid[estado.filaActual].reduce((prev, curr) => prev + curr).toLowerCase();
}

function esPalabraInvalida(word) {
  return diccionario.includes(word.toLowerCase());
}

function obtenerNumOcurrenciasSecreto(word, letter) {
  let result = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
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
  const row = estado.filaActual;
  const animation_duration = 500; // ms
  adivinar = adivinar.toLowerCase();
  const secret = estado.secret.toLowerCase();

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
  const PERDISTE = estado.filaActual === 5;

  setTimeout(() => {
    if (GANASTE) {
      alert('Felicidades, ganaste!');
    } else if (PERDISTE) {
      alert(`Perdiste!, la palabra secreta era: ${estado.secret}.`);
    } else {
      alert(`La palabra ingresada no es válida, pero aquí está lo que escribiste: ${adivinar}`);
    }
  }, 3 * animation_duration);
}

function esLetra(key) {
  return key.length === 1 && key.match(/[a-z]/i);
}

function agregarLetra(letra) {
  if (estado.columnaActual === 5) return;
  estado.grid[estado.filaActual][estado.columnaActual] = letra;
  estado.columnaActual++;
}

function removerLetra() {
  if (estado.columnaActual === 0) return;
  estado.grid[estado.filaActual][estado.columnaActual - 1] = '';
  estado.columnaActual--;
}

function iniciar() {
  const juego = document.getElementById('juego');
  dibujarGrilla(juego);

  console.log(`La palabra secreta es: ${estado.secret}`);

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
            keyTile.id = "Key" + key; // "Key" + "A";
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
  if (estado.filaActual >= 6) return; // Si ya se han llenado todas las filas, termina el juego

  if ("KeyA" <= e.code && e.code <= "KeyZ") {
    if (estado.columnaActual < 5) { // Si aún no se han llenado todas las columnas de la fila actual
      agregarLetra(e.code[3]); // Agrega la letra a la grilla
    }
  } else if (e.code == "Backspace") {
    removerLetra(); // Remueve la última letra ingresada en la fila actual
  } else if (e.code == "Enter") {
    const palabra = obtenerPalabraActual();
    if (esPalabraInvalida(palabra)) {
      revelarPalabra(palabra);
      estado.filaActual++;
      estado.columnaActual = 0;
    } else {
      alert('Palabra invalida!');
    }
  }

  actualizarGrilla(); // Actualiza la grilla en el DOM

  if (estado.filaActual === 5) {
    alert(`Perdiste!, la palabra secreta era: ${estado.secret}.`);
  }
}

function processInputScreen(e) {
  if (estado.filaActual === 5) return; // Si ya se han llenado todas las filas, termina el juego

  if ("KeyA" <= e.code && e.code <= "KeyZ") {
    if (estado.columnaActual < 5) { // Si aún no se han llenado todas las columnas de la fila actual
      agregarLetra(e.code[3]); // Agrega la letra a la grilla
    }
  } else if (e.code == "Backspace") {
    removerLetra(); // Remueve la última letra ingresada en la fila actual
  } else if (e.code == "Enter") {
    const palabra = obtenerPalabraActual();
    if (esPalabraInvalida(palabra)) {
      revelarPalabra(palabra);
      estado.filaActual++;
      estado.columnaActual = 0;
    } else {
      alert('Palabra invalida!');
    }
  }

  actualizarGrilla(); // Actualiza la grilla en el DOM

  if (estado.filaActual === 5) {
    alert(`Perdiste!, la palabra secreta era: ${estado.secret}.`);
  }
}

// document.getElementById('reiniciar').addEventListener('click', reiniciar);
// function reiniciar() {
//   window.location.reload();
// }
iniciar();