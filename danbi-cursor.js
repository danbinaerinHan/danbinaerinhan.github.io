// ═══════════════════════════════════════════════════
// 단비 커서 — 마우스가 지나가면 작은 빗방울이 떨어지는 효과
// ═══════════════════════════════════════════════════
(function () {
  var drops = [];
  var MAX_DROPS = 12;
  var DROP_INTERVAL = 140;
  var lastDropTime = 0;
  var curMouseX = -100;
  var curMouseY = -100;

  var container = document.createElement('div');
  container.style.cssText =
    'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;';
  document.body.appendChild(container);

  // 오방색 (비단 배경과 동일한 톤)
  var colors = [
    'rgba(210, 60, 60, 0.35)',
    'rgba(50, 80, 180, 0.35)',
    'rgba(200, 155, 30, 0.35)',
    'rgba(70, 55, 40, 0.3)',
    'rgba(110, 80, 60, 0.3)',
  ];

  function createDrop(x, y) {
    var drop = document.createElement('div');
    var color = colors[Math.floor(Math.random() * colors.length)];
    var size = 2.5 + Math.random() * 2.5;

    drop.style.cssText = [
      'position:absolute',
      'border-radius:50% 50% 50% 50% / 60% 60% 40% 40%',
      'pointer-events:none',
      'will-change:transform,opacity',
      'left:' + x + 'px',
      'top:' + y + 'px',
      'width:' + size + 'px',
      'height:' + (size * 1.4) + 'px',
      'background:' + color,
      'opacity:0.6',
    ].join(';');

    container.appendChild(drop);

    drops.push({
      el: drop,
      x: x,
      y: y,
      vy: 0.4 + Math.random() * 0.4,
      gravity: 0.06 + Math.random() * 0.03,
      opacity: 0.6,
      fadeSpeed: 0.007 + Math.random() * 0.005,
      drift: (Math.random() - 0.5) * 0.25,
    });

    if (drops.length > MAX_DROPS) {
      var old = drops.shift();
      if (old.el.parentNode) {
        old.el.parentNode.removeChild(old.el);
      }
    }
  }

  function animate() {
    for (var i = drops.length - 1; i >= 0; i--) {
      var d = drops[i];

      d.vy += d.gravity;
      d.y += d.vy;
      d.x += d.drift;
      d.opacity -= d.fadeSpeed;

      if (d.opacity <= 0 || d.y > window.innerHeight + 20) {
        if (d.el.parentNode) {
          d.el.parentNode.removeChild(d.el);
        }
        drops.splice(i, 1);
        continue;
      }

      d.el.style.transform =
        'translate(' + (d.x - parseFloat(d.el.style.left)) + 'px, ' +
        (d.y - parseFloat(d.el.style.top)) + 'px)';
      d.el.style.opacity = d.opacity;
    }

    requestAnimationFrame(animate);
  }

  // 본문 영역 캐시
  var notebookRect = null;
  var lastRectCheck = 0;

  function isOverNotebook(x, y) {
    var now = Date.now();
    if (now - lastRectCheck > 500) {
      lastRectCheck = now;
      var page = document.querySelector('.notebook-page');
      if (page) {
        var r = page.getBoundingClientRect();
        notebookRect = { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
      }
    }
    if (!notebookRect) return false;
    return x >= notebookRect.left && x <= notebookRect.right &&
           y >= notebookRect.top && y <= notebookRect.bottom;
  }

  document.addEventListener('mousemove', function (e) {
    curMouseX = e.clientX;
    curMouseY = e.clientY;

    // 본문 위에서는 빗방울을 떨어뜨리지 않음
    if (isOverNotebook(curMouseX, curMouseY)) return;

    var now = Date.now();
    if (now - lastDropTime > DROP_INTERVAL) {
      var offsetX = (Math.random() - 0.5) * 8;
      createDrop(curMouseX + offsetX, curMouseY - 5);
      lastDropTime = now;
    }
  });

  animate();
})();
