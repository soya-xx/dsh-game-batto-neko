
(function () {                                                 // 开机加载画面：选语言、按窗口定放大倍数、读下载进度（游戏脚本跑完由外壳脚本末尾撤掉整个 #boot）
  var b = document.getElementById('boot'), msg = document.getElementById('boot-msg'), fill = b.querySelector('.fill'), run = b.querySelector('.runner');
  var TOTAL = 19129762, t0 = Date.now(), lang = 'zh', l = null, i, list;   // TOTAL：游戏脚本的总字数（构建时写入）
  try { l = localStorage.getItem('soya-knight-lang'); } catch (e) { l = null; }   // 和 src/01_i18n.js 同一套：本地设置 > 系统或浏览器语言
  if (l === 'zh' || l === 'en') lang = l;
  else if (l) lang = 'en';
  else {
    list = (window.soyaDesktop && window.soyaDesktop.langs && window.soyaDesktop.langs.length) ? window.soyaDesktop.langs : (navigator.languages && navigator.languages.length ? navigator.languages : (navigator.language ? [navigator.language] : []));
    for (i = 0, lang = list.length ? 'en' : 'zh'; i < list.length; i++) { l = String(list[i]).toLowerCase(); if (/^zh([-_]|$)/.test(l)) { lang = 'zh'; break; } if (/^en([-_]|$)/.test(l)) { lang = 'en'; break; } }
  }
  var T = lang === 'en' ? ['Loading', 'Failed to load. Please refresh.'] : ['加载中', '加载失败，请刷新重试'];
  if (lang === 'en') b.className = 'en';
  b.setAttribute('data-err', T[1]);
  function scale() {                                           // 放大倍数：两倍以上取整数倍（同桌面版游戏画面），不到两倍按比例（同手机上的游戏画面）
    var k = Math.min(window.innerWidth / 640, window.innerHeight / 360);
    b.style.setProperty('--s', String(k >= 2 ? Math.floor(k) : Math.max(0.5, k)));
  }
  scale(); window.addEventListener('resize', scale);
  var shown = -1;
  function tick() {
    if (!b.parentNode || /(^| )err( |$)/.test(b.className)) { clearInterval(iv); return; }   // 游戏已跑起来（整层撤掉）或出错（失败提示不再被进度盖掉）
    var s = document.scripts[document.scripts.length - 1], n = 0, c, f;
    if (s && !s.hasAttribute('data-boot')) for (c = s.firstChild; c; c = c.nextSibling) n += c.length || 0;   // 游戏脚本已经收到的字数（逐段累加，不拼大字符串）
    f = n > 0 && TOTAL > 0 ? Math.min(1, n / TOTAL) : 0.9 * (1 - Math.exp(-(Date.now() - t0) / 9000));      // 读不到时按时间慢慢走，只到九成
    f = Math.min(0.99, f);
    if (f < shown) return;
    shown = f;
    fill.style.transform = 'scaleX(' + f + ')';
    run.style.transform = 'translateX(' + (f * fill.offsetWidth) + 'px)';
    msg.textContent = T[0] + '  ' + Math.floor(f * 100) + '%';
  }
  var iv = setInterval(tick, 100);
  tick();
})();
