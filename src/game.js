import xIcon from "./assets/images/x.png";
import oIcon from "./assets/images/o.png";

// Utility Functions
export function hasChildWithClass(parent, className) {
  return parent.querySelector(`.${className}`) !== null;
}

export function hasChildWithID(parent, id) {
  return parent.querySelector(`#${id}`) !== null;
}

// Game Logic
const areasObject = {
  area1: null,
  area2: null,
  area3: null,
  area4: null,
  area5: null,
  area6: null,
  area7: null,
  area8: null,
  area9: null,
};

const simulatedGame = {
  playerActive: null,
  botActive: null,
  currentStatus: {
    hasWon: false,
    active: null,
  },
  allAreas: [
    "area1",
    "area2",
    "area3",
    "area4",
    "area5",
    "area6",
    "area7",
    "area8",
    "area9",
  ],
  area1: null,
  area2: null,
  area3: null,
  area4: null,
  area5: null,
  area6: null,
  area7: null,
  area8: null,
  area9: null,

  setActiveIcon() {
    this.botActive = game.botActive;
    this.playerActive = this.botActive === "x" ? "o" : "x";
  },
};

const patterns = {
  pattern1: ["area1", "area2", "area3"],
  pattern2: ["area1", "area4", "area7"],
  pattern3: ["area1", "area5", "area9"],
  pattern4: ["area2", "area5", "area8"],
  pattern5: ["area3", "area6", "area9"],
  pattern6: ["area4", "area5", "area6"],
  pattern7: ["area7", "area8", "area9"],
  pattern8: ["area7", "area5", "area3"],
};

const game = {
  currentActive: "x",
  mode: "player",
  botActive: "x",
  difficulty: "easy",
  xPlayerScore: 0,
  oPlayerScore: 0,
  areasObject,
  patterns,
  state: "resolved",
  currentStatus: {
    hasWon: false,
    lineID: null,
    currentActive: null,
  },

  newCurrentActive() {
    const rand = Math.random();
    game.currentActive = rand >= 0.5 ? "x" : "o";
  },

  swapPlayer() {
    game.currentActive = game.currentActive === "x" ? "o" : "x";
  },

  getIcon() {
    return game.currentActive === "x" ? xIcon : oIcon;
  },

  checkWinner() {
    let match1;
    let match2;
    let match3;
    for (const key in game.patterns) {
      match1 = game.areasObject[game.patterns[key][0]];
      match2 = game.areasObject[game.patterns[key][1]];
      match3 = game.areasObject[game.patterns[key][2]];
      this.checkMatches("x", key, [match1, match2, match3]);
      if (game.currentStatus.hasWon == true) break;
      this.checkMatches("o", key, [match1, match2, match3]);
      if (game.currentStatus.hasWon == true) break;
    }
    return game.currentStatus;
  },

  checkMatches(icon, key, [match1, match2, match3]) {
    if (match1 === icon && match2 === icon && match3 === icon) {
      let lineIDArray = [];
      game.patterns[key].forEach((patternValue) => {
        lineIDArray.push(patternValue.slice(-1));
      });
      const lineID = lineIDArray.join("");
      game.currentStatus.hasWon = true;
      game.currentStatus.lineID = lineID;
      game.currentStatus.currentActive = icon;
      return;
    }
    game.currentStatus.hasWon = false;
    game.currentStatus.lineID = null;
    game.currentStatus.currentActive = null;
  },

  botChoosesMove() {
    if (game.difficulty === "easy") {
      return this.easyBot();
    } else {
      return this.hardBot();
    }
  },

  easyBot(counter = 1) {
    if (counter < 10) {
      const id = Math.floor(Math.random() * 9) + 1;
      const area = `area${id}`;
      if (game.areasObject[area] === "x" || game.areasObject[area] === "o") {
        counter++;
        return this.easyBot(counter);
      }
      return area;
    }
  },

  hardBot() {
    for (const key in game.areasObject) {
      simulatedGame[key] = game.areasObject[key];
    }
    simulatedGame.setActiveIcon();

    let bestScore = -Infinity;
    let chosenArea;
    const possibleMoves = [];
    simulatedGame.allAreas.forEach((areaString) => {
      if (!simulatedGame[areaString]) {
        possibleMoves.push(areaString);
      }
    });
    possibleMoves.forEach((area) => {
      simulatedGame[area] = simulatedGame.botActive;
      let score = this.minimax(false, 0);
      if (score > bestScore) {
        bestScore = score;
        chosenArea = area;
      }
      simulatedGame[area] = null;
    });
    return chosenArea;
  },

  minimax(isMaximizing, depth) {
    game.simulateCheckWinner();
    if (simulatedGame.currentStatus.active === this.botActive) {
      return 10;
    }
    if (simulatedGame.currentStatus.active === simulatedGame.playerActive) {
      return -10;
    }
    const possibleMoves = [];
    simulatedGame.allAreas.forEach((areaString) => {
      if (!simulatedGame[areaString]) {
        possibleMoves.push(areaString);
      }
    });
    if (possibleMoves.length === 0) return 0;
    if (isMaximizing) {
      let bestScore = -Infinity;
      possibleMoves.forEach((area) => {
        simulatedGame[area] = simulatedGame.botActive;
        let score = this.minimax(false, depth + 1);
        if (score > bestScore) {
          bestScore = score;
        }
        simulatedGame[area] = null;
      });
      return bestScore;
    }
    if (!isMaximizing) {
      let bestScore = Infinity;
      possibleMoves.forEach((area) => {
        simulatedGame[area] = simulatedGame.playerActive;
        let score = this.minimax(true, depth + 1);
        if (score < bestScore) {
          bestScore = score;
        }
        simulatedGame[area] = null;
      });
      return bestScore;
    }
  },

  simulateCheckWinner() {
    let match1;
    let match2;
    let match3;
    for (const key in game.patterns) {
      match1 = simulatedGame[game.patterns[key][0]];
      match2 = simulatedGame[game.patterns[key][1]];
      match3 = simulatedGame[game.patterns[key][2]];
      this.simulatedCheckMatches(simulatedGame.botActive, [
        match1,
        match2,
        match3,
      ]);
      if (simulatedGame.currentStatus.hasWon) break;
      this.simulatedCheckMatches(simulatedGame.playerActive, [
        match1,
        match2,
        match3,
      ]);
      if (simulatedGame.currentStatus.hasWon) break;
    }
    return simulatedGame.currentStatus;
  },

  simulatedCheckMatches(icon, [match1, match2, match3]) {
    if (match1 === icon && match2 === icon && match3 === icon) {
      simulatedGame.currentStatus.hasWon = true;
      simulatedGame.currentStatus.active = icon;
      return;
    }
    simulatedGame.currentStatus.hasWon = false;
    simulatedGame.currentStatus.active = null;
  },

  resetArea() {
    for (const key in game.areasObject) {
      game.areasObject[key] = null;
    }
  },
};

export default game;
