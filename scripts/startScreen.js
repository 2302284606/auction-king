var startCharIndex = 0;

function initStartScreen() {
  createStartParticles();
  updateStartCharacter();
  renderStartCharGrid();
}

function createStartParticles() {
  var container = document.getElementById('startParticles');
  if (!container) return;
  container.innerHTML = '';
  for (var i = 0; i < 25; i++) {
    var p = document.createElement('div');
    p.className = 'start-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = -(Math.random() * 20) + '%';
    p.style.animationDuration = (6 + Math.random() * 8) + 's';
    p.style.animationDelay = (Math.random() * 6) + 's';
    p.style.width = (1 + Math.random() * 2) + 'px';
    p.style.height = p.style.width;
    p.style.opacity = 0.3 + Math.random() * 0.5;
    container.appendChild(p);
  }
}

function updateStartCharacter() {
  var ch = characterData[startCharIndex] || characterData[0];
  var img = document.getElementById('startCharImg');
  var name = document.getElementById('startCharName');
  if (img) img.src = ch.img;
  if (name) name.textContent = ch.name + ' · ' + ch.title;
}

function renderStartCharGrid() {
  var grid = document.getElementById('startCharGrid');
  if (!grid) return;
  grid.innerHTML = '';
  characterData.forEach(function(ch, idx) {
    var div = document.createElement('div');
    div.className = 'start-char-option' + (idx === startCharIndex ? ' active' : '');
    div.innerHTML = '<img src="' + ch.img + '" alt="' + ch.name + '">'
      + '<div class="start-char-option-name">' + ch.name + '</div>'
      + '<div class="start-char-option-title">' + ch.title + '</div>';
    div.onclick = function() {
      startCharIndex = idx;
      updateStartCharacter();
      renderStartCharGrid();
    };
    grid.appendChild(div);
  });
}

function openStartCharSelect() {
  var grid = document.getElementById('startCharSelectGrid');
  if (grid) {
    grid.innerHTML = '';
    characterData.forEach(function(ch, idx) {
      var div = document.createElement('div');
      div.className = 'start-char-option' + (idx === startCharIndex ? ' active' : '');
      div.innerHTML = '<img src="' + ch.img + '" alt="' + ch.name + '">'
        + '<div class="start-char-option-name">' + ch.name + '</div>'
        + '<div class="start-char-option-title">' + ch.title + '</div>';
      div.onclick = function() {
        startCharIndex = idx;
        updateStartCharacter();
        renderStartCharGrid();
        var allOpts = grid.querySelectorAll('.start-char-option');
        allOpts.forEach(function(opt, i) {
          opt.classList.toggle('active', i === idx);
        });
      };
      grid.appendChild(div);
    });
  }
  document.getElementById('startCharOverlay').classList.add('show');
}

function closeStartCharSelect() {
  document.getElementById('startCharOverlay').classList.remove('show');
}

function enterGame() {
  var ch = characterData[startCharIndex] || characterData[0];
  gameState.playerCharId = ch.id;

  document.querySelector('[data-player="me"] .avatar-frame img').src = ch.img;
  document.querySelector('[data-player="me"] .player-name').textContent = ch.name + ' (你)';
  document.getElementById('charBtnAvatar').src = ch.img;
  selectedCharIndex = startCharIndex;

  var screen = document.getElementById('startScreen');
  screen.classList.add('exit');

  playGavel();

  setTimeout(function() {
    screen.style.display = 'none';
    openLobby();
  }, 800);
}
