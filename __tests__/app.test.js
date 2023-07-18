const app = require("../app");
const request = require("supertest");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");
const db = require("../db/connection");
afterAll(()=> db.end())
beforeEach(() => {
  return seed(data);
});

describe("GET /api/topics", () => {
  it("200: should return an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(Array.isArray(topics)).toBe(true);
      });
  });
  it("200: responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toHaveLength(3);
      });
  });
  it("200: each object inside the array should have the valid properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("description", expect.any(String));
          expect(topic).toHaveProperty("slug", expect.any(String));
        });
      });
  });
});

describe("GET /api", () => {
  it("200: should return an object describing all the available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({ description: endpoints });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  it("200: should return an article object by its ID", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("author", expect.any(String));
        expect(article).toHaveProperty("title", expect.any(String));
        expect(article).toHaveProperty("article_id", 5);
        expect(article).toHaveProperty("body", expect.any(String));
        expect(article).toHaveProperty("topic", expect.any(String));
        expect(article).toHaveProperty("created_at", expect.any(String));
        expect(article).toHaveProperty("votes", expect.any(Number));
        expect(article).toHaveProperty("article_img_url", expect.any(String));
      });
  });
  it("400: responds with bad request for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/apple")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("404: if article does not exist", () => {
    return request(app).get("/api/apple").expect(404);
  });
});
describe("GET /api/articles", () => {
  it("200: should return an array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
      });
  });
  it("200: responds with an array of all topics", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toHaveLength(13);
      });
  });
  it("200: each object inside the array should have the valid properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        articles.forEach((article) => {
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  it("200: responds with an array of objects sorted by default value of date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  it("200: should return an array of comments", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
      });
  });
  it("200: returns all the comments", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(2);
      });
  });
  it("200: should return an array of comments with valid properties", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(2)
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
          expect(comment).toHaveProperty("article_id", expect.any(Number));
          
        });
      });
  });
  it("200: valid id but no comments respond with an empty array of comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(0);
      });
  });
  it("400: returns bad request when invalid ID", () => {
    return request(app)
      .get("/api/articles/'apple'/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("404: returns Not Found error when invalid ID does not exist", () => {
    return request(app)
      .get("/api/articles/9090/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("201: should add a comment for an article", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({ username: "butter_bridge", body: "apple" })
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;

        expect(comment).toHaveProperty("comment_id", expect.any(Number));
        expect(comment).toHaveProperty("votes", expect.any(Number));
        expect(comment).toHaveProperty("created_at", expect.any(String));
        expect(comment).toHaveProperty("author", "butter_bridge");
        // expect(comment).toHaveProperty('username', 'John');
        expect(comment).toHaveProperty("body", "apple");
        expect(comment).toHaveProperty("article_id", expect.any(Number));
      });
  });
  it("404: should return Not Found if article does not exist", () => {
    return request(app)
      .post("/api/articles/999/comments")
      .send({ username: "butter_bridge", body: "apple" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("400: returns bad request when invalid ID", () => {
    return request(app)
      .post("/api/articles/'apple'/comments")
      .send({ username: "butter_bridge", body: "apple" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  it("404: returns NotFound when invalid username", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({ username: 'hi', body: "apple" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  it("400: returns bad request when invalid username and body keys", () => {
    return request(app)
      .post("/api/articles/5/comments")
      .send({notusername: "butter_bridge", notbody: "valid text"})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
describe('PATCH /api/articles/:article_id', () => {
  it('200: should update the article votes', () => {
    return request(app)
    .patch('/api/articles/5')
    .send({ inc_votes: 5})
    .expect(200)
    .then(({ body }) => {
      const { article } = body
      expect(article.votes).toBe(5);
    });
  })
  it('200: should update the article votes with a negative inc votes', () => {
    return request(app)
    .patch('/api/articles/5')
    .send({ inc_votes: -5})
    .expect(200)
    .then(({ body }) => {
      const { article } = body
      expect(article.votes).toBe(-5);
    });
  })
  it('400: return bad request for invalid id', () => {
    return request(app)
    .patch('/api/articles/"apple"')
    .send({ inc_votes: 5})
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe('Bad Request');
    });
  })
  it('400: return Bad Request when put in invalid data type', () => {
    return request(app)
    .patch('/api/articles/5')
    .send({ inc_votes: 'lop'})
    .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
      
  })
  it("404: should return Not Found if article does not exist", () => {
    return request(app)
      .patch("/api/articles/587")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        
        expect(body.msg).toBe("Not Found");
      });
})
})

describe('DELETE /api/comments/:comment_id', () => {
  it('204: should delete the comment by comment_id', () => {
    return request(app)
      .delete('/api/comments/2')
      .expect(204);
  });

  it('404: should return Not Found if comment does not exist', () => {
    return request(app)
      .delete('/api/comments/999')
      .expect(404)
      .then(({ body }) => {
        
        expect(body.msg).toBe('Not Found');
      });
  });
});
describe('GET /api/users', () => {
  it('200: should get all users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        users.forEach((user) => {
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('avatar_url');
        });
      });
  });
});

describe('GET /api/articles (queries)', () => {
  it('200: should return all articles', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        
      });
  });

  it('200: should return articles filtered by topic', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        
        articles.forEach((article) => {
          
          expect(article.topic).toBe('mitch');
        });
      });
  });

  it('200: should return articles sorted by column (default: date)', () => {
    return request(app)
      .get('/api/articles?sort_by=votes')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        
        const votes = articles.map((article) => article.votes);
        expect(votes).toEqual([...votes].sort((a, b) => b - a)); // Ensure descending order
      });
  });

  it('200: should return articles sorted in ascending order', () => {
    return request(app)
      .get('/api/articles?sort_by=votes&order=ASC')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        
        const votes = articles.map((article) => article.votes);
        expect(votes).toEqual([...votes].sort((a, b) => a - b)); // Ensure ascending order
      });
  });

  it('400: should return Bad Request for invalid sort_by parameter', () => {
    return request(app)
      .get('/api/articles?sort_by=invalid_column')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
  });
  it("200: responds with an array of objects sorted by default value of date in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
    })
});
describe("GET /api/articles/:article_id (comment_count)", () => {
  it("200: should return an article object with comment_count property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        
        expect(article).toHaveProperty("comment_count");
        
      });
  });

  it("404: should return Article not found for non-existing article_id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
});