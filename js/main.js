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

  if (toggle && links) {
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
