// 管理したいゲームのBGG IDを並べるだけ！
const bggIds = [13, 36218, 266192]; // カタン, ドミニオン, ウィングスパンのID

const list = document.getElementById('game-list');

// BGGから情報を取ってくる魔法の関数
async function fetchGameData(id) {
    // セキュリティ制限を回避するためのプロキシ（allorigins）を経由してBGG APIを叩く
    const proxy = "https://api.allorigins.win/get?url=";
    const bggApi = `https://boardgamegeek.com/xmlapi2/thing?id=${id}`;
    
    const response = await fetch(proxy + encodeURIComponent(bggApi));
    const data = await response.json();
    
    // XML（BGGのデータ形式）を解析
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");
    
    const title = xmlDoc.getElementsByTagName("name")[0].getAttribute("value");
    const image = xmlDoc.getElementsByTagName("image")[0].textContent;
    const minPlayers = xmlDoc.getElementsByTagName("minplayers")[0].getAttribute("value");
    const maxPlayers = xmlDoc.getElementsByTagName("maxplayers")[0].getAttribute("value");

    return { title, image, players: `${minPlayers}-${maxPlayers}人` };
}

// 順番に表示する
bggIds.forEach(async (id) => {
    const game = await fetchGameData(id);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${game.image}" style="width:100%; border-radius:4px;">
        <h3>${game.title}</h3>
        <p>${game.players}</p>
    `;
    list.appendChild(card);
});
