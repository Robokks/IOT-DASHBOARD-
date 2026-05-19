'use strict';
const jwt = require('jsonwebtoken');
const config = require('./config');
const { labviewGet, encodeToken } = require('./middleware/labview-client');

const POLL_INTERVAL_MS = 500;

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  for (const part of cookieHeader.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k) cookies[k.trim()] = decodeURIComponent(v.join('='));
  }
  return cookies;
}

function normalizeStation(data, index) {
  const i = index + 1; // LabVIEW uses 1-based station keys
  return {
    id: i,
    status: (data['status'] && data['status'][index]) ?? '',
    speed: (data['speed'] && data['speed'][index]) ?? 0,
    torque: (data['torque'] && data['torque'][index]) ?? 0,
    voltage: (data['voltage'] && data['voltage'][index]) ?? 0,
    current: (data['current'] && data['current'][index]) ?? 0,
    no_cycle: (data['no_cycle'] && data['no_cycle'][index]) ?? 0,
    part_count: (data['part_count'] && data['part_count'][index]) ?? 0,
    cycle_time: (data['cycle_time'] && data['cycle_time'][index]) ?? '00:00:00',
    run_sts: (data['run_sts'] && data['run_sts'][index]) ?? '',
    model_no: (data['model_no'] && data['model_no'][index]) ?? '',
    serial_no: (data['serial_no'] && data['serial_no'][index]) ?? '',
    seq_on: (data['seq_on'] && data['seq_on'][index]) ?? '0',
  };
}

function handleUpgrade(wss, req, socket, head) {
  const cookies = parseCookies(req.headers.cookie);
  let session;
  try {
    session = jwt.verify(cookies.session, config.jwtSecret);
  } catch {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, session);
  });
}

function attach(wss) {
  wss.on('connection', (ws, session) => {
    let pendingCmds = {}; // station_cmd accumulator between polls

    const intervalId = setInterval(async () => {
      if (ws.readyState !== ws.OPEN) return;

      const params = {
        live: 1,
        token: encodeToken(session.labviewToken),
        ...pendingCmds,
      };
      pendingCmds = {};

      try {
        const data = await labviewGet('/dashboard/update', params);
        const stations = Array.from({ length: 5 }, (_, i) => normalizeStation(data, i));
        const noUsers = data['key_5'] ?? data['no_user'] ?? null;

        ws.send(JSON.stringify({ type: 'update', ts: Date.now(), stations, noUsers }));
      } catch (err) {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ type: 'error', message: 'LabVIEW unreachable' }));
        }
      }
    }, POLL_INTERVAL_MS);

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw);
        if (msg.type === 'station_cmd' && msg.station >= 1 && msg.station <= 5) {
          // Accumulate station commands into next poll params
          pendingCmds[`stat${msg.station}`] = msg.cmd;
        }
      } catch {
        // ignore malformed messages
      }
    });

    ws.on('close', () => clearInterval(intervalId));
    ws.on('error', () => clearInterval(intervalId));
  });
}

module.exports = { attach, handleUpgrade };
