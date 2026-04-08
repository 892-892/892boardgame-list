const games = [
  { "title": "Gem Blox", "image": "https://cf.geekdo-images.com/Y34qQ_yZ_Bf5WvHnI0DqFA__itemrep/img/rNInl8_R-E-U_vV_fE_6_w=/fit-in/400x400/filters:strip_icc()/pic6899754.png" },
  { "title": "Bites", "image": "https://cf.geekdo-images.com/E5uM6Gj-pL9T6A-N5Pz8Xg__itemrep/img/Y8Xv6jF_x_9O7p_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic4663784.jpg" },
  { "title": "Loco Momo", "image": "https://cf.geekdo-images.com/f9-S_W_7_v9Xf_E_6_w=/fit-in/400x400/filters:strip_icc()/pic6011707.jpg" },
  { "title": "NMBR 9", "image": "https://cf.geekdo-images.com/T0_V_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic3381403.jpg" },
  { "title": "A Fake Artist Goes to New York", "image": "https://cf.geekdo-images.com/7-V_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic1497216.jpg" },
  { "title": "Deep Sea Adventure", "image": "https://cf.geekdo-images.com/T-V_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic2322525.jpg" },
  { "title": "Startups", "image": "https://cf.geekdo-images.com/u_V_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic3466183.jpg" },
  { "title": "Scout", "image": "https://cf.geekdo-images.com/V_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic6420531.jpg" },
  { "title": "Durian", "image": "https://cf.geekdo-images.com/W_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic5444643.jpg" },
  { "title": "Moon Adventure", "image": "https://cf.geekdo-images.com/X_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic5934621.jpg" },
  { "title": "The Game", "image": "https://cf.geekdo-images.com/Y_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic2418305.jpg" },
  { "title": "The Mind", "image": "https://cf.geekdo-images.com/Z_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic3938221.jpg" },
  { "title": "Ito", "image": "https://cf.geekdo-images.com/a_v_E_6_w=/fit-in/400x400/filters:strip_icc()/pic4881261.jpg" }
];

function displayGames() {
  const list = document.getElementById('game-list');
  if (!list) return;
  list.innerHTML = "";
  
  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'card';
    
    // プロキシを通すことでBGGの画像を表示可能にします
    const imageUrl = `https://wsrv.nl/?url=${encodeURIComponent(game.image)}&w=400&h=400&fit=cover`;
    
    card.innerHTML = `
      <img src="${imageUrl}" alt="${game.title}" loading="lazy">
      <div class="card-content">
        <p class="card-title">${game.title}</p>
      </div>
    `;
    list.appendChild(card);
  });
}

window.onload = displayGames;
