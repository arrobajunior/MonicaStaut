(function () {
  'use strict';
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('#progressBar');
  const menuToggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('#mobileMenu');
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const sections = ['inicio', 'sobre', 'pilares', 'palestras', 'casa', 'kindvia', 'contato'];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateScroll() {
    const scroll = window.scrollY || document.documentElement.scrollTop;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (progressBar) progressBar.style.width = Math.min(100, (scroll / max) * 100) + '%';
    header?.classList.toggle('scrolled', scroll > 15);
  }
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) requestAnimationFrame(() => { updateScroll(); ticking = false; });
    ticking = true;
  }, { passive: true });
  updateScroll();

  function closeMenu() {
    menu?.classList.remove('open');
    menu?.setAttribute('inert', '');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('menu-open');
  }
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu?.classList.toggle('open', open);
    if (open) menu?.removeAttribute('inert'); else menu?.setAttribute('inert', '');
    document.body.classList.toggle('menu-open', open);
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => { if (menu?.classList.contains('open') && !header?.contains(event.target)) closeMenu(); });
  window.matchMedia('(min-width: 721px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const revealItems = [...document.querySelectorAll('.reveal:not(.is-visible)')];
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -15px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      const id = visible[0].target.id;
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + id));
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, .1, .3, .5] });
    sections.forEach(id => { const node = document.getElementById(id); if (node) spy.observe(node); });
  }
  document.getElementById('year').textContent = String(new Date().getFullYear());
})();
