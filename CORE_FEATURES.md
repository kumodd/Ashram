# 1. Ashram Restro Website — Core Features & Codex Handoff

> **Purpose:** Give Codex the product requirements and project context needed to maintain, improve, or extend the Ashram Restro website without guessing business details.
>
> **Brand:** Ashram Restro · आश्रम रेस्तरां  
> **Style:** Modern café, warm cream surfaces, green/orange accents, strong editorial typography, and restrained Unicode symbols/dividers.  
> **Languages:** English + Hindi.  
> **Primary conversion:** Menu order, table request, and party enquiry sent to WhatsApp.

---

## 2. Business and configuration facts

- **Primary display name:** Ashram Restro
- **Hindi name:** आश्रम रेस्तरां
- **Location cue:** Near Gate No. 01, IIT Patna
- **Address supplied:** IIT, Bihta-Kanpa Road, Dilawarpur, Bihar 801106, India
- **Primary WhatsApp / phone:** `+91 80021 93829`
- **Alternate phone numbers:** `+91 91137 23907`, `+91 82103 95688`
- **Website:** `https://ashramrestro.in/`
- **Directions:** configured in `site-config.js`
- **Menu and prices:** not supplied in the current bundle; `menu-data.js` intentionally contains an empty `items` array.

The postal address/pincode, opening hours, delivery service area/conditions, parking arrangements, and facility availability should be verified with the restaurant before launch. Do not infer these from customer reviews.

## 3. Sitemap and page-level requirements

### 3.1 Home — `index.html`

- Present the restaurant name, bilingual identity, location near IIT Patna, and modern café positioning.
- Make the primary actions obvious: **Explore menu & order**, **Find your corner / facilities**, **Call**, and **Get directions**.
- Include a clear **What we offer** section: dining, menu/order access, seating choices, and booking enquiries, phrased only to match confirmed offerings.
- Include **How we serve our customers**: communicate the journey plainly—choose a menu item, select the service type, send the request through WhatsApp, and wait for restaurant confirmation.
- Preview the facilities and link to the full facilities page.
- Avoid fixed claims about live rating/review counts, service hours, waiting time, average spend, or delivery availability unless verified.

### 3.2 Menu & Order — `menu.html`

- Render menu items from `window.ASHRAM_MENU.items` in `menu-data.js`; do not hard-code a second menu in the page.
- Support menu search and category filtering.
- Each item may include: unique `id`, English/Hindi name, category, numeric INR price, bilingual descriptions, vegetarian flag, and featured flag. See the comment in `menu-data.js` for the schema.
- Show item pricing in INR using Indian number formatting.
- Provide add-to-cart, quantity increment/decrement, item removal by reducing quantity to zero, item count, per-line totals, and estimated cart total.
- Persist cart quantities in local browser storage; handle invalid/stale stored data safely.
- Provide order types: **Home delivery**, **Takeaway / pickup**, and **Dine-in**.
- Require a delivery address for delivery only. Collect customer name and contact number, plus optional order notes.
- Validate required fields before opening WhatsApp. Do not open checkout with an empty cart.
- Compose a readable WhatsApp order containing item name, quantity, line total, estimated item total, customer details, order type, delivery address when applicable, notes, and a request for the restaurant to confirm the final details.
- Encode the WhatsApp message correctly with `encodeURIComponent` and use the single configured recipient in `site-config.js`.
- If the menu is empty, show an intentional bilingual empty state and an **Ask for today's menu** WhatsApp link. Do not show fake dishes or prices.
- If item prices are changed in the official menu, calculate totals from current menu data. State that total is an estimate where final delivery charges, taxes, or other charges are not configured.

### 3.3 Facilities — `facilities.html`

The page must clearly cover each requested space:

1. **Couple zone**
2. **Private zone**
3. **Silent zone**
4. **Meeting zone**
5. **Working zone**
6. **Dining area**
7. **Dedicated secure parking**

