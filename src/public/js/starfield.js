/**
 * ==============================================================================
 * # File Name: starfield.js
 * # Version: 3.1
 * # Target Location: src/public/js/starfield.js
 * # Purpose: DELTA SYNTH — Night Meteor Shower Sky (self-animating, zero-blur panoramic sky)
 * #          Public API preserved: `new Starfield('space-bg')` works across all pages.
 * # Red (#CC2200), Black (#1A1A1A), White (#F0F0F0), Hover (#FF4422)
 * # Made And Checked By DELTA SYNTH & Gemini AI
 * # Original by DELTA SYNTH
 * ==============================================================================
 *
 * Design notes
 *  - Static panoramic night sky (zenith-to-horizon gradient, cosmic nebulae, diagonal Milky Way
 *    star-dust river, warm horizon glow, 3-layer mountain silhouettes) is rendered ONCE into an
 *    off-screen canvas at device pixel resolution and rebuilt only on viewport resize.
 *  - ZERO blur / shadowBlur / CSS filter is used anywhere: stars, Milky Way dust, mountain
 *    ridges, and shooting meteors stay 100% pin-sharp.
 *  - Meteors spawn across random sky coordinates with randomized angles, speeds, trail lengths,
 *    and random landing points across the sky, ending with a crisp star-spark flare.
 *  - Animation is delta-time driven, pauses when the tab is hidden, and respects
 *    prefers-reduced-motion (renders a crisp static starry night sky).
 */

const STARFIELD_MAX_DPR = 2;
const STARFIELD_MAX_METEORS = 10;
const STARFIELD_MAX_FRAME_DT = 0.05;
const STARFIELD_RESIZE_DEBOUNCE_MS = 120;

/** Crisp astronomical starlight tints (grouped so fillStyle changes at most 4 times per frame). */
const STARFIELD_STAR_COLORS = [
  'rgb(240,245,255)',
  'rgb(255,232,198)',
  'rgb(185,214,255)',
  'rgb(255,196,184)',
];

/** Meteor tail tints (r,g,b) with selection weights. Brand flame/crimson appears as an accent. */
const STARFIELD_METEOR_PALETTE = [
  { rgb: '255,255,255', weight: 36 },
  { rgb: '255,238,205', weight: 24 },
  { rgb: '175,212,255', weight: 20 },
  { rgb: '255,156,118', weight: 12 },
  { rgb: '255,68,34', weight: 8 },
];

class Starfield {
  constructor(canvasId) {
    this.canvas = Starfield.ensureCanvas(canvasId);
    if (!this.canvas) {
      return;
    }
    // Prevent double initialization on the same canvas element
    if (this.canvas._starfieldInitialized) {
      return;
    }
    this.canvas._starfieldInitialized = true;

    this.ctx = this.canvas.getContext('2d', { alpha: false });
    if (!this.ctx) {
      return;
    }
    this.ctx.imageSmoothingEnabled = true;

    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.sky = null;
    this.stars = [];
    this.meteors = [];
    this.flares = [];
    this.running = false;
    this.animId = null;
    this.lastTime = 0;
    this.clock = 0;
    this.nextSpawnIn = 0.25;
    this.burstLeft = 0;
    this.resizeTimer = null;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = motionQuery.matches;

    this.resize();
    if (!this.reducedMotion) {
      this.seedInitialMeteors();
      this.renderFrame(0.016, true);
      this.start();
    } else {
      this.renderFrame(0, false);
    }

    window.addEventListener('resize', () => this.queueResize(), { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else if (!this.running && !this.reducedMotion) {
        this.start();
      }
    });

    const onMotionChange = (event) => {
      this.reducedMotion = event.matches;
      if (this.reducedMotion) {
        this.stop();
        this.meteors.length = 0;
        this.flares.length = 0;
        this.renderFrame(0, false);
      } else if (!document.hidden && !this.running) {
        this.seedInitialMeteors();
        this.start();
      }
    };
    if (typeof motionQuery.addEventListener === 'function') {
      motionQuery.addEventListener('change', onMotionChange);
    }
  }

