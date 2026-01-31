// slang.js

const country = localStorage.getItem("country");
const selectedGen = localStorage.getItem("generation");
const storageKey = `slangs_${country}`;

let slangData = JSON.parse(localStorage.getItem(storageKey)) || [];

/* ---------- Add Slang ---------- */
function addSlang() {
    const word = document.getElementById("slangWord").value.trim();
    const meaning = document.getElementById("slangMeaning").value.trim();
    const gen = document.getElementById("slangGen").value;

    if (!word || !meaning || !gen) {
        alert("모든 항목을 입력해주세요.");
        return;
    }

    const slang = {
        id: crypto.randomUUID(),
        word,
        meaning,
        generation: gen,
        likes: 0,
        dislikes: 0,
        createdAt: Date.now()
    };

    slangData.unshift(slang); // 최신이 위로
    saveData();
    renderSlangList();
    clearForm();
}

/* ---------- Save ---------- */
function saveData() {
    localStorage.setItem(storageKey, JSON.stringify(slangData));
}

/* ---------- Render ---------- */
function renderSlangList() {
    const list = document.getElementById("slangList");
    if (!list) return;

    list.innerHTML = "";

    const filtered = selectedGen
        ? slangData.filter(s => s.generation === selectedGen)
        : slangData;

    filtered.forEach(s => {
        list.innerHTML += `
            <div class="col-md-4">
                <div class="card p-3 mb-3">
                    <h5>${s.word}</h5>
                    <p>${s.meaning}</p>
                    <small class="text-muted">${s.generation}</small>
                </div>
            </div>
        `;
    });
}

/* ---------- Utils ---------- */
function clearForm() {
    document.getElementById("slangWord").value = "";
    document.getElementById("slangMeaning").value = "";
    document.getElementById("slangGen").value = "";
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", renderSlangList);
