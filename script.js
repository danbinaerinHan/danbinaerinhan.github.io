document.addEventListener("DOMContentLoaded", function () {
  // News 섹션은 news.js(window.initNews)가 렌더링한다.

  const copyEmails = document.querySelectorAll('.copy-email');
  if (copyEmails.length) {
    let toastEl = null;
    let toastTimer = null;

    const showToast = (message) => {
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.className = 'copy-toast';
        toastEl.setAttribute('role', 'status');
        toastEl.setAttribute('aria-live', 'polite');
        document.body.appendChild(toastEl);
      }
      toastEl.textContent = message;
      requestAnimationFrame(() => toastEl.classList.add('show'));
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1800);
    };

    const fallbackCopy = (text) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
      document.body.removeChild(ta);
      return ok;
    };

    const copyEmail = async (email) => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
          showToast('복사되었습니다!');
          return;
        }
      } catch (_) { /* fall through */ }
      showToast(fallbackCopy(email) ? '복사되었습니다!' : '복사에 실패했어요');
    };

    copyEmails.forEach((el) => {
      const email = el.dataset.email || el.textContent.trim();
      el.addEventListener('click', () => copyEmail(email));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          copyEmail(email);
        }
      });
    });
  }
});
