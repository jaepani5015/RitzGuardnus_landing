// Header background on scroll
const header = document.getElementById('header');
const onScroll = () => {
  if (window.scrollY > 20) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Scroll reveal animations
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('inView');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach((el) => io.observe(el));

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
