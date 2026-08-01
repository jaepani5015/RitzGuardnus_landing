// Header background on scroll
const header = document.getElementById('header');
const onScroll = () => {
  if (window.scrollY > 20) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Scroll reveal animations
// Elements inside .revealGroup all start their (staggered) reveal at once,
// triggered by the group entering view — otherwise a card further down the
// page would only start counting its --d delay once it individually scrolls
// into view, making it feel slower/inconsistent than cards above it.
const groupEls = document.querySelectorAll('.revealGroup');
const groupedRevealEls = new Set();
groupEls.forEach((group) => {
  group.querySelectorAll('.reveal').forEach((el) => groupedRevealEls.add(el));
});

const revealEls = Array.from(document.querySelectorAll('.reveal')).filter(
  (el) => !groupedRevealEls.has(el)
);
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('inView');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach((el) => io.observe(el));

const groupIo = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('inView'));
      groupIo.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
groupEls.forEach((el) => groupIo.observe(el));

// "그리고" scroll-scrub: shows large as it enters view, shrinks as the user
// keeps scrolling, revealing the subtitle/intro text underneath in sync.
const serviceAnd = document.getElementById('serviceAnd');
const serviceScrubEls = document.querySelectorAll('.serviceScrub');
const FONT_MAX = 44;
const FONT_MIN = 13;
const LS_MAX = 0.02;
const LS_MIN = 0.14;

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
const lerp = (a, b, t) => a + (b - a) * t;

let scrubTicking = false;
const updateServiceScrub = () => {
  scrubTicking = false;
  const rect = serviceAnd.getBoundingClientRect();
  const startPoint = window.innerHeight * 0.85;
  const endPoint = window.innerHeight * 0.35;
  const progress = clamp((startPoint - rect.top) / (startPoint - endPoint), 0, 1);

  serviceAnd.style.fontSize = `${lerp(FONT_MAX, FONT_MIN, progress)}px`;
  serviceAnd.style.letterSpacing = `${lerp(LS_MAX, LS_MIN, progress)}em`;

  serviceScrubEls.forEach((el) => {
    el.style.opacity = String(progress);
    el.style.transform = `translateY(${lerp(20, 0, progress)}px)`;
  });
};

if (serviceAnd) {
  document.addEventListener(
    'scroll',
    () => {
      if (!scrubTicking) {
        scrubTicking = true;
        requestAnimationFrame(updateServiceScrub);
      }
    },
    { passive: true }
  );
  updateServiceScrub();
}

// Smooth nav close / active state not needed for single page, but ensure
// anchor links account for fixed header offset via CSS scroll-padding fallback
document.documentElement.style.scrollPaddingTop = '90px';

// Consultation form
const form = document.getElementById('consultForm');
const toast = document.getElementById('toast');
let toastTimer;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  form.reset();
});

// Countdown to listings page launch (2026-08-30 KST)
const cdDays = document.getElementById('cdDays');
const cdHours = document.getElementById('cdHours');
const cdMinutes = document.getElementById('cdMinutes');
const cdSeconds = document.getElementById('cdSeconds');

if (cdDays && cdHours && cdMinutes && cdSeconds) {
  const target = new Date('2026-08-30T00:00:00+09:00').getTime();
  const pad = (n) => String(n).padStart(2, '0');

  const tickCountdown = () => {
    const diff = Math.max(target - Date.now(), 0);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMinutes.textContent = pad(minutes);
    cdSeconds.textContent = pad(seconds);
  };

  tickCountdown();
  setInterval(tickCountdown, 1000);
}
