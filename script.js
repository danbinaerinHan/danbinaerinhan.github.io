document.addEventListener("DOMContentLoaded", function () {
  // News 섹션은 news.js(window.initNews)가 렌더링한다.

  const copyEmails = document.querySelectorAll('.copy-email');
  if (copyEmails.length) {
    // 토스트 문구는 페이지 언어를 따른다 (news.js의 pageLang와 같은 규칙)
    const lang = (document.documentElement.lang || 'en').slice(0, 2) === 'ko' ? 'ko' : 'en';
    const COPY_MSG = {
      ok:   { en: 'Copied!',        ko: '복사되었습니다!' },
      fail: { en: 'Copy failed',    ko: '복사에 실패했어요' }
    };

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
          showToast(COPY_MSG.ok[lang]);
          return;
        }
      } catch (_) { /* fall through */ }
      showToast(COPY_MSG[fallbackCopy(email) ? 'ok' : 'fail'][lang]);
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
