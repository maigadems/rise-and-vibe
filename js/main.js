/**
 * RISE & VIBES — Main JavaScript
 */

// ============================================
// NAVIGATION
// ============================================
(function () {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  if (toggle && links && window.innerWidth > 768) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      if (links.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.querySelectorAll('span').forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
        });
      });
    });
  }
})();

// ============================================
// COUNTDOWN TIMER
// ============================================
(function () {
  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
  };

  if (!els.days) return;

  // Target date: release of Lep Lumu Lajj
  const target = new Date('2026-04-25T00:00:00').getTime();

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      els.days.textContent = '00';
      els.hours.textContent = '00';
      els.mins.textContent = '00';
      els.secs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent = pad(mins);
    els.secs.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

// ============================================
// SCROLL ANIMATIONS (IntersectionObserver)
// ============================================
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
})();

// ============================================
// BOUTIQUE FILTER (boutique.html)
// ============================================
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const products = document.querySelectorAll('.product-card[data-category]');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      products.forEach(p => {
        if (filter === 'all' || p.dataset.category === filter) {
          p.style.display = '';
          p.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          p.style.display = 'none';
        }
      });
    });
  });
})();

// ============================================
// SUPPORT AMOUNT SELECTOR (artiste page)
// ============================================
(function () {
  const amounts = document.querySelectorAll('.support-amount');
  if (!amounts.length) return;

  amounts.forEach(btn => {
    btn.addEventListener('click', () => {
      amounts.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
})();

// ============================================
// SMOOTH ANCHOR SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================
// CURSOR GLOW EFFECT (desktop only)
// ============================================
(function () {
  if (window.innerWidth < 768) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    background: radial-gradient(circle, rgba(232,0,28,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    mix-blend-mode: screen;
  `;
  document.body.appendChild(glow);

  let mx = -500, my = -500;
  let cx = -500, cy = -500;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animGlow() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    glow.style.left = cx + 'px';
    glow.style.top = cy + 'px';
    requestAnimationFrame(animGlow);
  }

  animGlow();

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
})();

// ============================================
// DROP COVER — 3D TILT ON MOUSE
// ============================================
(function () {
  const frame = document.getElementById('dropCover');
  if (!frame || window.innerWidth < 768) return;

  const wrap = frame.closest('.drop-cover-wrap');
  if (!wrap) return;

  wrap.addEventListener('mousemove', function (e) {
    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);   // -1 → +1
    const dy = (e.clientY - cy) / (rect.height / 2);
    const rotY = -10 + dx * 6;   // range: -16 → -4 deg
    const rotX =  3 - dy * 4;    // range: -1 → +7 deg
    frame.style.transform = `perspective(1200px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
  });

  wrap.addEventListener('mouseleave', function () {
    frame.style.transform = 'perspective(1200px) rotateY(-10deg) rotateX(3deg)';
  });
})();

// ============================================
// MOBILE BOTTOM NAV — injection + active state
// ============================================
(function () {
  if (window.innerWidth > 768) return;

  const page = window.location.pathname;
  const isHome     = page.endsWith('index.html') || page === '/' || page.endsWith('/');
  const isArtiste  = page.includes('artiste-cab');
  const isAlbum    = page.includes('album');
  const isBoutique = page.includes('boutique');

  const nav = document.createElement('nav');
  nav.className = 'mobile-bottom-nav';
  nav.setAttribute('aria-label', 'Navigation mobile');

  const items = [
    {
      href: isHome ? '#hero' : 'index.html',
      label: 'Accueil',
      active: isHome,
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    },
    {
      href: isHome ? '#studio' : 'index.html#studio',
      label: 'Studio',
      active: false,
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"/></svg>',
    },
    {
      href: isArtiste ? '#' : 'artiste-cab.html',
      label: 'Artistes',
      active: isArtiste || isAlbum,
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    },
    {
      href: isBoutique ? '#' : 'boutique.html',
      label: 'Boutique',
      active: isBoutique,
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    },
    {
      href: isHome ? '#contact' : 'index.html#contact',
      label: 'Réserver',
      active: false,
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    },
  ];

  items.forEach(item => {
    const a = document.createElement('a');
    a.href = item.href;
    if (item.active) a.classList.add('active');
    a.innerHTML = `${item.svg}<span class="mob-nav-label">${item.label}</span><span class="mob-nav-dot"></span>`;
    nav.appendChild(a);
  });

  document.body.appendChild(nav);

  // Active tab on scroll (homepage only)
  if (!isHome) return;
  const sections = document.querySelectorAll('section[id]');
  const tabs = nav.querySelectorAll('a');

  const sectionMap = {
    hero: 0, nouveautes: 0, studio: 1, tarifs: 1,
    artistes: 2, boutique: 3, contact: 4,
  };

  window.addEventListener('scroll', () => {
    let current = 'hero';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
    });
    const idx = sectionMap[current] ?? 0;
    tabs.forEach((t, i) => {
      t.classList.toggle('active', i === idx);
    });
  }, { passive: true });
})();


// ============================================
// ACTIVE NAV LINK on scroll
// ============================================
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) {
        current = sec.id;
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${current}`) {
        link.style.color = 'var(--red)';
      }
    });
  });
})();
