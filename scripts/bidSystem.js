function generateAIBids(isPreliminary) {
  var round = gameState.currentRound;
  var baseMoney = gameState.money;
  var aiMoneyArr = gameState.aiMoney;

  var targetBid = gameState.bidAmount || Math.floor(baseMoney * (0.2 + Math.random() * 0.5));

  var aggression = 0.3 + round * 0.1;
  var bids = [];

  AI_NAMES.forEach(function(name, i) {
    var maxBid = aiMoneyArr[i];
    var aiBid;
    if (isPreliminary || !gameState.bidAmount) {
      aiBid = Math.floor(maxBid * (0.15 + Math.random() * 0.35));
    } else {
      var ratio = 0.7 + Math.random() * aggression;
      aiBid = Math.floor(targetBid * ratio);
      if (aiBid > maxBid) aiBid = Math.floor(maxBid * 0.9);
    }
    aiBid = Math.max(aiBid, 50000);
    bids.push({ name: name, val: aiBid, idx: i });
  });

  return bids;
}

function confirmBid() {
  if (gameState.isBidding) return;
  if (!gameState.bidAmount) {
    openNumpad();
    return;
  }
  if (gameState.bidAmount > gameState.money) {
    addLog('system', '余额不足！当前余额 ¥' + gameState.money.toLocaleString());
    openNumpad();
    return;
  }

  gameState.isBidding = true;
  document.getElementById('btnConfirm').disabled = true;

  playGavel();

  addLog('system', '⚡ 一锤定音！出价锁定！');

  var aiBids = generateAIBids(false);
  var myBid = { name: '你', val: gameState.bidAmount, isMe: true };
  var allBids = [myBid].concat(aiBids).sort(function(a, b) { return b.val - a.val; });

  document.getElementById('topPrice').textContent = allBids[0].val.toLocaleString();
  document.getElementById('topBidder').textContent = '👑 ' + allBids[0].name;

  var log = document.getElementById('bid-logs');
  allBids.forEach(function(b, i) {
    setTimeout(function() {
      var item = document.createElement('div');
      item.className = 'log-item' + (b.isMe ? ' me' : '') + (i === 0 ? ' top' : '');
      item.innerHTML = '<span class="name">' + b.name + '</span><span class="bid">¥' + b.val.toLocaleString() + '</span>';
      log.prepend(item);

      if (!b.isMe) {
        var statusEl = document.getElementById('ai' + (b.idx + 1) + 'Status');
        if (statusEl) statusEl.textContent = '出价 ¥' + b.val.toLocaleString();
      } else {
        document.getElementById('myStatus').textContent = '出价 ¥' + b.val.toLocaleString();
      }

      if (i === allBids.length - 1) {
        setTimeout(function() { resolveAuction(allBids); }, 600);
      }
    }, i * 250);
  });
}

function skipRound() {
  if (gameState.isBidding) return;
  addLog('system', '⏭ 你跳过了本轮出价');
  document.getElementById('myStatus').textContent = '跳过本轮';

  var aiBids = generateAIBids(false);
  aiBids.sort(function(a, b) { return b.val - a.val; });
  var winner = aiBids[0];
  var second = aiBids[1] || aiBids[0];
  var round = gameState.currentRound;
  var rule = ROUND_RULES[round - 1];

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
  if (rule.special) dealPrice = second.val + 1;
  else dealPrice = Math.floor(second.val * rule.threshold);

  addLog('system', '🤖 ' + winner.name + ' 以 ¥' + dealPrice.toLocaleString() + ' 成交');

  if (winner.idx !== undefined) {
    gameState.aiMoney[winner.idx] -= dealPrice;
    document.getElementById(winner.idx === 0 ? 'ai1Money' : winner.idx === 1 ? 'ai2Money' : 'ai3Money').textContent = gameState.aiMoney[winner.idx].toLocaleString();
  }

  document.querySelector('[data-player="me"]').classList.add('loser-card');
  var map = { 0: 'ai1', 1: 'ai2', 2: 'ai3' };
  document.querySelector('[data-player="' + map[winner.idx] + '"]').classList.add('winner-card');

  var itemCount = 20;
  var items = [];
  var totalVal = 0;
  for (var i = 0; i < itemCount; i++) {
    var item = pickItem();
    items.push(item);
    totalVal += item.value;
  }
  playFail();
  showSettlement(winner, dealPrice, items, totalVal, false, round);
}

function resetBidUI() {
  gameState.isBidding = false;
  gameState.bidAmount = 0;
  document.getElementById('bidDisplay').textContent = '输入金额...';
  document.getElementById('bidDisplay').style.color = '#ffd700';
  document.getElementById('topPrice').textContent = '0';
  document.getElementById('topBidder').textContent = '';
  document.getElementById('btnConfirm').disabled = false;

  document.querySelectorAll('.player-card').forEach(function(c) { c.classList.remove('winner-card', 'loser-card'); });
  document.getElementById('myStatus').textContent = '准备就绪';
  document.getElementById('ai1Status').textContent = '等待中...';
  document.getElementById('ai2Status').textContent = '等待中...';
  document.getElementById('ai3Status').textContent = '等待中...';
}

function initBidListeners() {
  document.getElementById('btnConfirm').addEventListener('click', function() {
    confirmBid();
  });

  document.getElementById('btnPass').addEventListener('click', function() {
    skipRound();
  });
}
