const { User } = require('../../models/user');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('admin middleware', () => {
  let decodedUser;
  let token;

  const exec = () => {
    return request(server)
      .get('/')
      .set('x-auth-token', token)
      .send({ decodedUser });
  };

  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    await server.close();
  });

  it('should return 403 when user does not have admin authorization', async () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: false,
    };

    token = User(user).generateAuthToken();

    decodedUser = jwt.verify(token, config.get('jwtPrivateKey'));

    const res = await exec();

    expect(res.status).toBe(403);
  });

  it('should return 200 when user has admin authorization', async () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };

    token = User(user).generateAuthToken();

    decodedUser = jwt.verify(token, config.get('jwtPrivateKey'));

    const res = await exec();

    expect(res.status).toBe(200);
  });
});
