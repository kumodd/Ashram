/* ═══════════════════════════════════════════════════════════
   Ashram Restro — site.js
   Language · Navigation · Cart · Menu · Booking · WhatsApp
   ═══════════════════════════════════════════════════════════ */
'use strict';

const CFG  = () => window.ASHRAM_CONFIG;
const MENU = () => window.ASHRAM_MENU;

/* ── Constants ─────────────────────────────────────────────── */
const LANG_KEY  = 'ashram-lang';
const CART_KEY  = 'ashram-cart';
const ORDER_KEY = 'ashram-order-type';

/* ── Language ──────────────────────────────────────────────── */
let currentLang = localStorage.getItem(LANG_KEY) || 'en';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.body.classList.toggle('lang-hi', lang === 'hi');
  document.querySelectorAll('[data-lang-en]').forEach(el => {
    el.textContent = lang === 'hi' ? (el.dataset.langHi || el.dataset.langEn) : el.dataset.langEn;
  });
  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function initLang() {
  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.dataset.lang));
  });
  applyLang(currentLang);
}

/* ── Navigation ────────────────────────────────────────────── */
function initNav() {
  const nav  = document.querySelector('.site-nav');
  const ham  = document.querySelector('.nav-hamburger');
  const mob  = document.querySelector('.nav-mobile');

  /* Sticky shadow */
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Mobile menu */
  if (ham && mob) {
    ham.addEventListener('click', () => {
      const open = mob.classList.toggle('open');
      ham.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', open);
    });
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mob.classList.remove('open');
      ham.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    }));
    /* Close on outside tap */
    document.addEventListener('click', e => {
      if (mob.classList.contains('open') && !mob.contains(e.target) && !ham.contains(e.target)) {
        mob.classList.remove('open');
        ham.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* Active link */
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) a.classList.add('active');
  });

  /* Scroll-reveal with progressive enhancement */
  if ('IntersectionObserver' in window) {
    document.documentElement.classList.add('js-scroll-animate');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.02, rootMargin: '0px 0px 120px 0px' });
    document.querySelectorAll('.fade-in').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < (window.innerHeight || document.documentElement.clientHeight) + 80) {
        el.classList.add('visible');
      } else {
        io.observe(el);
      }
    });
  } else {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
  }
}

/* ── Cart ──────────────────────────────────────────────────── */
let cart = [];
let orderType = localStorage.getItem(ORDER_KEY) || 'dine-in';

function loadCart() {
  try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { cart = []; }
  cart = cart.filter(r => r && r.id && r.qty > 0);
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function cartKey(id, size) { return size ? `${id}__${size}` : id; }

function cartQty(id, size) {
  const row = cart.find(r => r.id === id && r.size === (size || null));
  return row ? row.qty : 0;
}

function cartAdd(id, size, price) {
  const key = cartKey(id, size);
  const row = cart.find(r => r.id === id && r.size === (size || null));
  if (row) { row.qty++; row.price = price; }
  else { cart.push({ id, size: size || null, price, qty: 1 }); }
  saveCart();
}

function cartRemove(id, size) {
  const row = cart.find(r => r.id === id && r.size === (size || null));
  if (!row) return;
  row.qty--;
  if (row.qty <= 0) cart = cart.filter(r => !(r.id === id && r.size === (size || null)));
  saveCart();
}

function cartTotal() { return cart.reduce((s, r) => s + r.price * r.qty, 0); }
function cartCount() { return cart.reduce((s, r) => s + r.qty, 0); }

function updateCartBadge() {
  const n = cartCount();
  const total = cartTotal();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = n;
    el.style.display = n > 0 ? '' : 'none';
  });

  /* App-style mobile floating cart bar */
  let floatBar = document.getElementById('mobile-cart-float');
  const isMenuPage = !!(document.getElementById('menu-items-container') || document.querySelector('.menu-layout'));
  if (isMenuPage) {
    if (!floatBar) {
      floatBar = document.createElement('div');
      floatBar.id = 'mobile-cart-float';
      floatBar.className = 'mobile-cart-float';
      floatBar.setAttribute('role', 'button');
      floatBar.setAttribute('aria-label', 'View shopping cart');
      floatBar.onclick = openCart;
      document.body.appendChild(floatBar);
    }
    if (n > 0) {
      const itemsWordEn = n === 1 ? 'item' : 'items';
      const itemsWordHi = 'आइटम';
      floatBar.innerHTML = `
        <div class="mcf-left">
          <span>🛒</span>
          <span class="lang-en">${n} ${itemsWordEn}</span>
          <span class="lang-hi" style="font-family:'Noto Sans Devanagari',sans-serif">${n} ${itemsWordHi}</span>
          <span class="mcf-dot">·</span>
          <span class="mcf-total">${fmtPrice(total)}</span>
        </div>
        <div class="mcf-right">
          <span class="lang-en">View Order →</span>
          <span class="lang-hi" style="font-family:'Noto Sans Devanagari',sans-serif">ऑर्डर देखें →</span>
        </div>
      `;
      floatBar.classList.add('visible');
      applyLang(currentLang);
    } else {
      floatBar.classList.remove('visible');
    }
  }
}

