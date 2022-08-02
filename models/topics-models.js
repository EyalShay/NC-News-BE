const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticlesById = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1;", [id])
    .then(({ rows: [article] }) => {
      if (article === undefined) {
        console.log("models 14");
        return Promise.reject({
          status: 404,
          msg: "Article not found!",
        });
      }
      console.log("models 20");
      return article;
    });
};

exports.updateArticlesById = (newVotes, id) => {
  if (newVotes === undefined) {
    console.log("models 26");
    return Promise.reject({
      status: 400,
      msg: "Invalid request!",
    });
  } else {
    console.log("models 33");
    return db
      .query(
        `UPDATE articles SET votes = (votes + $1) WHERE article_id=$2 RETURNING *;`,
        [newVotes, id]
      )
      .then(({ rows }) => rows[0]);
  }
};
