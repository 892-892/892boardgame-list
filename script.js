// --- 設定エリア ---
const GITHUB_TOKEN = "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";
const REPO_OWNER = "892-892"; 
const REPO_NAME = "boardgame-list";
const FILE_PATH = "script.js";

// スプレッドシートの全データを初期反映
const games = [
  { "title": "Gem Blox", "id": 361413, "image": "https://cf.geekdo-images.com/Y34qQ_yZ_Bf5WvHnI0DqFA__itemrep/img/rNInl8_R-E-U_vV_fE_6_w=/fit-in/400x400/filters:strip_icc()/pic6899754.png" },
  { "title": "Bites", "id": 213327, "image": "https://cf.geekdo-images.com/E5uM6Gj-pL9T6A-N5Pz8Xg__itemrep/img/Y8Xv6jF_x_9O7p_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic4663784.jpg" },
  { "title": "Loco Momo", "id": 334175, "image": "https://cf.geekdo-images.com/f9-S_W_7_v9Xf_E_6_w=/fit-in/400x400/filters:strip_icc()/pic6011707.jpg" },
  { "title": "NMBR 9", "id": 217449, "image": "https://cf.geekdo-images.com/T0_V_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic3381403.jpg" },
  { "title": "A Fake Artist Goes to New York", "id": 135779, "image": "https://cf.geekdo-images.com/7-V_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic1497216.jpg" },
  { "title": "Deep Sea Adventure", "id": 169654, "image": "https://cf.geekdo-images.com/T-V_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic2322525.jpg" },
  { "title": "Startups", "id": 222366, "image": "https://cf.geekdo-images.com/u_V_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic3466183.jpg" },
  { "title": "Scout", "id": 293910, "image": "https://cf.geekdo-images.com/V_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic6420531.jpg" },
  { "title": "Durian", "id": 310543, "image": "https://cf.geekdo-images.com/W_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic5444643.jpg" },
  { "title": "Moon Adventure", "id": 331778, "image": "https://cf.geekdo-images.com/X_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic5934621.jpg" },
  { "title": "The Game", "id": 173065, "image": "https://cf.geekdo-images.com/Y_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic2418305.jpg" },
  { "title": "The Mind", "id": 244992, "image": "https://cf.geekdo-images.com/Z_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic3938221.jpg" },
  { "title": "Ito", "id": 286208, "image": "https://cf.geekdo-images.com/a_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic4881261.jpg" }
];

// --- 画面表示 ---
const list = document.getElementById('game-list');
function displayGames() {
    list.innerHTML = "";
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<img src="${game.image}" alt="${game.title}"><div class="card-title">${game.title}</div>`;
        list.appendChild(card);
    });
}
displayGames();

// --- 検索機能 ---
async function searchBgg() {
    const query = document.getElementById('bgg-search-input').value;
    const resultsDiv = document.getElementById('search-results');
    if (!query) return;
    resultsDiv.innerHTML = "Searching...";

    const proxy = "https://api.allorigins.win/get?url=";
    const searchUrl = `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`;

    try {
        const response = await fetch(proxy + encodeURIComponent(searchUrl));
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        const items = xml.getElementsByTagName("item");

        resultsDiv.innerHTML = ""; 
        for (let i = 0; i < Math.min(items.length, 5); i++) {
            const name = items[i].getElementsByTagName("name")[0].getAttribute("value");
            const id = items[i].getAttribute("id");
            const btn = document.createElement('button');
            btn.style.display = "block";
            btn.style.margin = "5px";
            btn.innerHTML = `Add: ${name}`;
            btn.onclick = () => getDetailAndSave(id, name);
            resultsDiv.appendChild(btn);
        }
    } catch (e) { resultsDiv.innerHTML = "Error."; }
}

// --- 詳細取得とGitHub保存 ---
async function getDetailAndSave(id, title) {
    if(!confirm(`Add ${title}?`)) return;
    const proxy = "https://api.allorigins.win/get?url=";
    const detailUrl = `https://boardgamegeek.com/xmlapi2/thing?id=${id}`;
    
    try {
        const response = await fetch(proxy + encodeURIComponent(detailUrl));
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        const image = xml.getElementsByTagName("image")[0].textContent;
        const newGame = { title, id: parseInt(id), image };
        await saveToGithub(newGame);
    } catch (e) { alert("Failed to get info."); }
}

async function saveToGithub(newGame) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const res = await fetch(url, { headers: { Authorization: `token ${GITHUB_TOKEN}` } });
    const fileData = await res.json();
    const content = decodeURIComponent(escape(atob(fileData.content)));

    const newEntry = JSON.stringify(newGame, null, 2);
    const updatedContent = content.replace("const games = [", `const games = [\n  ${newEntry},`);

    const updateRes = await fetch(url, {
        method: "PUT",
        headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            message: `Add ${newGame.title}`,
            content: btoa(unescape(encodeURIComponent(updatedContent))),
            sha: fileData.sha
        })
    });
    if (updateRes.ok) alert("Saved! Please wait 2-3 min and refresh.");
}
