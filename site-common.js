/* ============================================================
   site-common.js — Shared navbar + footer + helpers.
   You should NOT need to edit this file.
   Change wording in the Settings/ folder instead.
   ============================================================ */
(() => {
  /* --- Page reveal: body stays hidden until content is ready --- */
  let _loadFired = false, _contentReady = false;
  window.addEventListener('load', () => { _loadFired = true; _tryReveal(); });
  function _tryReveal() { if (_loadFired && _contentReady) requestAnimationFrame(() => document.body.classList.add('loaded')); }
  window.pageReady = () => { _contentReady = true; _tryReveal(); };
  setTimeout(() => { _contentReady = true; _tryReveal(); }, 4000);

  /* --- Font Awesome icons (injected) --- */
  const fa = document.createElement('link');
  fa.rel = 'stylesheet';
  fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
  fa.crossOrigin = 'anonymous';
  fa.referrerPolicy = 'no-referrer';
  document.head.appendChild(fa);

  /* ---------- Helpers (global) ---------- */
  window.parseSettings = (text) => {
    const d = {};
    for (const line of text.split('\n')) {
      const t = line.trim();
      if (!t || t.charCodeAt(0) === 35 /* # */ || t.charCodeAt(0) === 61 /* = */) continue;
      const i = t.indexOf(':');
      if (i === -1) continue;
      const k = t.substring(0, i).trim().toUpperCase(), v = t.substring(i + 1).trim();
      if (k) d[k] = v;
    }
    return d;
  };
  window.fetchSettings = (path) =>
    fetch(path).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); }).then(parseSettings);
  window.fetchText = (path) =>
    fetch(path).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); });

  /** Parse "record" files: blocks separated by a blank line, each a set of KEY: VALUE lines. */
  window.parseRecords = (text) => {
    const records = []; let cur = null;
    for (const rawLine of text.split('\n')) {
      const t = rawLine.trim();
      if (!t || t.charCodeAt(0) === 35 || t.charCodeAt(0) === 61) {
        if (t === '' && cur && Object.keys(cur).length) { records.push(cur); cur = null; }
        continue;
      }
      const i = t.indexOf(':'); if (i === -1) continue;
      const k = t.substring(0, i).trim().toUpperCase(), v = t.substring(i + 1).trim();
      if (!k) continue;
      if (!cur) cur = {};
      if (cur[k] !== undefined) { if (!Array.isArray(cur[k])) cur[k] = [cur[k]]; cur[k].push(v); }
      else cur[k] = v;
    }
    if (cur && Object.keys(cur).length) records.push(cur);
    return records;
  };
  window.asArray = (v) => v === undefined ? [] : (Array.isArray(v) ? v : [v]);
  window.esc = (s) => (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  /** Bind a FormSubmit.co form to show a success message on submit. */
  window.handleFormSubmit = (formId, successId) => {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const original = btn ? btn.textContent : 'Submit';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending\u2026'; }
      const restore = () => { if (btn) { btn.disabled = false; btn.textContent = original; } };
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: controller.signal })
        .then(r => {
          if (r.ok) { form.style.display = 'none'; document.getElementById(successId).style.display = 'block'; form.reset(); }
          else { alert('Something went wrong. Please try again or call us.'); restore(); }
        })
        .catch(err => {
          alert(err && err.name === 'AbortError'
            ? 'The request timed out. Please try again in a moment, or call us.'
            : 'Network error. Please try again or call us.');
          restore();
        })
        .finally(() => clearTimeout(timer));
    });
  };

  /* --- Scroll reveal --- */
  window.initReveal = () => {
    const els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('is-visible')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  };

  /* ============================================================
     NAVBAR
     ============================================================ */
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const nav = document.createElement('nav');
  nav.className = 'navbar'; nav.id = 'navbar';
  nav.innerHTML =
    '<a href="index.html" class="navbar__logo">' +
      '<img class="navbar__logo-img" id="navLogo" src="Photos/LogoClear.png" alt="AZ Desert Security Services" />' +
      '<span class="navbar__name" id="navName">SecureView</span>' +
    '</a>' +
    '<ul class="navbar__links" id="navLinks">' +
      '<li><a href="index.html" data-page="index.html">Home</a></li>' +
      '<li><a href="services.html" data-page="services.html">Services</a></li>' +
      '<li><a href="contact.html" class="navbar__cta" data-page="contact.html">Free Estimate</a></li>' +
    '</ul>' +
    '<button class="hamburger" id="hamburger" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span><span></span></button>';
  document.body.prepend(nav);
  nav.querySelectorAll('[data-page]').forEach(a => { if (a.getAttribute('data-page') === page) a.classList.add('is-active'); });

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', e => {
    if (e.target.tagName === 'A') { hamburger.classList.remove('open'); navLinks.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
  });

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (scrollTicking) return; scrollTicking = true;
    requestAnimationFrame(() => { nav.classList.toggle('scrolled', window.scrollY > 40); scrollTicking = false; });
  }, { passive: true });

  /* ============================================================
     FOOTER
     ============================================================ */
  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML =
    '<div class="footer__inner">' +
      '<div class="footer__brand">' +
        '<img class="footer__logo-img" id="footLogo" src="Photos/LogoClear.png" alt="AZ Desert Security Services" />' +
        '<p class="footer__tagline" id="footerTagline">Security Cameras &amp; Alarms</p>' +
      '</div>' +
      '<div class="footer__cols">' +
        '<div class="footer__col">' +
          '<h4>Explore</h4>' +
          '<a href="index.html">Home</a>' +
          '<a href="services.html">Services</a>' +
          '<a href="contact.html">Free Estimate</a>' +
        '</div>' +
        '<div class="footer__col">' +
          '<h4>Services</h4>' +
          '<a href="services.html#cameras">Security Cameras</a>' +
          '<a href="services.html#alarms">Security Alarms</a>' +
          '<a href="services.html#other">Other Services</a>' +
        '</div>' +
        '<div class="footer__col footer__col--contact">' +
          '<h4>Contact</h4>' +
          '<a href="#" id="footPhone" data-key="PHONE">Call Us</a>' +
          '<a href="#" id="footEmail" data-key="EMAIL">Email Us</a>' +
          '<div class="footer__icons" id="footerIcons" style="display:none">' +
            '<a href="#" aria-label="Facebook" data-social="FACEBOOK"><i class="fa-brands fa-facebook-f"></i></a>' +
            '<a href="#" aria-label="Instagram" data-social="INSTAGRAM"><i class="fa-brands fa-instagram"></i></a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="footer__bar"><p class="footer__text" id="footerText">© 2026 SecureView — All Rights Reserved.</p></div>';
  document.body.appendChild(footer);

  /* Load brand + contact + social from Settings/site.txt */
  fetch('Settings/site.txt')
    .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(text => {
      const d = parseSettings(text);
      const setText = (id, v) => { const el = document.getElementById(id); if (el && v) el.textContent = v; };
      if (d['SITE NAME']) { setText('navName', d['SITE NAME']); const nl = document.getElementById('navLogo'); const fl = document.getElementById('footLogo'); if (nl) nl.alt = d['SITE NAME']; if (fl) fl.alt = d['SITE NAME']; }
      if (d['TAGLINE']) setText('footerTagline', d['TAGLINE']);
      if (d['FOOTER']) setText('footerText', d['FOOTER']);

      const phone = document.getElementById('footPhone');
      if (d['PHONE'] && d['PHONE'] !== '#') { phone.textContent = 'Call ' + d['PHONE']; phone.href = 'tel:' + d['PHONE'].replace(/[^0-9+]/g, ''); }
      else phone.remove();

      const email = document.getElementById('footEmail');
      if (d['EMAIL'] && d['EMAIL'] !== '#') { email.textContent = d['EMAIL']; email.href = (d['EMAIL'].indexOf('@') !== -1 ? 'mailto:' : '') + d['EMAIL']; }
      else email.remove();

      const icons = document.getElementById('footerIcons');
      icons.querySelectorAll('[data-social]').forEach(el => {
        const val = d[el.getAttribute('data-social')];
        (val && val !== '#') ? el.href = val : el.remove();
      });
      icons.style.display = '';
    })
    .catch(() => { const ic = document.getElementById('footerIcons'); if (ic) ic.style.display = ''; });

  if (document.readyState !== 'loading') initReveal();
  else document.addEventListener('DOMContentLoaded', initReveal);
})();
