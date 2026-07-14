        /* --- 1. Design Tokens --- */
        :root {
            --color-duo-green: #58cc02;
            --color-sky-blue: #1cb0f6;
            --color-duo-green-light: #d7ffb8;
            --color-sunshine-yellow: #ffc700;
            --color-snow-white: #ffffff;
            --color-cloud-gray: #e5e5e5;
            --color-silver: #afafaf;
            --color-graphite: #777777;
            --color-charcoal: #4b4b4b;
            --color-almost-black: #3c3c3c;
            --shadow-primary: #3f8f01; 
            
            --font-feather: 'Fredoka', ui-sans-serif, system-ui, sans-serif;
            --font-din-round: 'Nunito Sans', ui-sans-serif, system-ui, sans-serif;

            --radius-cards: 16px;
            --radius-buttons: 12px;
        }

        /* --- 2. Global Styles (Native App Feel) --- */
        body {
            background-color: var(--color-snow-white);
            color: var(--color-almost-black);
            font-family: var(--font-din-round);
            margin: 0;
            padding: 0;
            height: 100dvh; 
            overflow: hidden; 
            display: flex;
            justify-content: center;
            box-sizing: border-box;
            -webkit-font-smoothing: antialiased;
            letter-spacing: 0.053em;
        }

        .app-container {
            width: 100%;
            max-width: 500px;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 24px 20px 32px 20px; 
            box-sizing: border-box;
            user-select: none;
            -webkit-user-select: none; 
        }

        /* --- 3. Header & Progress --- */
        .header {
            display: flex;
            flex-direction: column;
            gap: 16px;
            flex-shrink: 0; 
        }

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        h1 {
            font-family: var(--font-feather);
            font-size: 24px;
            font-weight: 700;
            color: var(--color-duo-green);
            margin: 0;
            letter-spacing: -0.02em;
        }

        .btn-header {
            background-color: transparent;
            color: var(--color-sky-blue);
            border: 2px solid var(--color-cloud-gray);
            padding: 8px 16px;
            border-radius: var(--radius-buttons);
            font-size: 12px;
            box-shadow: 0 4px 0 var(--color-cloud-gray);
        }

        .btn-header:active {
            transform: translateY(4px);
            box-shadow: 0 0 0 transparent;
        }

        .progress-container {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .progress-text {
            font-size: 13px;
            font-weight: 700;
            color: var(--color-silver);
            text-transform: uppercase;
        }

        .timer-text {
            color: var(--color-sky-blue);
            margin-right: 12px;
            font-variant-numeric: tabular-nums; /* Keeps timer width stable */
        }

        .progress-track {
            width: 100%;
            height: 14px;
            background-color: var(--color-cloud-gray);
            border-radius: 12px;
            overflow: hidden;
        }

        .progress-fill {
            height: 100%;
            background-color: var(--color-duo-green);
            width: 0%;
            transition: width 0.3s ease;
            border-radius: 12px;
            box-shadow: inset 0 3px 0 rgba(255,255,255,0.3); 
        }

        /* --- 4. Flashcard Layout --- */
        .card-wrapper {
            flex-grow: 1; 
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 32px 0;
        }

        .card-scene {
            perspective: 1000px;
            width: 100%;
            height: 100%;
            max-height: 400px; 
            cursor: pointer;
            touch-action: pan-y;
        }

        .card {
            width: 100%;
            height: 100%;
            position: relative;
            transition: transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1);
            transform-style: preserve-3d;
        }

        .card.is-flipped {
            transform: rotateY(180deg);
        }
        
        .no-transition {
            transition: none !important;
        }

        .card-face {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            background-color: var(--color-snow-white);
            border: 2px solid var(--color-cloud-gray);
            border-radius: var(--radius-cards);
            box-shadow: 0 6px 0 var(--color-cloud-gray); 
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 24px;
            box-sizing: border-box;
            text-align: center;
        }

        .card-back {
            transform: rotateY(180deg);
            background-color: var(--color-duo-green-light);
            border-color: var(--color-duo-green);
            box-shadow: 0 6px 0 var(--shadow-primary);
        }

        /* Image-background feature: when JS toggles `.has-bg`, the card-back
           shows a real photo via background-image, with a tinted scrim so
           the answer text stays legible. The base --color-duo-green-light
           still underlays everything, so if the image fails the card looks
           like the classic plain green back. The scrim color is just
           --color-duo-green-light at 65% alpha — no new design tokens. */
        .card-back.has-bg {
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            overflow: hidden;
        }
        .card-back.has-bg::before {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(215, 255, 184, 0.65);
            pointer-events: none;
            z-index: 0;
        }
        /* Keep label/content/instruction above the scrim. .card-content is
           static-flow by default; needs explicit position:relative for
           z-index to apply. .card-label and .instruction already have
           position:absolute, so z-index works directly on them. */
        .card-back.has-bg .card-content {
            position: relative;
            z-index: 1;
        }
        .card-back.has-bg .card-label,
        .card-back.has-bg .instruction {
            z-index: 1;
        }

        .card-label {
            font-size: 13px;
            color: var(--color-silver);
            font-weight: 700;
            text-transform: uppercase;
            position: absolute;
            top: 24px;
        }

        .card-back .card-label {
            color: var(--shadow-primary);
        }

        .card-content {
            font-size: 22px;
            font-weight: 700;
            line-height: 1.35;
            color: var(--color-almost-black);
            max-width: 95%;
        }
        
        .card-back .card-content {
            color: var(--color-almost-black); 
            font-size: 24px; 
        }

        .instruction {
            font-size: 13px;
            color: var(--color-graphite);
            font-weight: 500;
            position: absolute;
            bottom: 24px;
            line-height: 1.4;
        }

        .card-back .instruction {
            color: var(--shadow-primary);
        }

        /* --- 5. Bottom Controls (Anchored) --- */
        .controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            gap: 12px;
            flex-shrink: 0;
            padding-bottom: env(safe-area-inset-bottom);
        }

        button {
            font-family: var(--font-din-round);
            text-transform: uppercase;
            font-weight: 700;
            font-size: 15px;
            letter-spacing: 0.053em;
            border: none;
            cursor: pointer;
            border-radius: var(--radius-buttons);
            transition: transform 0.1s ease, box-shadow 0.1s ease, background-color 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            outline: none;
            touch-action: manipulation;
            height: 56px; 
        }
