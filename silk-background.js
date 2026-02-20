// ═══════════════════════════════════════════════════
// 단비가 내린다 (甘雨) — p5.js animated backgrounds
// Scenes: 한지 · 숲 · 도시
// ═══════════════════════════════════════════════════

var currentScene = 'window';
var sceneAlpha = 1;
var sceneState = 'idle';
var pendingScene = null;
var cachedNotebookRect = null;
var lastRectUpdate = 0;
var lastStateChange = 0;
var lastDrawTime = 0;
var DARK_SCENES = { city: true };
var SCENES = {};

// ── Dark theme helper ──
function applySceneTheme(key) {
  if (DARK_SCENES[key]) {
    document.body.classList.add('scene-dark');
  } else {
    document.body.classList.remove('scene-dark');
  }
  // Show dandelion watermark only on 한지 scene
  var dandelion = document.getElementById('dandelion-decor');
  if (dandelion) {
    dandelion.style.opacity = (key === 'window') ? '0.4' : '0';
  }
}

// ═══════════════════════════════════════════════════
// SCENE 1: 한지 (Hanji) — ink washes, motes, network, rain
// ═══════════════════════════════════════════════════
SCENES.window = {
  name: '한지',
  bg: null,

  init: function(w, h) {
    if (this.bg) this.bg.remove();
    this.bg = createGraphics(w, h);
    var g = this.bg;

    // 한지 base — warm off-white gradient
    for (var y = 0; y < h; y++) {
      var t = y / h;
      g.stroke(lerp(248, 240, t), lerp(244, 236, t), lerp(238, 228, t));
      g.line(0, y, w, y);
    }

    // 한지 texture — fine scattered dots (paper fiber feel)
    g.noStroke();
    for (var i = 0; i < 600; i++) {
      var px = random(w), py = random(h);
      var pr = random(0.5, 1.5);
      g.fill(random(200, 225), random(195, 215), random(185, 205), random(8, 18));
      g.ellipse(px, py, pr);
    }

    // 수묵 번짐 — ink wash patches
    g.noStroke();
    var inkWashes = [
      { col: [180, 178, 172], a: 12 },
      { col: [185, 195, 185], a: 10 },
      { col: [195, 190, 182], a: 11 },
      { col: [175, 182, 178], a: 9 },
      { col: [200, 195, 188], a: 10 }
    ];
    for (var i = 0; i < 6; i++) {
      var ws = inkWashes[floor(random(inkWashes.length))];
      var wx = random(-80, w + 80);
      var wy = random(-40, h + 40);
      var wr = random(180, 420);
      for (var l = 0; l < 3; l++) {
        g.fill(ws.col[0], ws.col[1], ws.col[2], ws.a * (1 - l * 0.3));
        g.ellipse(wx + random(-25, 25), wy + random(-15, 15), wr * (1 + l * 0.35), wr * (0.55 + l * 0.2));
      }
    }
  },

  draw: function(w, h) {
    image(this.bg, 0, 0);
  }
};

