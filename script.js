// --- 設定エリア ---
const GITHUB_TOKEN = "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";
const REPO_OWNER = "892-892"; // ← あなたのユーザー名を反映しました
const REPO_NAME = "boardgame-list"; 
const FILE_PATH = "script.js";

// この下の「const games = [...]」の中に自動で追加されていきます
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
    if (!list) return;
    list.innerHTML = "";
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${game.image}" alt="${game.title}" style="width:100%; height:150px; object-fit:cover;">
            <div class="card-content">
                <h3 style="font-size:16px; margin:5px 0;">${game.title}</h3>
            </div>
        `;
        list.appendChild(card);
    });
}
displayGames();

// --- 2. BGGで検索する機能 ---
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
            btn.style.margin = "5px 0";
            btn.style.padding = "10px";
            btn.style.cursor = "pointer";
            btn.innerHTML = `【追加】 ${name} (ID:${id})`;
            btn.onclick = () => getDetailAndSave(id, name);
            resultsDiv.appendChild(btn);
        }
    } catch (e) {
        resultsDiv.innerHTML = "検索エラー。時間を置いて試してください。";
    }
}

// --- 3. BGGから詳細（画像）を取得してGitHubに保存する機能 ---
async function getDetailAndSave(id, title) {
    if(!confirm(`${title} を追加しますか？`)) return;

    const proxy = "https://api.allorigins.win/get?url=";
    const detailUrl = `https://boardgamegeek.com/xmlapi2/thing?id=${id}`;
    
    try {
        const response = await fetch(proxy + encodeURIComponent(detailUrl));
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        
        let image = "";
        const imgTags = xml.getElementsByTagName("image");
        if (imgTags.length > 0) {
            image = imgTags[0].textContent;
        } else {
            image = "https://via.placeholder.com/150?text=No+Image";
        }

        const newGame = { title, id: parseInt(id), image };
        await saveToGithub(newGame);
    } catch (e) {
        alert("情報の取得に失敗しました。");
    }
}

async function saveToGithub(newGame) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

    try {
        const res = await fetch(url, {
            headers: { Authorization: `token ${GITHUB_TOKEN}` }
        });
        const fileData = await res.json();
        
        // ファイルの中身を解読
        const content = decodeURIComponent(escape(atob(fileData.content)));

        // 「const games = [」の直後にデータを差し込む
        const newEntry = JSON.stringify(newGame, null, 2);
        const updatedContent = content.replace("const games = [", `const games = [\n  ${newEntry},`);

        // GitHubへ保存（コミット）
        const updateRes = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: `token ${GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `Add ${newGame.title}`,
                content: btoa(unescape(encodeURIComponent(updatedContent))),
                sha: fileData.sha
            })
        });

        if (updateRes.ok) {
            alert("保存成功！反映まで2〜3分待ってリロードしてください。");
        } else {
            alert("保存に失敗しました。設定を確認してください。");
        }
    } catch (e) {
        alert("通信エラー。");
    }
}
