/* SIF landing page behaviour: header state, reveals, scroll-scrubbed hero, strategy tabs, FAQ. */
(() => {
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // skip the 140-frame hero sequence for reduced motion or data saver; the poster image stays
  const lite = reduce || !!(navigator.connection && navigator.connection.saveData);
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* header: transparent over the hero, solid after it */
  const top = $('#top'), heroCard = $('#heroCard'), nav = $('#nav'), menu = $('#menu');
  menu.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open); menu.setAttribute('aria-expanded', open);
  });

  /* reveal on entry (content is visible without it; this only adds the rise) */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));
  $$('.steps, .bento, .fsub, .adv-list, .who-cards, .panel, .der-cards, .rgrid, .notes, .faq-list').forEach(g =>
    [...g.children].forEach((c, i) => { if (!c.classList.contains('fsub')) { c.dataset.st = ''; c.style.setProperty('--i', i); } }));

  /* hero: the video advances frame by frame as the hero scrolls away */
  const FRAMES = 140, canvas = $('#heroCanvas'), ctx = canvas.getContext('2d'), imgs = [];
  let cur = 0, target = 0, drawn = -1;
  const src = i => `assets/video-frames/f${String(i + 1).padStart(3, '0')}.webp`;
  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr); canvas.height = Math.round(canvas.clientHeight * dpr); drawn = -1;
  }
  function pick(i) {
    for (let d = 0; d < FRAMES; d++) for (const j of [i - d, i + d]) { const im = imgs[j]; if (im && im.complete && im.naturalWidth) return im; }
    return null;
  }
  function draw(i) {
    const im = pick(i); if (!im) return;
    // the source frames carry a generator mark in the bottom-right corner; drop the right 14% of each frame so it never shows
    const sw = im.naturalWidth * .86, sh = im.naturalHeight;
    const cw = canvas.width, ch = canvas.height, s = Math.max(cw / sw, ch / sh);
    const w = sw * s, h = sh * s;
    ctx.drawImage(im, 0, 0, sw, sh, (cw - w) * (innerWidth < 768 ? .7 : .62), (ch - h) / 2, w, h); drawn = i;
  }
  const order = [0]; for (let i = 8; i < FRAMES; i += 8) order.push(i); for (let i = 1; i < FRAMES; i++) if (!order.includes(i)) order.push(i);
  let q = 0;
  function load() {
    if (q >= order.length) return;
    const i = order[q++], im = new Image();
    im.onload = im.onerror = () => { if (drawn < 0 || Math.abs(i - cur) < 4) drawn = -1; load(); };
    im.src = src(i); imgs[i] = im;
  }
  if (!lite) for (let k = 0; k < 6; k++) load();

  function onScroll() {
    const r = heroCard.getBoundingClientRect();
    top.classList.toggle('solid', scrollY > 40);
    if (lite) return;
    const p = clamp(-r.top / (r.height * .9));
    target = p * (FRAMES - 1);
    canvas.style.setProperty('--py', (p * r.height * .12) + 'px');
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { size(); onScroll(); });
  function tick() {
    cur += (target - cur) * .2; if (Math.abs(target - cur) < .05) cur = target;
    const f = Math.round(cur); if (f !== drawn) draw(f);
    requestAnimationFrame(tick);
  }
  size(); onScroll();
  if (!lite) requestAnimationFrame(tick);

  /* strategy tabs */
  const tabs = $$('#tabs [role=tab]');
  function select(i, focus) {
    tabs.forEach((t, j) => {
      t.setAttribute('aria-selected', i === j); t.tabIndex = i === j ? 0 : -1;
      const p = $('#panel-' + j); p.hidden = i !== j;
      if (i === j) p.querySelectorAll('.scard').forEach(c => { c.style.animation = 'none'; c.offsetHeight; c.style.animation = ''; });
    });
    if (focus) tabs[i].focus();
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(i));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') select((i + 1) % 3, true);
      if (e.key === 'ArrowLeft') select((i + 2) % 3, true);
    });
  });

  /* FAQ */
  $$('.qa button').forEach(b => b.addEventListener('click', () => {
    const open = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', open); b.closest('.qa').classList.toggle('open', open);
  }));
})();
