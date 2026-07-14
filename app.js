// app.js — Flashcard application logic.
// Loaded AFTER data.js via classic <script src="./app.js">. Depends on the
// `originalData` global exposed by data.js. Classic script (not
// <script type="module">) so the app still works when opened directly
// from file://.
//
// Concern boundaries:
//   * State + DOM cache (deck, currentIndex, elCard, ...)
//   * Timer (startTimer, stopTimer, resetTimer, formatTime)
//   * Card content (populateCardContent, applyCardBackImage)
//   * Image loading (prefetchWikiImage, getCachedWikiImage, preloadImageBytes)
//   * Navigation (updateUI, flipCard, nextCard, prevCard, shuffleDeck)
//   * Input (gestures via pointerdown/pointerup, keyboard controls)
//   * Init (updateUI(true) boot at the bottom)

// --- Application State ---
let deck = [...originalData];
let currentIndex = 0;
let isFlipped = false;

// Timer State
let timerInterval = null;
let secondsElapsed = 0;

// --- DOM Elements ---
const elCard = document.getElementById('flashcard');
const elQuestion = document.getElementById('card-question');
const elAnswer = document.getElementById('card-answer');
const elProgressText = document.getElementById('progress-text-count');
const elProgressFill = document.getElementById('progress-fill');
const elTimer = document.getElementById('timer-display');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnFlip = document.getElementById('btn-flip');
const cardScene = document.getElementById('card-scene');

// --- Timer Functions ---
function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        secondsElapsed++;
        elTimer.innerText = formatTime(secondsElapsed);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    stopTimer();
    secondsElapsed = 0;
    elTimer.innerText = formatTime(secondsElapsed);
    startTimer();
}

// --- Core Functions ---
function updateUI(isNavigating = false) {
    if (isNavigating) {
        // If we are moving to a new card, reset the timer
        resetTimer();
    }

    if (isFlipped) {
        if (isNavigating) {
            elCard.classList.add('no-transition');
            elCard.classList.remove('is-flipped');
            isFlipped = false;

            populateCardContent();
            void elCard.offsetWidth;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    elCard.classList.remove('no-transition');
                });
            });
        } else {
            elCard.classList.remove('is-flipped');
            isFlipped = false;
            setTimeout(() => {
                populateCardContent();
            }, 250);
        }
    } else {
        populateCardContent();
    }

    const currentNumber = currentIndex + 1;
    const total = deck.length;
    elProgressText.innerText = `${currentNumber} / ${total}`;
    elProgressFill.style.width = `${(currentNumber / total) * 100}%`;

    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex === total - 1;

    // Pre-warm the Wikipedia image for the current card AND the next
    // two so rapid arrow-key navigation feels instant. By the time
    // the user lands on currentIndex+1 or +2, both the URL is in
    // localStorage AND the image bytes are in the browser HTTP cache.
    //
    // Loop-and-break pattern (vs. hard-coded offsets) keeps the
    // boundary safe at both ends: last card does 1 warm (no +1
    // available), second-to-last does 2 warms, mid-deck does 3.
    // populateCardContent → applyCardBackImage also fires the
    // current+1-prefetch on cache miss, but updateUI is the
    // higher-traffic entry point (fires on shuffle too) so the
    // explicit loop here is the right hook.
    //
    // Three concurrent fetches per navigation is well within the
    // global browser connection cap (Chromium: 6 per origin; we
    // share with JS/CSS/font round-trips). On warm cards the
    // prefetchWikiImage cache-hit short-circuit + _preloadedImageUrls
    // Set dedupe keeps this near-zero-cost.
    for (let offset = 0; offset <= 2; offset++) {
        const upcomingIdx = currentIndex + offset;
        if (upcomingIdx >= deck.length) break;
        const card = deck[upcomingIdx];
        if (card && card.wikiTitle && !card.noImage) {
            prefetchWikiImage(card.wikiTitle);
        }
    }
}

