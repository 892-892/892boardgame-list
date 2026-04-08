const games = [
    { title: "カタン", players: "3-4人", time: "60分" },
    { title: "ナンジャモンジャ", players: "2-6人", time: "15分" }
];

const list = document.getElementById('game-list');

games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${game.title}</h3><p>${game.players}</p><p>${game.time}</p>`;
    list.appendChild(card);
});
