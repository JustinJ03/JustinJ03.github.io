// ── Cursor Glow ──
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top = e.clientY + 'px';
});

// ── Particles ──
const container = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 4 + 2;
  p.style.cssText = `
    width:${size}px; height:${size}px;
    left:${Math.random() * 100}%;
    animation-duration:${Math.random() * 10 + 8}s;
    animation-delay:${Math.random() * 8}s;
    opacity:${Math.random() * 0.2 + 0.05};
  `;
  container.appendChild(p);
}

// ── Typed Text ──
const roles = ['Full-Stack Developer', 'Software Engineer', 'UI/UX Enthusiast', 'Open Source Contributor'];
let ri = 0, ci = 0, del = false;
const el = document.getElementById('typed-text');
function type() {
  const cur = roles[ri];
  if (!del) {
    el.textContent = cur.slice(0, ++ci);
    if (ci === cur.length) { del = true; setTimeout(type, 2000); return; }
  } else {
    el.textContent = cur.slice(0, --ci);
    if (ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(type, del ? 60 : 100);
}
type();

// ── Scroll Reveal ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

// ── Counter Animation ──
const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !e.target.dataset.done) {
      e.target.dataset.done = '1';
      const target = +e.target.dataset.count;
      let cur = 0;
      const step = target / 50;
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        e.target.textContent = Math.floor(cur) + '+';
        if (cur >= target) clearInterval(timer);
      }, 30);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => countObserver.observe(c));

// ── Navbar scroll style ──
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  nav.style.padding = window.scrollY > 60 ? '0.8rem 2rem' : '1.2rem 2rem';
});

// ── Contact Form ──
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const txt = document.getElementById('btnText');
  btn.disabled = true;
  txt.textContent = 'Sending...';
  setTimeout(() => {
    txt.textContent = '✅ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    this.reset();
    setTimeout(() => {
      txt.textContent = 'Send Message ✉️';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1500);
});

// ── Footer Year ──
document.getElementById('year').textContent = new Date().getFullYear();
