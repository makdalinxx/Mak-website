/* =============================================
   MAKDALIN MAHA — ELITE PORTFOLIO
   script.js
   ============================================= */

// ── NOISE CANVAS ─────────────────────────────
(function initNoise() {
  const canvas = document.getElementById('noise-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function render() {
    const w = canvas.width, h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      data[i] = data[i+1] = data[i+2] = v;
      data[i+3] = 18;
    }
    ctx.putImageData(imageData, 0, 0);
    animId = requestAnimationFrame(render);
  }

  resize();
  window.addEventListener('resize', resize);
  render();
})();

// ── PRELOADER ─────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    preloader.classList.add('hidden');
    document.querySelector('.hero').classList.add('hero-visible');
  }, 1900);
});

// ── CUSTOM CURSOR ─────────────────────────────
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursor-dot');
  if (!cursor || window.innerWidth < 768) return;

  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    document.body.classList.add('cursor-ready');
  });

  function animate() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top = curY + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  const hoverEls = document.querySelectorAll('a, button, .clink, .project-card, .capstone-card, .add-card, .testi-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
})();

// ── NAVBAR SCROLL ─────────────────────────────
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── MOBILE MENU ───────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
    spans[1].style.transform = 'rotate(-45deg) translate(4px, -4px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.transform = '';
  }
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

// ── THEME TOGGLE ──────────────────────────────
const themeToggle = document.getElementById('themeToggle');
const saved = localStorage.getItem('theme');
if (saved === 'light') document.body.classList.add('light');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});

// ── TYPING EFFECT ─────────────────────────────
(function initTyping() {
  const phrases = ['Frontend Developer', 'UI/UX Enthusiast', 'CSS Artisan', 'AI Explorer', 'Future Software Engineer'];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  const el = document.getElementById('typing');
  if (!el) return;

  function tick() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        return setTimeout(tick, 1800);
      }
      setTimeout(tick, 80);
    } else {
      charIdx--;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        return setTimeout(tick, 400);
      }
      setTimeout(tick, 45);
    }
  }
  setTimeout(tick, 2200);
})();

// ── COUNTER ANIMATION ─────────────────────────
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1600;
  const start = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// ── INTERSECTION OBSERVER ─────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    // Section reveal
    if (el.classList.contains('section-reveal')) {
      el.classList.add('visible');
    }

    // Skills bar animation
    if (el.classList.contains('skills')) {
      el.classList.add('skills-visible');
    }

    // Counters
    el.querySelectorAll('.counter').forEach(animateCounter);

    io.unobserve(el);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section-reveal, .skills').forEach(el => io.observe(el));

// Hero counters
const heroCounterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(animateCounter);
      heroCounterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroCounterObs.observe(heroStats);

// ── SMOOTH ACTIVE NAV LINKS ───────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--accent)';
    }
  });
}, { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' });
sections.forEach(s => navObserver.observe(s));

// ── CAPSTONE MODAL ────────────────────────────
const modal = document.getElementById('capstoneModal');
const addBtn = document.getElementById('addCapstoneBtn');
const closeBtn = document.getElementById('modalClose');
const cancelBtn = document.getElementById('cancelModal');
const saveBtn = document.getElementById('saveCapstone');
const grid = document.getElementById('capstoneGrid');

function openModal() { modal.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal() { modal.classList.remove('open'); document.body.style.overflow = ''; clearForm(); }

addBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

function clearForm() {
  ['cap-title','cap-course','cap-desc','cap-tech','cap-year','cap-demo','cap-github'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const statusEl = document.getElementById('cap-status');
  if (statusEl) statusEl.value = 'In Progress';
}

saveBtn.addEventListener('click', () => {
  const title = document.getElementById('cap-title').value.trim();
  const course = document.getElementById('cap-course').value.trim();
  const desc = document.getElementById('cap-desc').value.trim();
  const tech = document.getElementById('cap-tech').value.trim();
  const year = document.getElementById('cap-year').value.trim();
  const status = document.getElementById('cap-status').value;
  const demo = document.getElementById('cap-demo').value.trim();
  const github = document.getElementById('cap-github').value.trim();

  if (!title || !course || !desc) {
    [document.getElementById('cap-title'), document.getElementById('cap-course'), document.getElementById('cap-desc')].forEach(el => {
      if (!el.value.trim()) {
        el.style.borderColor = 'rgba(255,80,80,0.6)';
        setTimeout(() => el.style.borderColor = '', 1800);
      }
    });
    return;
  }

  const techTags = tech ? tech.split(',').map(t => t.trim()).filter(Boolean) : [];
  const statusClass = status === 'Completed' ? 'completed' : 'in-progress';

  const card = document.createElement('article');
  card.className = 'capstone-card';
  card.innerHTML = `
    <div class="capstone-badge">${course}</div>
    <div class="capstone-icon">🚀</div>
    <h3>${escapeHtml(title)}</h3>
    <p>${escapeHtml(desc)}</p>
    ${techTags.length ? `<div class="capstone-tags">${techTags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>` : ''}
    <div class="capstone-meta">
      <span class="cap-year">${year || new Date().getFullYear()}</span>
      <span class="cap-status ${statusClass}">${status}</span>
    </div>
    ${(demo || github) ? `<div style="margin-top:14px;display:flex;gap:10px;flex-wrap:wrap">
      ${demo ? `<a href="${escapeHtml(demo)}" target="_blank" style="font-size:12px;color:var(--accent);border:1px solid rgba(100,232,180,0.25);padding:5px 12px;border-radius:6px;font-family:var(--font-mono)">Live Demo ↗</a>` : ''}
      ${github ? `<a href="${escapeHtml(github)}" target="_blank" style="font-size:12px;color:var(--text-2);border:1px solid var(--border-2);padding:5px 12px;border-radius:6px;font-family:var(--font-mono)">GitHub ↗</a>` : ''}
    </div>` : ''}
  `;

  // Insert before add button
  grid.insertBefore(card, addBtn);

  // Re-attach cursor hover
  card.addEventListener('mouseenter', () => document.getElementById('cursor')?.classList.add('hovering'));
  card.addEventListener('mouseleave', () => document.getElementById('cursor')?.classList.remove('hovering'));

  // Animate in
  card.style.opacity = '0';
  card.style.transform = 'scale(0.95)';
  requestAnimationFrame(() => {
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    card.style.opacity = '1';
    card.style.transform = 'scale(1)';
  });

  closeModal();
});

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ── CONTACT FORM ──────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-submit');
    const btnText = document.getElementById('submitText');
    btn.disabled = true;
    btnText.textContent = 'Sending...';

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btnText.textContent = '✓ Message Sent!';
        btn.classList.add('sent');
        contactForm.reset();
        setTimeout(() => {
          btnText.textContent = 'Send Message';
          btn.classList.remove('sent');
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      btnText.textContent = 'Failed — Try Again';
      btn.disabled = false;
      setTimeout(() => { btnText.textContent = 'Send Message'; }, 3000);
    }
  });
}

// ── PROJECT CARD 3D TILT ──────────────────────
document.querySelectorAll('.project-card, .capstone-card, .testi-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 768) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-4px) perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── SCROLL PROGRESS ───────────────────────────
(function scrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position:fixed;top:0;left:0;height:2px;
    background:var(--accent);z-index:9999;
    transition:width 0.1s linear;pointer-events:none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    progressBar.style.width = progress + '%';
  }, { passive: true });
})();

// ── GLOWING ACTIVE LINK UNDERLINE ────────────
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const y = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
        mobileMenu.classList.remove('open');
      }
    }
  });
});
