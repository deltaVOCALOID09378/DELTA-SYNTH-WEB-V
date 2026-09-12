// DELTA SYNTH — shared site behaviour
document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Active nav link based on current file
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });

  // Roster filter chips
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.vcard');
  if (chips.length && cards.length) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const f = chip.dataset.filter;
        cards.forEach(card => {
          const tags = (card.dataset.tags || '').split(',');
          const show = f === 'all' || tags.includes(f);
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }
});
