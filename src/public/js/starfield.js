class Starfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas?.getContext('2d') ?? null;
    this.stars = [];
    this.numStars = 400;
    this.speed = 1.0;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!this.canvas || !this.ctx) {
      return;
    }

    this.init();
    if (!this.reducedMotion) {
      this.animate();
    }
    window.addEventListener('resize', () => this.resize());
  }

  init() {
    this.resize();
    this.stars = [];
    for (let index = 0; index < this.numStars; index += 1) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        z: Math.random() * this.canvas.width,
        size: Math.random() * 1.5,
      });
    }
  }

  resize() {
    if (!this.canvas) {
      return;
    }
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    if (!this.canvas || !this.ctx) {
      return;
    }

    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    for (const star of this.stars) {
      star.z -= this.speed;
      if (star.z <= 0) {
        star.x = Math.random() * this.canvas.width;
        star.y = Math.random() * this.canvas.height;
        star.z = this.canvas.width;
      }

      const scale = 128.0 / star.z;
      const pointX = (star.x - centerX) * scale + centerX;
      const pointY = (star.y - centerY) * scale + centerY;
      if (pointX >= 0 && pointX <= this.canvas.width && pointY >= 0 && pointY <= this.canvas.height) {
        const size = (1 - star.z / this.canvas.width) * 3;
        const shade = Math.floor((1 - star.z / this.canvas.width) * 255);
        this.ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
        this.ctx.beginPath();
        this.ctx.arc(pointX, pointY, size, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    window.requestAnimationFrame(() => this.animate());
  }
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
  menu.className = 'hidden md:hidden bg-black/95 backdrop-blur-md';
  const menuInner = document.createElement('div');
  menuInner.className = 'px-4 pt-2 pb-3 space-y-1';

  desktopLinks.forEach((link) => {
    const mobileLink = link.cloneNode(true);
    mobileLink.className = 'block px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700';
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

document.addEventListener('DOMContentLoaded', () => {
  new Starfield('space-bg');
  initSingerMobileMenu();
});
