const Joi = require('joi');
const { User, validateUserLogin } = require('../models/user');
const validate = require('../middleware/validate');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/', validate(validateUserLogin), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