- Use a distinct visual block/card for each facility, with a Unicode marker or modest line ornament where it helps the hierarchy.
- Explain the intended use in clear, welcoming language without inventing details such as capacity, soundproofing, guaranteed silence, private-room availability, AC, Wi-Fi, charging points, CCTV, guards, or parking capacity.
- Until each operational detail is confirmed, use carefully worded descriptions and/or add a note to confirm availability with staff.
- Include a CTA to enquire about preferred seating or booking via the booking page / WhatsApp.

### 3.4 About — `about.html`

- Introduce Ashram Restro in English and Hindi.
- Use confirmed identity and location details only.
- Do not invent a founding date, founder story, awards, sourcing claims, culinary credentials, or brand history.

### 3.5 Gallery — `gallery.html`

- Provide a responsive gallery for owner-approved photos of food, interiors, entrance, facilities, and dining area.
- Current decorative tiles are placeholders, not real photographs. Replace them only with supplied/approved images.
- Add meaningful alt text to informative images; use empty alt text for purely decorative images.
- Avoid suggesting that a placeholder illustration is an actual photo of the property.

### 3.6 Bookings — `booking.html`

Provide two separate enquiry forms that open WhatsApp with a prefilled request.

**Table booking fields**
- Name and phone number (required)
- Preferred date and time (required)
- Number of guests (required)
- Preferred seating (optional): no preference, couple zone, private zone, silent zone, meeting zone, working zone, dining area
- Notes / occasion / seating request (optional)

**Party booking fields**
- Name and phone number (required)
- Preferred date and time (required)
- Expected group size (required)
- Occasion (required)
- Additional details (optional)

Requirements:
- Set a sensible minimum date based on the visitor's local date.
- Validate required values and phone input before submission.
- Encode the generated message and send it to the configured WhatsApp recipient.
- Make it clear that the form sends a **request or enquiry**, not a confirmed booking. Staff must confirm availability, arrangements, and any charges.
- Never claim online reservation inventory or real-time availability; there is no booking backend.

### 3.7 Visit / Contact — `visit.html`

- Show the location cues **Near Gate No. 01, IIT Patna** and **Bihta-Kanpa Road, Dilawarpur, Bihar**.
- Provide Google Maps directions/search links using the configured URLs.
- Provide click-to-call actions using `tel:` links for the confirmed primary number and, where appropriate, alternate numbers.
- Keep contact and navigation consistent with `site-config.js`.
- Do not publish unverified hours or delivery coverage as fact.

## 4. Shared site-wide features

### Bilingual UI

- English is the default language; Hindi can be selected using the visible language toggle.
- The language choice should persist between pages via browser storage.
- Translate navigational labels, buttons, headings, key body copy, empty states, form labels, validation messages, booking/order messages where practical, and dynamic menu/cart content.
- Use proper Hindi Unicode text and ensure the font stack renders Devanagari correctly.
- Do not rely on browser auto-translation as the bilingual implementation.
- If a data field has no Hindi translation, fall back gracefully to its English value rather than showing `undefined` or blank UI.

### Navigation and responsive behavior

- Keep consistent navigation and footer across all pages.
- Links between pages must be relative and work when hosted from a static web server or the root of a domain.
- Support mobile, tablet, and desktop viewports without horizontal overflow.
- Ensure navigation, language switching, menu/cart controls, and forms can be used with a keyboard.
- Respect reduced-motion preferences if adding animation.

### Visual identity

- Modern café style, not a generic restaurant template.
- Warm light background, dark/forest-green text and actions, fresh orange accents, clear visual hierarchy, editorial typography, generous spacing, rounded blocks/cards where suitable.
- Use Unicode text/symbols as restrained, distinctive visual accents (for example, `✳`, `⌖`, `◒`, `↗`, `♡`, `＋`) and custom section dividers. Keep text easy to scan.
- Avoid excessive emoji, illegible novelty fonts, or decorative Unicode that substitutes for meaningful labels.
- Keep contrast accessible and use visible focus states.

### SEO and accessibility

- Give each page a unique and accurate `<title>` and meta description.
- Use a logical heading hierarchy, descriptive link labels, labelled fields, alt text, semantic landmarks, and visible keyboard focus.
- Use buttons for actions and links for navigation.
- Use safe external-link attributes (`rel="noopener"` where `target="_blank"` is used).
- Add structured data only for verified values; never invent opening hours, ratings, price ranges, or review counts.

