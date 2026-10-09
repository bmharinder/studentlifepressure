(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = !!(window.gsap && window.ScrollTrigger);
  if (G) gsap.registerPlugin(ScrollTrigger);
  const KEY = 'pp-intro-seen';
  const store = { get: () => { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } }, set: () => { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} } };
  const pad = n => String(n).padStart(2, '0');
  const glitch = el => { el.classList.remove('glitch'); void el.offsetWidth; el.classList.add('glitch'); };

  /* ---------- INTRO ---------- */
  const intro = $('#intro');
  let tl, started = false;

  function finishIntro(focus) {
    if (tl) tl.kill();
    document.body.classList.remove('lock');
    store.set();
    const hide = () => { intro.style.display = 'none'; if (focus) $('#heroH').focus({ preventScroll: true }); startMain(); };
    if (G && !RM) { startMain(); gsap.to(intro, { opacity: 0, duration: .8, onComplete: () => { intro.style.display = 'none'; if (focus) $('#heroH').focus({ preventScroll: true }); } }); }
    else hide();
  }

  function playIntro() {
    if (store.get()) { intro.style.display = 'none'; document.body.classList.remove('lock'); startMain(); return; }
    if (!G || RM) { intro.classList.add('show'); return; }
    const clock = $('#introClock'), o = { v: 0 };
    gsap.set('.f4 .ln>span', { yPercent: 110, opacity: 0, filter: 'blur(14px)' });
    tl = gsap.timeline()
      .to('.f1', { opacity: 1, duration: .8 })
      .to('.f2', { opacity: 1, duration: .4 }, '+=.3')
      .to(o, { v: 137, duration: 1.4, ease: 'power2.out', onUpdate() { const m = Math.round(o.v), h = m < 60 ? 12 : Math.floor(m / 60); clock.textContent = pad(h) + ':' + pad(m % 60) + ' AM'; } }, '<')
      .to('.f2 p', { opacity: 1, duration: 1.2 })
      .to('.kw', { opacity: .4, duration: 1.4, stagger: .25 }, '<')
      .to('.f2', { opacity: 0, duration: .6 }, '+=.9')
      .set('.f4', { opacity: 1 })
      .to('.f4 .ln>span', { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, stagger: .18, ease: 'power3.out' })
      .to('.sub', { opacity: 1, duration: .8 }, '-=.2')
      .to('.fin .quote', { opacity: 1, duration: .9 })
      .to('#enter', { opacity: 1, y: 0, duration: .6 }, '-=.3');
  }

  $('#enter').addEventListener('click', () => finishIntro(true));
  $('#skipIntro').addEventListener('click', () => finishIntro(true));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && intro.style.display !== 'none') finishIntro(true); });

  /* ---------- MAIN ANIMATIONS ---------- */
  function startMain() {
    if (started) return; started = true;
    if (!G || RM) return;
    gsap.from('#heroH .ln>span', { yPercent: 110, opacity: 0, filter: 'blur(12px)', stagger: .14, duration: 1.1, ease: 'power3.out', delay: .2 });
    gsap.from('.rv', { y: 30, opacity: 0, stagger: .12, duration: .9, delay: .5, ease: 'power2.out' });
    gsap.set('[data-r]', { opacity: 0, y: 40 });
    ScrollTrigger.batch('[data-r]', { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, stagger: .12, duration: .9, ease: 'power2.out', overwrite: true }) });
    gsap.set('.ind em i', { scaleX: 0 });
    ScrollTrigger.create({ trigger: '.meter', start: 'top 75%', once: true, onEnter: () => { $$('.ind em i').forEach(i => gsap.to(i, { scaleX: i.style.getPropertyValue('--v'), duration: 1.2, ease: 'power3.out' })); select(0, true); } });
    // fixed: animate final lines sequentially
    $$('.fl').forEach((l, i) => gsap.set(l, { filter: 'blur(10px)' }));
    ScrollTrigger.batch('.fl', { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { filter: 'blur(0px)', stagger: .35, duration: 1 }) });
    const mm = gsap.matchMedia();
    mm.add('(min-width: 861px)', () => {
      $$('[data-p]').forEach(el => gsap.to(el, { yPercent: +el.dataset.p, ease: 'none', scrollTrigger: { trigger: el.parentElement, scrub: true } }));
    });
    $$('.card .qm').forEach(q => gsap.from(q, { scale: .4, opacity: 0, duration: .9, ease: 'back.out(2)', scrollTrigger: { trigger: q, start: 'top 90%', once: true } }));
  }

  /* ---------- SCROLL: progress + night clock ---------- */
  const prog = $('#progress'), night = $('#night'), nc = $('#nClock'), ths = $$('.th');
  const times = ['11:48 PM', '12:36 AM', '01:24 AM', '02:17 AM'];
  let cur = -1, tick = false;
  function onScroll() {
    tick = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = 'scaleX(' + (max > 0 ? scrollY / max : 0) + ')';
    if (RM) return;
    const r = night.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    const i = Math.min(3, Math.floor(p * 4));
    night.style.setProperty('--dark', i / 3);
    if (i !== cur) { cur = i; ths.forEach((t, k) => t.classList.toggle('on', k === i)); nc.textContent = times[i]; glitch(nc); }
  }
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll); onScroll();

  /* ---------- HERO SPLIT ---------- */
  const split = $('#split'), rng = $('#rng');
  const setX = v => { split.style.setProperty('--x', v + '%'); rng.value = v; };
  rng.addEventListener('input', () => split.style.setProperty('--x', rng.value + '%'));
  split.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const r = split.getBoundingClientRect();
    setX(Math.min(95, Math.max(5, ((e.clientX - r.left) / r.width) * 100)));
  });
  // mouse light (fine pointers only)
  const glow = $('#glow');
  if (matchMedia('(pointer:fine)').matches && !RM) {
    let gx = 0, gy = 0, gt = false;
    addEventListener('pointermove', e => { gx = e.clientX; gy = e.clientY; glow.style.opacity = 1; if (!gt) { gt = true; requestAnimationFrame(() => { glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)'; gt = false; }); } }, { passive: true });
  }

  /* ---------- PRESSURE METER ---------- */
  const M = [
    ['ACADEMIC PRESSURE', .82, 'Exams, deadlines and grades arrive all at once, and it can feel like there is never enough time.'],
    ['SOCIAL EXPECTATIONS', .68, 'Wanting to fit in while living up to what family, friends and society expect.'],
    ['SELF-DOUBT', .74, 'The quiet voice asking whether you are good enough, even when you are doing well.'],
    ['TIME PRESSURE', .9, 'Too many tasks, too few hours. Late nights start to feel normal when they are not.']
  ];
  const arc = $('#arc'), mL = $('#mLabel'), mI = $('#mInfo'), mb = $$('.ind button');
  function select(i, quiet) {
    if (quiet) { arc.style.strokeDashoffset = 565.5 * (1 - .6); return; }
    mb.forEach((b, k) => b.classList.toggle('on', k === i));
    arc.style.strokeDashoffset = 565.5 * (1 - M[i][1]);
    mL.textContent = M[i][0]; mI.textContent = M[i][2] + ' (Illustrative value)';
    glitch(mL);
  }
  mb.forEach(b => b.addEventListener('click', () => select(+b.dataset.i)));
  if (!G || RM) select(0, true);

  /* ---------- PANELS (accordion) ---------- */
  const tone = $('#expect');
  $$('.pn').forEach((p, i) => $('button', p).addEventListener('click', e => {
    const open = !p.classList.contains('open');
    $$('.pn').forEach(x => { x.classList.remove('open'); $('button', x).setAttribute('aria-expanded', 'false'); });
    if (open) { p.classList.add('open'); e.currentTarget.setAttribute('aria-expanded', 'true'); }
    tone.dataset.t = i;
  }));

  /* ---------- COMPARISON ---------- */
  const paths = $$('.cmp .p'), mks = $$('.mk'), tlr = $('#tl'), cmsg = $('#cmsg');
  const lens = paths.map(p => p.getTotalLength());
  function moveMarkers(t) {
    paths.forEach((p, i) => { const pt = p.getPointAtLength(lens[i] * t); mks[i].setAttribute('cx', pt.x); mks[i].setAttribute('cy', pt.y); });
  }
  let revealed = false;
  function reveal() {
    if (revealed) return; revealed = true;
    cmsg.textContent = 'You see someone else’s highlight reel, not their entire journey.';
    glitch(cmsg);
  }
  tlr.addEventListener('input', () => { moveMarkers(tlr.value / 100); if (tlr.value > 15) reveal(); });
  moveMarkers(0);
  $('#play').addEventListener('click', () => {
    const t0 = performance.now(), dur = RM ? 1 : 4200;
    tlr.value = 0;
    (function step(now) {
      const k = Math.min(1, (now - t0) / dur);
      tlr.value = k * 100; moveMarkers(k);
      if (k < 1) requestAnimationFrame(step); else reveal();
    })(t0);
  });

  /* ---------- STORIES FORM ---------- */
  $('#msgForm').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('#msg').value.trim(); if (!v) return;
    $('#msgOut').textContent = '“' + v + '” — shown only on this page. Nothing was sent.';
    $('#msg').value = '';
  });

  /* ---------- SOLUTIONS: tangle -> calm ---------- */
  const lines = $('#lines'), NS = 'http://www.w3.org/2000/svg';
  for (let i = 0; i < 9; i++) {
    const l = document.createElementNS(NS, 'line'), y = 40 + i * 30;
    l.setAttribute('x1', 60); l.setAttribute('x2', 340); l.setAttribute('y1', y); l.setAttribute('y2', y);
    l.style.setProperty('--r', ((i * 53) % 90 - 45) + 'deg');
    l.style.setProperty('--tx', ((i * 37) % 60 - 30) + 'px');
    l.style.setProperty('--ty', ((i * 29) % 50 - 25) + 'px');
    lines.appendChild(l);
  }
  const ut = $('#untangle');
  const setCalm = c => { lines.classList.toggle('calm', c); ut.textContent = c ? 'TANGLE AGAIN' : 'UNTANGLE'; };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((en, ob) => { if (en[0].isIntersecting) { setTimeout(() => setCalm(true), 600); ob.disconnect(); } }, { threshold: .5 }).observe(lines);
  } else setCalm(true);
  ut.addEventListener('click', () => setCalm(!lines.classList.contains('calm')));

  playIntro();
})();
