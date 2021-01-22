const { User, validateUser } = require('../models/user');
const validate = require('../middleware/validate');
const validateObjectId = require('../middleware/validateObjectId');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

router.post('/', validate(validateUser), async (req, res) => {
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

// Peform auth middleware function before this
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.get('/', async (req, res) => {
  const users = await User.find().select('-password').sort('name');
  res.send(users);
});

router.put('/:id', validateObjectId, async (req, res) => {
  // Input validation
  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);

  // Update First and return updated user
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!user)
    return res.status(404).send('The user with the given ID does not exist');

  res.send(user);
});

router.delete('/:id', validateObjectId, async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id).select('-password');

  if (!user)
    return res.status(404).send('The user with the given ID does not exist');

  res.send(user);
});

module.exports = router;
