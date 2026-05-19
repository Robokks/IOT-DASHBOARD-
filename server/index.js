'use strict';
const http = require('http');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const { WebSocketServer } = require('ws');
const config = require('./config');
const authRouter = require('./auth');
const proxyRouter = require('./proxy');
const wsBroker = require('./ws-broker');

const app = express();

// Security headers for all responses
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  if (req.path.startsWith('/api')) {
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});

app.use(express.json());
app.use(cookieParser());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// API routes
app.use('/api', authRouter);
app.use('/api', proxyRouter);

// Redirect root to login if no index is matched
app.get('/', (req, res) => res.redirect('/login.html'));

// 404 handler for API routes
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
wsBroker.attach(wss);

server.on('upgrade', (req, socket, head) => {
  if (req.url === '/ws') {
    wsBroker.handleUpgrade(wss, req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(config.port, () => {
  console.log(`[server] IoT Dashboard running on http://localhost:${config.port}`);
  console.log(`[server] LabVIEW target: ${config.labviewBaseUrl}`);
});
