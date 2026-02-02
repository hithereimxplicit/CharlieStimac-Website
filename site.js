// site.js - scroll reveal (no libraries)
(() => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    items.forEach(el => el.classList.add("show"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  items.forEach((el, i) => {
    // subtle stagger (feels premium)
    el.style.transitionDelay = `${Math.min(i * 40, 220)}ms`;
    io.observe(el);
  });
})();