// ═══════════════════════════════════════════════════
// SCENE 2: 숲 (Forest) — organic treeline + canopy rain
// ═══════════════════════════════════════════════════
SCENES.forest = {
  name: '숲',
  bg: null, leaves: [], drops: [], ripples: [], fog: [],

  init: function(w, h) {
    if (this.bg) this.bg.remove();
    this.bg = createGraphics(w, h);
    var g = this.bg;
    var gY = h * 0.85;

    // Misty gradient
    for (var y = 0; y < h; y++) {
      var t = y / h;
      g.stroke(lerp(195,210,t), lerp(205,212,t), lerp(188,195,t));
      g.line(0, y, w, y);
    }

    // Ground
    for (var y = floor(gY); y < h; y++) {
      var gt = (y-gY)/(h-gY);
      g.stroke(lerp(155,135,gt), lerp(148,125,gt), lerp(125,105,gt));
      g.line(0, y, w, y);
    }

    // ── Organic treeline layers (noise-based) ──
    var layers = [
      { baseY: h*0.35, maxH: h*0.18, col:[145,158,130], trunkCol:[110,95,75], a:18, nScale:0.004, seed:100 },
      { baseY: h*0.45, maxH: h*0.22, col:[115,135,100], trunkCol:[95,80,60],  a:25, nScale:0.005, seed:200 },
      { baseY: h*0.58, maxH: h*0.25, col:[85,110,70],   trunkCol:[80,65,48],  a:35, nScale:0.006, seed:300 },
    ];

    for (var li = 0; li < layers.length; li++) {
      var L = layers[li];

      // Foliage mass — noise-based organic treeline
      g.noStroke();
      g.fill(L.col[0], L.col[1], L.col[2], L.a);
      g.beginShape();
      g.vertex(0, h);
      for (var x = 0; x <= w; x += 3) {
        var n = noise(x * L.nScale + L.seed);
        var baselineY = L.baseY + n * L.maxH;
        // Crown bumps — individual tree silhouettes
        var crown = pow(abs(sin(x * 0.015 + noise(x * 0.008 + L.seed + 50) * 4)), 0.6) * (20 + li * 10);
        g.vertex(x, baselineY - crown);
      }
      g.vertex(w, h);
      g.endShape(CLOSE);

      // Second foliage pass — lighter, offset for depth
      g.fill(L.col[0]+15, L.col[1]+10, L.col[2]+8, L.a * 0.5);
      g.beginShape();
      g.vertex(0, h);
      for (var x = 0; x <= w; x += 4) {
        var n = noise(x * L.nScale * 1.3 + L.seed + 500);
        var baselineY = L.baseY + 10 + n * L.maxH * 0.8;
        var crown = pow(abs(sin(x * 0.02 + noise(x * 0.01 + L.seed + 80) * 3)), 0.5) * (15 + li * 8);
        g.vertex(x, baselineY - crown);
      }
      g.vertex(w, h);
      g.endShape(CLOSE);

      // Tree trunks — curved bezier lines visible in front
      var trunkCount = 2 + li * 2;
      g.stroke(L.trunkCol[0], L.trunkCol[1], L.trunkCol[2], L.a * 0.9);
      g.noFill();
      for (var ti = 0; ti < trunkCount; ti++) {
        var tx = random(w * 0.05, w * 0.95);
        var tBase = gY;
        var n = noise(tx * L.nScale + L.seed);
        var treelineY = L.baseY + n * L.maxH;
        var tTop = treelineY - 5;
        var tw = random(1.5, 3) + li * 0.8;
        var sway = random(-12, 12);

        g.strokeWeight(tw);
        g.bezier(
          tx, tBase,
          tx + sway * 0.3, tBase - (tBase - tTop) * 0.35,
          tx + sway * 0.7, tBase - (tBase - tTop) * 0.65,
          tx + sway, tTop
        );

        // 1-2 branches
        if (li >= 1) {
          g.strokeWeight(tw * 0.4);
          var bY = lerp(tBase, tTop, random(0.3, 0.7));
          var bX = tx + sway * ((bY - tBase) / (tTop - tBase));
          var bLen = random(12, 30);
          var bDir = random() < 0.5 ? -1 : 1;
          g.bezier(bX, bY, bX+bDir*bLen*0.4, bY-bLen*0.2, bX+bDir*bLen*0.8, bY-bLen*0.15, bX+bDir*bLen, bY+random(-5,5));
        }
      }
    }

    // Leaves
    this.leaves = [];
    for (var i = 0; i < floor(random(6,9)); i++) {
      this.leaves.push({
        bx: random(w*0.05,w*0.95), by: random(h*0.02,h*0.12),
        angle: random(-0.6,0.6), len: random(30,55),
        lL: random(14,22), lW: random(5,9),
        swPh: random(TWO_PI), swSp: random(0.008,0.014), swAm: random(0.08,0.16),
        col: [floor(random(65,115)), floor(random(125,165)), floor(random(55,95))],
        dSz:0, dMax:random(3,5), dTimer:random(2500,5000), lastD:millis()
      });
    }
    this.drops = []; this.ripples = [];
    this.fog = [];
    for (var i = 0; i < 12; i++) {
      this.fog.push({ x:random(w), y:random(h*0.55,h*0.92), r:random(100,280), vx:random(-0.1,0.1), a:random(14,28) });
    }
  },

  draw: function(w, h) {
    image(this.bg, 0, 0);
    var now = millis(), gY = h*0.85;

    // Fog
    noStroke();
    for (var i = 0; i < this.fog.length; i++) {
      var f = this.fog[i]; f.x += f.vx;
      if (f.x < -f.r) f.x = w+f.r; if (f.x > w+f.r) f.x = -f.r;
      fill(215,212,200,f.a); ellipse(f.x, f.y, f.r*2, f.r*0.7);
    }

    // Rain — clearly visible, angled
    stroke(195,200,190); strokeWeight(0.5);
    for (var i = 0; i < 12; i++) {
      var rx = random(w), ry = random(h*0.05,h*0.7);
      var rLen = random(20,40);
      stroke(195,200,190, random(20,35));
      line(rx, ry, rx+1, ry+rLen);
    }

    // Leaves + drip
    for (var i = 0; i < this.leaves.length; i++) {
      var lf = this.leaves[i];
      var sway = sin(now*lf.swSp*0.001+lf.swPh)*lf.swAm;
      var ang = lf.angle+sway;
      var tipX = lf.bx+cos(ang+HALF_PI)*lf.len;
      var tipY = lf.by+sin(ang+HALF_PI)*lf.len;

      stroke(90,75,55,28); strokeWeight(1.3); line(lf.bx,lf.by,tipX,tipY);
      push(); translate(tipX,tipY); rotate(ang+PI*0.3);
      noStroke(); fill(lf.col[0],lf.col[1],lf.col[2],42);
      ellipse(lf.lL*0.4,0,lf.lL,lf.lW);
      stroke(lf.col[0]-10,lf.col[1]-10,lf.col[2],20); strokeWeight(0.4);
      line(0,0,lf.lL*0.65,0); pop();

      if (now - lf.lastD > lf.dTimer) {
        lf.dSz += 0.03;
        var dx2 = tipX+cos(ang+PI*0.3)*lf.lL*0.75;
        var dy2 = tipY+sin(ang+PI*0.3)*lf.lL*0.75;
        if (lf.dSz > 0.5) {
          noStroke(); fill(210,218,225,40); ellipse(dx2,dy2,lf.dSz*2.2);
          fill(255,255,255,32); ellipse(dx2-lf.dSz*0.2,dy2-lf.dSz*0.2,lf.dSz*0.4);
        }
        if (lf.dSz >= lf.dMax) {
          this.drops.push({x:dx2,y:dy2,r:lf.dSz,vy:0.5});
          lf.dSz = 0; lf.lastD = now; lf.dTimer = random(2500,5000);
        }
      }
    }

    // Falling drops
    noStroke();
    for (var i = this.drops.length-1; i >= 0; i--) {
      var d = this.drops[i]; d.vy += 0.15; d.y += d.vy;
      fill(210,218,225,35); ellipse(d.x,d.y,d.r*1.4,d.r*2.5);
      fill(255,255,255,28); ellipse(d.x,d.y-d.r*0.3,d.r*0.45);
      if (d.y > gY) {
        this.ripples.push({x:d.x,y:gY,maxR:random(14,25),birth:now,life:random(1500,2200),a:random(22,38)});
        this.drops.splice(i,1);
      }
    }
    if (this.drops.length > 12) this.drops.splice(0,3);

    // Ripples
    noFill();
    for (var i = this.ripples.length-1; i >= 0; i--) {
      var rp = this.ripples[i], age = now-rp.birth;
      if (age > rp.life) { this.ripples.splice(i,1); continue; }
      var p = age/rp.life;
      stroke(160,170,150,rp.a*(1-p)); strokeWeight(0.8);
      ellipse(rp.x,rp.y,rp.maxR*p*2,rp.maxR*p*0.5);
    }
    if (this.ripples.length > 15) this.ripples.splice(0,3);
  }
};

