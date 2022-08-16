const { checkUser, checkArticleExists } = require("../db/seeds/utils");
const {
  selectArticlesById,
  updateArticlesById,
  fetchArticles,
  insertComments,
  fetchCommentsByArticleId,
  removeCommentById,
} = require("../models/articles-models");
const endpoints = require("../endpoints.json");

exports.getArticlesById = async (req, res, next) => {
  try {
    const id = req.params.article_id;
    const articles = await selectArticlesById(id);
    res.status(200).send({ article: articles });
  } catch (err) {
    next(err);
  }
};

exports.patchArticlesById = async (req, res, next) => {
  try {
    const id = req.params.article_id;
    const newVotes = req.body.inc_votes;
    const article = await updateArticlesById(newVotes, id);
    res.send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getArticles = async (req, res, next) => {
  try {
    let { sort_by, topic, order } = req.query;
    if (topic !== undefined) {
      sort_by = topic;
    }
    const articles = await fetchArticles(sort_by, order);
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

exports.getCommentsByArticleId = async (req, res, next) => {
  try {
    const id = req.params.article_id;
    await checkArticleExists(id);
    const comments = await fetchCommentsByArticleId(id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};

exports.deleteCommentById = async (req, res, next) => {
  try {
    const id = req.params.comment_id;
    await removeCommentById(id);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

exports.getApi = (req, res) => {
  res.send({ endpoints });
};
