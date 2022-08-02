const db = require("../db/connection");

exports.fetchUsers = () => {
  console.log("models");
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
