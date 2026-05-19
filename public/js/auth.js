'use strict';
// Login page script — no external libraries.
// AES-256-CTR encryption is done with the browser's built-in Web Crypto API.

// ── AES-256-CTR via Web Crypto API ────────────────────────────────────────
// Matches the legacy AES1.js behaviour: 32-byte key (zero-padded), 16-byte
// all-zero IV, output is base64.

async function makeCryptoKey(keyString, usage) {
  const raw = new Uint8Array(32);
  const src = new TextEncoder().encode(keyString);
  raw.set(src.subarray(0, Math.min(src.length, 32)));
  return crypto.subtle.importKey('raw', raw, { name: 'AES-CTR' }, false, [usage]);
}

async function aesEncrypt(plaintext, keyString) {
  const key = await makeCryptoKey(keyString, 'encrypt');
  const counter = new Uint8Array(16); // all zeros
  const buf = await crypto.subtle.encrypt(
    { name: 'AES-CTR', counter, length: 128 },
    key,
    new TextEncoder().encode(plaintext)
  );
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

async function aesDecrypt(base64, keyString) {
  const key = await makeCryptoKey(keyString, 'decrypt');
  const counter = new Uint8Array(16);
  const buf = await crypto.subtle.decrypt(
    { name: 'AES-CTR', counter, length: 128 },
    key,
    Uint8Array.from(atob(base64), c => c.charCodeAt(0))
  );
  return new TextDecoder().decode(buf);
}

// LabVIEW token URL encoding (+ must become 12fgh)
function encodeToken(t) { return t.replace(/\+/g, '12fgh'); }

// ── UI wiring ──────────────────────────────────────────────────────────────
const form      = document.getElementById('login-form');
const errorEl   = document.getElementById('login-error');
const submitBtn = document.getElementById('login-submit');

// Skip login if already authenticated
if (sessionStorage.getItem('labviewToken')) {
  window.location.href = '/index.html';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Signing in…';

  const user     = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  try {
    // Generate random 16-char key for this login attempt
    const randKey = Array.from(crypto.getRandomValues(new Uint8Array(12)))
      .map(b => b.toString(36)).join('').slice(0, 16);

    const encUser = await aesEncrypt(user, password);
    const encPass = await aesEncrypt(password, randKey);

    const params = new URLSearchParams({
      user:  encUser,
      pas:   encPass,
      unky:  encodeToken(randKey),
      id:    password,
      vi:    'drtcf',
    });

    const res = await fetch('/login/userdt?' + params.toString());
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    // Validate: decrypt LabVIEW's response blob and confirm username matches
    const decVal1 = data['edrtgdwhjgjg']
      ? await aesDecrypt(data['edrtgdwhjgjg'], password)
      : null;

    if (decVal1 !== user) {
      errorEl.textContent = 'Invalid username or password.';
      return;
    }

    // Extract the session token (LabVIEW sends it in one of these fields)
    const token = data['jhfhjfhgfghfgc'] || data['fgdgdhjgjgjh'] || data['token'];
    if (!token) {
      errorEl.textContent = 'Server did not return a session token.';
      return;
    }

    sessionStorage.setItem('labviewToken', token);
    sessionStorage.setItem('labviewUser',  user);
    window.location.href = '/index.html';

  } catch (err) {
    errorEl.textContent = 'Cannot reach LabVIEW server. Check connection.';
    console.error('[auth]', err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Sign In';
  }
});
