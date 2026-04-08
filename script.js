// --- 設定エリア ---
const GITHUB_TOKEN = "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";
const REPO_OWNER = "892-892"; 
const REPO_NAME = "boardgame-list";
const FILE_PATH = "script.js";

// 最初から表示するデータ（ここは自動書き換えの対象になります）
const games = [
  {
    "title": "Catan",
    "id": 13,
    "image": "https://cf.geekdo-images.com/W3Bs9D67GbaSglSolsOn-g__itemrep/img/S9v6An2CS69N_3ZgnT8_X_idC2U=/fit-in/400x400/filters:strip_icc()/pic24193.jpg"
  }
];

// --- 1. 画面にカードを表示する機能 ---
const list = document.getElementById('game-list');
function displayGames() {
    list.innerHTML = ""; // 一旦クリア
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${game.image}" alt="${game.title}">
            <div class="card-content">
                <h3 class="card-title">${game.title}</h3>
                <p class="card-info">BGG ID: ${game.id}</p>
            </div>
        `;
        list.appendChild(card);
    });
}
displayGames(); // 起動時に実行

// --- 2. BGGで検索する機能 ---
async function searchBgg() {
    const query = document.getElementById('bgg-search-input').value;
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = "検索中...";

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
            btn.style.margin = "5px";
            btn.innerHTML = `【追加】 ${name}`;
            btn.onclick = () => getDetailAndSave(id, name);
            resultsDiv.appendChild(btn);
        }
    } catch (e) {
        resultsDiv.innerHTML = "検索エラーが発生しました。";
    }
}

// --- 3. 詳細情報を取ってGitHubに保存する機能 ---
async function getDetailAndSave(id, title) {
    if(!confirm(`${title} をリストに追加してGitHubに保存しますか？`)) return;

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
    } catch (e) {
        alert("詳細情報の取得に失敗しました。");
    }
}

async function saveToGithub(newGame) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

    // 現在のファイルを取得
    const res = await fetch(url, {
        headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const fileData = await res.json();
    const content = decodeURIComponent(escape(atob(fileData.content)));

    // データの配列を書き換え
    const newEntry = JSON.stringify(newGame, null, 2);
    const updatedContent = content.replace("const games = [", `const games = [\n  ${newEntry},`);

    // GitHubへ送信
    const updateRes = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: `Add ${newGame.title}`,
