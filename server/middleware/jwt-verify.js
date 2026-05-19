'use strict';
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function jwtVerify(req, res, next) {
  const token = req.cookies && req.cookies.session;
  if (!token) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  try {
    req.session = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    res.clearCookie('session');
    return res.status(401).json({ error: 'Session expired.' });
  }
};
