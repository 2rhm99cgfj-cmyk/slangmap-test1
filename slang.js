const country = localStorage.getItem("country");
const userType = localStorage.getItem("userType");
const genKey = "generation";
const storageKey = `slang_${country}`;

let slangData = JSON.parse(localStorage.getItem(storageKey)) || [];
let voted = JSON.parse(localStorage.getItem("voted")) || [];

const gens = ["10s","20s","30s","40s","50s","60s"];

/* Init */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("countryTitle").innerText =
    country === "korea" ? "🇰🇷 Korea" : "🇺🇸 USA";

  renderGenerationButtons();
  renderSlangs();
  renderRanking();

  if (userType === "visitor") {
    document.getElementById("addSlangSection").style.display = "none";
  }

  document.getElementById("addSlangBtn")?.addEventListener("click", addSlang);
});

/* Generation */
function renderGenerationButtons() {
  const box = document.getElementById("generationButtons");
  gens.forEach(g => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary";
    btn.innerText = g;
    btn.onclick = () => {
      localStorage.setItem(genKey, g);
      document.getElementById("generationInfo").innerText = `Selected: ${g}`;
      renderSlangs();
    };
    box.appendChild(btn);
  });
}

/* Add */
function addSlang() {
  const word = slangWord.value.trim();
  const meaning = slangMeaning.value.trim();
  const gen = localStorage.getItem(genKey);

  if (!word || !meaning || !gen) return alert("Fill all");

  if (slangData.some(s => s.word === word)) {
    return alert("Duplicate slang");
  }

  slangData.unshift({
    id: crypto.randomUUID(),
    word,
    meaning,
    generation: gen,
    likes: 0
  });

  save();
  renderSlangs();
  renderRanking();
  slangWord.value = slangMeaning.value = "";
}

/* Render */
function renderSlangs() {
  const list = document.getElementById("slangList");
  list.innerHTML = "";

  const gen = localStorage.getItem(genKey);
  slangData.filter(s => !gen || s.generation === gen)
    .forEach(s => list.appendChild(createCard(s)));
}

/* Card */
function createCard(s) {
  const col = document.createElement("div");
  col.className = "col-md-4";
  col.innerHTML = `
    <div class="card p-3 mb-3">
      <h5>${s.word}</h5>
      <p>${s.meaning}</p>
      <button class="btn btn-sm btn-outline-success">
        👍 ${s.likes}
      </button>
    </div>
  `;

  const btn = col.querySelector("button");
  btn.onclick = () => vote(s.id);

  return col;
}

/* Vote */
function vote(id) {
  if (voted.includes(id)) return alert("Already voted");

  const s = slangData.find(x => x.id === id);
  s.likes++;
  voted.push(id);

  localStorage.setItem("voted", JSON.stringify(voted));
  save();
  renderSlangs();
  renderRanking();
}

/* Ranking */
function renderRanking() {
  const box = document.getElementById("rankingList");
  box.innerHTML = "";

  [...slangData]
    .sort((a,b)=>b.likes-a.likes)
    .slice(0,5)
    .forEach(s=>{
      box.innerHTML += `<div>${s.word} 👍${s.likes}</div>`;
    });
}

function save() {
  localStorage.setItem(storageKey, JSON.stringify(slangData));
}
