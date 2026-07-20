// ═══════════════════════════════════════════════════
// News 렌더링 — news-data.js(window.NEWS_ITEMS) 단일 소스에서
// EN/KO 페이지 양쪽의 소식 섹션을 그린다.
// 에디토리얼 타임라인: 연도별 큰 숫자 구획 + 먹선 스파인 위에
// 소식 노드가 매달리는 세로 흐름. featured는 카드로 확대.
// 연도 버튼은 탭이 아니라 해당 연도로 점프하는 내비.
// spa-nav.js가 콘텐츠 교체 후 window.initNews()를 다시 호출한다.
// ═══════════════════════════════════════════════════
(function () {
  var CATEGORIES = {
    paper:       { short: { en: 'paper', ko: '논문' },   full: { en: 'Paper',       ko: '논문' } },
    award:       { short: { en: 'award', ko: '수상' },   full: { en: 'Award',       ko: '수상' } },
    talk:        { short: { en: 'talk',  ko: '발표' },   full: { en: 'Talk',        ko: '발표' } },
    media:       { short: { en: 'media', ko: '미디어' }, full: { en: 'Media',       ko: '미디어' } },
    appointment: { short: { en: 'appt',  ko: '위촉' },   full: { en: 'Appointment', ko: '위촉' } },
    milestone:   { short: { en: 'note',  ko: '소식' },   full: { en: 'Milestone',   ko: '소식' } }
  };

  function pageLang() {
    var lang = (document.documentElement.lang || 'en').slice(0, 2);
    return lang === 'ko' ? 'ko' : 'en';
  }

  // "2026-07-10" → "07.10", "2025-01" → "01" (연도는 구획 헤더가 담당)
  function shortDate(date) {
    return date.slice(5).replace(/-/g, '.') || date;
  }

  function makeTag(item, lang) {
    var cat = CATEGORIES[item.category] || CATEGORIES.milestone;
    var tag = document.createElement('span');
    tag.className = 'news-tag tag-' + (item.category || 'milestone');
    tag.textContent = cat.short[lang];
    tag.title = cat.full[lang];
    tag.setAttribute('aria-label', cat.full[lang]);
    return tag;
  }

  function makeLinkChips(item, lang) {
    if (!Array.isArray(item.links) || !item.links.length) return null;
    var wrap = document.createElement('div');
    wrap.className = 'news-card-links';
    item.links.forEach(function (link) {
      var a = document.createElement('a');
      a.className = 'pdf-btn';
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = (link.label && link.label[lang]) || 'link';
      wrap.appendChild(a);
    });
    return wrap;
  }

  function makeNode(item, lang) {
    var li = document.createElement('li');
    li.className = 'news-node' + (item.featured ? ' news-node--featured' : '');

    var meta = document.createElement('div');
    meta.className = 'news-node-meta';
    var time = document.createElement('time');
    time.className = 'news-node-date';
    time.dateTime = item.date;
    time.textContent = shortDate(item.date);
    time.title = item.date.replace(/-/g, '.');
    meta.appendChild(time);
    meta.appendChild(makeTag(item, lang));
    li.appendChild(meta);

    var body = document.createElement('div');
    body.className = 'news-node-body';

    if (item.featured) {
      var card = document.createElement('article');
      card.className = 'news-card';
      if (item.title && item.title[lang]) {
        var title = document.createElement('h3');
        title.className = 'news-card-title';
        title.textContent = item.title[lang];
        card.appendChild(title);
      }
      var cardBody = document.createElement('p');
      cardBody.className = 'news-card-body';
      cardBody.innerHTML = item[lang] || item.en;
      card.appendChild(cardBody);
      var chips = makeLinkChips(item, lang);
      if (chips) card.appendChild(chips);
      body.appendChild(card);
    } else {
      var text = document.createElement('p');
      text.className = 'news-node-text';
      text.innerHTML = item[lang] || item.en;
      body.appendChild(text);
      var extraChips = makeLinkChips(item, lang);
      if (extraChips) body.appendChild(extraChips);
    }

    li.appendChild(body);
    return li;
  }

  window.initNews = function () {
    var section = document.getElementById('news');
    if (!section || !Array.isArray(window.NEWS_ITEMS)) return;
    var toggle = section.querySelector('.year-toggle');
    var container = section.querySelector('#news-container');
    if (!toggle || !container) return;

    var lang = pageLang();
    var items = window.NEWS_ITEMS.slice().sort(function (a, b) {
      return a.date < b.date ? 1 : -1;
    });

    // 연도별 그룹핑 (내림차순)
    var byYear = {};
    var years = [];
    items.forEach(function (it) {
      var year = it.date.slice(0, 4);
      if (!byYear[year]) { byYear[year] = []; years.push(year); }
      byYear[year].push(it);
    });

    toggle.innerHTML = '';
    container.innerHTML = '';

    var blocks = {};
    years.forEach(function (year, i) {
      var block = document.createElement('section');
      block.className = 'news-year';
      block.id = 'news-year-' + year;
      if (i !== 0) block.classList.add('hidden');

      var header = document.createElement('header');
      header.className = 'news-year-header';
      var num = document.createElement('span');
      num.className = 'news-year-num';
      num.textContent = year;
      header.appendChild(num);
      block.appendChild(header);

      var list = document.createElement('ol');
      list.className = 'news-timeline';
      byYear[year].forEach(function (it) { list.appendChild(makeNode(it, lang)); });
      block.appendChild(list);
      container.appendChild(block);
      blocks[year] = block;

      // 연도 토글 (정간 셀) — 선택한 연도만 표시
      var btn = document.createElement('button');
      btn.className = 'year-btn' + (i === 0 ? ' active' : '');
      btn.dataset.year = year;
      btn.textContent = year;
      btn.addEventListener('click', function () {
        toggle.querySelectorAll('.year-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        Object.keys(blocks).forEach(function (y) {
          blocks[y].classList.toggle('hidden', y !== year);
        });
        // 숨김 상태로 관찰되던 노드는 IO가 다시 발화하지 않을 수 있어
        // 전환 시 스태거로 직접 등장시킨다
        block.querySelectorAll('.news-node.reveal:not(.in-view)').forEach(function (node, idx) {
          setTimeout(function () { node.classList.add('in-view'); }, 40 * idx);
        });
      });
      toggle.appendChild(btn);
    });

    // 스크롤 등장 모션 — reduced-motion에서는 CSS가 비활성화
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      container.querySelectorAll('.news-node').forEach(function (node) {
        node.classList.add('reveal');
        io.observe(node);
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.initNews();
  });
})();
