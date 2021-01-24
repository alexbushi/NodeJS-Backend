const { User } = require('../../../models/user');
const request = require('supertest');

describe('auth middleware', () => {
  // Variables that will change for each test
  let token;

  // Function that each test will always execute
  const exec = () => {
    return request(server).get('/api/users/me').set('x-auth-token', token);
  };

  beforeEach(() => {
    server = require('../../../index');

    // Define all valid variables
    token = User().generateAuthToken();
  });
  afterEach(async () => {
    await server.close();
  });

  it('should return 401 if no token is provided', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if invalid token is provided', async () => {
    token = 'aa';

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if valid token is provided', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
