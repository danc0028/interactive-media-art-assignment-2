/* Mobile Memory Game — no fetch, local-only assets, 3D flip */
const PATHS = [
  "assets/cards/face_01.svg","assets/cards/face_02.svg","assets/cards/face_03.svg",
  "assets/cards/face_04.svg","assets/cards/face_05.svg","assets/cards/face_06.svg",
  "assets/cards/face_07.svg","assets/cards/face_08.svg","assets/cards/face_09.svg",
  "assets/cards/face_10.svg","assets/cards/face_11.svg","assets/cards/face_12.svg",
];

const CARDS_MESSAGES = [
  "Rising water temperatures are killing Pacific salmon during migration and reducing their spawning success.",
  "Habitat degradation from coastal development and coral loss is forcing sharks out of their feeding and breeding areas.",
  "Increasing ocean temperatures are causing coral bleaching, weakening reefs and threatening marine life.",
  "Ocean acidification caused by global warming is weakening plankton shells and reducing their populations.",
  "Warmer waters are forcing crabs to migrate to colder areas, disrupting ecosystems and fisheries.",
  "Noise pollution from ships and industrial activities is disrupting whales communication and migration.",
  "I'm message seven",
  "I'm message eight",
  "I'm message nine",
  "I'm message ten",
  "I'm message eleven",
  "I'm message twelve",
]

const BACK = "assets/cards/card_back.svg";

const $ = (s, d=document)=>d.querySelector(s);
const $$ = (s, d=document)=>Array.from(d.querySelectorAll(s));

const state = {
  gridEl: null,
  pairCount: 8,
  firstCard: null,
  lock: false,
  moves: 0,
  matched: 0,
  timerId: null,
  seconds: 0
};

function shuffle(arr){
  for(let i=arr.length-1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}
function pad(n){ return String(n).padStart(2,'0'); }
function fmtTime(s){ const m = Math.floor(s/60), r = s%60; return `${pad(m)}:${pad(r)}`; }
function startTimer(){ if(state.timerId) return; state.timerId=setInterval(()=>{ state.seconds++; $('#time').textContent = fmtTime(state.seconds); }, 1000); }
function stopTimer(){ clearInterval(state.timerId); state.timerId=null; }
function resetStats(){ state.moves=0; $('#moves').textContent='0'; state.matched=0; $('#pairs').textContent='0'; state.seconds=0; $('#time').textContent='00:00'; stopTimer(); }

function buildDeck(pairs){
  const pick = PATHS.slice(0, pairs);
  const deck = pick.concat(pick).map((src, idx)=>({ id: idx+'_'+src, message: CARDS_MESSAGES[idx % pairs], src }));
  shuffle(deck);
  console.log(deck);
  return deck;
}

function cardTemplate(card){
  return `
    <button class="card" data-src="${card.src}" data-message="${card.message}" aria-label="card" aria-pressed="false">
      <div class="card-inner">
        <div class="card-face back"><img alt="card back" src="${BACK}"></div>
        <div class="card-face front"><img alt="card face" src="${card.src}"></div>
      </div>
    </button>
  `;
}

function renderGrid(pairs){
  state.gridEl.innerHTML = "";
  const deck = buildDeck(pairs);
  const html = deck.map(cardTemplate).join("");
  state.gridEl.insertAdjacentHTML("beforeend", html);
  $("#totalPairs").textContent = String(pairs);
  attachHandlers();
}

function attachHandlers(){
  $$(".card", state.gridEl).forEach(btn=>btn.addEventListener("click", onCardClick, { passive: true }));
}

function onCardClick(e){
  const card = e.currentTarget;
  if(state.lock) return;
  if(card.classList.contains("flip")) return;

  if(state.moves===0 && !state.firstCard) startTimer();

  flip(card);
  if(!state.firstCard){
    state.firstCard = card;
    return;
  }

  state.moves++;
  $("#moves").textContent = String(state.moves);
  const secondCard = card;
  if(state.firstCard === secondCard) return;

  if(state.firstCard.dataset.src === secondCard.dataset.src) {
    state.firstCard.setAttribute("aria-pressed","true");
    secondCard.setAttribute("aria-pressed","true");
    state.firstCard.removeEventListener("click", onCardClick);
    secondCard.removeEventListener("click", onCardClick);
    state.firstCard = null;
    state.matched++;
    $("#pairs").textContent = String(state.matched);
    $("#matchMessage").textContent = secondCard.dataset.message;
    checkWin();
  } else {
    state.lock = true;
    setTimeout(()=>{
      unflip(state.firstCard);
      unflip(secondCard);
      state.firstCard = null;
      state.lock = false;
    }, 700);
  }
}

function flip(el){ el.classList.add("flip"); }
function unflip(el){ el.classList.remove("flip"); }

function checkWin(){
  const totalPairs = parseInt($("#totalPairs").textContent, 10);
  let dlg = null;
  let dialogMessage = null;
  if(state.matched === totalPairs){
    stopTimer();
    $("#finalMoves").textContent = state.moves;
    $("#finalTime").textContent = fmtTime(state.seconds);
    dlg = $("#winDialog");
    dialogMessage = `You win! Moves: ${state.moves}  Time: ${fmtTime(state.seconds)}`;
  } else {
    dlg = $("#matchFound");
    dialogMessage = `You found a match`;
  }
  if(dlg && dlg.showModal){ dlg.showModal(); } else { alert(dialogMessage); }
}

function resetAndDeal(){
  resetStats();
  renderGrid(state.pairCount);
}

function setup(){
  state.gridEl = $("#grid");
  const select = $("#pairCount");
  state.pairCount = parseInt(select.value, 10);
  renderGrid(state.pairCount);

  select.addEventListener("change", ()=>{
    state.pairCount = parseInt(select.value, 10);
    resetAndDeal();
  });
  $("#resetBtn").addEventListener("click", resetAndDeal);
  $("#playAgain").addEventListener("click", ()=>{
    const dlg = $("#winDialog");
    if(dlg && dlg.close) dlg.close();
    resetAndDeal();
  });
  $("#matchOk").addEventListener("click", ()=>{
    const dlg = $("#matchFound");
    if(dlg && dlg.close) dlg.close();
  });

}

window.addEventListener("DOMContentLoaded", setup);

// ===== END GAME POPUP =====
function showEndGamePopup() {
  popupImage.src = "";
  popupMessage.innerHTML = `
    <h2>Artists who worked on this project</h2>
    <ul style="list-style:none; padding:0; margin:10px 0;">
      <li><a href="https://www.instagram.com/lera.is.drawing" target="_blank">Lera Danchenko</a></li>
      <li><a href="https://www.instagram.com/lera.is.drawing" target="_blank">Lera Danchenko</a></li>
      <li><a href="https://www.instagram.com/lera.is.drawing" target="_blank">Lera Danchenko</a></li>
      <li><a href="https://www.instagram.com/lera.is.drawing" target="_blank">Lera Danchenko</a></li>
      <li><a href="https://www.instagram.com/lera.is.drawing" target="_blank">Lera Danchenko</a></li>
      <li><a href="https://www.instagram.com/lera.is.drawing" target="_blank">Lera Danchenko</a></li>
    </ul>
  `;
  popupClose.textContent = "Play Again";
  popupModal.classList.remove('hidden');
  popupClose.onclick = () => {
    popupModal.classList.add('hidden');
    location.reload();
  };
}

// Example integration: call this when all pairs are matched
function checkIfGameComplete(matchedPairs, totalPairs) {
  if (matchedPairs === totalPairs) {
    showEndGamePopup();
  }
}
