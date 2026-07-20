// ═══════════════════════════════════════════════════
// 먹빛 다크모드 토글
// 초기 테마는 각 페이지 <head>의 인라인 스니펫이
// (localStorage → prefers-color-scheme 순으로) 지정하고,
// 이 파일은 토글 버튼 클릭과 아이콘 상태만 관리한다.
// ═══════════════════════════════════════════════════
(function () {
  var root = document.documentElement;

  function updateIcons() {
    var dark = root.dataset.theme === 'dark';
    document.querySelectorAll('.theme-toggle i').forEach(function (icon) {
      icon.className = dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    });
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.theme-toggle');
    if (!btn) return;
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (err) { /* private mode 등 */ }
    updateIcons();
  });

  document.addEventListener('DOMContentLoaded', updateIcons);
})();
