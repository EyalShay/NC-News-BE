const db = require("../db/connection");
const { checkTopic } = require("../db/seeds/utils");

exports.selectArticlesById = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT (comments.article_id)::INTEGER AS comment_count 
      FROM comments RIGHT JOIN articles ON comments.article_id = articles.article_id 
      WHERE articles.article_id=$1 GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows: [article] }) => {
      if (article === undefined) {
        return Promise.reject({
          status: 404,
          msg: "Article not found!",
        });
      }
      return article;
    });
};

exports.updateArticlesById = (newVotes, id) => {
  if (newVotes === undefined) {
    return Promise.reject({
      status: 400,
      msg: "Invalid request!",
    });
  } else {
    return db
      .query(
        `UPDATE articles SET votes = (votes + $1) WHERE article_id=$2 RETURNING *;`,
        [newVotes, id]
      )
      .then(({ rows }) => rows[0]);
  }
};

exports.fetchArticles = async (sortBy = "created_at") => {
  const exists = await checkTopic(sortBy);
  const validTopic = exists[0].slug;
  const injected = [];
  const validSortBy = [
    validTopic,
    "desc",
    "asc",
    "topic",
    "created_at",
    "author",
    "body",
    "votes",
    "title",
    "article_id",
  ];
  if (!validSortBy.includes(sortBy)) {
    return Promise.reject({ status: 400, msg: "Invalid request!" });
  }
  let queryStr = `SELECT articles.*, COUNT (comments.article_id)::INTEGER AS comment_count 
      FROM comments RIGHT JOIN articles ON comments.article_id = articles.article_id`;
  if (validTopic !== undefined) {
    queryStr += ` WHERE articles.topic=$1`;
    injected.push(validTopic);
    sortBy = "topic";
  }
  if (sortBy === "asc" || sortBy === "desc") {
    sortBy = `title ${sortBy}`;
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sortBy} `;
  if (sortBy === "created_at") {
    queryStr += "desc";
  }
  const { rows } = await db.query(queryStr, injected);
  if (rows.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "No articles found with requested topic!",
    });
  }
  return rows;
};

exports.insertComments = (newComment, id, exists) => {
  const article_id = id;
  if (exists.length === 0) {
    return Promise.reject({
      status: 404,
      msg: "Author not found!",
    });
  }
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;`,
      [newComment.author, newComment.body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.fetchCommentsByArticleId = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id=$1`, [id])
    .then(({ rows }) => {
      return rows;
    });
};
