# Ashram Restro — Website

**Brand:** Ashram Restro · आश्रम रेस्तरां  
**Location:** Near Gate No. 01, IIT Patna · Bihta-Kanpa Road, Dilawarpur, Bihar 801106  
**Primary contact:** +91 80021 93829  
**Website:** https://ashramrestro.in/

---

## Project structure

```
ashram-restro-website/
├── index.html          Home page
├── menu.html           Menu, cart & WhatsApp checkout
├── facilities.html     7 seating / parking zones
├── about.html          Restaurant introduction
├── gallery.html        Photo gallery (real + placeholder tiles)
├── booking.html        Table & party enquiry forms
├── visit.html          Contact, directions, hours
│
├── site-config.js      ← All brand/contact/map/delivery config lives here
├── menu-data.js        ← All menu items and prices live here
│
├── assets/
│   ├── style.css       Shared design system
│   ├── site.js         Language toggle, nav, cart, WhatsApp flows, forms
│   └── images/         AI-generated placeholder images + real photos go here
│       ├── hero-restaurant.jpg              (Restaurant exterior / entrance)
│       ├── about-interior.png               (Interior ambiance)
│       ├── gallery-paneer-tikka.jpg         (Paneer Tikka food photo)
│       ├── gallery-biryani.jpg              (Biryani food photo)
│       ├── gallery-paneer-butter-masala.jpg (Paneer Butter Masala food photo)
│       ├── facility-couple-zone.png         (Zone 01: Couple Zone / Candlelit Booths)
│       ├── facility-private-zone.png        (Zone 02: Private Zone / Secluded Dining Cabin)
│       ├── facility-silent-zone.png         (Zone 03: Silent Zone / Work Desks, Power Sockets & Quiet Meetings)
│       ├── about-interior.png               (Zone 04: Main Dining Area / Family Hall)
│       └── facility-parking.jpg             (Zone 05: Dedicated Secure Parking Bay)
│
├── CORE_FEATURES.md    Product specification & Codex handoff
└── README.md           This file
```

---

## Before publishing — pre-launch checklist

- [ ] Replace all `assets/images/` placeholder photos with owner-approved photos
- [ ] Replace the Google Maps embed placeholder in `visit.html` with a live iframe (obtain the restaurant's Google Maps Place ID)
- [ ] Confirm the WhatsApp number in `site-config.js` (`918002193829`) — test on both mobile and WhatsApp Web
- [ ] Verify opening hours (currently set to 12 PM–12 AM all days) with the owner
- [ ] Verify free home delivery radius (currently 6 km) with the owner before launch
- [ ] Recheck the Google rating / review count on the live profile before publishing any figures
- [ ] Add gallery images for placeholder tiles: `facility-working-zone.jpg`, `facility-silent-zone.png`, `facility-meeting-zone.jpg`, `facility-private-zone.png`, `facility-parking.jpg`
- [ ] Test all WhatsApp links (order, table booking, party booking) on Android/iOS and WhatsApp Web
- [ ] Test cart: add items, H/F size selection, all 3 order types, address validation for delivery
- [ ] Verify EN/HI language toggle persists across all 7 pages
- [ ] Check all pages at mobile (360px), tablet (768px), and desktop (1280px)
- [ ] Confirm canonical URL matches the live domain (`https://ashramrestro.in/`)

---

## Updating menu items

Edit `menu-data.js`. Each item follows this schema:

```js
{
  id:         'unique-slug',      // unique across all items
  nameEn:     'English Name',
  nameHi:     'हिन्दी नाम',
  category:   'category-id',     // see ASHRAM_MENU.categories
  isVeg:      true,               // true = veg dot, false = non-veg dot
  price:      280,                // single price (omit for H/F items)
  priceHalf:  160,                // Half price  (H/F items only)
  priceFull:  280,                // Full price  (H/F items only)
  note:       'Up to 7 PM',      // optional label (orange badge)
  featured:   false               // true = show on home page
}
```

---

## Updating config

All business settings are in `site-config.js`:

| Setting | Key path |
|---|---|
| WhatsApp number | `whatsapp.number` |
| Primary phone | `phone.primary` |
| Maps URLs | `maps.directionsUrl` / `maps.searchUrl` |
| Hours display | `hours.display.en` / `.hi` |
| Delivery radius | `delivery.radiusKm` |
| Google rating | `rating.score` / `.count` |

---

## Language system

- Default: English. Toggle switches to Hindi (Devanagari).
- Language preference saved in `localStorage` key `ashram-lang`.
- Uses CSS classes `.lang-en` / `.lang-hi` toggled on `body`.
- Hindi font: Noto Sans Devanagari (Google Fonts).

## Cart / ordering

- Cart stored in `localStorage` key `ashram-cart`.
- H/F items render separate Half / Full add buttons.
- Checkout opens WhatsApp with a pre-filled message.
- Delivery address field appears only when "Delivery" order type is selected.
- Cart persists across page navigation; stale/corrupt data is silently reset.

---

*Last updated: October 2026*
