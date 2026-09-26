(() => {
  'use strict';
  const root = document.documentElement;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const button = document.querySelector('#motion-toggle');
  const label = document.querySelector('#motion-label');
  const progress = document.querySelector('.scroll-progress');
  const ticker = document.querySelector('.ticker-track');
  const layers = [...document.querySelectorAll('[data-speed]')].map(element => ({ element, speed: Number(element.dataset.speed), scene: element.closest('.scene') }));
  let reduced = preference.matches;
  let scheduled = false;
  let sceneBounds = new Map();
  function measure() {
    sceneBounds = new Map([...document.querySelectorAll('.scene')].map(scene => [scene, { top: scene.offsetTop, height: scene.offsetHeight }]));
    schedule();
  }
  function renderScroll() {
    scheduled = false;
    const y = window.scrollY;
    const viewport = window.innerHeight;
    const range = root.scrollHeight - viewport;
    progress.style.transform = `scaleX(${range > 0 ? Math.min(1, Math.max(0, y / range)) : 0})`;
    if (reduced) return;
    for (const { element, speed, scene } of layers) {
      const bounds = sceneBounds.get(scene);
      if (bounds.top + bounds.height < y - 250 || bounds.top > y + viewport + 250) continue;
      const distance = scene.id === 'home' ? y : y + viewport / 2 - bounds.top - bounds.height / 2;
      element.style.setProperty('--y', `${Math.max(-190, Math.min(190, distance * speed)).toFixed(2)}px`);
    }
    ticker.style.setProperty('--ticker-x', `${-((y * 0.16) % (ticker.scrollWidth / 2))}px`);
  }
  function schedule() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(renderScroll); }
  }
  function setMotion(value) {
    reduced = value;
    root.classList.toggle('motion-off', reduced);
    button.setAttribute('aria-pressed', String(reduced));
    label.textContent = reduced ? 'Motion off' : 'Motion on';
    button.setAttribute('aria-label', reduced ? 'Enable motion effects' : 'Pause motion effects');
    if (reduced) { cancelAnimationFrame(particleFrame); particleFrame = 0; particles = []; drawParticles(); }
    schedule();
  }
  button.hidden = false;
  button.addEventListener('click', () => setMotion(!reduced));
  preference.addEventListener('change', event => setMotion(event.matches));
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => { measure(); sizeCanvas(); }, { passive: true });
  new ResizeObserver(measure).observe(document.body);

  // A burst is user-triggered. No idle animation loop or scroll interception.
  const canvas = document.querySelector('#particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let particleFrame = 0;
  let lastTime = 0;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let clicks = 0;
  function sizeCanvas() {
    canvasWidth = canvas.clientWidth;
    canvasHeight = canvas.clientHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvasWidth * ratio);
    canvas.height = Math.round(canvasHeight * ratio);
    if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    drawParticles();
  }
  function drawParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }
  function animate(now) {
    const delta = Math.min((now - lastTime) / 16.67, 2);
    lastTime = now;
    for (const p of particles) { p.x += p.vx * delta; p.y += p.vy * delta; p.vy += .045 * delta; p.life -= .008 * delta; }
    particles = particles.filter(p => p.life > 0);
    drawParticles();
    particleFrame = particles.length && !document.hidden ? requestAnimationFrame(animate) : 0;
  }
  document.querySelector('#launch').addEventListener('click', () => {
    clicks++;
    const messages = ['That’s how something new begins.', 'Curiosity looks good on you.', 'Keep making. Keep exploring.'];
    document.querySelector('#launch-status').textContent = messages[(clicks - 1) % messages.length];
    if (reduced || !ctx) return;
    const rect = document.querySelector('#launch').getBoundingClientRect();
    const bounds = canvas.getBoundingClientRect();
    const x = rect.left + rect.width / 2 - bounds.left;
    const y = rect.top + rect.height / 2 - bounds.top;
    particles = particles.slice(-150);
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2, life: 1, size: 2 + Math.random() * 4, color: ['#d2ff5a', '#b3a0e6', '#f1f0e8'][i % 3] });
    }
    if (!particleFrame) { lastTime = performance.now(); particleFrame = requestAnimationFrame(animate); }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(particleFrame); particleFrame = 0; particles = []; drawParticles(); }
  });
  setMotion(reduced);
  measure();
  sizeCanvas();
})();
