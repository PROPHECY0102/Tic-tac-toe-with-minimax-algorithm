(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const f of c.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&i(f)}).observe(document,{childList:!0,subtree:!0});function n(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function i(a){if(a.ep)return;a.ep=!0;const c=n(a);fetch(a.href,c)}})();const u="/Tic-tac-toe-with-minimax-algorithm/assets/x-83a29ddd.png",d="/Tic-tac-toe-with-minimax-algorithm/assets/o-85e1387d.png";function q(e,t){return e.querySelector(`.${t}`)!==null}function U(e,t){return e.querySelector(`#${t}`)!==null}const F={area1:null,area2:null,area3:null,area4:null,area5:null,area6:null,area7:null,area8:null,area9:null},o={playerActive:null,botActive:null,currentStatus:{hasWon:!1,active:null},allAreas:["area1","area2","area3","area4","area5","area6","area7","area8","area9"],area1:null,area2:null,area3:null,area4:null,area5:null,area6:null,area7:null,area8:null,area9:null,setActiveIcon(){this.botActive=r.botActive,this.playerActive=this.botActive==="x"?"o":"x"}},Y={pattern1:["area1","area2","area3"],pattern2:["area1","area4","area7"],pattern3:["area1","area5","area9"],pattern4:["area2","area5","area8"],pattern5:["area3","area6","area9"],pattern6:["area4","area5","area6"],pattern7:["area7","area8","area9"],pattern8:["area7","area5","area3"]},r={currentActive:"x",mode:null,playerActive:null,botActive:null,difficulty:"easy",xScore:0,oScore:0,playerScore:0,botScore:0,areasObject:F,patterns:Y,state:"resolved",currentStatus:{hasWon:!1,lineID:null,currentActive:null},newCurrentActive(){const e=Math.random();this.currentActive=e>=.5?"x":"o"},setActiveIcon(e){this.playerActive=e,this.botActive=this.playerActive==="x"?"o":"x"},swapPlayer(){this.currentActive=this.currentActive==="x"?"o":"x"},getIcon(){return this.currentActive==="x"?u:d},checkWinner(){let e,t,n;for(const i in this.patterns)if(e=this.areasObject[this.patterns[i][0]],t=this.areasObject[this.patterns[i][1]],n=this.areasObject[this.patterns[i][2]],this.checkMatches("x",i,[e,t,n]),this.currentStatus.hasWon==!0||(this.checkMatches("o",i,[e,t,n]),this.currentStatus.hasWon==!0))break;return this.incrementPoint(),this.currentStatus},checkMatches(e,t,[n,i,a]){if(n===e&&i===e&&a===e){let c=[];this.patterns[t].forEach(H=>{c.push(H.slice(-1))});const f=c.join("");this.currentStatus.hasWon=!0,this.currentStatus.lineID=f,this.currentStatus.currentActive=e;return}this.currentStatus.hasWon=!1,this.currentStatus.lineID=null,this.currentStatus.currentActive=null},incrementPoint(){this.mode==="player"&&this.incrementVsPlayer(),this.mode==="bot"&&this.incrementVsBot()},incrementVsPlayer(){this.currentStatus.currentActive==="x"&&this.xScore++,this.currentStatus.currentActive==="o"&&this.oScore++},incrementVsBot(){this.currentStatus.currentActive===this.playerActive&&this.playerScore++,this.currentStatus.currentActive===this.botActive&&this.botScore++},botChoosesMove(){return this.difficulty==="easy"?this.easyBot():this.hardBot()},easyBot(e=1){if(e<10){const n=`area${Math.floor(Math.random()*9)+1}`;return this.areasObject[n]==="x"||this.areasObject[n]==="o"?(e++,this.easyBot(e)):n}},hardBot(){for(const i in this.areasObject)o[i]=this.areasObject[i];o.setActiveIcon();let e=-1/0,t;return o.allAreas.filter(i=>{if(!o[i])return i}).forEach(i=>{o[i]=o.botActive;let a=this.minimax(!1,0);a>e&&(e=a,t=i),o[i]=null}),t},minimax(e,t){if(r.simulateCheckWinner(),o.currentStatus.active===o.botActive)return 10;if(o.currentStatus.active===o.playerActive)return-10;const n=o.allAreas.filter(i=>{if(!o[i])return i});if(n.length===0)return 0;if(e){let i=-1/0;return n.forEach(a=>{o[a]=o.botActive;let c=this.minimax(!1,t+1);c>i&&(i=c),o[a]=null}),i}if(!e){let i=1/0;return n.forEach(a=>{o[a]=o.playerActive;let c=this.minimax(!0,t+1);c<i&&(i=c),o[a]=null}),i}},simulateCheckWinner(){let e,t,n;for(const i in this.patterns)if(e=o[this.patterns[i][0]],t=o[this.patterns[i][1]],n=o[this.patterns[i][2]],this.simulatedCheckMatches(o.botActive,[e,t,n]),o.currentStatus.hasWon||(this.simulatedCheckMatches(o.playerActive,[e,t,n]),o.currentStatus.hasWon))break;return o.currentStatus},simulatedCheckMatches(e,[t,n,i]){if(t===e&&n===e&&i===e){o.currentStatus.hasWon=!0,o.currentStatus.active=e;return}o.currentStatus.hasWon=!1,o.currentStatus.active=null},resetArea(){for(const e in this.areasObject)this.areasObject[e]=null},resetScore(){this.xScore=0,this.oScore=0,this.playerScore=0,this.botScore=0}},K=document.querySelectorAll(".close"),b=document.querySelector(".overlay"),A=document.querySelector(".modal"),J=document.querySelectorAll(".modal-content");function Q(){K.forEach(e=>{e.addEventListener("click",()=>{S()})})}function S(){b.hasAttribute("data-visible")&&(b.toggleAttribute("data-visible"),A.toggleAttribute("data-visible"),J.forEach(e=>{e.hasAttribute("data-visible")&&e.toggleAttribute("data-visible")}))}const T=document.querySelectorAll(".area");function X(){let e="x";T.forEach(t=>{const n=document.createElement("div");n.classList.add("occupied"),n.setAttribute("data-player",e),t.appendChild(n),e=e==="x"?"o":"x"}),g()}function g(){document.querySelectorAll(".occupied").forEach(t=>{const i=t.getAttribute("data-player")==="x"?u:d;if(!q(t,"active-icon")){const a=document.createElement("img");a.classList.add("active-icon"),a.setAttribute("src",i),t.append(a)}})}const Z=document.querySelector(".new-game"),_=document.querySelectorAll(".vs-player"),z=document.querySelectorAll(".vs-bots");function ee(){te(),re(),ne(),Q(),qe(),Te()}function te(){Z.addEventListener("click",()=>{window.location.reload()})}function re(){_.forEach(e=>{e.addEventListener("click",ie)})}function ne(){z.forEach(e=>{e.addEventListener("click",ae)})}function ie(){r.mode="player",r.state="resolved",r.newCurrentActive(),I()}function ae(){r.mode="bot",r.state="resolved",r.newCurrentActive(),ue()}const oe=document.querySelector(".choice-container"),ce=document.querySelector(".x-choice"),se=document.querySelector(".o-choice");function ue(){b.toggleAttribute("data-visible"),A.toggleAttribute("data-visible"),oe.toggleAttribute("data-visible"),le()}function le(){[ce,se].forEach(t=>{t.addEventListener("click",()=>{const n=t.getAttribute("data-player");r.setActiveIcon(n),S(),be()})})}const de=document.querySelector(".difficulty-container"),fe=document.querySelector(".easy"),he=document.querySelector(".hard");function be(){b.toggleAttribute("data-visible"),A.toggleAttribute("data-visible"),de.toggleAttribute("data-visible"),me()}function me(){[fe,he].forEach(t=>{t.addEventListener("click",()=>{r.difficulty=t.getAttribute("data-difficulty"),S(),I()})})}const ve=document.querySelector(".coinflip-container"),h=document.querySelector(".coinflip-animation"),E=document.querySelector(".coinflip-result");function I(){b.toggleAttribute("data-visible"),A.toggleAttribute("data-visible"),ve.toggleAttribute("data-visible"),pe(r.currentActive)}function pe(e){let n=u,i=0;E.innerText="...",h.hasAttribute("data-no-animation")&&h.toggleAttribute("data-no-animation");const a=setInterval(()=>{if(n=n===u?d:u,h.setAttribute("src",n),i++,i>=10){clearInterval(a);const c=e==="x"?u:d;h.setAttribute("src",c),h.toggleAttribute("data-no-animation"),ye(e),setTimeout(()=>{S(),Pe()},1e3)}},300)}function ye(e){E.setAttribute("data-player",e),E.innerText=`${e.toUpperCase()}-player's turn first`}const m=document.querySelector(".new-game-options"),Ae=document.querySelector(".menu-sub-header"),v=document.querySelector(".scoreboard-display"),k=document.querySelector(".image-left"),M=document.querySelector(".image-right"),p=document.querySelector(".score-left"),y=document.querySelector(".score-right"),s=document.querySelector(".condition-text"),Se=document.querySelector(".new-round"),ge=document.querySelector(".reset-button"),O=document.querySelectorAll(".user");function xe(){m.hasAttribute("data-visible")&&m.toggleAttribute("data-visible")}function Ee(){m.hasAttribute("data-visible")||m.toggleAttribute("data-visible")}function qe(){Se.addEventListener("click",()=>{s.innerText="...",s.removeAttribute("data-player"),r.newCurrentActive(),I()})}function Te(){ge.addEventListener("click",()=>{De(),r.state="resolved",r.resetArea(),r.resetScore(),r.newCurrentActive(),l.innerText="Select a mode...",B("Start a New Game of Tic Tac Toe?"),s.innerText="...",l.setAttribute("data-player","x"),x.removeAttribute("data-player"),P(),g(),R()})}function Ie(){v.hasAttribute("data-visible")||v.toggleAttribute("data-visible"),B(we()),r.mode==="bot"?(ke(),Le()):W(),D()}function Ce(){v.hasAttribute("data-visible")&&v.toggleAttribute("data-visible")}function B(e){Ae.innerText=e}function we(){return r.mode==="player"?"Scoreboard - Vs Player Mode":`Scoreboard - Vs AI ${r.difficulty==="easy"?"Easy":"Hard"} Mode`}function Le(){r.playerActive==="o"?(k.setAttribute("src",d),M.setAttribute("src",u),p.setAttribute("data-icon","o"),y.setAttribute("data-icon","x")):W()}function ke(){O.forEach(e=>{e.removeAttribute("data-hidden")})}function W(){k.setAttribute("src",u),M.setAttribute("src",d),p.removeAttribute("data-icon"),y.removeAttribute("data-icon"),r.mode==="player"&&O.forEach(e=>{e.setAttribute("data-hidden","")})}function D(){r.mode==="player"?(p.innerText=r.xScore,y.innerText=r.oScore):(p.innerText=r.playerScore,y.innerText=r.botScore)}function Me(e){if(r.mode==="player"){Oe(e);return}Be(e)}function Oe(e){s.innerText=`${e.toUpperCase()}'s has Won 🎉`,s.setAttribute("data-player",e)}function Be(e){if(e===r.playerActive){s.setAttribute("data-player",e),s.innerText="You've Won 🎉";return}s.setAttribute("data-player",r.botActive),s.innerText="You've Lost 😔"}const l=document.querySelector(".turn-message"),x=document.querySelector(".game");function We(){xe(),Ie()}function De(){Ee(),Ce()}function C(){l.setAttribute("data-player",r.currentActive),l.innerText=`${r.currentActive.toUpperCase()}-player's turn`}function P(){document.querySelectorAll(".occupied").forEach(t=>{t.remove()})}function Pe(){r.state="playing",r.resetArea(),R(),P(),We(),C(),setTimeout(()=>{r.mode==="bot"&&j()},10),x.setAttribute("data-player",r.currentActive),T.forEach(e=>{e.addEventListener("click",G),e.addEventListener("pointerenter",$),e.addEventListener("pointerleave",w)})}function j(){if(r.botActive===r.currentActive){const e=r.botChoosesMove();r.areasObject[e]=r.currentActive;const t=document.querySelector(`.area-${e.slice(-1)}`),n=document.createElement("div");n.classList.add("occupied"),n.setAttribute("data-player",r.currentActive),t.appendChild(n),g(),r.swapPlayer(),C(),V(r.checkWinner())}}function G(){if(!q(this,"occupied")&&r.state==="playing"){w();const e=`area${this.getAttribute("id").slice(-1)}`;r.areasObject[e]=r.currentActive;const t=document.createElement("div");t.classList.add("occupied"),t.setAttribute("data-player",r.currentActive),this.appendChild(t),g(),r.swapPlayer(),C(),V(r.checkWinner())}}function $(){if(!q(this,"occupied")&&r.state==="playing"){const e=document.createElement("img"),t=r.getIcon();e.setAttribute("src",t),e.classList.add("active-icon"),e.setAttribute("id","hover"),this.appendChild(e)}}function w(){U(document.body,"hover")&&document.querySelector("#hover").remove()}function V(e){if(e.hasWon===!1)return je(),!1;Ve(e.lineID,e.currentActive),N(!1,e.currentActive)}function je(){let e=0;for(const t in r.areasObject)r.areasObject[t]!==null&&e++;if(e>8){N(!0,r.currentActive);return}Ge()}function Ge(){x.setAttribute("data-player",r.currentActive),r.mode==="bot"&&j()}function N(e,t){e?(l.innerText="It's a TIE",s.innerText="TIED 🙃"):(l.innerText=`${t.toUpperCase()}'s has Won`,Me(t)),D(),r.state="resolved",x.setAttribute("data-player",t),l.setAttribute("data-player",t),T.forEach(n=>{n.removeEventListener("click",G),n.removeEventListener("pointerenter",$),n.removeEventListener("pointerleave",w)})}const $e=document.querySelectorAll(".line");function R(){$e.forEach(e=>{e.removeAttribute("data-visible"),e.removeAttribute("data-drawn")})}function Ve(e,t){const n=document.querySelector(`.line-${e}`);n.toggleAttribute("data-visible"),n.setAttribute("data-player",t),setTimeout(()=>{n.toggleAttribute("data-drawn")},10)}const L=document.querySelector(".footer");function Ne(){L.toggleAttribute("data-visible"),setTimeout(()=>{L.toggleAttribute("data-visible")},5e3)}function Re(){X(),ee(),Ne()}Re();
