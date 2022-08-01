const express = require("express");
const app = express();
const seed = require("./db/seeds/seed");
const { getTopics } = require("./controllers/topics-controllers");

app.get("/api/topics", getTopics);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Endpoint was not found!" });
});

app.use((err, req, res, next) => {
  console.log(err.msg, "<<< app.js");
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
