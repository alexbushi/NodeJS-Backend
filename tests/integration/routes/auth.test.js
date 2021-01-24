const { User } = require('../../../models/user');
const request = require('supertest');
const bcrypt = require('bcrypt');

describe('auth route', () => {
  let email;
  let password;

  const exec = () => {
    return request(server).post('/api/auth').send({ email, password });
  };

  beforeEach(async () => {
    server = require('../../../index');

    user = User({
      name: 'user1',
      email: '222@g.com',
      password: '123456',
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
  });
  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });

  it('should return 400 if invalid email is given', async () => {
    email = '';
    password = '11111';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if invalid passwod is given', async () => {
    email = '222@g.com';
    password = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if invalid password and invalid email given', async () => {
    email = '';
    password = '';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return a token if a valid email and password are given', async () => {
    email = '222@g.com';
    password = '123456';

    const res = await exec();

    expect(res.status).toBe(200);
    expect(res.text).not.toBeNull();
  });
});
