const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// auth and admin are middleware functions executed before route handler in this order
router.get('/', [auth, admin], (req, res) => {
  res.send('Hello');
});

module.exports = router;
