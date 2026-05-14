function init() {
  var grid = document.getElementById('previewGrid');
  grid.innerHTML = '';
  gameState.gridItems = [];
  for (var i = 0; i < 60; i++) {
    var cell = document.createElement('div');
    cell.className = 'wh-cell';
    grid.appendChild(cell);
    gameState.gridItems.push(pickItem());
  }
  assignItems();
  renderAllPlayerItems();
}

function initRound(round) {
  updateUI();
  document.getElementById('btnConfirm').disabled = false;
  addLog('system', '🎯 第 ' + round + ' 轮开始');

  generateAIBids(true);

  clearScanReveals();
  roundItemUsed = { me: false, ai1: false, ai2: false, ai3: false };
  renderAllPlayerItems();

  aiUseItem('ai1');
  aiUseItem('ai2');
  aiUseItem('ai3');

  activateShadowScan();
}

function restartGame() {
  document.getElementById('settleModal').classList.remove('show');

  var savedCharId = gameState.playerCharId || 'ethan';

  gameState = {
    currentRound: 1,
    maxRounds: 5,
    money: 3000000,
    aiMoney: [2500000, 1800000, 3200000],
    hafCoins: 0,
    collectedItems: [],
    collectedValues: [],
    gridItems: [],
    isBidding: false,
    bidAmount: 0,
    roundHistory: [],
    playerCharId: savedCharId
  };

  var ch = characterData.find(function(c) { return c.id === savedCharId; }) || characterData[0];
  document.querySelector('[data-player="me"] .avatar-frame img').src = ch.img;
  document.querySelector('[data-player="me"] .player-name').textContent = ch.name + ' (你)';
  document.getElementById('charBtnAvatar').src = ch.img;

  document.getElementById('bidDisplay').textContent = '输入金额...';
  document.getElementById('bidDisplay').style.color = '#ffd700';
  document.getElementById('topPrice').textContent = '0';
  document.getElementById('topBidder').textContent = '';
  document.getElementById('btnConfirm').disabled = false;
  document.getElementById('myMoney').textContent = '3,000,000';
  document.getElementById('ai1Money').textContent = '2,500,000';
  document.getElementById('ai2Money').textContent = '1,800,000';
  document.getElementById('ai3Money').textContent = '3,200,000';
  updateHafCoinsUI();

  document.querySelectorAll('.player-card').forEach(function(c) { c.classList.remove('winner-card', 'loser-card'); });
  document.getElementById('myStatus').textContent = '准备就绪';
  document.getElementById('ai1Status').textContent = '等待中...';
  document.getElementById('ai2Status').textContent = '等待中...';
  document.getElementById('ai3Status').textContent = '等待中...';

  document.getElementById('bid-logs').innerHTML = '';
  document.getElementById('scanStatus').textContent = 'READY';

  var grid = document.getElementById('previewGrid');
  grid.innerHTML = '';
  gameState.gridItems = [];
  for (var i = 0; i < 60; i++) {
    var cell = document.createElement('div');
    cell.className = 'wh-cell';
    grid.appendChild(cell);
    gameState.gridItems.push(pickItem());
  }

  assignItems();
  renderAllPlayerItems();

  addLog('system', '🔄 游戏已重置，新的一局开始！');
  openLobby();
}

function initKeyboardListeners() {
  document.addEventListener('keydown', function(e) {
    var startScreen = document.getElementById('startScreen');
    if (startScreen && startScreen.style.display !== 'none' && !startScreen.classList.contains('exit')) return;
    if (document.getElementById('startCharOverlay').classList.contains('show')) return;
    if (document.getElementById('shopOverlay').classList.contains('show')) return;
    if (document.getElementById('confirmOverlay').classList.contains('show')) return;
    if (document.getElementById('charOverlay').classList.contains('show')) return;
    if (document.getElementById('mapOverlay').classList.contains('show')) return;
    if (document.getElementById('settleModal').classList.contains('show')) return;
    if (document.getElementById('numpadOverlay').classList.contains('show')) return;
    var key = parseInt(e.key);
    if (key >= 1 && key <= 5) {
      var slotIdx = key - 1;
      if (playerItems.me && playerItems.me[slotIdx] && !playerItems.me[slotIdx].used && !roundItemUsed.me) {
        showUseConfirm('me', slotIdx);
      }
    }
  });
}

window.onload = function() {
  initNumpadListeners();
  initConfirmListeners();
  initShopListeners();
  initBidListeners();
  initMapListeners();
  initCharacterListeners();
  initKeyboardListeners();

  init();
  initStartScreen();
};