  /**
   * Returns the canvas with the given id, creating or normalizing a fixed full-viewport
   * crisp background canvas behind page content.
   */
  static init(canvasId = 'space-bg') {
    Starfield.ensureCanvas(canvasId);
    return new Starfield(canvasId);
  }

  static ensureCanvas(canvasId) {
    let canvas = document.getElementById(canvasId);
    if (!canvas) {
      if (!document.body) {
        return null;
      }
      canvas = document.createElement('canvas');
      canvas.id = canvasId;
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '-1',
      pointerEvents: 'none',
      filter: 'none',
    });
    return canvas;
  }

  /** Deterministic PRNG (mulberry32) so the static night panorama is consistent across visits. */
  static createRandom(seed) {
    let state = seed >>> 0;
    return () => {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  seedInitialMeteors() {
    this.meteors.length = 0;
    const initialCount = 3;
    for (let i = 0; i < initialCount; i += 1) {
      const meteor = this.spawnMeteor();
      if (meteor) {
        const startFraction = 0.18 + i * 0.24;
        meteor.age = (meteor.travel * startFraction) / Math.max(meteor.speed, 1);
      }
    }
  }

  queueResize() {
    if (this.resizeTimer) {
      window.clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = window.setTimeout(() => {
      this.resizeTimer = null;
      this.resize();
      if (!this.running) {
        this.renderFrame(0, false);
      }
    }, STARFIELD_RESIZE_DEBOUNCE_MS);
  }

  resize() {
    if (!this.canvas) {
      return;
    }
    const width = Math.max(window.innerWidth, 1);
    const height = Math.max(window.innerHeight, 1);
    const dpr = Math.min(window.devicePixelRatio || 1, STARFIELD_MAX_DPR);
    if (width === this.width && height === this.height && dpr === this.dpr && this.sky) {
      return;
    }

    this.width = width;
    this.height = height;
    this.dpr = dpr;
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.buildSky();
    this.buildStars();
  }

  /** Renders every static panoramic night sky layer once into an off-screen canvas. */
  buildSky() {
    const w = this.width;
    const h = this.height;
    const sky = document.createElement('canvas');
    sky.width = this.canvas.width;
    sky.height = this.canvas.height;
    const g = sky.getContext('2d');
    if (!g) {
      this.sky = null;
      return;
    }
    g.scale(this.dpr, this.dpr);
    const rand = Starfield.createRandom(2019);
    const diag = Math.hypot(w, h);

    // 1) Deep panoramic night sky gradient (clear midnight indigo -> twilight horizon)
    const base = g.createLinearGradient(0, 0, 0, h);
    base.addColorStop(0, '#020512');
    base.addColorStop(0.36, '#07112b');
    base.addColorStop(0.72, '#0f1d45');
    base.addColorStop(0.9, '#1c183c');
    base.addColorStop(1, '#281734');
    g.fillStyle = base;
    g.fillRect(0, 0, w, h);

    // 2) Subtle cosmic nebula fields
    const nebulae = [
      { x: 0.16, y: 0.2, r: 0.44, rgb: '92,76,204', a: 0.18 },
      { x: 0.82, y: 0.28, r: 0.4, rgb: '52,112,224', a: 0.17 },
      { x: 0.48, y: 0.58, r: 0.48, rgb: '204,34,0', a: 0.09 },
    ];
    for (const n of nebulae) {
      const radius = n.r * Math.max(w, h);
      const cx = n.x * w;
      const cy = n.y * h;
      const grad = g.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, `rgba(${n.rgb},${n.a})`);
      grad.addColorStop(1, `rgba(${n.rgb},0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, w, h);
    }

    // 3) Wide Milky Way arch & crisp micro-star dust
    g.save();
    g.translate(w * 0.5, h * 0.36);
    g.rotate(-0.38);
    const bandHalf = diag * 0.11;
    const band = g.createLinearGradient(0, -bandHalf, 0, bandHalf);
    band.addColorStop(0, 'rgba(175,195,255,0)');
    band.addColorStop(0.5, 'rgba(175,195,255,0.13)');
    band.addColorStop(1, 'rgba(175,195,255,0)');
    g.fillStyle = band;
    g.fillRect(-diag, -bandHalf, diag * 2, bandHalf * 2);

    const dustCount = Math.min(Math.max(Math.round((w * h) / 1200), 420), 1600);
    for (let i = 0; i < dustCount; i += 1) {
      const x = (rand() * 2 - 1) * diag * 0.62;
      const y = ((rand() + rand() + rand() - 1.5) / 1.5) * bandHalf * 0.58;
      const size = 0.45 + rand() * 0.75;
      g.fillStyle = `rgba(228,238,255,${(0.28 + rand() * 0.65).toFixed(3)})`;
      g.fillRect(x, y, size, size);
    }
    g.restore();

    // 4) Warm horizon airglow (DELTA SYNTH crimson/flame accent along distant horizon)
    g.save();
    g.translate(w * 0.5, h * 0.96);
    g.scale(1, 0.3);
    const glow = g.createRadialGradient(0, 0, 0, 0, 0, w * 0.75);
    glow.addColorStop(0, 'rgba(255,68,34,0.24)');
    glow.addColorStop(0.5, 'rgba(204,34,0,0.10)');
    glow.addColorStop(1, 'rgba(204,34,0,0)');
    g.fillStyle = glow;
    g.fillRect(-w * 1.2, -h / 0.3, w * 2.4, h / 0.3 + 20);
    g.restore();

    // 5) Crisp layered distant mountain silhouettes (far -> near)
    const ridges = [
      { y0: 0.85, amp: 0.032, fill: '#090e22', rim: 'rgba(255,96,64,0.15)' },
      { y0: 0.9, amp: 0.024, fill: '#060918', rim: 'rgba(130,165,255,0.08)' },
      { y0: 0.945, amp: 0.016, fill: '#03050c', rim: null },
    ];
    ridges.forEach((ridge, index) => {
      const phases = [rand() * 6.28, rand() * 6.28, rand() * 6.28, rand() * 6.28];
      const freq = ((Math.PI * 2) / (w * 0.92)) * (1 + index * 0.58);
      const baseY = ridge.y0 * h;
      const amp = ridge.amp * h;
      const ridgeY = (x) => {
        let y = baseY;
        let a = amp;
        let f = freq;
        for (let k = 0; k < 4; k += 1) {
          y += a * Math.sin(x * f + phases[k]);
          a *= 0.5;
          f *= 2;
        }
        return y;
      };
      g.beginPath();
      g.moveTo(0, h);
      for (let x = 0; x <= w + 4; x += 4) {
        g.lineTo(x, ridgeY(x));
      }
      g.lineTo(w + 4, h);
      g.closePath();
      g.fillStyle = ridge.fill;
      g.fill();
      if (ridge.rim) {
        g.beginPath();
        for (let x = 0; x <= w + 4; x += 4) {
          if (x === 0) {
            g.moveTo(x, ridgeY(x));
          } else {
            g.lineTo(x, ridgeY(x));
          }
        }
        g.strokeStyle = ridge.rim;
        g.lineWidth = 1;
        g.stroke();
      }
    });

    this.sky = sky;
  }

  /** Creates the crisp twinkling star field across the full panoramic sky (grouped by tint). */
  buildStars() {
    const rand = Starfield.createRandom(54);
    const count = Math.min(Math.max(Math.round((this.width * this.height) / 3600), 220), 560);
    const stars = [];
    for (let i = 0; i < count; i += 1) {
      const pick = rand();
      const tint = pick < 0.64 ? 0 : pick < 0.82 ? 1 : pick < 0.94 ? 2 : 3;
      stars.push({
        x: rand(),
        y: Math.pow(rand(), 1.08) * 0.83,
        radius: 0.48 + Math.pow(rand(), 3) * 1.85,
        base: 0.52 + rand() * 0.48,
        speed: 0.6 + rand() * 2.3,
        phase: rand() * Math.PI * 2,
        tint,
      });
    }
    stars.sort((a, b) => a.tint - b.tint);
    this.stars = stars;
  }

  start() {
    if (this.running) {
      return;
    }
    this.running = true;
    this.lastTime = window.performance.now();
    this.animId = window.requestAnimationFrame((now) => this.loop(now));
  }

  stop() {
    this.running = false;
    if (this.animId) {
      window.cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  destroy() {
    this.stop();
    if (this._onResize && typeof window !== 'undefined') {
      window.removeEventListener('resize', this._onResize);
    }
    if (this._onVisibility && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this._onVisibility);
    }
    if (this.canvas) {
      this.canvas._starfieldInitialized = false;
    }
    this.stars = [];
    this.meteors = [];
    this.flares = [];
  }

  loop(now) {
    if (!this.running) {
      return;
    }
    const dt = Math.min(Math.max((now - this.lastTime) / 1000, 0), STARFIELD_MAX_FRAME_DT);
    this.lastTime = now;
    this.clock += dt;
    this.renderFrame(dt, true);
    this.animId = window.requestAnimationFrame((time) => this.loop(time));
  }

  renderFrame(dt, animate) {
    const ctx = this.ctx;
    if (!ctx || !this.sky) {
      return;
    }
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.globalAlpha = 1;
    ctx.drawImage(this.sky, 0, 0, this.width, this.height);

    this.drawStars(animate ? this.clock : 0);

    if (animate) {
      this.updateSpawner(dt);
      this.drawMeteors(dt);
      this.drawFlares(dt);
    }
    ctx.globalAlpha = 1;
  }

  drawStars(time) {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    let currentTint = -1;
    for (const star of this.stars) {
      if (star.tint !== currentTint) {
        currentTint = star.tint;
        ctx.fillStyle = STARFIELD_STAR_COLORS[currentTint];
      }
      const twinkle = 0.62 + 0.38 * Math.sin(time * star.speed + star.phase);
      const alpha = star.base * twinkle;
      const x = star.x * w;
      const y = star.y * h;
      ctx.globalAlpha = alpha;
      if (star.radius < 0.9) {
        const size = star.radius * 2;
        ctx.fillRect(x - star.radius, y - star.radius, size, size);
      } else {
        ctx.beginPath();
        ctx.arc(x, y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        if (star.radius > 1.28 && twinkle > 0.88) {
          const arm = star.radius * 4.2;
          ctx.globalAlpha = alpha * 0.55;
          ctx.fillRect(x - arm, y - 0.35, arm * 2, 0.7);
          ctx.fillRect(x - 0.35, y - arm, 0.7, arm * 2);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  updateSpawner(dt) {
    this.nextSpawnIn -= dt;
    if (this.nextSpawnIn > 0) {
      return;
    }
    if (this.meteors.length < STARFIELD_MAX_METEORS) {
      this.spawnMeteor();
    }
    if (this.burstLeft > 0) {
      this.burstLeft -= 1;
      this.nextSpawnIn = 0.08 + Math.random() * 0.22;
    } else {
      // Natural random meteor shower bursts of 2-4 shooting stars interspersed with random intervals
      this.burstLeft = Math.random() < 0.24 ? 1 + Math.floor(Math.random() * 3) : 0;
      this.nextSpawnIn = 0.28 + Math.random() * 1.15;
    }
  }

  pickMeteorColor() {
    let total = 0;
    for (const entry of STARFIELD_METEOR_PALETTE) {
      total += entry.weight;
    }
    let roll = Math.random() * total;
    for (const entry of STARFIELD_METEOR_PALETTE) {
      roll -= entry.weight;
      if (roll <= 0) {
        return entry.rgb;
      }
    }
    return STARFIELD_METEOR_PALETTE[0].rgb;
  }

  /**
   * Spawns a meteor at a random upper/mid sky point shooting toward a random target point
   * across the panoramic night sky.
   */
  spawnMeteor() {
    const w = this.width;
    const h = this.height;
    const scale = Math.min(Math.max(Math.max(w, h) / 1200, 0.65), 1.6);

    // Choose a random start point in the upper/mid sky and a random target point lower on screen
    const startX = (Math.random() * 1.16 - 0.08) * w;
    const startY = (Math.random() * 0.56 - 0.06) * h;

    const direction = startX < w * 0.18 ? 1 : startX > w * 0.82 ? -1 : Math.random() < 0.5 ? -1 : 1;
    const angle = ((20 + Math.random() * 48) * Math.PI) / 180;
    const dx = Math.cos(angle) * direction;
    const dy = Math.sin(angle);

    // Random landing altitude above the distant mountain ridge (0.24h .. 0.84h)
    const minDrop = h * 0.14;
    const targetY = Math.min(
      h * 0.84,
      Math.max(startY + minDrop, (0.24 + Math.random() * 0.58) * h)
    );
    const travel = Math.max((targetY - startY) / dy, 130);

    const isBolide = Math.random() < 0.18;
    const speed = (isBolide ? 620 + Math.random() * 520 : 720 + Math.random() * 880) * scale;
    const meteor = {
      x: startX,
      y: startY,
      dx,
      dy,
      speed,
      travel,
      length: (isBolide ? 210 + Math.random() * 190 : 115 + Math.random() * 185) * scale,
      width: (isBolide ? 1.8 + Math.random() * 1.1 : 1.05 + Math.random() * 1.25) * Math.min(scale, 1.3),
      brightness: isBolide ? 0.88 + Math.random() * 0.12 : 0.6 + Math.random() * 0.4,
      rgb: this.pickMeteorColor(),
      age: 0,
      landed: false,
    };
    this.meteors.push(meteor);
    return meteor;
  }

  drawMeteors(dt) {
    const ctx = this.ctx;
    ctx.lineCap = 'round';
    for (let i = this.meteors.length - 1; i >= 0; i -= 1) {
      const m = this.meteors[i];
      m.age += dt;
      const run = m.age * m.speed;
      const headDist = Math.min(run, m.travel);
      const tailDist = Math.max(0, run - m.length);

      if (!m.landed && run >= m.travel) {
        m.landed = true;
        this.spawnFlare(m);
      }
      if (tailDist >= m.travel) {
        this.meteors.splice(i, 1);
        continue;
      }

      const fadeIn = Math.min(m.age / 0.06, 1);
      const fadeOut = m.landed ? Math.max(0, 1 - (run - m.travel) / m.length) : 1;
      const alpha = m.brightness * fadeIn * fadeOut;
      if (alpha <= 0.01) {
        continue;
      }

      const hx = m.x + m.dx * headDist;
      const hy = m.y + m.dy * headDist;
      const tx = m.x + m.dx * tailDist;
      const ty = m.y + m.dy * tailDist;

      const grad = ctx.createLinearGradient(tx, ty, hx, hy);
      grad.addColorStop(0, `rgba(${m.rgb},0)`);
      grad.addColorStop(0.68, `rgba(${m.rgb},0.42)`);
      grad.addColorStop(1, 'rgba(255,255,255,1)');
      ctx.strokeStyle = grad;

      // Crisp outer ionization sheath + pin-sharp core streak (zero blur)
      ctx.globalAlpha = alpha * 0.22;
      ctx.lineWidth = m.width * 3.2;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(hx, hy);
      ctx.stroke();

      ctx.globalAlpha = alpha;
      ctx.lineWidth = m.width;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(hx, hy);
      ctx.stroke();

      if (!m.landed) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(hx, hy, m.width * 0.95, 0, Math.PI * 2);
        ctx.fill();

        // Crisp star-cross glint on bright meteor heads
        const glint = m.width * 3.2;
        ctx.globalAlpha = alpha * 0.65;
        ctx.fillRect(hx - glint, hy - 0.35, glint * 2, 0.7);
        ctx.fillRect(hx - 0.35, hy - glint, 0.7, glint * 2);
      }
    }
    ctx.globalAlpha = 1;
  }

  spawnFlare(meteor) {
    const x = meteor.x + meteor.dx * meteor.travel;
    const y = meteor.y + meteor.dy * meteor.travel;
    if (x < 0 || x > this.width || y < 0 || y > this.height) {
      return;
    }
    const sparks = [];
    for (let i = 0; i < 8; i += 1) {
      sparks.push(Math.random() * Math.PI * 2);
    }
    this.flares.push({
      x,
      y,
      rgb: meteor.rgb,
      size: 10 + meteor.width * 6,
      age: 0,
      duration: 0.55,
      sparks,
    });
  }

  drawFlares(dt) {
    const ctx = this.ctx;
    for (let i = this.flares.length - 1; i >= 0; i -= 1) {
      const f = this.flares[i];
      f.age += dt;
      const p = f.age / f.duration;
      if (p >= 1) {
        this.flares.splice(i, 1);
        continue;
      }
      const fade = 1 - p;
      const ringRadius = f.size * (0.2 + p * 1.6);

      ctx.strokeStyle = `rgb(${f.rgb})`;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = Math.pow(fade, 1.5) * 0.72;
      ctx.beginPath();
      ctx.arc(f.x, f.y, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = Math.pow(fade, 1.2) * 0.82;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const angle of f.sparks) {
        ctx.moveTo(
          f.x + Math.cos(angle) * ringRadius * 0.38,
          f.y + Math.sin(angle) * ringRadius * 0.38
        );
        ctx.lineTo(f.x + Math.cos(angle) * ringRadius, f.y + Math.sin(angle) * ringRadius);
      }
      ctx.stroke();

      ctx.globalAlpha = fade * fade;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(f.x, f.y, Math.max(f.size * 0.2 * fade, 0.45), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}

function enhanceSingerProfile() {
  const profilePanel = document.querySelector('.glass-panel');
  const voicebankLink = profilePanel?.querySelector('a[href*="drive.google.com"]');
  const singerImage = document.querySelector('.singer-image');

  if (!profilePanel || !voicebankLink || !singerImage) {
    return;
  }

  voicebankLink.textContent = `ดาวน์โหลดคลังเสียง ${document.querySelector('h1')?.textContent?.trim() || 'Voicebank'}`;
  voicebankLink.setAttribute('aria-label', 'ดาวน์โหลดคลังเสียงของนักร้อง');

  const imageButton = document.createElement('a');
  imageButton.href = singerImage.currentSrc || singerImage.src;
  imageButton.target = '_blank';
  imageButton.rel = 'noopener noreferrer';
  imageButton.className = voicebankLink.className
    .replace('bg-red-700', 'bg-transparent')
    .replace('hover:bg-red-600', 'hover:bg-red-950');
  imageButton.textContent = 'แตะเพื่อแสดงรูป โปรไฟล์';
  imageButton.setAttribute('aria-label', 'แตะเพื่อแสดงรูปโปรไฟล์');
  imageButton.style.marginLeft = '0.75rem';
  voicebankLink.parentElement?.append(imageButton);
}

function initSingerMobileMenu() {
  const nav = document.querySelector('nav');
  const toggle = nav?.querySelector('button');
  const desktopLinks = nav
    ? Array.from(nav.querySelectorAll('a')).filter((link) => link.closest('.md\\:flex'))
    : [];

  if (!nav || !toggle || desktopLinks.length === 0) {
    return;
  }

  toggle.type = 'button';
  toggle.setAttribute('aria-controls', 'singer-mobile-menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'เปิดเมนู');

  const menu = document.createElement('div');
  menu.id = 'singer-mobile-menu';
  menu.className = 'hidden md:hidden bg-black/95 border-t border-red-900/40';
  const menuInner = document.createElement('div');
  menuInner.className = 'px-4 pt-2 pb-3 space-y-1';

  desktopLinks.forEach((link) => {
    const mobileLink = link.cloneNode(true);
    mobileLink.className =
      'block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700';
    menuInner.append(mobileLink);
  });

  menu.append(menuInner);
  nav.append(menu);

  const setMenuState = (isOpen) => {
    menu.classList.toggle('hidden', !isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'ปิดเมนู' : 'เปิดเมนู');
  };

  toggle.addEventListener('click', () => {
    setMenuState(menu.classList.contains('hidden'));
  });
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuState(false));
  });
}

if (typeof window !== 'undefined') {
  window.Starfield = Starfield;
}

if (typeof document !== 'undefined') {
  const bootStarfield = () => {
    Starfield.ensureCanvas('space-bg');
    new Starfield('space-bg');
    initSingerMobileMenu();
    enhanceSingerProfile();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootStarfield);
  } else {
    bootStarfield();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Starfield };
}
