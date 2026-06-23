// ═══════════════════════════════════════════════════
// 단비가 내린다 (甘雨) — p5.js animated background
// Scene: 한지 (Hanji)
// ═══════════════════════════════════════════════════

var cachedNotebookRect = null;
var lastRectUpdate = 0;
var lastDrawTime = 0;

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

function createDandelionDecor() {
  // Inject hover/click styles
  var style = document.createElement('style');
  style.textContent = [
    // Wrapper for SVG + label
    '#dandelion-wrap{position:fixed;bottom:-7vh;left:2vw;height:65vh;z-index:1;cursor:pointer;transition:transform .5s ease}',
    '#dandelion-wrap:hover{transform:scale(1.03)}',
    '#dandelion-wrap.ip-open{pointer-events:none;opacity:0;transition:opacity .4s ease}',
    // SVG image — behind notebook content
    '#dandelion-decor{height:100%;mix-blend-mode:multiply;opacity:0.45;transition:opacity .5s ease,filter .5s ease;display:block}',
    '#dandelion-wrap:hover #dandelion-decor{opacity:0.8;filter:drop-shadow(0 0 15px rgba(140,100,60,0.3))}',
    // Hover label — body-level so it floats above the notebook panel (never clipped)
    '#dandelion-label{position:fixed;z-index:5;transform:translate(-50%,-50%);white-space:nowrap;font-family:"Spectral","MaruBuri",serif;font-size:0.85rem;font-weight:500;color:rgba(60,50,40,0.9);background:rgba(248,244,238,0.92);padding:5px 14px;border-radius:20px;box-shadow:0 2px 12px rgba(140,100,60,0.2);letter-spacing:0.02em;opacity:0;transition:opacity .35s ease;pointer-events:none}',
    '#dandelion-label.visible{opacity:1}',
    // Notebook content stays above SVG, sidebar allows SVG clicks through
    '.notebook-page{position:relative;z-index:2}',
    '@media(max-width:768px){#dandelion-wrap{height:45vh;left:auto;right:-5vw;bottom:-5vh}#dandelion-label{font-size:0.65rem}}'
  ].join('');
  document.head.appendChild(style);

  var wrap = document.createElement('div');
  wrap.id = 'dandelion-wrap';

  var dandelion = document.createElement('img');
  dandelion.id = 'dandelion-decor';
  dandelion.src = encodeURI('삼현육각.svg');
  dandelion.alt = 'Play the Korean Instruments';
  dandelion.draggable = false;

  var label = document.createElement('span');
  label.id = 'dandelion-label';
  label.textContent = 'Play the Korean Instruments!';

  wrap.appendChild(dandelion);
  document.body.appendChild(wrap);
  document.body.appendChild(label);

  // Show the label over the SVG on hover (label lives above the panel, so it is never clipped)
  function positionLabel() {
    var r = dandelion.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var cy = Math.min(r.top + r.height * 0.42, window.innerHeight - 36);
    label.style.left = cx + 'px';
    label.style.top = cy + 'px';
  }
  wrap.addEventListener('mouseenter', function () {
    positionLabel();
    label.classList.add('visible');
  });
  wrap.addEventListener('mouseleave', function () {
    label.classList.remove('visible');
  });
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
  createDandelionDecor();

  // Safety net: restart draw loop if it stops
  setInterval(function() {
    if (Date.now() - lastDrawTime > 2000) {
      try { loop(); } catch(e) {}
    }
  }, 3000);
}

function draw() {
  lastDrawTime = Date.now();
  clear();
  updateNotebookRect();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cachedNotebookRect = null;
}
