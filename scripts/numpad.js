var numpadValue = '';

function openNumpad() {
  if (gameState.isBidding) return;
  document.getElementById('numpadOverlay').classList.add('show');
  numpadValue = '';
  updateNumpadDisplay();
}

function closeNumpad() {
  document.getElementById('numpadOverlay').classList.remove('show');
}

function numpadInput(digit) {
  var maxLen = 9;
  var raw = numpadValue.replace(/,/g, '');
  raw += digit;
  if (raw.length > maxLen) return;
  var num = parseInt(raw);
  if (num > 99999999) return;
  numpadValue = raw;
  updateNumpadDisplay();
}

function numpadClear() {
  numpadValue = '';
  updateNumpadDisplay();
}

function numpadQuick(val) {
  numpadValue = val.toString();
  updateNumpadDisplay();
}

function numpadConfirm() {
  var num = parseInt(numpadValue);
  if (!num || num < 1000) return;
  gameState.bidAmount = num;
  document.getElementById('bidDisplay').textContent = '¥ ' + num.toLocaleString();
  document.getElementById('bidDisplay').style.color = '#ffd700';
  closeNumpad();
}

function quickBid(val) {
  if (gameState.isBidding) return;
  gameState.bidAmount = val;
  numpadValue = val.toString();
  document.getElementById('bidDisplay').textContent = '¥ ' + val.toLocaleString();
  document.getElementById('bidDisplay').style.color = '#ffd700';
  closeNumpad();
}

function updateNumpadDisplay() {
  var el = document.getElementById('numpadDisplay');
  if (!numpadValue) {
    el.innerHTML = '<span class="hint">输入出价金额</span>';
    return;
  }
  var num = parseInt(numpadValue);
  el.textContent = '¥ ' + num.toLocaleString();
}

function initNumpadListeners() {
  document.getElementById('bidDisplay').addEventListener('click', function() {
    openNumpad();
  });

  document.getElementById('numpadClose').addEventListener('click', function() {
    closeNumpad();
  });

  document.querySelectorAll('.numpad-key[data-digit]').forEach(function(key) {
    key.addEventListener('click', function() {
      numpadInput(this.getAttribute('data-digit'));
    });
  });

  document.getElementById('numpadKeyClear').addEventListener('click', function() {
    numpadClear();
  });

  document.getElementById('numpadKeyConfirm').addEventListener('click', function() {
    numpadConfirm();
  });

  document.querySelectorAll('.numpad-quick[data-amount]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      numpadQuick(parseInt(this.getAttribute('data-amount')));
    });
  });

  document.querySelectorAll('.quick-btn[data-amount]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      quickBid(parseInt(this.getAttribute('data-amount')));
    });
  });

  document.addEventListener('click', function(e) {
    var overlay = document.getElementById('numpadOverlay');
    if (!overlay.classList.contains('show')) return;
    if (!overlay.contains(e.target) && e.target.id !== 'bidDisplay') {
      closeNumpad();
    }
  });
}
