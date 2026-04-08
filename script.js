async function getBggImage(bggId) {
    // 1. プロキシ（検閲回避用の通り道）を使う
    const proxyUrl = "https://api.allorigins.win/get?url=";
    const targetUrl = `https://boardgamegeek.com/xmlapi2/thing?id=${bggId}`;
    
    try {
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
        const data = await response.json();
        
        // 2. 届いたデータを解析する
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");
        
        // 3. 画像URL（thumbnail または image）を抜き出す
        const imgUrl = xml.getElementsByTagName("thumbnail")[0].textContent;
        return imgUrl;
    } catch (e) {
        console.error("画像がとれなかったよ:", e);
        return "https://via.placeholder.com/150"; // 失敗した時の代わりの画像
    }
}
