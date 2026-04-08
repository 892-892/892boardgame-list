// --- 設定エリア ---
const GITHUB_TOKEN = "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";
const REPO_OWNER = "892-892"; 
const REPO_NAME = "boardgame-list";
const FILE_PATH = "script.js";

// 最初は空のリストにします。追加するとここにデータが入ります。
const games = [];

// --- 画面表示 ---
function displayGames() {
  const list = document.getElementById('game-list');
  if (!list) return;
  list.innerHTML = "";
  
  if (games.length === 0) {
    list.innerHTML = "<p style='grid-column: 1/-1; text-align: center; color: #666;'>ゲームがありません。上の検索窓から追加してください。</p>";
  }

  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'card';
    
    // 画像を表示するための安定したプロキシ設定
    const stableImage = `https://wsrv.nl/?url=${encodeURIComponent(game.image)}&w=300&h=300&fit=cover`;
    
    card.innerHTML = `
      <img src="${stableImage}" alt="${game.title}" loading="lazy">
      <div class="card-title">${game.title}</div>
    `;
    list.appendChild(card);
  });
}

window.onload = displayGames;

// --- 検索機能 ---
async function searchBgg() {
  const query = document.getElementById('bgg-search-input').value;
  const resultsDiv = document.getElementById('search-results');
  if (!query) return;
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
      btn.style.display = "block";
      btn.style.margin = "5px";
      btn.innerHTML = `追加: ${name}`;
      btn.onclick = () => getDetailAndSave(id, name);
      resultsDiv.appendChild(btn);
    }
  } catch (e) {
    resultsDiv.innerHTML = "検索に失敗しました。";
  }
}

// --- 詳細取得とGitHub保存 ---
async function getDetailAndSave(id, title) {
  if(!confirm(`${title} を追加しますか？`)) return;
  const proxy = "https://api.allorigins.win/get?url=";
  const detailUrl = `https://boardgamegeek.com/xmlapi2/thing?id=${id}`;
  try {
    const response = await fetch(proxy + encodeURIComponent(detailUrl));
    const data = await response.json();
    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, "text/xml");
    const image = xml.getElementsByTagName("image")[0].textContent;
    await saveToGithub({ title, id: parseInt(id), image });
  } catch (e) { 
    alert("情報の取得に失敗しました。"); 
  }
}

async function saveToGithub(newGame) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;
  const res = await fetch(url, { headers: { Authorization: `token ${GITHUB_TOKEN}` } });
  const fileData = await res.json();
  const content = decodeURIComponent(escape(atob(fileData.content)));
  
  // games配列の直後に新しいデータを差し込む
  const updatedContent = content.replace("const games = [", `const games = [\n  ${JSON.stringify(newGame, null, 2)},`);
  
  await fetch(url, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Add ${newGame.title}`,
      content: btoa(unescape(encodeURIComponent(updatedContent))),
      sha: fileData.sha
    })
  });
  alert("保存完了！2分ほど待ってからリロードしてください。");
  location.reload();
}
