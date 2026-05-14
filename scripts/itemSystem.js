function assignItems() {
  ['me', 'ai1', 'ai2', 'ai3'].forEach(function(pid) {
    playerItems[pid] = [];
    for (var i = 0; i < 5; i++) {
      var typeIdx = Math.floor(Math.random() * ITEM_TYPES.length);
      playerItems[pid].push({ type: ITEM_TYPES[typeIdx].id, used: false });
    }
  });
  roundItemUsed = { me: false, ai1: false, ai2: false, ai3: false };
}

function renderAllPlayerItems() {
  ['me', 'ai1', 'ai2', 'ai3'].forEach(function(pid) { renderPlayerItems(pid); });
}

function renderPlayerItems(playerId) {
  var bar = document.querySelector('.item-bar[data-player="' + playerId + '"]');
  if (!bar) return;
  bar.innerHTML = '';
  if (!playerItems[playerId]) return;
  playerItems[playerId].forEach(function(item, idx) {
    var type = ITEM_TYPES.find(function(t) { return t.id === item.type; });
    var slot = document.createElement('div');
    slot.className = 'item-slot item-type-' + item.type + (item.used ? ' used' : '') + (playerId === 'me' ? ' my-slot' : '');
    slot.innerHTML = '<span class="slot-icon">' + type.icon + '</span><span class="slot-key">' + (idx + 1) + '</span>';
    slot.title = '[' + (idx + 1) + '] ' + type.name + ' - ' + type.desc;
    if (playerId === 'me' && !item.used && !roundItemUsed.me) {
      slot.addEventListener('click', (function(pi, si) {
        return function() { showUseConfirm(pi, si); };
      })(playerId, idx));
    }
    bar.appendChild(slot);
  });
}

function useItem(playerId, slotIdx) {
  if (roundItemUsed[playerId]) return;
  var item = playerItems[playerId][slotIdx];
  if (!item || item.used) return;
  item.used = true;
  roundItemUsed[playerId] = true;
  playReveal('normal');
  if (item.type === 1) {
    revealCellsRarity(3, playerId);
  } else if (item.type === 2) {
    inspectItems(2, playerId);
  } else if (item.type === 3) {
    revealCellsRarity(5, playerId);
  }
  renderPlayerItems(playerId);
}

function revealCellsRarity(count, playerId) {
  var cells = document.querySelectorAll('#previewGrid .wh-cell');
  var indices = [];
  while (indices.length < count) {
    var idx = Math.floor(Math.random() * 60);
    if (indices.indexOf(idx) === -1) indices.push(idx);
  }
  indices.forEach(function(idx) {
    var gridItem = gameState.gridItems[idx];
    var cell = cells[idx];
    if (!cell || !gridItem) return;
    cell.classList.add('scan-reveal-' + gridItem.rarity);
    var label = gridItem.rarity === 'gold' ? '金' : gridItem.rarity === 'red' ? '稀' : '普';
    var color = gridItem.rarity === 'gold' ? '#ffd700' : gridItem.rarity === 'red' ? '#ff3333' : '#555';
    cell.innerHTML = '<div style="font-size:9px;color:' + color + ';text-align:center;font-weight:700;">' + label + '</div>';
  });
  var name = getPlayerName(playerId);
  addSkillLog(name, '品质扫描', '揭示了 ' + count + ' 个格子的品质');
}

function inspectItems(count, playerId) {
  var items = [];
  for (var i = 0; i < count; i++) items.push(pickItem());
  if (playerId === 'me') {
    var names = items.map(function(item) {
      var rn = item.rarity === 'gold' ? '🟡金色' : item.rarity === 'red' ? '🔴稀有' : '⚪普通';
      return rn + ' ¥' + item.value.toLocaleString();
    });
    addSkillLog(getPlayerName(playerId), '透视抽检', '发现 ' + count + ' 件：' + names.join('、'));
  }
}

function aiUseItem(playerId) {
  if (roundItemUsed[playerId]) return;
  if (!playerItems[playerId]) return;
  var available = playerItems[playerId].filter(function(i) { return !i.used; });
  if (available.length === 0) return;
  var pick = available[Math.floor(Math.random() * available.length)];
  pick.used = true;
  roundItemUsed[playerId] = true;
  renderPlayerItems(playerId);
}

function clearScanReveals() {
  document.querySelectorAll('#previewGrid .wh-cell').forEach(function(c) {
    c.classList.remove('scan-reveal-gold', 'scan-reveal-red', 'scan-reveal-normal');
    var inner = c.querySelector('div');
    if (inner) c.innerHTML = '';
  });
}
