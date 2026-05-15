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
  document.querySelector('.game-wrapper').classList.add('show');
  updateUI();
  document.getElementById('btnConfirm').disabled = false;
  addLog('system', '🎯 第 ' + round + ' 轮开始');

  var exhibitionIncome = collectExhibitionIncomeSilent();
  if (exhibitionIncome > 0) {
    addLog('system', '🏛️ 展厅收入 +' + exhibitionIncome.toLocaleString() + ' 哈夫币');
  }
  updateExhibitionEntryUI();

  generateAIBids(true);

  clearScanReveals();
  roundItemUsed = { me: false, ai1: false, ai2: false, ai3: false };
  renderAllPlayerItems();

  aiUseItem('ai1');
  aiUseItem('ai2');
  aiUseItem('ai3');

  activateShadowScan();
  if (gameState.playerCharId === 'sunset') {
    var ch = characterData.find(function(c) { return c.id === gameState.playerCharId; }) || characterData[0];
    activateActuary(ch.name);
  }
  startCountdown();
}

function nextGame() {
  document.getElementById('settleModal').classList.remove('show');

  var savedCharId = gameState.playerCharId || 'ethan';
  var carriedMoney = gameState.money;
  var carriedHafCoins = gameState.hafCoins;
  var newGameNumber = gameState.gameNumber + 1;

  gameState = {
    currentRound: 1,
    maxRounds: 5,
    gameNumber: newGameNumber,
    money: carriedMoney,
    aiMoney: INITIAL_AI_MONEY.slice(),
    hafCoins: carriedHafCoins,
    collectedItems: [],
    collectedValues: [],
    gridItems: [],
    isBidding: false,
    bidAmount: 0,
    bidMultiplier: 1.0,
    roundHistory: [],
    playerCharId: savedCharId,
    countdownTime: 30,
    countdownTimer: null,
    isCountdownActive: false,
    exhibitionSlots: 3,
    exhibitionItems: [],
    exhibitionIncome: 0,
    exhibitionTotalEarned: 0,
    hasSecurityGuard: false,
    hasInsurance: false
  };

  applyCharacterUI(savedCharId);
  resetGameUI();
  addLog('system', '🎮 第 ' + newGameNumber + ' 局开始！携带资金 ¥' + carriedMoney.toLocaleString());
  openLobby();
}

function restartGame() {
  document.getElementById('settleModal').classList.remove('show');

  var savedCharId = gameState.playerCharId || 'ethan';
  stopCountdown();

  gameState = {
    currentRound: 1,
    maxRounds: 5,
    gameNumber: 1,
    money: INITIAL_MONEY,
    aiMoney: INITIAL_AI_MONEY.slice(),
    hafCoins: 0,
    collectedItems: [],
    collectedValues: [],
    gridItems: [],
    isBidding: false,
    bidAmount: 0,
    bidMultiplier: 1.0,
    roundHistory: [],
    playerCharId: savedCharId,
    countdownTime: 30,
    countdownTimer: null,
    isCountdownActive: false,
    exhibitionSlots: 3,
    exhibitionItems: [],
    exhibitionIncome: 0,
    exhibitionTotalEarned: 0,
    hasSecurityGuard: false,
    hasInsurance: false
  };

  applyCharacterUI(savedCharId);
  resetGameUI();
  addLog('system', '🔄 游戏已重置，新的一局开始！');
  openLobby();
}

function applyCharacterUI(savedCharId) {
  var ch = characterData.find(function(c) { return c.id === savedCharId; }) || characterData[0];
  document.querySelector('[data-player="me"] .avatar-frame img').src = ch.img;
  document.querySelector('[data-player="me"] .player-name').textContent = ch.name + ' (你)';
  document.getElementById('charBtnAvatar').src = ch.img;
}

function resetGameUI() {
  document.getElementById('bidDisplay').textContent = '输入金额...';
  document.getElementById('bidDisplay').style.color = '#ffd700';
  document.getElementById('multiplierInput').value = '1.0';
  document.getElementById('multiplierResult').textContent = '= ¥ 0';
  document.querySelectorAll('.multiplier-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-multiplier') === '1.0');
  });
  document.getElementById('topPrice').textContent = '0';
  document.getElementById('topBidder').textContent = '';
  document.getElementById('btnConfirm').disabled = false;
  document.getElementById('myMoney').textContent = gameState.money.toLocaleString();
  document.getElementById('ai1Money').textContent = INITIAL_AI_MONEY[0].toLocaleString();
  document.getElementById('ai2Money').textContent = INITIAL_AI_MONEY[1].toLocaleString();
  document.getElementById('ai3Money').textContent = INITIAL_AI_MONEY[2].toLocaleString();
  updateHafCoinsUI();
  updateUI();

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
}

function initKeyboardListeners() {
  document.addEventListener('keydown', function(e) {
    var startScreen = document.getElementById('startScreen');
    if (startScreen && startScreen.style.display !== 'none' && !startScreen.classList.contains('exit')) return;
    if (document.getElementById('startCharOverlay').classList.contains('show')) return;
    if (document.getElementById('shopOverlay').classList.contains('show')) return;
    if (document.getElementById('warehouseOverlay').classList.contains('show')) return;
    if (document.getElementById('confirmOverlay').classList.contains('show')) return;
    if (document.getElementById('charOverlay').classList.contains('show')) return;
    if (document.getElementById('mapOverlay').classList.contains('show')) return;
    if (document.getElementById('exhibitionOverlay').classList.contains('show')) return;
    if (document.getElementById('settleModal').classList.contains('show')) return;
    if (document.getElementById('numpadOverlay').classList.contains('show')) return;
    if (document.getElementById('blackMarketOverlay').classList.contains('show')) return;
    if (document.getElementById('randomEventOverlay').classList.contains('show')) return;
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
  initExhibitionListeners();
  initKeyboardListeners();
  initWarehouseListeners();

  init();
  initStartScreen();
};
