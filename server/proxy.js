'use strict';
const express = require('express');
const jwtVerify = require('./middleware/jwt-verify');
const { labviewGet, labviewPost, encodeToken } = require('./middleware/labview-client');

const router = express.Router();

// GET /api/config — fetch current test configuration from LabVIEW
router.get('/config', jwtVerify, async (req, res) => {
  try {
    const data = await labviewGet('/selection/import', {
      import: 1,
      token: encodeToken(req.session.labviewToken),
    });
    res.json(data);
  } catch (err) {
    console.error('[proxy] GET /api/config error:', err.message);
    res.status(502).json({ error: 'Failed to fetch configuration from LabVIEW.' });
  }
});

// POST /api/config — save test configuration to LabVIEW
router.post('/config', jwtVerify, async (req, res) => {
  try {
    const data = await labviewPost('/selection/master', req.body, req.session.labviewToken);
    res.json(data);
  } catch (err) {
    console.error('[proxy] POST /api/config error:', err.message);
    res.status(502).json({ error: 'Failed to save configuration to LabVIEW.' });
  }
});

module.exports = router;
