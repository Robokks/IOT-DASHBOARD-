'use strict';
import { requireAuth, markActiveNav, renderUser } from './ui.js';

const saveBtn = document.getElementById('save-config');
const saveStatus = document.getElementById('save-status');

async function init() {
  const session = await requireAuth();
  if (!session) return;
  renderUser(session);
  markActiveNav();
  await loadConfig();

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });

  if (saveBtn) {
    saveBtn.addEventListener('click', saveConfig);
  }
}

async function loadConfig() {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) { showStatus('Failed to load configuration.', true); return; }
    const data = await res.json();
    populateForm(data);
  } catch {
    showStatus('Cannot reach server.', true);
  }
}

function populateForm(data) {
  // data contains arrays indexed by station (0-based)
  for (let i = 1; i <= 5; i++) {
    const idx = i - 1;
    setField(`s${i}_status`, data.status?.[idx]);
    setField(`s${i}_high_set_v`, data.high_set_v?.[idx]);
    setField(`s${i}_low_set_v`, data.low_set_v?.[idx]);
    setField(`s${i}_high_speed_cycle`, data.high_speed_cycle?.[idx]);
    setField(`s${i}_low_speed_cycle`, data.low_speed_cycle?.[idx]);
    setField(`s${i}_high_speed_load`, data.high_speed_load?.[idx]);
    setField(`s${i}_low_speed_load`, data.low_speed_load?.[idx]);
    setField(`s${i}_high_on_time`, data.high_on_time?.[idx]);
    setField(`s${i}_low_on_time`, data.low_on_time?.[idx]);
    setField(`s${i}_high_off_time`, data.high_off_time?.[idx]);
    setField(`s${i}_low_off_time`, data.low_off_time?.[idx]);
    setField(`s${i}_pause_time`, data.pause_time?.[idx]);
    setField(`s${i}_set_counts`, data.set_counts?.[idx]);
  }
}

function collectForm() {
  const fields = ['status','high_set_v','low_set_v','high_speed_cycle','low_speed_cycle',
    'high_speed_load','low_speed_load','high_on_time','low_on_time',
    'high_off_time','low_off_time','pause_time','set_counts'];
  const body = {};
  for (const f of fields) {
    body[f] = [];
    for (let i = 1; i <= 5; i++) {
      const el = document.getElementById(`s${i}_${f}`);
      body[f].push(el ? el.value : '');
    }
  }
  return body;
}

async function saveConfig() {
  saveBtn.disabled = true;
  showStatus('Saving…', false);
  try {
    const res = await fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(collectForm()),
    });
    if (!res.ok) {
      const d = await res.json();
      showStatus(d.error || 'Save failed.', true);
    } else {
      showStatus('Configuration saved.', false);
    }
  } catch {
    showStatus('Cannot reach server.', true);
  } finally {
    saveBtn.disabled = false;
  }
}

function setField(id, val) {
  const el = document.getElementById(id);
  if (el && val != null) el.value = val;
}

function showStatus(msg, isError) {
  if (!saveStatus) return;
  saveStatus.textContent = msg;
  saveStatus.style.color = isError ? 'var(--status-error)' : 'var(--status-auto)';
}

init();
