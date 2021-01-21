const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const debug = require('debug')('app:startup');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  // Joi input validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check to see if user is already registered
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered');

  // If not, create a new user
  user = User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // Save new user to db with hashed password
  await user.save();

  const token = user.generateAuthToken();

  // Send a HTTP response with a header field called x-auth-token, and value token
  res.header('x-auth-token', token).send({
    name: user.name,
    email: user.email,
  });
});

module.exports = router;