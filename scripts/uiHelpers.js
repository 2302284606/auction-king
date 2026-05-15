function addLog(type, msg) {
  var log = document.getElementById('bid-logs');
  var div = document.createElement('div');
  div.className = type === 'system' ? 'log-system' : 'log-item';
  div.textContent = msg || '';
  log.prepend(div);
}

function addSkillLog(name, skillName, message) {
  var log = document.getElementById('bid-logs');
  var div = document.createElement('div');
  div.className = 'log-skill';
  div.innerHTML = '<strong>[技能]</strong> ' + name + ' 发动 <strong>' + skillName + '</strong>：' + message;
  log.prepend(div);
}

function updateUI() {
  var round = gameState.currentRound;
  document.getElementById('roundInfo').textContent = '第 ' + round + '/5 轮';
  document.getElementById('roundTag').textContent = '第 ' + round + ' 轮';
  document.getElementById('myMoney').textContent = gameState.money.toLocaleString();
  var badge = document.getElementById('gameNumberBadge');
  if (badge) badge.textContent = '第 ' + gameState.gameNumber + ' 局';
}

function updateHafCoinsUI() {
  document.getElementById('myHafCoins').textContent = gameState.hafCoins.toLocaleString();
  document.getElementById('shopHafCoins').textContent = gameState.hafCoins.toLocaleString();
}
