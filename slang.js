const country = localStorage.getItem("country");
const storageKey = `slangs_${country}`;

let slangData = JSON.parse(localStorage.getItem(storageKey)) || [];
let selectedGeneration = localStorage.getItem("generation");

/* Generation */
function selectGeneration(gen, btn) {
  selectedGeneration = gen;
  localStorage.setItem("generation", gen);

  document.getElementById("generationInfo").innerText =
    `Selected generation: ${gen}`;

  document.querySelectorAll(".btn-outline-primary")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");

  renderSlangList();
}

/* Add Slang */
function addSlang() {
  const word = slangWord.value.trim();
  const meaning = slangMeaning.value.trim();

  if (!word || !meaning || !selectedGeneration) {
    alert("Fill all fields and select generation.");
    return;
  }

  if (slangData.some(s => s.word.toLowerCase() === word.toLowerCase())) {
    alert("Slang already exists.");
    return;
  }

  slangData.unshift({
    id: crypto.randomUUID(),
    word,
    meaning,
    generation: selectedGeneration,
    likes: 0
  });

  save();
  renderSlangList();
  renderRanking();

  slangWord.value = "";
  slangMeaning.value = "";
}

/* Like */
function likeSlang(id) {
  if (localStorage.getItem("liked_" + id)) return;

  const s = slangData.find(x => x.id === id);
  s.likes++;

  localStorage.setItem("liked_" + id, true);
  save();
  renderSlangList();
  renderRanking();
}

/* Render List */
function renderSlangList() {
  slangList.innerHTML = "";

  slangData
    .filter(s => !selectedGeneration || s.generation === selectedGeneration)
    .forEach(s => {
      slangList.innerHTML += `
        <div class="col-md-4">
          <div class="card slang-card p-3 mb-3">
            <h5>${s.word}</h5>
            <p>${s.meaning}</p>
            <small>${s.generation}</small><br>
            <button class="btn btn-sm btn-outline-success mt-2"
              onclick="likeSlang('${s.id}')">
              👍 ${s.likes}
            </button>
          </div>
        </div>`;
    });
}

/* Ranking */
function renderRanking() {
  rankingList.innerHTML = "";

  [...slangData]
    .sort((a,b) => b.likes - a.likes)
    .slice(0,5)
    .forEach((s,i) => {
      rankingList.innerHTML += `
        <div class="col-md-4">
          <div class="card ranking-card p-3 mb-3">
            <h5>#${i+1} ${s.word}</h5>
            <p>${s.meaning}</p>
            <small>${s.generation} · 👍 ${s.likes}</small>
          </div>
        </div>`;
    });
}

/* DEV */
function resetSlangData() {
  localStorage.removeItem(storageKey);
  location.reload();
}

function save() {
  localStorage.setItem(storageKey, JSON.stringify(slangData));
}

/* Init */
document.addEventListener("DOMContentLoaded", () => {
  const DEV_MODE = true;
  if (DEV_MODE) resetBtn.classList.remove("d-none");

  renderSlangList();
  renderRanking();
});
