
        // --- Data ---
        // Each entry now carries either a `wikiTitle` (the Wikipedia article
        // whose lead image becomes the card-back background) or `noImage: true`
        // (used for the two cards that name a religious figure by name —
        // Ibrahim as and Mika'il as — which must keep the plain green back).
        const originalData = [
            { q: "The first UN women ambassador of Pakistan", a: "Maliha Lodhi", wikiTitle: "Maliha Lodhi" },
            { q: "The Indus river originates in China near", a: "Lake Manasarovar", wikiTitle: "Lake Manasarovar" },
            { q: "FriendShip gate is located at", a: "Torkham Border", wikiTitle: "Torkham Border" },
            { q: "Wakhan corridor connects", a: "Afghanistan & China", wikiTitle: "Wakhan Corridor" },
            { q: "Height of Mount Vinson", a: "4892 meters", wikiTitle: "Mount Vinson" },
            { q: "Pakistan Gate is the border between", a: "Iran and Pakistan", wikiTitle: "Pakistan" },
            { q: "Which Continent was referred as Dark Continent", a: "Africa", wikiTitle: "Africa" },
            { q: "Author of Harry Potter book series", a: "J.K. Rowling", wikiTitle: "J. K. Rowling" },
            { q: "US Independence day", a: "4th July 1776", wikiTitle: "United States Declaration of Independence" },
            { q: "Continent Australia is also called as", a: "Oceania", wikiTitle: "Oceania" },
            { q: "Philately is the study of", a: "Stamp collecting", wikiTitle: "Philately" },
            { q: "Pisciculture is the study of", a: "Fish farming", wikiTitle: "Aquaculture" },
            { q: "Telepathy is the study of", a: "Transmission of thoughts directly between minds.", wikiTitle: "Telepathy" },
            { q: "Cryptography is the study of", a: "Secret Writing", wikiTitle: "Cryptography" },
            { q: "Diamer basha dam is on river", a: "Indus", wikiTitle: "Indus River" },
            { q: "City of Saints", a: "Multan", wikiTitle: "Multan" },
            { q: "State of matter with highest kinetic energy", a: "Gas", wikiTitle: "Gas" },
            { q: "Evaporation is", a: "Cooling Process", wikiTitle: "Evaporation" },
            { q: "Pakistan and Tajikistan are separated by", a: "Wakhan Corridor", wikiTitle: "Wakhan Corridor" },
            { q: "NATO was formed in", a: "1949", wikiTitle: "NATO" },
            { q: "The Strategic Arms Limitation Treaty (SALT-I)", a: "1972", wikiTitle: "Strategic Arms Limitation Talks" },
            { q: "World War II began with Germany attack on", a: "Poland", wikiTitle: "Invasion of Poland" },
            { q: "Covid 19 was officially declared as a Pandemic by WHO in", a: "March 2020", wikiTitle: "COVID-19 pandemic" },
            { q: "What forced US to join World War II", a: "Pearl Harbour Attack by Japan", wikiTitle: "Attack on Pearl Harbor" },
            { q: "Fastest sinking city", a: "Jakarta", wikiTitle: "Jakarta" },
            { q: "Doha agreement", a: "Feb 2020", wikiTitle: "Doha Agreement" },
            { q: "1st OIC meeting", a: "Rabat, Morocco (1969)", wikiTitle: "Organisation of Islamic Cooperation" },
            { q: "2nd OIC meeting", a: "Lahore (1974)", wikiTitle: "Organisation of Islamic Cooperation" },
            { q: "Pakistan officially joined UN on", a: "30 Sep 1947", wikiTitle: "Member states of the United Nations" },
            { q: "Socrates was born in", a: "469 BC", wikiTitle: "Socrates" },
            { q: "Which country invented tank", a: "UK", wikiTitle: "Tank" },
            { q: "World Cancer day", a: "4 Feb", wikiTitle: "World Cancer Day" },
            { q: "Height of K2", a: "8611 meters", wikiTitle: "K2" },
            { q: "Smallest Republic", a: "Nauru", wikiTitle: "Nauru" },
            { q: "Largest Producer & Consumer of Electricity in Islamic world", a: "KSA", wikiTitle: "Saudi Arabia" },
            { q: "Saltiest Ocean", a: "Atlantic", wikiTitle: "Atlantic Ocean" },
            { q: "Gilgit Baltistan got independence", a: "1st Nov 1947", wikiTitle: "Gilgit-Baltistan" },
            { q: "Arabian desert is in", a: "Western Asia", wikiTitle: "Arabian Desert" },
            { q: "Gibraltar strait connects Atlantic ocean and", a: "The Mediterranean Sea", wikiTitle: "Strait of Gibraltar" },
            { q: "Oldest university of Pakistan", a: "University of Punjab", wikiTitle: "University of the Punjab" },
            { q: "Treaty of waitangi was signed between British crown and", a: "Maori Chiefs in 1840", wikiTitle: "Treaty of Waitangi" },
            { q: "Tower Bridge", a: "London", wikiTitle: "Tower Bridge" },
            { q: "Nelson Mandela day", a: "18th July", wikiTitle: "Nelson Mandela" },
            { q: "Psephology is the scientific study of", a: "Elections", wikiTitle: "Psephology" },
            { q: "Peace memorial park in Japan is memorial of", a: "Atomic bomb victims", wikiTitle: "Hiroshima Peace Memorial Park" },
            { q: "Which country has agreed to help the United States locate missing Americans?", a: "Syria", wikiTitle: "Syria" },
            { q: "Which Prophet is known as “Khalilullah” (Friend of Allah)?", a: "Ibrahim as", noImage: true },
            { q: "Which vitamin is primarily produced in the skin in response to sunlight?", a: "D", wikiTitle: "Vitamin D" },
            { q: "Which is the first digital census held in Pakistan?", a: "2023", wikiTitle: "Census in Pakistan" },
            { q: "Which new department has been created in Punjab Police to control crime?", a: "Crime Control Department CCD - 26 feb 2026", wikiTitle: "Punjab Police" },
            { q: "When did US removed sanctions on Syria", a: "July 1 2025", wikiTitle: "Sanctions against Syria" },
            { q: "Asim Munir ranked as five star general on", a: "May 20 2025", wikiTitle: "Asim Munir" },
            { q: "PNSC", a: "Pakistan National Shipping Cooperation", wikiTitle: "Pakistan National Shipping Corporation" },
            { q: "NCCIA was built in", a: "May 3 2024", wikiTitle: "Federal Investigation Agency" },
            { q: "What is the name of the Angel who brings rain?", a: "Mika'il as", noImage: true },
            { q: "Smallest country by area", a: "Vatican City", wikiTitle: "Vatican City" },
            { q: "National day in China", a: "October 1", wikiTitle: "China" },
            { q: "Tourism day", a: "September 27", wikiTitle: "World Tourism Day" },
            { q: "Deepest lake in world", a: "Lake Baikal", wikiTitle: "Lake Baikal" },
            { q: "Pearl of Indian ocean is called", a: "Sri Lanka", wikiTitle: "Sri Lanka" },
            { q: "Only country in the world in which there is Day in one Part and night in the other", a: "Russia", wikiTitle: "Russia" },
            { q: "Motto of UNO", a: "It's your world", wikiTitle: "United Nations" },
            { q: "Currency of Israel", a: "Shekel", wikiTitle: "Israeli new shekel" },
            { q: "Deepest part of Earth", a: "Mariana Trench", wikiTitle: "Mariana Trench" },
            { q: "First war of china between", a: "China and Britain", wikiTitle: "First Opium War" },
            { q: "Headquarters of red cross", a: "Geneva", wikiTitle: "International Committee of the Red Cross" },
            { q: "OIC changed its name to Organisation of Islamic Cooperation in", a: "2011", wikiTitle: "Organisation of Islamic Cooperation" },
            { q: "Which country, on the map of world, appears as \"Long Shoe\"", a: "Italy", wikiTitle: "Italy" },
            { q: "Oldest news agency in the world", a: "AFP", wikiTitle: "Agence France-Presse" },
            { q: "Worlds largest Island", a: "Greenland", wikiTitle: "Greenland" },
            { q: "AFP is the news agency of", a: "France", wikiTitle: "France" },
            { q: "\"Land of the Rising Sun\" is the nickname of which country", a: "Japan", wikiTitle: "Japan" },
            { q: "Which gas is most abundant in the Earth's atmosphere", a: "Nitrogen", wikiTitle: "Nitrogen" },
            { q: "The capital of Canada is", a: "Ottawa", wikiTitle: "Ottawa" },
            { q: "Which is the smallest ocean in the world", a: "Arctic Ocean", wikiTitle: "Arctic Ocean" },
            { q: "Mount Everest, the highest peak in the world, is located in", a: "Nepal", wikiTitle: "Mount Everest" },
            { q: "Which planet is known as the Red Planet", a: "Mars", wikiTitle: "Mars" },
            { q: "The currency of Turkey is", a: "Lira", wikiTitle: "Turkish lira" },
            { q: "The Great Wall of China is approximately how long", a: "21,196 km", wikiTitle: "Great Wall of China" },
            { q: "\"Reuters\" is the famous news agency of", a: "United Kingdom", wikiTitle: "Reuters" },
            { q: "Headquarter of Amnesty International", a: "London", wikiTitle: "Amnesty International" },
            { q: "Total member states of UNO", a: "193", wikiTitle: "Member states of the United Nations" },
            { q: "The largest continent of the world", a: "Asia", wikiTitle: "Asia" },
            { q: "The city of seven hills", a: "Rome", wikiTitle: "Rome" },
            { q: "\"Kangaroo\" is the national animal of", a: "Australia", wikiTitle: "Kangaroo" },
            { q: "The official language of Brazil", a: "Portuguese", wikiTitle: "Portuguese language" },
            { q: "Which country has the largest number of volcanoes", a: "Indonesia", wikiTitle: "Indonesia" },
            { q: "The permanent secretariat of SAARC is located in", a: "Kathmandu", wikiTitle: "South Asian Association for Regional Cooperation" },
            { q: "Suez Canal connects", a: "Mediterranean Sea and Red Sea", wikiTitle: "Suez Canal" },
            { q: "\"Land of Thousand Lakes\"", a: "Finland", wikiTitle: "Finland" },
            { q: "The longest river in the world", a: "Nile", wikiTitle: "Nile" },
            { q: "Headquarters of NATO is located in", a: "Brussels", wikiTitle: "NATO" },
            { q: "The currency of Japan", a: "Yen", wikiTitle: "Japanese yen" },
            { q: "The highest waterfall in the world", a: "Angel Falls", wikiTitle: "Angel Falls" },
            { q: "The parliament of Japan is called", a: "Diet", wikiTitle: "National Diet Building" },
            { q: "\"Land of Maple Leaf\" is the nickname of", a: "Canada", wikiTitle: "Canada" },
            { q: "Which country is called the \"Playground of Europe\"", a: "Switzerland", wikiTitle: "Switzerland" },
            { q: "The largest ocean of the world", a: "Pacific Ocean", wikiTitle: "Pacific Ocean" },
            { q: "\"Kyodo\" is the news agency of", a: "Japan", wikiTitle: "Kyodo News" },
            { q: "The International Court of Justice is located in", a: "The Hague (Netherlands)", wikiTitle: "International Court of Justice" },
            { q: "Headquarters of INTERPOL is located in", a: "Lyon (France)", wikiTitle: "Interpol" },
            { q: "The currency of Malaysia", a: "Ringgit", wikiTitle: "Malaysian ringgit" },
            { q: "Which country is known as the \"Land of White Elephants\"", a: "Thailand", wikiTitle: "Thailand" },
            { q: "The largest hot desert in the world", a: "Sahara Desert", wikiTitle: "Sahara" },
            { q: "The world's oldest written constitution is of", a: "USA", wikiTitle: "Constitution of the United States" },
            { q: "Which river crosses the Equator twice", a: "Congo River", wikiTitle: "Congo River" },
            { q: "The largest country in South America is", a: "Brazil", wikiTitle: "Brazil" },
            { q: "The longest mountain range in the world is", a: "Andes", wikiTitle: "Andes" },
            { q: "Headquarter of World Bank is located in", a: "Washington, D.C.", wikiTitle: "World Bank" },
            { q: "Headquarter of Transparency International is in", a: "Berlin", wikiTitle: "Transparency International" },
            { q: "The largest peninsula in the world is", a: "Arabian Peninsula", wikiTitle: "Arabian Peninsula" },
            { q: "Which country is known as the \"Land of Thunderbolts\"", a: "Bhutan", wikiTitle: "Bhutan" },
            { q: "The currency of South Africa", a: "Rand", wikiTitle: "South African rand" },
            { q: "Which country is the largest producer of coffee in the world", a: "Brazil", wikiTitle: "Coffee production in Brazil" },
            { q: "The strait that separates Asia from North America", a: "Bering Strait", wikiTitle: "Bering Strait" },
            { q: "Headquarters of UNESCO is located in", a: "Paris", wikiTitle: "UNESCO" },
            { q: "The country known as the \"Land of Tulips\" is", a: "Netherlands", wikiTitle: "Netherlands" },
            { q: "The highest mountain range in the world is", a: "Himalayas", wikiTitle: "Himalayas" },
            { q: "The capital of Egypt is", a: "Cairo", wikiTitle: "Cairo" },
            { q: "The deepest trench in the Atlantic Ocean is", a: "Puerto Rico Trench", wikiTitle: "Puerto Rico Trench" }
        ];

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

            // Pre-warm the Wikipedia image for the now-current card so by
            // the time the user flips, the bg is cached and renders instantly.
            // (populateCardContent → applyCardBackImage also fires this on
            // first display, but updateUI fires more often — on shuffle too —
            // so the higher-traffic entry point is the right hook.)
            const _currentCard = deck[currentIndex];
            if (_currentCard && _currentCard.wikiTitle && !_currentCard.noImage) {
                prefetchWikiImage(_currentCard.wikiTitle);
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

        async function prefetchWikiImage(title) {
            if (!title) return;
            const key = IMG_CACHE_PREFIX + title;
            // localStorage.getItem returns null when unset; once we cache a
            // URL (either from Wikipedia or Picsum) we never rewrite it, so
            // the same card always renders the same image across reloads.
            if (localStorage.getItem(key) !== null) return;

            let url = '';
            // (1) Try Wikipedia REST first — gives the topic-accurate lead image.
            try {
                const resp = await fetch(WIKI_SUMMARY_BASE + encodeURIComponent(title));
                if (resp.ok) {
                    const data = await resp.json();
                    url = (data.originalimage && data.originalimage.source) || '';
                }
            } catch (e) {
                // Network/CORS failure on Wikipedia — fall through to Picsum.
                // No negative-cache, so a transient error on this visit
                // doesn't permanently lock out the card.
            }

            // (2) Fallback: deterministic Picsum URL keyed on the title.
            //     Always succeeds; gives every card *something* instead of
            //     plain green if Wikipedia doesn't return one.
            if (!url) {
                const seed = encodeURIComponent(String(title).trim().replace(/\s+/g, '-'));
                url = PICFALLBACK_BASE + seed + '/800/600';
            }

            localStorage.setItem(key, url);

            // (3) Race-fix: re-apply to the live card-back if the user is still
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

    