// particles.js — shared particle network for text pages
// Per-page config: set window.PARTICLE_CONFIG before loading this script.
// Example:
//   window.PARTICLE_CONFIG = { particleColor: 'rgba(85,234,212,', lineColor: 'rgba(85,234,212,' };
(function () {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const userCfg = window.PARTICLE_CONFIG || {};

  // ── Responsive particle count ─────────────────────────────────────────────
  function getParticleCount() {
    const w = window.innerWidth;
    if (w <= 500) return userCfg.countSm ?? 40;
    if (w <= 800) return userCfg.countMd ?? 90;
    return userCfg.countLg ?? 180;
  }

  // Config — override via window.PARTICLE_CONFIG
  const CFG = {
    particleColor : userCfg.particleColor ?? 'rgba(70,70,70,',
    lineColor     : userCfg.lineColor     ?? 'rgba(70,70,70,',
    maxSize       : userCfg.maxSize       ?? 3,
    speed         : userCfg.speed         ?? 1.2,
    linkDistance  : userCfg.linkDistance  ?? 130,
    mouseDistance : userCfg.mouseDistance ?? 150,
    lineWidth     : userCfg.lineWidth     ?? 0.8,
  };

  let W, H, dpr;
  let mouse = { x: null, y: null };

  // ── Resize handling (retina-aware) ────────────────────────────────────────
  function resize() {
    dpr    = window.devicePixelRatio || 1;
    W      = window.innerWidth;
    H      = window.innerHeight;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  // ── Mouse tracking ────────────────────────────────────────────────────────
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  // ── Particle class ────────────────────────────────────────────────────────
  class Particle {
    constructor() { this.reset(true); }

    reset(initial) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : (Math.random() < 0.5 ? 0 : H);
      this.vx = (Math.random() - 0.5) * CFG.speed;
      this.vy = (Math.random() - 0.5) * CFG.speed;
      this.r  = Math.random() * CFG.maxSize + 0.8;
      this.opacity = Math.random() * 0.5 + 0.4;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = CFG.particleColor + this.opacity + ')';
      ctx.fill();
    }
  }

  // ── Particle pool ─────────────────────────────────────────────────────────
  let particles = [];
  function initParticles() {
    particles = Array.from({ length: getParticleCount() }, () => new Particle());
  }
  initParticles();

  // ── Helpers ───────────────────────────────────────────────────────────────
  function dist(ax, ay, bx, by) {
    const dx = ax - bx, dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function drawLine(x1, y1, x2, y2, d, maxD, extraOpacity) {
    const alpha = (1 - d / maxD) * (extraOpacity ?? 0.6);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = CFG.lineColor + alpha + ')';
    ctx.lineWidth   = CFG.lineWidth;
    ctx.stroke();
  }

  // ── Animation loop ────────────────────────────────────────────────────────
  function animate() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) { p.update(); p.draw(); }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
        if (d < CFG.linkDistance) {
          drawLine(particles[i].x, particles[i].y, particles[j].x, particles[j].y, d, CFG.linkDistance);
        }
      }
    }

    if (mouse.x !== null) {
      for (const p of particles) {
        const d = dist(mouse.x, mouse.y, p.x, p.y);
        if (d < CFG.mouseDistance) {
          drawLine(mouse.x, mouse.y, p.x, p.y, d, CFG.mouseDistance, 0.9);
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
})();
