const app = require('../app');
const request = require('supertest');
const data = require('../db/data/test-data/index');
const seed = require('../db/seeds/seed')

beforeEach(() => {
return seed(data)
}
    
)

describe('GET /api/topics', () => {


  it('200: should return an array', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
      });
  });
  it('200: responds with an array of all topics', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveLength(3);
      });
  });
  it('200: each object inside the array should have the valid properties', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        body.forEach((topic) => {
          expect(topic).toHaveProperty('description', expect.any(String));
          expect(topic).toHaveProperty('slug', expect.any(String));
        });
      });
  });
});
