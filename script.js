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
});
