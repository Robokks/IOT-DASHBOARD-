'use strict';
import { requireAuth, encodeToken, initSidebar, applyStatusClass, escHtml } from './ui.js';

const token = requireAuth();
if (token) {
  initSidebar();
  startPolling();
}

// ── DOM update ─────────────────────────────────────────────────────────────
function set(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val ?? '—';
}

function updateStation(s) {
  const badge = document.getElementById('status' + s.id);
  if (badge) {
    badge.textContent = s.status || 'IDLE';
    applyStatusClass(badge, s.status);
  }
  set('speed'      + s.id, s.speed      != null ? s.speed      + ' rpm' : null);
  set('torque'     + s.id, s.torque     != null ? s.torque     + ' Nm'  : null);
  set('voltage'    + s.id, s.voltage    != null ? s.voltage    + ' V'   : null);
  set('current'    + s.id, s.current    != null ? s.current    + ' A'   : null);
  set('no_cycle'   + s.id, s.no_cycle);
  set('part_count' + s.id, s.part_count);
  set('cycletime'  + s.id, s.cycle_time);
  set('runsts'     + s.id, s.run_sts);
  set('model'      + s.id, s.model_no);
  set('serial'     + s.id, s.serial_no);
}

// ── 500ms polling — same cadence as the original system ──────────────────
function startPolling() {
  poll(); // immediate first fetch
  setInterval(poll, 500);
}

async function poll() {
  try {
    const res = await fetch(`/dashboard/update?live=1&token=${encodeToken(token)}`);
    if (res.status === 401 || res.status === 403) {
      sessionStorage.clear();
      window.location.href = '/login.html';
      return;
    }
    const data = await res.json();

    // LabVIEW returns per-station arrays; convert to objects
    const count = (data.status || []).length;
    for (let i = 0; i < count; i++) {
      updateStation({
        id:         i + 1,
        status:     data.status?.[i]     ?? '',
        speed:      data.speed?.[i]      ?? 0,
        torque:     data.torque?.[i]     ?? 0,
        voltage:    data.voltage?.[i]    ?? 0,
        current:    data.current?.[i]    ?? 0,
        no_cycle:   data.no_cycle?.[i]   ?? 0,
        part_count: data.part_count?.[i] ?? 0,
        cycle_time: data.cycle_time?.[i] ?? '',
        run_sts:    data.run_sts?.[i]    ?? '',
        model_no:   data.model_no?.[i]   ?? '',
        serial_no:  data.serial_no?.[i]  ?? '',
      });
    }

    const noUserEl = document.getElementById('no-users');
    if (noUserEl && data['key_5'] != null) noUserEl.textContent = data['key_5'];

  } catch (err) {
    console.warn('[live] Poll failed:', err.message);
  }
}

// ── Station start/stop buttons ─────────────────────────────────────────────
document.querySelectorAll('[data-station-cmd]').forEach(btn => {
  btn.addEventListener('click', () => {
    const station = btn.dataset.stationCmd;
    const cmd     = btn.dataset.cmd;
    sendStationCmd(station, cmd);
  });
});

// ── Start modal (FRESH / CONTINUE) ─────────────────────────────────────────
const modal = document.getElementById('start-modal');
if (modal) {
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.dataset.station = btn.dataset.openModal;
      modal.classList.add('open');
    });
  });

  const cancelBtn = document.getElementById('modal-cancel');
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.remove('open'));

  modal.querySelectorAll('[data-modal-cmd]').forEach(btn => {
    btn.addEventListener('click', () => {
      sendStationCmd(modal.dataset.station, btn.dataset.modalCmd);
      modal.classList.remove('open');
    });
  });

  modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
}

async function sendStationCmd(station, cmd) {
  try {
    await fetch(`/dashboard/update?stat${station}=${cmd}&token=${encodeToken(token)}`);
  } catch (err) {
    console.warn('[live] Command failed:', err.message);
  }
}
