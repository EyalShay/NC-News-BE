const { checkUser, checkArticleExists } = require("../db/seeds/utils");
const {
  selectArticlesById,
  updateArticlesById,
  fetchArticles,
  insertComments,
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
  try {
    let { sort_by } = req.query;
    if (Object.keys(req.query)[0] === "topic") {
      if (req.query.topic === "asc" || req.query.topic === "desc") {
        throw {
          status: 400,
          msg: "Invalid request!",
        };
      }
    }
    req.query.topic !== undefined ? (sort_by = req.query.topic) : null;
    req.query.order !== undefined ? (sort_by = req.query.order) : null;
    if (sort_by === undefined && Object.keys(req.query).length > 0) {
      throw {
        status: 400,
        msg: "Invalid request!",
      };
    }
    const articles = await fetchArticles(sort_by);
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.postComments = async (req, res, next) => {
  try {
    const newComment = req.body;
    const id = req.params.article_id;
    const authorName = req.body.author;
    if (Object.keys(newComment).length === 0) {
      throw {
        status: 400,
        msg: "Require properties missing",
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

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.article_id;
  checkArticleExists(id)
    .then(() => {
      fetchCommentsByArticleId(id).then((comments) => {
        res.status(200).send({ comments });
      });
    })
    .catch((err) => {
      next(err);
    });
};
