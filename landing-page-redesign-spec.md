# Landing Page Redesign — Spec

**Status:** Awaiting user sign-off on architecture pivot (Heavy-WebGL → all-CSS) and tagline choice.
**Project:** Master Study Hub (flat-file, file:// openable)
**Date:** 2026-07-05
**Owner:** Buffy / human user (Abdul Hakeem Shah)

---

## 1. Goal

Redesign `index.html` (currently the landing page) into a **completely rebuilt, visually "wow"** entry experience that:

1. Replaces the inline-SVG mascot with an **abstract floating-shape composition** that establishes a real layered 3D feel via CSS.
2. Drives **scroll-tied parallax across the whole page** so the page feels alive as you scroll.
3. Activates the **Vocab track** by removing "Coming Soon" + updating copy to reflect `vocab.html`'s 97 words / 9 categories.
4. Keeps the project's flat-file / `file://` openness invariant (no build step, no ES modules, no relative-path asset fetch).

### 1.1 Non-goals

- We do **not** refactor `vocab.html` (user-built, 760+ lines, declarative slide carousel). It is treated as a fixed dependency.
- We do **not** modify `app.js`, `data.js`, `styles.css`, `gk.html` — the GK flashcard app stays untouched.
- We do **not** change `/design/variables.css` (`rules.md §5` source-of-truth must stay clean).
- We do **not** load images / fonts / 3D models — everything stays inline.

---

## 2. Architectural Recommendation

### 2.1 The user picked: "Heavy WebGL (three.js)" — we recommend **pushing back to all-CSS (Path A)**

**Reasoning (from `thinker-with-files-gemini` review):**

A. **`prefers-reduced-motion` is one CSS rule in Path A; it's a render-loop pause + physics freeze in three.js.** The user explicitly wanted "expressive / wow" — but they also need it accessible; CSS is the right answer for both.

B. **Dark-mode integration.** Current dark theme swaps via `[data-theme="dark"]` and CSS custom-property reassignment. With three.js, every color must be re-fetched from `getComputedStyle(document.body).getPropertyValue('--color-x')` and re-uploaded to shader uniforms on every theme change. Pure-CSS does it for free.

C. **`file://` cross-fetch CORS issues with three.js add-ons.** three.js core loads fine from a CDN, but OrbitControls / GLTFLoader are ES modules. Local ES modules don't load on `file://` (CORS). Three.js scenes would be limited to inline geometries (no GLTF models, no textures) — which is, functionally, what CSS already gives us for free.

D. **Cost.** Three.js is ~150 KB gzipped. The current `landing.css` is ~12 KB. The 12× payload increase gains nothing the CSS plan can't express.

E. **Visual fidelity.** CSS `transform: translateZ` + `perspective` + composited `box-shadow` produce crisper, GPU-composited 3D depth than WebGL blobs at this scale. The visual concept the user wants ("layered floating blobs with real shadows that move on scroll") is what CSS does best.

### 2.2 Recommendation in the spec — present this to the user

Before implementation, **ask the user to confirm the pivot from three.js → all-CSS**. If they reject the pivot, we'd need to deferred-execute Path B (hybrid: three.js for ONE hero scene + CSS for everything else, with reduced-motion and mobile fallback). Path C (pure three.js) is too costly given file:// constraints.

---

## 3. Scope (per user choice)

| Element | Action |
|---|---|
| Topbar | Rebuild — keep brand + theme toggle, integrate with new visual style |
| Hero (copy + illustration) | **Rebuild from scratch** — new tagline, new mascot composition |
| Tracks section | **Rebuild** — both GK + Vocab cards redesigned |
| Stats row | **Rebuild** — shape-match the new visual language |
| Footer | Rebuild — lighter, on-brand |

---

## 4. Visual Design

### 4.1 Hero composition — "Layered 3D blobs + abstract mascot in front" (user choice)

Z-plane stack (back → front):

```
Z=0 (back, slowest parallax)   big sky-blue blob, drifts at 0.2× scroll speed
Z=1 (mid)                      sunshine-yellow blob, drifts at 0.4× scroll
Z=2 (mid-foreground)           grape-soda small blob, drifts at 0.6× scroll
Z=3 (foreground, copy layer)   hero text + CTAs — translate-Z small (8–16px)
Z=4 (overlay mascot)           green-blob abstract character, large, sits on top
                                casts soft shadow over Z=2 layer
```

Each layer has a **real CSS `box-shadow`** (offset + blur) so the layers feel physically stacked, not just stacked in z-order.

### 4.2 Mascot (replaces inline SVG)

A composable abstract "character" built from CSS shapes:

- Body: large green blob (`border-radius: 50% 40% 55% 45%`) — same Duolingo blob-shape vocabulary as before, but as a `<div>` with `background` + `box-shadow`.
- Eyes: two white circles + two pupils + two sparkle overlays — pure CSS, no SVG required.
- Lightning bolt: a yellow `<span>` styled with `clip-path: polygon(...)` (no SVG).
- Book: sky-blue rectangle with thin `border` striations for pages.

All future character pipeline is **HTML+CSS**, not inline SVG. Any future mascot changes are CSS edits.

### 4.3 New taglines (5 options, user picks one)

From the thinker:

1. **"build your brain. one card at a time."** — playful, descriptive, Duolingo rhythm.
2. **"learn faster. remember forever."** — confident, study-focused.
3. **"focus mode on. distractions out."** — speaks to the exam-prep audience.
4. **"get sharper. every single day."** — energetic evolution of original tagline.
5. **"master the world. zero fluff."** — bolder, nods to the no-signup/no-tracking ethos.

User picks one in next round.

### 4.4 Tracks section — Track-card 3D cards (user choice)

Each `.card-track` becomes a **physically-stacked 3D card**:

- Multi-layer `box-shadow` ring: green/blue shadow color matching the track.
- On hover: card lifts (`translateY(-8px)`), shadow expands (`box-shadow` shadow layer extends), card tilts ~2deg toward cursor (via JS mousemove-mapped-to-rotateX/rotateY).
- On `:active`: presses down (`translateY(5px)`, shadow collapses) — matches existing 3D button vocabulary.
- Inner `border` glow + gradient stripe across the top of each card.

### 4.5 Stats row — Three floating "stat-tile" cards

Same visual language as track-cards but smaller. Each tile:

- Slight `rotate(-2deg)` / `rotate(2deg)` / `rotate(0deg)` per tile for "casually placed on a desk" feel.
- Hover: tile lifts and squares up (`rotate(0deg)`).
- Subtle drop-shadow varies per tile.

### 4.6 Footer — keep minimal

Logo + 3 inline links (Home / GK / Vocab) + one tagline sentence.

---

## 5. Motion Spec

### 5.1 Entrance / first-paint

- Eyebrow pill: fade-in + slight slide-down (`heroInLeft` already exists in landing.css).
- Headline: split-reveal — two halves (current `.accent` spans) crossfade in sequence: "**get smarter.**" 200ms → "**every single day.**" 400ms-in.
- Subhead + CTAs: stagger 100ms after headline completes.
- Trust-avatar row: stagger 50ms between each avatar.
- Mascot z-stack: each blob layer fades in from its respective direction (back: bottom-right, mid: bottom, foreground: left) with 100ms stagger.

### 5.2 Scroll-driven parallax

Per-layer scroll delta, expressed as CSS variables in JS (`landing.js`):

```js
// Per-frame on scroll, set inline CSS vars on .hero
hero.style.setProperty('--parallax-0', `${scrollY * 0.20}px`);
hero.style.setProperty('--parallax-1', `${scrollY * 0.40}px`);
hero.style.setProperty('--parallax-2', `${scrollY * 0.60}px`);
```

CSS consumes those vars in the blob layer transforms. **Single `scroll` listener, throttled with `requestAnimationFrame`** so it stays smooth.

### 5.3 Cursor-tilt on hero + track cards

- On `mousemove` over the hero or track card, set inline `--tilt-x` and `--tilt-y` CSS vars.
- Track-card transform: `transform: perspective(800px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y))`.
- Mouse leaving: reset to `rotateX(0) rotateY(0)` over 300ms ease-out.

### 5.4 `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .hero-blob { transform: none !important; }
  .card-track { transform: none !important; }
}
```

### 5.5 Mobile behavior (≤ 960px)

- Scroll parallax **disabled** (only first-paint animation plays).
- Cursor-tilt **disabled** (no mousemove on touch).
- Hover lift on track-cards **disabled**; pointerdown press instead.
- Mascot z-stack compressed (z-translations halved, layer count reduced to 3).

---

## 6. Implementation Spec

### 6.1 File layout (NO new files — everything goes into existing flat structure)

| File | Change |
|---|---|
| `index.html` | Mark up new structure: remove inline SVG, replace with `<div class="hero-blob">` z-stack + new typography (chosen tagline) + new vocab card markup (active, no "Coming soon" badge) |
| `landing.css` | Append new sections: `.hero-blob` z-stack rules, scroll-parallax CSS-vars, cursor-tilt transform, new track-card glow gradient, new stats-tile rotation, expanded reduced-motion + mobile rules. |
| `landing.js` | Append: scroll listener (throttled with `requestAnimationFrame`) updating `--parallax-N` on `.hero`; mousemove on `.hero` and `.card-track` updating `--tilt-x/y`; IntersectionObserver for "tracks section enters viewport" trigger for stats-tile stagger reveal. Existing theme + pulseButton logic stays untouched. |
| `vocab.html` | **Not touched.** Leave the user's 760-line file as-is. |
| `design/DESIGN.md`, `design/variables.css`, `styles.css`, `app.js`, `data.js`, `gk.html` | **Not touched.** |

### 6.2 New scoped CSS tokens (added to landing.css `:root`, NOT to design/)

```css
:root {
  /* Existing tokens stay */

  /* New landing-only tokens for the rebuild */
  --hero-blob-shadow-blur: 60px;
  --hero-blob-shadow-spread: 0;
  --tilt-max-deg: 4deg;
  --parallax-multiplier: 1;
  --track-glow-gradient: linear-gradient(
    90deg,
    var(--color-duo-green) 0%,
    var(--color-duo-green-light) 100%
  );
  --vocab-glow-gradient: linear-gradient(
    90deg,
    var(--color-sky-blue) 0%,
    var(--color-sky-blue-shadow, var(--shadow-primary-blue)) 100%
  );
  --transition-tilt: 300ms cubic-bezier(0.16, 1, 0.3, 1);
  --transition-card: 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

### 6.3 Pseudo-code for hover-tilt JS

```js
// landing.js — appended, does not modify existing logic
const hero = document.querySelector('.hero');
const tracks = document.querySelectorAll('.card-track');

let ticking = false;
function updateParallax() {
  if (!hero) return;
  const y = window.scrollY;
  hero.style.setProperty('--parallax-0', `${y * 0.20}px`);
  hero.style.setProperty('--parallax-1', `${y * 0.40}px`);
  hero.style.setProperty('--parallax-2', `${y * 0.60}px`);
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
}, { passive: true });

function bindTilt(el) {
  if (!el) return;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;  // -0.5 .. 0.5
    const y = (e.clientY - r.top)  / r.height - 0.5;
    el.style.setProperty('--tilt-x', `${-y * 4}deg`);
    el.style.setProperty('--tilt-y', `${ x * 4}deg`);
  });
  el.addEventListener('mouseleave', () => {
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  });
}
bindTilt(hero);
tracks.forEach(bindTilt);
```

### 6.4 Vocab card activation (changes to `index.html` only)

- Remove `::after { content: "Coming soon"; ... }` ribbon from `.card-track--vocab` (it's in landing.css). Or override to `display: none` if we want to keep it for future use.
- Change vocab card copy:
  - Title: stays "Vocabulary".
  - Body: "Build your Urdu ↔ English word power with 97 curated words across 9 themes." (replacing "Bidirectional / Memory hooks" generic placeholder).
  - Meta row: "97 words" · "9 themes" · "10–15 min".
  - `aria-label` updated: "Open the Vocabulary module — 97 words, 9 themes".
- Add a **"NEW"** pill at the top-right of the vocab card (small, `'NEW'` text, oklch via token, optional).

---

## 7. Risks & Mitigations

| # | Risk | Mitigation |
|---|---|---|
| 1 | User rejects the three.js → all-CSS pivot. | Spec asks for confirmation first. If rejected, fall back to **Path B** hybrid (single three.js hero scene + CSS elsewhere, no local modules, no local textures, no OrbitControls). |
| 2 | Scroll-parallax causes jank on iOS Safari because of scroll-paint cost. | Mobile (`@media (max-width: 960px)`) disables the scroll listener; CSS-only path static. Desktop uses `requestAnimationFrame` + `passive: true` listeners. |
| 3 | Mobile-safari `prefers-reduced-motion: reduce` may be partially respected; WebGL/Web-Animations sometimes aren't. | All-CSS path makes this a non-issue (reduced-motion CSS rule covers it). For any future JS-driven motion, `matchMedia('(prefers-reduced-motion: reduce)').matches` is checked at listener-binding time before installing parallax listeners. |
| 4 | CSS variable cascade + dark-theme may not propagate to cursor-tilt transforms if they're not on a body-class. | All transforms use CSS vars declared on the element being tilted; `[data-theme="dark"]` overrides land in `:root` so cascade is consistent. |
| 5 | Heavy entrance animations (`@keyframes`) delay first interaction. | Use `animation-fill-mode: both` to avoid double-paint; reduce total animation count to ≤ 6 simultaneous on first paint. Set `animation-delay` between layers (max 800ms cumulative). |
| 6 | Hover-tilt on mobile touch accidentally fires on tap, causing a perceived "wobble" before navigation. | `bindTilt` checks `window.matchMedia('(hover: hover)')` — only binds tilt on devices that support hover. Pointer devices still get press-pulse via existing pointerdown handler. |
| 7 | Adding `scroll-tied` properties not yet shipped cross-browser. | All scroll-tied work uses **manual** listener + `requestAnimationFrame` (universally supported). Don't rely on CSS `animation-timeline: scroll()` (Safari < 17). |

---

## 8. Acceptance Criteria (for implementation pass)

After implementation, ALL of the following must pass:

- [ ] `index.html` has zero inline `<style>` blocks — all styling is in `landing.css`.
- [ ] `landing.css` has zero hardcoded hex literals outside `:root` tokens.
- [ ] **No new design tokens added to `design/variables.css`** (per rules.md §5).
- [ ] `landing.css` introduces the new scoped tokens (`--hero-blob-shadow-blur`, `--tilt-max-deg`, `--track-glow-gradient`, `--vocab-glow-gradient`, etc.).
- [ ] `landing.js` runs through `node --check` with zero warnings.
- [ ] Page works under `file://` (no ES modules, no `fetch()` of relative files).
- [ ] Page works under `http(s)://` (templates still server-friendly).
- [ ] Layout responsive at 360px / 480px / 960px / 1440px width.
- [ ] Dark mode toggle (`🌙 ☀️`) still works; landing-theme choice persists via `localStorage['appTheme']`.
- [ ] `prefers-reduced-motion: reduce` disables scroll parallax, cursor tilt, and entrance animations.
- [ ] Hover tilt works only on `hover: hover` devices (desktop); pointer/touch devices get press-pulse only.
- [ ] Vocal track card on `index.html`: ribbon removed, copy updated ("97 words, 9 themes"), `aria-label` accurate.
- [ ] `gk.html` + `vocab.html` + `app.js` + `data.js` + `styles.css` all unchanged.
- [ ] `contest_log.md` Pre-Execution + Post-Execution entries appended per rules.md §4.

---

## 9. Open Decisions for the User

Before implementation:

1. **Confirm the three.js → all-CSS pivot?** (Strongly recommended.)
2. **Pick a tagline from list in §4.3** (or supply your own).
3. **Vocab card "NEW" pill — include or skip?** (Optional; if yes, where: top-right / overlaid on icon / etc.)
4. **Tagline placement** — eyebrow pill text "Now with 120 GK cards + 97 vocab words" needs updating? (Currently says only "120 GK cards".)
5. **Footer copy** — keep current / shorten / extend?

---

## 10. Out-of-Scope (deliberate)

These get **deferred** to followup tasks, NOT in this spec:

- Wiring dark mode into `gk.html` (app.js doesn't read `appTheme` yet).
- Refactoring `vocab.html` (e.g. extract CSS to a separate file).
- Adding a real 3D mascot character (e.g. via a `.glb` model served from `/assets/`).
- Internationalization (Pashto, Sindhi, Urdu in tagline).
- SEO/analytics.
- Service Worker (offline) — current site is fine; out of scope.
- Bulk-prewarm of card image fetches (a known optimization from prior `app.js` perf notes).
