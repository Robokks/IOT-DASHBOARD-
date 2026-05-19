'use strict';
const config = require('../config');

// LabVIEW requires "+" characters in tokens to be replaced with "12fgh" in URLs
function encodeToken(token) {
  return token.replace(/\+/g, '12fgh');
}

function buildUrl(path, params) {
  const url = new URL(config.labviewBaseUrl + path);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }
  return url.toString();
}

async function labviewGet(path, params, timeoutMs = 3000) {
  const url = buildUrl(path, params);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`LabVIEW returned HTTP ${res.status} for ${path}`);
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function labviewPost(path, body, token, timeoutMs = 3000) {
  const url = buildUrl(path, { token: encodeToken(token) });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`LabVIEW returned HTTP ${res.status} for ${path}`);
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { labviewGet, labviewPost, encodeToken };
