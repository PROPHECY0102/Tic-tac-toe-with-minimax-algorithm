"use strict";

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
  mode: null,
  playerActive: null,
  botActive: null,
  difficulty: "easy",
  xScore: 0,
  oScore: 0,
  playerScore: 0,
  botScore: 0,
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
    this.currentActive = rand >= 0.5 ? "x" : "o";
  },

  setActiveIcon(choice) {
    this.playerActive = choice;
    this.botActive = this.playerActive === "x" ? "o" : "x";
  },

  swapPlayer() {
    this.currentActive = this.currentActive === "x" ? "o" : "x";
  },

  getIcon() {
    return this.currentActive === "x" ? xIcon : oIcon;
  },

  checkWinner() {
    let match1;
    let match2;
    let match3;
    for (const key in this.patterns) {
      match1 = this.areasObject[this.patterns[key][0]];
      match2 = this.areasObject[this.patterns[key][1]];
      match3 = this.areasObject[this.patterns[key][2]];
      this.checkMatches("x", key, [match1, match2, match3]);
      if (this.currentStatus.hasWon == true) break;
      this.checkMatches("o", key, [match1, match2, match3]);
      if (this.currentStatus.hasWon == true) break;
    }
    this.incrementPoint();
    return this.currentStatus;
  },

  checkMatches(icon, key, [match1, match2, match3]) {
    if (match1 === icon && match2 === icon && match3 === icon) {
      let lineIDArray = [];
      this.patterns[key].forEach((patternValue) => {
        lineIDArray.push(patternValue.slice(-1));
      });
      const lineID = lineIDArray.join("");
      this.currentStatus.hasWon = true;
      this.currentStatus.lineID = lineID;
      this.currentStatus.currentActive = icon;
      return;
    }
    this.currentStatus.hasWon = false;
    this.currentStatus.lineID = null;
    this.currentStatus.currentActive = null;
  },

  incrementPoint() {
    if (this.mode === "player") this.incrementVsPlayer();
    if (this.mode === "bot") this.incrementVsBot();
  },

  incrementVsPlayer() {
    if (this.currentStatus.currentActive === "x") this.xScore++;
    if (this.currentStatus.currentActive === "o") this.oScore++;
  },

  incrementVsBot() {
    if (this.currentStatus.currentActive === this.playerActive)
      this.playerScore++;
    if (this.currentStatus.currentActive === this.botActive) this.botScore++;
  },

  botChoosesMove() {
    if (this.difficulty === "easy") {
      return this.easyBot();
    } else {
      return this.hardBot();
    }
  },

  easyBot(counter = 1) {
    if (counter < 10) {
      const id = Math.floor(Math.random() * 9) + 1;
      const area = `area${id}`;
      if (this.areasObject[area] === "x" || this.areasObject[area] === "o") {
        counter++;
        return this.easyBot(counter);
      }
      return area;
    }
  },

  hardBot() {
    for (const key in this.areasObject) {
      simulatedGame[key] = this.areasObject[key];
    }
    simulatedGame.setActiveIcon();

    let bestScore = -Infinity;
    let chosenArea;
    const possibleMoves = simulatedGame.allAreas.filter((areaString) => {
      if (!simulatedGame[areaString]) {
        return areaString;
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
    if (simulatedGame.currentStatus.active === simulatedGame.botActive) {
      return 10;
    }
    if (simulatedGame.currentStatus.active === simulatedGame.playerActive) {
      return -10;
    }
    const possibleMoves = simulatedGame.allAreas.filter((areaString) => {
      if (!simulatedGame[areaString]) {
        return areaString;
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
    for (const key in this.patterns) {
      match1 = simulatedGame[this.patterns[key][0]];
      match2 = simulatedGame[this.patterns[key][1]];
      match3 = simulatedGame[this.patterns[key][2]];
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
    for (const key in this.areasObject) {
      this.areasObject[key] = null;
    }
  },

  resetScore() {
    this.xScore = 0;
    this.oScore = 0;
    this.playerScore = 0;
    this.botScore = 0;
  },
};

export default game;
