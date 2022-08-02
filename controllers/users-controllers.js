const { fetchUsers } = require("../models/users-models");

exports.getUsers = (req, res, next) => {
  console.log("controller");
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};
