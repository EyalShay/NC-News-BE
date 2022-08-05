const { checkUser, checkArticleExists } = require("../db/seeds/utils");
const {
  selectArticlesById,
  updateArticlesById,
  fetchArticles,
  insertComments,
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

exports.postComments = async (req, res, next) => {
  try {
    const newComment = req.body;
    const id = req.params.article_id;
    const authorName = req.body.author;
    if (Object.keys(newComment).length === 0) {
      throw {
        status: 400,
        msg: "Comment body is empty!",
      };
    }
    await checkArticleExists(id);
    const exists = await checkUser(authorName);
    const comments = await insertComments(newComment, id, exists);
    res.status(201).send({ comment: comments });
  } catch (err) {
    next(err);
  }
};
