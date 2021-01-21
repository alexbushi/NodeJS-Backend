const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});

// add a method to this userSchema object called generateAuthToken
userSchema.methods.generateAuthToken = function () {
  // First argument is what we want in the token payload so we don't have to query database for it, can be anything
  // Second argument is the secret key
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('jwtPrivateKey')
  );
  return token;
};

// Collection name is 'User'
const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(user);
};

exports.User = User;
exports.validate = validateUser;
