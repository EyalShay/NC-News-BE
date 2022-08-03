const {
  selectArticlesById,
  updateArticlesById,
  fetchArticles,
  fetchCommentsByArticleId,
} = require("../models/articles-models");

exports.getArticlesById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticlesById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticlesById = (req, res, next) => {
  const id = req.params.article_id;
  const newVotes = req.body.inc_votes;
  updateArticlesById(newVotes, id)
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = async (req, res, next) => {
  const articles = await fetchArticles();
  res.status(200).send({ articles });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  fetchCommentsByArticleId(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
