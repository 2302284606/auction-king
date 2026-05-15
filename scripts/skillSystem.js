function activateShadowScan() {
  if (gameState.isBidding) return;
  var ch = characterData.find(function(c) { return c.id === gameState.playerCharId; }) || characterData[0];
  addSkillLog(ch.name, '空间残影', '正在探测矩阵中的隐藏结构...');
  var cells = document.querySelectorAll('#previewGrid .wh-cell');
  cells.forEach(function(c) { c.classList.remove('scan-active', 'actuary-active'); c.innerHTML = ''; });
  document.getElementById('scanStatus').textContent = 'SCANNING...';

  setTimeout(function() {
    var shapes = [[0,1,6,7], [0,6,12,13], [0,1,2,3]];
    for (var s = 0; s < 3; s++) {
      var start = Math.floor(Math.random() * 40) + 6;
      var shape = shapes[Math.floor(Math.random() * shapes.length)];
      var item = pickItem();
      shape.forEach(function(offset, idx) {
        if (cells[start + offset]) {
          cells[start + offset].classList.add('scan-active');
          if (idx === 0) {
            var gs = item.gridSize || 1;
            cells[start + offset].innerHTML = '<img src="' + item.src + '" style="width:60%;height:60%;object-fit:contain;opacity:0.6;"><div style="position:absolute;bottom:1px;right:2px;font-size:7px;color:#aaa;">×' + gs + '</div>';
          }
        }
      });
    }
    document.getElementById('scanStatus').textContent = 'LINKED';
  }, 600);
}

function activateActuary(playerName) {
  if (gameState.isBidding) return;
  var cells = document.querySelectorAll('#previewGrid .wh-cell');
  cells.forEach(function(c) { c.classList.remove('actuary-active'); });

  var count = Math.random() > 0.5 ? 4 : 3;
  var startIndex = Math.floor(Math.random() * 50);
  var totalValue = 0;

  for (var i = 0; i < count; i++) {
    var idx = startIndex + i;
    if (cells[idx]) {
      var item = pickItem();
      totalValue += item.value;
      cells[idx].classList.add('actuary-active');
      cells[idx].innerHTML = '<img src="' + item.src + '" style="width:60%;height:60%;object-fit:contain;opacity:0.6;">';
    }
  }

  var avg = Math.round(totalValue / count);
  var pName = playerName || '伊森';
  addSkillLog(pName, '精算流', '分析区域锁定，平均物品价值约 ¥' + avg.toLocaleString());
  document.getElementById('scanStatus').textContent = 'ACTUATING...';
}
