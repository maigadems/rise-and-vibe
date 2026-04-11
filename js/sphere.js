/**
 * RISE & VIBES — Wireframe Sphere
 * Canvas 2D, no dependencies, mouse parallax, auto-rotation
 */
(function () {
  const canvas = document.getElementById('sphere-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let W, H, CX, CY, R;
  let mouseX = 0, mouseY = 0;
  let rotX = 0, rotY = 0;       // smooth current rotation
  let tgtX = 0, tgtY = 0;       // mouse target
  let spinY = 0;                 // auto-spin

  // ── Config ──────────────────────────────────────────
  const MERIDIANS  = 11;   // longitude lines
  const PARALLELS  = 8;    // latitude lines
  const SEGMENTS   = 64;   // curve smoothness
  const TILT       = 0.38; // fixed X tilt ~22°
  const LINE_W_MIN = 1.5;
  const LINE_W_MAX = 3.0;
  const ALPHA_MIN  = 0.12;
  const ALPHA_MAX  = 0.40;
  const SPIN_SPEED = 0.0025;
  const LERP       = 0.045;

  // Star particles
  const STARS = 60;
  const stars = [];

  // ── Setup ────────────────────────────────────────────
  function resize() {
    W  = canvas.width  = window.innerWidth;
    H  = canvas.height = canvas.offsetHeight || window.innerHeight;
    CX = W / 2;
    CY = H / 2;
    R  = Math.min(W, H) * 0.40;
    if (!stars.length) initStars();
  }

  function initStars() {
    for (let i = 0; i < STARS; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * 0.35 + 0.05,
        dx: (Math.random() - 0.5) * 0.25,
        dy: (Math.random() - 0.5) * 0.25,
      });
    }
  }

  // ── 3-D Math ─────────────────────────────────────────
  function ptOnSphere(theta, phi) {
    return {
      x: R * Math.sin(phi) * Math.cos(theta),
      y: R * Math.cos(phi),
      z: R * Math.sin(phi) * Math.sin(theta),
    };
  }

  function rx3d(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c };
  }

  function ry3d(p, a) {
    const c = Math.cos(a), s = Math.sin(a);
    return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c };
  }

  function project(p) {
    const fov = 900;
    const scale = fov / (p.z + fov);
    return {
      sx: CX + p.x * scale,
      sy: CY + p.y * scale,
      depth: (p.z + R) / (2 * R),  // 0 = back, 1 = front
    };
  }

  function transformPt(theta, phi, ax, ay) {
    let p = ptOnSphere(theta, phi);
    p = rx3d(p, ax);
    p = ry3d(p, ay);
    return p;
  }

  // ── Draw ─────────────────────────────────────────────
  function drawStars() {
    for (const s of stars) {
      s.x += s.dx; s.y += s.dy;
      if (s.x < 0) s.x = W;
      if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H;
      if (s.y > H) s.y = 0;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    }
  }

  function drawSphere(ax, ay) {
    // — Meridians (longitude) —
    for (let m = 0; m < MERIDIANS; m++) {
      const theta = (m / MERIDIANS) * Math.PI * 2;
      const pts = [];

      for (let s = 0; s <= SEGMENTS; s++) {
        const phi = (s / SEGMENTS) * Math.PI;
        const p3  = transformPt(theta, phi, ax, ay);
        const pr  = project(p3);
        pts.push({ sx: pr.sx, sy: pr.sy, depth: pr.depth });
      }

      const avgD = pts.reduce((acc, p) => acc + p.depth, 0) / pts.length;
      const alpha = ALPHA_MIN + avgD * (ALPHA_MAX - ALPHA_MIN);
      const lw    = LINE_W_MIN + avgD * (LINE_W_MAX - LINE_W_MIN);

      ctx.beginPath();
      ctx.moveTo(pts[0].sx, pts[0].sy);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].sx, pts[i].sy);

      ctx.strokeStyle = `rgba(242,242,242,${alpha.toFixed(3)})`;
      ctx.lineWidth   = lw;
      ctx.stroke();
    }

    // — Parallels (latitude) —
    for (let p = 1; p < PARALLELS; p++) {
      const phi  = (p / PARALLELS) * Math.PI;
      const pts  = [];

      for (let s = 0; s <= SEGMENTS; s++) {
        const theta = (s / SEGMENTS) * Math.PI * 2;
        const p3    = transformPt(theta, phi, ax, ay);
        const pr    = project(p3);
        pts.push({ sx: pr.sx, sy: pr.sy, depth: pr.depth });
      }

      const avgD = pts.reduce((acc, pt) => acc + pt.depth, 0) / pts.length;
      const alpha = ALPHA_MIN + avgD * (ALPHA_MAX - ALPHA_MIN);
      const lw    = LINE_W_MIN + avgD * (LINE_W_MAX - LINE_W_MIN);

      ctx.beginPath();
      ctx.moveTo(pts[0].sx, pts[0].sy);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].sx, pts[i].sy);
      ctx.closePath();

      ctx.strokeStyle = `rgba(242,242,242,${alpha.toFixed(3)})`;
      ctx.lineWidth   = lw;
      ctx.stroke();
    }
  }

  // ── Main loop ─────────────────────────────────────────
  function frame() {
    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, W, H);

    drawStars();

    // Mouse parallax target
    const heroEl = document.querySelector('.hero');
    if (heroEl) {
      const rect = heroEl.getBoundingClientRect();
      const nx = (mouseX - rect.left  - rect.width  / 2) / (rect.width  / 2);
      const ny = (mouseY - rect.top   - rect.height / 2) / (rect.height / 2);
      tgtX = ny * 0.25;
      tgtY = nx * 0.35;
    }

    rotX += (tgtX - rotX) * LERP;
    rotY += (tgtY - rotY) * LERP;
    spinY += SPIN_SPEED;

    const ax = TILT + rotX;
    const ay = spinY + rotY;

    drawSphere(ax, ay);

    requestAnimationFrame(frame);
  }

  // ── Events ────────────────────────────────────────────
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
  window.addEventListener('touchmove', e => {
    if (e.touches[0]) { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; }
  }, { passive: true });

  resize();
  frame();
})();
