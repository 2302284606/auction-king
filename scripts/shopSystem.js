var shopActiveCat = 'all';

function openShop() {
  document.getElementById('shopOverlay').classList.add('show');
  shopActiveCat = 'all';
  renderShopTabs();
  renderShopFeatured();
  renderShopItems();
  renderShopInventory();
  updateShopBalance();
}

function closeShop() {
  document.getElementById('shopOverlay').classList.remove('show');
}

function updateShopBalance() {
  document.getElementById('shopHafCoins').textContent = gameState.hafCoins.toLocaleString();
  var usedCount = 0;
  if (playerItems.me) {
    playerItems.me.forEach(function(it) { if (!it.used) usedCount++; });
  }
  document.getElementById('shopSlotCount').textContent = usedCount;
}

function getShopUsedCount() {
  var count = 0;
  if (playerItems.me) {
    playerItems.me.forEach(function(it) { if (it.used) count++; });
  }
  return count;
}

function getShopItemCount() {
  if (!playerItems.me) return 0;
  return playerItems.me.length;
}

function renderShopTabs() {
  var container = document.getElementById('shopTabs');
  container.innerHTML = '';
  SHOP_CATEGORIES.forEach(function(cat) {
    var count = cat.id === 'all' ? SHOP_ITEMS.length : SHOP_ITEMS.filter(function(si) { return si.cat === cat.id; }).length;
    var tab = document.createElement('div');
    tab.className = 'shop-tab' + (shopActiveCat === cat.id ? ' active' : '');
    tab.innerHTML = '<span class="tab-icon">' + cat.icon + '</span>' + cat.name + '<span class="tab-count">' + count + '</span>';
    tab.addEventListener('click', function() {
      shopActiveCat = cat.id;
      renderShopTabs();
      renderShopItems();
    });
    container.appendChild(tab);
  });
}

function renderShopFeatured() {
  var container = document.getElementById('shopFeatured');
  var hotItems = SHOP_ITEMS.filter(function(si) { return si.hot; });
  if (hotItems.length === 0) {
    container.style.display = 'none';
    return;
  }
  container.style.display = '';
  var usedCount = getShopUsedCount();
  var html = '<div class="shop-featured-label"><span class="feat-dot"></span>限时推荐</div>';
  html += '<div class="shop-featured-items">';
  hotItems.forEach(function(si) {
    var canBuy = usedCount > 0 && gameState.hafCoins >= si.price;
    var type = ITEM_TYPES.find(function(t) { return t.id === si.type; });
    var catLabel = si.cat === 'reveal' ? '揭示' : si.cat === 'inspect' ? '透视' : '特殊';
    html += '<div class="shop-item is-hot" style="flex:1;min-width:140px;padding:10px 12px">'
      + '<div class="shop-item-icon">'
      + '<div class="icon-glow" style="background:radial-gradient(circle,rgba(255,215,0,0.08),transparent)"></div>'
      + si.icon
      + '<span class="item-tag tag-hot">热卖</span>'
      + '</div>'
      + '<div class="shop-item-info">'
      + '<div class="shop-item-name-row"><span class="shop-item-name">' + si.name + '</span></div>'
      + '<div class="shop-item-desc">' + si.desc + '</div>'
      + '<div class="shop-item-price-row">'
      + '<span class="shop-item-price"><span class="price-icon">&#x1FA99;</span>' + si.price + '</span>'
      + '<span class="shop-item-type">' + catLabel + '</span>'
      + '</div>'
      + '</div>'
      + '<button class="shop-buy-btn' + (canBuy ? '' : ' owned') + '"'
      + (canBuy ? ' data-shop-type="' + si.type + '"' : ' disabled')
      + '>' + (usedCount === 0 ? '无空位' : '购买') + '</button>'
      + '</div>';
  });
  html += '</div>';
  container.innerHTML = html;
  bindShopBuyButtons(container);
}

