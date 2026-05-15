function openExhibition() {
  document.getElementById('exhibitionOverlay').classList.add('show');
  renderExhibition();
}

function closeExhibition() {
  document.getElementById('exhibitionOverlay').classList.remove('show');
}

function renderExhibition() {
  renderExhibitionStats();
  renderExhibitionSlots();
  renderExhibitionCollection();
  renderExhibitionFooter();
}

function renderExhibitionStats() {
  var totalIncome = calcTotalExhibitionIncome();
  document.getElementById('exhibitionRoundIncome').textContent = totalIncome.toLocaleString();
  document.getElementById('exhibitionTotalEarned').textContent = gameState.exhibitionTotalEarned.toLocaleString();
  document.getElementById('exhibitionItemCount').textContent = gameState.exhibitionItems.length + ' / ' + gameState.exhibitionSlots;
}

function calcTotalExhibitionIncome() {
  var base = 0;
  gameState.exhibitionItems.forEach(function(item) {
    base += calcExhibitionIncome(item);
  });
  var bonus = calcExhibitionBonus(gameState.exhibitionItems);
  return base + bonus;
}

function renderExhibitionSlots() {
  var container = document.getElementById('exhibitionSlots');
  container.innerHTML = '';
  for (var i = 0; i < gameState.exhibitionSlots; i++) {
    var slot = document.createElement('div');
    slot.className = 'exhibition-slot';
    if (i < gameState.exhibitionItems.length) {
      var item = gameState.exhibitionItems[i];
      slot.classList.add('filled');
      var rarityClass = 'rarity-' + item.rarity;
      var income = calcExhibitionIncome(item);
      slot.innerHTML = '<img class="slot-item-img" src="' + item.src + '" alt="藏品">'
        + '<span class="slot-item-rarity ' + rarityClass + '">' + (item.rarity === 'gold' ? '金' : item.rarity === 'red' ? '稀' : '普') + '</span>'
        + '<span class="slot-income">+' + income.toLocaleString() + '/轮</span>'
        + '<button class="slot-remove" data-slot="' + i + '">&times;</button>';
    } else if (i < 3) {
      slot.innerHTML = '<div class="slot-empty-icon">🏛️</div><div class="slot-empty-text">空展位</div>';
    } else {
      slot.classList.add('locked');
      slot.innerHTML = '<div class="slot-lock-icon">🔒</div><div class="slot-lock-text">锁定展位</div><div class="slot-lock-cost">💰 ' + EXHIBITION_SLOT_COST + ' 哈夫币解锁</div>';
      slot.addEventListener('click', (function(idx) {
        return function() { unlockExhibitionSlot(idx); };
      })(i));
    }
    container.appendChild(slot);
  }

  container.querySelectorAll('.slot-remove').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var slotIdx = parseInt(this.getAttribute('data-slot'));
      removeFromExhibition(slotIdx);
    });
  });
}

function renderExhibitionCollection() {
  var container = document.getElementById('exhibitionCollection');
  container.innerHTML = '';
  if (gameState.collectedItems.length === 0) {
    container.innerHTML = '<div class="exhibition-collection-empty"><div class="empty-icon">📦</div><div class="empty-text">暂无藏品，赢得竞拍后可在此展出</div></div>';
    return;
  }
  var grid = document.createElement('div');
  grid.className = 'exhibition-collection-grid';
  gameState.collectedItems.forEach(function(item, idx) {
    var isExhibited = false;
    for (var j = 0; j < gameState.exhibitionItems.length; j++) {
      if (gameState.exhibitionItems[j] === item) { isExhibited = true; break; }
    }
    var div = document.createElement('div');
    div.className = 'exhibition-col-item' + (isExhibited ? ' exhibited' : '');
    var rarityDot = 'rarity-' + item.rarity;
    div.innerHTML = '<div class="col-item-rarity ' + rarityDot + '"></div>'
      + '<img src="' + item.src + '" alt="藏品">'
      + '<div class="col-item-value">¥' + item.value.toLocaleString() + '</div>'
      + (isExhibited ? '<div class="col-exhibit-badge">展出中</div>' : '');
    if (!isExhibited && gameState.exhibitionItems.length < gameState.exhibitionSlots) {
      div.addEventListener('click', function() {
        addToExhibition(idx);
      });
    }
    grid.appendChild(div);
  });
  container.appendChild(grid);
}

