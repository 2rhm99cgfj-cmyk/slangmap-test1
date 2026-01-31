const country = localStorage.getItem("country");
const storageKey = `slangs_${country}`;

let slangData = JSON.parse(localStorage.getItem(storageKey)) || [];
let selectedGeneration = localStorage.getItem("generation");

/* ---------- Generation ---------- */
function selectGeneration(gen) {
    selectedGeneration = gen;
    localStorage.setItem("generation", gen);

    document.getElementById("generationInfo").innerText =
        `Selected generation: ${gen}`;

    document
      .querySelectorAll(".btn-outline-primary")
      .forEach(btn => btn.classList.remove("active"));

    event.target.classList.add("active");

    renderSlangList();
}

/* ---------- Add Slang ---------- */
function addSlang() {
    const word = document.getElementById("slangWord").value.trim();
    const meaning = document.getElementById("slangMeaning").value.trim();

    if (!word || !meaning || !selectedGeneration) {
        alert("Please fill all fields and select generation.");
        return;
    }

    // duplicate word check
    const exists = slangData.some(
        s => s.word.toLowerCase() === word.toLowerCase()
    );
    if (exists) {
        alert("This slang already exists.");
        return;
    }

    slangData.unshift({
        id: crypto.randomUUID(),
        word,
        meaning,
        generation: selectedGeneration,
        likes: 0,
        voters: []
    });

    save();
    renderSlangList();
    renderRanking();

    document.getElementById("slangWord").value = "";
    document.getElementById("slangMeaning").value = "";
}

/* ---------- Vote ---------- */
function likeSlang(id) {
    const userKey = "voted_" + id;
    if (localStorage.getItem(userKey)) return;

    const slang = slangData.find(s => s.id === id);
    slang.likes++;

    localStorage.setItem(userKey, true);
    save();
    renderSlangList();
    renderRanking();
}

/* ---------- Render ---------- */
function renderSlangList() {
    const list = document.getElementById("slangList");
    if (!list) return;

    list.innerHTML = "";

    slangData
        .filter(s => !selectedGeneration || s.generation === selectedGeneration)
        .forEach(s => {
            list.innerHTML += `
                <div class="col-md-4">
                    <div class="card p-3 mb-3 slang-card">
                        <h5>${s.word}</h5>
                        <p>${s.meaning}</p>
                        <small>${s.generation}</small><br>
                        <button class="btn btn-sm btn-outline-success mt-2"
                            onclick="likeSlang('${s.id}')">
                            👍 ${s.likes}
                        </button>
                    </div>
                </div>
            `;
        });
}

/* ---------- Ranking ---------- */
function renderRanking() {
    const ranking = document.getElementById("rankingList");
    if (!ranking) return;

    ranking.innerHTML = "";

    [...slangData]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5)
        .forEach((s, i) => {
            ranking.innerHTML += `
                <div class="col-md-4">
                    <div class="card p-3 mb-3 ranking-card">
                        <h5>#${i + 1} ${s.word}</h5>
                        <p>${s.meaning}</p>
                        <small>${s.generation} · 👍 ${s.likes}</small>
                    </div>
                </div>
            `;
        });
}

/* ---------- DEV ---------- */
function resetSlangData() {
    localStorage.removeItem(storageKey);
    location.reload();
}

/* ---------- Save ---------- */
function save() {
    localStorage.setItem(storageKey, JSON.stringify(slangData));
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
    const DEV_MODE = true;

    if (DEV_MODE) {
        document.getElementById("resetBtn")?.classList.remove("d-none");
    }

    renderSlangList();
    renderRanking();
});