// ═══════════════════════════════════════════════════
// SCENE 3: 도시 (City) — rainy dusk, warm streetlamps
// ═══════════════════════════════════════════════════
SCENES.city = {
  name: '도시',
  bg: null, lamps: [], rain: [], groundY: 0, ripples: [],
  windAngle: 0.08,

  init: function(w, h) {
    if (this.bg) this.bg.remove();
    this.bg = createGraphics(w, h);
    var g = this.bg;
    this.groundY = h * 0.82;
    var gY = this.groundY;

    // Rainy dusk — moody purple-gray, NOT pitch black
    for (var y = 0; y < h; y++) {
      var t = y / h;
      if (y < gY) {
        g.stroke(lerp(75,50,t), lerp(68,45,t), lerp(92,62,t));
      } else {
        var gt = (y-gY)/(h-gY);
        g.stroke(lerp(40,30,gt), lerp(36,26,gt), lerp(50,38,gt));
      }
      g.line(0, y, w, y);
    }

    // Buildings
    var nr = cachedNotebookRect;
    var leftE = nr ? nr.left : w*0.22;
    var rightE = nr ? nr.right : w*0.78;
    g.noStroke();

    var buildSide = function(startX, endX) {
      for (var i = 0; i < 5; i++) {
        var bw = random(25,60), bh = random(h*0.18,h*0.45);
        var bx = random(startX, max(startX+5, endX-bw));
        if (bx + bw > endX) bx = endX - bw;
        if (bx < startX) bx = startX;
        g.fill(28,25,38); g.rect(bx, gY-bh, bw, bh);
        for (var wy = gY-bh+10; wy < gY-6; wy += 14) {
          for (var wx = bx+4; wx < bx+bw-4; wx += 9) {
            if (random() < 0.45) {
              g.fill(255,210,130, random(30,70)); g.rect(wx,wy,4,6);
              g.fill(28,25,38);
            }
          }
        }
      }
    };
    buildSide(3, leftE - 3);
    buildSide(rightE + 3, w - 3);

    // Lamps
    this.lamps = [];
    if (leftE > 50) {
      var lx = leftE * 0.45;
      this.lamps.push({x:lx, y:gY, glowR:random(170,230)});
      g.stroke(70,62,50,60); g.strokeWeight(2.5);
      g.line(lx,gY,lx,gY-115);
      g.noStroke(); g.fill(100,85,60,50); g.ellipse(lx,gY-120,14,9);
    }
    if (w-rightE > 50) {
      var lx = rightE + (w-rightE)*0.55;
      this.lamps.push({x:lx, y:gY, glowR:random(170,230)});
      g.stroke(70,62,50,60); g.strokeWeight(2.5);
      g.line(lx,gY,lx,gY-115);
      g.noStroke(); g.fill(100,85,60,50); g.ellipse(lx,gY-120,14,9);
    }

    g.stroke(90,80,65,12); g.strokeWeight(1); g.line(0,gY,w,gY);
    this.rain = []; this.ripples = [];
  },

  draw: function(w, h) {
    image(this.bg, 0, 0);
    var gY = this.groundY, now = millis();

    this.windAngle += random(-0.002,0.002);
    this.windAngle = constrain(this.windAngle, 0.04, 0.14);

    // Lamp glow
    noStroke();
    for (var i = 0; i < this.lamps.length; i++) {
      var l = this.lamps[i];
      var flk = 1 + sin(frameCount*0.08+l.x)*0.06;
      for (var layer = 0; layer < 6; layer++) {
        var r = l.glowR * flk * (1-layer*0.14);
        fill(250,200,110, 6*(1-layer*0.14));
        ellipse(l.x, l.y-85, r*2.2, r*1.8);
      }
      fill(255,240,195,25); ellipse(l.x, l.y-120, 30, 22);
      fill(255,245,220,15); ellipse(l.x, l.y-105, 55, 45);
    }

    // ── Rain — VISIBLE, dense, angled ──
    while (this.rain.length < 100) {
      this.rain.push({
        x: random(-30, w+30), y: random(-60,-5),
        len: random(15,35), spd: random(5,9),
        drift: this.windAngle * random(0.7,1.3)
      });
    }

    for (var i = this.rain.length-1; i >= 0; i--) {
      var r = this.rain[i];
      r.y += r.spd; r.x += r.drift * r.spd;

      // Alpha: base visible + lamp boost
      var baseA = 30;
      var lampBoost = 0;
      for (var j = 0; j < this.lamps.length; j++) {
        var l = this.lamps[j];
        var dx = r.x-l.x, dy = r.y-(l.y-85);
        var dist = sqrt(dx*dx+dy*dy);
        lampBoost = max(lampBoost, max(0, map(dist, 0, l.glowR*1.2, 40, 0)));
      }
      var totalA = baseA + lampBoost;

      // Color: warm gold near lamps, cool silver elsewhere
      var t = constrain(lampBoost / 40, 0, 1);
      stroke(lerp(170,245,t), lerp(168,225,t), lerp(180,180,t), totalA);
      strokeWeight(lerp(0.6, 0.9, t));
      var endX = r.x + r.drift * r.len;
      line(r.x, r.y, endX, r.y+r.len);

      if (r.y > gY) {
        if (random() < 0.12) {
          this.ripples.push({x:r.x, y:gY+random(2,10), maxR:random(4,10), birth:now, life:random(600,1200), a:random(12,25)});
        }
        this.rain.splice(i,1);
      }
    }

    // Ripples
    noFill();
    for (var i = this.ripples.length-1; i >= 0; i--) {
      var rp = this.ripples[i], age = now-rp.birth;
      if (age > rp.life) { this.ripples.splice(i,1); continue; }
      var p = age/rp.life;
      stroke(130,125,115, rp.a*(1-p)); strokeWeight(0.4);
      ellipse(rp.x, rp.y, rp.maxR*p*2, rp.maxR*p*0.4);
    }
    if (this.ripples.length > 30) this.ripples.splice(0,10);

    // Wet ground reflections
    noStroke();
    for (var i = 0; i < this.lamps.length; i++) {
      var l = this.lamps[i];
      var flk = 1 + sin(frameCount*0.08+l.x)*0.06;
      for (var layer = 0; layer < 4; layer++) {
        var r2 = l.glowR*0.6*flk*(1-layer*0.2);
        var wobble = sin(frameCount*0.025+layer*1.5+l.x*0.01)*8;
        fill(250,195,100, 7*(1-layer*0.22));
        ellipse(l.x+wobble, gY+15+layer*20, r2*1.8, r2*0.25);
      }
    }

    // Ground haze
    noStroke(); fill(60,55,70,5); rect(0, gY-30, w, 30);
  }
};

