(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wait = ms => new Promise(r => setTimeout(r, ms));
const rnd = (a, b) => a + Math.random() * (b - a);
const mobile = matchMedia('(max-width:560px)').matches;

/* ---------- Content ---------- */
const DATA = {
  city: [['🏙️','Ocean Domes','Massive transparent structures protect communities from the surrounding ocean.'],['🧪','Marine Research','Scientists study marine life, climate and new technologies from underwater laboratories.'],['🏠','Smart Homes','Homes automatically control temperature, lighting, oxygen and energy consumption.'],['🌊','Ocean Farms','Underwater farms produce food using advanced aquaculture and sustainable technology.']],
  ai: [['🤖','Maintenance Robots','Robots repair underwater structures and pipelines.'],['🧠','City AI','A central AI system monitors oxygen, energy, water pressure and transportation.'],['🐠','Ocean Drones','Autonomous drones monitor marine ecosystems.'],['🧑‍⚕️','AI Healthcare','AI assists doctors and monitors residents inside the underwater city.']],
  transport: [['🚇','Underwater Metro','Fast magnetic trains connect different underwater districts.'],['🚀','Submarine Pods','Personal autonomous pods transport people through underwater tunnels.'],['🛸','Exploration Drones','Small autonomous vehicles explore the surrounding ocean.'],['🌊','Ocean Elevators','Vertical transport systems connect the underwater city to floating platforms at the surface.']],
  energy: [['☀️','Solar Energy','Surface platforms collect solar energy.'],['🌊','Tidal Energy','Ocean currents generate clean electricity.'],['🌬️','Offshore Wind','Floating wind turbines generate renewable energy.'],['🌡️','Ocean Thermal Energy','Temperature differences in ocean water provide additional power.']],
  life: [['🏠','HOME','Residents live inside intelligent underwater habitats.'],['🎓','EDUCATION','Students learn in immersive classrooms and marine research centers.'],['💼','WORK','People work in technology, marine science, engineering, healthcare and creative industries.'],['🏥','HEALTHCARE','Advanced medical facilities use AI and underwater research technologies.'],['🌱','FOOD','Aquaculture and underwater farms provide sustainable food.'],['🎮','ENTERTAINMENT','VR, underwater parks, marine museums and immersive experiences become part of everyday life.']]
};
$$('.grid[data-k]').forEach(g => {
  g.innerHTML = DATA[g.dataset.k].map(([i, t, d]) =>
    `<article class="glass item"><span class="ic">${i}</span><h3>${t}</h3><p>${d}</p></article>`).join('');
});

/* ---------- City SVG (generated) ---------- */
function citySVG() {
  let s = '<svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">';
  s += '<path class="road" d="M0 285 H1200" fill="none"/>';
  let x = 10, k = 0;
  while (x < 1180) {
    const w = rnd(34, 70), h = rnd(70, 210), y = 290 - h;
    s += `<rect class="b" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`;
    for (let wy = y + 10; wy < 280; wy += 16)
      for (let wx = x + 8; wx < x + w - 8; wx += 14)
        if (Math.random() > .45) s += `<rect class="w" x="${wx}" y="${wy}" width="5" height="7" style="--d:${(k++ % 40) * .12}s"/>`;
    x += w + rnd(6, 22);
  }
  [[200, 120], [600, 150], [980, 110]].forEach(([cx, r]) =>
    s += `<path class="dome" d="M${cx - r} 290 A${r} ${r * .8} 0 0 1 ${cx + r} 290Z"/>`);
  s += '<path class="road" d="M0 262 Q300 230 600 262 T1200 250" fill="none"/></svg>';
  return s;
}
$$('[data-city]').forEach(el => el.innerHTML = citySVG());

/* ---------- Ambient: bubbles, particles, fish ---------- */
function ambient(el, extra) {
  const n = extra || +el.dataset.n || (mobile ? 14 : 24);
  const f = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const b = document.createElement('i'), z = rnd(4, 16);
    b.className = 'bub';
    b.style.cssText = `left:${rnd(0, 100)}%;width:${z}px;height:${z}px;--dx:${rnd(-40, 40)}px;animation-duration:${rnd(7, 16)}s;animation-delay:${extra ? 0 : -rnd(0, 14)}s`;
    if (extra) b.dataset.x = 1;
    f.append(b);
  }
  if (!extra) {
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.className = 'part';
      p.style.cssText = `left:${rnd(0, 100)}%;top:${rnd(0, 100)}%;animation-duration:${rnd(4, 9)}s`;
      f.append(p);
    }
    for (let i = 0; i < (mobile ? 5 : 9); i++) {
      const fi = document.createElement('i'), sc = rnd(.6, 1.6);
      fi.className = 'fish';
      fi.style.cssText = `top:${rnd(12, 70)}%;transform:scale(${sc});animation-duration:${rnd(16, 34)}s;animation-delay:${-rnd(0, 30)}s`;
      f.append(fi);
    }
  }
  el.append(f);
}
$$('.ambient').forEach(el => ambient(el));

/* ---------- Page 1: identity ---------- */
const form = $('#idForm'), warn = $('#warn'), nameIn = $('#uName');
let userName = '';
try { nameIn.value = localStorage.getItem('lu_name') || ''; } catch (e) {}
const gmail = /^[a-z0-9](?:[a-z0-9._+-]*[a-z0-9])?@gmail\.com$/i;

form.addEventListener('submit', e => {
  e.preventDefault();
  const name = nameIn.value.trim(), mail = $('#uMail').value.trim();
  if (!name) return warn.textContent = 'IDENTITY REQUIRED';
  if (!gmail.test(mail)) return warn.textContent = 'ENTER A VALID GMAIL ADDRESS';
  warn.textContent = '';
  userName = name;
  try { localStorage.setItem('lu_name', name); } catch (e) {}
  $('#uMail').value = ''; // email is never stored or shown
  startIntro();
});

