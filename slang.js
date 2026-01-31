const country = localStorage.getItem("country");
const storageKey = `slang_${country}`;
const voteKey = `voted_${country}`;

let slangData = JSON.parse(localStorage.getItem(storageKey)) || [];
let voted = JSON.parse(localStorage.getItem(voteKey)) || [];

const gens = ["10s","20s","30s","40s","50s","60s"];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("countryTitle").innerText =
    country === "korea" ? "🇰🇷 Korea" : "🇺🇸 USA";

  renderGenerationButtons();
  renderSlangs();
  renderRanking();

  document.getElementById("addSlangBtn").addEventListener("click", addSlang);
  document.getElementById("resetDataBtn").addEventListener("click", resetData);
});

/* Generation */
function renderGenerationButtons() {
  const box = document.getElementById("generationButtons");
  gens.forEach(g => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary";
    btn.innerText = g;
    btn.onclick = () => {
      localStorage.setItem("generation", g);
      document.getElementById("generationInfo").innerText = `Selected: ${g}`;
      renderSlangs();
    };
    box.appendChild(btn);
  });
}

/* Add Slang */
function addSlang() {
  const word = slangWord.value.trim();
  const meaning = slangMeaning.value.trim();
  const gen = localStorage.getItem("generation");

  if (!word || !meaning || !gen) {
    alert("Fill all fields & select generation");
    return;
  }

  if (slangData.some(s => s.word === word)) {
    alert("Duplicate slang");
    return;
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

  slangWord.value = "";
  slangMeaning.value = "";
}

/* Render Slang List */
function renderSlangs() {
  const list = document.getElementById("slangList");
  list.innerHTML = "";

  const gen = localStorage.getItem("generation");

  slangData
    .filter(s => !gen || s.generation === gen)
    .forEach(s => {
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
      col.querySelector("button").onclick = () => vote(s.id);
      list.appendChild(col);
    });
}

/* Vote */
function vote(id) {
  if (voted.includes(id)) {
    alert("Already voted");
    return;
  }

  const s = slangData.find(x => x.id === id);
  s.likes++;
  voted.push(id);

  localStorage.setItem(voteKey, JSON.stringify(voted));
  save();
  renderSlangs();
  renderRanking();
}

/* Ranking */
function renderRanking() {
  const box = document.getElementById("rankingList");
  box.innerHTML = "";

  [...slangData]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5)
    .forEach(s => {
      box.innerHTML += `<div>${s.word} 👍 ${s.likes}</div>`;
    });
}

/* Reset */
function resetData() {
  if (!confirm("Delete all slang data?")) return;

  localStorage.removeItem(storageKey);
  localStorage.removeItem(voteKey);
  slangData = [];
  voted = [];

  renderSlangs();
  renderRanking();
}

/* Save */
function save() {
  localStorage.setItem(storageKey, JSON.stringify(slangData));
}
