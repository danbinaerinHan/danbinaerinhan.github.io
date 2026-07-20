// ═══════════════════════════════════════════════════
// News 렌더링 — news-data.js(window.NEWS_ITEMS) 단일 소스에서
// EN/KO 페이지 양쪽의 소식 섹션을 그린다.
// 연도 토글(정간 셀) + featured 카드 + 낙관 도장 + 더 보기 포함.
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
  var COMPACT_VISIBLE = 3; // 연도당 기본 표시되는 컴팩트 항목 수

  function pageLang() {
    var lang = (document.documentElement.lang || 'en').slice(0, 2);
    return lang === 'ko' ? 'ko' : 'en';
  }

  function formatDate(date) {
    return date.replace(/-/g, '.');
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

  function makeFeaturedCard(item, lang) {
    var card = document.createElement('article');
    card.className = 'news-card';

    var top = document.createElement('div');
    top.className = 'news-card-top';
    top.appendChild(makeTag(item, lang));
    var date = document.createElement('span');
    date.className = 'news-card-date';
    date.textContent = formatDate(item.date);
    top.appendChild(date);
    card.appendChild(top);

    // 제목이 카드의 전부 — 본문(en/ko)은 제목이 없을 때만 대신 표시
    if (item.title && item.title[lang]) {
      var title = document.createElement('h3');
      title.className = 'news-card-title';
      title.textContent = item.title[lang];
      card.appendChild(title);
    } else {
      var body = document.createElement('p');
      body.className = 'news-card-body';
      body.innerHTML = item[lang] || item.en;
      card.appendChild(body);
    }

    var chips = makeLinkChips(item, lang);
    if (chips) card.appendChild(chips);
    return card;
  }

  function makeCompactItem(item, lang, hidden) {
    var li = document.createElement('li');
    li.className = 'exp-item news-item' + (hidden ? ' news-overflow' : '');
    var date = document.createElement('span');
    date.className = 'exp-date';
    date.textContent = formatDate(item.date);
    li.appendChild(date);
    li.appendChild(makeTag(item, lang));
    var bodyWrap = document.createElement('div');
    bodyWrap.className = 'exp-body';
    var role = document.createElement('span');
    role.className = 'exp-role';
    role.innerHTML = item[lang] || item.en;
    bodyWrap.appendChild(role);
    li.appendChild(bodyWrap);
    return li;
  }

  function makeYearPanel(year, items, lang) {
    var panel = document.createElement('div');
    panel.className = 'news-year-panel';
    panel.dataset.year = year;

    var featured = items.filter(function (it) { return it.featured; });
    var compact = items.filter(function (it) { return !it.featured; });

    if (featured.length) {
      var grid = document.createElement('div');
      grid.className = 'news-featured';
      featured.forEach(function (it) { grid.appendChild(makeFeaturedCard(it, lang)); });
      panel.appendChild(grid);
    }

    if (compact.length) {
      var list = document.createElement('ul');
      list.className = 'exp-list news-list';
      compact.forEach(function (it, i) {
        list.appendChild(makeCompactItem(it, lang, i >= COMPACT_VISIBLE));
      });
      panel.appendChild(list);
    }

    if (compact.length > COMPACT_VISIBLE) {
      var more = document.createElement('button');
      more.className = 'news-more';
      more.type = 'button';
      var setLabel = function () {
        var expanded = panel.classList.contains('expanded');
        if (lang === 'ko') {
          more.textContent = expanded ? '접기' : year + ' 소식 모두 보기 (' + compact.length + ')';
        } else {
          more.textContent = expanded ? 'Show less' : 'Show all ' + year + ' (' + compact.length + ')';
        }
        more.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      };
      more.addEventListener('click', function () {
        panel.classList.toggle('expanded');
        setLabel();
      });
      setLabel();
      panel.appendChild(more);
    }
    return panel;
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

    var panels = {};
    years.forEach(function (year, i) {
      var btn = document.createElement('button');
      btn.className = 'year-btn' + (i === 0 ? ' active' : '');
      btn.dataset.year = year;
      btn.textContent = year;
      btn.addEventListener('click', function () {
        toggle.querySelectorAll('.year-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        Object.keys(panels).forEach(function (y) {
          panels[y].classList.toggle('hidden', y !== year);
        });
      });
      toggle.appendChild(btn);

      var panel = makeYearPanel(year, byYear[year], lang);
      if (i !== 0) panel.classList.add('hidden');
      panels[year] = panel;
      container.appendChild(panel);
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    window.initNews();
  });
})();
