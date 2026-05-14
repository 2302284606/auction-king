var audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function scheduleTone(ctx, t, freq, type, gainVal, dur) {
  var osc = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(gainVal, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.start(t);
  osc.stop(t + dur);
  return { osc: osc, gain: gain };
}

function scheduleNoise(ctx, t, dur, gainVal, freq, type) {
  var bufSize = ctx.sampleRate * dur;
  var buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  var d = buf.getChannelData(0);
  for (var i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
  var src = ctx.createBufferSource();
  src.buffer = buf;
  var gain = ctx.createGain();
  var filter = ctx.createBiquadFilter();
  filter.type = type || 'lowpass';
  filter.frequency.value = freq || 800;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(gainVal, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.start(t);
  src.stop(t + dur);
}

function playGavel() {
  try {
    var ctx = getAudioCtx();
    var t = ctx.currentTime;
    scheduleNoise(ctx, t, 0.08, 0.45, 160, 'lowpass');
    scheduleTone(ctx, t, 150, 'sine', 0.4, 0.08);
    scheduleTone(ctx, t + 0.02, 240, 'triangle', 0.2, 0.06);
    scheduleNoise(ctx, t + 0.06, 0.04, 0.15, 3000, 'highpass');
  } catch(e) {}
}

function playCoins(tOffset) {
  try {
    var ctx = getAudioCtx();
    var t = ctx.currentTime + (tOffset || 0);
    for (var i = 0; i < 14; i++) {
      var tt = t + i * 0.025 + Math.random() * 0.05;
      var freq = 2200 + Math.random() * 4500;
      scheduleTone(ctx, tt, freq, 'sine', 0.05 + Math.random() * 0.07, 0.1 + Math.random() * 0.08);
    }
  } catch(e) {}
}

function playFanfare(tOffset) {
  try {
    var ctx = getAudioCtx();
    var t = ctx.currentTime + (tOffset || 0);
    var notes = [
      { f: 523.25, d: 0.25 }, { f: 659.25, d: 0.25 },
      { f: 783.99, d: 0.25 }, { f: 1046.5, d: 0.45 }
    ];
    notes.forEach(function(n, i) {
      var tt = t + i * 0.1;
      scheduleTone(ctx, tt, n.f, 'sine', 0.2, n.d);
      scheduleTone(ctx, tt, n.f * 2, 'sine', 0.06, n.d * 0.5);
    });
  } catch(e) {}
}

function playFail() {
  try {
    var ctx = getAudioCtx();
    var t = ctx.currentTime;
    scheduleNoise(ctx, t, 0.1, 0.4, 80, 'lowpass');
    scheduleTone(ctx, t, 70, 'sine', 0.35, 0.15);
    [392, 349.23, 311.13, 261.63].forEach(function(f, i) {
      scheduleTone(ctx, t + 0.15 + i * 0.12, f, 'triangle', 0.15, 0.3);
    });
  } catch(e) {}
}

function playReveal(rarity) {
  try {
    var ctx = getAudioCtx();
    var t = ctx.currentTime;
    if (rarity === 'gold') {
      [523.25, 659.25, 783.99].forEach(function(f, i) { scheduleTone(ctx, t + i * 0.08, f, 'sine', 0.18, 0.4); });
      scheduleTone(ctx, t + 0.04, 1046.5, 'sine', 0.08, 0.25);
    } else if (rarity === 'red') {
      [440, 554.37, 659.25].forEach(function(f, i) { scheduleTone(ctx, t + i * 0.06, f, 'triangle', 0.18, 0.35); });
    } else {
      scheduleTone(ctx, t, 523.25, 'sine', 0.12, 0.3);
    }
  } catch(e) {}
}

function playDealSound() {
  playGavel();
  setTimeout(function() { playCoins(0); }, 100);
  setTimeout(function() { playFanfare(0.4); }, 300);
}