function renderExhibitionFooter() {
  var totalIncome = calcTotalExhibitionIncome();
  var collectBtn = document.getElementById('exhibitionCollectBtn');
  if (totalIncome > 0) {
    collectBtn.disabled = false;
    collectBtn.textContent = '💰 收取收入 (+' + totalIncome.toLocaleString() + ' 哈夫币)';
  } else {
    collectBtn.disabled = true;
    collectBtn.textContent = '💰 收取收入 (+0)';
  }
  var expandBtn = document.getElementById('exhibitionExpandBtn');
  if (gameState.exhibitionSlots >= EXHIBITION_MAX_SLOTS) {
    expandBtn.disabled = true;
    expandBtn.textContent = '已满';
  } else {
    expandBtn.disabled = gameState.hafCoins < EXHIBITION_SLOT_COST;
    expandBtn.textContent = '🔓 解锁展位 (' + EXHIBITION_SLOT_COST + '币)';
  }
  var remainEl = document.getElementById('exhibitionRemainInfo');
  if (remainEl) {
    remainEl.innerHTML = '藏品 ' + gameState.collectedItems.length + ' 件<br>展出 ' + gameState.exhibitionItems.length + ' 件';
  }
}

function addToExhibition(collectionIdx) {
  if (gameState.exhibitionItems.length >= gameState.exhibitionSlots) {
    showExhibitionToast('展位已满！解锁更多展位');
    return;
  }
  var item = gameState.collectedItems[collectionIdx];
  if (!item) return;
  var alreadyExhibited = false;
  for (var j = 0; j < gameState.exhibitionItems.length; j++) {
    if (gameState.exhibitionItems[j] === item) { alreadyExhibited = true; break; }
  }
  if (alreadyExhibited) return;

  gameState.exhibitionItems.push(item);
  playReveal(item.rarity);
  addLog('system', '🏛️ 将 ' + (item.rarity === 'gold' ? '金色' : item.rarity === 'red' ? '稀有' : '普通') + ' 藏品放入展厅（每轮收入 +' + calcExhibitionIncome(item).toLocaleString() + ' 哈夫币）');
  showExhibitionToast('藏品已放入展厅！');
  renderExhibition();
}

function removeFromExhibition(slotIdx) {
  if (slotIdx >= gameState.exhibitionItems.length) return;
  var removed = gameState.exhibitionItems.splice(slotIdx, 1)[0];
  addLog('system', '🏛️ 从展厅取出了一件藏品');
  renderExhibition();
}

function collectExhibitionIncome() {
  var income = calcTotalExhibitionIncome();
  if (income <= 0) return;
  gameState.hafCoins += income;
  gameState.exhibitionTotalEarned += income;
  gameState.exhibitionIncome += income;
  playCoins();
  addLog('system', '💰 收取展厅收入 +' + income.toLocaleString() + ' 哈夫币');
  showExhibitionToast('收入 +' + income.toLocaleString() + ' 哈夫币！');
  updateHafCoinsUI();
  renderExhibition();
}

function collectExhibitionIncomeSilent() {
  var income = calcTotalExhibitionIncome();
  if (income <= 0) return;
  gameState.hafCoins += income;
  gameState.exhibitionTotalEarned += income;
  gameState.exhibitionIncome += income;
  updateHafCoinsUI();
  return income;
}

function unlockExhibitionSlot(slotIdx) {
  if (gameState.exhibitionSlots >= EXHIBITION_MAX_SLOTS) return;
  if (gameState.hafCoins < EXHIBITION_SLOT_COST) {
    showExhibitionToast('哈夫币不足！');
    return;
  }
  gameState.hafCoins -= EXHIBITION_SLOT_COST;
  gameState.exhibitionSlots++;
  playCoins();
  addLog('system', '🏛️ 解锁了新展位！当前可用 ' + gameState.exhibitionSlots + ' 个展位');
  showExhibitionToast('新展位已解锁！');
  updateHafCoinsUI();
  renderExhibition();
}

function showExhibitionToast(text) {
  var el = document.createElement('div');
  el.className = 'exhibition-toast';
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(function() { el.remove(); }, 700);
}

function updateExhibitionEntryUI() {
  var entryEl = document.getElementById('exhibitionEntryBtn');
  if (!entryEl) return;
  var count = gameState.exhibitionItems.length;
  var income = calcTotalExhibitionIncome();
  if (count > 0) {
    entryEl.innerHTML = '🏛️ 展出中 ' + count + '<span style="font-size:10px;color:rgba(255,215,0,0.5)"> +' + income + '/轮</span>';
  } else {
    entryEl.innerHTML = '🏛️ 藏品展出';
  }
}

function initExhibitionListeners() {
  document.getElementById('exhibitionEntryBtn').addEventListener('click', function() {
    openExhibition();
  });
  document.getElementById('exhibitionOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeExhibition();
  });
  document.getElementById('exhibitionClose').addEventListener('click', function() {
    closeExhibition();
  });
  document.getElementById('exhibitionCollectBtn').addEventListener('click', function() {
    collectExhibitionIncome();
  });
  document.getElementById('exhibitionExpandBtn').addEventListener('click', function() {
    var nextSlot = gameState.exhibitionSlots;
    unlockExhibitionSlot(nextSlot);
  });
}