function fmtPrice(n) { return '₹' + n.toLocaleString('en-IN'); }

/* ── Cart sidebar ──────────────────────────────────────────── */
function openCart()  { document.getElementById('cart-sidebar')?.classList.add('open'); document.getElementById('cart-overlay')?.classList.add('open'); renderCartSidebar(); }
function closeCart() { document.getElementById('cart-sidebar')?.classList.remove('open'); document.getElementById('cart-overlay')?.classList.remove('open'); }

function renderCartSidebar() {
  const el = document.getElementById('cart-items');
  if (!el) return;
  const items = MENU()?.items || [];

  if (cart.length === 0) {
    el.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">🛒</div>
      <p class="lang-en">Your cart is empty.<br>Explore the menu to add items.</p>
      <p class="lang-hi" style="font-family:Noto Sans Devanagari,sans-serif">कार्ट खाली है।<br>मेनू देखें और आइटम जोड़ें।</p></div>`;
    applyLang(currentLang);
    document.getElementById('cart-checkout-btn').disabled = true;
    document.getElementById('cart-total-val').textContent = '₹0';
    return;
  }

  document.getElementById('cart-checkout-btn').disabled = false;
  let html = '';
  cart.forEach(row => {
    const item = items.find(i => i.id === row.id);
    const name = item ? (currentLang === 'hi' ? item.nameHi : item.nameEn) : row.id;
    const sub  = row.size ? (row.size === 'half' ? (currentLang === 'hi' ? 'आधा' : 'Half') : (currentLang === 'hi' ? 'पूरा' : 'Full')) : '';
    html += `<div class="cart-row">
      <div class="cart-item-info">
        <div class="name">${name}</div>
        ${sub ? `<div class="sub">${sub}</div>` : ''}
      </div>
      <div style="display:flex;align-items:center;gap:.5rem;">
        <div class="qty-control">
          <button class="qty-btn" onclick="cartRemove('${row.id}','${row.size || ''}');renderCartSidebar();" aria-label="Remove one">−</button>
          <span class="qty-value">${row.qty}</span>
          <button class="qty-btn" onclick="cartAdd('${row.id}','${row.size || ''}',${row.price});renderCartSidebar();" aria-label="Add one">+</button>
        </div>
        <div class="cart-item-price">${fmtPrice(row.price * row.qty)}</div>
      </div>
    </div>`;
  });
  el.innerHTML = html;
  document.getElementById('cart-total-val').textContent = fmtPrice(cartTotal());
}

/* ── WhatsApp order message ────────────────────────────────── */
function buildOrderMsg(name, phone, type, address, notes) {
  const items = MENU()?.items || [];
  const conf  = CFG();
  let lines = [];
  lines.push('🍽️ *Order — Ashram Restro*');
  lines.push('─────────────────────────');
  cart.forEach(row => {
    const item = items.find(i => i.id === row.id);
    const n = item ? item.nameEn : row.id;
    const sz = row.size ? ` (${row.size === 'half' ? 'Half' : 'Full'})` : '';
    lines.push(`▸ ${n}${sz} × ${row.qty}  →  ${fmtPrice(row.price * row.qty)}`);
  });
  lines.push('─────────────────────────');
  lines.push(`*Estimated Total:* ${fmtPrice(cartTotal())} _(estimate — confirm with staff)_`);
  lines.push('');
  lines.push(`*Order type:* ${type === 'delivery' ? '🏠 Home Delivery' : type === 'takeaway' ? '🥡 Takeaway' : '🍽️ Dine-in'}`);
  if (type === 'delivery' && address) lines.push(`*Delivery address:* ${address}`);
  lines.push(`*Name:* ${name}`);
  lines.push(`*Phone:* ${phone}`);
  if (notes) lines.push(`*Notes:* ${notes}`);
  lines.push('');
  lines.push('_Please confirm availability, final price & delivery details. This WhatsApp message is an enquiry, not a confirmed order._');
  return lines.join('\n');
}

function openWhatsAppOrder(name, phone, type, address, notes) {
  const msg = buildOrderMsg(name, phone, type, address, notes);
  const url = `${CFG().whatsapp.baseUrl}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener');
}

/* ── Checkout validation & submit ──────────────────────────── */
function initCheckout() {
  const el = document.getElementById('cart-checkout-btn');
  if (!el) return;

  /* Order type buttons */
  document.querySelectorAll('.order-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      orderType = btn.dataset.type;
      localStorage.setItem(ORDER_KEY, orderType);
      document.querySelectorAll('.order-type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === orderType));
      const addrWrap = document.getElementById('delivery-addr-wrap');
      if (addrWrap) addrWrap.style.display = orderType === 'delivery' ? '' : 'none';
    });
  });
  /* restore */
  document.querySelectorAll('.order-type-btn').forEach(b => b.classList.toggle('active', b.dataset.type === orderType));
  const aw = document.getElementById('delivery-addr-wrap');
  if (aw) aw.style.display = orderType === 'delivery' ? '' : 'none';

  el.addEventListener('click', () => {
    if (cart.length === 0) { showToast('Add items first!'); return; }
    const nameEl  = document.getElementById('cust-name');
    const phoneEl = document.getElementById('cust-phone');
    const addrEl  = document.getElementById('cust-addr');
    const notesEl = document.getElementById('cust-notes');
    let ok = true;

    [nameEl, phoneEl].forEach(f => {
      if (f && !f.value.trim()) { f.parentElement.classList.add('has-error'); ok = false; }
      else if (f) f.parentElement.classList.remove('has-error');
    });
    if (orderType === 'delivery' && addrEl && !addrEl.value.trim()) {
      addrEl.parentElement.classList.add('has-error'); ok = false;
    } else if (addrEl) addrEl.parentElement.classList.remove('has-error');

    const phone = phoneEl?.value.trim() || '';
    if (phone && !/^[\d\s\+\-]{8,15}$/.test(phone)) {
      phoneEl.parentElement.classList.add('has-error'); ok = false;
    }
    if (!ok) { showToast('Please fill all required fields.'); return; }

    openWhatsAppOrder(
      nameEl?.value.trim() || '',
      phone,
      orderType,
      addrEl?.value.trim() || '',
      notesEl?.value.trim() || ''
    );
  });
}

