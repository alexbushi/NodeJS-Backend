const { User } = require('../../models/user');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('admin middleware', () => {
  let isAdmin;

  const exec = () => {
    const user = {
      _id: mongoose.Types.ObjectId().toHexString(),
      isAdmin,
    };

    const token = User(user).generateAuthToken();

    const decodedUser = jwt.verify(token, config.get('jwtPrivateKey'));

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
    isAdmin = false;

    const res = await exec();

    expect(res.status).toBe(403);
  });

  it('should return 200 when user has admin authorization', async () => {
    isAdmin = true;

    const res = await exec();

    expect(res.status).toBe(200);
  });
});
