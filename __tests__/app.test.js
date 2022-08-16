const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require("../db/data/test-data");
const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET api/topics", () => {
  test("status:200 , enpoint responds with JSON object containing an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("ERROR handling, general errors", () => {
  test("status: 404 when unable to find endpoint", () => {
    return request(app)
      .get("/missingEndpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint was not found!");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("responds with a single matching article", () => {
    const ID = 2;
    return request(app)
      .get(`/api/articles/${ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: ID,
            title: "Sony Vaio; or, The Laptop",
            topic: "mitch",
            author: "icellusedkars",
            body: expect.any(String),
            created_at: expect.any(String),
            votes: 0,
          })
        );
      });
  });
  test("status: 400 for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/blorp")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request!");
      });
  });
  test("status: 404 for a valid, but non existing article_id", () => {
    return request(app)
      .get("/api/articles/9000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Status:200 request body accepts an object that determines how many votes to add to the votes propery", () => {
    const update = { inc_votes: 4 };
    return request(app)
      .patch("/api/articles/3")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: expect.any(String),
          votes: 4,
        });
      });
  });
  test("request body accepts an object that determines how many votes to deduct from the votes propery", () => {
    const update = { inc_votes: -30 };
    return request(app)
      .patch("/api/articles/1")
      .send(update)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 70,
        });
      });
  });
  test("ignore extra or invalid keys", () => {
    const articleUpdate = {
      inc_votes: 99,
      rating: 6.7,
    };
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdate)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: expect.any(String),
          votes: 99,
        });
      });
  });
  test("status: 400 for a valid, but non existing article_id", () => {
    return request(app)
      .patch("/api/articles/9999")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request!");
      });
  });
  test("status:400 for a request where the object is empty", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request!");
      });
  });
  test("status: 400 for invalid inc_votes property type", () => {
    const articleUpdate = {
      inc_votes: "Mr. Potatoe Head",
    };
    return request(app)
      .patch("/api/articles/3")
      .send(articleUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request!");
      });
  });
});

describe("GET api/users", () => {
  test("status:200 enpoint responds with JSON object containing an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("responds with a single matching article with a total count of all the comments with this articles_id", () => {
    const ID = 3;
    return request(app)
      .get(`/api/articles/${ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: ID,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: expect.any(String),
          votes: 0,
          comment_count: 2,
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("status:200 responds with an array of all the articles including a comment_count property", () => {
    const ID = 3;
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              title: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("status:200 sorts the articles by date, descending", () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("responds with a single matching article with a total count of all the comments with this articles_id", () => {
    const ID = 3;
    return request(app)
      .get(`/api/articles/${ID}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: ID,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: expect.any(String),
          votes: 0,
          comment_count: 2,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status:200 responds with an array of comments for the given article_id", () => {
    const ID = 3;
    return request(app)
      .get(`/api/articles/${ID}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(2);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  test("status:404 for a valid, but non existing article_id number", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
  test("status: 400 for an invalid article_id", () => {
    return request(app)
      .get("/api/articles/blorp/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request!");
      });
  });
  test("status:200 returns an empty array for an article that exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status:201, responds with newly posted comments", () => {
    const newComment = {
      author: "icellusedkars",
      body: "loads of interesting things",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            author: "icellusedkars",
            body: "loads of interesting things",
            comment_id: 19,
            article_id: 2,
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("status: 404 for an author that doesn't exist", () => {
    const newComment = {
      author: "blorp_blorpstein",
      body: "This article was blorptacular!",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Author not found!");
      });
  });
  test("status: 404 for a valid but non existing article", () => {
    const newComment = {
      author: "icellusedkars",
      body: "loads of interesting things",
    };
    return request(app)
      .post("/api/articles/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found!");
      });
  });
  test("status: 400 for an invalid article_id", () => {
    const newComment = {
      author: "icellusedkars",
      body: "loads of interesting things",
    };
    return request(app)
      .post("/api/articles/blorp/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request!");
      });
  });
  test("status: 400 for an empty comment post request", () => {
    const newComment = {};
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Require properties missing");
      });
  });
});

describe("GET /api/articles (queries)", () => {
  test("status:200 accepts sort_by query that sorts articles by valid column =author", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", { descending: true });
      });
  });
  test("status:200 accepts sort_by query that sorts articles by valid column =body", () => {
    return request(app)
      .get("/api/articles?sort_by=body")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("body", { descending: true });
      });
  });
  test("status:200 accepts sort_by query that sorts articles by valid column =votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("status:200 accepts sort_by query that sorts articles by valid column =title", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("status:200 accepts sort_by query that sorts articles by valid column =topic", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("topic", { descending: true });
      });
  });
  test("status:200 accepts order query that can be set with either asc or desc - desending order", () => {
    return request(app)
      .get(`/api/articles?sort_by=title&order=desc`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("status:200 accepts order query that can be set with either asc or desc - ascending order", () => {
    return request(app)
      .get(`/api/articles?sort_by=title&order=asc`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", { ascending: true });
      });
  });
  test("status:200 accepts topic query that will filter the articles by topic value", () => {
    return request(app)
      .get(`/api/articles?topic=mitch`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(11);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              topic: "mitch",
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
            })
          );
        });
      });
  });
  test("status:404 when topic is valid but has no articles", () => {
    return request(app)
      .get(`/api/articles?topic=paper`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No articles found with requested topic!");
      });
  });
  test("status:400 for an invalid topic", () => {
    return request(app)
      .get(`/api/articles?topic=blorp`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request!");
      });
  });
  test("status:400 for an invalid sort_by request", () => {
    return request(app)
      .get(`/api/articles?sort_by=onions`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request!");
      });
  });
  test("status:400 for an invalid order request", () => {
    return request(app)
      .get(`/api/articles?topic=title&order=sideways`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request!");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status:204 No Content Status, endpoint should delete the specified comment from the database", () => {
    const ID = 1;
    return request(app)
      .delete(`/api/comments/${ID}`)
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  test("status:404 when trying to delete a comment that doesn't exist from a valid endpoint", () => {
    const ID = 999;
    return request(app)
      .delete(`/api/comments/${ID}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment was not found!");
      });
  });
  test("status:400 when trying to delete a comment with an invalid endpoint", () => {
    return request(app)
      .delete(`/api/comments/blorp`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid request!");
      });
  });
});

describe("GET /api", () => {
  test("responds with a json representation of all the available enopoints on the api", () => {
    const endpointsCopy = { ...endpoints };
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body.endpoints).toEqual(endpointsCopy);
      });
  });
});
