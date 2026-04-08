// 表示したいゲームのリスト
const games = [
    {
        title: "カタン",
        players: "3-4人",
        time: "60-90分",
        image: "https://cf.geekdo-images.com/W3Bs9D67GbaSglSolsOn-g__itemrep/img/S9v6An2CS69N_3ZgnT8_X_idC2U=/fit-in/400x400/filters:strip_icc()/pic24193.jpg"
    },
    {
        title: "ドミニオン",
        players: "2-4人",
        time: "30分",
        image: "https://cf.geekdo-images.com/j6i_ka_Dq_SQU9G4S_1pGg__itemrep/img/Y5ZtOq8XfC0-v8U1Y5AAn-vWq_4=/fit-in/400x400/filters:strip_icc()/pic394356.jpg"
    },
    {
        title: "ウィングスパン",
        players: "1-5人",
        time: "40-70分",
        image: "https://cf.geekdo-images.com/yLZ_R_q_7U_E86fJ-DWInA__itemrep/img/7G05_qE09477S26YJmPjZcPy3qE=/fit-in/400x400/filters:strip_icc()/pic4458123.jpg"
    }
];

// HTMLの「game-list」というIDがついた場所を探す
const list = document.getElementById('game-list');

// ゲームひとつずつに対して、カードを作って表示する
games.forEach(game => {
    // 1. カードの枠を作る
    const card = document.createElement('div');
    card.className = 'card';

    // 2. カードの中身を組み立てる
    card.innerHTML = `
        <img src="${game.image}" alt="${game.title}">
        <div class="card-content">
            <h3 class="card-title">${game.title}</h3>
            <p class="card-info">👥 ${game.players}</p>
            <p class="card-info">⏱ ${game.time}</p>
        </div>
    `;

    // 3. 画面に追加する
    list.appendChild(card);
});