/* ---------- Cinematic intro ---------- */
const intro = $('#intro'), txt = $('#introText'), depthEl = $('#depth');
let skipped = false, raf = 0;

async function say(t, ms) {
  if (skipped) return;
  txt.style.opacity = 0; await wait(300);
  txt.textContent = t; txt.style.opacity = 1; await wait(ms);
}
function countDepth(steps, total) {
  const t0 = performance.now(), seg = total / (steps.length - 1);
  (function tick(now) {
    const p = Math.min((now - t0) / total, 1), i = Math.min(Math.floor((now - t0) / seg), steps.length - 2);
    const a = steps[i], b = steps[i + 1], q = Math.min(((now - t0) - i * seg) / seg, 1);
    depthEl.textContent = Math.round(a + (b - a) * q) + ' m';
    if (p < 1 && !skipped) raf = requestAnimationFrame(tick); else if (!skipped) depthEl.textContent = '1000 m';
  })(t0);
}
async function startIntro() {
  $('#gate').classList.add('hidden');
  intro.classList.remove('hidden');
  const run = async () => {
    await say('IDENTITY VERIFIED', 1500);
    intro.classList.add('diving'); countDepth([0, 50, 100, 250, 500, 1000], 6500);
    await say('ENTERING DEEP OCEAN', 2200);
    intro.classList.add('deep'); txt.style.opacity = 0; await wait(2000);
    intro.classList.add('city'); await wait(2200);
    intro.classList.add('lit'); await wait(2200);
    await say('WELCOME TO 2050', 1700);
    await say('WELCOME, ' + userName.toUpperCase(), 2000);
  };
  await run();
  finish();
}
function finish() {
  skipped = true; cancelAnimationFrame(raf);
  intro.classList.add('hidden');
  $('#gate').classList.add('hidden');
  $('#site').classList.remove('hidden');
  document.body.classList.remove('locked');
  scrollTo(0, 0);
  const first = $('#home .hero-inner');
  first.style.animation = 'in 1.6s both';
  watch();
}
$('#skip').addEventListener('click', () => { if (!userName) userName = nameIn.value.trim() || 'EXPLORER'; finish(); });

/* ---------- Nav ---------- */
const burger = $('#burger'), menu = $('#menu');
burger.addEventListener('click', () => {
  const o = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', o);
});
$$('#menu a').forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); }));

/* ---------- Scroll reveal, counters, ring ---------- */
function count(el) {
  const to = +el.dataset.to, t0 = performance.now(), d = 1800;
  (function f(now) {
    const p = Math.min((now - t0) / d, 1), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
    el.textContent = v.toLocaleString('en-US');
    if (p < 1) requestAnimationFrame(f);
  })(t0);
}
function watch() {
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.add('in');
    $$('.count', el).forEach(count);
    if (el.id === 'energy') $('#arc').style.strokeDashoffset = 327 * (1 - .96);
    io.unobserve(el);
  }), { threshold: .15 });
  $$('.rv').forEach(el => io.observe(el));
}

/* ---------- Submarine launch ---------- */
const ship = $('#sub'), subMsg = $('#subMsg');
$('#launch').addEventListener('click', async () => {
  ship.classList.remove('go'); void ship.offsetWidth; ship.classList.add('go');
  subMsg.textContent = '';
  await wait(1200); subMsg.textContent = 'ROUTE LOCKED';
  await wait(1800); subMsg.textContent = 'DESTINATION: OCEAN CITY';
});

/* ---------- Ocean City AI ---------- */
const aiBtn = $('#aiBtn'), aiOff = $('#aiOff'), aiMsg = $('#aiMsg'), pulse = $('#pulse');
let aiRun = 0;
aiBtn.addEventListener('click', async () => {
  const id = ++aiRun;
  pulse.classList.remove('go'); void pulse.offsetWidth; pulse.classList.add('go');
  document.body.classList.add('ai-on');
  ambient($('#home .ambient'), mobile ? 20 : 40);
  for (let i = 0; i < 3; i++) {
    const s = document.createElement('div');
    s.className = 'sub-ship go traffic';
    s.style.cssText = `top:${20 + i * 18}%;transform:scale(${.45 + i * .15});animation:cruise ${12 + i * 4}s ${-i * 4}s linear infinite`;
    s.innerHTML = '<i></i>';
    $('#home .ambient').append(s);
  }
  aiBtn.classList.add('hidden'); aiOff.classList.remove('hidden');
  const seq = ['OCEAN CITY AI: ONLINE', 'ALL SYSTEMS OPERATIONAL', 'WELCOME TO YOUR NEW HOME'];
  for (const m of seq) { if (id !== aiRun) return; aiMsg.textContent = m; await wait(1800); }
});
aiOff.addEventListener('click', () => {
  aiRun++;
  document.body.classList.remove('ai-on');
  $$('.traffic, .bub[data-x]').forEach(e => e.remove());
  aiMsg.textContent = 'OCEAN CITY AI: OFFLINE';
  aiOff.classList.add('hidden'); aiBtn.classList.remove('hidden');
});

/* ---------- Deep ocean ---------- */
const abyss = $('#abyss');
$('#diveBtn').addEventListener('click', () => abyss.classList.add('show'));
$('#surf').addEventListener('click', () => abyss.classList.remove('show'));

/* ---------- Return to surface: smooth scroll handled by CSS anchor to #home ---------- */
})();
