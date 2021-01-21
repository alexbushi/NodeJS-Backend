const Joi = require('joi');
const { User } = require('../models/user');
const express = require('express');
const bcrypt = require('bcrypt');
const debug = require('debug')('app:startup');
const router = express.Router();

router.post('/', async (req, res) => {
  // Joi input validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check to see if user exists with email
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = user.generateAuthToken();
  res.send(token);
});

const validate = (req) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(req);
};

module.exports = router;
