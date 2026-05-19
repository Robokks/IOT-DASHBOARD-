'use strict';

// Realistic simulation of the Wiper Motor Test Rig.
// Each station has its own state that advances in real time.
// Station 5 periodically faults to show the ERROR state in the UI.

const STATION_CONFIGS = [
  { id: 1, model_no: 'WM-2024-A', serial_no: 'SN-001',
    mode: 'AUTO', baseSpeed: 65, baseTorque: 2.1,
    nominalVoltage: 12.0, nominalCurrent: 3.2, totalSets: 5, cyclesPerSet: 500 },
  { id: 2, model_no: 'WM-2024-B', serial_no: 'SN-002',
    mode: 'MAN', baseSpeed: 38, baseTorque: 1.3,
    nominalVoltage: 11.8, nominalCurrent: 2.1, totalSets: 3, cyclesPerSet: 300 },
  { id: 3, model_no: 'WM-2023-A', serial_no: 'SN-003',
    mode: 'IDLE', baseSpeed: 0, baseTorque: 0,
    nominalVoltage: 0, nominalCurrent: 0, totalSets: 0, cyclesPerSet: 0 },
  { id: 4, model_no: 'WM-2024-C', serial_no: 'SN-004',
    mode: 'AUTO', baseSpeed: 95, baseTorque: 3.5,
    nominalVoltage: 13.8, nominalCurrent: 4.6, totalSets: 8, cyclesPerSet: 750 },
  { id: 5, model_no: 'WM-2024-B', serial_no: 'SN-005',
    mode: 'AUTO', baseSpeed: 55, baseTorque: 1.8,
    nominalVoltage: 12.4, nominalCurrent: 2.8, totalSets: 4, cyclesPerSet: 400 },
];

// Stagger station start times so they aren't all in sync
const stationState = STATION_CONFIGS.map((cfg, i) => ({
  cfg,
  startMs: Date.now() - i * 7300,
  cyclesLeft: cfg.cyclesPerSet,
  partCount: 0,
  status: cfg.mode === 'IDLE' ? 'IDLE' : (cfg.mode === 'AUTO' ? 'AUTO MODE' : 'MAN MODE'),
  runSts: cfg.mode === 'IDLE' ? 'STOPPED' : 'RUNNING',
  overrideStatus: null, // set by applyCmd
  overrideRunSts: null,
}));

// Smooth sinusoidal variation for analog readings
function wave(t, periodSec, amplitude) {
  return amplitude * Math.sin((t / 1000) * (2 * Math.PI / periodSec));
}

// Small high-frequency noise per station
function jitter(t, seed) {
  return 0.04 * Math.sin(t * 0.007 * seed) * Math.cos(t * 0.013 * (seed + 2));
}

function round1(n) { return Math.round(n * 10) / 10; }