// --- Wikipedia Image Helpers ---
// Each MCQ entry may carry a `wikiTitle` — the Wikipedia article
// whose lead image visually anchors the answer on the card-back.
// Resolved via Wikipedia REST summary endpoint, cached in
// localStorage under `wbImg__<title>`. Both successful lookups and
// negative lookups ("no image") are cached equally so we never
// refire a failing request on every navigation.
const WIKI_SUMMARY_BASE = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const IMG_CACHE_PREFIX = 'wbImg__';
// Picsum is a deterministic placeholder image service — same seed
// always returns the same image. CORS-friendly, no API key, fast,
// works even when Wikipedia is unreachable. Used as a guaranteed
// fallback so every card has *some* visible image (better than the
// plain green back, which is the previous behavior on a Wikipedia
// miss or a slow first-load fetch).
const PICFALLBACK_BASE = 'https://picsum.photos/seed/';

// --- Image Byte Preload ---
// Hidden `new Image()` load to warm the browser's HTTP cache without
// touching the DOM. Browsers route `background-image: url(...)` through
// the same cache, so the next read on this card comes from memory/disk
// instead of a fresh network fetch + decode.
//
// Idempotent across the session: a module-level Set tracks URLs we
// have already requested, so navigating back to a card we already
// visited doesn't fire a second (wasted) Image() load. The browser's
// own per-URL dedupe is also in play, but the explicit Set avoids
// even scheduling the redundant request.
const _preloadedImageUrls = new Set();
function preloadImageBytes(url) {
    if (!url) return;
    if (_preloadedImageUrls.has(url)) return;
    _preloadedImageUrls.add(url);
    const img = new Image();
    // `decoding = 'async'` lets the browser pipeline decode off the
    // main thread — small thing, but compositing on the rotated
    // card stays smooth during the flip animation.
    img.decoding = 'async';
    img.src = url;
}

async function prefetchWikiImage(title) {
    if (!title) return;
    const key = IMG_CACHE_PREFIX + title;
    // localStorage.getItem returns null when unset; once we cache a
    // URL (either from Wikipedia or Picsum) we never rewrite it, so
    // the same card always renders the same image across reloads.
    // On every cache hit we also opportunistically warm the HTTP
    // cache via preloadImageBytes — the Set-inside dedupes so it's a
    // no-op when the bytes are already cached (every visit after the
    // first), and a real preload on fresh loads (new tab, cache
    // cleared, hard reload).
    if (localStorage.getItem(key) !== null) {
        preloadImageBytes(localStorage.getItem(key));
        return;
    }

    let url = '';
    // (1) Try Wikipedia REST first — gives the topic-accurate lead image.
    try {
        const resp = await fetch(WIKI_SUMMARY_BASE + encodeURIComponent(title));
        if (resp.ok) {
            const data = await resp.json();
            // Prefer `thumbnail` (~320px Wikipedia thumb, ~30–80 KB)
            // over `originalimage` (often 2000+ px @ 2–5 MB) so the
            // card-back renders fast even on slow networks. Fall back
            // to `originalimage` only when no thumbnail is present
            // (e.g., SVG-only articles); Picsum covers the no-image
            // branch below.
            url = (data.thumbnail && data.thumbnail.source) ||
                  (data.originalimage && data.originalimage.source) || '';
        }
    } catch (e) {
        // Network/CORS failure on Wikipedia — fall through to Picsum.
        // No negative-cache, so a transient error on this visit
        // doesn't permanently lock out the card.
    }

    // (2) Fallback: deterministic Picsum URL keyed on the title.
    //     Always succeeds; gives every card *something* instead of
    //     plain green if Wikipedia doesn't return one. Sized to 400px
    //     (single-axis, square) — the card area is ~500x400 max, so
    //     400px is well above the cover-crop footprint and ~4x smaller
    //     files than the previous `800/600`.
    if (!url) {
        const seed = encodeURIComponent(String(title).trim().replace(/\s+/g, '-'));
        url = PICFALLBACK_BASE + seed + '/400';
    }

    localStorage.setItem(key, url);

    // (3) Preload image bytes into the browser HTTP cache so the next
    //     `background-image: url(...)` read on this card comes from
    //     cache instead of a network roundtrip + full decode. This is
    //     the second-biggest perf win beyond switching to thumbnail.
    preloadImageBytes(url);

    // (4) Race-fix: re-apply to the live card-back if the user is still
    //     on this card when we finish. Without this, a flip that lands
    //     *before* the async fetch resolves leaves the card-back on
    //     plain green until the user navigates away and returns.
    const cur = deck[currentIndex];
    if (cur && cur.wikiTitle === title) {
        applyCardBackImage(cur);
    }
}

