// --- 設定エリア ---
const GITHUB_TOKEN = "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";
const REPO_OWNER = "892-892"; 
const REPO_NAME = "boardgame-list";
const FILE_PATH = "script.js";

// ゲームデータ
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
    if (!list) return;
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
    results
