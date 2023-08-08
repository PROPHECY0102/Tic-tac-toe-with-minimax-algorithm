"strict mode";

// Game object from game.js
import game from "./game.js";
import { hasChildWithClass, hasChildWithID } from "./game.js";

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
  if (!overlay.hasAttribute("data-visible")) {
    return;
  }
  overlay.toggleAttribute("data-visible");
  modal.toggleAttribute("data-visible");
  modalContents.forEach((content) => {
    if (content.hasAttribute("data-visible")) {
      content.toggleAttribute("data-visible");
    }
  });
}

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
  occupiedAreas.forEach((occupiedArea) => {
    const playerData = occupiedArea.getAttribute("data-player");
    const iconSrc = playerData === "x" ? xIcon : oIcon;
    if (!hasChildWithClass(occupiedArea, "active-icon")) {
      const activeIcon = document.createElement("img");
      activeIcon.classList.add("active-icon");
      activeIcon.setAttribute("src", iconSrc);
      occupiedArea.append(activeIcon);
    }
  });
}

// Menu Button Functionality

const vsPlayerButtons = document.querySelectorAll(".vs-player");
const vsBotButtons = document.querySelectorAll(".vs-bots");

function initialiseMenu() {
  vsPlayerEnable();
  vsBotsEnable();
}

function vsPlayerEnable() {
  vsPlayerButtons.forEach((vsPlayer) => {
    vsPlayer.addEventListener("click", newVsPlayerGame);
  });
}

function vsBotsEnable() {
  vsBotButtons.forEach((vsBot) => {
    vsBot.addEventListener("click", newVsBotGame);
  });
}

function newVsPlayerGame() {
  game.mode = "player";
  game.state = "resolved";
  game.newCurrentActive();
  displayCoinflip();
}

function newVsBotGame() {
  game.mode = "bot";
  game.state = "resolved";
  game.newCurrentActive();
  displayChoice();
}

// Choose Player Icon (vs bot mode)
const choiceModal = document.querySelector(".choice-container");
const xChoice = document.querySelector(".x-choice");
const oChoice = document.querySelector(".o-choice");

function displayChoice() {
  overlay.toggleAttribute("data-visible");
  modal.toggleAttribute("data-visible");
  choiceModal.toggleAttribute("data-visible");
  choice();
}

function choice() {
  const choiceButtons = [xChoice, oChoice];
  choiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      game.botActive = button.getAttribute("data-player") === "x" ? "o" : "x";
      closeOverlay();
      displayDifficultyModal();
    });
  });
}

// Difficulty Selection (vs bot mode)
const difficultyModal = document.querySelector(".difficulty-container");
const easyButton = document.querySelector(".easy");
const hardButton = document.querySelector(".hard");

function displayDifficultyModal() {
  overlay.toggleAttribute("data-visible");
  modal.toggleAttribute("data-visible");
  difficultyModal.toggleAttribute("data-visible");
  difficultySelection();
}

function difficultySelection() {
  const difficultyButtons = [easyButton, hardButton];
  difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => {
      game.difficulty = button.getAttribute("data-difficulty");
      closeOverlay();
      displayCoinflip();
    });
  });
}

// Coinflip Functionality
const coinflipModal = document.querySelector(".coinflip-container");
const iconAnimation = document.querySelector(".coinflip-animation");
const coinflipResultText = document.querySelector(".coinflip-result");

function displayCoinflip() {
  overlay.toggleAttribute("data-visible");
  modal.toggleAttribute("data-visible");
  coinflipModal.toggleAttribute("data-visible");
  animateCoinflip(game.currentActive);
}

function animateCoinflip(playerIcon) {
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
const gameBoard = document.querySelector(".game");

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
  setTimeout(() => {
    if (game.mode === "bot") botsTurn();
  }, 10);
  gameBoard.setAttribute("data-player", game.currentActive);
  areas.forEach((area) => {
    area.addEventListener("click", areaClickEvent);
    area.addEventListener("pointerenter", areaHoverEvent);
    area.addEventListener("pointerleave", removeHoverIcon);
  });
}

// Handling Bot Actions
function botsTurn() {
  if (game.botActive === game.currentActive) {
    const areaID = game.botChoosesMove();
    game.areasObject[areaID] = game.currentActive;
    const areaOccupying = document.querySelector(`.area-${areaID.slice(-1)}`);
    const occupiedDiv = document.createElement("div");
    occupiedDiv.classList.add("occupied");
    occupiedDiv.setAttribute("data-player", game.currentActive);
    areaOccupying.appendChild(occupiedDiv);
    renderOccupiedAreas();
    game.swapPlayer();
    changeTurnMessage();
    checkStatus(game.checkWinner());
  }
}

// Handling Player Actions
function areaClickEvent() {
  if (!hasChildWithClass(this, "occupied") && game.state === "playing") {
    removeHoverIcon();
    const areaID = `area${this.getAttribute("id").slice(-1)}`;
    game.areasObject[areaID] = game.currentActive;
    const occupiedDiv = document.createElement("div");
    occupiedDiv.classList.add("occupied");
    occupiedDiv.setAttribute("data-player", game.currentActive);
    this.appendChild(occupiedDiv);
    renderOccupiedAreas();
    game.swapPlayer();
    changeTurnMessage();
    checkStatus(game.checkWinner());
  }
}

function areaHoverEvent() {
  if (!hasChildWithClass(this, "occupied") && game.state === "playing") {
    const activeIcon = document.createElement("img");
    const iconSrc = game.getIcon();
    activeIcon.setAttribute("src", iconSrc);
    activeIcon.classList.add("active-icon");
    activeIcon.setAttribute("id", "hover");
    this.appendChild(activeIcon);
  }
}

function removeHoverIcon() {
  if (hasChildWithID(document.body, "hover")) {
    document.querySelector("#hover").remove();
  }
}

// Handling termination events
function checkStatus(status) {
  if (status.hasWon === false) {
    hasDraw();
    return false;
  }
  renderLine(status.lineID, status.currentActive);
  resolved(false, status.currentActive);
}

function hasDraw() {
  let counter = 0;
  for (const key in game.areasObject) {
    if (game.areasObject[key] !== null) {
      counter++;
    }
  }
  if (counter > 8) {
    resolved(true, game.currentActive);
    return;
  }
  continueGame();
}

function continueGame() {
  gameBoard.setAttribute("data-player", game.currentActive);
  if (game.mode === "bot") botsTurn();
}

function resolved(hasDraw, currentActive) {
  if (hasDraw) {
    turnMessage.innerText = "It's a DRAW";
  } else {
    turnMessage.innerText = `${currentActive.toUpperCase()}'s has Won`;
  }
  game.state = "resolved";
  gameBoard.setAttribute("data-player", currentActive);
  turnMessage.setAttribute("data-player", currentActive);
  areas.forEach((area) => {
    area.removeEventListener("click", areaClickEvent);
    area.removeEventListener("pointerenter", areaHoverEvent);
    area.removeEventListener("pointerleave", removeHoverIcon);
  });
}

// Render Winning Line
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

// Footer

const footer = document.querySelector(".footer");

function showFooterOnInit() {
  footer.toggleAttribute("data-visible");
  setTimeout(() => {
    footer.toggleAttribute("data-visible");
  }, 5000);
}

// Initialise
function init() {
  initialiseArea();
  initialiseMenu();
  showFooterOnInit();
}

init();
