// ═══════════════════════════════════════════════════
// News 데이터 — EN/KO 단일 소스
// 새 소식은 이 배열 맨 위에 항목 하나만 추가하면 됩니다.
//
// 필드:
//   date     : "YYYY-MM-DD" (일자를 모르면 "YYYY-MM"까지만도 가능)
//   category : paper | award | talk | media | appointment | milestone
//   featured : true면 카드형으로 크게 표시 (논문 채택·수상 등 큰 소식)
//   title    : featured 카드의 헤드라인 (featured일 때만)
//   en / ko  : 본문 (인라인 <a>, <em>, <strong> 사용 가능)
//   links    : 칩 버튼으로 표시할 링크 목록 (선택)
// ═══════════════════════════════════════════════════
window.NEWS_ITEMS = [
  {
    id: "gugak-center-lecture-2026",
    date: "2026-08-13",
    category: "talk",
    en: "Lecturing at the National Gugak Center's <em>capacity-building program for Gugak educators</em> on \"Using AI in Gugak Education\".",
    ko: "국립국악원 <em>국악교육자 역량 강화 연수</em>에서 \"국악교육에서 AI 활용하기\"로 강의합니다."
  },
  {
    id: "ismir2026-four-papers",
    date: "2026-07-10",
    category: "paper",
    featured: true,
    title: {
      en: "Four papers accepted to ISMIR 2026",
      ko: "ISMIR 2026 논문 네 편 채택"
    },
    en: "\"Gugak-VocalSet: A Multi-Genre Studio-Quality Dataset of Korean Traditional Singing with Sigimsae Annotations\" has been accepted to <em>ISMIR 2026</em> — along with three co-authored papers on <em>Sogak wonbo</em> OMR, pansori mode classification, and pitch contour tokenization for Gugak.",
    ko: "'Gugak-VocalSet: A Multi-Genre Studio-Quality Dataset of Korean Traditional Singing with Sigimsae Annotations' 논문이 <em>ISMIR 2026</em>에 채택되었습니다. 속악원보 OMR, 판소리 조(mode) 분류, 국악 음고 곡선 토크나이제이션에 관한 공저 논문 세 편도 함께 채택되었습니다."
  },
  {
    id: "mml2026-poster",
    date: "2026-06-18",
    category: "talk",
    en: "Poster presentation at <em>Music, Mathematics &amp; Language 2026</em>. <a href=\"https://sites.google.com/view/music-math-language-2026/home\">link</a>",
    ko: "<em>Music, Mathematics &amp; Language 2026</em> 학회에서 포스터 발표를 진행했습니다. <a href=\"https://sites.google.com/view/music-math-language-2026/home\">링크</a>"
  },
  {
    id: "icccm2026-oral",
    date: "2026-06-17",
    category: "talk",
    en: "My talk on motif repetition and social function in Korean folk songs has been accepted for oral presentation at <em>ICCCM 2026</em>. <a href=\"https://digital.musicology.org/icccm-2026/\">link</a>",
    ko: "한국 민요의 모티프 반복과 사회적 기능에 관한 발표가 <em>ICCCM 2026</em> 구두 발표로 채택되었습니다. <a href=\"https://digital.musicology.org/icccm-2026/\">링크</a>"
  },
  {
    id: "ape-youth-forum-2026",
    date: "2026-06-13",
    category: "talk",
    en: "Presenting \"The Tradition Over-brewing Plugin (전통을 우려먹는 플러그인)\" at the APE Camp Youth Forum, COEX Magok. <a href=\"https://joonhyungbae.github.io/youthforum2026/\">link</a>",
    ko: "코엑스 마곡 APE Camp 청년포럼에서 '전통을 우려먹는 플러그인(The Tradition Over-brewing Plugin)'이라는 주제로 발표합니다. <a href=\"https://joonhyungbae.github.io/youthforum2026/\">링크</a>"
  },
  {
    id: "ksmi2026-poster",
    date: "2026-05-30",
    category: "talk",
    en: "Poster presentation at the Korean Society of Music Informatics (KSMI). <a href=\"https://music-informatics.kr/conferences/ksmi2026\">link</a>",
    ko: "한국음악정보학회(KSMI)에서 포스터를 발표합니다. <a href=\"https://music-informatics.kr/conferences/ksmi2026\">링크</a>"
  },
  {
    id: "tismir-six-dragons",
    date: "2026-04-06",
    category: "paper",
    featured: true,
    title: {
      en: "\"Six Dragons Fly Again\" published in TISMIR",
      ko: "'Six Dragons Fly Again' TISMIR 게재"
    },
    en: "\"Six Dragons Fly Again: A Journey of Reviving 15th-Century Korean Court Music\" has been published in the Digital Musicology special issue of <em>TISMIR</em>. It was a long journey.",
    ko: "'Six Dragons Fly Again: A Journey of Reviving 15th-Century Korean Court Music'이 <em>TISMIR</em> Digital Musicology 특별호에 게재되었습니다. 긴 여정이었어요.",
    links: [
      { label: { en: "article", ko: "논문" }, url: "https://transactions.ismir.net/articles/10.5334/tismir.286" }
    ]
  },
  {
    id: "ape-research-fellow",
    date: "2026-02-11",
    category: "appointment",
    en: "Appointed as a Youth Forum Research Fellow for the Arts and Technology Convergence Creative Talent Education (APE Camp), organized by the Arts Council Korea.",
    ko: "한국문화예술위원회 예술기술융합 창의인재교육 APE camp 청년 포럼 연구위원으로 위촉되었습니다."
  },
  {
    id: "mcst-advisory-committee",
    date: "2026-01-01",
    category: "appointment",
    featured: true,
    title: {
      en: "Appointed to the MCST Cultural and Arts Policy Advisory Committee",
      ko: "문화체육관광부 문화예술정책자문위원회 위원 위촉"
    },
    en: "Appointed as a member of the Cultural and Arts Policy Advisory Committee under the Ministry of Culture, Sports and Tourism, Republic of Korea.",
    ko: "문화체육관광부 문화예술정책자문위원회 위원으로 위촉되었습니다.",
    links: [
      { label: { en: "press release", ko: "보도자료" }, url: "https://www.mcst.go.kr/site/s_notice/press/pressView.jsp?pSeq=22111" }
    ]
  },
  {
    id: "jeongak-dataset-webpage",
    date: "2025-11-14",
    category: "milestone",
    en: "A new webpage has been launched for easy access and download of the <strong>Jeong-ak Dataset</strong>: <a href=\"https://danbinaerinhan.github.io/Jeongganbo_dataset/\">danbinaerinhan.github.io/Jeongganbo_dataset</a>",
    ko: "<strong>정악 데이터셋</strong>을 쉽게 접근하고 내려받을 수 있는 새 웹페이지를 개설했습니다: <a href=\"https://danbinaerinhan.github.io/Jeongganbo_dataset/\">danbinaerinhan.github.io/Jeongganbo_dataset</a>"
  },
  {
    id: "folk-song-society-2025",
    date: "2025-10-17",
    category: "talk",
    en: "Session presentation at the Conference of the Society of the Korean Folk Song.",
    ko: "2025 하반기 한국민요학회 학술대회에서 세션 발표 예정입니다."
  },
  {
    id: "ismir2025-lbd",
    date: "2025-08-14",
    category: "paper",
    en: "\"Motive-level Analysis of Form-Functions Association in Korean Folk Song\" has been accepted to the Late Breaking Demo (LBD) session at ISMIR 2025. <a href=\"https://arxiv.org/pdf/2508.10472\">link</a>",
    ko: "\"Motive-level Analysis of Form-Functions Association in Korean Folk Song\"이 ISMIR 2025 LBD 세션에 게재 승인되었습니다. <a href=\"https://arxiv.org/pdf/2508.10472\">링크</a>"
  },
  {
    id: "gugak-fm-radio-2025",
    date: "2025-06-05",
    category: "media",
    en: "Guest appearance on a Special Radio Program for Gugak Day, Gugak FM. <a href=\"https://www.igbf.kr/gugak_web/?sub_num=760&state=view&idx=265797\">link</a> <a href=\"https://igbf.kr/gugak_web/?sub_num=764&state=view&idx=265509\">link2</a>",
    ko: "국악의 날 기념 국악방송 특집 라디오 프로그램에 출연했습니다. <a href=\"https://www.igbf.kr/gugak_web/?sub_num=760&state=view&idx=265797\">링크</a> <a href=\"https://igbf.kr/gugak_web/?sub_num=764&state=view&idx=265509\">링크2</a>"
  },
  {
    id: "music-educators-50th",
    date: "2025-05-31",
    category: "talk",
    en: "Session presentation at the 50th Anniversary Conference of the Society of Korean Music Educators.",
    ko: "한국음악교육학회 50주년 기념 학술대회에서 세션 발표하였습니다."
  },
  {
    id: "ksmi2025-poster",
    date: "2025-04-18",
    category: "talk",
    en: "Poster presentation at the Korean Society of Music Informatics (KSMI).",
    ko: "한국음악정보학회(KSMI)에서 포스터를 발표하였습니다."
  },
  {
    id: "musaic-ucsd-talk",
    date: "2025-03-13",
    category: "talk",
    en: "Invited talk at MUSAIC, UC San Diego (Remote). <a href=\"https://musaic.ucsd.edu/events/2025/3/13/musaic-seminar-han-danbinaerin\">link</a>",
    ko: "UC San Diego MUSAIC 연구실에서 초청받아 국악생성에 관한 연구를 소개하였습니다. <a href=\"https://musaic.ucsd.edu/events/2025/3/13/musaic-seminar-han-danbinaerin\">링크</a>"
  },
  {
    id: "jocch-jeongganbo",
    date: "2025-01",
    category: "paper",
    featured: true,
    title: {
      en: "Jeongganbo recognition paper accepted to ACM JOCCH",
      ko: "정간보 자동 인식 논문 ACM JOCCH 게재 승인"
    },
    en: "\"On the automatic recognition of Jeongganbo music notation: dataset and approach\" has been accepted to the <em>ACM Journal on Computing and Cultural Heritage (JOCCH)</em>.",
    ko: "'정간보 음악 기보의 자동 인식을 위한 데이터셋과 접근법' 논문이 <em>ACM Journal on Computing and Cultural Heritage (JOCCH)</em>에 게재 승인되었습니다."
  },
  {
    id: "ismir2024-best-paper-nomination",
    date: "2024-10-15",
    category: "award",
    featured: true,
    title: {
      en: "Nominated for the ISMIR 2024 Best Paper Award",
      ko: "ISMIR 2024 최우수 논문상 후보 선정"
    },
    en: "My ISMIR paper got nominated for the <strong>Best Paper Award</strong>!",
    ko: "ISMIR 논문이 <strong>최우수 논문상</strong> 후보에 올랐습니다!"
  },
  {
    id: "ismir2024-lbd-pansori",
    date: "2024-10-12",
    category: "paper",
    en: "\"Towards Computational Analysis of Pansori Singing\" has been accepted to the Late Breaking Demo (LBD) session at ISMIR 2024. <a href=\"https://ismir2024program.ismir.net/lbd_503.html\">link</a>",
    ko: "\"Towards Computational Analysis of Pansori Singing\"이 ISMIR 2024 LBD 세션에 게재 승인되었습니다. <a href=\"https://ismir2024program.ismir.net/lbd_503.html\">링크</a>"
  },
  {
    id: "jeongganbo-preprint",
    date: "2024-07-22",
    category: "paper",
    en: "\"On the Automatic Recognition of Jeongganbo Music Notation: Dataset and Approach\" has been released as a preprint. <a href=\"https://www.researchsquare.com/article/rs-4668854/v1\">link</a>",
    ko: "\"정간보 음악 기보의 자동 인식을 위한 데이터셋과 접근법\"이 사전 공개되었습니다. <a href=\"https://www.researchsquare.com/article/rs-4668854/v1\">링크</a>"
  },
  {
    id: "ismir2024-six-dragons",
    date: "2024-06-21",
    category: "paper",
    featured: true,
    title: {
      en: "\"Six Dragons Fly Again\" accepted to ISMIR 2024",
      ko: "'Six Dragons Fly Again' ISMIR 2024 채택"
    },
    en: "\"Six Dragons Fly Again: Reviving 15th-Century Korean Court Music with Transformers and Novel Encoding\" was accepted to <em>ISMIR 2024</em>.",
    ko: "'Six Dragons Fly Again: Reviving 15th-Century Korean Court Music with Transformers and Novel Encoding'이 ISMIR 2024에 게재 승인되었습니다.",
    links: [
      { label: { en: "ismir 2024", ko: "ismir 2024" }, url: "https://ismir2024.ismir.net/" },
      { label: { en: "news", ko: "뉴스" }, url: "https://sogang.ac.kr/ko/detail/545309" }
    ]
  },
  {
    id: "gugak-center-showcase-2024",
    date: "2024-06-02",
    category: "media",
    en: "<em>Chiwhapyeong</em> and <em>Chwipungnyeong</em> restored by AI were showcased at the National Gugak Center on June 2, 2024. <a href=\"https://www.donga.com/news/Culture/article/all/20240609/125342346/1\">link1</a> <a href=\"https://www.koya-culture.com/mobile/article.html?no=145751\">link2</a>",
    ko: "저희 연구진이 AI로 생성한 <em>치화평</em>과 <em>취풍형</em>이 2024년 6월 2일 국립국악원 풍류사랑방에서 연주되었습니다. <a href=\"https://www.donga.com/news/Culture/article/all/20240609/125342346/1\">링크1</a> <a href=\"https://www.koya-culture.com/mobile/article.html?no=145751\">링크2</a>"
  },
  {
    id: "sejong-birthday-performance",
    date: "2024-05-14",
    category: "media",
    en: "King Sejong's music <em>Chihwapyeong</em> and <em>Chwipunghyeong</em> were reconstructed and performed in a Sejong's birthday commemorative event at Gyeongbokgung. <a href=\"https://www.donga.com/news/Culture/article/all/20240513/124920100/1\">link1</a> <a href=\"https://creative.sogang.ac.kr/%EC%95%84%ED%8A%B8amp%ED%85%8C%ED%81%AC%EB%86%80%EB%A1%9C%EC%A7%80%ED%95%99%EA%B3%BC-%EC%A0%95%EB%8B%A4%EC%83%98-%EA%B5%90%EC%88%98-%EC%97%B0%EA%B5%AD%ED%8C%80_%EC%84%B8%EC%A2%85%EB%8C%80%EC%99%95/\">link2</a> <a href=\"https://www.segye.com/newsView/20240513504438?OutUrl=naver\">link3</a>",
    ko: "경복궁 세종대왕 탄신 기념 행사에서 <em>치화평</em>과 <em>취풍형</em>이 연주되었습니다. <a href=\"https://www.donga.com/news/Culture/article/all/20240513/124920100/1\">링크1</a> <a href=\"https://creative.sogang.ac.kr/%EC%95%84%ED%8A%B8amp%ED%85%8C%ED%81%AC%EB%86%80%EB%A1%9C%EC%A7%80%ED%95%99%EA%B3%BC-%EC%A0%95%EB%8B%A4%EC%83%98-%EA%B5%90%EC%88%98-%EC%97%B0%EA%B5%AD%ED%8C%80_%EC%84%B8%EC%A2%85%EB%8C%80%EC%99%95/\">링크2</a> <a href=\"https://www.segye.com/newsView/20240513504438?OutUrl=naver\">링크3</a>"
  },
  {
    id: "mpi-frankfurt-talk",
    date: "2024-03-01",
    category: "talk",
    en: "I gave a presentation at the <a href=\"https://www.aesthetics.mpg.de/forschung/forschungsgruppe-computational-auditory-perception.html\">\"Computational Auditory Perception\"</a> group at the <a href=\"https://www.aesthetics.mpg.de/\">Max Planck Institute for Empirical Aesthetics</a> in Frankfurt.",
    ko: "프랑크푸르트 막스플랑크 예술인지 연구소의 <a href=\"https://www.aesthetics.mpg.de/forschung/forschungsgruppe-computational-auditory-perception.html\">Computational Auditory Perception</a> 그룹에서 발표했습니다."
  },
  {
    id: "phd-start",
    date: "2024-02-26",
    category: "milestone",
    en: "I started my PhD program at the <a href=\"https://ct.kaist.ac.kr/\">Graduate School of Culture Technology</a> at KAIST.",
    ko: "KAIST <a href=\"https://ct.kaist.ac.kr/\">문화기술대학원</a> 박사과정을 시작했습니다."
  },
  {
    id: "sogang-thesis-award",
    date: "2024-01-22",
    category: "award",
    en: "I received an award for <strong>outstanding paper</strong> at the '2023 Sogang University Graduate School Excellent Thesis Competition'. <a href=\"https://www.sogang.ac.kr/front/boardview.do?pkid=541197&currentPage=1&searchField=ALL&siteGubun=1&menuGubun=1&bbsConfigFK=143&searchLowItem=ALL&searchValue=\">link1</a> <a href=\"http://creative.sogang.ac.kr/%EC%84%9D%EC%82%AC%EA%B3%BC%EC%A0%95-%ED%95%9C%EB%8B%A8%EB%B9%84%EB%82%B4%EB%A6%B0-%EB%B3%B8%EA%B5%90-%EC%A0%9C2%ED%9A%8C-%EB%8C%80%ED%95%99%EC%9B%90%EC%83%9D-%EC%9A%B0%EC%88%98%EB%85%BC%EB%AC%B8/\">link2</a>",
    ko: "'2023 서강대학교 대학원생 우수논문 공모전'에서 <strong>우수논문상</strong>을 수상했습니다. <a href=\"https://www.sogang.ac.kr/front/boardview.do?pkid=541197&currentPage=1&searchField=ALL&siteGubun=1&menuGubun=1&bbsConfigFK=143&searchLowItem=ALL&searchValue=\">링크1</a> <a href=\"http://creative.sogang.ac.kr/%EC%84%9D%EC%82%AC%EA%B3%BC%EC%A0%95-%ED%95%9C%EB%8B%A8%EB%B9%84%EB%82%B4%EB%A6%B0-%EB%B3%B8%EA%B5%90-%EC%A0%9C2%ED%9A%8C-%EB%8C%80%ED%95%99%EC%9B%90%EC%83%9D-%EC%9A%B0%EC%88%98%EB%85%BC%EB%AC%B8/\">링크2</a>"
  },
  {
    id: "masters-graduation",
    date: "2024-01-07",
    category: "milestone",
    en: "I received approval from the review professors for my master's thesis and submitted it. It's my master's graduation!",
    ko: "석사 논문 심사를 통과하고 제출했습니다. 석사 졸업!"
  }
];
