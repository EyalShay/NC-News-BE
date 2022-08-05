const express = require("express");
const app = express();
const seed = require("./db/seeds/seed");
const { getTopics } = require("./controllers/topics-controllers");
const {
  getArticlesById,
  patchArticlesById,
  getArticles,
  postComments,
} = require("./controllers/articles-controllers");
const { getUsers } = require("./controllers/users-controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.patch("/api/articles/:article_id", patchArticlesById);

app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComments);

app.all("/*", (req, res) => {
  console.log("<<< error in app.all");
  res.status(404).send({ msg: "Endpoint was not found!" });
});

app.use((err, req, res, next) => {
  console.log(err, "<<< error in app.use");
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid request!" });
  } else {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