function fmtTime(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// Station 5 (index 4): fault every 30s for 4s
const FAULT_CYCLE_MS = 30000;
const FAULT_DURATION_MS = 4000;

function tick(st, idx, now) {
  if (st.cfg.mode === 'IDLE') return; // Station 3 stays stopped

  // User override takes priority until next natural cycle boundary
  if (st.overrideStatus) {
    st.status = st.overrideStatus;
    st.runSts = st.overrideRunSts;
    if (st.runSts === 'RUNNING') {
      // Once running, clear override so natural cycling resumes
      st.overrideStatus = null;
      st.overrideRunSts = null;
    }
    return;
  }

  // Station 5 periodic fault
  if (idx === 4) {
    const phase = now % FAULT_CYCLE_MS;
    if (phase < FAULT_DURATION_MS) {
      st.status = 'ERROR';
      st.runSts = 'FAULT';
      return;
    }
  }

  // Advance cycle counter: one simulated cycle per 200ms of real time
  const elapsed = now - st.startMs;
  const cyclesDone = Math.floor(elapsed / 200);

  if (cyclesDone >= st.cfg.cyclesPerSet) {
    // Set complete — reset for next set
    st.partCount = Math.min(st.partCount + 1, st.cfg.totalSets);
    st.startMs = now;
    st.status = 'SET DONE';
    st.runSts = 'STOPPED';
  } else {
    st.cyclesLeft = st.cfg.cyclesPerSet - cyclesDone;
    st.status = st.cfg.mode === 'AUTO' ? 'AUTO MODE' : 'MAN MODE';
    st.runSts = 'RUNNING';
  }
}

function snapshot() {
  const now = Date.now();

  return stationState.map((st, idx) => {
    tick(st, idx, now);
    const cfg = st.cfg;
    const running = st.runSts === 'RUNNING';
    const t = now;

    const speed = running
      ? round1(Math.max(0, cfg.baseSpeed + wave(t, 8, cfg.baseSpeed * 0.12) + jitter(t, idx + 1) * cfg.baseSpeed))
      : 0;

    const torque = running
      ? round1(Math.max(0, cfg.baseTorque + wave(t, 11, cfg.baseTorque * 0.18) + jitter(t, idx + 3) * cfg.baseTorque))
      : 0;

    const voltage = running
      ? round1(cfg.nominalVoltage + wave(t, 5, 0.15) + jitter(t, idx + 7) * 0.1)
      : 0;

    const current = running
      ? round1(Math.max(0, cfg.nominalCurrent + wave(t, 7, 0.3) + jitter(t, idx + 5) * 0.2))
      : 0;

    const elapsedSec = Math.floor((now - st.startMs) / 1000);

    return {
      id: cfg.id,
      status: st.status,
      speed,
      torque,
      voltage,
      current,
      no_cycle: st.cyclesLeft,
      part_count: st.partCount,
      cycle_time: fmtTime(elapsedSec),
      run_sts: st.runSts,
      model_no: cfg.model_no,
      serial_no: cfg.serial_no,
      seq_on: running ? '1' : '0',
    };
  });
}

// Called when user presses Start (cmd=1 fresh, cmd=2 continue) or Stop (cmd=0)
function applyCmd(stationId, cmd) {
  const st = stationState[stationId - 1];
  if (!st || st.cfg.mode === 'IDLE') return;
  if (cmd === 0) {
    st.overrideStatus = 'STOPPED';
    st.overrideRunSts = 'STOPPED';
    st.startMs = Date.now();
  } else if (cmd === 1) {
    st.cyclesLeft = st.cfg.cyclesPerSet;
    st.partCount = 0;
    st.startMs = Date.now();
    st.overrideStatus = null;
    st.overrideRunSts = null;
  } else if (cmd === 2) {
    st.startMs = Date.now();
    st.overrideStatus = null;
    st.overrideRunSts = null;
  }
}

// Fake test configuration matching the LabVIEW /selection/import shape
function fakeConfig() {
  return {
    status:           [1, 1, 0, 1, 1],
    high_set_v:       [13.5, 11.8, 0, 14.2, 13.0],
    low_set_v:        [11.0, 10.5, 0, 11.2, 10.8],
    high_speed_cycle: [500, 300, 0, 750, 400],
    low_speed_cycle:  [250, 150, 0, 400, 200],
    high_speed_load:  [3.5, 2.0, 0, 4.5, 3.0],
    low_speed_load:   [1.5, 1.0, 0, 2.0, 1.2],
    high_on_time:     [2.5, 1.8, 0, 3.0, 2.2],
    low_on_time:      [1.0, 0.8, 0, 1.2, 0.9],
    high_off_time:    [1.5, 1.2, 0, 2.0, 1.4],
    low_off_time:     [0.8, 0.5, 0, 1.0, 0.7],
    pause_time:       [0.5, 0.3, 0, 0.8, 0.4],
    set_counts:       [5, 3, 0, 8, 4],
  };
}

module.exports = { snapshot, applyCmd, fakeConfig };
