var warehouseActiveCat = 'all';
var warehouseTooltip = null;

var WAREHOUSE_CATEGORIES = [
  { id: 'all', name: '全部', icon: '🏛' },
  { id: 'gold', name: '金色传说', icon: '✨' },
  { id: 'red', name: '稀有珍品', icon: '💎' },
  { id: 'normal', name: '普通藏品', icon: '📦' }
];

var RARITY_NAMES = {
  normal: '普通藏品',
  gold: '金色传说',
  red: '稀有珍品'
};

function openWarehouse() {
  document.getElementById('warehouseOverlay').classList.add('show');
  warehouseActiveCat = 'all';
  renderWarehouseTabs();
  renderWarehouseStats();
  renderWarehouseItems();
}

function closeWarehouse() {
  document.getElementById('warehouseOverlay').classList.remove('show');
  removeWarehouseTooltip();
}

function renderWarehouseTabs() {
  var container = document.getElementById('warehouseTabs');
  container.innerHTML = '';
  WAREHOUSE_CATEGORIES.forEach(function(cat) {
    var count = getWarehouseCatCount(cat.id);
    var tab = document.createElement('div');
    tab.className = 'warehouse-tab' + (warehouseActiveCat === cat.id ? ' active' : '');
    tab.innerHTML = '<span class="tab-icon">' + cat.icon + '</span>' + cat.name + '<span class="tab-count">' + count + '</span>';
    tab.addEventListener('click', function() {
      warehouseActiveCat = cat.id;
      renderWarehouseTabs();
      renderWarehouseItems();
    });
    container.appendChild(tab);
  });
}

function getWarehouseCatCount(catId) {
  if (catId === 'all') return gameState.collectedItems.length;
  return gameState.collectedItems.filter(function(item) { return item.rarity === catId; }).length;
}

function renderWarehouseStats() {
  var items = gameState.collectedItems;
  var totalCount = items.length;
  var totalValue = 0;
  var goldCount = 0;
  var redCount = 0;
  items.forEach(function(item) {
    totalValue += item.value;
    if (item.rarity === 'gold') goldCount++;
    if (item.rarity === 'red') redCount++;
  });

  document.getElementById('whStatCount').textContent = totalCount;
  document.getElementById('whStatValue').textContent = totalValue.toLocaleString();
  document.getElementById('whStatGold').textContent = goldCount;
  document.getElementById('whStatRed').textContent = redCount;
}

function renderWarehouseItems() {
  var container = document.getElementById('warehouseGrid');
  container.innerHTML = '';
  removeWarehouseTooltip();

  var items = gameState.collectedItems;
  if (items.length === 0) {
    container.innerHTML = '<div class="warehouse-empty" style="grid-column:1/-1">'
      + '<div class="empty-icon">🏛</div>'
      + '<div class="empty-text">仓库空空如也</div>'
      + '<div class="empty-hint">赢得竞拍后，藏品将自动存入个人仓库</div>'
      + '</div>';
    return;
  }

  var filtered = warehouseActiveCat === 'all' ? items : items.filter(function(item) { return item.rarity === warehouseActiveCat; });

  if (filtered.length === 0) {
    container.innerHTML = '<div class="warehouse-empty" style="grid-column:1/-1">'
      + '<div class="empty-icon">' + (warehouseActiveCat === 'gold' ? '✨' : warehouseActiveCat === 'red' ? '💎' : '📦') + '</div>'
      + '<div class="empty-text">暂无此类藏品</div>'
      + '</div>';
    return;
  }

  filtered.forEach(function(item, idx) {
    var cell = document.createElement('div');
    cell.className = 'warehouse-item wh-entering';
    cell.style.animationDelay = (idx * 30) + 'ms';
    if (item.rarity === 'gold') cell.classList.add('wh-rarity-gold');
    else if (item.rarity === 'red') cell.classList.add('wh-rarity-red');

    var img = document.createElement('img');
    img.src = item.src;
    img.alt = '藏品';
    cell.appendChild(img);

    var badge = document.createElement('div');
    badge.className = 'wh-item-badge';
    badge.textContent = '×' + (item.gridSize || 1);
    cell.appendChild(badge);

    var price = document.createElement('div');
    price.className = 'wh-item-price';
    price.textContent = '¥' + item.value.toLocaleString();
    cell.appendChild(price);

    cell.addEventListener('mouseenter', function(e) {
      showWarehouseTooltip(item, e);
    });
    cell.addEventListener('mousemove', function(e) {
      moveWarehouseTooltip(e);
    });
    cell.addEventListener('mouseleave', function() {
      removeWarehouseTooltip();
    });

    container.appendChild(cell);
  });
}

function showWarehouseTooltip(item, e) {
  removeWarehouseTooltip();
  var tip = document.createElement('div');
  tip.className = 'warehouse-tooltip';
  var rarityName = RARITY_NAMES[item.rarity] || '未知';
  var rarityClass = item.rarity === 'gold' ? 'rarity-gold' : item.rarity === 'red' ? 'rarity-red' : '';
  tip.innerHTML = '<div class="tip-name">藏品</div>'
    + '<div class="tip-rarity ' + rarityClass + '">' + rarityName + '</div>'
    + '<div class="tip-value">¥' + item.value.toLocaleString() + '</div>';
  document.body.appendChild(tip);
  warehouseTooltip = tip;
  moveWarehouseTooltip(e);
}

function moveWarehouseTooltip(e) {
  if (!warehouseTooltip) return;
  var x = e.clientX + 16;
  var y = e.clientY - 10;
  if (x + 200 > window.innerWidth) x = e.clientX - 200;
  if (y + 80 > window.innerHeight) y = e.clientY - 80;
  warehouseTooltip.style.left = x + 'px';
  warehouseTooltip.style.top = y + 'px';
}

function removeWarehouseTooltip() {
  if (warehouseTooltip) {
    warehouseTooltip.remove();
    warehouseTooltip = null;
  }
}

function updateWarehouseEntryBadge() {
  var badge = document.getElementById('warehouseCount');
  if (badge) {
    var count = gameState.collectedItems.length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline' : 'none';
  }
}

function initWarehouseListeners() {
  document.getElementById('warehouseEntryBtn').addEventListener('click', function() {
    openWarehouse();
  });

  document.getElementById('warehouseOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeWarehouse();
  });

  document.getElementById('warehouseClose').addEventListener('click', function() {
    closeWarehouse();
  });
}
