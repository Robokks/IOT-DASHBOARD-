'use strict';
import { requireAuth, markActiveNav, applyStatusClass, renderUser, escHtml } from './ui.js';

const wsStatusEl = document.getElementById('ws-status');
const noUsersEl = document.getElementById('no-users');

let reconnectDelay = 1000;
let ws;

async function init() {
  const session = await requireAuth();
  if (!session) return;
  renderUser(session);
  markActiveNav();
  connect();
}

function connect() {
  setWsStatus('connecting');
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  ws = new WebSocket(`${proto}://${location.host}/ws`);

  ws.onopen = () => {
    setWsStatus('connected');
    reconnectDelay = 1000;
  };

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.type === 'update') {
      msg.stations.forEach(updateStation);
      if (noUsersEl && msg.noUsers != null) {
        noUsersEl.textContent = msg.noUsers;
      }
    } else if (msg.type === 'error') {
      setWsStatus('disconnected');
    }
  };

  ws.onclose = () => {
    setWsStatus('disconnected');
    setTimeout(connect, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, 30000);
  };

  ws.onerror = () => ws.close();
}

function setWsStatus(state) {
  if (!wsStatusEl) return;
  wsStatusEl.className = `ws-status ${state}`;
  wsStatusEl.textContent = { connected: 'Live', connecting: 'Connecting…', disconnected: 'Reconnecting…' }[state] || state;
}

function updateStation(s) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val ?? '—';
  };

  const badge = document.getElementById(`status${s.id}`);
  if (badge) {
    badge.textContent = s.status || 'IDLE';
    applyStatusClass(badge, s.status);
  }

  set(`speed${s.id}`, s.speed != null ? `${s.speed} rpm` : null);
  set(`torque${s.id}`, s.torque != null ? `${s.torque} Nm` : null);
  set(`voltage${s.id}`, s.voltage != null ? `${s.voltage} V` : null);
  set(`current${s.id}`, s.current != null ? `${s.current} A` : null);
  set(`no_cycle${s.id}`, s.no_cycle);
  set(`part_count${s.id}`, s.part_count);
  set(`cycletime${s.id}`, s.cycle_time);
  set(`runsts${s.id}`, s.run_sts);
  set(`model${s.id}`, s.model_no);
  set(`serial${s.id}`, s.serial_no);
}

// Station start/stop command buttons
document.querySelectorAll('[data-station-cmd]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    const station = parseInt(btn.dataset.stationCmd, 10);
    const cmd = parseInt(btn.dataset.cmd, 10);
    ws.send(JSON.stringify({ type: 'station_cmd', station, cmd }));
  });
});

// FRESH/CONTINUE modal
const modal = document.getElementById('start-modal');
if (modal) {
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.dataset.station = btn.dataset.openModal;
      modal.classList.add('open');
    });
  });
  modal.querySelectorAll('[data-modal-cmd]').forEach(btn => {
    btn.addEventListener('click', () => {
      const station = parseInt(modal.dataset.station, 10);
      const cmd = parseInt(btn.dataset.modalCmd, 10);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'station_cmd', station, cmd }));
      }
      modal.classList.remove('open');
    });
  });
  const cancelBtn = document.getElementById('modal-cancel');
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.remove('open'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
}

init();
