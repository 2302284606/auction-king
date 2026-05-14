var LOBBY_SKILLS = {
  ethan: '拍卖开始时显示 5 处随机类型藏品的品质，之后每个回合显示…',
  sunset: '分析区域锁定，精准评估区域内藏品的平均价值，让每一次出价都建立在精确的计算之上…',
  sweet: '在关键时刻抛出令人意想不到的报价，如同一颗甜蜜的炸弹，瞬间引爆全场…',
  hunter: '凭借对深海遗珍的偏执热爱，每一次举牌都带着破釜沉舟的决心，从不轻易放弃…',
  auctioneer: '凭借对规则的深刻理解和对人性的精准把控，用规则的力量征服每一场竞拍…'
};

var LOBBY_TITLES = {
  ethan: '古董鉴定师',
  sunset: '沙漠行者',
  sweet: '收藏世家',
  hunter: '海底探秘者',
  auctioneer: '古藏仲裁者'
};

var lobbyCharIndex = 0;

function openLobby() {
  lobbyCharIndex = characterData.findIndex(function(c) { return c.id === gameState.playerCharId; });
  if (lobbyCharIndex < 0) lobbyCharIndex = 0;
  renderLobby();
  document.getElementById('lobbyScreen').classList.add('show');
}

function closeLobby() {
  document.getElementById('lobbyScreen').classList.remove('show');
  var screen = document.getElementById('startScreen');
  screen.style.display = 'flex';
  screen.classList.remove('exit');
}

function renderLobby() {
  var ch = characterData[lobbyCharIndex] || characterData[0];

  document.getElementById('lobbyCharBg').src = ch.img;
  document.getElementById('lobbyCharName').textContent = ch.name;
  document.getElementById('lobbyCharTitle').textContent = LOBBY_TITLES[ch.id] || ch.title;
  document.getElementById('lobbyCharBio').textContent = ch.desc;

  document.getElementById('lobbySkillAvatar').src = ch.img;
  document.getElementById('lobbySkillName').textContent = ch.name;
  document.getElementById('lobbySkillDesc').textContent = LOBBY_SKILLS[ch.id] || '';

  document.getElementById('lobbyGold').textContent = gameState.money.toLocaleString();

  renderLobbyThumbs();
  renderLobbyPocket();
}

function renderLobbyThumbs() {
  var container = document.getElementById('lobbyThumbs');
  container.innerHTML = '';
  characterData.forEach(function(ch, idx) {
    var thumb = document.createElement('div');
    thumb.className = 'lobby-thumb' + (idx === lobbyCharIndex ? ' active' : '');
    thumb.innerHTML = '<img src="' + ch.img + '" alt="' + ch.name + '">';
    if (idx === 0) {
      thumb.innerHTML += '<span class="thumb-count">6</span>';
    }
    thumb.onclick = function() {
      lobbyCharIndex = idx;
      gameState.playerCharId = ch.id;
      renderLobby();
    };
    container.appendChild(thumb);
  });
}

function renderLobbyPocket() {
  var container = document.getElementById('lobbyPocketSlots');
  container.innerHTML = '';
  var items = playerItems.me || [];
  var filledCount = 0;
  items.forEach(function(item) {
    var slot = document.createElement('div');
    var type = ITEM_TYPES.find(function(t) { return t.id === item.type; });
    if (item.used) {
      slot.className = 'lobby-pocket-slot';
      slot.innerHTML = '<div style="color:rgba(255,255,255,0.08);font-size:18px">-</div><div class="slot-rarity normal"></div>';
    } else {
      filledCount++;
      var rarityClass = 'normal';
      slot.className = 'lobby-pocket-slot filled';
      slot.innerHTML = '<div style="font-size:18px">' + type.icon + '</div><div class="slot-rarity ' + rarityClass + '"></div>';
    }
    container.appendChild(slot);
  });
  for (var i = items.length; i < 5; i++) {
    var slot = document.createElement('div');
    slot.className = 'lobby-pocket-slot empty';
    slot.textContent = '+';
    container.appendChild(slot);
  }
  document.getElementById('lobbyPocketCount').textContent = filledCount + ' / 5';
}

function lobbyStartGame() {
  playGavel();
  document.getElementById('lobbyScreen').classList.remove('show');
  openMapSelection();
}
