const express = require("express");
const app = express();
const seed = require("./db/seeds/seed");
const {
  getTopics,
  getArticlesById,
} = require("./controllers/topics-controllers");

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.all("/*", (req, res) => {
  console.log("<<< error in app.all");
  res.status(404).send({ msg: "Endpoint was not found!" });
});

app.use((err, req, res, next) => {
  console.log(err, "<<< error in app.use");
  if (err.code === "to be added") {
    res.status(400).send({ msg: "Invalid request!" });
  } else {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
