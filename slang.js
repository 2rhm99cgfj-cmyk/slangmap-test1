// slang.js

/* =========================
   Context
========================= */
const country = localStorage.getItem("country");
const userType = localStorage.getItem("userType"); // local | visitor
let selectedGen = localStorage.getItem("generation");
const storageKey = `slangs_${country}`;

/* =========================
   Data
========================= */
let slangData = JSON.parse(localStorage.getItem(storageKey)) || [];

/* =========================
   Permission
========================= */
function canWrite() {
    return userType === "local";
}

/* =========================
   Add Slang
========================= */
function addSlang() {
    if (!canWrite()) {
        alert("Visitor는 Slang을 작성할 수 없습니다.");
        return;
    }

    if (!selectedGen) {
        alert("먼저 세대를 선택해주세요.");
        return;
    }
    const word = document.getElementById("slangWord").value.trim();
    const meaning = document.getElementById("slangMeaning").value.trim();

    if (!word || !meaning) {
        alert("모든 항목을 입력해주세요.");
        return;
    }

    // ❌ Duplicate check (same word + same generation)
    const isDuplicate = slangData.some(s =>
        s.word.toLowerCase() === word.toLowerCase() &&
        s.generation === gen
    );

    if (isDuplicate) {
        alert("이미 동일한 Slang이 존재합니다.");
        return;
    }

    const slang = {
        id: crypto.randomUUID(),
        word,
        meaning,
        generation: selectedGen,
        likes: 0,
        ratingSum: 0,
        ratingCount: 0,
        likedBy: [],
        ratedBy: [],
        createdAt: Date.now()
    };

    slangData.unshift(slang);
    saveData();
    renderSlangList();
    clearForm();
}

/* =========================
   Actions
========================= */
function likeSlang(id) {
    const slang = slangData.find(s => s.id === id);
    if (!slang) return;

    if (slang.likedBy.includes(userType)) {
        alert("이미 좋아요를 눌렀습니다.");
        return;
    }

    slang.likes += 1;
    slang.likedBy.push(userType);

    saveData();
    renderSlangList();
}

function rateSlang(id, score) {
    const slang = slangData.find(s => s.id === id);
    if (!slang) return;

    if (slang.ratedBy.includes(userType)) {
        alert("이미 별점을 등록했습니다.");
        return;
    }

    slang.ratingSum += score;
    slang.ratingCount += 1;
    slang.ratedBy.push(userType);

    saveData();
    renderSlangList();
}

/* =========================
   Save
========================= */
function saveData() {
    localStorage.setItem(storageKey, JSON.stringify(slangData));
}

/* =========================
   Render Slang List
========================= */
function renderSlangList() {
    const list = document.getElementById("slangList");
    if (!list) return;

    list.innerHTML = "";

    const filtered = selectedGen
        ? slangData.filter(s => s.generation === selectedGen)
        : slangData;

    if (filtered.length === 0) {
        list.innerHTML = `<p class="text-muted">등록된 Slang이 없습니다.</p>`;
        renderRanking();
        return;
    }

    filtered.forEach(s => {
        const avgRating = s.ratingCount
            ? (s.ratingSum / s.ratingCount).toFixed(1)
            : "N/A";

        const liked = s.likedBy.includes(userType);
        const rated = s.ratedBy.includes(userType);

        list.innerHTML += `
            <div class="col-md-4">
                <div class="card p-3 mb-3 h-100">
                    <h5>${s.word}</h5>
                    <p>${s.meaning}</p>
                    <small class="text-muted">${s.generation}</small>

                    <div class="mt-3 d-flex justify-content-between align-items-center">
                        <button
                          class="btn btn-sm ${liked ? 'btn-success' : 'btn-outline-success'}"
                          onclick="likeSlang('${s.id}')">
                          👍 ${s.likes}
                        </button>

                        <div>
                            ${[1,2,3,4,5].map(n => `
                                <span
                                  style="cursor:pointer; opacity:${rated ? 0.4 : 1}"
                                  onclick="rateSlang('${s.id}', ${n})">
                                  ⭐
                                </span>
                            `).join("")}
                            <small class="text-muted">(${avgRating})</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    // 🔥 랭킹도 같이 업데이트
    renderRanking();
}

/* =========================
   Render Ranking
========================= */
function renderRanking() {
    const rankingEl = document.getElementById("rankingList");
    if (!rankingEl) return;

    rankingEl.innerHTML = "";

    if (slangData.length === 0) {
        rankingEl.innerHTML =
            `<p class="text-muted">아직 랭킹 데이터가 없습니다.</p>`;
        return;
    }

    const ranked = [...slangData]
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 5); // Top 5

    ranked.forEach((s, index) => {
        rankingEl.innerHTML += `
            <div class="col-md-12">
                <div class="card p-2 mb-2 d-flex flex-row justify-content-between align-items-center">
                    <div>
                        <strong>#${index + 1}</strong>
                        ${s.word}
                        <small class="text-muted">(${s.generation})</small>
                    </div>
                    <div>👍 ${s.likes}</div>
                </div>
            </div>
        `;
    });
}

/* =========================
   Generation Filter
========================= */
function selectGeneration(gen) {
    selectedGen = gen;
    localStorage.setItem("generation", gen);

    const info = document.getElementById("generationInfo");
    if (info) {
        info.innerText = `Selected generation: ${gen}`;
    }

    renderSlangList();
}

/* =========================
   Utils
========================= */
function clearForm() {
    document.getElementById("slangWord").value = "";
    document.getElementById("slangMeaning").value = "";
}

/* =========================
   Page Context Init
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById("userInfo");
    const genInfo = document.getElementById("generationInfo");

    if (userInfo) {
        let msg = "User type not specified.";
        if (userType === "local") msg = "You are viewing this as a local speaker.";
        if (userType === "visitor") msg = "You are viewing this as a visitor.";
        userInfo.innerText = `${msg} (Country: ${country})`;
    }

    if (genInfo && selectedGen) {
        genInfo.innerText = `Selected generation: ${selectedGen}`;
    }

    renderSlangList();
    renderRanking();
});
