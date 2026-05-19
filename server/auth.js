'use strict';
const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('./config');
const { labviewGet, encodeToken } = require('./middleware/labview-client');

const router = express.Router();

// In-memory rate limiter: track failed login attempts per IP
const failedAttempts = new Map();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip) {
  const entry = failedAttempts.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.ts > WINDOW_MS) {
    failedAttempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(ip) {
  const entry = failedAttempts.get(ip) || { count: 0, ts: Date.now() };
  entry.count++;
  failedAttempts.set(ip, entry);
}

function clearFailures(ip) {
  failedAttempts.delete(ip);
}

// AES-256-CTR encryption matching the legacy LabVIEW authentication scheme.
// LabVIEW expects credentials encrypted with AES-256-CTR using a 32-byte key
// derived from the provided keyString (padded/truncated to 32 bytes).
function aesEncrypt(text, keyString) {
  const key = Buffer.alloc(32);
  const keyBuf = Buffer.from(keyString, 'utf8');
  keyBuf.copy(key, 0, 0, Math.min(keyBuf.length, 32));
  // IV of 16 zero bytes matches the legacy AES-CTR implementation
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
  return Buffer.concat([cipher.update(Buffer.from(text, 'utf8')), cipher.final()]).toString('base64');
}

function aesDecrypt(base64Text, keyString) {
  const key = Buffer.alloc(32);
  const keyBuf = Buffer.from(keyString, 'utf8');
  keyBuf.copy(key, 0, 0, Math.min(keyBuf.length, 32));
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
  const buf = Buffer.from(base64Text, 'base64');
  return Buffer.concat([decipher.update(buf), decipher.final()]).toString('utf8');
}

// POST /api/auth  — login with username + password
router.post('/auth', async (req, res) => {
  const ip = req.ip;

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many failed attempts. Try again later.' });
  }

  const { user, password } = req.body;
  if (!user || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    // Encrypt credentials the same way the legacy browser code did, now server-side
    const randKey = crypto.randomBytes(16).toString('base64').slice(0, 16);
    const encUser = aesEncrypt(user, password);
    const encPass = aesEncrypt(password, randKey);

    const data = await labviewGet('/login/userdt', {
      user: encUser,
      pas: encPass,
      unky: encodeToken(randKey),
      id: password,
      vi: 'drtcf',
    });

    // LabVIEW returns encrypted blobs; validate by decrypting and cross-checking
    if (!data || !data['edrtgdwhjgjg']) {
      recordFailure(ip);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const decVal1 = aesDecrypt(data['edrtgdwhjgjg'], password);
    const decVal2 = data['fgdgdhjgjgjh'] ? aesDecrypt(data['fgdgdhjgjgjh'], password) : null;
    const labviewToken = data['jhfhjfhgfghfgc'] || data['token'] || decVal2;

    if (!labviewToken || decVal1 !== user) {
      recordFailure(ip);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    clearFailures(ip);

    // Determine access level from LabVIEW response (key_2 or similar)
    const accessLevel = data['key_2'] === 'admin' ? 'admin' : 'operator';

    const token = jwt.sign(
      { labviewToken, user, accessLevel },
      config.jwtSecret,
      { expiresIn: `${config.sessionHours}h` }
    );

    res.cookie('session', token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: config.sessionHours * 3600 * 1000,
    });

    return res.json({ ok: true, user, accessLevel });
  } catch (err) {
    console.error('[auth] Login error:', err.message);
    return res.status(502).json({ error: 'Could not reach LabVIEW server.' });
  }
});

// GET /api/me  — return session info (used by frontend auth guard)
router.get('/me', require('./middleware/jwt-verify'), (req, res) => {
  res.json({ user: req.session.user, accessLevel: req.session.accessLevel });
});

// GET /api/logout
router.get('/logout', (req, res) => {
  res.clearCookie('session');
  res.redirect('/login.html');
});

module.exports = router;
