import githubIcon from "./assets/images/github.png";
import twitterIcon from "./assets/images/twitter.png";
import xIcon from "./assets/images/x.png";
import oIcon from "./assets/images/o.png";

const githubLink = document.querySelector(".github-icon");
const twitterLink = document.querySelector(".twitter-icon");

githubLink.setAttribute("src", githubIcon);
twitterLink.setAttribute("src", twitterIcon);

const occupiedAreas = document.querySelectorAll(".occupied");

occupiedAreas.forEach((area) => {
  const playerData = area.getAttribute("data-player");
  const icon = playerData === "x" ? xIcon : oIcon;
  const activeIcon = document.createElement("img");
  activeIcon.classList.add("active-icon");
  activeIcon.setAttribute("src", icon);
  area.append(activeIcon);
});

const closeIcons = document.querySelectorAll(".close");
const overlay = document.querySelector(".overlay");
const modal = document.querySelector(".modal");
const modalContents = document.querySelectorAll(".modal-content");

closeIcons.forEach((close) => {
  close.addEventListener("click", () => {
    console.log("test");
    overlay.toggleAttribute("data-visible");
    modal.toggleAttribute("data-visible");
    modalContents.forEach((content) => {
      if (content.hasAttribute("data-visible")) {
        content.toggleAttribute("data-visible");
      }
    });
  });
});

const iconAnimation = document.querySelector(".coinflip-animation");
const coinflipResultText = document.querySelector(".coinflip-result");

function animate(playerIcon) {
  const threshold = 15;
  let nextIcon = xIcon;
  let counter = 0;
  const intervalID = setInterval(() => {
    nextIcon = nextIcon === xIcon ? oIcon : xIcon;
    iconAnimation.setAttribute("src", nextIcon);
    counter++;
    if (counter >= threshold) {
      clearInterval(intervalID);
      const finalIcon = playerIcon === "x" ? xIcon : oIcon;
      iconAnimation.setAttribute("src", finalIcon);
      iconAnimation.style.animation = "none";
      showCoinflipResult(playerIcon);
    }
  }, 300);
}

function showCoinflipResult(playerIcon) {
  coinflipResultText.setAttribute("data-player", playerIcon);
  coinflipResultText.innerText = `${playerIcon.toUpperCase()}-player's turn first`;
}

animate("o");
