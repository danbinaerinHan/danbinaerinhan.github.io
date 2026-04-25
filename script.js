document.addEventListener("DOMContentLoaded", function () {
  // Year toggle buttons (index.html news section)
  const yearButtons = document.querySelectorAll('.year-btn');
  const newsLists = Array.from(document.querySelectorAll('[id^="news-"]'));

  if (yearButtons.length && newsLists.length) {
    const setActiveYear = (year) => {
      yearButtons.forEach((b) => b.classList.remove('active'));
      newsLists.forEach((list) => list.classList.add('hidden'));
      const activeBtn = Array.from(yearButtons).find(
        (b) => b.dataset.year === year
      );
      const activeList = document.getElementById(`news-${year}`);
      if (activeBtn) activeBtn.classList.add('active');
      if (activeList) activeList.classList.remove('hidden');
    };

    yearButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        setActiveYear(btn.dataset.year);
      });
    });

    const defaultYearBtn = Array.from(yearButtons).find((b) =>
      b.classList.contains('active')
    );
    if (defaultYearBtn) setActiveYear(defaultYearBtn.dataset.year);
  }

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
