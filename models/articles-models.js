const db = require("../db/connection");

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

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT (comments.article_id)::INTEGER AS comment_count 
      FROM comments RIGHT JOIN articles ON comments.article_id = articles.article_id 
      GROUP BY articles.article_id ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};
