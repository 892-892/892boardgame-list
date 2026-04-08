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

        resultsDiv.innerHTML = ""; // 画面をクリア
        for (let i = 0; i < Math.min(items.length, 5); i++) { // 上位5件表示
            const name = items[i].getElementsByTagName("name")[0].getAttribute("value");
            const id = items[i].getAttribute("id");
            
            const btn = document.createElement('button');
            btn.innerHTML = `${name} (ID: ${id}) を追加用データとして表示`;
            btn.onclick = () => alert(`これをscript.jsに貼ってね:\n{ title: "${name}", id: ${id} }`);
            resultsDiv.appendChild(btn);
        }
    } catch (e) {
        resultsDiv.innerHTML = "検索に失敗しました。";
    }
}
