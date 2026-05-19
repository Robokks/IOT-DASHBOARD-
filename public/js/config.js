'use strict';
import { requireAuth, encodeToken, initSidebar } from './ui.js';

const token = requireAuth();
if (token) {
  initSidebar();
  loadConfig();

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    });
  });

  const saveBtn = document.getElementById('save-config');
  if (saveBtn) saveBtn.addEventListener('click', saveConfig);
}

// ── Fields matching the LabVIEW /selection/import response ─────────────────
const FIELDS = [
  'status', 'high_set_v', 'low_set_v',
  'high_speed_cycle', 'low_speed_cycle',
  'high_speed_load',  'low_speed_load',
  'high_on_time',     'low_on_time',
  'high_off_time',    'low_off_time',
  'pause_time',       'set_counts',
];

async function loadConfig() {
  try {
    const res = await fetch(`/selection/import?import=1&token=${encodeToken(token)}`);
    if (!res.ok) { showStatus('Failed to load configuration from LabVIEW.', true); return; }
    const data = await res.json();
    FIELDS.forEach(field => {
      for (let i = 1; i <= 5; i++) {
        const val = data[field]?.[i - 1];
        const el  = document.getElementById(`s${i}_${field}`);
        if (el && val != null) el.value = val;
      }
    });
  } catch {
    showStatus('Cannot reach LabVIEW server.', true);
  }
}

async function saveConfig() {
  const saveBtn = document.getElementById('save-config');
  saveBtn.disabled = true;
  showStatus('Saving…', false);

  const body = {};
  FIELDS.forEach(field => {
    body[field] = [];
    for (let i = 1; i <= 5; i++) {
      const el = document.getElementById(`s${i}_${field}`);
      body[field].push(el ? el.value : '');
    }
  });

  try {
    const res = await fetch(`/selection/master?token=${encodeToken(token)}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    if (res.ok) {
      showStatus('Configuration saved.', false);
    } else {
      showStatus('Save failed (LabVIEW returned ' + res.status + ').', true);
    }
  } catch {
    showStatus('Cannot reach LabVIEW server.', true);
  } finally {
    saveBtn.disabled = false;
  }
}

function showStatus(msg, isError) {
  const el = document.getElementById('save-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = isError ? 'var(--status-error)' : 'var(--status-auto)';
}
