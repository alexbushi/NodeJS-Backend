const Joi = require('joi');
const { User } = require('../models/user');
const validate = require('../middleware/validate');
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const validateLoginCredentials = (userCredentials) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(userCredentials);
};

router.post('/', validate(validateLoginCredentials), async (req, res) => {
  // Check to see if user exists with email
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = router;
