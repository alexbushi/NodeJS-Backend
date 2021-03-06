const { User } = require('../../../models/user');
const request = require('supertest');
let server;

describe('/api/users', () => {
  // Need to open and close server before and after every test
  beforeEach(() => {
    server = require('../../../index');
  });
  afterEach(async () => {
    await User.deleteMany({});
    await server.close();
  });

  describe('GET /', () => {
    it('should return all users', async () => {
      await User.collection.insertMany([
        { name: 'user1', email: '222@g.com', password: '11111' },
        { name: 'user2', email: '2@g.com', password: '22222' },
      ]);

      const res = await request(server).get('/api/users');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((u) => u.name === 'user1')).toBeTruthy();
      expect(res.body.some((u) => u.name === 'user2')).toBeTruthy();
    });
  });

  describe('DELETE /:id', () => {
    it('should return 404 if invalid id is passed', async () => {
      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });
  });

  describe('GET /me', () => {
    let token;

    const exec = () => {
      return request(server).get('/api/users/me').set('x-auth-token', token);
    };

    it('should return 401 if client is not logged in', async () => {
      token = '';

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('should return 400 if invalid token is given', async () => {
      token = 'aaaa';

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 200 if a valid token is given', async () => {
      token = new User().generateAuthToken();

      const res = await exec();

      expect(res.status).toBe(200);
    });
  });

  describe('POST /', () => {
    it('should return 400 if the user with the given email is already registered', async () => {
      await User.collection.insertOne({
        name: 'user2',
        email: '2@g.com',
        password: '22222',
      });
      const res = await request(server)
        .post('/api/users')
        .send({ name: 'Gloria', email: '2@g.com', password: '12345' });

      expect(res.status).toBe(400);
    });

    it('should save the user if it is valid', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({ name: 'Gloria', email: 'gg@g.com', password: '12345' });

      const user = await User.find({ name: 'Gloria' });

      expect(user).not.toBeNull();
    });

    it('should return the user if it is valid', async () => {
      const res = await request(server)
        .post('/api/users')
        .send({ name: 'Shannon', email: 'sss@g.com', password: '12345' });

      expect(res.body).toHaveProperty('name', 'Shannon');
    });
  });

  // describe('DELETE /:id', () => {
  //   let user;
  //   let id;

  //   const exec = () => {
  //     return request(server).delete('/api/users/' + id);
  //   };

  //   beforeEach(async () => {
  //     user = User({ name: 'user1', email: '1@g.com', password: '123456' });
  //     await user.save();

  //     id = user._id;
  //   });

  //   it('should return the removed genre', async () => {
  //     const res = await exec();

  //     expect(res.body).toHaveProperty('_id', user._id.toHexString());
  //     expect(res.body).toHaveProperty('name', user.name);
  //   });
  // });

  // describe('PUT /:id', () => {
  //   let newName;
  //   let user;
  //   let id;

  //   const exec = async () => {
  //     return await request(server)
  //       .put('/api/users/' + id)
  //       .send({ name: newName });
  //   };

  //   beforeEach(async () => {
  //     user = new User({ name: 'user1', email: '1@g.com', password: '123456' });
  //     await user.save();

  //     token = new User().generateAuthToken();
  //     id = user._id;
  //     newName = 'updatedName';
  //   });

  //   it('should return the updated user if it is valid', async () => {
  //     const res = await exec();

  //     expect(res.body).toHaveProperty('_id');
  //     expect(res.body).toHaveProperty('name', newName);
  //   });
  // });
});
