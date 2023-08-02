import githubIcon from "../public/images/github.png";
import twitterIcon from "../public/images/twitter.png";
import xIcon from "../public/images/x.png";
import oIcon from "../public/images/o.png";

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
