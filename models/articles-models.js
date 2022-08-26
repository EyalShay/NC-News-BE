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

exports.fetchArticles = async (
  sortBy = "created_at",
  orderBy = "desc",
  topic
) => {
  const exists = await checkTopic(topic);
  if (topic && !exists) {
    return Promise.reject({ status: 400, msg: "Invalid request!" });
  }
  const injected = [];
  const validSortBy = [
    "desc",
    "asc",
    "topic",
    "created_at",
    "author",
    "body",
    "votes",
    "title",
    "article_id",
    "comment_count",
  ];
  if (!validSortBy.includes(sortBy) || !validSortBy.includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "Invalid request!" });
  }
  let queryStr = `SELECT articles.*, COUNT (comments.article_id)::INTEGER AS comment_count 
      FROM comments RIGHT JOIN articles ON comments.article_id = articles.article_id`;
  if (topic !== undefined) {
    queryStr += ` WHERE articles.topic=$1`;
    injected.push(topic);
  }
  queryStr += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${orderBy}`;
  const { rows } = await db.query(queryStr, injected);
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

exports.removeCommentById = (id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id=$1;", [id])
    .then((rows) => {
      if (rows.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Comment was not found!" });
      }
    });
};
