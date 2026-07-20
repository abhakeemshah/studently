/**
 * gk-graph-data.js — Knowledge graph data for the GK Knowledge Map.
 *
 * Connects general knowledge concepts into a rich 3D graph:
 * - Countries → capitals, currencies, rivers, mountains
 * - Organizations → headquarters, founding years
 * - Events → dates, locations
 * - Natural features → locations, measurements
 *
 * Loaded as a classic <script> tag before the graph initialization code.
 */

const gkGraphData = (function () {
  'use strict';

  // ── Color tokens (match Duolingo design system) ──
  var C = {
    country:     '#58cc02',  // green
    river:       '#1cb0f6',  // sky blue
    mountain:    '#ffc700',  // sunshine yellow
    ocean:       '#1cb0f6',  // sky blue
    city:        '#a570ff',  // grape soda
    organization:'#ff9600',  // orange
    event:       '#cc348d',  // bubblegum pink
    person:      '#ff7b00',  // deep orange
    date:        '#777777',  // graphite
    desert:      '#e5a500',  // gold
    strait:      '#00b8a0',  // teal
    lake:        '#00c4ff',  // light blue
    waterfall:   '#00d4ff',  // cyan
    trench:      '#0055ff',  // deep blue
    plateau:     '#c8a000',  // amber
    continent:   '#58a800',  // forest green
    news:        '#ff4488',  // pink
    canal:       '#00bcd4',  // cyan
    peninsula:   '#8bc34a',  // light green
    island:      '#4caf50',  // green
    parliament:  '#9c27b0',  // purple
    religion:    '#e91e63',  // pink
  };

  var nodes = [
    // ── Rivers ──
    { id: 'indus',       label: 'Indus River',       category: 'river',      color: C.river,     emoji: '🏞️', description: 'Originates in China near Lake Manasarovar. Flows through Pakistan.' },
    { id: 'nile',        label: 'Nile River',        category: 'river',      color: C.river,     emoji: '🏞️', description: 'The longest river in the world. Flows through northeast Africa.' },
    { id: 'amazon',      label: 'Amazon River',      category: 'river',      color: C.river,     emoji: '🏞️', description: 'Largest river by water volume in the world. Flows through Brazil.' },
    { id: 'volga',       label: 'Volga River',       category: 'river',      color: C.river,     emoji: '🏞️', description: 'The longest river in Europe. Flows through Russia.' },
    { id: 'congo',       label: 'Congo River',       category: 'river',      color: C.river,     emoji: '🏞️', description: 'The only major river that crosses the Equator twice.' },

    // ── Mountains ──
    { id: 'everest',     label: 'Mount Everest',     category: 'mountain',   color: C.mountain,  emoji: '🏔️', description: 'Highest peak in the world at 8,848 meters. Located in Nepal.' },
    { id: 'k2',          label: 'K2',                category: 'mountain',   color: C.mountain,  emoji: '🏔️', description: 'Second highest peak at 8,611 meters. Located in Pakistan-China border.' },
    { id: 'vinson',      label: 'Mount Vinson',      category: 'mountain',   color: C.mountain,  emoji: '🏔️', description: 'Highest peak in Antarctica at 4,892 meters.' },
    { id: 'andes',       label: 'Andes',             category: 'mountain',   color: C.mountain,  emoji: '⛰️', description: 'The longest mountain range in the world. Runs through South America.' },
    { id: 'himalayas',   label: 'Himalayas',         category: 'mountain',   color: C.mountain,  emoji: '⛰️', description: 'The highest mountain range in the world. Located in Asia.' },

    // ── Oceans / Seas ──
    { id: 'atlantic',    label: 'Atlantic Ocean',    category: 'ocean',      color: C.ocean,     emoji: '🌊', description: 'The saltiest ocean. Second largest ocean in the world.' },
    { id: 'pacific',     label: 'Pacific Ocean',     category: 'ocean',      color: C.ocean,     emoji: '🌊', description: 'The largest ocean in the world.' },
    { id: 'arctic',      label: 'Arctic Ocean',      category: 'ocean',      color: C.ocean,     emoji: '🌊', description: 'The smallest ocean in the world.' },
    { id: 'mediterranean',label: 'Mediterranean Sea', category: 'ocean',     color: C.ocean,     emoji: '🌊', description: 'Connected to the Atlantic Ocean via the Strait of Gibraltar.' },
    { id: 'red_sea',     label: 'Red Sea',           category: 'ocean',      color: C.ocean,     emoji: '🌊', description: 'Connected to the Mediterranean Sea via the Suez Canal.' },

    // ── Countries ──
    { id: 'pakistan',    label: 'Pakistan',          category: 'country',    color: C.country,   emoji: '🇵🇰', description: 'South Asian country. Joined UN on 30 Sep 1947. First digital census in 2023.' },
    { id: 'china',       label: 'China',             category: 'country',    color: C.country,   emoji: '🇨🇳', description: 'World\'s largest tea producer. National Day: October 1.' },
    { id: 'usa',         label: 'USA',               category: 'country',    color: C.country,   emoji: '🇺🇸', description: 'Independence: 4th July 1776. World\'s oldest written constitution.' },
    { id: 'canada',      label: 'Canada',            category: 'country',    color: C.country,   emoji: '🇨🇦', description: 'Land of the Maple Leaf. Longest coastline in the world. Capital: Ottawa.' },
    { id: 'brazil',      label: 'Brazil',            category: 'country',    color: C.country,   emoji: '🇧🇷', description: 'Largest country in South America. Largest coffee producer. Official language: Portuguese.' },
    { id: 'russia',      label: 'Russia',            category: 'country',    color: C.country,   emoji: '🇷🇺', description: 'Only country with day in one part and night in the other. Currency: Ruble.' },
    { id: 'japan',       label: 'Japan',             category: 'country',    color: C.country,   emoji: '🇯🇵', description: 'Land of the Rising Sun. Currency: Yen. Parliament: Diet.' },
    { id: 'uk',          label: 'UK',                category: 'country',    color: C.country,   emoji: '🇬🇧', description: 'Invented the tank. News agency: Reuters.' },
    { id: 'france',      label: 'France',            category: 'country',    color: C.country,   emoji: '🇫🇷', description: 'News agency: AFP. INTERPOL HQ in Lyon. UNESCO HQ in Paris.' },
    { id: 'australia',   label: 'Australia',         category: 'country',    color: C.country,   emoji: '🇦🇺', description: 'Also called Oceania. Land of the Golden Fleece. National animal: Kangaroo.' },
    { id: 'india',       label: 'India',             category: 'country',    color: C.country,   emoji: '🇮🇳', description: 'World\'s largest country by population.' },
    { id: 'italy',       label: 'Italy',             category: 'country',    color: C.country,   emoji: '🇮🇹', description: 'Appears as a "Long Shoe" on the world map.' },
    { id: 'egypt',       label: 'Egypt',             category: 'country',    color: C.country,   emoji: '🇪🇬', description: 'Capital: Cairo. News agency: MENA.' },
    { id: 'turkey',      label: 'Turkey',            category: 'country',    color: C.country,   emoji: '🇹🇷', description: 'Capital: Ankara. Currency: Lira.' },
    { id: 'germany',     label: 'Germany',           category: 'country',    color: C.country,   emoji: '🇩🇪', description: 'Capital: Berlin.' },
    { id: 'switzerland', label: 'Switzerland',       category: 'country',    color: C.country,   emoji: '🇨🇭', description: 'Playground of Europe. Capital: Bern.' },
    { id: 'norway',      label: 'Norway',            category: 'country',    color: C.country,   emoji: '🇳🇴', description: 'Land of the Midnight Sun.' },
    { id: 'thailand',    label: 'Thailand',          category: 'country',    color: C.country,   emoji: '🇹🇭', description: 'Land of White Elephants.' },
    { id: 'laos',        label: 'Laos',              category: 'country',    color: C.country,   emoji: '🇱🇦', description: 'Land of a Thousand Elephants.' },
    { id: 'bhutan',      label: 'Bhutan',            category: 'country',    color: C.country,   emoji: '🇧🇹', description: 'Land of Thunderbolts.' },
    { id: 'finland',     label: 'Finland',           category: 'country',    color: C.country,   emoji: '🇫🇮', description: 'Land of Thousand Lakes.' },
    { id: 'cuba',        label: 'Cuba',              category: 'country',    color: C.country,   emoji: '🇨🇺', description: 'Sugar Bowl of the World.' },
    { id: 'sri_lanka',   label: 'Sri Lanka',         category: 'country',    color: C.country,   emoji: '🇱🇰', description: 'Pearl of the Indian Ocean.' },
    { id: 'netherlands', label: 'Netherlands',       category: 'country',    color: C.country,   emoji: '🇳🇱', description: 'Land of Tulips.' },
    { id: 'nepal',       label: 'Nepal',              category: 'country',    color: C.country,   emoji: '🇳🇵', description: 'Home to Mount Everest.' },
    { id: 'indonesia',   label: 'Indonesia',         category: 'country',    color: C.country,   emoji: '🇮🇩', description: 'Largest number of volcanoes.' },
    { id: 'saudi',       label: 'Saudi Arabia',      category: 'country',    color: C.country,   emoji: '🇸🇦', description: 'Largest producer & consumer of electricity in Islamic world. Currency: Riyal.' },
    { id: 'iran',        label: 'Iran',              category: 'country',    color: C.country,   emoji: '🇮🇷', description: 'Currency: Rial.' },
    { id: 'afghanistan', label: 'Afghanistan',       category: 'country',    color: C.country,   emoji: '🇦🇫', description: 'Connected to China via Wakhan Corridor.' },
    { id: 'syria',       label: 'Syria',             category: 'country',    color: C.country,   emoji: '🇸🇾', description: 'US removed sanctions on July 1, 2025.' },
    { id: 'kazakhstan',  label: 'Kazakhstan',        category: 'country',    color: C.country,   emoji: '🇰🇿', description: 'World\'s largest landlocked country.' },
    { id: 'ukraine',     label: 'Ukraine',           category: 'country',    color: C.country,   emoji: '🇺🇦', description: 'Capital: Kyiv.' },
    { id: 'n_korea',     label: 'North Korea',       category: 'country',    color: C.country,   emoji: '🇰🇵', description: 'News agency: KCNA.' },

    // ── Capitals ──
    { id: 'ottawa',      label: 'Ottawa',            category: 'city',       color: C.city,      emoji: '🏛️', description: 'Capital of Canada.' },
    { id: 'cairo',       label: 'Cairo',             category: 'city',       color: C.city,      emoji: '🏛️', description: 'Capital of Egypt.' },
    { id: 'ankara',      label: 'Ankara',            category: 'city',       color: C.city,      emoji: '🏛️', description: 'Capital of Turkey.' },
    { id: 'berlin',      label: 'Berlin',            category: 'city',       color: C.city,      emoji: '🏛️', description: 'Capital of Germany.' },
    { id: 'bern',        label: 'Bern',              category: 'city',       color: C.city,      emoji: '🏛️', description: 'Capital of Switzerland.' },
    { id: 'kyiv',        label: 'Kyiv',              category: 'city',       color: C.city,      emoji: '🏛️', description: 'Capital of Ukraine.' },
    { id: 'wellington',  label: 'Wellington',        category: 'city',       color: C.city,      emoji: '🏛️', description: 'Capital of New Zealand.' },
    { id: 'rome',        label: 'Rome',              category: 'city',       color: C.city,      emoji: '🏛️', description: 'City of Seven Hills. Capital of Italy. FAO HQ.' },
    { id: 'london',      label: 'London',            category: 'city',       color: C.city,      emoji: '🏛️', description: 'Capital of UK. Tower Bridge. Amnesty International HQ.' },
    { id: 'paris',       label: 'Paris',             category: 'city',       color: C.city,      emoji: '🏛️', description: 'Capital of France. UNESCO HQ.' },
    { id: 'geneva',      label: 'Geneva',            category: 'city',       color: C.city,      emoji: '🏛️', description: 'WHO HQ. Red Cross HQ. WIPO HQ.' },
    { id: 'washington',  label: 'Washington D.C.',   category: 'city',       color: C.city,      emoji: '🏛️', description: 'Capital of USA. World Bank & IMF HQ.' },
    { id: 'brussels',    label: 'Brussels',          category: 'city',       color: C.city,      emoji: '🏛️', description: 'Capital of Belgium. NATO HQ.' },
    { id: 'lyon',        label: 'Lyon',              category: 'city',       color: C.city,      emoji: '🏛️', description: 'INTERPOL HQ in France.' },
    { id: 'kathmandu',   label: 'Kathmandu',         category: 'city',       color: C.city,      emoji: '🏛️', description: 'SAARC permanent secretariat.' },
    { id: 'manila',      label: 'Manila',            category: 'city',       color: C.city,      emoji: '🏛️', description: 'ADB HQ in Philippines.' },
    { id: 'lausanne',    label: 'Lausanne',          category: 'city',       color: C.city,      emoji: '🏛️', description: 'IOC HQ in Switzerland.' },
    { id: 'the_hague',   label: 'The Hague',         category: 'city',       color: C.city,      emoji: '🏛️', description: 'International Court of Justice location.' },

    // ── Organizations ──
    { id: 'nato',        label: 'NATO',              category: 'organization',color: C.organization, emoji: '🛡️', description: 'North Atlantic Treaty Organization. Formed in 1949. HQ: Brussels.' },
    { id: 'un',          label: 'United Nations',    category: 'organization',color: C.organization,emoji: '🇺🇳', description: '193 member states. Motto: "It\'s your world". Pakistan joined 30 Sep 1947.' },
    { id: 'oic',         label: 'OIC',               category: 'organization',color: C.organization,emoji: '🕌', description: 'Organisation of Islamic Cooperation. Renamed in 2011. 1st meeting: Rabat 1969.' },
    { id: 'who',         label: 'WHO',               category: 'organization',color: C.organization,emoji: '🏥', description: 'World Health Organization. HQ: Geneva. Declared COVID-19 a pandemic in Mar 2020.' },
    { id: 'world_bank',  label: 'World Bank',        category: 'organization',color: C.organization,emoji: '🏦', description: 'HQ: Washington D.C.' },
    { id: 'imf',         label: 'IMF',               category: 'organization',color: C.organization,emoji: '💰', description: 'International Monetary Fund. HQ: Washington D.C.' },
    { id: 'saarc',       label: 'SAARC',             category: 'organization',color: C.organization,emoji: '🤝', description: 'South Asian Association for Regional Cooperation. Secretariat: Kathmandu.' },
    { id: 'interpol',    label: 'INTERPOL',          category: 'organization',color: C.organization,emoji: '🔍', description: 'International police organization. HQ: Lyon, France.' },
    { id: 'unesco',      label: 'UNESCO',            category: 'organization',color: C.organization,emoji: '📚', description: 'UN Educational, Scientific and Cultural Organization. HQ: Paris.' },
    { id: 'unicef',      label: 'UNICEF',            category: 'organization',color: C.organization,emoji: '👶', description: 'UN Children\'s Fund. HQ: New York.' },
    { id: 'fao',         label: 'FAO',               category: 'organization',color: C.organization,emoji: '🌾', description: 'Food and Agriculture Organization. HQ: Rome.' },
    { id: 'ioc',         label: 'IOC',               category: 'organization',color: C.organization,emoji: '🏅', description: 'International Olympic Committee. HQ: Lausanne.' },
    { id: 'wipo',        label: 'WIPO',              category: 'organization',color: C.organization,emoji: '📝', description: 'World Intellectual Property Organization. HQ: Geneva.' },
    { id: 'red_cross',   label: 'Red Cross',         category: 'organization',color: C.organization,emoji: '⛑️', description: 'International humanitarian organization. HQ: Geneva.' },
    { id: 'adb',         label: 'ADB',               category: 'organization',color: C.organization,emoji: '🏗️', description: 'Asian Development Bank. HQ: Manila.' },
    { id: 'icj',         label: 'Intl. Court of Justice', category: 'organization',color: C.organization,emoji: '⚖️', description: 'Principal judicial organ of the UN. Located in The Hague.' },
    { id: 'amnesty',     label: 'Amnesty Intl.',     category: 'organization',color: C.organization,emoji: '🕊️', description: 'Human rights organization. HQ: London.' },

    // ── Events ──
    { id: 'us_independence', label: 'US Independence', category: 'event',    color: C.event,     emoji: '🎆', description: '4th July 1776. United States declared independence.' },
    { id: 'ww2',        label: 'WWII Began',         category: 'event',      color: C.event,     emoji: '⚔️', description: 'World War II began with Germany\'s invasion of Poland.' },
    { id: 'pearl_harbor',label: 'Pearl Harbor',      category: 'event',      color: C.event,     emoji: '💥', description: 'Japanese attack on Pearl Harbor. Forced US to join WWII.' },
    { id: 'covid_pandemic',label: 'COVID-19 Pandemic',category: 'event',    color: C.event,     emoji: '🦠', description: 'Declared a pandemic by WHO in March 2020.' },
    { id: 'doha_agreement',label: 'Doha Agreement',  category: 'event',      color: C.event,     emoji: '📜', description: 'Signed in February 2020.' },
    { id: 'gilgit_freedom',label: 'Gilgit Freedom',  category: 'event',      color: C.event,     emoji: '🎉', description: 'Gilgit Baltistan achieved independence on 1st Nov 1947.' },
    { id: 'digital_census',label: 'Digital Census',  category: 'event',      color: C.event,     emoji: '📊', description: 'First digital census in Pakistan was held in 2023.' },
    { id: 'nccia',       label: 'NCCIA Founded',     category: 'event',      color: C.event,     emoji: '🖥️', description: 'National Cyber Crime Investigation Agency built on May 3, 2024.' },

    // ── People ──
    { id: 'socrates',    label: 'Socrates',          category: 'person',     color: C.person,    emoji: '🧑‍🏫', description: 'Greek philosopher. Born in 469 BC.' },
    { id: 'rowling',     label: 'J.K. Rowling',      category: 'person',     color: C.person,    emoji: '✍️', description: 'Author of the Harry Potter book series.' },
    { id: 'maliha',      label: 'Maliha Lodhi',      category: 'person',     color: C.person,    emoji: '👩‍💼', description: 'First UN women ambassador of Pakistan.' },
    { id: 'asim_munir',  label: 'Asim Munir',        category: 'person',     color: C.person,    emoji: '⭐', description: 'Ranked as a five-star general on May 20, 2025.' },

    // ── Straits / Canals ──
    { id: 'gibraltar',   label: 'Strait of Gibraltar', category: 'strait',   color: C.strait,    emoji: '🌉', description: 'Connects the Atlantic Ocean to the Mediterranean Sea.' },
    { id: 'bering',      label: 'Bering Strait',     category: 'strait',     color: C.strait,    emoji: '🌉', description: 'Separates Asia from North America.' },
    { id: 'suez',        label: 'Suez Canal',        category: 'canal',      color: C.canal,     emoji: '🚢', description: 'Connects the Mediterranean Sea to the Red Sea.' },

    // ── Lakes ──
    { id: 'manasarovar', label: 'Lake Manasarovar',  category: 'lake',       color: C.lake,      emoji: '🏞️', description: 'Origin of the Indus River. Located in China near Tibet.' },
    { id: 'baikal',      label: 'Lake Baikal',       category: 'lake',       color: C.lake,      emoji: '🏞️', description: 'The deepest lake in the world.' },
    { id: 'victoria',    label: 'Lake Victoria',     category: 'lake',       color: C.lake,      emoji: '🏞️', description: 'The largest lake in Africa by surface area.' },
    { id: 'caspian',     label: 'Caspian Sea',       category: 'lake',       color: C.lake,      emoji: '🌊', description: 'The world\'s largest inland body of water (lake).' },

    // ── Deserts ──
    { id: 'sahara',      label: 'Sahara Desert',     category: 'desert',     color: C.desert,    emoji: '🏜️', description: 'The largest hot desert in the world.' },
    { id: 'arabian_desert',label: 'Arabian Desert',  category: 'desert',     color: C.desert,    emoji: '🏜️', description: 'Located in Western Asia.' },

    // ── Waterfalls ──
    { id: 'angel_falls', label: 'Angel Falls',       category: 'waterfall',  color: C.waterfall, emoji: '💧', description: 'The highest waterfall in the world.' },

    // ── Trenches ──
    { id: 'mariana',     label: 'Mariana Trench',    category: 'trench',     color: C.trench,    emoji: '🐟', description: 'The deepest part of the Earth\'s oceans.' },
    { id: 'puerto_rico', label: 'Puerto Rico Trench',category: 'trench',     color: C.trench,    emoji: '🐟', description: 'The deepest trench in the Atlantic Ocean.' },

    // ── News Agencies ──
    { id: 'afp',         label: 'AFP',               category: 'news',       color: C.news,      emoji: '📰', description: 'Oldest news agency in the world. Based in France.' },
    { id: 'reuters',     label: 'Reuters',           category: 'news',       color: C.news,      emoji: '📰', description: 'Famous news agency of the United Kingdom.' },
    { id: 'kyodo',       label: 'Kyodo News',        category: 'news',       color: C.news,      emoji: '📰', description: 'News agency of Japan.' },
    { id: 'tass',        label: 'TASS',              category: 'news',       color: C.news,      emoji: '📰', description: 'Famous news agency of Russia.' },
    { id: 'kcna',        label: 'KCNA',              category: 'news',       color: C.news,      emoji: '📰', description: 'Official news agency of North Korea.' },
    { id: 'spa',         label: 'SPA',               category: 'news',       color: C.news,      emoji: '📰', description: 'Official news agency of Saudi Arabia.' },
    { id: 'mena',        label: 'MENA',              category: 'news',       color: C.news,      emoji: '📰', description: 'Official news agency of Egypt.' },

    // ── Continents ──
    { id: 'asia',        label: 'Asia',              category: 'continent',  color: C.continent, emoji: '🌏', description: 'The largest continent in the world.' },
    { id: 'africa',      label: 'Africa',            category: 'continent',  color: C.continent, emoji: '🌍', description: 'Referred to as the Dark Continent.' },
    { id: 'oceania',     label: 'Oceania',           category: 'continent',  color: C.continent, emoji: '🌏', description: 'Also called Australia as a continent.' },
    { id: 'antarctica',  label: 'Antarctica',        category: 'continent',  color: C.continent, emoji: '❄️', description: 'Home to Mount Vinson.' },

    // ── Other features ──
    { id: 'wakhan',      label: 'Wakhan Corridor',   category: 'peninsula',  color: C.peninsula, emoji: '🗺️', description: 'Connects Afghanistan & China. Separates Pakistan from Tajikistan.' },
    { id: 'great_wall',  label: 'Great Wall of China',category: 'landmark',  color: C.mountain,  emoji: '🧱', description: 'Approximately 21,196 km long.' },
    { id: 'vatican',     label: 'Vatican City',      category: 'country',    color: C.country,   emoji: '🇻🇦', description: 'Smallest country by area.' },
    { id: 'nauru',       label: 'Nauru',             category: 'country',    color: C.country,   emoji: '🇳🇷', description: 'Smallest republic in the world.' },
    { id: 'greenland',   label: 'Greenland',         category: 'island',     color: C.island,    emoji: '🏝️', description: 'World\'s largest island.' },
    { id: 'arabian_pen', label: 'Arabian Peninsula', category: 'peninsula',  color: C.peninsula, emoji: '🗺️', description: 'The largest peninsula in the world.' },
    { id: 'tibetan_plat',label: 'Tibetan Plateau',   category: 'plateau',    color: C.plateau,   emoji: '🏔️', description: 'The world\'s highest plateau.' },
    { id: 'jakarta',     label: 'Jakarta',           category: 'city',       color: C.city,      emoji: '🏙️', description: 'The fastest sinking city in the world. Capital of Indonesia.' },
  ];

  // ── Edges (connections between nodes) ──
  var edges = [
    // Rivers → locations
    { source: 'indus', target: 'manasarovar', weight: 1.5 },
    { source: 'indus', target: 'pakistan', weight: 1.5 },
    { source: 'nile', target: 'africa', weight: 1.2 },
    { source: 'nile', target: 'egypt', weight: 1.5 },
    { source: 'amazon', target: 'brazil', weight: 1.5 },
    { source: 'volga', target: 'russia', weight: 1.5 },
    { source: 'congo', target: 'africa', weight: 1.2 },
    { source: 'suez', target: 'mediterranean', weight: 1.2 },
    { source: 'suez', target: 'red_sea', weight: 1.2 },
    { source: 'gibraltar', target: 'atlantic', weight: 1.2 },
    { source: 'gibraltar', target: 'mediterranean', weight: 1.2 },
    { source: 'bering', target: 'asia', weight: 1.0 },
    { source: 'bering', target: 'canada', weight: 1.0 },

    // Mountains → locations
    { source: 'everest', target: 'nepal', weight: 1.5 },
    { source: 'everest', target: 'himalayas', weight: 1.3 },
    { source: 'k2', target: 'pakistan', weight: 1.5 },
    { source: 'k2', target: 'china', weight: 1.3 },
    { source: 'k2', target: 'himalayas', weight: 1.2 },
    { source: 'vinson', target: 'antarctica', weight: 1.5 },
    { source: 'andes', target: 'brazil', weight: 1.0 },

    // Oceans / seas
    { source: 'atlantic', target: 'gibraltar', weight: 1.2 },
    { source: 'mediterranean', target: 'gibraltar', weight: 1.2 },
    { source: 'pacific', target: 'asia', weight: 1.0 },
    { source: 'atlantic', target: 'puerto_rico', weight: 1.3 },
    { source: 'pacific', target: 'mariana', weight: 1.3 },

    // Countries → capitals
    { source: 'canada', target: 'ottawa', weight: 2.0 },
    { source: 'egypt', target: 'cairo', weight: 2.0 },
    { source: 'turkey', target: 'ankara', weight: 2.0 },
    { source: 'germany', target: 'berlin', weight: 2.0 },
    { source: 'switzerland', target: 'bern', weight: 2.0 },
    { source: 'ukraine', target: 'kyiv', weight: 2.0 },
    { source: 'usa', target: 'washington', weight: 2.0 },
    { source: 'italy', target: 'rome', weight: 2.0 },
    { source: 'uk', target: 'london', weight: 2.0 },
    { source: 'france', target: 'paris', weight: 2.0 },

    // Countries → news agencies
    { source: 'uk', target: 'reuters', weight: 1.5 },
    { source: 'france', target: 'afp', weight: 1.5 },
    { source: 'japan', target: 'kyodo', weight: 1.5 },
    { source: 'russia', target: 'tass', weight: 1.5 },
    { source: 'n_korea', target: 'kcna', weight: 1.5 },
    { source: 'saudi', target: 'spa', weight: 1.5 },
    { source: 'egypt', target: 'mena', weight: 1.5 },

    // Organizations → HQ
    { source: 'nato', target: 'brussels', weight: 2.0 },
    { source: 'who', target: 'geneva', weight: 2.0 },
    { source: 'world_bank', target: 'washington', weight: 2.0 },
    { source: 'imf', target: 'washington', weight: 2.0 },
    { source: 'un', target: 'usa', weight: 1.2 },
    { source: 'interpol', target: 'lyon', weight: 2.0 },
    { source: 'unesco', target: 'paris', weight: 2.0 },
    { source: 'fao', target: 'rome', weight: 2.0 },
    { source: 'ioc', target: 'lausanne', weight: 2.0 },
    { source: 'wipo', target: 'geneva', weight: 2.0 },
    { source: 'red_cross', target: 'geneva', weight: 2.0 },
    { source: 'adb', target: 'manila', weight: 2.0 },
    { source: 'icj', target: 'the_hague', weight: 2.0 },
    { source: 'amnesty', target: 'london', weight: 2.0 },
    { source: 'saarc', target: 'kathmandu', weight: 2.0 },

    // Events → related
    { source: 'us_independence', target: 'usa', weight: 1.5 },
    { source: 'ww2', target: 'poland', weight: 1.5 },
    { source: 'pearl_harbor', target: 'japan', weight: 1.5 },
    { source: 'pearl_harbor', target: 'usa', weight: 1.5 },
    { source: 'covid_pandemic', target: 'who', weight: 1.5 },
    { source: 'doha_agreement', target: 'usa', weight: 1.0 },
    { source: 'gilgit_freedom', target: 'pakistan', weight: 1.5 },
    { source: 'digital_census', target: 'pakistan', weight: 1.3 },
    { source: 'nccia', target: 'pakistan', weight: 1.3 },

    // People → related
    { source: 'socrates', target: 'greece', weight: 1.5 },
    { source: 'rowling', target: 'uk', weight: 1.2 },
    { source: 'maliha', target: 'pakistan', weight: 1.5 },
    { source: 'asim_munir', target: 'pakistan', weight: 1.5 },

    // OIC connections
    { source: 'oic', target: 'saudi', weight: 1.2 },
    { source: 'oic', target: 'pakistan', weight: 1.2 },  // 2nd meeting in Lahore
    { source: 'oic', target: 'morocco', weight: 1.2 },   // 1st meeting in Rabat

    // UN connections
    { source: 'un', target: 'pakistan', weight: 1.3 },    // joined 30 Sep 1947

    // Continents → related
    { source: 'asia', target: 'china', weight: 1.2 },
    { source: 'asia', target: 'india', weight: 1.2 },
    { source: 'asia', target: 'pakistan', weight: 1.2 },
    { source: 'africa', target: 'egypt', weight: 1.2 },
    { source: 'oceania', target: 'australia', weight: 1.3 },

    // Saudi Arabia connections
    { source: 'saudi', target: 'arabian_pen', weight: 1.3 },

    // Related countries
    { source: 'pakistan', target: 'china', weight: 1.0 },   // via Wakhan
    { source: 'pakistan', target: 'afghanistan', weight: 1.2 },
    { source: 'pakistan', target: 'india', weight: 1.0 },
    { source: 'pakistan', target: 'iran', weight: 1.0 },
    { source: 'afghanistan', target: 'china', weight: 1.2 }, // via Wakhan
    { source: 'wakhan', target: 'afghanistan', weight: 1.5 },
    { source: 'wakhan', target: 'china', weight: 1.5 },
    { source: 'wakhan', target: 'pakistan', weight: 1.2 },

    // Pakistan geography
    { source: 'pakistan', target: 'k2', weight: 1.3 },
    { source: 'pakistan', target: 'indus', weight: 1.5 },
    { source: 'pakistan', target: 'arabian_desert', weight: 1.0 },

    // Neighbors / related
    { source: 'usa', target: 'canada', weight: 1.0 },
    { source: 'canada', target: 'greenland', weight: 0.8 },

    // Deserts → locations
    { source: 'sahara', target: 'africa', weight: 1.3 },
    { source: 'arabian_desert', target: 'saudi', weight: 1.2 },
    { source: 'arabian_desert', target: 'arabian_pen', weight: 1.2 },

    // Lakes
    { source: 'baikal', target: 'russia', weight: 1.3 },
    { source: 'victoria', target: 'africa', weight: 1.2 },
    { source: 'caspian', target: 'kazakhstan', weight: 1.0 },
    { source: 'caspian', target: 'iran', weight: 1.0 },
    { source: 'caspian', target: 'russia', weight: 1.0 },
    { source: 'manasarovar', target: 'china', weight: 1.3 },

    // Trenches
    { source: 'mariana', target: 'pacific', weight: 1.3 },
    { source: 'puerto_rico', target: 'atlantic', weight: 1.3 },

    // Waterfalls
    { source: 'angel_falls', target: 'venezuela', weight: 1.3 },
  ];

  // Helper to find a node by id
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
    // Group nodes by category for the legend
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
