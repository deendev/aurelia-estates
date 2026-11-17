/* =========================================================================
   AURELIA ESTATES · Application
   Vanilla JS, no build step. Sections:
   1. Utilities          6. Collection (filters, cards)
   2. State + storage    7. Home components
   3. Router             8. Property detail
   4. Header + menu      9. Forms + validation
   5. Overlays/modals   10. Boot
   ========================================================================= */
(function () {
  'use strict';

  const D = window.AURELIA_DATA;
  const API = window.AureliaAPI;

  /* ---------------------------------------------------------------- 1 */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const eur = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const num = new Intl.NumberFormat('en-GB');
  const icon = (id, cls = 'ico') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const locById = (id) => D.locations.find((l) => l.id === id);
  const priceHTML = (p) => p.status === 'rent'
    ? `${eur.format(p.price)} <small>/ month</small>`
    : eur.format(p.price);
  const priceText = (p) => eur.format(p.price) + (p.status === 'rent' ? ' per month' : '');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toast(msg) {
    const t = $('#toast');
    t.innerHTML = icon('check') + `<span>${esc(msg)}</span>`;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { t.hidden = true; }, 2600);
  }

  /* ---------------------------------------------------------------- 2 */
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
    },
    set(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable: keep in memory */ }
    }
  };

  const PRICE_RANGES = {
    sale: [['', 'Any price'], ['0-3000000', 'Up to €3M'], ['3000000-5000000', '€3M to €5M'], ['5000000-', '€5M and above']],
    rent: [['', 'Any rent'], ['0-20000', 'Up to €20k / month'], ['20000-35000', '€20k to €35k / month'], ['35000-', '€35k / month and above']]
  };
  const TYPES = ['Villa', 'Penthouse', 'Apartment', 'Townhouse', 'Residence', 'Estate'];
  const ADVISORS = {
    london: ['Charlotte Hale', 'CH'], milan: ['Matteo Rinaldi', 'MR'], 'lake-como': ['Matteo Rinaldi', 'MR'],
    dubai: ['Layla Haddad', 'LH'], monaco: ['Julien Marchetti', 'JM'], tuscany: ['Giulia Conti', 'GC']
  };

  const state = {
    mode: 'sale',
    filters: { location: '', type: '', price: '', beds: 0, q: '' },
    sort: 'featured',
    favourites: new Set(store.get('aurelia:favs', []))
  };

  /* ---------------------------------------------------------------- 3 */
  const SECTION_ROUTES = ['home', 'collection', 'locations', 'developments', 'about', 'contact'];

  function go(hash) {
    if (location.hash === '#' + hash) route();
    else location.hash = hash;
  }

  function route() {
    const h = decodeURIComponent(location.hash.slice(1));
    closeMobileMenu();
    if (h.startsWith('property-')) {
      const id = h.slice(9);
      const p = D.properties.find((x) => x.id === id);
      if (p) { showDetail(p); return; }
    }
    showHome();
    if (h === 'sell') { openLayer('sellModal'); return; }
    const target = SECTION_ROUTES.includes(h) ? document.getElementById(h) : null;
    if (target && h !== 'home') {
      requestAnimationFrame(() => target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }));
    } else if (h === 'home') {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  function showHome() {
    const wasDetail = !$('#view-detail').hidden;
    $('#view-home').hidden = false;
    $('#view-detail').hidden = true;
    document.title = 'Aurelia Estates · Exceptional Homes in London, Milan, Dubai and Monaco';
    if (wasDetail) window.scrollTo(0, 0);
    updateHeader();
  }

  // Intercept in-page links so Buy/Rent can set the mode and repeated clicks still scroll.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const hash = a.getAttribute('href').slice(1);
    if (!hash || a.hasAttribute('data-open')) return;
    if (a.dataset.mode) setMode(a.dataset.mode, { resetFilters: true });
    if (a.hasAttribute('data-close-nav')) closeLayer();
    e.preventDefault();
    go(hash);
  });

  /* ---------------------------------------------------------------- 4 */
  const header = $('#siteHeader');
  function updateHeader() {
    const detail = !$('#view-detail').hidden;
    header.classList.toggle('solid', detail || window.scrollY > 40 || !$('#mobileMenu').hidden);
    // Highlight the nav item for the section in view
    if (!detail) {
      let current = '';
      ['collection', 'developments', 'about', 'contact'].forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) current = id;
      });
      $$('.main-nav a').forEach((a) => {
        const href = a.getAttribute('href').slice(1);
        const match = href === current && (current !== 'collection' || a.dataset.mode === state.mode);
        a.classList.toggle('active', match);
      });
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });

  const menuBtn = $('#menuBtn');
  function closeMobileMenu() {
    if ($('#mobileMenu').hidden) return;
    $('#mobileMenu').hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    menuBtn.innerHTML = icon('menu');
    document.body.classList.remove('no-scroll');
    updateHeader();
  }
  menuBtn.addEventListener('click', () => {
    const open = $('#mobileMenu').hidden;
    if (!open) { closeMobileMenu(); return; }
    $('#mobileMenu').hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    menuBtn.innerHTML = icon('close');
    document.body.classList.add('no-scroll');
    updateHeader();
    $('#mobileMenu a').focus();
  });

  /* ---------------------------------------------------------------- 5 */
  let activeLayer = null;
  let lastFocus = null;
  const focusables = (el) => $$('a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', el)
    .filter((n) => n.offsetParent !== null || n === document.activeElement);

  function openLayer(id, trigger) {
    if (activeLayer && activeLayer.id !== id) closeLayer(true);
    const el = document.getElementById(id);
    if (!el) return;
    closeMobileMenu();
    lastFocus = trigger || document.activeElement;
    el.hidden = false;
    activeLayer = el;
    document.body.classList.add('no-scroll');
    if (id === 'favDrawer') renderFavDrawer();
    if (id === 'searchOverlay') { $('#qInput').value = ''; renderQuickResults(''); }
    const first = id === 'searchOverlay' ? $('#qInput') : focusables(el).find((n) => !n.matches('[data-close]')) || focusables(el)[0];
    setTimeout(() => first && first.focus(), 30);
  }
  function closeLayer(keepScrollLock) {
    if (!activeLayer) return;
    activeLayer.hidden = true;
    activeLayer = null;
    if (!keepScrollLock) document.body.classList.remove('no-scroll');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); openLayer(opener.dataset.open, opener); return; }
    if (e.target.closest('[data-close]') && activeLayer) closeLayer();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (activeLayer) closeLayer(); else closeMobileMenu();
    }
    if (e.key === 'Tab' && activeLayer) {
      const f = focusables(activeLayer);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (activeLayer && activeLayer.id === 'lightbox') {
      if (e.key === 'ArrowRight') lbStep(1);
      if (e.key === 'ArrowLeft') lbStep(-1);
    }
  });

  /* ---------------------------------------------------------------- 6 */
  function setMode(mode, opts = {}) {
    state.mode = mode;
    if (opts.resetFilters) state.filters = { location: '', type: '', price: '', beds: 0, q: '' };
    state.filters.price = '';
    $$('[data-mode-tab]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.modeTab === mode)));
    fillPriceOptions();
    syncSearchForm();
    renderCollection();
  }

  function fillPriceOptions() {
    $('#sPrice').innerHTML = PRICE_RANGES[state.mode].map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
    $('#sPrice').value = state.filters.price;
  }

  function syncSearchForm() {
    $('#sLocation').value = state.filters.location;
    $('#sType').value = state.filters.type;
    $('#sPrice').value = state.filters.price;
    $('#sBeds').value = String(state.filters.beds);
    $$('#typeChips .chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.type === state.filters.type)));
  }

  function matches(p) {
    const f = state.filters;
    if (p.status !== state.mode) return false;
    if (f.location && p.location !== f.location) return false;
    if (f.type && p.type !== f.type) return false;
    if (f.beds && p.beds < f.beds) return false;
    if (f.price) {
      const [min, max] = f.price.split('-').map((v) => (v === '' ? null : Number(v)));
      if (min !== null && p.price < min) return false;
      if (max !== null && p.price > max) return false;
    }
    if (f.q) {
      const hay = [p.name, p.house, p.area, p.type, p.summary, p.features.join(' '), locById(p.location).name].join(' ').toLowerCase();
      if (!f.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }

  function sortList(list) {
    const s = state.sort;
    if (s === 'price-desc') return list.sort((a, b) => b.price - a.price);
    if (s === 'price-asc') return list.sort((a, b) => a.price - b.price);
    if (s === 'size-desc') return list.sort((a, b) => b.size - a.size);
    return list;
  }

  function cardHTML(p) {
    const loc = locById(p.location);
    const fav = state.favourites.has(p.id);
    return `
    <article class="card">
      <div class="card-media">
        <span class="card-tag">${p.status === 'rent' ? 'To Rent' : 'For Sale'} · ${esc(p.type)}</span>
        <button class="fav-btn" type="button" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav ? 'Remove' : 'Save'} ${esc(p.name)} ${fav ? 'from' : 'to'} favourites">${icon('heart')}</button>
        <a class="card-photo-link" href="#property-${p.id}" tabindex="-1" aria-hidden="true"></a>
        <img src="${p.imageSm}" srcset="${p.imageSm} 760w, ${p.image} 1400w" sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw" alt="${esc(p.alt)}" width="760" height="567" loading="lazy" decoding="async">
      </div>
      <div class="card-body">
        <p class="card-loc">${icon('pin')}${esc(loc.name)}, ${esc(loc.country)}</p>
        <h3 class="card-title"><a href="#property-${p.id}">${esc(p.name)}</a></h3>
        <p class="card-house">${esc(p.house)}</p>
        <ul class="specs" aria-label="Key facts">
          <li>${icon('bed')}<span>${p.beds} <span class="visually-hidden">bedrooms</span><span aria-hidden="true">Beds</span></span></li>
          <li>${icon('bath')}<span>${p.baths} <span class="visually-hidden">bathrooms</span><span aria-hidden="true">Baths</span></span></li>
          <li>${icon('area')}<span>${num.format(p.size)} m²</span></li>
        </ul>
        <div class="card-foot">
          <p class="price">${priceHTML(p)}</p>
          <a class="view-link" href="#property-${p.id}">View Property ${icon('arrow-r')}<span class="visually-hidden">: ${esc(p.name)}</span></a>
        </div>
      </div>
    </article>`;
  }

  function renderCollection() {
    const list = sortList(D.properties.filter(matches));
    const grid = $('#propertyGrid');
    grid.innerHTML = list.map(cardHTML).join('');
    $('#emptyState').hidden = list.length > 0;
    const f = state.filters;
    const anyFilter = f.location || f.type || f.price || f.beds || f.q;
    const title = $('#collectionTitle');
    if (anyFilter) title.innerHTML = 'Your <em>Search</em>';
    else title.innerHTML = state.mode === 'rent' ? 'Homes to <em>Rent</em>' : 'Featured <em>Properties</em>';
    $('#resultCount').textContent = `${list.length} ${list.length === 1 ? 'home' : 'homes'} ${state.mode === 'rent' ? 'to rent' : 'for sale'}`;
    renderActiveFilters(list.length);
  }

  function renderActiveFilters(count) {
    const f = state.filters;
    const tags = [];
    if (f.location) tags.push(['location', locById(f.location).name]);
    if (f.type) tags.push(['type', f.type]);
    if (f.price) tags.push(['price', PRICE_RANGES[state.mode].find((r) => r[0] === f.price)[1]]);
    if (f.beds) tags.push(['beds', f.beds + '+ bedrooms']);
    if (f.q) tags.push(['q', '“' + f.q + '”']);
    const box = $('#activeFilters');
    box.hidden = tags.length === 0;
    if (!tags.length) { box.innerHTML = ''; return; }
    let note = '';
    if (f.location) {
      const loc = locById(f.location);
      note = `<p class="af-note">Showing ${count} of ${loc.portfolio} homes we represent in ${esc(loc.name)}. The rest are offered privately. <a class="link-btn" href="#contact">Ask an advisor for the full list</a>.</p>`;
    }
    box.innerHTML = '<span>Filtered by</span>' + tags.map(([k, l]) =>
      `<span class="af-tag">${esc(l)}<button type="button" data-clear="${k}" aria-label="Remove filter ${esc(l)}">${icon('close')}</button></span>`
    ).join('') + `<button type="button" class="link-btn" data-clear="all">Clear all</button>` + note;
  }

  $('#activeFilters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-clear]');
    if (!b) return;
    const k = b.dataset.clear;
    if (k === 'all') state.filters = { location: '', type: '', price: '', beds: 0, q: '' };
    else state.filters[k] = k === 'beds' ? 0 : '';
    syncSearchForm();
    renderCollection();
  });
  $('#resetFilters').addEventListener('click', () => {
    state.filters = { location: '', type: '', price: '', beds: 0, q: '' };
    syncSearchForm();
    renderCollection();
  });

  // Type chips
  $('#typeChips').innerHTML = ['', ...TYPES].map((t) =>
    `<button type="button" class="chip" data-type="${t}" aria-pressed="${t === ''}">${t || 'All'}</button>`).join('');
  $('#typeChips').addEventListener('click', (e) => {
    const c = e.target.closest('.chip');
    if (!c) return;
    state.filters.type = c.dataset.type;
    syncSearchForm();
    renderCollection();
  });
  $('#sortSelect').addEventListener('change', (e) => { state.sort = e.target.value; renderCollection(); });

  // Hero search
  $('#sLocation').insertAdjacentHTML('beforeend', D.locations.map((l) => `<option value="${l.id}">${esc(l.name)}</option>`).join(''));
  $$('[data-mode-tab]').forEach((b) => b.addEventListener('click', () => setMode(b.dataset.modeTab)));
  $('.search-tabs').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const next = state.mode === 'sale' ? 'rent' : 'sale';
      setMode(next);
      $(`[data-mode-tab="${next}"]`).focus();
    }
  });
  $('#heroSearch').addEventListener('submit', (e) => {
    e.preventDefault();
    state.filters.location = $('#sLocation').value;
    state.filters.type = $('#sType').value;
    state.filters.price = $('#sPrice').value;
    state.filters.beds = Number($('#sBeds').value);
    syncSearchForm();
    renderCollection();
    go('collection');
  });

  // Favourites
  function toggleFav(id, btn) {
    const p = D.properties.find((x) => x.id === id);
    const on = !state.favourites.has(id);
    on ? state.favourites.add(id) : state.favourites.delete(id);
    store.set('aurelia:favs', Array.from(state.favourites));
    $$(`[data-fav="${id}"]`).forEach((b) => {
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', `${on ? 'Remove' : 'Save'} ${p.name} ${on ? 'from' : 'to'} favourites`);
    });
    if (btn) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
    updateFavCount(true);
    if (activeLayer && activeLayer.id === 'favDrawer') renderFavDrawer();
    toast(on ? `${p.name} saved to favourites` : `${p.name} removed from favourites`);
  }
  function updateFavCount(bump) {
    const n = state.favourites.size;
    const badge = $('#favCount');
    badge.textContent = n;
    badge.hidden = n === 0;
    $('#favHeaderBtn').setAttribute('aria-label', `Favourite properties, ${n} saved`);
    if (bump) { badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump'); }
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-fav]');
    if (b) { e.preventDefault(); toggleFav(b.dataset.fav, b); }
  });
  function renderFavDrawer() {
    const items = D.properties.filter((p) => state.favourites.has(p.id));
    $('#favEmpty').hidden = items.length > 0;
    $('#favList').innerHTML = items.map((p) => `
      <li>
        <img src="${p.imageSm}" alt="" width="92" height="74" loading="lazy">
        <div>
          <a class="fav-name" href="#property-${p.id}" data-close-nav>${esc(p.name)}</a>
          <p class="fav-meta">${esc(p.area)}</p>
          <p class="fav-price">${esc(priceText(p))}</p>
        </div>
        <button class="icon-btn" type="button" data-fav="${p.id}" aria-pressed="true" aria-label="Remove ${esc(p.name)} from favourites">${icon('close')}</button>
      </li>`).join('');
  }

  // Quick search overlay
  function renderQuickResults(q) {
    const ul = $('#qsResults');
    q = q.trim();
    if (!q) { ul.innerHTML = ''; return; }
    const words = q.toLowerCase().split(/\s+/);
    const res = D.properties.filter((p) => {
      const hay = [p.name, p.house, p.area, p.type, p.summary, p.features.join(' ')].join(' ').toLowerCase();
      return words.every((w) => hay.includes(w));
    });
    ul.innerHTML = res.length ? res.map((p) => `
      <li><a href="#property-${p.id}" data-close-nav>
        <img src="${p.imageSm}" alt="" width="96" height="70" loading="lazy">
        <span><span class="qs-name">${esc(p.name)}</span><br><span class="qs-meta">${esc(p.area)} · ${p.beds} bedrooms</span></span>
        <span class="qs-price">${esc(eur.format(p.price))}${p.status === 'rent' ? '<span class="qs-meta"> / mo</span>' : ''}</span>
      </a></li>`).join('')
      : `<li class="qs-none">Nothing matches “${esc(q)}” in the public collection. <a class="link-btn" href="#contact" data-close-nav>Ask an advisor</a>, many homes are offered privately.</li>`;
  }
  $('#qInput').addEventListener('input', (e) => renderQuickResults(e.target.value));
  $$('.qs-suggest .chip').forEach((c) => c.addEventListener('click', () => {
    $('#qInput').value = c.dataset.q; renderQuickResults(c.dataset.q); $('#qInput').focus();
  }));
  $('#quickSearch').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = $('#qInput').value.trim();
    if (!q) return;
    const anyRent = D.properties.some((p) => p.status === 'rent' && matchesQ(p, q));
    const anySale = D.properties.some((p) => p.status === 'sale' && matchesQ(p, q));
    state.filters = { location: '', type: '', price: '', beds: 0, q };
    if (!anySale && anyRent) state.mode = 'rent'; else state.mode = 'sale';
    $$('[data-mode-tab]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.modeTab === state.mode)));
    fillPriceOptions(); syncSearchForm(); renderCollection();
    closeLayer();
    go('collection');
  });
  function matchesQ(p, q) {
    const hay = [p.name, p.house, p.area, p.type, p.summary, p.features.join(' ')].join(' ').toLowerCase();
    return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
  }

  /* ---------------------------------------------------------------- 7 */
  function renderLocations() {
    $('#locGrid').innerHTML = D.locations.map((l) => `
      <button type="button" class="loc-tile reveal" data-loc="${l.id}" aria-label="${esc(l.name)}: ${l.portfolio} homes. Show properties">
        <img src="${l.image}" alt="" width="645" height="864" loading="lazy" decoding="async">
        <span class="loc-info">
          <span><span class="loc-name">${esc(l.name)}</span><span class="loc-sub">${esc(l.line)}</span></span>
          <span class="loc-count">${l.portfolio} homes</span>
        </span>
      </button>`).join('');
    $('#locGrid').addEventListener('click', (e) => {
      const t = e.target.closest('[data-loc]');
      if (!t) return;
      state.filters = { location: t.dataset.loc, type: '', price: '', beds: 0, q: '' };
      const hasSale = D.properties.some((p) => p.location === t.dataset.loc && p.status === 'sale');
      setMode(hasSale ? 'sale' : 'rent');
      state.filters.location = t.dataset.loc;
      syncSearchForm(); renderCollection();
      go('collection');
    });
    $('#footerLocations').innerHTML = D.locations.map((l) => `<li><button type="button" class="link-btn" data-loc-link="${l.id}">${esc(l.name)}</button></li>`).join('');
    $('#footerLocations').addEventListener('click', (e) => {
      const b = e.target.closest('[data-loc-link]');
      if (!b) return;
      state.filters = { location: b.dataset.locLink, type: '', price: '', beds: 0, q: '' };
      setMode('sale');
      state.filters.location = b.dataset.locLink;
      syncSearchForm(); renderCollection();
      go('collection');
    });
  }

  function renderDevelopments() {
    $('#devList').innerHTML = D.developments.map((d) => `
      <li><strong>${esc(d.name)}</strong><span>${esc(d.place)} · ${esc(d.units)} · Completion ${esc(d.completion)}</span>
      <span class="dev-from">From<b>${eur.format(d.from)}</b></span></li>`).join('');
    $('#devCards').innerHTML = D.developments.map((d) => `
      <article class="dev-card">
        <img src="${d.image}" alt="${esc(d.name)}" loading="lazy">
        <p class="dc-place">${esc(d.place)}</p>
        <h3>${esc(d.name)}</h3>
        <p>${esc(d.text)}</p>
        <dl><dt>From</dt><dd>${eur.format(d.from)}</dd><dt>Homes</dt><dd>${esc(d.units)}</dd><dt>Completion</dt><dd>${esc(d.completion)}</dd></dl>
      </article>`).join('');
    $('#dDev').insertAdjacentHTML('beforeend', D.developments.map((d) => `<option>${esc(d.name)}</option>`).join('') + '<option>Both developments</option>');
  }

  function renderTestimonials() {
    const track = $('#testiTrack');
    track.innerHTML = D.testimonials.map((t, i) => `
      <figure class="testi reveal" id="testi-${i}">
        <div class="testi-mark" aria-hidden="true">“</div>
        <blockquote>${esc(t.quote)}</blockquote>
        <footer><strong>${esc(t.name)}</strong><span>${esc(t.place)}</span></footer>
      </figure>`).join('');
    const dots = $('#testiDots');
    dots.innerHTML = D.testimonials.map((t, i) => `<button type="button" role="tab" aria-selected="${i === 0}" aria-controls="testi-${i}" aria-label="Testimonial ${i + 1}"></button>`).join('');
    const cards = $$('.testi', track);
    let current = 0;
    const scrollTo = (i) => {
      current = (i + cards.length) % cards.length;
      track.scrollTo({ left: cards[current].offsetLeft - track.offsetLeft - (track.clientWidth - cards[current].clientWidth) / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    $$('button', dots).forEach((b, i) => b.addEventListener('click', () => scrollTo(i)));
    $('#testiPrev').addEventListener('click', () => scrollTo(current - 1));
    $('#testiNext').addEventListener('click', () => scrollTo(current + 1));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && en.intersectionRatio > 0.6) {
            current = cards.indexOf(en.target);
            $$('button', dots).forEach((b, i) => b.setAttribute('aria-selected', String(i === current)));
          }
        });
      }, { root: track, threshold: [0.6] });
      cards.forEach((c) => io.observe(c));
    }
  }

  function renderOffices() {
    $('#officeList').innerHTML = D.offices.map((o) => `
      <li><h3>${esc(o.city)}</h3><p>${esc(o.address)}</p><a href="tel:${o.phone.replace(/\s/g, '')}">${esc(o.phone)}</a></li>`).join('');
  }

  // Scroll reveal
  let revealIO = null;
  function observeReveals(root = document) {
    const els = $$('.reveal:not(.in)', root);
    if (!('IntersectionObserver' in window) || reduceMotion) { els.forEach((e) => e.classList.add('in')); return; }
    if (!revealIO) {
      revealIO = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    }
    els.forEach((e) => revealIO.observe(e));
  }

  /* ---------------------------------------------------------------- 8 */
  const CAPTIONS = { living: 'Living room', kitchen: 'Kitchen', bedroom: 'Principal bedroom', bath: 'Bathroom', dining: 'Dining room', terrace: 'Evening terrace', library: 'Library' };
  let gallery = [];
  let gIndex = 0;
  let lbIndex = 0;

  function buildGallery(p) {
    const loc = locById(p.location);
    return p.gallery.map((k) => {
      if (k === 'main') return { src: p.image, alt: p.alt, cap: p.status === 'rent' ? 'The residence' : 'Exterior' };
      if (k === 'loc') return { src: loc.image, alt: `View of ${loc.name}`, cap: `The area: ${loc.name}` };
      const it = D.interiors[k];
      return { src: it.src, alt: it.alt, cap: CAPTIONS[k] };
    });
  }

  function similarTo(p) {
    return D.properties
      .filter((x) => x.id !== p.id && x.status === p.status)
      .map((x) => ({ x, score: (x.location === p.location ? 0 : 2) + (x.type === p.type ? 0 : 1) + Math.abs(Math.log(x.price / p.price)) }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((o) => o.x);
  }

  function mapSVG(seed) {
    // Abstract cartographic illustration (no external map provider).
    // Backend/integration point: swap for Mapbox or Google Maps with the listing's coordinates.
    const s = seed.length;
    const water = (s % 2)
      ? `<path d="M0 ${150 + s} C 90 ${120 + s}, 160 ${210 - s}, 260 ${180 + s} S 420 ${140 + s}, 520 ${190 - s} L520 400 L0 400 Z" fill="#cfd8d6"/>`
      : `<path d="M${320 + s} 0 C ${280 + s} 90, ${360 - s} 170, ${300 + s} 260 S ${340} 360, ${380} 400 L520 400 L520 0 Z" fill="#cfd8d6"/>`;
    let roads = '';
    for (let i = 0; i < 7; i++) {
      const y = 30 + i * 52 + (s * i) % 17;
      roads += `<path d="M-10 ${y} Q 200 ${y + ((i % 2) ? 30 : -24)} 530 ${y + 8}" stroke="#fffaf2" stroke-width="${i === 3 ? 7 : 3}" fill="none" opacity=".9"/>`;
    }
    for (let i = 0; i < 6; i++) {
      const x = 40 + i * 90 + (s * i) % 23;
      roads += `<path d="M${x} -10 Q ${x + ((i % 2) ? 26 : -18)} 200 ${x + 12} 410" stroke="#fffaf2" stroke-width="${i === 2 ? 6 : 2.5}" fill="none" opacity=".85"/>`;
    }
    const parks = `<ellipse cx="${120 + s * 3}" cy="${280 - s}" rx="54" ry="34" fill="#d5dcc4"/><rect x="${360 - s}" y="60" width="70" height="46" rx="8" fill="#d5dcc4"/>`;
    return `<svg viewBox="0 0 520 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="520" height="400" fill="#ece5d8"/>${parks}${water}${roads}</svg>`;
  }

  function showDetail(p) {
    const loc = locById(p.location);
    const adv = ADVISORS[p.location];
    const fav = state.favourites.has(p.id);
    gallery = buildGallery(p);
    gIndex = 0;
    const thumbs = gallery.slice(1, 4).map((g, i) => {
      const idx = i + 1;
      const more = i === 2 && gallery.length > 4 ? `<span class="more" aria-hidden="true">+${gallery.length - 4}</span>` : '';
      return `<button type="button" class="g-thumb" data-g="${idx}" aria-label="Show photo ${idx + 1}: ${esc(g.cap)}">${more}<img src="${g.src}" alt="" loading="lazy"></button>`;
    }).join('');
    const scrollThumbs = gallery.map((g, i) =>
      `<button type="button" class="g-thumb" data-g="${i}" aria-label="Show photo ${i + 1}: ${esc(g.cap)}"><img src="${g.src}" alt="" loading="lazy"></button>`).join('');
    const pair = gallery.filter((g, i) => i > 0 && !g.cap.startsWith('The area')).slice(0, 2);
    const similar = similarTo(p);

    const v = $('#view-detail');
    v.innerHTML = `
    <article class="detail" itemscope itemtype="https://schema.org/SingleFamilyResidence">
      <div class="container">
        <nav class="crumbs" aria-label="Breadcrumb">
          <a href="#collection" class="back-link">${icon('arrow-l')} Back to collection</a>
          <span class="sep" aria-hidden="true">/</span>
          <span>${esc(loc.name)}</span>
          <span class="sep" aria-hidden="true">/</span>
          <span aria-current="page">${esc(p.house)}</span>
        </nav>
        <header class="d-head">
          <div>
            <p class="eyebrow">${p.status === 'rent' ? 'To Rent' : 'For Sale'} · ${esc(p.type)}</p>
            <h1 class="d-title" itemprop="name">${esc(p.name)}<br><em>${esc(p.house)}</em></h1>
            <p class="d-loc">${icon('pin')}<span itemprop="address">${esc(p.area)}</span></p>
          </div>
          <div class="d-head-actions">
            <button type="button" class="icon-btn" id="shareBtn" aria-label="Copy link to this property">${icon('share')}</button>
            <button type="button" class="fav-btn" data-fav="${p.id}" aria-pressed="${fav}" aria-label="${fav ? 'Remove' : 'Save'} ${esc(p.name)} ${fav ? 'from' : 'to'} favourites">${icon('heart')}</button>
          </div>
        </header>

        <div class="d-mobile-price">
          <div><p class="pc-label">${p.status === 'rent' ? 'Monthly rent' : 'Asking price'}</p><p class="price">${priceHTML(p)}</p></div>
          <button type="button" class="btn btn-dark" data-viewing="${p.id}">${icon('calendar')} Viewing</button>
        </div>

        <section class="gallery" aria-label="Photo gallery" aria-roledescription="carousel">
          <div class="g-main" tabindex="0" aria-label="Photo ${1} of ${gallery.length}. Use arrow keys to browse, Enter to enlarge." id="gMain">
            <img src="${gallery[0].src}" alt="${esc(gallery[0].alt)}" id="gImg" width="1400" height="1045">
            <button type="button" class="g-open" id="gOpen" aria-label="Open full-screen photo viewer"></button>
            <span class="g-count" id="gCount">${icon('expand')}<span>01 / ${String(gallery.length).padStart(2, '0')}</span></span>
            <div class="g-arrows">
              <button type="button" id="gPrev" aria-label="Previous photo">${icon('arrow-l')}</button>
              <button type="button" id="gNext" aria-label="Next photo">${icon('arrow-r')}</button>
            </div>
          </div>
          <div class="g-thumbs">${thumbs}</div>
          <div class="g-thumbs-scroll">${scrollThumbs}</div>
        </section>

        <div class="d-body">
          <div class="d-main">
            <dl class="d-facts">
              <div><dt>Bedrooms</dt><dd>${p.beds}</dd></div>
              <div><dt>Bathrooms</dt><dd>${p.baths}</dd></div>
              <div><dt>Interior · ${num.format(Math.round(p.size * 10.764))} sq ft</dt><dd>${num.format(p.size)} m²</dd></div>
              <div><dt>${p.year < 1950 ? 'Built' : 'Completed'}</dt><dd>${p.year}</dd></div>
            </dl>

            <section class="d-section d-desc" aria-labelledby="dAbout">
              <h2 id="dAbout">About the home</h2>
              <p class="d-lead" itemprop="description">${esc(p.summary)}</p>
              ${p.description.map((t) => `<p>${esc(t)}</p>`).join('')}
            </section>

            <section class="d-section" aria-labelledby="dFeat">
              <h2 id="dFeat">Key features</h2>
              <ul class="feature-list">${p.features.map((f) => `<li>${icon('check')}${esc(f)}</li>`).join('')}<li>${icon('check')}${esc(p.plot)}</li></ul>
            </section>

            <section class="d-section" aria-labelledby="dInside">
              <h2 id="dInside">Inside and out</h2>
              <div class="d-pair">
                ${pair.map((g) => `<figure><button type="button" data-lb="${gallery.indexOf(g)}" aria-label="Enlarge photo: ${esc(g.cap)}"><img src="${g.src}" alt="${esc(g.alt)}" loading="lazy" decoding="async"></button><figcaption>${esc(g.cap)}</figcaption></figure>`).join('')}
              </div>
            </section>

            <section class="d-section" aria-labelledby="dLoc">
              <h2 id="dLoc">Location</h2>
              <div class="loc-card">
                <div class="loc-map">${mapSVG(p.id)}<span class="pin">${icon('pin')}</span><span class="loc-map-label">${esc(p.coords)}</span></div>
                <div class="loc-near">
                  <h3>Travel times</h3>
                  <ul>${p.nearby.map(([a, b]) => `<li><span>${esc(a)}</span><span>${esc(b)}</span></li>`).join('')}</ul>
                  <p class="loc-note">Exact address shared with registered buyers after a first call.</p>
                </div>
              </div>
            </section>
          </div>

          <aside class="d-aside" aria-label="Price and enquiries">
            <div class="price-card">
              <p class="pc-label">${p.status === 'rent' ? 'Monthly rent' : 'Asking price'}</p>
              <p class="pc-price" itemprop="price">${priceHTML(p)}</p>
              <p class="pc-sub">${p.status === 'rent' ? 'Plus deposit · Service charges included' : 'Reference AE-' + p.id.slice(0, 3).toUpperCase() + '-' + p.year}</p>
              <button type="button" class="btn btn-gold" data-viewing="${p.id}">${icon('calendar')} Schedule a Viewing</button>
              <button type="button" class="btn btn-ghost-light" id="toEnquiry">Enquire about this home</button>
              <div class="pc-advisor">
                <span class="pc-avatar" aria-hidden="true">${adv[1]}</span>
                <div><strong>${esc(adv[0])}</strong><span>Your advisor in ${esc(loc.name)}</span></div>
              </div>
            </div>

            <form class="form enquiry" id="enquiryForm" novalidate data-api="submitEnquiry">
              <h2>Make an enquiry</h2>
              <input type="hidden" name="property" value="${esc(p.id)}">
              <div class="form-grid">
                <div class="form-row"><label for="eName">Full name</label><input id="eName" name="name" required data-min="2" autocomplete="name"><p class="err" aria-live="polite"></p></div>
                <div class="form-row"><label for="eEmail">Email</label><input id="eEmail" name="email" type="email" required autocomplete="email"><p class="err" aria-live="polite"></p></div>
                <div class="form-row"><label for="ePhone">Phone <span class="opt">(optional)</span></label><input id="ePhone" name="phone" type="tel" data-phone autocomplete="tel"><p class="err" aria-live="polite"></p></div>
                <div class="form-row"><label for="eMsg">Message</label><textarea id="eMsg" name="message" rows="4" required data-min="10">I would like more information about ${esc(p.house)} in ${esc(loc.name)}.</textarea><p class="err" aria-live="polite"></p></div>
                <div class="form-row check-row"><label class="check"><input type="checkbox" name="consent" required> <span>I agree to the <button type="button" class="link-btn" data-open="privacyModal">privacy policy</button>.</span></label><p class="err" aria-live="polite"></p></div>
              </div>
              <button type="submit" class="btn btn-dark">Send enquiry ${icon('arrow-r')}</button>
              <div class="form-success" hidden role="status"></div>
            </form>
          </aside>
        </div>
      </div>

      <section class="similar" aria-labelledby="simTitle">
        <div class="container">
          <div class="section-head">
            <div><p class="eyebrow">You may also like</p><h2 id="simTitle" class="section-title">Similar <em>properties</em></h2></div>
            <a href="#collection" class="btn btn-line">View all ${icon('arrow-r')}</a>
          </div>
          <div class="card-grid">${similar.map(cardHTML).join('')}</div>
        </div>
      </section>
    </article>`;

    $('#view-home').hidden = true;
    v.hidden = false;
    document.title = `${p.name}, ${loc.name} · ${priceText(p)} · Aurelia Estates`;
    window.scrollTo(0, 0);
    updateHeader();
    bindDetail(p);
    observeReveals(v);
    $('.d-title', v).setAttribute('tabindex', '-1');
    $('.d-title', v).focus({ preventScroll: true });
  }

  function setGallery(i) {
    gIndex = (i + gallery.length) % gallery.length;
    const img = $('#gImg');
    const g = gallery[gIndex];
    img.classList.add('swap');
    const pre = new Image();
    pre.onload = pre.onerror = () => {
      img.src = g.src; img.alt = g.alt;
      requestAnimationFrame(() => img.classList.remove('swap'));
    };
    pre.src = g.src;
    $('#gCount span').textContent = `${String(gIndex + 1).padStart(2, '0')} / ${String(gallery.length).padStart(2, '0')}`;
    $('#gMain').setAttribute('aria-label', `Photo ${gIndex + 1} of ${gallery.length}: ${g.cap}. Use arrow keys to browse, Enter to enlarge.`);
    $$('.g-thumb').forEach((t) => t.setAttribute('aria-current', String(Number(t.dataset.g) === gIndex)));
    const strip = $('.g-thumbs-scroll .g-thumb[aria-current="true"]');
    if (strip && strip.parentElement.scrollWidth > strip.parentElement.clientWidth) {
      strip.parentElement.scrollTo({ left: strip.offsetLeft - 40, behavior: 'smooth' });
    }
  }

  function bindDetail(p) {
    $('#gPrev').addEventListener('click', () => setGallery(gIndex - 1));
    $('#gNext').addEventListener('click', () => setGallery(gIndex + 1));
    $('#gOpen').addEventListener('click', () => openLightbox(gIndex));
    $('#gMain').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); setGallery(gIndex + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); setGallery(gIndex - 1); }
      if (e.key === 'Enter' && e.target.id === 'gMain') openLightbox(gIndex);
    });
    swipe($('#gMain'), (dir) => setGallery(gIndex + dir));
    $$('.g-thumb').forEach((t) => t.addEventListener('click', () => setGallery(Number(t.dataset.g))));
    setGallery(0);
    $$('[data-lb]').forEach((b) => b.addEventListener('click', () => openLightbox(Number(b.dataset.lb))));
    $('#toEnquiry').addEventListener('click', () => {
      $('#enquiryForm').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      setTimeout(() => $('#eName').focus({ preventScroll: true }), 450);
    });
    $('#shareBtn').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(location.href); toast('Link copied to clipboard'); }
      catch (e) { toast('Copy this page address from your browser bar'); }
    });
    bindForm($('#enquiryForm'));
  }

  // Viewing modal
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-viewing]');
    if (!b) return;
    const p = D.properties.find((x) => x.id === b.dataset.viewing);
    $('#viewingProperty').value = p.id;
    $('#viewingFor').textContent = `${p.house} · ${locById(p.location).name}`;
    const d = new Date(); d.setDate(d.getDate() + 1);
    $('#vDate').min = d.toISOString().slice(0, 10);
    resetFormState($('#viewingForm'));
    openLayer('viewingModal', b);
  });

  // Lightbox
  function openLightbox(i) { lbIndex = i; renderLightbox(); openLayer('lightbox'); }
  function lbStep(d) { lbIndex = (lbIndex + d + gallery.length) % gallery.length; renderLightbox(); }
  function renderLightbox() {
    const g = gallery[lbIndex];
    $('#lbImg').src = g.src; $('#lbImg').alt = g.alt;
    $('#lbCap').textContent = `${lbIndex + 1} / ${gallery.length} · ${g.cap}`;
  }
  $('.lb-nav.prev').addEventListener('click', () => lbStep(-1));
  $('.lb-nav.next').addEventListener('click', () => lbStep(1));
  $('#lightbox').addEventListener('click', (e) => { if (e.target.id === 'lightbox' || e.target.classList.contains('lb-figure')) closeLayer(); });
  swipe($('#lightbox'), (dir) => lbStep(dir));

  function swipe(el, cb) {
    let x0 = null, y0 = null;
    el.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) cb(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  /* ---------------------------------------------------------------- 9 */
  const MESSAGES = {
    name: 'Please enter your full name.',
    email: 'Please enter a valid email address, like name@example.com.',
    phone: 'Please enter a valid phone number, including the country code.',
    message: 'Please tell us a little more (at least 10 characters).',
    consent: 'Please accept the privacy policy to continue.',
    date: 'Please choose a date from tomorrow onwards.',
    slot: 'Please choose a time of day.',
    bedrooms: 'Please enter the number of bedrooms.'
  };
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function errBox(input) {
    const row = input.closest('.form-row') || input.closest('form');
    return row ? $('.err', row) : null;
  }
  function setError(input, msg) {
    const box = errBox(input);
    const group = input.type === 'radio' ? $$(`input[name="${input.name}"]`, input.form) : [input];
    group.forEach((i) => i.setAttribute('aria-invalid', msg ? 'true' : 'false'));
    if (box) {
      if (!box.id) box.id = 'err-' + Math.random().toString(36).slice(2, 8);
      box.textContent = msg || '';
      group.forEach((i) => { if (msg) i.setAttribute('aria-describedby', box.id); else i.removeAttribute('aria-describedby'); });
    }
  }
  function validateField(input) {
    const v = (input.value || '').trim();
    const name = input.name;
    let msg = '';
    if (input.type === 'checkbox') {
      if (input.required && !input.checked) msg = input.dataset.msg || MESSAGES.consent;
    } else if (input.type === 'radio') {
      if (input.required && !$(`input[name="${name}"]:checked`, input.form)) msg = MESSAGES.slot;
    } else if (input.required && !v) {
      msg = MESSAGES[name] || (input.tagName === 'SELECT' ? 'Please choose an option.' : 'This field is required.');
    } else if (v) {
      if (input.type === 'email' && !EMAIL_RE.test(v)) msg = MESSAGES.email;
      else if (input.dataset.min && v.length < Number(input.dataset.min)) msg = MESSAGES[name] || `Please enter at least ${input.dataset.min} characters.`;
      else if (input.hasAttribute('data-phone') && (!/^[+()\d\s.-]+$/.test(v) || v.replace(/\D/g, '').length < 7)) msg = MESSAGES.phone;
      else if (input.type === 'number' && (Number(v) < Number(input.min || -Infinity) || Number(v) > Number(input.max || Infinity))) msg = `Please enter a number between ${input.min} and ${input.max}.`;
      else if (input.hasAttribute('data-future')) {
        const chosen = new Date(v + 'T12:00:00');
        const tomorrow = new Date(); tomorrow.setHours(0, 0, 0, 0); tomorrow.setDate(tomorrow.getDate() + 1);
        const limit = new Date(); limit.setFullYear(limit.getFullYear() + 1);
        if (isNaN(chosen) || chosen < tomorrow) msg = MESSAGES.date;
        else if (chosen > limit) msg = 'Please choose a date within the next twelve months.';
      }
    }
    setError(input, msg);
    return !msg;
  }
  function resetFormState(form) {
    form.reset();
    form.dataset.tried = '';
    $$('[aria-invalid]', form).forEach((i) => setError(i, ''));
    $('.form-success', form).hidden = true;
  }

  const SUCCESS = {
    sendContact: (d) => [`Thank you, ${d.name.split(' ')[0]}.`, 'An advisor will reply within one working day.'],
    submitEnquiry: (d) => [`Thank you, ${d.name.split(' ')[0]}.`, 'Your enquiry is with the listing advisor, who will be in touch shortly.'],
    requestViewing: (d) => ['Viewing requested.', `We will confirm your ${d.slot.toLowerCase()} slot on ${new Date(d.date + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} by email.`],
    requestValuation: (d) => [`Thank you, ${d.name.split(' ')[0]}.`, `Our ${d.location} team will call you to arrange a private valuation.`],
    subscribe: () => ['You are on the list.', 'The next letter arrives on the first Sunday of the month.'],
    registerInterest: (d) => ['Brochure on its way.', `We will send the ${d.development} brochure and floor plans.`]
  };

  function bindForm(form) {
    if (!form || form.dataset.bound) return;
    form.dataset.bound = '1';
    const fields = () => $$('input:not([type="hidden"]), select, textarea', form);
    form.addEventListener('blur', (e) => {
      if (form.dataset.tried && e.target.matches('input, select, textarea')) validateField(e.target);
    }, true);
    form.addEventListener('input', (e) => {
      if (e.target.getAttribute('aria-invalid') === 'true') validateField(e.target);
    });
    form.addEventListener('change', (e) => {
      if (e.target.getAttribute('aria-invalid') === 'true' || e.target.type === 'radio') validateField(e.target);
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      form.dataset.tried = '1';
      const seen = new Set();
      let ok = true, firstBad = null;
      fields().forEach((f) => {
        if (f.type === 'radio') { if (seen.has(f.name)) return; seen.add(f.name); }
        if (!validateField(f)) { ok = false; firstBad = firstBad || f; }
      });
      if (!ok) { firstBad.focus(); return; }
      const data = Object.fromEntries(new FormData(form).entries());
      const btn = $('button[type="submit"]', form);
      btn.classList.add('is-loading'); btn.disabled = true;
      try {
        const res = await API[form.dataset.api](data);
        const [title, body] = SUCCESS[form.dataset.api](data);
        const box = $('.form-success', form);
        box.innerHTML = `<strong>${esc(title)}</strong>${esc(body)}<small>Reference ${esc(res.reference)}. Demo mode: this form is not connected to a server, so nothing was sent.</small>`;
        box.hidden = false;
        form.reset();
        form.dataset.tried = '';
        box.focus && box.setAttribute('tabindex', '-1');
        box.focus({ preventScroll: true });
      } catch (err) {
        toast('Something went wrong. Please try again.');
      } finally {
        btn.classList.remove('is-loading'); btn.disabled = false;
      }
    });
  }

  /* ---------------------------------------------------------------- 10 */
  function boot() {
    $('#year').textContent = new Date().getFullYear();
    fillPriceOptions();
    renderCollection();
    renderLocations();
    renderDevelopments();
    renderTestimonials();
    renderOffices();
    updateFavCount(false);
    $$('form[data-api]').forEach(bindForm);
    $$('.hero .reveal').forEach((el, i) => el.style.setProperty('--d', i));
    observeReveals();
    // Reset modal forms each time they open
    $$('[data-open="sellModal"]').forEach((b) => b.addEventListener('click', () => resetFormState($('#sellForm'))));
    $$('[data-open="devModal"]').forEach((b) => b.addEventListener('click', () => resetFormState($('#devForm'))));
    window.addEventListener('hashchange', route);
    if (location.hash) route();
    updateHeader();
  }
  boot();
})();
