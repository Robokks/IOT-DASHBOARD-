'use strict';

// ── Token helpers ──────────────────────────────────────────────────────────
// LabVIEW requires "+" in tokens to be replaced with "12fgh" in query strings
export function encodeToken(token) {
  return token.replace(/\+/g, '12fgh');
}

export function getToken() {
  return sessionStorage.getItem('labviewToken');
}

export function getUser() {
  return sessionStorage.getItem('labviewUser') || '';
}

// ── Auth guard ─────────────────────────────────────────────────────────────
// Call at the top of every protected page. Returns token or redirects.
export function requireAuth() {
  const token = getToken();
  if (!token) {
    window.location.href = '/login.html';
    return null;
  }
  return token;
}

// ── Status badge CSS class ─────────────────────────────────────────────────
export function statusClass(status) {
  if (!status) return 'idle';
  const s = status.toUpperCase();
  if (s.includes('AUTO'))                    return 'auto';
  if (s.includes('MAN'))                     return 'man';
  if (s.includes('ERROR') || s.includes('FAULT')) return 'error';
  if (s.includes('DONE') || s.includes('STOPPED')) return 'done';
  return 'idle';
}

export function applyStatusClass(el, status) {
  el.classList.remove('auto', 'man', 'error', 'done', 'idle');
  el.classList.add(statusClass(status));
}

// ── Sidebar ────────────────────────────────────────────────────────────────
export function initSidebar() {
  const userEl = document.getElementById('sb-username');
  if (userEl) userEl.textContent = getUser();

  // Mark active nav link based on current filename
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sb-nav a[data-page]').forEach(a => {
    if (a.dataset.page === page) a.classList.add('active');
  });
}

export function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
