"strict mode";

import githubIcon from "./assets/images/github.png";
import twitterIcon from "./assets/images/twitter.png";
import xIcon from "./assets/images/x.png";
import oIcon from "./assets/images/o.png";

const githubLink = document.querySelector(".github-icon");
const twitterLink = document.querySelector(".twitter-icon");

githubLink.setAttribute("src", githubIcon);
twitterLink.setAttribute("src", twitterIcon);

// Closing modal overlay functionality
const closeIcons = document.querySelectorAll(".close");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const modalContents = document.querySelectorAll(".modal-content");

closeIcons.forEach((close) => {
  close.addEventListener("click", () => {
    closeOverlay();
  });
});

function closeOverlay() {
  overlay.toggleAttribute("data-visible");
  modal.toggleAttribute("data-visible");
  modalContents.forEach((content) => {
    if (content.hasAttribute("data-visible")) {
      content.toggleAttribute("data-visible");
    }
  });
}

// Game Object

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
  xPlayerScore: 0,
  oPlayerScore: 0,
  areasObject,
  patterns,
  state: "resolved",
  currentStatus: [],

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
      if (game.currentStatus[0] == true) break;
      this.checkMatches("o", key, [match1, match2, match3]);
      if (game.currentStatus[0] == true) break;
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
      game.currentStatus = [true, lineID, icon];
      return;
    }
    game.currentStatus = [false, null, null];
  },

  resetArea() {
    for (const key in game.areasObject) {
      game.areasObject[key] = null;
    }
  },
};

// Pre-Render Landing Page
const areas = document.querySelectorAll(".area");

function initialiseArea() {
  let tempIcon = "x";
  areas.forEach((area) => {
    const occupiedDiv = document.createElement("div");
    occupiedDiv.classList.add("occupied");
    occupiedDiv.setAttribute("data-player", tempIcon);
    area.appendChild(occupiedDiv);
    tempIcon = tempIcon === "x" ? "o" : "x";
  });
  renderOccupiedAreas();
}

function renderOccupiedAreas() {
  const occupiedAreas = document.querySelectorAll(".occupied");
  occupiedAreas.forEach((area) => {
    const playerData = area.getAttribute("data-player");
    const icon = playerData === "x" ? xIcon : oIcon;
    if (!hasChildWithClass(area, "active-icon")) {
      const activeIcon = document.createElement("img");
      activeIcon.classList.add("active-icon");
      activeIcon.setAttribute("src", icon);
      area.append(activeIcon);
    }
  });
}

function hasChildWithClass(parent, className) {
  return parent.querySelector(`.${className}`) !== null;
}

// Menu Button Functionality

const vsPlayerButtons = document.querySelectorAll(".vs-player");
const coinflipModal = document.querySelector(".coinflip-container");

function initialiseMenu() {
  vsPlayerEnable();
}

function vsPlayerEnable() {
  vsPlayerButtons.forEach((vsPlayer) => {
    vsPlayer.addEventListener("click", coinflip);
  });
}

function coinflip() {
  game.state = "resolved";
  game.newCurrentActive();
  overlay.toggleAttribute("data-visible");
  modal.toggleAttribute("data-visible");
  coinflipModal.toggleAttribute("data-visible");
  animate(game.currentActive);
}

// Coinflip Functionality
const iconAnimation = document.querySelector(".coinflip-animation");
const coinflipResultText = document.querySelector(".coinflip-result");

function animate(playerIcon) {
  const threshold = 10;
  let nextIcon = xIcon;
  let counter = 0;
  coinflipResultText.innerText = "...";
  if (iconAnimation.hasAttribute("data-no-animation")) {
    iconAnimation.toggleAttribute("data-no-animation");
  }
  const intervalID = setInterval(() => {
    nextIcon = nextIcon === xIcon ? oIcon : xIcon;
    iconAnimation.setAttribute("src", nextIcon);
    counter++;
    if (counter >= threshold) {
      clearInterval(intervalID);
      const finalIcon = playerIcon === "x" ? xIcon : oIcon;
      iconAnimation.setAttribute("src", finalIcon);
      iconAnimation.toggleAttribute("data-no-animation");
      showCoinflipResult(playerIcon);
      setTimeout(() => {
        closeOverlay();
        start();
      }, 1000);
    }
  }, 300);
}

function showCoinflipResult(playerIcon) {
  coinflipResultText.setAttribute("data-player", playerIcon);
  coinflipResultText.innerText = `${playerIcon.toUpperCase()}-player's turn first`;
}

// Initialise Game

const turnMessage = document.querySelector(".turn-message");

function changeTurnMessage() {
  turnMessage.setAttribute("data-player", game.currentActive);
  turnMessage.innerText = `${game.currentActive.toUpperCase()}-player's turn`;
}

function start() {
  game.state = "playing";
  game.resetArea();
  lineReset();
  const occupiedAreas = document.querySelectorAll(".occupied");
  occupiedAreas.forEach((occupied) => {
    occupied.remove();
  });
  changeTurnMessage();
  areas.forEach((area) => {
    area.addEventListener("click", () => {
      if (!hasChildWithClass(area, "occupied") && game.state === "playing") {
        const areaID = `area${area.getAttribute("id").slice(-1)}`;
        game.areasObject[areaID] = game.currentActive;
        const occupiedDiv = document.createElement("div");
        occupiedDiv.classList.add("occupied");
        occupiedDiv.setAttribute("data-player", game.currentActive);
        area.appendChild(occupiedDiv);
        renderOccupiedAreas();
        game.swapPlayer();
        changeTurnMessage();
        checkStatus(game.checkWinner());
      }
    });
  });
}

function checkStatus([hasWon, lineID, currentActive]) {
  if (hasWon === false) {
    hasDraw();
    return;
  }
  game.state = "resolved";
  console.log(lineID);
  renderLine(lineID, currentActive);
  turnMessage.setAttribute("data-player", currentActive);
  turnMessage.innerText = `${currentActive.toUpperCase()}'s has Won`;
}

const lines = document.querySelectorAll(".line");

function lineReset() {
  lines.forEach((line) => {
    line.removeAttribute("data-visible");
    line.removeAttribute("data-drawn");
  });
}

function renderLine(lineID, currentActive) {
  const line = document.querySelector(`.line-${lineID}`);
  line.toggleAttribute("data-visible");
  line.setAttribute("data-player", currentActive);
  setTimeout(() => {
    line.toggleAttribute("data-drawn");
  }, 10);
}

function hasDraw() {
  let counter = 0;
  for (const key in game.areasObject) {
    if (game.areasObject[key] !== null) {
      counter++;
    }
  }

  if (counter > 8) {
    turnMessage.innerText = "It's a DRAW";
    game.state = "resolved";
  }
}

function init() {
  initialiseArea();
  initialiseMenu();
}

init();
