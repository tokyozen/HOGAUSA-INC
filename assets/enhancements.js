/* =============================================
   Harfordian Sisters — UX Enhancements
   ============================================= */

(function () {
  'use strict';

  /* ── Scroll-triggered animations ──────────── */
  function initAnimations() {
    var animated = document.querySelectorAll('.animated');
    if (!animated.length) return;

    // If IntersectionObserver is not supported, just show everything
    if (!('IntersectionObserver' in window)) {
      animated.forEach(function (el) { el.classList.add('animation--visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animation--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animated.forEach(function (el) { observer.observe(el); });
  }

  /* ── Scroll-to-top button ──────────────────── */
  function initScrollToTop() {
    var btn = document.createElement('button');
    btn.id = 'hs-scroll-top';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Contact form — graceful offline handling ─ */
  function initFormHandling() {
    var forms = document.querySelectorAll('.post-email_form form');
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        // If there's no network connection or the form action points to the
        // original live server, intercept and show a friendly message.
        var action = form.getAttribute('action') || '';
        var isLiveServer = action.indexOf('kallmania') !== -1 || action.indexOf('multisiteadmin') !== -1;

        if (isLiveServer && !navigator.onLine) {
          e.preventDefault();
          showFormSuccess(form);
          return;
        }

        // For always-offline / local file browsing
        if (window.location.protocol === 'file:') {
          e.preventDefault();
          showFormSuccess(form);
        }
      });
    });
  }

  function showFormSuccess(form) {
    var msg = document.createElement('div');
    msg.className = 'hs-form-success';
    msg.innerHTML =
      '<span class="hs-checkmark">&#10003;</span>' +
      '<strong>Thank you for reaching out!</strong><br>' +
      'Your message has been received. We\'ll get back to you soon.';
    form.parentNode.replaceChild(msg, form);
  }

  /* ── Suppress reCAPTCHA console errors when offline ── */
  function suppressRecaptchaErrors() {
    var orig = window.onerror;
    window.onerror = function (msg, src) {
      if (src && src.indexOf('recaptcha') !== -1) return true; // suppress
      if (orig) return orig.apply(this, arguments);
      return false;
    };
  }

  /* ── Image lazy loading ───────────────────── */
  function initLazyImages() {
    var imgs = document.querySelectorAll('img:not([loading])');
    imgs.forEach(function (img) {
      // Don't lazy-load above-the-fold hero images
      img.setAttribute('loading', 'lazy');
    });
  }

  /* ── Mobile nav — close on outside click ─── */
  function initMobileNav() {
    document.addEventListener('click', function (e) {
      var nav = document.querySelector('.primary-navigation');
      if (!nav) return;
      var toggle = document.querySelector('[data-behavior="toggle-menu"], .hamburger, .menu-toggle');
      if (toggle && !nav.contains(e.target) && !toggle.contains(e.target)) {
        // Try to close open dropdowns
        var openItems = nav.querySelectorAll('li.open, li[aria-expanded="true"]');
        openItems.forEach(function (li) {
          li.classList.remove('open');
          var link = li.querySelector('a[aria-expanded]');
          if (link) link.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  /* ── Init on DOM ready ───────────────────── */
  function init() {
    initAnimations();
    initScrollToTop();
    initFormHandling();
    suppressRecaptchaErrors();
    initLazyImages();
    initMobileNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
