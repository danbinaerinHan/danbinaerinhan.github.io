// ═══════════════════════════════════════════════════
// 삼현육각 Interactive Multitrack Player
// Play the Korean Instruments!
// ═══════════════════════════════════════════════════
(function () {
  'use strict';

  var AUDIO_BASE = 'audio/';

  // Audio tracks (no 아쟁). Files are XOR-scrambled compressed audio (.bin);
  // decoded in-memory at load time so the raw URL is not a usable download.
  var INSTRUMENTS = [
    { id: 'piri',    name: '피리',  nameEn: 'Piri',    file: 's1.bin', color: '#8B4513' },
    { id: 'daegeum', name: '대금',  nameEn: 'Daegeum', file: 's2.bin', color: '#2E8B57' },
    { id: 'haegeum', name: '해금',  nameEn: 'Haegeum', file: 's3.bin', color: '#8B0000' },
    { id: 'janggu',  name: '장구',  nameEn: 'Janggu',  file: 's4.bin', color: '#B8860B' },
    { id: 'jwago',   name: '좌고',  nameEn: 'Jwago',   file: 's5.bin', color: '#556B2F' }
  ];

  // XOR de-scramble key (must match the encoder used to produce the .bin files)
  var AUDIO_KEY = [0x9c,0x4f,0x1a,0xe6,0xb2,0x7d,0x83,0x21,
                   0x55,0xaa,0x0f,0xc3,0x6e,0x38,0xd1,0x7b];

  function descramble(arrayBuffer) {
    var bytes = new Uint8Array(arrayBuffer);
    var klen = AUDIO_KEY.length;
    for (var i = 0; i < bytes.length; i++) {
      bytes[i] ^= AUDIO_KEY[i % klen];
    }
    return bytes.buffer;
  }

  // Visual hotspots on SVG (two 피리 share same audio)
  // Layout matches the drawing:
  //   Top: 대금 (long flute player)
  //   Below-left of 대금: 해금 (bowed string)
  //   Further down-left: 피리 (left, reed instrument)
  //   Front center: 장구 (hourglass drum)
  //   Right of 장구: 피리 (right, reed instrument)
  //   Far right: 좌고 (barrel drum)
  var HOTSPOTS = [
    { hsId: 'daegeum',   instId: 'daegeum', name: 'Daegeum',  x: 50, y: 12 },
    { hsId: 'haegeum',   instId: 'haegeum', name: 'Haegeum',  x: 30, y: 35 },
    { hsId: 'piri-left', instId: 'piri',    name: 'Piri',     x: 18, y: 52 },
    { hsId: 'janggu',    instId: 'janggu',  name: 'Janggu',   x: 38, y: 82 },
    { hsId: 'piri-right',instId: 'piri',    name: 'Piri',     x: 58, y: 70 },
    { hsId: 'jwago',     instId: 'jwago',   name: 'Jwago',    x: 78, y: 54 }
  ];

  var audioCtx = null;
  var audioBuffers = {};   // id -> AudioBuffer
  var sourceNodes = {};    // id -> AudioBufferSourceNode
  var gainNodes = {};      // id -> GainNode
  var muteState = {};      // id -> boolean (true = muted)
  var isPlaying = false;
  var startTime = 0;
  var pauseOffset = 0;
  var overlayEl = null;
  var loadingCount = 0;
  var totalToLoad = INSTRUMENTS.length;

  // ── Audio Context ──
  function getAudioCtx() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  // ── Load all audio files ──
  function loadAllAudio(onProgress, onComplete) {
    var ctx = getAudioCtx();
    loadingCount = 0;

    INSTRUMENTS.forEach(function (inst) {
      if (audioBuffers[inst.id]) {
        loadingCount++;
        onProgress(loadingCount, totalToLoad);
        if (loadingCount === totalToLoad) onComplete();
        return;
      }

      var url = encodeURI(AUDIO_BASE + inst.file);
      fetch(url)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.arrayBuffer();
        })
        .then(function (buf) { return ctx.decodeAudioData(descramble(buf)); })
        .then(function (decoded) {
          audioBuffers[inst.id] = decoded;
          loadingCount++;
          onProgress(loadingCount, totalToLoad);
          if (loadingCount === totalToLoad) onComplete();
        })
        .catch(function (err) {
          console.error('Failed to load ' + inst.name + ':', err);
          loadingCount++;
          onProgress(loadingCount, totalToLoad);
          if (loadingCount === totalToLoad) onComplete();
        });
    });
  }

  // ── Playback controls ──
  function playAll() {
    if (isPlaying) return;
    var ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    INSTRUMENTS.forEach(function (inst) {
      var buffer = audioBuffers[inst.id];
      if (!buffer) return;

      var source = ctx.createBufferSource();
      source.buffer = buffer;

      var gain = ctx.createGain();
      gain.gain.value = muteState[inst.id] ? 0 : 1;
      source.connect(gain);
      gain.connect(ctx.destination);

      sourceNodes[inst.id] = source;
      gainNodes[inst.id] = gain;

      source.start(0, pauseOffset);
    });

    startTime = ctx.currentTime - pauseOffset;
    isPlaying = true;

    // Auto-stop when longest track ends
    var maxDuration = 0;
    INSTRUMENTS.forEach(function (inst) {
      var buf = audioBuffers[inst.id];
      if (buf && buf.duration > maxDuration) maxDuration = buf.duration;
    });
    if (maxDuration > pauseOffset) {
      setTimeout(function () {
        if (isPlaying) stopAll();
      }, (maxDuration - pauseOffset) * 1000 + 200);
    }

    updateTransportUI();
  }

  function pauseAll() {
    if (!isPlaying) return;
    var ctx = getAudioCtx();
    pauseOffset = ctx.currentTime - startTime;

    INSTRUMENTS.forEach(function (inst) {
      var source = sourceNodes[inst.id];
      if (source) {
        try { source.stop(); } catch (e) { /* already stopped */ }
      }
    });
    sourceNodes = {};
    gainNodes = {};
    isPlaying = false;
    updateTransportUI();
  }

  function stopAll() {
    pauseAll();
    pauseOffset = 0;
    updateTransportUI();
    updateProgressBar();
  }

  function toggleMute(instId) {
    muteState[instId] = !muteState[instId];
    var gain = gainNodes[instId];
    if (gain) {
      gain.gain.value = muteState[instId] ? 0 : 1;
    }
  }

  // ── UI ──
  function updateTransportUI() {
    var playBtn = document.getElementById('ip-play-btn');
    var pauseBtn = document.getElementById('ip-pause-btn');
    if (playBtn) playBtn.style.display = isPlaying ? 'none' : 'inline-flex';
    if (pauseBtn) pauseBtn.style.display = isPlaying ? 'inline-flex' : 'none';
  }

  function updateProgressBar() {
    var bar = document.getElementById('ip-progress-fill');
    var timeEl = document.getElementById('ip-time');
    if (!bar || !timeEl) return;

    var maxDuration = 0;
    INSTRUMENTS.forEach(function (inst) {
      var buf = audioBuffers[inst.id];
      if (buf && buf.duration > maxDuration) maxDuration = buf.duration;
    });

    var current = 0;
    if (isPlaying && audioCtx) {
      current = audioCtx.currentTime - startTime;
    } else {
      current = pauseOffset;
    }
    current = Math.min(current, maxDuration);

    var pct = maxDuration > 0 ? (current / maxDuration) * 100 : 0;
    bar.style.width = pct + '%';

    var mm = Math.floor(current / 60);
    var ss = Math.floor(current % 60);
    var tmm = Math.floor(maxDuration / 60);
    var tss = Math.floor(maxDuration % 60);
    timeEl.textContent =
      (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss +
      ' / ' +
      (tmm < 10 ? '0' : '') + tmm + ':' + (tss < 10 ? '0' : '') + tss;
  }

  var progressInterval = null;

  function startProgressUpdater() {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = setInterval(updateProgressBar, 250);
  }

  function stopProgressUpdater() {
    if (progressInterval) clearInterval(progressInterval);
    progressInterval = null;
  }

  // ── Create overlay DOM ──
  function createOverlay() {
    if (overlayEl) return overlayEl;

    var overlay = document.createElement('div');
    overlay.id = 'instrument-player-overlay';
    overlay.className = 'ip-overlay';
    overlay.innerHTML = [
      '<div class="ip-container">',
      '  <button class="ip-close-btn" id="ip-close" aria-label="Close">&times;</button>',
      '  <h2 class="ip-title">Play the Korean Instruments!</h2>',
      '  <p class="ip-subtitle">삼현육각 (Samhyeon Yukgak) — 민속악 대풍류</p>',
      '  <div class="ip-main">',
      '    <div class="ip-svg-area" id="ip-svg-area">',
      '      <img src="' + encodeURI('삼현육각.svg') + '" class="ip-svg-img" alt="삼현육각" draggable="false">',
      HOTSPOTS.map(function (hs) {
        var inst = INSTRUMENTS.find(function (i) { return i.id === hs.instId; });
        var color = inst ? inst.color : '#666';
        return '<button class="ip-hotspot" id="ip-hs-' + hs.hsId + '" ' +
          'style="left:' + hs.x + '%;top:' + hs.y + '%;--inst-color:' + color + '" ' +
          'data-inst="' + hs.instId + '" title="' + hs.name + '">' +
          '<span class="ip-hotspot-ring"></span>' +
          '<span class="ip-hotspot-label">' + hs.name + '</span>' +
          '</button>';
      }).join(''),
      '    </div>',
      '  </div>',
      '  <div class="ip-controls">',
      '    <div class="ip-transport">',
      '      <button class="ip-btn" id="ip-play-btn" title="Play"><i class="fa-solid fa-play"></i></button>',
      '      <button class="ip-btn" id="ip-pause-btn" title="Pause" style="display:none"><i class="fa-solid fa-pause"></i></button>',
      '      <button class="ip-btn" id="ip-stop-btn" title="Stop"><i class="fa-solid fa-stop"></i></button>',
      '    </div>',
      '    <div class="ip-progress">',
      '      <div class="ip-progress-bar"><div class="ip-progress-fill" id="ip-progress-fill"></div></div>',
      '      <span class="ip-time" id="ip-time">00:00 / 00:00</span>',
      '    </div>',
      '  </div>',
      '  <div class="ip-mixer">',
      INSTRUMENTS.map(function (inst) {
        return '<div class="ip-channel" data-inst="' + inst.id + '">' +
          '<div class="ip-channel-indicator" style="background:' + inst.color + '"></div>' +
          '<span class="ip-channel-name">' + inst.name + '</span>' +
          '<span class="ip-channel-name-en">' + inst.nameEn + '</span>' +
          '<button class="ip-mute-btn active" id="ip-mute-' + inst.id + '" data-inst="' + inst.id + '">' +
          '<i class="fa-solid fa-volume-high"></i>' +
          '</button>' +
          '</div>';
      }).join(''),
      '  </div>',
      '  <div class="ip-loading" id="ip-loading">',
      '    <div class="ip-loading-text">Loading audio files...</div>',
      '    <div class="ip-loading-bar"><div class="ip-loading-fill" id="ip-loading-fill"></div></div>',
      '  </div>',
      '</div>'
    ].join('\n');

    document.body.appendChild(overlay);
    overlayEl = overlay;

    // ── Event listeners ──
    document.getElementById('ip-close').addEventListener('click', closeOverlay);

    document.getElementById('ip-play-btn').addEventListener('click', function () {
      playAll();
      startProgressUpdater();
    });

    document.getElementById('ip-pause-btn').addEventListener('click', function () {
      pauseAll();
      stopProgressUpdater();
    });

    document.getElementById('ip-stop-btn').addEventListener('click', function () {
      stopAll();
      stopProgressUpdater();
    });

    // Hotspot clicks
    overlay.querySelectorAll('.ip-hotspot').forEach(function (hs) {
      hs.addEventListener('click', function () {
        var instId = hs.dataset.inst;
        toggleMute(instId);
        updateHotspotUI(instId);
        updateMixerUI(instId);
      });
    });

    // Mixer mute clicks
    overlay.querySelectorAll('.ip-mute-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var instId = btn.dataset.inst;
        toggleMute(instId);
        updateHotspotUI(instId);
        updateMixerUI(instId);
      });
    });

    // ESC key
    overlay.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeOverlay();
    });

    return overlay;
  }

  function updateHotspotUI(instId) {
    // Update all hotspots linked to this instrument (e.g. two 피리)
    var allHotspots = document.querySelectorAll('.ip-hotspot[data-inst="' + instId + '"]');
    allHotspots.forEach(function (hs) {
      hs.classList.toggle('muted', !!muteState[instId]);
    });
  }

  function updateMixerUI(instId) {
    var btn = document.getElementById('ip-mute-' + instId);
    if (btn) {
      var isMuted = !!muteState[instId];
      btn.classList.toggle('active', !isMuted);
      btn.innerHTML = isMuted
        ? '<i class="fa-solid fa-volume-xmark"></i>'
        : '<i class="fa-solid fa-volume-high"></i>';
    }
  }

  // ── Open / Close ──
  function openOverlay() {
    // Initialize AudioContext on user gesture (required by browsers)
    var ctx = getAudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    var overlay = createOverlay();
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';

    // Hide the background dandelion watermark
    var wrap = document.getElementById('dandelion-wrap');
    if (wrap) wrap.classList.add('ip-open');

    // Load audio and auto-play
    var loadingEl = document.getElementById('ip-loading');
    if (loadingCount < totalToLoad) {
      loadingEl.style.display = 'block';
      loadAllAudio(
        function (loaded, total) {
          var fill = document.getElementById('ip-loading-fill');
          if (fill) fill.style.width = (loaded / total * 100) + '%';
        },
        function () {
          loadingEl.style.display = 'none';
          updateProgressBar();
          // Auto-play after loading
          pauseOffset = 0;
          playAll();
          startProgressUpdater();
        }
      );
    } else {
      loadingEl.style.display = 'none';
      // Already loaded — auto-play immediately
      pauseOffset = 0;
      playAll();
      startProgressUpdater();
    }

    overlay.focus();
  }

  function closeOverlay() {
    stopAll();
    stopProgressUpdater();
    if (overlayEl) {
      overlayEl.classList.remove('visible');
    }
    document.body.style.overflow = '';

    // Restore dandelion watermark
    var wrap = document.getElementById('dandelion-wrap');
    if (wrap) {
      wrap.classList.remove('ip-open');
    }
  }

  // ── Initialize: find or create the trigger button ──
  function init() {
    // Initialize mute states (all unmuted by default)
    INSTRUMENTS.forEach(function (inst) {
      muteState[inst.id] = false;
    });

    // Listen for trigger buttons and SVG watermark click
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('#instrument-play-btn') ||
                e.target.closest('#instrument-play-btn-mobile') ||
                e.target.closest('#dandelion-wrap');
      if (btn) {
        e.preventDefault();
        openOverlay();
      }
    });

    setupMobileReveal();
  }

  // ── Mobile: reveal the play button only when the page bottom is reached ──
  function setupMobileReveal() {
    var btn = document.getElementById('instrument-play-btn-mobile');
    if (!btn) return;
    function check() {
      var scrolled = window.innerHeight + window.scrollY;
      var nearBottom = scrolled >= document.documentElement.scrollHeight - 140;
      btn.classList.toggle('revealed', nearBottom);
    }
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    check();
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