// ═══════════════════════════════════════════════════
// Scene management
// ═══════════════════════════════════════════════════
function switchScene(key) {
  if (key === currentScene) return;
  // Force reset if stuck for more than 3 seconds
  if (sceneState !== 'idle' && Date.now() - lastStateChange > 3000) {
    sceneState = 'idle';
    sceneAlpha = 1;
  }
  if (sceneState !== 'idle') return;
  lastStateChange = Date.now();
  pendingScene = key;
  sceneState = 'fade-out';
}

function loadScene() {
  try {
    var saved = localStorage.getItem('danbi-bg-scene');
    if (saved && SCENES[saved]) return saved;
  } catch(e) {}
  return 'window';
}

function saveScene(key) {
  try { localStorage.setItem('danbi-bg-scene', key); } catch(e) {}
}

// ═══════════════════════════════════════════════════
// UI + Theme styles
// ═══════════════════════════════════════════════════
function createSwitcherUI() {
  var style = document.createElement('style');
  style.textContent = [
    // Switcher base
    '.scene-switcher{position:fixed;bottom:20px;right:20px;z-index:999;display:flex;gap:2px;opacity:0.35;transition:opacity .3s;font-family:"Source Sans 3","MaruBuri",sans-serif}',
    '.scene-switcher:hover{opacity:0.9}',
    '.scene-btn{padding:5px 10px;background:0;border:0;color:rgba(60,50,40,.55);cursor:pointer;font-size:.68rem;font-family:inherit;position:relative;transition:color .2s}',
    '.scene-btn:hover{color:rgba(60,50,40,.85)}',
    '.scene-btn.active{color:#3c3228;font-weight:600}',
    '.scene-btn.active::after{content:"";position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:70%;height:1px;background:#3c3228}',
    '@media(max-width:768px){.scene-switcher{bottom:65px;right:12px}}',
    // ── Dark theme overrides (city) ──
    'body.scene-dark .sidebar-nav .notebook-tab{color:rgba(255,255,255,.5)}',
    'body.scene-dark .sidebar-nav .notebook-tab:hover{color:rgba(255,255,255,.8);border-left-color:rgba(255,255,255,.3)}',
    'body.scene-dark .sidebar-nav .notebook-tab.active{color:#fff;border-left-color:#fff}',
    'body.scene-dark .lang-switch a, body.scene-dark .lang-switch button{color:rgba(255,255,255,.55)}',
    'body.scene-dark .lang-switch a:hover, body.scene-dark .lang-switch button:hover{color:#fff}',
    'body.scene-dark .footer{color:rgba(255,255,255,.35)}',
    'body.scene-dark .scene-btn{color:rgba(255,255,255,.45)}',
    'body.scene-dark .scene-btn:hover{color:rgba(255,255,255,.85)}',
    'body.scene-dark .scene-btn.active{color:#fff}',
    'body.scene-dark .scene-btn.active::after{background:#fff}'
  ].join('');
  document.head.appendChild(style);

  var container = document.createElement('div');
  container.className = 'scene-switcher';
  var keys = Object.keys(SCENES);
  for (var i = 0; i < keys.length; i++) {
    (function(key) {
      var btn = document.createElement('button');
      btn.className = 'scene-btn' + (key === currentScene ? ' active' : '');
      btn.textContent = SCENES[key].name;
      btn.addEventListener('click', function() {
        switchScene(key);
        var all = container.querySelectorAll('.scene-btn');
        for (var j = 0; j < all.length; j++) all[j].classList.remove('active');
        btn.classList.add('active');
      });
      container.appendChild(btn);
    })(keys[i]);
  }
  document.body.appendChild(container);

  // ── Dandelion watermark (한지 scene only, large background element) ──
  var dandelion = document.createElement('img');
  dandelion.id = 'dandelion-decor';
  dandelion.src = encodeURI('삼현육각.svg');
  dandelion.alt = '';
  dandelion.style.cssText = 'position:fixed;bottom:-7vh;left:2vw;height:65vh;pointer-events:none;z-index:-1;opacity:' + (currentScene === 'window' ? '0.4' : '0') + ';transition:opacity .8s ease';
  document.body.appendChild(dandelion);
}

