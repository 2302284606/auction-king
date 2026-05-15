function rollNumber(el, target, prefix, suffix, duration) {
  prefix = prefix || '';
  suffix = suffix || '';
  duration = duration || 800;
  var start = performance.now();
  function tick(now) {
    var progress = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    var current = Math.round(target * eased);
    el.textContent = prefix + current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function resolveAuction(allBids) {
  var round = gameState.currentRound;
  var rule = ROUND_RULES[round - 1];
  var winner = allBids[0];
  var second = allBids[1];

  var conditionMet = false;
  if (rule.special) {
    conditionMet = true;
  } else {
    conditionMet = winner.val >= second.val * rule.threshold;
  }

  if (!conditionMet) {
    addLog('system', '⚠️ 未达到成交条件：' + rule.label);
    addLog('system', '第一名 ¥' + winner.val.toLocaleString() + ' < 第二名 ¥' + second.val.toLocaleString() + ' × ' + rule.threshold);
    addLog('system', '➡ 进入第 ' + (round + 1) + ' 轮...');

    resetBidUI();

    setTimeout(function() {
      gameState.currentRound++;
      initRound(gameState.currentRound);
    }, 2200);
    return;
  }

  var dealPrice;
  if (rule.special) {
    dealPrice = second.val + 1;
  } else {
    dealPrice = Math.floor(second.val * rule.threshold);
  }

  var isMeWin = winner.isMe;

  addLog('system', '🏆 ' + winner.name + ' 获胜！成交价：¥' + dealPrice.toLocaleString());

  var itemCount = 20;
  var items = [];
  var totalVal = 0;
  for (var i = 0; i < itemCount; i++) {
    var item = pickItem();
    items.push(item);
    totalVal += item.value;
  }

  if (isMeWin) {
    gameState.money -= dealPrice;
    var hafEarned = Math.max(0, Math.floor((totalVal - dealPrice) / 1000));
    gameState.hafCoins += hafEarned;
    document.getElementById('myStatus').textContent = '赢得竞拍！-¥' + dealPrice.toLocaleString();
    if (hafEarned > 0) {
      addLog('system', '💰 获得 ' + hafEarned + ' 哈夫币（拍卖利润转化）');
    }
    updateHafCoinsUI();
    playDealSound();
  } else {
    var aiIdx = winner.idx;
    if (aiIdx !== undefined) {
      gameState.aiMoney[aiIdx] -= dealPrice;
      document.getElementById(aiIdx === 0 ? 'ai1Money' : aiIdx === 1 ? 'ai2Money' : 'ai3Money').textContent = gameState.aiMoney[aiIdx].toLocaleString();
    }
    playFail();
  }

  document.querySelectorAll('.player-card').forEach(function(c) { c.classList.remove('winner-card', 'loser-card'); });
  if (isMeWin) {
    document.querySelector('[data-player="me"]').classList.add('winner-card');
  } else {
    var map = { 0: 'ai1', 1: 'ai2', 2: 'ai3' };
    var sel = map[winner.idx];
    if (sel) document.querySelector('[data-player="' + sel + '"]').classList.add('winner-card');
    document.querySelector('[data-player="me"]').classList.add('loser-card');
  }

  document.getElementById('myMoney').textContent = gameState.money.toLocaleString();

  if (isMeWin) {
    gameState.collectedItems.push.apply(gameState.collectedItems, items);
    gameState.collectedValues.push.apply(gameState.collectedValues, items.map(function(i) { return i.value; }));
    updateWarehouseEntryBadge();
  }

  showSettlement(winner, dealPrice, items, totalVal, isMeWin, round);
}

function showSettlement(winner, dealPrice, items, totalVal, isMeWin, round) {
  var modal = document.getElementById('settleModal');
  modal.classList.add('show');

  document.getElementById('settleCost').textContent = '¥ ' + dealPrice.toLocaleString();
  document.getElementById('settleTotalVal').textContent = '¥ ' + totalVal.toLocaleString();

  var profit = totalVal - dealPrice;
  var profitEl = document.getElementById('settleProfit');
  var labelEl = document.getElementById('settleProfitLabel');
  var titleEl = document.getElementById('settleTitle');

  if (isMeWin) {
    titleEl.textContent = '🎉 竞拍成功';
    titleEl.style.color = 'var(--cyber-neon-green)';
    if (profit >= 0) {
      labelEl.innerHTML = '🔥 利润';
      profitEl.className = 'profit-number green';
      rollNumber(profitEl, profit, '+¥ ');
    } else {
      labelEl.innerHTML = '💔 亏损';
      profitEl.className = 'profit-number red';
      rollNumber(profitEl, Math.abs(profit), '-¥ ');
    }
  } else {
    titleEl.textContent = '😔 竞拍失败';
    titleEl.style.color = 'var(--cyber-hot)';
    labelEl.innerHTML = '对方所得';
    profitEl.className = 'profit-number red';
    rollNumber(profitEl, profit, '¥ ');
  }

  document.getElementById('settleFooter').textContent = '🪙 ' + totalVal.toLocaleString();

  var total = gameState.collectedItems.length;
  document.getElementById('scanStatus').textContent = total + ' / 20';

  // 展出收入信息
  var exhibitionHint = '';
  if (gameState.exhibitionItems.length > 0) {
    var ei = calcTotalExhibitionIncome();
    exhibitionHint = '<div style="margin-top:12px;padding:10px;background:rgba(255,215,0,0.03);border:1px solid rgba(255,215,0,0.1);border-radius:2px;text-align:center"><div style="color:rgba(255,215,0,0.5);font-size:11px;letter-spacing:1px;margin-bottom:4px">🏛️ 藏品展出</div><div style="color:var(--cyber-gold);font-size:14px;font-weight:700">当前展厅每轮收入 +<span style="color:var(--cyber-neon-green)">' + ei.toLocaleString() + '</span> 哈夫币</div><div style="color:rgba(255,255,255,0.2);font-size:10px;margin-top:4px">点击左上角 🏛️ 按钮管理展厅</div></div>';
  } else if (gameState.collectedItems.length > 0) {
    exhibitionHint = '<div style="margin-top:12px;padding:10px;background:rgba(255,215,0,0.03);border:1px solid rgba(255,215,0,0.1);border-radius:2px;text-align:center"><div style="color:rgba(255,215,0,0.5);font-size:11px;letter-spacing:1px;margin-bottom:4px">💡 提示</div><div style="color:rgba(255,255,255,0.4);font-size:12px">将藏品放入展厅可以每轮赚取哈夫币！</div><div style="color:rgba(255,255,255,0.2);font-size:10px;margin-top:4px">点击左上角 🏛️ 藏品展出</div></div>';
  }

  var grid = document.getElementById('settleGrid');
  grid.innerHTML = '';
  var cells = [];

  items.forEach(function(item) {
    var cell = document.createElement('div');
    cell.className = 'settle-cell';
    var gs = item.gridSize || 1;
    cell.style.gridColumn = 'span ' + gs;
    cell.style.aspectRatio = gs + ' / 1';

    var loader = document.createElement('div');
    loader.className = 'circle-loader';
    var R = 14;
    var C = 2 * Math.PI * R;
    loader.innerHTML = '<svg viewBox="0 0 36 36"><circle class="bg-ring" cx="18" cy="18" r="' + R + '"/><circle class="trace-ring" cx="18" cy="18" r="' + R + '" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '" style="transform:rotate(-90deg);transform-origin:center;"/></svg>';
    cell.appendChild(loader);

    var img = document.createElement('img');
    img.src = item.src;
    img.alt = '藏品';
    cell.appendChild(img);

    var badge = document.createElement('div');
    badge.className = 'grid-size-badge';
    badge.textContent = '×' + gs;
    cell.appendChild(badge);

    var priceTag = document.createElement('div');
    priceTag.className = 'item-price-tag';
    priceTag.textContent = '¥' + item.value.toLocaleString();
    cell.appendChild(priceTag);

    if (item.rarity === 'gold') cell.classList.add('rarity-gold');
    else if (item.rarity === 'red') cell.classList.add('rarity-red');

    grid.appendChild(cell);
    cells.push({ cell: cell, loader: { el: loader, traceCircle: loader.querySelector('.trace-ring') }, item: item });
  });

  var TRACE_DURATION = 700;
  var STAGGER = 350;

  cells.forEach(function(entry, idx) {
    var cell = entry.cell;
    var loader = entry.loader;
    var item = entry.item;
    var startDelay = 300 + idx * STAGGER;

    setTimeout(function() {
      var R = 14;
      loader.traceCircle.style.transition = 'stroke-dashoffset ' + TRACE_DURATION + 'ms ease-out';
      loader.traceCircle.style.strokeDashoffset = '0';
    }, startDelay);

    setTimeout(function() {
      playReveal(item.rarity);
      cell.classList.add('revealed');
    }, startDelay + TRACE_DURATION);
  });

  var btn = document.getElementById('btnNextRound');
  var remainingEl = document.getElementById('settleRemaining');
  var gameBadge = document.getElementById('settleGameBadge');
  if (gameBadge) gameBadge.textContent = '第 ' + gameState.gameNumber + ' 局';

  var remainingMoney = gameState.money;
  if (remainingMoney <= 0) {
    remainingEl.className = 'settle-remaining settle-game-over';
    remainingEl.innerHTML = '<span class="remain-label">资金归零</span><div class="settle-remain-amount">💀 游戏结束</div>你在第 ' + gameState.gameNumber + ' 局耗尽了所有资金...';
    btn.textContent = '🔄 重新开始';
    btn.onclick = function() {
      document.getElementById('settleModal').classList.remove('show');
      if (gameState.collectedItems.length > 0) {
        randomEventSystem.showRandomEvents(function() {
          restartGame();
        });
      } else {
        restartGame();
      }
    };
  } else {
    remainingEl.className = 'settle-remaining';
    remainingEl.innerHTML = '<span class="remain-label">当前剩余资金</span><div class="settle-remain-amount">¥ 0</div>';
    var remainAmountEl = remainingEl.querySelector('.settle-remain-amount');
    rollNumber(remainAmountEl, remainingMoney, '¥ ');
    btn.textContent = '▶ 开始第 ' + (gameState.gameNumber + 1) + ' 局';
    btn.onclick = function() {
      document.getElementById('settleModal').classList.remove('show');
      if (gameState.collectedItems.length > 0) {
        randomEventSystem.showRandomEvents(function() {
          nextGame();
        });
      } else {
        nextGame();
      }
    };
  }
}
