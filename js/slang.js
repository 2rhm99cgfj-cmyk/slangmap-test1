const country = localStorage.getItem("country");
const storageKey = `slangs_${country}`;
let slangData = JSON.parse(localStorage.getItem(storageKey)) || [];

function addSlang() {
    const word = document.getElementById("slangWord").value.trim();
    const meaning = document.getElementById("slangMeaning").value.trim();
    const generation = localStorage.getItem("generation");

    if (!word || !meaning || !generation) {
        alert("Fill all fields & select generation.");
        return;
    }

    const exists = slangData.some(
        s => s.word === word && s.generation === generation
    );
    if (exists) {
        alert("Already exists.");
        return;
    }

    slangData.unshift({
        id: crypto.randomUUID(),
        word,
        meaning,
        generation,
        likes: 0
    });

    save();
    render();
    clearForm();
}

function save() {
    localStorage.setItem(storageKey, JSON.stringify(slangData));
}

function like(id) {
    const s = slangData.find(x => x.id === id);
    s.likes++;
    save();
    render();
}

function render() {
    const list = document.getElementById("slangList");
    const ranking = document.getElementById("rankingList");
    if (!list || !ranking) return;

    list.innerHTML = "";
    ranking.innerHTML = "";

    slangData.forEach(s => {
        list.innerHTML += `
        <div class="col-md-4">
            <div class="card p-3 mb-3">
                <h5>${s.word}</h5>
                <p>${s.meaning}</p>
                <small>${s.generation}</small>
                <button class="btn btn-sm btn-outline-primary mt-2"
                        onclick="like('${s.id}')">
                    👍 ${s.likes}
                </button>
            </div>
        </div>`;
    });

    slangData
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5)
        .forEach(s => {
            ranking.innerHTML += `
            <div class="col-md-4">
                <div class="card p-2 mb-2">
                    <strong>${s.word}</strong>
                    <span>👍 ${s.likes}</span>
                    <small class="d-block">${s.generation}</small>
                </div>
            </div>`;
        });
}

function clearForm() {
    document.getElementById("slangWord").value = "";
    document.getElementById("slangMeaning").value = "";
}

document.addEventListener("DOMContentLoaded", render);
