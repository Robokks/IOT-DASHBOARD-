'use strict';
require('dotenv').config();

const required = ['LABVIEW_BASE_URL', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`[config] Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

module.exports = Object.freeze({
  labviewBaseUrl: process.env.LABVIEW_BASE_URL.replace(/\/$/, ''),
  jwtSecret: process.env.JWT_SECRET,
  port: parseInt(process.env.PORT || '3000', 10),
  sessionHours: parseInt(process.env.SESSION_HOURS || '8', 10),
});
