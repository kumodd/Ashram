/**
 * site-config.js — Ashram Restro
 * Single source of truth for all brand, contact, map, and operational settings.
 * Update here; all pages read from window.ASHRAM_CONFIG.
 */
window.ASHRAM_CONFIG = {

  /* ── Brand ──────────────────────────────────────────── */
  name:    { en: 'Ashram Restro', hi: 'आश्रम रेस्तरां' },
  tagline: { en: 'Near IIT Patna · Bihta, Bihar', hi: 'आईआईटी पटना के पास · बिहटा, बिहार' },

  /* ── Contact ─────────────────────────────────────────── */
  phone: {
    primary:        '+918002193829',
    primaryDisplay: '+91 80021 93829',
    alternate: [
      { number: '+919113723907', display: '+91 91137 23907' },
      { number: '+918210395688', display: '+91 82103 95688' }
    ]
  },

  /* ── WhatsApp ─────────────────────────────────────────── */
  whatsapp: {
    number:  '918002193829',
    baseUrl: 'https://wa.me/918002193829'
  },

  /* ── Address ─────────────────────────────────────────── */
  address: {
    line1: 'Gate No. 01, Near IIT Patna',
    line2: 'Bihta-Kanpa Road, Dilawarpur',
    city:  'Bihta', state: 'Bihar', pin: '801106', country: 'India',
    en: 'Gate No. 01, Near IIT Patna, Bihta-Kanpa Road, Dilawarpur, Bihar 801106',
    hi: 'गेट नं. 01, आईआईटी पटना के पास, बिहटा-कनपा रोड, दिलावरपुर, बिहार 801106'
  },

  /* ── Maps ────────────────────────────────────────────── */
  maps: {
    searchUrl:     'https://www.google.com/maps/search/?api=1&query=Ashram+Restro+GVP4%2B2Q+Dilawarpur+Bihar',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=Ashram+Restro%2C+GVP4%2B2Q%2C+Dilawarpur%2C+Bihar',
    plusCode: 'GVP4+2Q Dilawarpur, Bihar'
  },

  /* ── Hours ───────────────────────────────────────────── */
  hours: {
    display: { en: '12 PM – 12 AM  (All Days)', hi: 'दोपहर 12 बजे – रात 12 बजे  (सभी दिन)' }
  },

  /* ── Delivery ────────────────────────────────────────── */
  delivery: {
    available: true,
    radiusKm:  6,
    note: { en: 'Free Home Delivery within 6 km', hi: '6 किमी के अंदर मुफ़्त होम डिलीवरी' }
  },

  /* ── Rating (Google Maps — recheck before launch) ─────── */
  rating: { score: 4.9, count: 35, source: 'Google' },

  website: 'https://ashramrestro.in/'
};
