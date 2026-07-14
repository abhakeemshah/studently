// landing.js — Landing page UI script.
// Hover/click/keyboard enhancements for the entry page. Loaded by
// index.html AFTER landing.css. Classic <script src> so file:// works.
//
// Concerns:
//   * Theme toggle (🌙/☀️) — persists in localStorage under 'appTheme'
//   * pulseButton() — mirrors the same .is-pressed visual vocabulary
//     used by app.js so keyboard-driven clicks feel tactile.
//   * Track-card click handling — <a href> already navigates by default;
//     the script only adds the press-pulse visual.

(function () {
    'use strict';

    // --- 1. Theme (persists across pages under key 'appTheme') ---
    const THEME_KEY = 'appTheme';
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
        body.setAttribute('data-theme', savedTheme);
    }
    if (themeBtn) {
        syncThemeIcon();
        themeBtn.addEventListener('click', () => {
            const current = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', next);
            localStorage.setItem(THEME_KEY, next);
            syncThemeIcon();
            pulseButton(themeBtn);
        });
    }

    function syncThemeIcon() {
        if (!themeBtn) return;
        const current = body.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        themeBtn.textContent = current === 'dark' ? '☀️' : '🌙';
        themeBtn.setAttribute('aria-label', current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }

    // --- 2. pulseButton — mirror app.js helper for keyboard parity ---
    // Adds .is-pressed for 140ms, debounced via element-stored timer so
    // rapid-fire presses never rip the class off mid-animation.
    function pulseButton(btn) {
        if (!btn || btn.disabled) return;
        btn.classList.add('is-pressed');
        if (btn._pulseTimer) clearTimeout(btn._pulseTimer);
        btn._pulseTimer = setTimeout(() => {
            btn.classList.remove('is-pressed');
            btn._pulseTimer = null;
        }, 140);
    }

    // --- 3. Press-pulse on any element with .card-track on Enter/Space ---
    const tracks = document.querySelectorAll('.card-track');
    tracks.forEach((el) => {
        // Mouse / pointerdown pulse for visual feedback before navigation
        el.addEventListener('pointerdown', () => pulseButton(el));
        // Keyboard activation. Enter on an <a href> navigates by default;
        // Space on an <a href> would scroll the page, so we preventDefault
        // and trigger the click() ourselves to get a navigates-on-Space
        // behavior consistent with browser expectations.
        el.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') {
                pulseButton(el);
                // Let the browser navigate natively.
            } else if (ev.key === ' ') {
                ev.preventDefault();
                pulseButton(el);
                el.click();
            }
        });
    });

    // --- 4. Pulse on primary CTA buttons on press for tactile feedback ---
    document.querySelectorAll('.btn-cta-primary, .btn-cta-secondary').forEach((b) => {
        b.addEventListener('pointerdown', () => pulseButton(b));
    });

    // --- 5. Scroll-triggered reveals via IntersectionObserver ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
        const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stat-tile');
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => revealObserver.observe(el));
    } else {
        // Immediately reveal everything for reduced motion
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stat-tile')
            .forEach((el) => el.classList.add('is-visible'));
    }

    // --- 6. Scroll-driven parallax on hero blobs ---
    const hero = document.querySelector('.hero');
    if (hero && !prefersReducedMotion) {
        let ticking = false;
        function updateParallax() {
            const y = window.scrollY;
            hero.style.setProperty('--parallax-0', `${y * 0.15}px`);
            hero.style.setProperty('--parallax-1', `${y * 0.35}px`);
            ticking = false;
        }
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // --- 7. Cursor-tilt on hero and track cards ---
    function bindTilt(el) {
        if (!el) return;
        // Only bind on hover-capable devices (desktop with mouse)
        if (!window.matchMedia('(hover: hover)').matches) return;

        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width  - 0.5;  // -0.5 .. 0.5
            const y = (e.clientY - r.top)  / r.height - 0.5;
            const maxDeg = 6;
            el.style.setProperty('--tilt-x', `${-y * maxDeg}deg`);
            el.style.setProperty('--tilt-y', `${ x * maxDeg}deg`);
        });
        el.addEventListener('mouseleave', () => {
            el.style.setProperty('--tilt-x', '0deg');
            el.style.setProperty('--tilt-y', '0deg');
        });
    }
    tracks.forEach(bindTilt);

    // --- 8. Surface a visible keyboard-focus ring on the track cards
    // by toggling a class on focus. (We have :focus-visible CSS already,
    // but for older browsers without that pseudo this guarantees a ring.)
    tracks.forEach((el) => {
        el.addEventListener('focus', () => el.classList.add('is-focused'));
        el.addEventListener('blur', () => el.classList.remove('is-focused'));
    });
})();
