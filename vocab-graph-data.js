/**
 * vocab-graph-data.js — Vocabulary synonym/related-words graph data.
 *
 * Connects vocabulary words with similar meanings into clusters for the
 * 3D knowledge graph visualization. Words from the same theme form a
 * "super-cluster" hub, and words with related meanings are connected
 * across themes.
 *
 * Loaded as a classic <script> tag before the graph initialization code.
 *
 * Per-node shape (new fields are optional; render gracefully falls back
 * to the description when a field is missing):
 *   {
 *     id, label, category, color, emoji,
 *     description,                       // one-line definition (always present)
 *     examples:    [str],                // 1–2 real-life usage sentences
 *     context:     str,                  // tone / register tag
 *     synonyms:    [str],                // 1–3 close-meaning words
 *     contrast:    [{ word: str,         // opposite-direction words &
 *                    rel:  str }]        //   how they go the other way
 *   }
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
    { id: 'trade_off',       label: 'Trade-Off',         category: 'negotiation', color: C.negotiation, emoji: '⚖️',
      description: 'A balance achieved between two desirable but incompatible things.',
      examples:    ['We had to accept a trade-off between launch speed and feature depth.', 'Higher pay usually comes with a trade-off of longer hours.'],
      context:     'business meeting',
      synonyms:    ['compromise', 'exchange'],
      contrast:    [{ word: 'win-win', rel: 'positive outcome' }, { word: 'stalemate', rel: 'no movement' }] },

    { id: 'back_forth',      label: 'Back And Forth',    category: 'negotiation', color: C.negotiation, emoji: '🔄',
      description: 'Repeated movement, discussion, or negotiation between two sides.',
      examples:    ['The proposal went through weeks of back and forth before it was finalized.', 'There was a lot of back and forth before she signed.'],
      context:     'workplace / negotiation',
      synonyms:    ['give-and-take', 'wheeling-dealing'],
      contrast:    [{ word: 'agreement', rel: 'resolution' }, { word: 'resolved in one shot', rel: 'no iteration' }] },

    { id: 'interlocutors',   label: 'Interlocutors',     category: 'negotiation', color: C.negotiation, emoji: '🗣️',
      description: 'People participating in a conversation or diplomatic negotiation.',
      examples:    ['The two interlocutors agreed to disagree for the moment.', 'Both interlocutors were interviewed after the summit.'],
      context:     'diplomatic / formal',
      synonyms:    ['parties', 'speakers'],
      contrast:    [{ word: 'observer', rel: 'outsider' }, { word: 'mediator', rel: 'neutral third party' }] },

    { id: 'to_yield',        label: 'To Yield',          category: 'negotiation', color: C.negotiation, emoji: '🏳️',
      description: 'To give way, surrender, or agree to a demand.',
      examples:    ['She refused to yield to the pressure tactics at the bargaining table.', 'The general ordered the troops to yield ground overnight.'],
      context:     'war reporting / politics',
      synonyms:    ['concede', 'surrender'],
      contrast:    [{ word: 'resist', rel: 'hold firm' }, { word: 'insist', rel: 'demand' }] },

    { id: 'sticking_point',  label: 'Sticking Point',    category: 'negotiation', color: C.negotiation, emoji: '📍',
      description: 'A specific issue preventing an agreement from being reached.',
      examples:    ['Workforce pay remained the sticking point in the merger.', 'For them, the warranty terms were a sticking point.'],
      context:     'business negotiation',
      synonyms:    ['blocker', 'obstacle'],
      contrast:    [{ word: 'consensus', rel: 'all agreed' }, { word: 'easy win', rel: 'no friction' }] },

    { id: 'deadlock',        label: 'Deadlock',          category: 'negotiation', color: C.negotiation, emoji: '🔒',
      description: 'A standoff where no progress can be made due to complete disagreement.',
      examples:    ['Six months of negotiations ended in deadlock.', 'The jury reached deadlock after two days.'],
      context:     'news / legal',
      synonyms:    ['stalemate', 'impasse'],
      contrast:    [{ word: 'breakthrough', rel: 'sudden progress' }, { word: 'agreement', rel: 'resolved' }] },

    { id: 'concession',      label: 'Concession',        category: 'negotiation', color: C.negotiation, emoji: '🤝',
      description: 'Something you give up during a negotiation to reach a compromise.',
      examples:    ['Each side offered a small concession to keep talks moving.', 'Free breakfast was a concession to win over the picky client.'],
      context:     'negotiation / sales',
      synonyms:    ['compromise', 'give'],
      contrast:    [{ word: 'demand', rel: 'insistence' }, { word: 'refusal', rel: 'rejection' }] },

    { id: 'gambit',          label: 'Gambit',            category: 'negotiation', color: C.negotiation, emoji: '♟️',
      description: 'A calculated opening move intended to gain an advantage.',
      examples:    ['Their low opening bid was clearly a gambit.', 'Posting the job listing was a media-savvy gambit.'],
      context:     'strategy / chess',
      synonyms:    ['move', 'ploy'],
      contrast:    [{ word: 'blunder', rel: 'miscalculation' }, { word: 'mistake', rel: 'unintended' }] },

    { id: 'hammer_out',      label: 'To Hammer Out',     category: 'negotiation', color: C.negotiation, emoji: '🔨',
      description: 'To negotiate and reach an agreement through intense discussion.',
      examples:    ['They hammered out the deal over two marathon weekends.', 'The committee finally hammered out the wording.'],
      context:     'workplace / legal',
      synonyms:    ['negotiate', 'iron out'],
      contrast:    [{ word: 'ignore', rel: 'shelve' }, { word: 'stall', rel: 'kicks down the road' }] },

    { id: 'to_confront',     label: 'To Confront',       category: 'negotiation', color: C.negotiation, emoji: '⚔️',
      description: 'To face a hostile force, problem, or person head-on.',
      examples:    ['The CEO chose to confront the rumors head on.', 'He confronted the bully at the school gate.'],
      context:     'workplace / interpersonal',
      synonyms:    ['face', 'challenge'],
      contrast:    [{ word: 'avoid', rel: 'sidestep' }, { word: 'ignore', rel: 'look past' }] },

    { id: 'aggressor',       label: 'Aggressor',         category: 'negotiation', color: C.negotiation, emoji: '💢',
      description: 'The country, group, or person that attacks first.',
      examples:    ['The aggressor crossed the border first.', 'Each side blamed the other for being the aggressor.'],
      context:     'war / news',
      synonyms:    ['attacker', 'invader'],
      contrast:    [{ word: 'defender', rel: 'protective side' }, { word: 'victim', rel: 'targeted side' }] },

    { id: 'abdication',      label: 'Abdication',        category: 'negotiation', color: C.negotiation, emoji: '👑',
      description: 'The act of a leader formally stepping down from power.',
      examples:    ['His sudden abdication shocked the country.', 'The board chair announced her abdication at the AGM.'],
      context:     'politics / corporate',
      synonyms:    ['resignation', 'renunciation'],
      contrast:    [{ word: 'coronation', rel: 'taking power' }, { word: 'seizure', rel: 'forced takeover' }] },

    { id: 'turn_page',       label: 'Turn The Page',     category: 'negotiation', color: C.negotiation, emoji: '📖',
      description: 'To move on from a difficult past event and start fresh.',
      examples:    ['After the scandal it was time to turn the page.', 'They decided to turn the page on the dispute and start fresh.'],
      context:     'everyday / idiomatic',
      synonyms:    ['move on', 'start over'],
      contrast:    [{ word: 'dwell', rel: 'ruminate' }, { word: 'relive', rel: 'look backward' }] },

    { id: 'onus',            label: 'Onus',              category: 'negotiation', color: C.negotiation, emoji: '🎒',
      description: 'The burden of responsibility or proof.',
      examples:    ['The onus is on the home team to defend its record.', 'The onus of proof lies with the prosecution.'],
      context:     'formal / legal',
      synonyms:    ['burden', 'responsibility'],
      contrast:    [{ word: 'exoneration', rel: 'cleared' }, { word: 'release', rel: 'freed from duty' }] },

    // ── Theme 2: Obstacles, Limits & Severe Risks ──
    { id: 'to_constrain',    label: 'To Constrain',      category: 'obstacles', color: C.obstacles, emoji: '🔗',
      description: 'To limit, restrict, or hold something back.',
      examples:    ['Bureaucracy continues to constrain small businesses.', 'A tight budget constrained what we could ship.'],
      context:     'business / policy',
      synonyms:    ['limit', 'restrict'],
      contrast:    [{ word: 'liberate', rel: 'set free' }, { word: 'empower', rel: 'give more to' }] },

    { id: 'in_the_way',      label: 'In The Way Of',     category: 'obstacles', color: C.obstacles, emoji: '🚧',
      description: 'Blocking progress; acting as an obstacle to something.',
      examples:    ['Funding shortages got in the way of progress.', 'Her self-doubt was in the way of negotiating harder.'],
      context:     'everyday / narrative',
      synonyms:    ['blocking', 'impeding'],
      contrast:    [{ word: 'helping', rel: 'facilitating' }, { word: 'enabling', rel: 'supportive' }] },

    { id: 'hurdle',          label: 'Hurdle',            category: 'obstacles', color: C.obstacles, emoji: '🏃',
      description: 'A problem or difficulty that must be overcome to achieve something.',
      examples:    ['Passing the language test was the biggest hurdle.', 'Each regulatory hurdle adds three months to the launch.'],
      context:     'workplace / immigration',
      synonyms:    ['obstacle', 'challenge'],
      contrast:    [{ word: 'boost', rel: 'enabler' }, { word: 'step up', rel: 'onward' }] },

    { id: 'to_cripple',      label: 'To Cripple',        category: 'obstacles', color: C.obstacles, emoji: '🩼',
      description: 'To cause severe damage so something can no longer function.',
      examples:    ['The sanctions threatened to cripple the economy.', 'A cyberattack can cripple a small business overnight.'],
      context:     'news / business',
      synonyms:    ['paralyze', 'devastate'],
      contrast:    [{ word: 'restore', rel: 'rebuild' }, { word: 'strengthen', rel: 'fortify' }] },

    { id: 'rigidity',        label: 'Rigidity',          category: 'obstacles', color: C.obstacles, emoji: '🧱',
      description: 'Inflexibility; refusing to change rules or behavior even when necessary.',
      examples:    ['His rigidity on pricing cost us the deal.', 'Workplace rigidity can crush young talent.'],
      context:     'workplace / criticism',
      synonyms:    ['inflexibility', 'stubbornness'],
      contrast:    [{ word: 'flexibility', rel: 'adaptable' }, { word: 'openness', rel: 'willing to bend' }] },

    { id: 'redundancy',      label: 'Redundancy',        category: 'obstacles', color: C.obstacles, emoji: '📦',
      description: 'The state of being no longer needed, or having extra backup copies.',
      examples:    ['The old console was scrapped as redundant once the new model launched.', 'Two backups gave us full redundancy against a disk failure.'],
      context:     'tech / corporate',
      synonyms:    ['duplication', 'obsolescence'],
      contrast:    [{ word: 'necessity', rel: 'essential' }, { word: 'uniqueness', rel: 'one-of-a-kind' }] },

    { id: 'vulnerable',      label: 'Vulnerable',        category: 'obstacles', color: C.obstacles, emoji: '🛡️',
      description: 'Exposed to the possibility of being attacked or harmed.',
      examples:    ['Unvaccinated elderly are the most vulnerable to the flu.', 'Small businesses feel increasingly vulnerable to cyberattacks.'],
      context:     'health / news',
      synonyms:    ['exposed', 'at risk'],
      contrast:    [{ word: 'protected', rel: 'sheltered' }, { word: 'secure', rel: 'well defended' }] },

    { id: 'fragility',       label: 'Fragility',         category: 'obstacles', color: C.obstacles, emoji: '🥚',
      description: 'The quality of being easily broken or damaged.',
      examples:    ['The fragility of the supply chain became obvious during the crisis.', 'Glass sculpture reminds us of fragility and craft.'],
      context:     'news / art critique',
      synonyms:    ['delicacy', 'brittleness'],
      contrast:    [{ word: 'toughness', rel: 'durable' }, { word: 'resilience', rel: 'bounces back' }] },

    { id: 'catastrophic',    label: 'Catastrophic',      category: 'obstacles', color: C.obstacles, emoji: '💥',
      description: 'Involving sudden, immense disaster and suffering.',
      examples:    ['The flood was catastrophic for the entire region.', 'A catastrophic failure at the factory halted production for weeks.'],
      context:     'news / disaster',
      synonyms:    ['devastating', 'calamitous'],
      contrast:    [{ word: 'minor', rel: 'no big deal' }, { word: 'benign', rel: 'harmless' }] },

    { id: 'doomsday',        label: 'Doomsday',          category: 'obstacles', color: C.obstacles, emoji: '☄️',
      description: 'The day of final judgment, or a hypothetical end-of-the-world scenario.',
      examples:    ['Villagers prepared for doomsday as the storm approached.', 'In fiction it is the doomsday clock that ticks toward midnight.'],
      context:     'dramatic / news',
      synonyms:    ['end times', 'apocalypse'],
      contrast:    [{ word: 'rebirth', rel: 'fresh start' }, { word: 'salvation', rel: 'rescue' }] },

    { id: 'red_flag',        label: 'Red Flag',          category: 'obstacles', color: C.obstacles, emoji: '🚩',
      description: 'A warning sign indicating danger or a fundamental problem.',
      examples:    ['Repeatedly missing deadlines was a red flag early on.', 'Several red flags in the contract made us pause.'],
      context:     'workplace / vetting',
      synonyms:    ['warning', 'warning sign'],
      contrast:    [{ word: 'green light', rel: 'all clear' }, { word: 'go-ahead', rel: 'encouragement' }] },

    { id: 'consequences',    label: 'Consequences',      category: 'obstacles', color: C.obstacles, emoji: '⚠️',
      description: 'The severe results or fallout of an action.',
      examples:    ['He did not think through the consequences before quitting.', 'Every line in the contract has consequences for years.'],
      context:     'everyday / legal',
      synonyms:    ['repercussions', 'outcomes'],
      contrast:    [{ word: 'rewards', rel: 'positive result' }, { word: 'opportunities', rel: 'good outcome' }] },

    { id: 'to_backfire',     label: 'To Backfire',       category: 'obstacles', color: C.obstacles, emoji: '💨',
      description: 'When a plan has the exact opposite effect of what was intended.',
      examples:    ['The campaign backfired and alienated customers.', 'The aggressive new policy backfired on day one.'],
      context:     'workplace / news',
      synonyms:    ['go wrong', 'turn against'],
      contrast:    [{ word: 'pay off', rel: 'works out' }, { word: 'succeed', rel: 'lands well' }] },

    { id: 'excessive',       label: 'Excessive',         category: 'obstacles', color: C.obstacles, emoji: '📈',
      description: 'Going beyond normal, acceptable limits; too much of something.',
      examples:    ['Excessive screen time was affecting her sleep.', 'Excessive overtime led to widespread burnout.'],
      context:     'health / reporting',
      synonyms:    ['over the top', 'exorbitant'],
      contrast:    [{ word: 'moderate', rel: 'just right' }, { word: 'sparing', rel: 'minimal' }] },

    // ── Theme 3: Clarity, Analysis & Information ──
    { id: 'to_distinguish',  label: 'To Distinguish',   category: 'clarity', color: C.clarity, emoji: '🔍',
      description: 'To recognize what makes something different; to tell the difference.',
      examples:    ['Hard to distinguish the original painting from the replica.', 'A good editor distinguishes news from opinion.'],
      context:     'everyday / newsroom',
      synonyms:    ['tell apart', 'discern'],
      contrast:    [{ word: 'confuse', rel: 'mix up' }, { word: 'blur', rel: 'lose the lines' }] },

    { id: 'to_posit',        label: 'To Posit',          category: 'clarity', color: C.clarity, emoji: '📌',
      description: 'To assume something as a fact or starting point for an argument.',
      examples:    ['The professor posited a new theory in her lecture.', 'Let us posit a simple example to illustrate the rule.'],
      context:     'academic / textbooks',
      synonyms:    ['propose', 'suggest'],
      contrast:    [{ word: 'refute', rel: 'disprove' }, { word: 'deny', rel: 'reject the premise' }] },

    { id: 'to_assess',       label: 'To Assess',         category: 'clarity', color: C.clarity, emoji: '📊',
      description: 'To evaluate, estimate, or judge the nature and quality of something.',
      examples:    ['Take a moment to assess your options before choosing.', 'Recruiters assess each candidate against the same rubric.'],
      context:     'workplace / school',
      synonyms:    ['evaluate', 'gauge'],
      contrast:    [{ word: 'ignore', rel: 'overlook' }, { word: 'assume', rel: 'skip the eval' }] },

    { id: 'precise',         label: 'Precise',           category: 'clarity', color: C.clarity, emoji: '🎯',
      description: 'Exact, accurate, and specific in detail.',
      examples:    ['I need the precise measurements please.', 'Her precise timing saved the project.'],
      context:     'technical / everyday',
      synonyms:    ['exact', 'accurate'],
      contrast:    [{ word: 'vague', rel: 'unspecific' }, { word: 'approximate', rel: 'rough' }] },

    { id: 'ambiguous',       label: 'Ambiguous',         category: 'clarity', color: C.clarity, emoji: '🌫️',
      description: 'Unclear, vague, or open to multiple interpretations.',
      examples:    ['The manager gave an ambiguous reply about layoffs.', 'The contract clause is ambiguous on overtime.'],
      context:     'workplace / legal',
      synonyms:    ['vague', 'unclear'],
      contrast:    [{ word: 'unambiguous', rel: 'clear' }, { word: 'explicit', rel: 'stated plainly' }] },

    { id: 'explicit',        label: 'Explicit',          category: 'clarity', color: C.clarity, emoji: '📢',
      description: 'Stated clearly and in detail, leaving no room for confusion.',
      examples:    ['She was explicit about her expectations upfront.', 'The instructions were explicit about the deadline.'],
      context:     'workplace / instructions',
      synonyms:    ['clear', 'stated plainly'],
      contrast:    [{ word: 'vague', rel: 'unspecific' }, { word: 'tacit', rel: 'unspoken' }] },

    { id: 'hypothetical',    label: 'Hypothetical',      category: 'clarity', color: C.clarity, emoji: '💭',
      description: 'Imagined or theoretical; a "what if" scenario that is not real yet.',
      examples:    ['Let us explore a hypothetical scenario.', 'The question was purely hypothetical -- no client was named.'],
      context:     'academic / interview',
      synonyms:    ['theoretical', 'imagined'],
      contrast:    [{ word: 'actual', rel: 'real' }, { word: 'confirmed', rel: 'verified' }] },

    { id: 'to_emphasize',    label: 'To Emphasize',      category: 'clarity', color: C.clarity, emoji: '❗',
      description: 'To give special importance or prominence to a point or fact.',
      examples:    ['She emphasized the urgency of the deadline.', 'The report emphasized the financial risks.'],
      context:     'workplace / reporting',
      synonyms:    ['stress', 'highlight'],
      contrast:    [{ word: 'downplay', rel: 'minimize' }, { word: 'gloss over', rel: 'skim past' }] },

    { id: 'bears_repeating', label: 'Bears Repeating',   category: 'clarity', color: C.clarity, emoji: '🔁',
      description: 'A phrase meaning a point is so important that it should be said again.',
      examples:    ['This rule bears repeating at every onboarding session.', 'A safety rule that bears repeating saves lives.'],
      context:     'workplace / training',
      synonyms:    ['worth repeating', 'important'],
      contrast:    [{ word: 'trite', rel: 'banal' }, { word: 'obvious', rel: 'already known' }] },

    { id: 'synthesis',       label: 'Synthesis',         category: 'clarity', color: C.clarity, emoji: '🧬',
      description: 'The combination of different ideas, data, or components to form a coherent whole.',
      examples:    ['The report is a synthesis of findings from three studies.', 'His success came from a synthesis of art and engineering.'],
      context:     'academic / business',
      synonyms:    ['combination', 'fusion'],
      contrast:    [{ word: 'analysis', rel: 'breakdown' }, { word: 'fragmentation', rel: 'in pieces' }] },

    { id: 'to_unearth',      label: 'To Unearth',        category: 'clarity', color: C.clarity, emoji: '⛏️',
      description: 'To discover hidden, buried, or secret information through investigation.',
      examples:    ['The journalist unearthed new evidence in the archive.', 'A volunteer team unearthed a Roman mosaic in the field.'],
      context:     'journalism / archaeology',
      synonyms:    ['discover', 'reveal'],
      contrast:    [{ word: 'bury', rel: 'hide' }, { word: 'suppress', rel: 'keep quiet' }] },

    { id: 'insinuation',     label: 'Insinuation',       category: 'clarity', color: C.clarity, emoji: '👀',
      description: 'An indirect, subtle suggestion or hint, usually of something negative.',
      examples:    ['Her insinuation that I was late again stung.', 'The article was full of insinuation rather than proof.'],
      context:     'interpersonal / journalism',
      synonyms:    ['implication', 'hint'],
      contrast:    [{ word: 'declaration', rel: 'straight claim' }, { word: 'statement', rel: 'overt' }] },

    { id: 'to_parrot',       label: 'To Parrot',         category: 'clarity', color: C.clarity, emoji: '🦜',
      description: 'To mindlessly repeat what someone else has said without understanding it.',
      examples:    ['Stop parroting my words without thinking them through.', 'New hires often parrot senior opinions in their first week.'],
      context:     'interpersonal / classroom',
      synonyms:    ['echo', 'mimic'],
      contrast:    [{ word: 'originate', rel: 'come up with' }, { word: 'create', rel: 'novel' }] },

    { id: 'to_dilute',       label: 'To Dilute',         category: 'clarity', color: C.clarity, emoji: '💧',
      description: 'To make something weaker in force, content, or value.',
      examples:    ['Adding water dilutes the concentrate too much.', 'Politicians worry that adding caveats dilutes a strong message.'],
      context:     'everyday / politics',
      synonyms:    ['weaken', 'thin'],
      contrast:    [{ word: 'concentrate', rel: 'strengthen' }, { word: 'intensify', rel: 'richen' }] },

    { id: 'manifestation',   label: 'Manifestation',     category: 'clarity', color: C.clarity, emoji: '✨',
      description: 'A visible, physical sign or proof of an underlying feeling or abstract idea.',
      examples:    ['Her frown was a manifestation of deep frustration.', 'The mural is a vivid manifestation of neighborhood pride.'],
      context:     'everyday / art critique',
      synonyms:    ['sign', 'indication'],
      contrast:    [{ word: 'cause', rel: 'root' }, { word: 'origin', rel: 'source' }] },

    // ── Theme 4: Depth, Scale & Scope ──
    { id: 'shallow',         label: 'Shallow',           category: 'depth', color: C.depth, emoji: '🥄',
      description: 'Lacking depth; superficial and ignoring the root causes.',
      examples:    ['The dialogue was shallow and unsatisfying.', 'The report took a shallow look at the problem.'],
      context:     'criticism / arts',
      synonyms:    ['superficial', 'skin-deep'],
      contrast:    [{ word: 'deep', rel: 'profound' }, { word: 'profound', rel: 'weighty' }] },

    { id: 'profound',        label: 'Profound',          category: 'depth', color: C.depth, emoji: '🌊',
      description: 'Very deep, intense, or far-reaching; having a massive structural impact.',
      examples:    ['Her speech had a profound effect on voters.', 'It was a profound loss for the community.'],
      context:     'emotional / news',
      synonyms:    ['deep', 'weighty'],
      contrast:    [{ word: 'trivial', rel: 'unimportant' }, { word: 'superficial', rel: 'shallow' }] },

    { id: 'holistic',        label: 'Holistic',          category: 'depth', color: C.depth, emoji: '🌐',
      description: 'Looking at the "big picture"; treating a system as a whole rather than just its parts.',
      examples:    ['Holistic care treats body and mind together.', 'The team took a holistic look at the workflow.'],
      context:     'health / business strategy',
      synonyms:    ['comprehensive', 'whole-picture'],
      contrast:    [{ word: 'narrow', rel: 'only one part' }, { word: 'piecemeal', rel: 'in slices' }] },

    { id: 'integration',     label: 'Integration',       category: 'depth', color: C.depth, emoji: '🔗',
      description: 'The process of combining parts, groups, or systems into a unified whole.',
      examples:    ['The integration of the two teams took three months.', 'API integration was the trickiest part of the migration.'],
      context:     'business / technology',
      synonyms:    ['merger', 'unification'],
      contrast:    [{ word: 'separation', rel: 'pull apart' }, { word: 'division', rel: 'split' }] },

    { id: 'diverse',         label: 'Diverse',           category: 'depth', color: C.depth, emoji: '🌈',
      description: 'Showing a great deal of variety; consisting of many different elements.',
      examples:    ['The neighborhood is racially and culturally diverse.', 'We need a more diverse set of opinions in the room.'],
      context:     'social / workplace',
      synonyms:    ['varied', 'wide-ranging'],
      contrast:    [{ word: 'homogeneous', rel: 'all the same' }, { word: 'uniform', rel: 'no variety' }] },

    { id: 'realm',           label: 'Realm',             category: 'depth', color: C.depth, emoji: '👑',
      description: 'A kingdom, or a specific field/sphere of activity or knowledge.',
      examples:    ['This is firmly in the realm of fantasy.', 'She is an expert in the realm of mergers and acquisitions.'],
      context:     'literary / business',
      synonyms:    ['domain', 'sphere'],
      contrast:    [{ word: 'no man\'s land', rel: 'unexplored' }, { word: 'wilds', rel: 'uncharted' }] },

    { id: 'to_encircle',     label: 'To Encircle',       category: 'depth', color: C.depth, emoji: '⭕',
      description: 'To form a circle around; to surround completely.',
      examples:    ['Searchlights encircled the helicopter for hours.', 'Tents encircled the central campfire.'],
      context:     'war reporting / narrative',
      synonyms:    ['surround', 'ring'],
      contrast:    [{ word: 'release', rel: 'free' }, { word: 'scatter', rel: 'spread out' }] },

    { id: 'oriented',        label: 'Oriented',          category: 'depth', color: C.depth, emoji: '🧭',
      description: 'Aimed or directed toward a particular goal, audience, or focus.',
      examples:    ['The campaign is community-oriented.', 'We need results-oriented metrics for next quarter.'],
      context:     'business / strategy',
      synonyms:    ['focused', 'aimed'],
      contrast:    [{ word: 'scattergun', rel: 'no focus' }, { word: 'aimless', rel: 'directionless' }] },

    // ── Theme 5: Trends, Paths & Time ──
    { id: 'zags_away',       label: 'Zags Away',         category: 'trends', color: C.trends, emoji: '⚡',
      description: 'A sudden, sharp, and unpredictable change in direction.',
      examples:    ['The market zags away from its usual pattern this quarter.', 'Climate policy zags away from last year\'s commitments.'],
      context:     'markets / politics',
      synonyms:    ['veers', 'deviates'],
      contrast:    [{ word: 'follows trend', rel: 'in line' }, { word: 'tracks', rel: 'matches' }] },

    { id: 'inevitable',      label: 'Inevitable',        category: 'trends', color: C.trends, emoji: '⌛',
      description: 'Certain to happen; completely unavoidable.',
      examples:    ['Some conflict was inevitable once the treaty lapsed.', 'Migration to the cloud feels almost inevitable now.'],
      context:     'news / business',
      synonyms:    ['unavoidable', 'certain'],
      contrast:    [{ word: 'avoidable', rel: 'preemptable' }, { word: 'optional', rel: 'not required' }] },

    { id: 'tend_to',         label: 'Tend To',           category: 'trends', color: C.trends, emoji: '📈',
      description: 'To regularly behave in a certain way or have a strong likelihood of happening.',
      examples:    ['Cats tend to ignore strangers at first.', 'Renewable projects tend to overrun the first budget.'],
      context:     'study / reporting',
      synonyms:    ['usually do', 'are inclined to'],
      contrast:    [{ word: 'rarely do', rel: 'uncommon' }, { word: 'never', rel: 'opposite' }] },

    { id: 'eventually',      label: 'Eventually',        category: 'trends', color: C.trends, emoji: '🕐',
      description: 'In the end, especially after a long delay, dispute, or series of problems.',
      examples:    ['Eventually she forgave him and moved on.', 'The team eventually shipped after several rewrites.'],
      context:     'narrative / workplace',
      synonyms:    ['in time', 'finally'],
      contrast:    [{ word: 'immediately', rel: 'right now' }, { word: 'never', rel: 'not ever' }] },

    { id: 'fate',            label: 'Fate',              category: 'trends', color: C.trends, emoji: '🔮',
      description: 'The development of events beyond a person\'s control; destiny.',
      examples:    ['It was fate that we ended up on the same flight.', 'He believed fate brought them together.'],
      context:     'literary / romantic',
      synonyms:    ['destiny', 'lot'],
      contrast:    [{ word: 'free will', rel: 'choice' }, { word: 'agency', rel: 'in control' }] },

    { id: 'to_leap',         label: 'To Leap',           category: 'trends', color: C.trends, emoji: '🦘',
      description: 'To jump or move suddenly and significantly.',
      examples:    ['Sales leapt after the feature shipped.', 'She leapt at the chance to relocate.'],
      context:     'business / news',
      synonyms:    ['jump', 'vault'],
      contrast:    [{ word: 'plummet', rel: 'drop sharply' }, { word: 'limp', rel: 'creep' }] },

    { id: 'anticipating',    label: 'Anticipating',      category: 'trends', color: C.trends, emoji: '👁️',
      description: 'Expecting or predicting something to happen; looking forward in advance.',
      examples:    ['We are anticipating a surge in demand next month.', 'Anticipating the storm, the school closed early.'],
      context:     'planning / news',
      synonyms:    ['expecting', 'foreseeing'],
      contrast:    [{ word: 'reacting late', rel: 'too slow' }, { word: 'caught off guard', rel: 'surprised' }] },

    // ── Theme 6: Rules, Duties & Importance ──
    { id: 'to_abide',        label: 'To Abide',          category: 'rules', color: C.rules, emoji: '📜',
      description: 'To accept and act in accordance with a rule, decision, or law.',
      examples:    ['Every member must abide by the new code of conduct.', 'She abided by the court order without protest.'],
      context:     'rules / legal',
      synonyms:    ['comply', 'obey'],
      contrast:    [{ word: 'violate', rel: 'break' }, { word: 'defy', rel: 'resist openly' }] },

    { id: 'to_adhere',       label: 'To Adhere',         category: 'rules', color: C.rules, emoji: '🧲',
      description: 'To stick fast to, or to follow a practice/belief strictly.',
      examples:    ['We adhere strictly to the published style guide.', 'She adheres to a strict weekday routine.'],
      context:     'rules / discipline',
      synonyms:    ['stick to', 'follow'],
      contrast:    [{ word: 'deviate', rel: 'veer off' }, { word: 'abandon', rel: 'drop entirely' }] },

    { id: 'obligation',      label: 'Obligation',        category: 'rules', color: C.rules, emoji: '📋',
      description: 'A moral or legal duty to do something.',
      examples:    ['He felt an obligation to care for his younger sister.', 'The contract created a financial obligation on both sides.'],
      context:     'workplace / legal',
      synonyms:    ['duty', 'responsibility'],
      contrast:    [{ word: 'option', rel: 'no pressure' }, { word: 'freedom from', rel: 'released' }] },

    { id: 'crucial',         label: 'Crucial',           category: 'rules', color: C.rules, emoji: '🔥',
      description: 'Extremely important, essential, or absolutely necessary for success.',
      examples:    ['It is crucial that both sides agree on the scope.', 'Choosing the right mentor is crucial at this stage.'],
      context:     'workplace / advice',
      synonyms:    ['essential', 'vital'],
      contrast:    [{ word: 'trivial', rel: 'minor' }, { word: 'optional', rel: 'nice to have' }] },

    { id: 'flawless',        label: 'Flawless',          category: 'rules', color: C.rules, emoji: '💎',
      description: 'Perfect in execution; without any defects or mistakes.',
      examples:    ['Her demonstration was flawless from start to finish.', 'A flawless recovery brought the share price back.'],
      context:     'criticism / sport',
      synonyms:    ['perfect', 'spotless'],
      contrast:    [{ word: 'flawed', rel: 'imperfect' }, { word: 'shoddy', rel: 'poorly done' }] },

    { id: 'to_stick',        label: 'To Stick',          category: 'rules', color: C.rules, emoji: '📌',
      description: 'To remain fixed in a position or to persist in doing something.',
      examples:    ['She stuck to her principles through the whole campaign.', 'Stick to the plan and the rest will follow.'],
      context:     'workplace / advice',
      synonyms:    ['persist', 'hold to'],
      contrast:    [{ word: 'waver', rel: 'budge' }, { word: 'abandon', rel: 'give up' }] },

    { id: 'sine_qua_non',    label: 'Sine Qua Non',      category: 'rules', color: C.rules, emoji: '🔑',
      description: '(Latin) An indispensable condition; something absolutely required.',
      examples:    ['Trust is the sine qua non of any long partnership.', 'Willingness to travel is the sine qua non for the role.'],
      context:     'formal / academic',
      synonyms:    ['prerequisite', 'must-have'],
      contrast:    [{ word: 'optional flourish', rel: 'nice extra' }, { word: 'dispensable', rel: 'removable' }] },

    // ── Theme 7: Human Emotions, Traits & Attitudes ──
    { id: 'to_console',      label: 'To Console',        category: 'emotions', color: C.emotions, emoji: '🤗',
      description: 'To comfort someone in a time of grief or disappointment.',
      examples:    ['Her mother tried to console her after the loss.', 'A simple hug consoles more than a long lecture.'],
      context:     'interpersonal / grief',
      synonyms:    ['comfort', 'soothe'],
      contrast:    [{ word: 'abandon', rel: 'leave alone' }, { word: 'mock', rel: 'add pain' }] },

    { id: 'optimistic',      label: 'Optimistic',        category: 'emotions', color: C.emotions, emoji: '😊',
      description: 'Hopeful and confident about the future.',
      examples:    ['She is optimistic about the new role.', 'Investors remain optimistic despite the rough quarter.'],
      context:     'workplace / news',
      synonyms:    ['hopeful', 'upbeat'],
      contrast:    [{ word: 'pessimistic', rel: 'downbeat' }, { word: 'cynical', rel: 'distrustful' }] },

    { id: 'sincere',         label: 'Sincere',           category: 'emotions', color: C.emotions, emoji: '💙',
      description: 'Free from pretense or deceit; proceeding from genuine feelings.',
      examples:    ['Her apology felt sincere and unrehearsed.', 'His interest in the cause is sincere, not performative.'],
      context:     'interpersonal / reviews',
      synonyms:    ['genuine', 'authentic'],
      contrast:    [{ word: 'insincere', rel: 'phony' }, { word: 'fake', rel: 'put on' }] },

    { id: 'involuntary',     label: 'Involuntary',       category: 'emotions', color: C.emotions, emoji: '😳',
      description: 'Done without will or conscious control.',
      examples:    ['She gave an involuntary gasp at the news.', 'Involuntary trembling is common in prolonged stress.'],
      context:     'medical / social',
      synonyms:    ['unconscious', 'reflexive'],
      contrast:    [{ word: 'voluntary', rel: 'on purpose' }, { word: 'deliberate', rel: 'intended' }] },

    { id: 'trait',           label: 'Trait',             category: 'emotions', color: C.emotions, emoji: '🧬',
      description: 'A distinguishing quality or characteristic of a person or group.',
      examples:    ['Kindness is a trait admired in teachers.', 'Curiosity is a trait common among great engineers.'],
      context:     'workplace / self-improvement',
      synonyms:    ['quality', 'attribute'],
      contrast:    [{ word: 'flaw', rel: 'negative quality' }, { word: 'weakness', rel: 'blind spot' }] },

    { id: 'temperament',     label: 'Temperament',       category: 'emotions', color: C.emotions, emoji: '🌡️',
      description: 'A person\'s nature or general disposition.',
      examples:    ['She has a calm temperament under pressure.', 'A nervous temperament is not always a flaw in surgeons.'],
      context:     'workplace / parenting',
      synonyms:    ['nature', 'disposition'],
      contrast:    [{ word: 'mood', rel: 'today\'s only' }, { word: 'facade', rel: 'presented front' }] },

    { id: 'compassion',      label: 'Compassion',        category: 'emotions', color: C.emotions, emoji: '❤️',
      description: 'Deep sympathy and a desire to help those who are suffering.',
      examples:    ['The nurse spoke with real compassion to the family.', 'Compassion drives a lot of frontline volunteer work.'],
      context:     'healthcare / community',
      synonyms:    ['empathy', 'care'],
      contrast:    [{ word: 'indifference', rel: 'cold shoulder' }, { word: 'cruelty', rel: 'harmful' }] },

    { id: 'to_cuddle',       label: 'To Cuddle',         category: 'emotions', color: C.emotions, emoji: '🫂',
      description: 'To hold close for warmth or comfort; to embrace affectionately.',
      examples:    ['She cuddled the baby until it fell asleep.', 'The cat cuddled against her on the couch.'],
      context:     'everyday / parenting',
      synonyms:    ['snuggle', 'hug'],
      contrast:    [{ word: 'shove away', rel: 'push off' }, { word: 'reject', rel: 'turn away' }] },

    { id: 'batty',           label: 'Batty',             category: 'emotions', color: C.emotions, emoji: '🦇',
      description: 'Crazy, irrational, or completely foolish.',
      examples:    ['His batty idea to climb in a thunderstorm nearly got him killed.', 'My aunt goes batty every full moon.'],
      context:     'colloquial / humorous',
      synonyms:    ['crazy', 'nuts'],
      contrast:    [{ word: 'sane', rel: 'reasonable' }, { word: 'sensible', rel: 'practical' }] },

    { id: 'bizarre',         label: 'Bizarre',           category: 'emotions', color: C.emotions, emoji: '👽',
      description: 'Very strange, unusual, or completely unexpected.',
      examples:    ['The whole scene was bizarre and hard to forget.', 'A bizarre noise came from the basement at midnight.'],
      context:     'review / news',
      synonyms:    ['strange', 'weird'],
      contrast:    [{ word: 'ordinary', rel: 'normal' }, { word: 'predictable', rel: 'expected' }] },

    { id: 'to_fantasize',    label: 'To Fantasize',      category: 'emotions', color: C.emotions, emoji: '💭',
      description: 'To indulge in daydreams or imagine things that are highly unlikely.',
      examples:    ['He fantasized about quitting and traveling the world.', 'Authors often fantasize before they write.'],
      context:     'everyday / literature',
      synonyms:    ['daydream', 'imagine'],
      contrast:    [{ word: 'plan', rel: 'realistic aim' }, { word: 'act', rel: 'do the thing' }] },

    { id: 'to_fascinate',    label: 'To Fascinate',      category: 'emotions', color: C.emotions, emoji: '🌟',
      description: 'To attract strong interest and attention; to captivate.',
      examples:    ['The magician fascinated the children for hours.', 'Old maps continue to fascinate me as an adult.'],
      context:     'showbiz / storytelling',
      synonyms:    ['captivate', 'entrance'],
      contrast:    [{ word: 'bore', rel: 'lose interest' }, { word: 'repel', rel: 'push away' }] },

    { id: 'low_key',         label: 'Low Key',           category: 'emotions', color: C.emotions, emoji: '🤫',
      description: 'Quiet, restrained, or modest; deliberately not attracting attention.',
      examples:    ['We had a low-key celebration on the rooftop.', 'He stays low key and avoids press conferences.'],
      context:     'everyday / social',
      synonyms:    ['understated', 'quiet'],
      contrast:    [{ word: 'flamboyant', rel: 'showy' }, { word: 'flashy', rel: 'loud' }] },

    { id: 'screw_them',      label: 'Screw Them',        category: 'emotions', color: C.emotions, emoji: '💢',
      description: '(Informal/Slang) A dismissive attitude showing anger or refusal to cooperate.',
      examples:    ['He said screw them and walked out of the meeting.', 'A quiet "screw them" often surfaces after long unfairness.'],
      context:     'colloquial / slang',
      synonyms:    ['to hell with them', 'I quit'],
      contrast:    [{ word: 'cooperate', rel: 'work with' }, { word: 'appease', rel: 'placate' }] },

    { id: 'obstinate',       label: 'Obstinate',         category: 'emotions', color: C.emotions, emoji: '🫏',
      description: 'Stubbornly refusing to change one\'s mind or course of action.',
      examples:    ['He was obstinate about keeping the old design.', 'Children can be obstinate when they are tired.'],
      context:     'workplace / parenting',
      synonyms:    ['stubborn', 'mulish'],
      contrast:    [{ word: 'flexible', rel: 'willing to bend' }, { word: 'yielding', rel: 'open to change' }] },

    { id: 'fierce',          label: 'Fierce',            category: 'emotions', color: C.emotions, emoji: '🐯',
      description: 'Intense, aggressive, or highly competitive.',
      examples:    ['She was fierce about protecting her team.', 'A fierce bidding war pushed the price through the roof.'],
      context:     'workplace / competitive',
      synonyms:    ['intense', 'cutthroat'],
      contrast:    [{ word: 'mild', rel: 'low-key' }, { word: 'gentle', rel: 'soft' }] },

    { id: 'inclusive',       label: 'Inclusive',         category: 'emotions', color: C.emotions, emoji: '🤝',
      description: 'Including all people, groups, or elements; not leaving anyone out.',
      examples:    ['The new policy is more inclusive of part-time staff.', 'Inclusive teams tend to produce better outcomes.'],
      context:     'workplace / community',
      synonyms:    ['open to all', 'broad'],
      contrast:    [{ word: 'exclusive', rel: 'shuts out' }, { word: 'elitist', rel: 'ivory tower' }] },

    // ── Theme 8: Actions, Habits, Groups & Growth ──
    { id: 'to_tolerate',     label: 'To Tolerate',       category: 'actions', color: C.actions, emoji: '🧘',
      description: 'To allow the existence of something without interference; to endure.',
      examples:    ['I can tolerate a little noise but not all night.', 'Plants tolerate drought better than weeds do.'],
      context:     'everyday / gardening',
      synonyms:    ['endure', 'put up with'],
      contrast:    [{ word: 'reject', rel: 'push out' }, { word: 'celebrate', rel: 'embrace fully' }] },

    { id: 'to_shun',         label: 'To Shun',           category: 'actions', color: C.actions, emoji: '🚫',
      description: 'To persistently avoid, ignore, or reject someone or something.',
      examples:    ['Many writers shun social media during a project.', 'He shuns anything labeled low fat.'],
      context:     'interpersonal / lifestyle',
      synonyms:    ['avoid', 'spurn'],
      contrast:    [{ word: 'embrace', rel: 'welcome' }, { word: 'seek out', rel: 'pursue' }] },

    { id: 'to_recycle',      label: 'To Recycle',        category: 'actions', color: C.actions, emoji: '♻️',
      description: 'To convert waste into reusable material; or to reuse an old idea.',
      examples:    ['Please recycle your plastic bottles at the bin.', 'The team recycled last quarter\'s design for the new release.'],
      context:     'everyday / product',
      synonyms:    ['reuse', 'repurpose'],
      contrast:    [{ word: 'discard', rel: 'throw out' }, { word: 'waste', rel: 'trash' }] },

    { id: 'to_incline',      label: 'To Incline',        category: 'actions', color: C.actions, emoji: '↗️',
      description: 'To feel willing or favorably disposed toward doing something.',
      examples:    ['I am inclined to agree with the second option.', 'She is inclined to try the new approach first.'],
      context:     'formal / decision-making',
      synonyms:    ['lean toward', 'be disposed to'],
      contrast:    [{ word: 'opposed', rel: 'against' }, { word: 'averse', rel: 'unwilling' }] },

    { id: 'to_ingrain',      label: 'To Ingrain',        category: 'actions', color: C.actions, emoji: '🌱',
      description: 'To firmly establish an attitude, habit, or belief so it cannot easily be changed.',
      examples:    ['Discipline is ingrained from early school years.', 'Habits ingrained in childhood stick around for life.'],
      context:     'parenting / workplace',
      synonyms:    ['instill', 'embed'],
      contrast:    [{ word: 'eradicate', rel: 'remove' }, { word: 'unlearn', rel: 'let go' }] },

    { id: 'to_embody',       label: 'To Embody',         category: 'actions', color: C.actions, emoji: '🪞',
      description: 'To be a perfect example or physical representation of an idea or quality.',
      examples:    ['She embodies the calm leadership we need.', 'His music embodies the spirit of the era.'],
      context:     'workplace / arts',
      synonyms:    ['represent', 'exemplify'],
      contrast:    [{ word: 'betray', rel: 'act against' }, { word: 'misrepresent', rel: 'show wrongly' }] },

    { id: 'to_accumulate',   label: 'To Accumulate',     category: 'actions', color: C.actions, emoji: '📚',
      description: 'To gather together or acquire an increasing number or quantity.',
      examples:    ['Dust accumulates in corners if you skip cleaning.', 'She accumulated years of expertise before getting promoted.'],
      context:     'everyday / career',
      synonyms:    ['gather', 'pile up'],
      contrast:    [{ word: 'dissipate', rel: 'scatter' }, { word: 'shed', rel: 'lose' }] },

    { id: 'to_commemorate',  label: 'To Commemorate',    category: 'actions', color: C.actions, emoji: '🏛️',
      description: 'To recall and show respect for someone or something in a ceremony or monument.',
      examples:    ['They commemorated the anniversary with a candle lighting.', 'A new statue commemorates the founding physician.'],
      context:     'community / civic',
      synonyms:    ['honor', 'mark'],
      contrast:    [{ word: 'forget', rel: 'erase memory' }, { word: 'overlook', rel: 'no notice' }] },

    { id: 'pursuit',         label: 'Pursuit',           category: 'actions', color: C.actions, emoji: '🎯',
      description: 'The action of following or pursuing someone or something; the quest for a goal.',
      examples:    ['The pursuit of profit can crowd out other goals.', 'His lifelong pursuit of justice inspired us.'],
      context:     'workplace / motivational',
      synonyms:    ['chase', 'quest'],
      contrast:    [{ word: 'abandonment', rel: 'giving up' }, { word: 'resignation', rel: 'done trying' }] },

    { id: 'cult',            label: 'Cult',              category: 'actions', color: C.actions, emoji: '🔮',
      description: 'A group with extreme, unorthodox beliefs, or (in business) an obsessive following.',
      examples:    ['The brand developed a cult following in its early years.', 'Some online fandoms cross into cult territory.'],
      context:     'media / branding',
      synonyms:    ['sect', 'following'],
      contrast:    [{ word: 'mainstream', rel: 'wide appeal' }, { word: 'loose group', rel: 'casual fans' }] },

    { id: 'cohort',          label: 'Cohort',            category: 'actions', color: C.actions, emoji: '👥',
      description: 'A group of people banded together, or a specific demographic group studied together.',
      examples:    ['The 2020 cohort outperformed last year on retention.', 'A small cohort finished the marathon together.'],
      context:     'study / analytics',
      synonyms:    ['group', 'class'],
      contrast:    [{ word: 'individual', rel: 'alone' }, { word: 'stranger pool', rel: 'no group' }] },

    { id: 'lucrative',       label: 'Lucrative',         category: 'actions', color: C.actions, emoji: '💰',
      description: 'Producing a great deal of profit; highly financially rewarding.',
      examples:    ['Consulting turned out to be far more lucrative than employment.', 'Short-term trading is rare to be sustainable yet lucrative.'],
      context:     'business / career',
      synonyms:    ['profitable', 'money-making'],
      contrast:    [{ word: 'unprofitable', rel: 'loss-making' }, { word: 'break-even', rel: 'no gain' }] },

    { id: 'resilience',      label: 'Resilience',        category: 'actions', color: C.actions, emoji: '💪',
      description: 'The capacity to recover quickly from difficulties; mental or economic toughness.',
      examples:    ['Resilience carried the team through the layoff.', 'Coastal cities are testing new climate resilience measures.'],
      context:     'workplace / news',
      synonyms:    ['toughness', 'grit'],
      contrast:    [{ word: 'fragility', rel: 'breaks easily' }, { word: 'collapse', rel: 'gives up' }] },

    { id: 'to_cultivate',    label: 'To Cultivate',      category: 'actions', color: C.actions, emoji: '🌿',
      description: 'To carefully nurture, develop, or build a relationship or skill over time.',
      examples:    ['Cultivate the habit of reading widely.', 'We cultivated a strong client relationship over years.'],
      context:     'coaching / business',
      synonyms:    ['nurture', 'grow'],
      contrast:    [{ word: 'neglect', rel: 'ignore' }, { word: 'abandon', rel: 'give up' }] },

    { id: 'to_hammer',       label: 'To Hammer',         category: 'actions', color: C.actions, emoji: '🔨',
      description: 'To aggressively attack, criticize, or drive something down.',
      examples:    ['The press hammered the CEO during the briefing.', 'Critics hammered the new policy as unrealistic.'],
      context:     'news / media',
      synonyms:    ['attack', 'hammer down'],
      contrast:    [{ word: 'praise', rel: 'compliment' }, { word: 'protect', rel: 'shield' }] },

    { id: 'incentive',       label: 'Incentive',         category: 'actions', color: C.actions, emoji: '🏆',
      description: 'Something that motivates or encourages someone to act; a reward or benefit.',
      examples:    ['Free coffee is a small incentive for staying late.', 'Tax incentives pulled startup founders to the region.'],
      context:     'workplace / public policy',
      synonyms:    ['motivation', 'inducement'],
      contrast:    [{ word: 'disincentive', rel: 'demotivation' }, { word: 'penalty', rel: 'punishment' }] },

    // ── Theme 9: Technical, Metaphorical & Transitions ──
    { id: 'knob',            label: 'Knob',              category: 'technical',  color: C.technical, emoji: '🎛️',
      description: 'A control dial. Metaphorically: A parameter that can be adjusted.',
      examples:    ['Turn the temperature knob to the left.', 'Engineers say every knob in the system needs a known default.'],
      context:     'everyday / technical',
      synonyms:    ['dial', 'setting'],
      contrast:    [{ word: 'toggle', rel: 'on/off only' }, { word: 'hard-coded', rel: 'fixed setting' }] },

    { id: 'argmax',          label: 'Argmax',            category: 'technical',  color: C.technical, emoji: '📐',
      description: '(Math/AI) The input value that produces the maximum output of a function.',
      examples:    ['The argmax of the loss function indicates the worst case.', 'Argmax ranks the most promising next move.'],
      context:     'math / AI',
      synonyms:    ['maximum', 'peak input'],
      contrast:    [{ word: 'argmin', rel: 'minimum input' }, { word: 'mean', rel: 'average' }] },

    { id: 'low_pass_filter', label: 'Low-Pass Filter',   category: 'technical',  color: C.technical, emoji: '🔽',
      description: '(Engineering) A filter that passes low frequencies but reduces high ones.',
      examples:    ['A low-pass filter smooths out the stock chart noise.', 'Audio engineers reach for a low-pass filter on hissing vocals.'],
      context:     'engineering / audio',
      synonyms:    ['smoothing filter', 'noise gate'],
      contrast:    [{ word: 'high-pass filter', rel: 'keeps highs' }, { word: 'all-pass', rel: 'no change' }] },

    { id: 'unlike',          label: 'Unlike',            category: 'technical',  color: C.technical, emoji: '🔄',
      description: 'A preposition used to compare two things that are different.',
      examples:    ['Unlike most rivals, we ship weekly.', 'Unlike her sister, she prefers team sports.'],
      context:     'academic / narrative',
      synonyms:    ['as opposed to', 'in contrast to'],
      contrast:    [{ word: 'like', rel: 'similar to' }, { word: 'similar to', rel: 'akin to' }] },

    { id: 'however',         label: 'However',           category: 'technical',  color: C.technical, emoji: '↩️',
      description: 'A transition word used to introduce a contrasting statement or fact.',
      examples:    ['We will launch on time. However, scope is reduced.', 'Sales were flat, however the support backlog is rising.'],
      context:     'academic / business writing',
      synonyms:    ['though', 'on the other hand'],
      contrast:    [{ word: 'therefore', rel: 'because' }, { word: 'thus', rel: 'consequence' }] },
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
