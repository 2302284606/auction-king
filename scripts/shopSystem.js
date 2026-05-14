function openShop() {
  document.getElementById('shopOverlay').classList.add('show');
  renderShopItems();
  renderShopInventory();
  document.getElementById('shopHafCoins').textContent = gameState.hafCoins.toLocaleString();
}

function closeShop() {
  document.getElementById('shopOverlay').classList.remove('show');
}

function renderShopItems() {
  var container = document.getElementById('shopItems');
  container.innerHTML = '';
  var usedCount = 0;
  if (playerItems.me) {
    playerItems.me.forEach(function(it) { if (it.used) usedCount++; });
  }
  SHOP_ITEMS.forEach(function(si) {
    var div = document.createElement('div');
    div.className = 'shop-item';
    div.innerHTML = '<div class="shop-item-icon">' + si.icon + '</div>'
      + '<div class="shop-item-info">'
      + '<div class="shop-item-name">' + si.name + '</div>'
      + '<div class="shop-item-desc">' + si.desc + '</div>'
      + '<div class="shop-item-price">🪙 ' + si.price + ' 哈夫币</div>'
      + '</div>'
      + '<button class="shop-buy-btn' + (usedCount === 0 ? ' owned' : '') + '" '
      + (gameState.hafCoins < si.price || usedCount === 0 ? 'disabled' : '')
      + '>' + (usedCount === 0 ? '无空位' : '购买') + '</button>';
    var btn = div.querySelector('.shop-buy-btn');
    if (usedCount > 0 && gameState.hafCoins >= si.price) {
      btn.addEventListener('click', (function(item) {
        return function() { buyShopItem(item); };
      })(si));
    }
    container.appendChild(div);
  });
}

function renderShopInventory() {
  var container = document.getElementById('shopInvSlots');
  container.innerHTML = '';
  if (!playerItems.me) return;
  playerItems.me.forEach(function(item, idx) {
    var type = ITEM_TYPES.find(function(t) { return t.id === item.type; });
    var slot = document.createElement('div');
    slot.className = 'shop-inv-slot' + (item.used ? '' : ' filled');
    slot.innerHTML = (item.used ? '<span style="color:#333">-</span>' : type.icon) + '<span class="inv-num">' + (idx + 1) + '</span>';
    container.appendChild(slot);
  });
}

function buyShopItem(shopItem) {
  if (gameState.hafCoins < shopItem.price) return;
  if (!playerItems.me) return;
  var replaceIdx = -1;
  for (var i = 0; i < playerItems.me.length; i++) {
    if (playerItems.me[i].used) { replaceIdx = i; break; }
  }
  if (replaceIdx === -1) return;
  gameState.hafCoins -= shopItem.price;
  playerItems.me[replaceIdx] = { type: shopItem.type, used: false };
  playReveal('normal');
  addLog('system', '🛒 在商城购买了 ' + shopItem.name + '（剩余哈夫币：' + gameState.hafCoins + '）');
  updateHafCoinsUI();
  renderPlayerItems('me');
  renderShopItems();
  renderShopInventory();
  document.getElementById('shopHafCoins').textContent = gameState.hafCoins.toLocaleString();
}

function initShopListeners() {
  document.getElementById('shopEntryBtn').addEventListener('click', function() {
    openShop();
  });

  document.getElementById('shopOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeShop();
  });

  document.getElementById('shopClose').addEventListener('click', function() {
    closeShop();
  });
}
