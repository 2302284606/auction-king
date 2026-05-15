var blackMarketSystem = (function() {
  var currentTab = 'buy';
  var hoveredIdx = -1;

  function open() {
    currentTab = 'buy';
    hoveredIdx = -1;
    render();
    var overlay = document.getElementById('blackMarketOverlay');
    if (overlay) overlay.classList.add('show');
  }

  function close() {
    var overlay = document.getElementById('blackMarketOverlay');
    if (overlay) overlay.classList.remove('show');
  }

  function switchTab(tab) {
    currentTab = tab;
    hoveredIdx = -1;
    render();
  }

  function render() {
    var overlay = document.getElementById('blackMarketOverlay');
    if (!overlay) return;

    var haf = gameState.hafCoins;
    var money = gameState.money;

    var html = '<div class="bm-modal">';
    html += '<div class="bm-header">';
    html += '<div class="bm-title-row">';
    html += '<div class="bm-title">🌑 黑市</div>';
    html += '<button class="bm-close" id="bmCloseBtn">✕</button>';
    html += '</div>';
    html += '<div class="bm-tabs">';
    html += '<button class="bm-tab' + (currentTab === 'buy' ? ' active' : '') + '" data-tab="buy">买入道具</button>';
    html += '<button class="bm-tab' + (currentTab === 'sell' ? ' active' : '') + '" data-tab="sell">卖出藏品</button>';
    html += '</div>';
    html += '<div class="bm-currency-bar">';
    html += '<div class="bm-currency-item">';
    html += '<span class="bm-currency-icon">🪙</span>';
    html += '<span>' + haf.toLocaleString() + '</span>';
    html += '</div>';
    html += '<div class="bm-currency-item">';
    html += '<span class="bm-currency-icon">💰</span>';
    html += '<span>¥' + money.toLocaleString() + '</span>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    html += '<div class="bm-body">';

    if (currentTab === 'buy') {
      html += renderBuyTab(haf);
    } else {
      html += renderSellTab();
    }

    html += '</div>';
    html += '</div>';

    overlay.innerHTML = html;
    bindEvents();
  }

  function renderBuyTab(haf) {
    var html = '<div class="bm-items">';
    BLACK_MARKET_ITEMS.forEach(function(item) {
      var canBuy = haf >= item.price;
      var priceLabel = item.price + ' 🪙';
      html += '<div class="bm-item' + (canBuy ? '' : ' disabled') + '" data-id="' + item.id + '">';
      html += '<div class="bm-item-left">';
      html += '<div class="bm-item-icon">' + item.icon + '</div>';
      html += '<div class="bm-item-info">';
      html += '<div class="bm-item-name">' + item.name + '</div>';
      html += '<div class="bm-item-desc">' + item.desc + '</div>';
      html += '</div>';
      html += '</div>';
      html += '<div class="bm-item-right">';
      html += '<div class="bm-item-price' + (canBuy ? '' : ' insufficient') + '">' + priceLabel + '</div>';
      html += '<button class="btn btn-sm bm-buy-btn" data-id="' + item.id + '"' + (canBuy ? '' : ' disabled') + '>购买</button>';
      html += '</div>';
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderSellTab() {
    var items = gameState.collectedItems;
    if (items.length === 0) {
      return '<div class="bm-empty"><div class="bm-empty-icon">📦</div><div class="bm-empty-text">暂无藏品可出售</div></div>';
    }

    var html = '<div class="bm-sell-hint">点击藏品出售，回收价为估值的' + Math.floor(BLACK_MARKET_SELL_RATE * 100) + '%</div>';
    html += '<div class="bm-sell-grid">';

    items.forEach(function(item, idx) {
      var sellPrice = Math.floor(item.value * BLACK_MARKET_SELL_RATE);
      var rarityLabel = item.rarity === 'gold' ? '金色' : item.rarity === 'red' ? '红色' : '普通';
      var rarityColor = item.rarity === 'gold' ? '#FFD700' : item.rarity === 'red' ? '#FF4500' : '#4FC3F7';
      var isHovered = hoveredIdx === idx;

      html += '<div class="bm-sell-item' + (isHovered ? ' hovered' : '') + '" data-idx="' + idx + '">';
      html += '<div class="bm-sell-item-img">';
      html += '<img src="' + item.src + '" alt="藏品">';
      html += '<div class="bm-sell-rarity" style="background:' + rarityColor + '">' + rarityLabel + '</div>';
      html += '</div>';
      html += '<div class="bm-sell-item-info">';
      html += '<div class="bm-sell-item-name">' + randomEventSystem.getItemName(item) + '</div>';
      html += '<div class="bm-sell-item-value">估值 ¥' + item.value.toLocaleString() + '</div>';
      html += '<div class="bm-sell-item-price">回收 ¥' + sellPrice.toLocaleString() + '</div>';
      html += '</div>';
      html += '<button class="btn btn-sm bm-sell-btn" data-idx="' + idx + '">出售</button>';
      html += '</div>';
    });

    html += '</div>';
    return html;
  }

  function bindEvents() {
    var closeBtn = document.getElementById('bmCloseBtn');
    if (closeBtn) {
      closeBtn.onclick = function() { close(); };
    }

    var tabs = document.querySelectorAll('.bm-tab');
    tabs.forEach(function(tab) {
      tab.onclick = function() {
        switchTab(tab.getAttribute('data-tab'));
      };
    });

    var buyBtns = document.querySelectorAll('.bm-buy-btn');
    buyBtns.forEach(function(btn) {
      btn.onclick = function(e) {
        e.stopPropagation();
        buyItem(btn.getAttribute('data-id'));
      };
    });

    var sellBtns = document.querySelectorAll('.bm-sell-btn');
    sellBtns.forEach(function(btn) {
      btn.onclick = function(e) {
        e.stopPropagation();
        sellItem(parseInt(btn.getAttribute('data-idx')));
      };
    });

    var sellItems = document.querySelectorAll('.bm-sell-item');
    sellItems.forEach(function(el) {
      el.onmouseenter = function() {
        hoveredIdx = parseInt(el.getAttribute('data-idx'));
        var idx = hoveredIdx;
        var item = gameState.collectedItems[idx];
        if (item) {
          var rect = el.getBoundingClientRect();
          var preview = document.getElementById('previewPopup');
          if (preview) {
            var previewImg = preview.querySelector('.preview-popup-img');
            var previewInfo = preview.querySelector('.preview-popup-info');
            if (previewImg) {
              previewImg.innerHTML = '<img src="' + item.src + '" alt="藏品" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">';
            }
            if (previewInfo) {
              var rarityLabel = item.rarity === 'gold' ? '金色' : item.rarity === 'red' ? '红色' : '普通';
              previewInfo.innerHTML =
                '<div class="preview-rarity ' + item.rarity + '">' + rarityLabel + '</div>' +
                '<div class="preview-name">' + randomEventSystem.getItemName(item) + '</div>' +
                '<div class="preview-value">估值：¥' + item.value.toLocaleString() + '</div>' +
                '<div class="preview-sell">回收价：¥' + Math.floor(item.value * BLACK_MARKET_SELL_RATE).toLocaleString() + '</div>';
            }
            preview.style.left = (rect.right + 16) + 'px';
            preview.style.top = Math.max(10, Math.min(rect.top - 60, window.innerHeight - 260)) + 'px';
            preview.classList.add('show');
          }
        }
      };
      el.onmouseleave = function() {
        hoveredIdx = -1;
        var preview = document.getElementById('previewPopup');
        if (preview) preview.classList.remove('show');
      };
    });
  }

  function buyItem(itemId) {
    var item = BLACK_MARKET_ITEMS.find(function(i) { return i.id === itemId; });
    if (!item) return;
    if (gameState.hafCoins < item.price) {
      showFloatingMessage('哈夫币不足！', 'error');
      return;
    }

    gameState.hafCoins -= item.price;

    if (item.type === 'emergency') {
      gameState.money += 500000;
      showFloatingMessage('获得 ¥500,000 紧急资金！', 'success');
    } else if (item.type === 'fund') {
      gameState.money += 200000;
      showFloatingMessage('获得 ¥200,000 资助！', 'success');
    } else {
      if (!playerItems[gameState.playerCharId]) {
        playerItems[gameState.playerCharId] = [];
      }
      playerItems[gameState.playerCharId].push({ type: item.type });
      showFloatingMessage('购买了 ' + item.name + '！', 'success');
    }

    render();
  }

  function sellItem(idx) {
    var item = gameState.collectedItems[idx];
    if (!item) return;

    var sellPrice = Math.floor(item.value * BLACK_MARKET_SELL_RATE);
    gameState.collectedItems.splice(idx, 1);
    gameState.collectedValues.splice(idx, 1);
    gameState.money += sellPrice;

    showFloatingMessage('出售成功！获得 ¥' + sellPrice.toLocaleString(), 'success');
    render();
  }

  return {
    open: open,
    close: close,
    render: render
  };
})();
