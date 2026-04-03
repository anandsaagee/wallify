/* ============================================================
   WALLIFY STORE — RESPONSIVE.JS
   Hamburger Menu + Scroll Behaviours + Reveal Animations
   Add <script src="responsive.js"></script> to ALL pages,
   just BEFORE the closing </body> tag.
   ============================================================ */

(function () {
  'use strict';

  /* ───────────────────────────────────────────
     1. NAVBAR — SCROLL CLASS (adds .scrolled)
  ─────────────────────────────────────────── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ───────────────────────────────────────────
     2. HAMBURGER MENU
     Injects the hamburger button + overlay into
     the navbar automatically so you don't need
     to touch every HTML file manually.
  ─────────────────────────────────────────── */
  if (navbar) {
    // --- Create hamburger button ---
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<span></span><span></span><span></span>';

    // --- Create overlay ---
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);

    // --- Insert hamburger before nav-icons (or at end of navbar) ---
    const navIcons = navbar.querySelector('.nav-icons');
    if (navIcons) {
      navbar.insertBefore(hamburger, navIcons);
    } else {
      navbar.appendChild(hamburger);
    }

    const navLinks = navbar.querySelector('.nav-links');

    function openMenu() {
      hamburger.classList.add('open');
      navLinks && navLinks.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      hamburger.setAttribute('aria-expanded', 'true');
      hamburger.setAttribute('aria-label', 'Close navigation menu');
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      navLinks && navLinks.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Open navigation menu');
    }

    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    // Close on nav link click (single-page style navigation)
    if (navLinks) {
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && hamburger.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close menu when resizing to desktop
    const mq = window.matchMedia('(min-width: 769px)');
    mq.addEventListener('change', e => {
      if (e.matches) closeMenu();
    });
  }

  /* ───────────────────────────────────────────
     3. REVEAL ANIMATIONS (IntersectionObserver)
  ─────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0) {
    // Reduce motion check
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      // Skip animations, make all visible immediately
      revealEls.forEach(el => el.classList.add('visible'));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target); // fire once
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      revealEls.forEach(el => observer.observe(el));
    }
  }

  /* ───────────────────────────────────────────
     4. CART COUNT — live update on all pages
  ─────────────────────────────────────────── */
  function refreshCartCount() {
    const counts = document.querySelectorAll('.cart-count');
    if (counts.length === 0) return;

    try {
      const cart = JSON.parse(localStorage.getItem('wallify_cart') || '[]');
      const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      counts.forEach(el => {
        el.textContent = total;
        el.style.display = total > 0 ? 'flex' : 'flex'; // always show
      });
    } catch (_) {
      // Silently fail if localStorage isn't available
    }
  }

  refreshCartCount();

  // Keep in sync across tabs
  window.addEventListener('storage', refreshCartCount);

  /* ───────────────────────────────────────────
     5. PRODUCT PAGE — body class for sticky CTA
  ─────────────────────────────────────────── */
  const mobileStickyDiv = document.getElementById('mobileStickyDiv');
  if (mobileStickyDiv && mobileStickyDiv.style.display !== 'none') {
    document.body.classList.add('has-sticky-buy');
  }

  /* ───────────────────────────────────────────
     6. SMOOTH SCROLL — for anchor links
  ─────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--navbar-height') || '76',
          10
        );
        const top =
          target.getBoundingClientRect().top + window.scrollY - offset - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ───────────────────────────────────────────
     7. TOUCH DEVICE — disable hover zoom on gallery
  ─────────────────────────────────────────── */
  const isTouchDevice =
    'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isTouchDevice) {
    const gallery = document.getElementById('gallery');
    const mainImg = document.getElementById('mainImg');
    if (gallery && mainImg) {
      // Remove mouse-based zoom listeners set by product.html
      gallery.style.cursor = 'default';
      // Reset any in-progress transform
      mainImg.style.transform = 'scale(1)';
    }
  }

  /* ───────────────────────────────────────────
     8. PREVENT BODY SCROLL WHEN MODAL IS OPEN
  ─────────────────────────────────────────── */
  const waModal = document.getElementById('waModal');
  if (waModal) {
    const mutationObserver = new MutationObserver(() => {
      document.body.style.overflow = waModal.classList.contains('active')
        ? 'hidden'
        : '';
    });
    mutationObserver.observe(waModal, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

})();
