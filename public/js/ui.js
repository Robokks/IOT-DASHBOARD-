'use strict';

// Auth guard: fetch /api/me; redirect to login if 401
export async function requireAuth() {
  try {
    const res = await fetch('/api/me');
    if (res.status === 401) {
      window.location.href = '/login.html';
      return null;
    }
    return res.json();
  } catch {
    window.location.href = '/login.html';
    return null;
  }
}

// Set sidebar active link based on current page
export function markActiveNav() {
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// Apply status color class to an element
export function applyStatusClass(el, status) {
  el.classList.remove('auto', 'manual', 'error', 'idle');
  if (!status) { el.classList.add('idle'); return; }
  const s = status.toUpperCase();
  if (s.includes('AUTO'))   el.classList.add('auto');
  else if (s.includes('MAN')) el.classList.add('manual');
  else if (s.includes('ERROR') || s.includes('ERR')) el.classList.add('error');
  else el.classList.add('idle');
}

// Populate sidebar user display
export function renderUser(session) {
  const el = document.getElementById('sidebar-user');
  if (el && session) {
    el.innerHTML = `<strong>${escHtml(session.user)}</strong><span>${escHtml(session.accessLevel)}</span>`;
  }
  // Hide admin-only elements for operators
  if (session && session.accessLevel !== 'admin') {
    document.querySelectorAll('.admin-only').forEach(e => e.remove());
  }
}

export function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