// ═══════════════════════════════════════════════════
// Utilities
// ═══════════════════════════════════════════════════
function updateNotebookRect() {
  var now = millis();
  if (now - lastRectUpdate > 1000) {
    lastRectUpdate = now;
    var page = document.querySelector('.notebook-page');
    if (page) {
      var r = page.getBoundingClientRect();
      cachedNotebookRect = {left:r.left,right:r.right,top:r.top,bottom:r.bottom};
    }
  }
}

// ═══════════════════════════════════════════════════
// p5.js lifecycle
// ═══════════════════════════════════════════════════
function setup() {
  var c = createCanvas(windowWidth, windowHeight);
  c.position(0, 0);
  c.style('z-index', '-1');
  c.style('position', 'fixed');
  frameRate(30);
  currentScene = loadScene();
  SCENES[currentScene].init(width, height);
  applySceneTheme(currentScene);
  createSwitcherUI();

  // Safety net: restart draw loop if it stops
  setInterval(function() {
    if (Date.now() - lastDrawTime > 2000) {
      try { loop(); } catch(e) {}
    }
  }, 3000);
}

function draw() {
  try {
    lastDrawTime = Date.now();
    background(252, 249, 242);
    updateNotebookRect();

    if (sceneState === 'fade-out') {
      sceneAlpha = max(0, sceneAlpha - 0.04);
      if (sceneAlpha <= 0) {
        currentScene = pendingScene;
        try {
          SCENES[currentScene].init(width, height);
        } catch(initErr) {
          currentScene = 'window';
          SCENES[currentScene].init(width, height);
        }
        applySceneTheme(currentScene);
        sceneState = 'fade-in';
        lastStateChange = Date.now();
      }
    } else if (sceneState === 'fade-in') {
      sceneAlpha = min(1, sceneAlpha + 0.04);
      if (sceneAlpha >= 1) {
        sceneState = 'idle';
        lastStateChange = Date.now();
        saveScene(currentScene);
      }
    }

    drawingContext.globalAlpha = sceneAlpha;
    SCENES[currentScene].draw(width, height);
    drawingContext.globalAlpha = 1;
  } catch(e) {
    sceneState = 'idle';
    sceneAlpha = 1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cachedNotebookRect = null;
  SCENES[currentScene].init(width, height);
}
