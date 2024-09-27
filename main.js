const livesElm = document.getElementById("lives");
const letterwallElm = document.getElementById("letterwall");
const guessedCharsElm = document.getElementById("guessed-chars");
const announcmentElm = document.getElementById("announcment");

/**
 * @returns ein zufällig ausgewähltes Wort
 */
function randomWord() {
  const words = ["Kinderwurst", "Unterhaltung", "Clownsnase"];
  return words[Math.floor(Math.random() * words.length)];
}

let secretWord = "";
let lives = 5;
let won = false;
let lost = false;
let guessedChars = [];

function newGame() {
  secretWord = randomWord();
  lives = 5;
  won = false;
  lost = false;
  guessedChars = [];
}

/**
 * @param {string} guess Der Buchstabe, der ausprobiert weden soll.
 * @returns {string} 'player-won' wenn das Spiel gewonnen wurde,
 *  'player-lost' wenn das Spiel verloren wurde,
 *  'character-correct' wenn ein korrekter Buchstabe probiert wurde,
 *  'character-wrong' wenn ein falscher Buchstabe probiert wurde
 */
function makeGuess(guess) {
  // wenn das Spiel bereits vorbei ist, wird nichts gemacht
  if (lost || won) {
    return;
  }

  // wir arbeiten mit Kleinbuchstaben, damit A==a
  guess = guess.toLowerCase();

  // Wenn der Buchtstabe bereits ausprobiert ist, passiert nichts
  if (guessedChars.includes(guess)) {
    return;
  }

  // Buchstabe zu den ausprobierten Buchchstaben hinzufügen
  guessedChars.push(guess);

  // Wenn damit das Wort erraten ist, ist das Spiel gewonnen
  if (isFullyGuessed()) {
    won = true;
    return "player-won";
  }

  // Falls das Wort den Buchstaben enthalten ist geht es mit dem nächsten Zug weiter
  if (secretWord.toLowerCase().includes(guess)) {
    return "character-correct";
  }

  // ansonsten ein Leben abziehen
  lives--;
  // Und wenn keine Leben mehr übrig sind: Verloren!
  if (lives <= 0) {
    lost = true;
    return "player-lost";
  }

  return "character-wrong";
}
/**
 * @returns true, wenn das Wort erraten ist, sonst false
 */
function isFullyGuessed() {
  for (const c of secretWord.toLowerCase()) {
    if (!guessedChars.includes(c)) {
      return false;
    }
  }
  return true;
}

/**
 * @returns die anzuzeigende Buchstabenwand
 */
function letterWall() {
  if (lost || won) {
    return Array.from(secretWord).join(" ");
  }
  return Array.from(secretWord)
    .map((c) => (guessedChars.includes(c.toLowerCase()) ? c : "_"))
    .join(" ");
}

/**
 * aktualisiert das "Spielbrett"
 */
function updateBoard() {
  letterwallElm.textContent = letterWall();
  livesElm.textContent =
    lives + " Versuch" + (lives == 1 ? "" : "e") + " übrig";
  guessedCharsElm.textContent =
    "Bereits probiert: [ " +
    guessedChars
      .sort()
      .map((c) => c.toUpperCase())
      .join(" ") +
    " ]";
}

// initial einmal manuell aufrufen, damit alles auf der Seite auftaucht
newGame();
updateBoard();

// wenn der Spieler eine Taste drückt, wird ein Spielzug gemachen
document.onkeydown = (evt) => {
  // falls das Spiel vorbei ist gibt es eine Sonderbehandling für
  // die Enter-Taste damit ein neues Spiel gestartet werden kann
  if (won || lost) {
    if (evt.key == "Enter") {
      newGame();
      updateBoard();
      document.body.classList.remove("won", "lost");
    }
    return;
  }

  // wir interessieren uns nur für die Buchstaben A bis Z, ansonsten nehmen wir den Versuch nicht an
  if (!evt.key.match(/^[a-z]$/i)) {
    return;
  }

  // gewählte Taste als Versuch in das Spiel geben
  const result = makeGuess(evt.key);

  // "Spielbrett" aktualisieren
  updateBoard();

  if (result == "character-wrong") {
    letterwallElm.classList.add("wrong");
    setTimeout(() => letterwallElm.classList.remove("wrong"), 250);
    return;
  }

  if (result == "character-correct") {
    letterwallElm.classList.add("correct");
    setTimeout(() => letterwallElm.classList.remove("correct"), 250);
    return;
  }

  // if (result == "character-wrong") {
  //   letterwallElm.style.animationIterationCount++;
  //   return;
  // }

  // Spieler hat gewonnen
  if (result == "player-won") {
    document.body.classList.add("won");
    announcmentElm.textContent = "Gewonnen! Neustart mit Enter-Taste.";
    return;
  }

  // Spieler hat verloren
  if (result == "player-lost") {
    document.body.classList.add("lost");
    announcmentElm.textContent = "Verloren! Neustart mit Enter-Taste.";
    return;
  }

  // ansonsten findet einfach der nächste Zug statt
};
