var pendingUseItem = null;

function showUseConfirm(playerId, slotIdx) {
  if (roundItemUsed[playerId]) return;
  var item = playerItems[playerId][slotIdx];
  if (!item || item.used) return;
  var type = ITEM_TYPES.find(function(t) { return t.id === item.type; });
  document.getElementById('confirmIcon').textContent = type.icon;
  document.getElementById('confirmTitle').textContent = '使用 ' + type.name + '？';
  document.getElementById('confirmDesc').textContent = '效果：' + type.desc + '\n确定要使用此物品吗？（每轮只能使用一个物品）';
  pendingUseItem = { playerId: playerId, slotIdx: slotIdx };
  document.getElementById('confirmOverlay').classList.add('show');
  document.getElementById('confirmYes').onclick = function() {
    closeConfirm();
    useItem(playerId, slotIdx);
  };
}

function closeConfirm() {
  document.getElementById('confirmOverlay').classList.remove('show');
  pendingUseItem = null;
}

function initConfirmListeners() {
  document.getElementById('confirmNo').addEventListener('click', function() {
    closeConfirm();
  });
}
