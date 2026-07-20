/**
 * vocab-graph-data.js — Vocabulary synonym/related-words graph data.
 *
 * Connects vocabulary words with similar meanings into clusters for the
 * 3D knowledge graph visualization. Words from the same theme form a
 * "super-cluster" hub, and words with related meanings are connected
 * across themes.
 *
 * Loaded as a classic <script> tag before the graph initialization code.
 */

const vocabGraphData = (function () {
  'use strict';

  // ── Color tokens ──
  var C = {
    negotiation: '#58cc02',  // green
    obstacles:   '#1cb0f6',  // sky blue
    clarity:     '#a570ff',  // grape soda
    depth:       '#ffc700',  // sunshine yellow
    trends:      '#ff9600',  // orange
    rules:       '#cc348d',  // bubblegum pink
    emotions:    '#ff7b00',  // deep orange
    actions:     '#00b8a0',  // teal
    technical:   '#777777',  // graphite
    opposite:    '#e91e63',  // pink (antonyms)
    transitional:'#4caf50',  // green
  };

  var nodes = [
    // ── Theme 1: Negotiation, Diplomacy & Conflict ──
    { id: 'trade_off',       label: 'Trade-Off',         category: 'negotiation', color: C.negotiation, emoji: '⚖️', description: 'A balance achieved between two desirable but incompatible things.' },
    { id: 'back_forth',      label: 'Back And Forth',    category: 'negotiation', color: C.negotiation, emoji: '🔄', description: 'Repeated movement, discussion, or negotiation between two sides.' },
    { id: 'interlocutors',   label: 'Interlocutors',     category: 'negotiation', color: C.negotiation, emoji: '🗣️', description: 'People participating in a conversation or diplomatic negotiation.' },
    { id: 'to_yield',        label: 'To Yield',          category: 'negotiation', color: C.negotiation, emoji: '🏳️', description: 'To give way, surrender, or agree to a demand.' },
    { id: 'sticking_point',  label: 'Sticking Point',    category: 'negotiation', color: C.negotiation, emoji: '📍', description: 'A specific issue preventing an agreement from being reached.' },
    { id: 'deadlock',        label: 'Deadlock',          category: 'negotiation', color: C.negotiation, emoji: '🔒', description: 'A standoff where no progress can be made due to complete disagreement.' },
    { id: 'concession',      label: 'Concession',        category: 'negotiation', color: C.negotiation, emoji: '🤝', description: 'Something you give up during a negotiation to reach a compromise.' },
    { id: 'gambit',          label: 'Gambit',            category: 'negotiation', color: C.negotiation, emoji: '♟️', description: 'A calculated opening move intended to gain an advantage.' },
    { id: 'hammer_out',      label: 'To Hammer Out',     category: 'negotiation', color: C.negotiation, emoji: '🔨', description: 'To negotiate and reach an agreement through intense discussion.' },
    { id: 'to_confront',     label: 'To Confront',       category: 'negotiation', color: C.negotiation, emoji: '⚔️', description: 'To face a hostile force, problem, or person head-on.' },
    { id: 'aggressor',       label: 'Aggressor',         category: 'negotiation', color: C.negotiation, emoji: '💢', description: 'The country, group, or person that attacks first.' },
    { id: 'abdication',      label: 'Abdication',        category: 'negotiation', color: C.negotiation, emoji: '👑', description: 'The act of a leader formally stepping down from power.' },
    { id: 'turn_page',       label: 'Turn The Page',     category: 'negotiation', color: C.negotiation, emoji: '📖', description: 'To move on from a difficult past event and start fresh.' },
    { id: 'onus',            label: 'Onus',              category: 'negotiation', color: C.negotiation, emoji: '🎒', description: 'The burden of responsibility or proof.' },

    // ── Theme 2: Obstacles, Limits & Severe Risks ──
    { id: 'to_constrain',    label: 'To Constrain',      category: 'obstacles', color: C.obstacles, emoji: '🔗', description: 'To limit, restrict, or hold something back.' },
    { id: 'in_the_way',      label: 'In The Way Of',     category: 'obstacles', color: C.obstacles, emoji: '🚧', description: 'Blocking progress; acting as an obstacle to something.' },
    { id: 'hurdle',          label: 'Hurdle',            category: 'obstacles', color: C.obstacles, emoji: '🏃', description: 'A problem or difficulty that must be overcome.' },
    { id: 'to_cripple',      label: 'To Cripple',        category: 'obstacles', color: C.obstacles, emoji: '🩼', description: 'To cause severe damage so something can no longer function.' },
    { id: 'rigidity',        label: 'Rigidity',          category: 'obstacles', color: C.obstacles, emoji: '🧱', description: 'Inflexibility; refusing to change rules even when necessary.' },
    { id: 'redundancy',      label: 'Redundancy',        category: 'obstacles', color: C.obstacles, emoji: '📦', description: 'The state of being no longer needed, or having extra backups.' },
    { id: 'vulnerable',      label: 'Vulnerable',        category: 'obstacles', color: C.obstacles, emoji: '🛡️', description: 'Exposed to the possibility of being attacked or harmed.' },
    { id: 'fragility',       label: 'Fragility',         category: 'obstacles', color: C.obstacles, emoji: '🥚', description: 'The quality of being easily broken or damaged.' },
    { id: 'catastrophic',    label: 'Catastrophic',      category: 'obstacles', color: C.obstacles, emoji: '💥', description: 'Involving sudden, immense disaster and suffering.' },
    { id: 'doomsday',        label: 'Doomsday',          category: 'obstacles', color: C.obstacles, emoji: '☄️', description: 'The day of final judgment; an end-of-the-world scenario.' },
    { id: 'red_flag',        label: 'Red Flag',          category: 'obstacles', color: C.obstacles, emoji: '🚩', description: 'A warning sign indicating danger or a fundamental problem.' },
    { id: 'consequences',    label: 'Consequences',      category: 'obstacles', color: C.obstacles, emoji: '⚠️', description: 'The severe results or fallout of an action.' },
    { id: 'to_backfire',     label: 'To Backfire',       category: 'obstacles', color: C.obstacles, emoji: '💨', description: 'When a plan has the exact opposite effect of what was intended.' },
    { id: 'excessive',       label: 'Excessive',         category: 'obstacles', color: C.obstacles, emoji: '📈', description: 'Going beyond normal, acceptable limits.' },

    // ── Theme 3: Clarity, Analysis & Information ──
    { id: 'to_distinguish',  label: 'To Distinguish',   category: 'clarity',   color: C.clarity,   emoji: '🔍', description: 'To recognize what makes something different.' },
    { id: 'to_posit',        label: 'To Posit',          category: 'clarity',   color: C.clarity,   emoji: '📌', description: 'To assume something as a starting point for an argument.' },
    { id: 'to_assess',       label: 'To Assess',         category: 'clarity',   color: C.clarity,   emoji: '📊', description: 'To evaluate, estimate, or judge the nature of something.' },
    { id: 'precise',         label: 'Precise',           category: 'clarity',   color: C.clarity,   emoji: '🎯', description: 'Exact, accurate, and specific in detail.' },
    { id: 'ambiguous',       label: 'Ambiguous',         category: 'clarity',   color: C.clarity,   emoji: '🌫️', description: 'Unclear, vague, or open to multiple interpretations.' },
    { id: 'explicit',        label: 'Explicit',          category: 'clarity',   color: C.clarity,   emoji: '📢', description: 'Stated clearly and in detail, leaving no room for confusion.' },
    { id: 'hypothetical',    label: 'Hypothetical',      category: 'clarity',   color: C.clarity,   emoji: '💭', description: 'Imagined or theoretical; a "what if" scenario.' },
    { id: 'to_emphasize',    label: 'To Emphasize',      category: 'clarity',   color: C.clarity,   emoji: '❗', description: 'To give special importance to a point or fact.' },
    { id: 'bears_repeating', label: 'Bears Repeating',   category: 'clarity',   color: C.clarity,   emoji: '🔁', description: 'A point so important it should be said again.' },
    { id: 'synthesis',       label: 'Synthesis',         category: 'clarity',   color: C.clarity,   emoji: '🧬', description: 'Combining different ideas to form a coherent whole.' },
    { id: 'to_unearth',      label: 'To Unearth',        category: 'clarity',   color: C.clarity,   emoji: '⛏️', description: 'To discover hidden or secret information through investigation.' },
    { id: 'insinuation',     label: 'Insinuation',       category: 'clarity',   color: C.clarity,   emoji: '👀', description: 'An indirect, subtle suggestion, usually negative.' },
    { id: 'to_parrot',       label: 'To Parrot',         category: 'clarity',   color: C.clarity,   emoji: '🦜', description: 'To mindlessly repeat what someone else has said.' },
    { id: 'to_dilute',       label: 'To Dilute',         category: 'clarity',   color: C.clarity,   emoji: '💧', description: 'To make something weaker in force, content, or value.' },
    { id: 'manifestation',   label: 'Manifestation',     category: 'clarity',   color: C.clarity,   emoji: '✨', description: 'A visible sign or proof of an underlying feeling.' },

    // ── Theme 4: Depth, Scale & Scope ──
    { id: 'shallow',         label: 'Shallow',           category: 'depth',     color: C.depth,     emoji: '🥄', description: 'Lacking depth; superficial.' },
    { id: 'profound',        label: 'Profound',          category: 'depth',     color: C.depth,     emoji: '🌊', description: 'Very deep, intense, or far-reaching.' },
    { id: 'holistic',        label: 'Holistic',          category: 'depth',     color: C.depth,     emoji: '🌐', description: 'Looking at the big picture; treating a system as a whole.' },
    { id: 'integration',     label: 'Integration',       category: 'depth',     color: C.depth,     emoji: '🔗', description: 'Combining parts into a unified whole.' },
    { id: 'diverse',         label: 'Diverse',           category: 'depth',     color: C.depth,     emoji: '🌈', description: 'Showing a great deal of variety.' },
    { id: 'realm',           label: 'Realm',             category: 'depth',     color: C.depth,     emoji: '👑', description: 'A specific field or sphere of activity or knowledge.' },
    { id: 'to_encircle',     label: 'To Encircle',       category: 'depth',     color: C.depth,     emoji: '⭕', description: 'To form a circle around; to surround completely.' },
    { id: 'oriented',        label: 'Oriented',          category: 'depth',     color: C.depth,     emoji: '🧭', description: 'Aimed or directed toward a particular goal.' },

    // ── Theme 5: Trends, Paths & Time ──
    { id: 'zags_away',       label: 'Zags Away',         category: 'trends',    color: C.trends,    emoji: '⚡', description: 'A sudden, sharp, unpredictable change in direction.' },
    { id: 'inevitable',      label: 'Inevitable',        category: 'trends',    color: C.trends,    emoji: '⌛', description: 'Certain to happen; completely unavoidable.' },
    { id: 'tend_to',         label: 'Tend To',           category: 'trends',    color: C.trends,    emoji: '📈', description: 'To regularly behave in a certain way.' },
    { id: 'eventually',      label: 'Eventually',        category: 'trends',    color: C.trends,    emoji: '🕐', description: 'In the end, especially after a long delay.' },
    { id: 'fate',            label: 'Fate',              category: 'trends',    color: C.trends,    emoji: '🔮', description: 'The development of events beyond a person\'s control.' },
    { id: 'to_leap',         label: 'To Leap',           category: 'trends',    color: C.trends,    emoji: '🦘', description: 'To jump or move suddenly and significantly.' },
    { id: 'anticipating',    label: 'Anticipating',      category: 'trends',    color: C.trends,    emoji: '👁️', description: 'Expecting or predicting something to happen.' },

    // ── Theme 6: Rules, Duties & Importance ──
    { id: 'to_abide',        label: 'To Abide',          category: 'rules',     color: C.rules,     emoji: '📜', description: 'To accept and act in accordance with a rule.' },
    { id: 'to_adhere',       label: 'To Adhere',         category: 'rules',     color: C.rules,     emoji: '🧲', description: 'To stick fast to, or follow a practice strictly.' },
    { id: 'obligation',      label: 'Obligation',        category: 'rules',     color: C.rules,     emoji: '📋', description: 'A moral or legal duty to do something.' },
    { id: 'crucial',         label: 'Crucial',           category: 'rules',     color: C.rules,     emoji: '🔥', description: 'Extremely important; absolutely necessary for success.' },
    { id: 'flawless',        label: 'Flawless',          category: 'rules',     color: C.rules,     emoji: '💎', description: 'Perfect in execution; without any defects.' },
    { id: 'to_stick',        label: 'To Stick',          category: 'rules',     color: C.rules,     emoji: '📌', description: 'To remain fixed or to persist in doing something.' },
    { id: 'sine_qua_non',    label: 'Sine Qua Non',      category: 'rules',     color: C.rules,     emoji: '🔑', description: '(Latin) An indispensable condition; absolutely required.' },

    // ── Theme 7: Human Emotions, Traits & Attitudes ──
    { id: 'to_console',      label: 'To Console',        category: 'emotions',  color: C.emotions,  emoji: '🤗', description: 'To comfort someone in a time of grief.' },
    { id: 'optimistic',      label: 'Optimistic',        category: 'emotions',  color: C.emotions,  emoji: '😊', description: 'Hopeful and confident about the future.' },
    { id: 'sincere',         label: 'Sincere',           category: 'emotions',  color: C.emotions,  emoji: '💙', description: 'Free from pretense or deceit; genuine.' },
    { id: 'involuntary',     label: 'Involuntary',       category: 'emotions',  color: C.emotions,  emoji: '😳', description: 'Done without will or conscious control.' },
    { id: 'trait',           label: 'Trait',             category: 'emotions',  color: C.emotions,  emoji: '🧬', description: 'A distinguishing quality or characteristic.' },
    { id: 'temperament',     label: 'Temperament',       category: 'emotions',  color: C.emotions,  emoji: '🌡️', description: 'A person\'s nature or general disposition.' },
    { id: 'compassion',      label: 'Compassion',        category: 'emotions',  color: C.emotions,  emoji: '❤️', description: 'Deep sympathy and desire to help those suffering.' },
    { id: 'to_cuddle',       label: 'To Cuddle',         category: 'emotions',  color: C.emotions,  emoji: '🫂', description: 'To hold close for warmth or comfort.' },
    { id: 'batty',           label: 'Batty',             category: 'emotions',  color: C.emotions,  emoji: '🦇', description: 'Crazy, irrational, or completely foolish.' },
    { id: 'bizarre',         label: 'Bizarre',           category: 'emotions',  color: C.emotions,  emoji: '👽', description: 'Very strange, unusual, or unexpected.' },
    { id: 'to_fantasize',    label: 'To Fantasize',      category: 'emotions',  color: C.emotions,  emoji: '💭', description: 'To indulge in daydreams or imagine unlikely things.' },
    { id: 'to_fascinate',    label: 'To Fascinate',      category: 'emotions',  color: C.emotions,  emoji: '🌟', description: 'To attract strong interest and attention.' },
    { id: 'low_key',         label: 'Low Key',           category: 'emotions',  color: C.emotions,  emoji: '🤫', description: 'Quiet, restrained, or modest.' },
    { id: 'screw_them',      label: 'Screw Them',        category: 'emotions',  color: C.emotions,  emoji: '💢', description: 'A dismissive attitude showing anger.' },
    { id: 'obstinate',       label: 'Obstinate',         category: 'emotions',  color: C.emotions,  emoji: '🫏', description: 'Stubbornly refusing to change one\'s mind.' },
    { id: 'fierce',          label: 'Fierce',            category: 'emotions',  color: C.emotions,  emoji: '🐯', description: 'Intense, aggressive, or highly competitive.' },
    { id: 'inclusive',       label: 'Inclusive',         category: 'emotions',  color: C.emotions,  emoji: '🤝', description: 'Including all people; not leaving anyone out.' },

    // ── Theme 8: Actions, Habits, Groups & Growth ──
    { id: 'to_tolerate',     label: 'To Tolerate',       category: 'actions',   color: C.actions,   emoji: '🧘', description: 'To allow existence without interference; to endure.' },
    { id: 'to_shun',         label: 'To Shun',           category: 'actions',   color: C.actions,   emoji: '🚫', description: 'To persistently avoid, ignore, or reject.' },
    { id: 'to_recycle',      label: 'To Recycle',        category: 'actions',   color: C.actions,   emoji: '♻️', description: 'To convert waste into reusable material.' },
    { id: 'to_incline',      label: 'To Incline',        category: 'actions',   color: C.actions,   emoji: '↗️', description: 'To feel willing or favorably disposed toward something.' },
    { id: 'to_ingrain',      label: 'To Ingrain',        category: 'actions',   color: C.actions,   emoji: '🌱', description: 'To firmly establish a habit or belief.' },
    { id: 'to_embody',       label: 'To Embody',         category: 'actions',   color: C.actions,   emoji: '🪞', description: 'To be a perfect example of an idea or quality.' },
    { id: 'to_accumulate',   label: 'To Accumulate',     category: 'actions',   color: C.actions,   emoji: '📚', description: 'To gather together or acquire increasing quantity.' },
    { id: 'to_commemorate',  label: 'To Commemorate',    category: 'actions',   color: C.actions,   emoji: '🏛️', description: 'To recall and show respect for someone or something.' },
    { id: 'pursuit',         label: 'Pursuit',           category: 'actions',   color: C.actions,   emoji: '🎯', description: 'The action of following or pursuing a goal.' },
    { id: 'cult',            label: 'Cult',              category: 'actions',   color: C.actions,   emoji: '🔮', description: 'A group with extreme beliefs, or an obsessive following.' },
    { id: 'cohort',          label: 'Cohort',            category: 'actions',   color: C.actions,   emoji: '👥', description: 'A group of people banded together.' },
    { id: 'lucrative',       label: 'Lucrative',         category: 'actions',   color: C.actions,   emoji: '💰', description: 'Producing a great deal of profit.' },
    { id: 'resilience',      label: 'Resilience',        category: 'actions',   color: C.actions,   emoji: '💪', description: 'The capacity to recover quickly from difficulties.' },
    { id: 'to_cultivate',    label: 'To Cultivate',      category: 'actions',   color: C.actions,   emoji: '🌿', description: 'To carefully nurture or develop something over time.' },
    { id: 'to_hammer',       label: 'To Hammer',         category: 'actions',   color: C.actions,   emoji: '🔨', description: 'To aggressively attack, criticize, or drive down.' },
    { id: 'incentive',       label: 'Incentive',         category: 'actions',   color: C.actions,   emoji: '🏆', description: 'Something that motivates or encourages action.' },

    // ── Theme 9: Technical, Metaphorical & Transitions ──
    { id: 'knob',            label: 'Knob',              category: 'technical',  color: C.technical, emoji: '🎛️', description: 'A control dial; a parameter that can be adjusted.' },
    { id: 'argmax',          label: 'Argmax',            category: 'technical',  color: C.technical, emoji: '📐', description: 'The input that produces the maximum output of a function.' },
    { id: 'low_pass_filter', label: 'Low-Pass Filter',   category: 'technical',  color: C.technical, emoji: '🔽', description: 'A filter that passes low frequencies but reduces high ones.' },
    { id: 'unlike',          label: 'Unlike',            category: 'technical',  color: C.technical, emoji: '🔄', description: 'A preposition comparing two things that are different.' },
    { id: 'however',         label: 'However',           category: 'technical',  color: C.technical, emoji: '↩️', description: 'A transition word introducing a contrasting statement.' },
  ];

  // ── Edges (synonym / related connections) ──
  var edges = [

    // ── Theme 1 clusters ──
    // Negotiation process
    { source: 'back_forth',     target: 'interlocutors',  weight: 1.5 },
    { source: 'back_forth',     target: 'hammer_out',     weight: 1.5 },
    { source: 'hammer_out',     target: 'deadlock',       weight: 1.2 },
    { source: 'hammer_out',     target: 'concession',     weight: 1.5 },
    { source: 'sticking_point', target: 'deadlock',       weight: 2.0 },
    { source: 'sticking_point', target: 'concession',     weight: 1.2 },
    { source: 'concession',     target: 'trade_off',      weight: 2.0 },
    { source: 'gambit',         target: 'back_forth',     weight: 1.0 },
    { source: 'onus',           target: 'concession',     weight: 1.0 },

    // Conflict cluster
    { source: 'to_confront',    target: 'aggressor',      weight: 2.0 },
    { source: 'to_confront',    target: 'to_yield',       weight: 1.5 },  // antonyms
    { source: 'aggressor',      target: 'to_yield',       weight: 1.0 },

    // Resolution cluster
    { source: 'abdication',     target: 'turn_page',      weight: 1.5 },
    { source: 'abdication',     target: 'to_yield',       weight: 1.2 },
    { source: 'turn_page',      target: 'concession',     weight: 1.0 },

    // ── Theme 2 clusters ──
    // Obstacles
    { source: 'to_constrain',   target: 'in_the_way',     weight: 2.0 },
    { source: 'to_constrain',   target: 'hurdle',         weight: 1.5 },
    { source: 'in_the_way',     target: 'hurdle',         weight: 1.5 },
    { source: 'hurdle',         target: 'to_cripple',     weight: 1.2 },
    { source: 'to_cripple',     target: 'rigidity',       weight: 1.2 },
    { source: 'rigidity',       target: 'redundancy',     weight: 1.0 },

    // Fragility / vulnerability cluster
    { source: 'vulnerable',     target: 'fragility',      weight: 2.0 },
    { source: 'fragility',      target: 'catastrophic',   weight: 1.5 },
    { source: 'catastrophic',   target: 'doomsday',       weight: 2.0 },
    { source: 'catastrophic',   target: 'consequences',   weight: 1.5 },
    { source: 'to_cripple',     target: 'catastrophic',   weight: 1.2 },

    // Warnings cluster
    { source: 'red_flag',       target: 'to_backfire',    weight: 1.5 },
    { source: 'red_flag',       target: 'consequences',   weight: 1.5 },
    { source: 'to_backfire',    target: 'consequences',   weight: 1.5 },
    { source: 'excessive',      target: 'red_flag',       weight: 1.0 },
    { source: 'excessive',      target: 'catastrophic',   weight: 1.0 },
    { source: 'vulnerable',     target: 'red_flag',       weight: 1.0 },

    // ── Theme 3 clusters ──
    // Clarity cluster
    { source: 'to_distinguish', target: 'precise',        weight: 1.5 },
    { source: 'to_distinguish', target: 'to_assess',      weight: 1.5 },
    { source: 'precise',        target: 'explicit',       weight: 2.0 },
    { source: 'explicit',       target: 'ambiguous',      weight: 1.5 },  // opposites
    { source: 'explicit',       target: 'to_emphasize',   weight: 1.2 },
    { source: 'to_emphasize',   target: 'bears_repeating',weight: 2.0 },

    // Analysis cluster
    { source: 'to_assess',      target: 'to_posit',       weight: 1.5 },
    { source: 'to_assess',      target: 'synthesis',      weight: 1.5 },
    { source: 'synthesis',      target: 'to_unearth',     weight: 1.2 },
    { source: 'to_unearth',     target: 'insinuation',    weight: 1.0 },
    { source: 'hypothetical',   target: 'to_posit',       weight: 1.5 },
    { source: 'hypothetical',   target: 'ambiguous',      weight: 1.0 },

    // Miscommunication cluster
    { source: 'ambiguous',      target: 'insinuation',    weight: 1.5 },
    { source: 'to_parrot',      target: 'to_dilute',      weight: 1.2 },
    { source: 'to_dilute',      target: 'ambiguous',      weight: 1.2 },
    { source: 'manifestation',  target: 'explicit',       weight: 1.0 },

    // ── Theme 4 clusters ──
    // Depth opposites
    { source: 'shallow',        target: 'profound',       weight: 2.0 },  // direct antonyms!
    { source: 'profound',       target: 'holistic',       weight: 1.5 },
    { source: 'holistic',       target: 'integration',    weight: 2.0 },
    { source: 'integration',    target: 'diverse',        weight: 1.5 },
    { source: 'holistic',       target: 'realm',          weight: 1.2 },
    { source: 'realm',          target: 'oriented',       weight: 1.0 },
    { source: 'to_encircle',    target: 'holistic',       weight: 1.0 },
    { source: 'diverse',        target: 'integration',    weight: 1.5 },

    // ── Theme 5 clusters ──
    // Trends / direction
    { source: 'zags_away',      target: 'to_leap',        weight: 1.5 },
    { source: 'zags_away',      target: 'tend_to',        weight: 1.0 },  // contrast
    { source: 'tend_to',        target: 'inevitable',     weight: 1.5 },
    { source: 'inevitable',     target: 'fate',           weight: 2.0 },
    { source: 'inevitable',     target: 'eventually',     weight: 1.5 },
    { source: 'fate',           target: 'eventually',     weight: 1.2 },
    { source: 'anticipating',   target: 'fate',           weight: 1.0 },
    { source: 'anticipating',   target: 'tend_to',        weight: 1.2 },

    // ── Theme 6 clusters ──
    // Duty cluster
    { source: 'to_abide',       target: 'to_adhere',      weight: 2.0 },
    { source: 'to_abide',       target: 'obligation',     weight: 1.5 },
    { source: 'to_adhere',      target: 'obligation',     weight: 1.5 },
    { source: 'obligation',     target: 'to_stick',       weight: 1.2 },
    { source: 'to_stick',       target: 'to_abide',       weight: 1.2 },

    // Importance cluster
    { source: 'crucial',        target: 'sine_qua_non',   weight: 2.0 },
    { source: 'crucial',        target: 'flawless',       weight: 1.2 },
    { source: 'sine_qua_non',   target: 'obligation',     weight: 1.2 },
    { source: 'flawless',       target: 'to_stick',       weight: 1.0 },

    // ── Theme 7 clusters ──
    // Positive emotions
    { source: 'optimistic',     target: 'sincere',        weight: 1.5 },
    { source: 'compassion',     target: 'to_console',     weight: 2.0 },
    { source: 'compassion',     target: 'to_cuddle',      weight: 1.5 },
    { source: 'to_console',     target: 'to_cuddle',      weight: 1.5 },
    { source: 'inclusive',      target: 'compassion',     weight: 1.2 },
    { source: 'optimistic',     target: 'to_fascinate',   weight: 1.0 },

    // Negative / intense emotions
    { source: 'batty',          target: 'bizarre',        weight: 2.0 },
    { source: 'batty',          target: 'obstinate',      weight: 1.2 },
    { source: 'bizarre',        target: 'to_fantasize',   weight: 1.0 },
    { source: 'obstinate',      target: 'fierce',         weight: 1.5 },
    { source: 'fierce',         target: 'screw_them',     weight: 1.5 },
    { source: 'low_key',        target: 'to_fantasize',   weight: 0.8 },

    // Personality traits
    { source: 'trait',          target: 'temperament',    weight: 2.0 },
    { source: 'temperament',    target: 'involuntary',    weight: 1.0 },
    { source: 'trait',          target: 'obstinate',      weight: 1.0 },
    { source: 'sincere',        target: 'trait',          weight: 1.0 },

    // ── Theme 8 clusters ──
    // Tolerance vs rejection
    { source: 'to_tolerate',    target: 'to_shun',        weight: 2.0 },  // antonyms
    { source: 'to_tolerate',    target: 'to_incline',     weight: 1.2 },
    { source: 'to_shun',        target: 'screw_them',     weight: 1.0 },

    // Growth / accumulation
    { source: 'to_accumulate',  target: 'to_ingrain',     weight: 1.5 },
    { source: 'to_accumulate',  target: 'to_cultivate',   weight: 1.5 },
    { source: 'to_ingrain',     target: 'to_cultivate',   weight: 1.5 },
    { source: 'to_cultivate',   target: 'to_recycle',     weight: 1.0 },
    { source: 'to_ingrain',     target: 'to_embody',      weight: 1.2 },

    // Representation
    { source: 'to_embody',      target: 'to_commemorate', weight: 1.5 },
    { source: 'to_commemorate', target: 'manifestation',  weight: 1.0 },
    { source: 'to_commemorate', target: 'pursuit',        weight: 1.0 },

    // Groups
    { source: 'cult',           target: 'cohort',         weight: 2.0 },
    { source: 'cohort',         target: 'pursuit',        weight: 1.0 },
    { source: 'cult',           target: 'to_tolerate',    weight: 0.8 },

    // Reward / effort
    { source: 'lucrative',      target: 'incentive',      weight: 2.0 },
    { source: 'lucrative',      target: 'pursuit',        weight: 1.2 },
    { source: 'incentive',      target: 'pursuit',        weight: 1.5 },
    { source: 'resilience',     target: 'to_hammer',      weight: 1.2 },
    { source: 'to_hammer',      target: 'hammer_out',     weight: 1.5 },  // cross-theme connection!
    { source: 'resilience',     target: 'to_cultivate',   weight: 1.0 },

    // ── Theme 9 clusters ──
    { source: 'knob',           target: 'argmax',         weight: 1.0 },
    { source: 'argmax',         target: 'low_pass_filter',weight: 1.2 },
    { source: 'low_pass_filter',target: 'knob',           weight: 1.0 },

    // Transitions
    { source: 'unlike',         target: 'however',        weight: 1.5 },
    { source: 'however',        target: 'turn_page',      weight: 0.8 },
    { source: 'unlike',         target: 'distinguish',    weight: 0.5 },

    // ── Cross-theme synonym connections ──
    // "Compromise" connection
    { source: 'trade_off',      target: 'concession',     weight: 1.8 },
    { source: 'concession',     target: 'resilience',     weight: 0.8 },

    // "Stubbornness" cluster
    { source: 'obstinate',      target: 'rigidity',       weight: 2.0 },
    { source: 'rigidity',       target: 'to_stick',       weight: 1.2 },
    { source: 'obstinate',      target: 'to_adhere',      weight: 1.0 },  // too much adherence
    { source: 'fierce',         target: 'to_hammer',      weight: 1.2 },

    // "Weakness" cluster
    { source: 'vulnerable',     target: 'fragility',      weight: 1.8 },
    { source: 'fragility',      target: 'shallow',        weight: 1.0 },

    // "Strength" cluster
    { source: 'resilience',     target: 'profound',       weight: 1.0 },
    { source: 'resilience',     target: 'flawless',       weight: 1.0 },
    { source: 'fierce',         target: 'crucial',        weight: 0.8 },

    // "Uncertainty" cluster
    { source: 'ambiguous',      target: 'hypothetical',   weight: 1.5 },
    { source: 'hypothetical',   target: 'fate',           weight: 1.0 },
    { source: 'ambiguous',      target: 'eventually',     weight: 0.8 },

    // "Revelation" cluster
    { source: 'to_unearth',     target: 'manifestation',  weight: 1.5 },
    { source: 'manifestation',  target: 'synthesis',      weight: 1.2 },
    { source: 'synthesis',      target: 'integration',    weight: 1.5 },

    // "Direction" cluster
    { source: 'zags_away',      target: 'to_leap',        weight: 1.5 },
    { source: 'to_leap',        target: 'to_encircle',    weight: 0.8 },
    { source: 'oriented',       target: 'tend_to',        weight: 1.0 },
    { source: 'oriented',       target: 'to_incline',     weight: 1.5 },
    { source: 'to_incline',     target: 'tend_to',        weight: 1.5 },

    // "Change" cluster
    { source: 'turn_page',      target: 'to_recycle',     weight: 1.0 },
    { source: 'turn_page',      target: 'to_cultivate',   weight: 0.8 },

    // "Avoidance" cluster
    { source: 'to_shun',        target: 'to_yield',       weight: 1.0 },
    { source: 'to_shun',        target: 'in_the_way',     weight: 0.8 },

    // "Clarity vs Obscurity"
    { source: 'precise',        target: 'explicit',       weight: 1.8 },
    { source: 'explicit',       target: 'ambiguous',      weight: 1.5 },  // direct opposites
    { source: 'ambiguous',      target: 'insinuation',    weight: 1.2 },
    { source: 'precise',        target: 'to_distinguish', weight: 1.3 },

    // ── Cross-theme "Intensity" cluster ──
    { source: 'excessive',      target: 'catastrophic',   weight: 1.2 },
    { source: 'excessive',      target: 'fierce',         weight: 1.0 },
    { source: 'catastrophic',   target: 'doomsday',       weight: 1.8 },
    { source: 'catastrophic',   target: 'consequences',   weight: 1.3 },
    { source: 'profound',       target: 'catastrophic',   weight: 0.8 },  // intensity connection

    // ── Cross-theme "Future / Time" cluster ──
    { source: 'anticipating',   target: 'fate',           weight: 1.2 },
    { source: 'anticipating',   target: 'inevitable',     weight: 1.3 },
    { source: 'anticipating',   target: 'eventually',     weight: 1.2 },
    { source: 'anticipating',   target: 'tend_to',        weight: 1.0 },
    { source: 'eventually',     target: 'inevitable',     weight: 1.5 },
    { source: 'fate',           target: 'inevitable',     weight: 1.8 },

    // ── Cross-theme "Groups / Collectives" ──
    { source: 'cohort',         target: 'cult',           weight: 1.5 },
    { source: 'cohort',         target: 'interlocutors',  weight: 1.0 },
    { source: 'cult',           target: 'aggressor',      weight: 0.8 },

    // ── Theme hubs (each theme hub connected to its words) ──
    // These create the "theme cluster" visual effect. We'll use
    // implicit edges since nodes already share the color code.
  ];

  // Helper
  function getNode(id) {
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id === id) return nodes[i];
    }
    return null;
  }

  return {
    nodes: nodes,
    edges: edges,
    getNode: getNode,
    categories: (function () {
      var cats = {};
      nodes.forEach(function (n) {
        if (!cats[n.category]) cats[n.category] = { color: n.color, count: 0 };
        cats[n.category].count++;
      });
      return cats;
    })()
  };
})();
