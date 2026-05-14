var selectedCharIndex = 0;
var charDragging = false;
var charStartX = 0;
var charScrollLeft = 0;
var charTrackOffset = 0;
var charAnimating = false;

function buildCharTrack() {
  var track = document.getElementById('charTrack');
  track.innerHTML = '';
  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';
  track.style.willChange = 'transform';

  characterData.forEach(function(ch, idx) {
    var card = document.createElement('div');
    card.className = 'char-card ' + ch.cls + (idx === selectedCharIndex ? ' selected' : '');
    card.setAttribute('data-idx', idx);
    card.innerHTML = ''
      + '<div class="char-select-tag">✓ 已选</div>'
      + '<div class="char-img-wrap"><img src="' + ch.img + '" alt="' + ch.name + '"></div>'
      + '<div class="char-name">' + ch.name + '</div>'
      + '<div class="char-title">' + ch.title + '</div>'
      + '<div class="char-desc">' + ch.desc + '</div>';
    card.addEventListener('click', function() { selectCharCard(idx); });
    track.appendChild(card);
  });

  requestAnimationFrame(function() {
    var container = track.parentElement;
    var cw = container.offsetWidth;
    var cardWidth = 200;
    var gap = 24;
    var step = cardWidth + gap;
    var centerX = (cw - cardWidth) / 2;
    var initX = centerX - selectedCharIndex * step;
    charTrackOffset = initX;
    track.style.transform = 'translateX(' + initX + 'px)';
  });
}

function selectCharCard(idx) {
  if (charAnimating) return;
  selectedCharIndex = idx;
  var track = document.getElementById('charTrack');
  var cards = track.querySelectorAll('.char-card');
  cards.forEach(function(c, i) {
    c.classList.toggle('selected', i === idx);
  });

  var container = track.parentElement;
  var cw = container.offsetWidth;
  var cardWidth = 200;
  var gap = 24;
  var step = cardWidth + gap;
  var centerX = (cw - cardWidth) / 2;
  var targetX = centerX - idx * step;

  charAnimating = true;
  track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)';
  track.style.transform = 'translateX(' + targetX + 'px)';
  charTrackOffset = targetX;
  setTimeout(function() { charAnimating = false; }, 520);
}

function initCharDrag() {
  var container = document.querySelector('.char-track-container');
  var track = document.getElementById('charTrack');
  if (!container || !track) return;

  var startX = 0, startOffset = 0, isDragging = false;

  function onStart(x) {
    isDragging = true;
    startX = x;
    startOffset = charTrackOffset;
    track.style.transition = 'none';
  }

  function onMove(x) {
    if (!isDragging) return;
    var dx = x - startX;
    charTrackOffset = startOffset + dx;
    track.style.transform = 'translateX(' + charTrackOffset + 'px)';
  }

  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    var container = track.parentElement;
    var cw = container.offsetWidth;
    var cardWidth = 200;
    var gap = 24;
    var step = cardWidth + gap;
    var centerX = (cw - cardWidth) / 2;

    var nearestIdx = Math.round((centerX - charTrackOffset) / step);
    nearestIdx = Math.max(0, Math.min(nearestIdx, characterData.length - 1));
    selectCharCard(nearestIdx);
  }

  container.addEventListener('mousedown', function(e) { e.preventDefault(); onStart(e.clientX); });
  container.addEventListener('mousemove', function(e) { onMove(e.clientX); });
  container.addEventListener('mouseup', onEnd);
  container.addEventListener('mouseleave', onEnd);
  container.addEventListener('touchstart', function(e) { onStart(e.touches[0].clientX); }, { passive: true });
  container.addEventListener('touchmove', function(e) { onMove(e.touches[0].clientX); }, { passive: true });
  container.addEventListener('touchend', onEnd);
}

function openCharSelection() {
  document.getElementById('charOverlay').classList.add('show');
  buildCharTrack();
  setTimeout(function() { initCharDrag(); }, 100);
}

function closeCharSelection() {
  document.getElementById('charOverlay').classList.remove('show');
}

function confirmCharSelection() {
  var ch = characterData[selectedCharIndex];

  document.querySelector('[data-player="me"] .avatar-frame img').src = ch.img;
  document.querySelector('[data-player="me"] .player-name').textContent = ch.name + ' (你)';
  document.getElementById('charBtnAvatar').src = ch.img;

  gameState.playerCharId = ch.id;

  closeCharSelection();
}

function initCharacterListeners() {
  document.getElementById('charSelectBtn').addEventListener('click', function() {
    openCharSelection();
  });

  document.getElementById('charOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeCharSelection();
  });

  document.getElementById('charCloseTop').addEventListener('click', function() {
    closeCharSelection();
  });

  document.getElementById('charConfirmBtn').addEventListener('click', function() {
    confirmCharSelection();
  });
}
