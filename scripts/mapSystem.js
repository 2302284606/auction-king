var mapAnimating = false;

function openMapSelection() {
  document.getElementById('mapOverlay').classList.add('show');
  buildMapTrack();
}

function closeMapSelection() {
  document.getElementById('mapOverlay').classList.remove('show');
  setTimeout(function() {
    var btn = document.getElementById('mapStartBtn');
    btn.textContent = '🎲 随机抽取地图';
    btn.disabled = false;
    btn.onclick = startMapRoulette;
    document.getElementById('mapResult').classList.remove('show');
    mapAnimating = false;
    initRound(1);
  }, 300);
}

function skipMapSelection() {
  if (mapAnimating) return;
  mapAnimating = true;
  var overlay = document.getElementById('mapOverlay');
  overlay.style.transition = 'opacity 0.3s ease-out';
  overlay.style.opacity = '0';
  setTimeout(function() {
    overlay.classList.remove('show');
    overlay.style.opacity = '';
    overlay.style.transition = '';
    var btn = document.getElementById('mapStartBtn');
    btn.textContent = '🎲 随机抽取地图';
    btn.disabled = false;
    btn.onclick = startMapRoulette;
    document.getElementById('mapResult').classList.remove('show');
    mapAnimating = false;
    initRound(1);
  }, 300);
}

function buildMapTrack() {
  var track = document.getElementById('mapTrack');
  track.innerHTML = '';
  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';
  track.style.willChange = 'transform';

  var copies = 10;
  for (var c = 0; c < copies; c++) {
    for (var m = 0; m < treasureMaps.length; m++) {
      var map = treasureMaps[m];
      var card = document.createElement('div');
      card.className = 'map-card ' + map.cls;
      card.innerHTML = '<div class="map-emoji">' + map.emoji + '</div><div class="map-name">' + map.name + '</div><div class="map-desc">' + map.desc + '</div>';
      track.appendChild(card);
    }
  }

  var btn = document.getElementById('mapStartBtn');
  btn.textContent = '🎲 随机抽取地图';
  btn.disabled = false;
  btn.onclick = startMapRoulette;
  document.getElementById('mapResult').classList.remove('show');
  mapAnimating = false;

  requestAnimationFrame(function() {
    var container = track.parentElement;
    var cw = container.offsetWidth;
    var step = 152;
    var initCard = 2;
    var initX = (cw - 140) / 2 - initCard * step;
    track.style.transform = 'translateX(' + initX + 'px)';
  });
}

function startMapRoulette() {
  if (mapAnimating) return;
  mapAnimating = true;

  var btn = document.getElementById('mapStartBtn');
  btn.disabled = true;
  btn.textContent = '🔄 抽取中...';
  document.getElementById('mapResult').classList.remove('show');

  var track = document.getElementById('mapTrack');
  var mapsCount = treasureMaps.length;

  var winnerIdx = Math.floor(Math.random() * mapsCount);
  var copyNum = 4 + Math.floor(Math.random() * 4);
  var targetIndex = copyNum * mapsCount + winnerIdx;

  var step = 152;
  var container = track.parentElement;
  var cw = container.offsetWidth;
  var centerX = (cw - 140) / 2;

  var extraCycles = 3 * mapsCount;
  var targetX = centerX - (targetIndex + extraCycles) * step;

  void track.offsetHeight;

  track.style.transition = 'transform 4.5s cubic-bezier(0.12, 0.85, 0.18, 1)';
  track.style.transform = 'translateX(' + targetX + 'px)';

  setTimeout(function() {
    var winner = treasureMaps[winnerIdx];
    var resultEl = document.getElementById('mapResult');
    resultEl.innerHTML = ''
      + '<span class="result-emoji">' + winner.emoji + '</span>'
      + '<div class="result-name">' + winner.name + '</div>'
      + '<div class="result-desc">' + winner.desc + '</div>'
      + '<div class="result-tag">🏷️ 本次拍卖仓库</div>';
    resultEl.classList.add('show');
    btn.textContent = '🔄 重新抽取';
    btn.disabled = true;
    mapAnimating = false;

    setTimeout(function() {
      document.getElementById('mapOverlay').classList.remove('show');
      mapAnimating = false;
      initRound(1);
    }, 500);
  }, 4800);
}

function initMapListeners() {
  document.getElementById('mapEntryBtn').addEventListener('click', function() {
    openMapSelection();
  });

  document.getElementById('mapOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeMapSelection();
  });

  document.getElementById('mapCloseTop').addEventListener('click', function() {
    skipMapSelection();
  });

  document.getElementById('mapStartBtn').addEventListener('click', function() {
    startMapRoulette();
  });

  document.getElementById('mapCloseBtn').addEventListener('click', function() {
    skipMapSelection();
  });
}
