// slang.js
// js/slang.js

const country = localStorage.getItem("country");
const storageKey = `slangs_${country}`;

let slangData = JSON.parse(localStorage.getItem(storageKey)) || [];

function addSlang() {
    const word = document.getElementById("slangWord").value.trim();
    const meaning = document.getElementById("slangMeaning").value.trim();
    const gen = document.getElementById("slangGen").value;

    if (!word || !meaning || !gen) {
        alert("Please fill all fields");
        return;
    }

    slangData.push({
        word,
        meaning,
        gen,
        likes: 0,
        dislikes: 0
    });

    localStorage.setItem(storageKey, JSON.stringify(slangData));
    renderSlangs();
    clearForm();
}

function renderSlangs() {
    const list = document.getElementById("slangList");
    if (!list) return;

    list.innerHTML = "";

    slangData.forEach((s, index) => {
        list.innerHTML += `
            <div class="col-md-4">
                <div class="card p-3 mb-3">
                    <h5>${s.word}</h5>
                    <p>${s.meaning}</p>
                    <small>${s.gen}</small>
                </div>
            </div>
        `;
    });
}

function clearForm() {
    document.getElementById("slangWord").value = "";
    document.getElementById("slangMeaning").value = "";
    document.getElementById("slangGen").value = "";
}

// 페이지 로드 시 실행
document.addEventListener("DOMContentLoaded", renderSlangs);
