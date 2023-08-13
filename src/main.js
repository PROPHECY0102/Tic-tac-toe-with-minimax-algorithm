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

function closeEnable() {
  closeIcons.forEach((close) => {
    close.addEventListener("click", () => {
      closeOverlay();
    });
  });
}

function closeOverlay() {
  if (!overlay.hasAttribute("data-visible")) return;
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

// Header and Menu Button Functionality

const newGameButton = document.querySelector(".new-game");
const vsPlayerButtons = document.querySelectorAll(".vs-player");
const vsBotButtons = document.querySelectorAll(".vs-bots");

function initialiseButtons() {
  newGameEnable();
  vsPlayerEnable();
  vsBotsEnable();
  closeEnable();
  newRoundEnable();
  resetEnable();
}

function newGameEnable() {
  newGameButton.addEventListener("click", () => {
    window.location.reload();
  });
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
      const playerChoice = button.getAttribute("data-player");
      game.setActiveIcon(playerChoice);
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

// Game Menu Functionality

const newGameOption = document.querySelector(".new-game-options");
const menuHeaderText = document.querySelector(".menu-sub-header");
const scoreboardMenu = document.querySelector(".scoreboard-display");
const imageLeft = document.querySelector(".image-left");
const imageRight = document.querySelector(".image-right");
const scoreLeft = document.querySelector(".score-left");
const scoreRight = document.querySelector(".score-right");
const conditionText = document.querySelector(".condition-text");
const newRoundButton = document.querySelector(".new-round");
const resetButton = document.querySelector(".reset-button");

const userDisplays = document.querySelectorAll(".user");

function closeNewGameMenu() {
  if (newGameOption.hasAttribute("data-visible")) {
    newGameOption.toggleAttribute("data-visible");
  }
}

function openNewGameMenu() {
  if (!newGameOption.hasAttribute("data-visible")) {
    newGameOption.toggleAttribute("data-visible");
  }
}

function newRoundEnable() {
  newRoundButton.addEventListener("click", () => {
    conditionText.innerText = "...";
    conditionText.removeAttribute("data-player");
    game.newCurrentActive();
    displayCoinflip();
  });
}

function resetEnable() {
  resetButton.addEventListener("click", () => {
    transitionToNewGame();
    game.state = "resolved";
    game.resetArea();
    game.resetScore();
    game.newCurrentActive();
    turnMessage.innerText = "Select a mode...";
    changeMenuHeaderText("Start a New Game of Tic Tac Toe?");
    conditionText.innerText = "...";
    turnMessage.setAttribute("data-player", "x");
    gameBoard.removeAttribute("data-player");
    resetOccupiedAreas();
    renderOccupiedAreas();
    lineReset();
  });
}

function openScoreboard() {
  if (!scoreboardMenu.hasAttribute("data-visible")) {
    scoreboardMenu.toggleAttribute("data-visible");
  }
  changeMenuHeaderText(scoreboardHeader());
  if (game.mode === "bot") {
    enableUserDisplay();
    swapImage();
  } else {
    revertImage();
  }
  updateScore();
}

function closeScoreboard() {
  if (scoreboardMenu.hasAttribute("data-visible")) {
    scoreboardMenu.toggleAttribute("data-visible");
  }
}

function changeMenuHeaderText(text) {
  menuHeaderText.innerText = text;
}

function scoreboardHeader() {
  if (game.mode === "player") {
    return `Scoreboard - Vs Player Mode`;
  }
  const dif = game.difficulty === "easy" ? "Easy" : "Hard";
  return `Scoreboard - Vs AI ${dif} Mode`;
}

function swapImage() {
  if (game.playerActive === "o") {
    imageLeft.setAttribute("src", oIcon);
    imageRight.setAttribute("src", xIcon);
    scoreLeft.setAttribute("data-icon", "o");
    scoreRight.setAttribute("data-icon", "x");
  } else {
    revertImage();
  }
}

function enableUserDisplay() {
  userDisplays.forEach((userDisplay) => {
    userDisplay.removeAttribute("data-hidden");
  });
}

function revertImage() {
  imageLeft.setAttribute("src", xIcon);
  imageRight.setAttribute("src", oIcon);
  scoreLeft.removeAttribute("data-icon");
  scoreRight.removeAttribute("data-icon");
  if (game.mode === "player") {
    userDisplays.forEach((userDisplay) => {
      userDisplay.setAttribute("data-hidden", "");
    });
  }
}

function updateScore() {
  if (game.mode === "player") {
    scoreLeft.innerText = game.xScore;
    scoreRight.innerText = game.oScore;
  } else {
    scoreLeft.innerText = game.playerScore;
    scoreRight.innerText = game.botScore;
  }
}

function updateConditionText(currentActive) {
  if (game.mode === "player") {
    vsPlayerConditionText(currentActive);
    return;
  }
  vsBotConditionText(currentActive);
}

function vsPlayerConditionText(currentActive) {
  conditionText.innerText = `${currentActive.toUpperCase()}'s has Won 🎉`;
  conditionText.setAttribute("data-player", currentActive);
}

function vsBotConditionText(currentActive) {
  if (currentActive === game.playerActive) {
    conditionText.setAttribute("data-player", currentActive);
    conditionText.innerText = "You've Won 🎉";
    return;
  }
  conditionText.setAttribute("data-player", game.botActive);
  conditionText.innerText = "You've Lost 😔";
}

// Initialise Game / Game Board functionality

const turnMessage = document.querySelector(".turn-message");
const gameBoard = document.querySelector(".game");

function transitionToScoreboard() {
  closeNewGameMenu();
  openScoreboard();
}

function transitionToNewGame() {
  openNewGameMenu();
  closeScoreboard();
}

function changeTurnMessage() {
  turnMessage.setAttribute("data-player", game.currentActive);
  turnMessage.innerText = `${game.currentActive.toUpperCase()}-player's turn`;
}

function resetOccupiedAreas() {
  const occupiedAreas = document.querySelectorAll(".occupied");
  occupiedAreas.forEach((occupied) => {
    occupied.remove();
  });
}

function start() {
  game.state = "playing";
  game.resetArea();
  lineReset();
  resetOccupiedAreas();
  transitionToScoreboard();
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
    turnMessage.innerText = "It's a TIE";
    conditionText.innerText = "TIED 🙃";
  } else {
    turnMessage.innerText = `${currentActive.toUpperCase()}'s has Won`;
    updateConditionText(currentActive);
  }
  updateScore();
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
  initialiseButtons();
  showFooterOnInit();
}

init();
