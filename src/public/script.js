document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const setExpanded = (control, expanded) => {
    control.setAttribute('aria-expanded', String(expanded));
  };

  const closeMenu = (menu, control, usesHiddenClass = false) => {
    menu.classList.remove('open');
    if (usesHiddenClass) {
      menu.classList.add('hidden');
    } else {
      menu.classList.remove('hidden');
    }
    setExpanded(control, false);
  };

  const toggleMenu = (menu, control, usesHiddenClass = false) => {
    const isOpen = usesHiddenClass ? !menu.classList.contains('hidden') : menu.classList.contains('open');
    if (isOpen) {
      closeMenu(menu, control, usesHiddenClass);
      return;
    }
    menu.classList.remove('hidden');
    menu.classList.add('open');
    setExpanded(control, true);
  };

  // Shared mobile navigation used by the simplified portal pages.
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.type = 'button';
    navToggle.setAttribute('aria-controls', 'site-navigation');
    setExpanded(navToggle, false);
    navLinks.id = 'site-navigation';
    navToggle.addEventListener('click', () => toggleMenu(navLinks, navToggle));
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenu(navLinks, navToggle));
    });
  }

  // Legacy project/singer pages use a Tailwind-style mobile menu.
  const legacyToggle = document.getElementById('mobile-menu-btn');
  const legacyMenu = document.getElementById('mobile-menu');
  if (legacyToggle && legacyMenu) {
    legacyToggle.type = 'button';
    legacyToggle.setAttribute('aria-controls', 'mobile-menu');
    setExpanded(legacyToggle, false);
    legacyToggle.addEventListener('click', () => toggleMenu(legacyMenu, legacyToggle, true));
    legacyMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenu(legacyMenu, legacyToggle, true));
    });
  }

  // Keep the active state correct for both navigation layouts.
  document.querySelectorAll('.nav-links a[href], #mobile-menu a[href]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) {
      return;
    }
    const targetPage = href.split('/').pop()?.split('#')[0];
    if (targetPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Roster filter chips.
  const chips = document.querySelectorAll('.filter-chip');
  const cards = document.querySelectorAll('.vcard');
  if (chips.length && cards.length) {
    const roster = document.querySelector('.roster');
    let emptyState = document.querySelector('[data-filter-empty]');
    if (!emptyState && roster) {
      emptyState = document.createElement('div');
      emptyState.className = 'empty-state roster-empty';
      emptyState.dataset.filterEmpty = 'true';
      emptyState.hidden = true;
      emptyState.style.gridColumn = '1 / -1';
      emptyState.innerHTML = '<h3>ไม่พบคลังเสียงที่ตรงกับตัวกรอง</h3><p>ลองเลือกภาษา หรือประเภทคลังเสียงรายการอื่น</p>';
      roster.append(emptyState);
    }

    const applyFilter = (filter) => {
      let visibleCount = 0;
      cards.forEach((card) => {
        const tags = (card.dataset.tags || '').split(',').map((tag) => tag.trim());
        const show = filter === 'all' || tags.includes(filter);
        card.hidden = !show;
        if (show) {
          visibleCount += 1;
        }
      });
      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
    };

    chips.forEach((chip) => {
      chip.type = 'button';
      chip.setAttribute('aria-pressed', chip.classList.contains('active') ? 'true' : 'false');
      chip.addEventListener('click', () => {
        chips.forEach((item) => {
          item.classList.remove('active');
          item.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        applyFilter(chip.dataset.filter || 'all');
      });
    });

    const activeChip = document.querySelector('.filter-chip.active');
    applyFilter(activeChip?.dataset.filter || 'all');
  }

  // Prevent the page from retaining an open mobile menu after history navigation.
  window.addEventListener('pageshow', () => {
    root.style.setProperty('--page-ready', '1');
  });
});
