const livesElm = document.getElementById("lives");
const letterwallElm = document.getElementById("letterwall");
const guessedCharsElm = document.getElementById("guessed-chars");
const announcmentElm = document.getElementById("announcment");

/**
 * @returns ein zufällig ausgewähltes Wort
 */
function randomWord() {
  const words = ["Straßenlaterne", "Unterhaltung", "Clownsnase"];
  return words[Math.floor(Math.random() * words.length)];
}

/**
 * Legt ein neues Spiel an
 * @param {string} word Das zu erratende Word
 * @param {number} lives Die initiale Anzahl an Leben
 * @returns ein Spiel
 */
function newGame(word, lives) {
  return {
    /** das gesuchte Wort */
    secretWord: word,
    /** bereits geratene Buchstaben */
    guessedChars: [],
    /** Anzahl an verbliebenen Leben */
    lives: lives,
    /** Zeigt an, ob das Spiel gewonnen ist */
    won: false,
    /** Zeigt an, ob das Spiel verloren ist */
    lost: false,
    /**
     * Führt einen Spielzug aus und aktualisiert das Spiel
     * @param {string} guess der Buchstabe, der ausprobiert werden soll
     */
    makeGuess(guess) {
      // wenn das Spiel bereits vorbei ist, wird nichts gemacht
      if (this.isOver()) {
        return;
      }

      // wir arbeiten mit Kleinbuchstaben, damit A==a
      guess = guess.toLowerCase();

      // Wenn der Buchtstabe bereits ausprobiert ist, passiert nichts
      if (this.guessedChars.includes(guess)) {
        return;
      }

      // Buchstabe zu den ausprobierten Buchchstaben hinzufügen
      this.guessedChars.push(guess);

      // Wenn damit das Wort erraten ist, ist das Spiel gewonnen
      if (this.isFullyGuessed()) {
        this.won = true;
        return;
      }

      // Falls das Wort den Buchstaben nicht enthält, ein Leben abziehen
      if (!this.secretWord.includes(guess)) {
        this.lives--;
      }

      // Und wenn keine Leben mehr übrig sind: Verloren!
      if (this.lives <= 0) {
        this.lost = true;
        return;
      }
    },
    /**
     * @returns true, wenn das Wort erraten ist, sonst false
     */
    isFullyGuessed() {
      for (const c of this.secretWord.toLowerCase()) {
        if (!this.guessedChars.includes(c)) {
          return false;
        }
      }
      return true;
    },
    /**
     * @returns die anzuzeigende Buchstabenwand
     */
    letterWall() {
      if (this.lost || this.won) {
        return Array.from(this.secretWord).join(" ");
      }
      return Array.from(this.secretWord)
        .map((c) => (this.guessedChars.includes(c.toLowerCase()) ? c : "_"))
        .join(" ");
    },
    /**
     * @returns true, wenn das Spiel vorbei ist, sonst false
     */
    isOver() {
      return this.lost || this.won;
    },
  };
}

// neues Spiel anlegen
let game = newGame(randomWord(), 5);

/**
 * aktualisiert das "Spielbrett"
 */
function updateBoard() {
  letterwallElm.textContent = game.letterWall();
  livesElm.textContent =
    game.lives + " Versuch" + (game.lives == 1 ? "" : "e") + " übrig";
  guessedCharsElm.textContent =
    "Bereits probiert: [ " +
    game.guessedChars
      .sort()
      .map((c) => c.toUpperCase())
      .join(" ") + " ]";
}

// initial einmal manuell aufrufen, damit alles auf der Seite auftaucht
updateBoard();

// wenn der Spieler eine Taste drückt, wird ein Spielzug gemachen
document.onkeydown = (evt) => {
  // falls das Spiel vorbei ist gibt es eine Sonderbehandling für
  // die Enter-Taste damit ein neues Spiel gestartet werden kann
  if (game.isOver() && evt.key == "Enter") {
    game = newGame(randomWord(), 5);
    updateBoard();
    document.body.classList.remove("won", "lost");
    return;
  }

  // alle Tasten die nicht ein Zeichen lang sind werden ignoriert, z.B. Backspace und so
  if (evt.key.length != 1) {
    return;
  }

  // gewählte Taste als Versuch in das Spiel geben
  game.makeGuess(evt.key);

  // "Spielbrett" aktualisieren
  updateBoard();

  // Spieler hat gewonnen
  if (game.won) {
    document.body.classList.add("won");
    announcmentElm.textContent = "Gewonnen! Neustart mit Enter-Taste.";
    return;
  }

  // Spieler hat verloren
  if (game.lost) {
    document.body.classList.add("lost");
    announcmentElm.textContent = "Verloren! Neustart mit Enter-Taste.";
    return;
  }

  // ansonsten findet einfach der nächste Zug statt
};