function getCachedWikiImage(title) {
    const v = localStorage.getItem(IMG_CACHE_PREFIX + title);
    return (v && v !== '') ? v : null;
}

function applyCardBackImage(item) {
    const back = document.querySelector('.card-back');
    if (!back) return;
    if (item.noImage || !item.wikiTitle) {
        back.classList.remove('has-bg');
        back.style.backgroundImage = '';
        return;
    }
    const url = getCachedWikiImage(item.wikiTitle);
    if (url) {
        back.classList.add('has-bg');
        back.style.backgroundImage = `url("${url}")`;
    } else {
        // Cold cache: leave plain green so the user isn't staring at
        // a half-loaded image, but kick off the fetch so next visit
        // to this card shows it. (applyCardBackImage is called from
        // populateCardContent which also fires the prefetch; this is
        // belt-and-braces for direct API paths.)
        back.classList.remove('has-bg');
        back.style.backgroundImage = '';
        prefetchWikiImage(item.wikiTitle);
    }
}

function populateCardContent() {
    const item = deck[currentIndex];
    elQuestion.innerText = item.q;
    elAnswer.innerText = item.a;
    applyCardBackImage(item);
}

function flipCard() {
    isFlipped = !isFlipped;
    if (isFlipped) {
        elCard.classList.add('is-flipped');
        stopTimer(); // Pause timer when checking the answer
    } else {
        elCard.classList.remove('is-flipped');
        startTimer(); // Resume timer if going back to question
    }
}

function nextCard() {
    if (currentIndex < deck.length - 1) {
        currentIndex++;
        updateUI(true);
        pulseButton(btnNext);
    }
}

function prevCard() {
    if (currentIndex > 0) {
        currentIndex--;
        updateUI(true);
        pulseButton(btnPrev);
    }
}

/**
 * Briefly flashes the same `.is-pressed` visual on a button so that
 * non-pointer triggers (keyboard arrow keys, programmatic calls, etc.)
 * feel as tactile as a real tap. Mirrors the CSS `:active` press state.
 * No-op when the button is disabled so boundary presses stay quiet.
 * Timeout handle is stored on the element so rapid arrow-mashing (or
 * OS key-repeat) re-debounces the release instead of being ripped off
 * mid-pulse by an earlier scheduled timer.
 */
function pulseButton(btn) {
    if (!btn || btn.disabled) return;
    btn.classList.add('is-pressed');
    if (btn._pulseTimer) clearTimeout(btn._pulseTimer);
    btn._pulseTimer = setTimeout(() => {
        btn.classList.remove('is-pressed');
        btn._pulseTimer = null;
    }, 140);
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    currentIndex = 0;
    updateUI(true);
}

// --- Gestures ---
let pointerDownX = 0;
let pointerDownY = 0;
let pointerDownTime = 0;
let lastTapTime = 0;

cardScene.addEventListener('pointerdown', (e) => {
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    pointerDownTime = Date.now();
});

cardScene.addEventListener('pointerup', (e) => {
    const pointerUpX = e.clientX;
    const pointerUpY = e.clientY;
    const pointerUpTime = Date.now();

    const deltaX = pointerUpX - pointerDownX;
    const deltaY = pointerUpY - pointerDownY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const timeTaken = pointerUpTime - pointerDownTime;

    if (absX > 40 && absX > (absY * 2) && timeTaken < 500) {
        if (deltaX < 0) {
            nextCard();
        } else {
            prevCard();
        }
        return;
    }

    if (absX < 15 && absY < 15) {
        const timeSinceLastTap = pointerUpTime - lastTapTime;

        if (timeSinceLastTap > 0 && timeSinceLastTap < 400) {
            flipCard();
            lastTapTime = 0;
        } else {
            lastTapTime = pointerUpTime;
        }
    }
});

// --- Keyboard Controls ---
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flipCard();
        pulseButton(btnFlip);
    } else if (e.key === 'ArrowRight') {
        nextCard();
    } else if (e.key === 'ArrowLeft') {
        prevCard();
    }
});

// Initialize App
updateUI(true); // Passing true triggers the timer reset on first load