## 5. WhatsApp integration rules

- Configured recipient: `918002193829` (digits only, country code included) in `site-config.js`.
- Use `https://wa.me/<number>?text=<URL-encoded-message>`.
- All static WhatsApp links and programmatic message flows must use the same configuration so the recipient cannot silently drift between pages.
- Ensure punctuation, Hindi text, ampersands, line breaks, and rupee symbols are encoded correctly.
- Do not send requests to a server; there is no backend in this project.
- Do not claim that WhatsApp launch means the restaurant has received, accepted, or confirmed the request. The customer may cancel before sending, and staff still need to reply.
- Never collect card details or imply that a payment gateway exists.

## 6. Current project structure

```text
ashram-restro-website/
├── index.html          # Home
├── menu.html           # Menu, cart, checkout
├── facilities.html     # Seating, dining and parking spaces
├── about.html          # Restaurant introduction
├── gallery.html        # Gallery and photo placeholders
├── booking.html        # Table and party request forms
├── visit.html          # Contact and directions
├── site-config.js      # Brand, WhatsApp, phone and map configuration
├── menu-data.js        # Official menu data (currently empty)
├── assets/
│   ├── style.css       # Shared responsive styling
│   └── site.js         # Language, forms, cart, WhatsApp flows
├── README.md           # Setup and launch notes
└── CORE_FEATURES.md    # This specification
```

The HTML pages load shared configuration and front-end assets. Keep the order of script loading correct so `site-config.js` and `menu-data.js` are available before `assets/site.js` needs them.

## 7. Known limits / launch blockers

- The official menu and prices have **not** been supplied. Menu cart ordering should activate once valid items are entered in `menu-data.js`.
- The site is static. It has no account system, database, admin panel, inventory management, booking calendar, order-management dashboard, payment gateway, or backend confirmation.
- Cart state is stored locally in the visitor's browser. It is not shared across devices.
- WhatsApp requests require the visitor to complete/send the message in WhatsApp and the restaurant to confirm.
- Gallery visuals still need owner-approved photographs.
- Operating hours, delivery coverage/conditions, address/pincode, and each facility/parking claim require owner verification.
- Test the WhatsApp destination and prefilled messages on both Android/iOS mobile and desktop WhatsApp Web before publishing.

## 8. Suggested Codex work sequence

1. Inspect all seven pages and shared assets; report issues before broad refactoring.
2. Fix concrete functional bugs and broken links while preserving the existing design.
3. Verify English/Hindi translations across every page and dynamically rendered components.
4. Verify menu data handling, search, category filters, cart updates, persisted cart, totals, delivery-address validation, and WhatsApp message generation.
5. Verify table and party forms, date validation, translated labels, and correct WhatsApp messages.
6. Check mobile layouts, accessibility, semantic HTML, and console errors.
7. Update `README.md` whenever setup, configuration, menu schema, or deployment behavior changes.
8. Summarize exactly what changed, tests performed, known gaps, and what still needs owner input. Do not claim deployment unless the site was actually deployed.

## 9. Acceptance checklist

- [ ] All seven pages load and cross-link correctly.
- [ ] Site configuration uses `+91 80021 93829` as the WhatsApp recipient.
- [ ] English/Hindi toggle works and persists across page navigation.
- [ ] Empty-menu state does not show sample dishes or fabricated prices.
- [ ] After official items are added, search/filter/cart/quantity controls and INR totals work.
- [ ] Cart checkout validates required details and produces an accurately formatted WhatsApp message.
- [ ] Delivery address is required only for delivery orders.
- [ ] Table and party requests contain the entered fields and clearly say confirmation is pending.
- [ ] All seven requested facility types are visible and no unverified amenity is promised.
- [ ] Responsive layout works at mobile, tablet, and desktop widths.
- [ ] Keyboard access, form labels, focus states, and image alt text are handled.
- [ ] No invented menu items, hours, reviews, awards, delivery terms, or payment claims.
- [ ] README reflects the actual final implementation and launch prerequisites.