/* ── Menu page ──────────────────────────────────────────────── */
function initMenuPage() {
  const menuData = MENU();
  if (!menuData) return;

  let vegOnly    = false;
  let activecat  = 'all';
  let searchQ    = '';

  function itemPrice(item) {
    if (item.priceHalf != null) return `<span class="hf">Half: ${fmtPrice(item.priceHalf)}</span><span class="hf">Full: ${fmtPrice(item.priceFull)}</span>`;
    return fmtPrice(item.price);
  }

  function renderItems() {
    const container = document.getElementById('menu-categories');
    if (!container) return;
    const q = searchQ.toLowerCase();

    const filtered = menuData.items.filter(item => {
      if (vegOnly && !item.isVeg) return false;
      if (activecat !== 'all' && item.category !== activecat) return false;
      if (q && !(item.nameEn.toLowerCase().includes(q) || item.nameHi.includes(q))) return false;
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state fade-in">
        <div class="empty-state-icon">🔍</div>
        <h3 class="lang-en">No items found</h3>
        <h3 class="lang-hi" style="font-family:Noto Sans Devanagari,sans-serif">कोई आइटम नहीं मिला</h3>
        <p class="lang-en">Try a different search or category.</p>
        <p class="lang-hi" style="font-family:Noto Sans Devanagari,sans-serif">कोई दूसरी कैटेगरी आज़माएं।</p>
      </div>`;
      applyLang(currentLang); return;
    }

    /* Group by category */
    const grouped = {};
    filtered.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    let html = '';
    const catOrder = menuData.categories.map(c => c.id);
    catOrder.forEach(catId => {
      if (!grouped[catId]) return;
      const catMeta = menuData.categories.find(c => c.id === catId);
      html += `<div class="menu-cat-section" data-cat="${catId}">
        <h2 class="menu-section-title">${catMeta.icon} <span class="lang-en">${catMeta.labelEn}</span><span class="lang-hi" style="font-family:Noto Sans Devanagari,sans-serif">${catMeta.labelHi}</span></h2>
        <div class="menu-grid">`;
      grouped[catId].forEach(item => {
        const isHF = item.priceHalf != null;
        const qty  = isHF ? 0 : cartQty(item.id, null);
        const qtyH = isHF ? cartQty(item.id, 'half') : 0;
        const qtyF = isHF ? cartQty(item.id, 'full') : 0;
        const dotClass = item.isVeg ? 'veg' : 'nonveg';

        html += `<div class="menu-item" id="mi-${item.id}">
          <div class="menu-item-top">
            <div class="menu-item-name">
              <span class="lang-en">${item.nameEn}</span>
              <span class="lang-hi" style="font-family:Noto Sans Devanagari,sans-serif">${item.nameHi}</span>
            </div>
            <div class="menu-item-price">${itemPrice(item)}</div>
          </div>
          <div class="menu-item-meta">
            <span class="veg-dot ${dotClass}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}"></span>
            ${item.note ? `<span class="item-note">${item.note}</span>` : ''}
          </div>
          <div class="menu-item-controls">`;
        if (isHF) {
          html += `<div style="display:flex;gap:.5rem;flex-wrap:wrap;">
            <div style="display:flex;align-items:center;gap:.35rem;">
              <span style="font-size:.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Half</span>
              ${qtyH > 0
                ? `<div class="qty-control"><button class="qty-btn" onclick="cartRemove('${item.id}','half');reRenderItem('${item.id}')">−</button><span class="qty-value">${qtyH}</span><button class="qty-btn" onclick="cartAdd('${item.id}','half',${item.priceHalf});reRenderItem('${item.id}')">+</button></div>`
                : `<button class="add-btn" onclick="cartAdd('${item.id}','half',${item.priceHalf});reRenderItem('${item.id}')">+ Add</button>`}
            </div>
            <div style="display:flex;align-items:center;gap:.35rem;">
              <span style="font-size:.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Full</span>
              ${qtyF > 0
                ? `<div class="qty-control"><button class="qty-btn" onclick="cartRemove('${item.id}','full');reRenderItem('${item.id}')">−</button><span class="qty-value">${qtyF}</span><button class="qty-btn" onclick="cartAdd('${item.id}','full',${item.priceFull});reRenderItem('${item.id}')">+</button></div>`
                : `<button class="add-btn" onclick="cartAdd('${item.id}','full',${item.priceFull});reRenderItem('${item.id}')">+ Add</button>`}
            </div>
          </div>`;
        } else {
          html += qty > 0
            ? `<div class="qty-control"><button class="qty-btn" onclick="cartRemove('${item.id}',null);reRenderItem('${item.id}')">−</button><span class="qty-value">${qty}</span><button class="qty-btn" onclick="cartAdd('${item.id}',null,${item.price});reRenderItem('${item.id}')">+</button></div>`
            : `<button class="add-btn" onclick="cartAdd('${item.id}',null,${item.price});reRenderItem('${item.id}')">+ <span class="lang-en">Add</span><span class="lang-hi" style="font-family:Noto Sans Devanagari,sans-serif">जोड़ें</span></button>`;
        }
        html += `</div></div>`;
      });
      html += `</div></div>`;
    });
    container.innerHTML = html;
    applyLang(currentLang);
  }

  /* Re-render a single card after qty change */
  window.reRenderItem = function(id) {
    saveCart();
    const el = document.getElementById(`mi-${id}`);
    if (!el) return;
    const item = menuData.items.find(i => i.id === id);
    if (!item) return;
    const isHF = item.priceHalf != null;
    const ctrl = el.querySelector('.menu-item-controls');
    if (isHF) {
      const qtyH = cartQty(id, 'half');
      const qtyF = cartQty(id, 'full');
      ctrl.innerHTML = `<div style="display:flex;gap:.5rem;flex-wrap:wrap;">
        <div style="display:flex;align-items:center;gap:.35rem;">
          <span style="font-size:.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Half</span>
          ${qtyH > 0
            ? `<div class="qty-control"><button class="qty-btn" onclick="cartRemove('${id}','half');reRenderItem('${id}')">−</button><span class="qty-value">${qtyH}</span><button class="qty-btn" onclick="cartAdd('${id}','half',${item.priceHalf});reRenderItem('${id}')">+</button></div>`
            : `<button class="add-btn" onclick="cartAdd('${id}','half',${item.priceHalf});reRenderItem('${id}')">+ Add</button>`}
        </div>
        <div style="display:flex;align-items:center;gap:.35rem;">
          <span style="font-size:.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;">Full</span>
          ${qtyF > 0
            ? `<div class="qty-control"><button class="qty-btn" onclick="cartRemove('${id}','full');reRenderItem('${id}')">−</button><span class="qty-value">${qtyF}</span><button class="qty-btn" onclick="cartAdd('${id}','full',${item.priceFull});reRenderItem('${id}')">+</button></div>`
            : `<button class="add-btn" onclick="cartAdd('${id}','full',${item.priceFull});reRenderItem('${id}')">+ Add</button>`}
        </div>
      </div>`;
    } else {
      const qty = cartQty(id, null);
      ctrl.innerHTML = qty > 0
        ? `<div class="qty-control"><button class="qty-btn" onclick="cartRemove('${id}',null);reRenderItem('${id}')">−</button><span class="qty-value">${qty}</span><button class="qty-btn" onclick="cartAdd('${id}',null,${item.price});reRenderItem('${id}')">+</button></div>`
        : `<button class="add-btn" onclick="cartAdd('${id}',null,${item.price});reRenderItem('${id}')">+ Add</button>`;
    }
    if (document.getElementById('cart-sidebar')?.classList.contains('open')) renderCartSidebar();
  };

  /* Category filter buttons */
  const catWrap = document.getElementById('cat-filters');
  if (catWrap) {
    let catHtml = `<button class="cat-btn active" data-cat="all" id="catbtn-all">
      <span class="lang-en">All</span><span class="lang-hi" style="font-family:Noto Sans Devanagari,sans-serif">सभी</span></button>`;
    menuData.categories.forEach(c => {
      catHtml += `<button class="cat-btn" data-cat="${c.id}" id="catbtn-${c.id}">
        ${c.icon} <span class="lang-en">${c.labelEn}</span><span class="lang-hi" style="font-family:Noto Sans Devanagari,sans-serif">${c.labelHi}</span></button>`;
    });
    catWrap.innerHTML = catHtml;
    catWrap.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activecat = btn.dataset.cat;
        catWrap.querySelectorAll('.cat-btn').forEach(b => b.classList.toggle('active', b.dataset.cat === activecat));
        renderItems();
      });
    });
  }

  /* Search */
  const searchEl = document.getElementById('menu-search');
  if (searchEl) {
    searchEl.addEventListener('input', () => { searchQ = searchEl.value; renderItems(); });
  }

  /* Veg filter */
  const vegToggle = document.getElementById('veg-toggle');
  if (vegToggle) {
    vegToggle.addEventListener('change', () => { vegOnly = vegToggle.checked; renderItems(); });
  }

  renderItems();
}

/* ── Booking forms ──────────────────────────────────────────── */
function initBookingPage() {
  const conf = CFG();

  /* Set min date to today */
  const today = new Date().toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(el => { el.min = today; });

  /* Table booking */
  const tableForm = document.getElementById('table-booking-form');
  if (tableForm) {
    /* Handle ?seating= URL parameter from facilities page */
    const params = new URLSearchParams(window.location.search);
    const seatingParam = params.get('seating');
    if (seatingParam) {
      const select = tableForm.querySelector('#tb-seating');
      if (select) {
        const clean = seatingParam.toLowerCase().replace(/[^a-z]/g, '');
        for (let opt of select.options) {
          if (opt.value.toLowerCase().replace(/[^a-z]/g, '').includes(clean) || clean.includes(opt.value.toLowerCase().replace(/[^a-z]/g, ''))) {
            select.value = opt.value;
            select.style.borderColor = 'var(--green-700)';
            select.style.background = 'var(--green-50)';
            break;
          }
        }
      }
    }

    tableForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm(tableForm)) return;
      const name    = tableForm.querySelector('#tb-name').value.trim();
      const phone   = tableForm.querySelector('#tb-phone').value.trim();
      const date    = tableForm.querySelector('#tb-date').value;
      const time    = tableForm.querySelector('#tb-time').value;
      const guests  = tableForm.querySelector('#tb-guests').value;
      const seating = tableForm.querySelector('#tb-seating').value;
      const notes   = tableForm.querySelector('#tb-notes').value.trim();
      const lines = [
        '🪑 *Table Booking Request — Ashram Restro*',
        '──────────────────────────────────────',
        `*Name:* ${name}`,
        `*Phone:* ${phone}`,
        `*Date:* ${date}`,
        `*Time:* ${time}`,
        `*Guests:* ${guests}`,
        `*Seating preference:* ${seating || 'No preference'}`,
        notes ? `*Notes:* ${notes}` : '',
        '',
        '_This is an enquiry. Please confirm availability, arrangements and any applicable charges. No booking is confirmed until you reply._'
      ].filter(Boolean);
      window.open(`${conf.whatsapp.baseUrl}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    });
  }

  /* Party booking */
  const partyForm = document.getElementById('party-booking-form');
  if (partyForm) {
    partyForm.addEventListener('submit', e => {
      e.preventDefault();
      if (!validateForm(partyForm)) return;
      const name     = partyForm.querySelector('#pb-name').value.trim();
      const phone    = partyForm.querySelector('#pb-phone').value.trim();
      const date     = partyForm.querySelector('#pb-date').value;
      const time     = partyForm.querySelector('#pb-time').value;
      const size     = partyForm.querySelector('#pb-size').value;
      const occasion = partyForm.querySelector('#pb-occasion').value;
      const details  = partyForm.querySelector('#pb-details').value.trim();
      const lines = [
        '🎉 *Party Booking Enquiry — Ashram Restro*',
        '──────────────────────────────────────',
        `*Name:* ${name}`,
        `*Phone:* ${phone}`,
        `*Date:* ${date}`,
        `*Time:* ${time}`,
        `*Group size:* ${size} people`,
        `*Occasion:* ${occasion}`,
        details ? `*Details:* ${details}` : '',
        '',
        '_This is an enquiry. Please confirm availability, space, menu options, and any applicable charges. No booking is confirmed until you reply._'
      ].filter(Boolean);
      window.open(`${conf.whatsapp.baseUrl}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    });
  }
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const grp = field.closest('.form-group');
    if (!field.value.trim()) {
      grp?.classList.add('has-error'); valid = false;
    } else {
      grp?.classList.remove('has-error');
    }
  });
  /* Phone validation */
  const phoneEl = form.querySelector('input[type="tel"]');
  if (phoneEl && phoneEl.value && !/^[\d\s\+\-]{8,15}$/.test(phoneEl.value)) {
    phoneEl.closest('.form-group')?.classList.add('has-error'); valid = false;
  }
  if (!valid) showToast(currentLang === 'hi' ? 'कृपया सभी ज़रूरी फ़ील्ड भरें।' : 'Please fill all required fields.');
  return valid;
}

/* ── Toast ─────────────────────────────────────────────────── */
function showToast(msg, duration = 3000) {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ── Global cart exposures ──────────────────────────────────── */
window.cartAdd    = cartAdd;
window.cartRemove = cartRemove;
window.openCart   = openCart;
window.closeCart  = closeCart;

/* ── Init ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  initLang();
  initNav();
  updateCartBadge();

  /* Cart sidebar events */
  document.getElementById('cart-btn')?.addEventListener('click', openCart);
  document.getElementById('cart-overlay')?.addEventListener('click', closeCart);
  document.getElementById('cart-close')?.addEventListener('click', closeCart);

  /* Page detection */
  const page = location.pathname.split('/').pop();
  if (page === 'menu.html' || document.getElementById('menu-categories')) {
    initMenuPage();
    initCheckout();
  }
  if (page === 'booking.html' || document.getElementById('table-booking-form')) {
    initBookingPage();
  }

  /* WhatsApp links using config */
  const conf = CFG();
  if (conf) {
    document.querySelectorAll('[data-wa-menu]').forEach(el => {
      el.href = `${conf.whatsapp.baseUrl}?text=${encodeURIComponent("Hi! Please share today's menu. 🙏")}`;
    });
    document.querySelectorAll('[data-tel-primary]').forEach(el => {
      el.href = `tel:${conf.phone.primary}`;
      if (!el.textContent.trim()) el.textContent = conf.phone.primaryDisplay;
    });
    document.querySelectorAll('[data-maps-dir]').forEach(el => { el.href = conf.maps.directionsUrl; });
    document.querySelectorAll('[data-maps-search]').forEach(el => { el.href = conf.maps.searchUrl; });
  }
});