function renderShopItems() {
  var container = document.getElementById('shopItems');
  container.innerHTML = '';
  var usedCount = getShopUsedCount();
  var filtered = shopActiveCat === 'all' ? SHOP_ITEMS : SHOP_ITEMS.filter(function(si) { return si.cat === shopActiveCat; });
  if (filtered.length === 0) {
    container.innerHTML = '<div class="shop-empty"><div class="empty-icon">&#x1F6D2;</div><div class="empty-text">该分类暂无商品</div></div>';
    return;
  }
  var nonHot = filtered.filter(function(si) { return !si.hot || shopActiveCat !== 'all'; });
  if (shopActiveCat === 'all') {
    nonHot = filtered.filter(function(si) { return !si.hot; });
  }
  if (nonHot.length === 0 && shopActiveCat !== 'all') {
    nonHot = filtered;
  }
  if (shopActiveCat === 'all' && nonHot.length === 0) {
    container.innerHTML = '<div class="shop-empty"><div class="empty-icon">&#x2728;</div><div class="empty-text">所有商品都在推荐区</div></div>';
    return;
  }
  if (shopActiveCat !== 'all') {
    var sectionLabel = shopActiveCat === 'reveal' ? '揭示类道具' : shopActiveCat === 'inspect' ? '透视类道具' : '特殊类道具';
    var sectionIcon = shopActiveCat === 'reveal' ? '&#x1F50D;' : shopActiveCat === 'inspect' ? '&#x1F441;' : '&#x2728;';
    var sec = document.createElement('div');
    sec.className = 'shop-section-title';
    sec.innerHTML = sectionIcon + ' ' + sectionLabel;
    container.appendChild(sec);
  }
  nonHot.forEach(function(si) {
    var canBuy = usedCount > 0 && gameState.hafCoins >= si.price;
    var catLabel = si.cat === 'reveal' ? '揭示' : si.cat === 'inspect' ? '透视' : '特殊';
    var tagClass = '';
    var tagText = '';
    if (si.tag === '推荐') { tagClass = 'tag-rec'; tagText = '推荐'; }
    else if (si.tag === '进阶') { tagClass = 'tag-adv'; tagText = '进阶'; }
    else if (si.tag === '稀有') { tagClass = 'tag-rare'; tagText = '稀有'; }
    else if (si.tag === '强力') { tagClass = 'tag-power'; tagText = '强力'; }
    var div = document.createElement('div');
    div.className = 'shop-item' + (si.hot ? ' is-hot' : '');
    div.innerHTML = '<div class="shop-item-icon">'
      + '<div class="icon-glow" style="background:radial-gradient(circle,rgba(0,204,255,0.06),transparent)"></div>'
      + si.icon
      + (tagText ? '<span class="item-tag ' + tagClass + '">' + tagText + '</span>' : '')
      + '</div>'
      + '<div class="shop-item-info">'
      + '<div class="shop-item-name-row">'
      + '<span class="shop-item-name">' + si.name + '</span>'
      + '<span class="shop-item-type">' + catLabel + '</span>'
      + '</div>'
      + '<div class="shop-item-desc">' + si.desc + '</div>'
      + '<div class="shop-item-price-row">'
      + '<span class="shop-item-price"><span class="price-icon">&#x1FA99;</span>' + si.price + '</span>'
      + '</div>'
      + '</div>'
      + '<button class="shop-buy-btn' + (canBuy ? '' : ' owned') + '"'
      + (canBuy ? ' data-shop-type="' + si.type + '"' : ' disabled')
      + '>' + (usedCount === 0 ? '无空位' : '购买') + '</button>';
    container.appendChild(div);
  });
  bindShopBuyButtons(container);
}

function bindShopBuyButtons(root) {
  root.querySelectorAll('.shop-buy-btn[data-shop-type]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var typeId = parseInt(this.getAttribute('data-shop-type'));
      var shopItem = SHOP_ITEMS.find(function(si) { return si.type === typeId; });
      if (shopItem) buyShopItem(shopItem, this);
    });
  });
}

function renderShopInventory() {
  var container = document.getElementById('shopInvSlots');
  container.innerHTML = '';
  if (!playerItems.me) return;
  playerItems.me.forEach(function(item, idx) {
    var type = ITEM_TYPES.find(function(t) { return t.id === item.type; });
    var slot = document.createElement('div');
    slot.className = 'shop-inv-slot' + (item.used ? ' used-slot' : ' filled');
    slot.innerHTML = (item.used ? '<span style="color:rgba(255,255,255,0.15)">-</span>' : type.icon)
      + '<span class="inv-num">' + (idx + 1) + '</span>'
      + (item.used ? '' : '<span class="slot-status">' + type.name + '</span>');
    container.appendChild(slot);
  });
}

function buyShopItem(shopItem, btnEl) {
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
  showBuyFeedback('购买成功 ' + shopItem.icon + ' ' + shopItem.name);
  if (btnEl) {
    btnEl.classList.add('buying');
    setTimeout(function() { btnEl.classList.remove('buying'); }, 300);
  }
  updateShopBalance();
  renderShopFeatured();
  renderShopItems();
  renderShopInventory();
}

function showBuyFeedback(text) {
  var el = document.createElement('div');
  el.className = 'shop-buy-feedback';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 700);
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