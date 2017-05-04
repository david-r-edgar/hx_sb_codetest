'use strict';

var util = require('util');
var validator = require('validator');

var userModel = require('../../models/user')

//routes (keys are operationIds defined in swagger)
module.exports = {
  getUser: getUser,
  addUser: addUser,
  updateUser: updateUser,
  deleteUser: deleteUser,
  listUsers: listUsers
};

/**
 * Handles the GET /user request
 *
 * @param {object} req The request object
 * @param {object} res The result object
 */
function getUser(req, res) {
  var requestedUserId = req.swagger.params.id.value;
  userModel.getUser(requestedUserId, function(user) {
      res.json(user);
  }, function() {
    res.statusMessage = "User not found";
    res.status(404).end();
  });
}

/**
 * Handles the POST /user request
 *
 * @param {object} req The request object
 * @param {object} res The result object
 */
function addUser(req, res) {
  userModel.addUser(req.swagger.params.user.value, function(user) {

    res.location("/user/" + user.id)
    //return the entire updated object
    res.json(user);
    res.status(200).end();
  }, function() {
    res.statusMessage = "User cannot be added";
    res.status(400).end();
  });
}

/**
 * Handles the PUT /user/{id} request
 *
 * @param {object} req The request object
 * @param {object} res The result object
 */
function updateUser(req, res) {
  var requestedUserId = req.swagger.params.id.value;
  userModel.updateUser(req.swagger.params.id.value,
                       req.swagger.params.user.value,
                       function(user) {
    res.json(user);
    res.status(200).end();
  }, function() {
    res.statusMessage = "User not found";
    res.status(404).end();
  });
}

/**
 * Handles the DELETE /user/{id} request
 *
 * @param {object} req The request object
 * @param {object} res The result object
 */
function deleteUser(req, res) {
  var requestedUserId = req.swagger.params.id.value;

  userModel.deleteUser(requestedUserId, function(user) {
    res.json({message: "deleted user " + requestedUserId});
    res.status(200).end();
  }, function() {
    res.statusMessage = "User not found";
    res.status(404).end();
  });
}

/**
 * Handles the GET /users request
 *
 * @param {object} req The request object
 * @param {object} res The result object
 */
function listUsers(req, res) {
  var filter = {}
  if (req.swagger.params.filterEmail.value !== undefined) {
    filter.email = decodeURIComponent(req.swagger.params.filterEmail.value);
  }
  if (req.swagger.params.filterForename.value !== undefined) {
    filter.forename = decodeURIComponent(req.swagger.params.filterForename.value);
  }
  if (req.swagger.params.filterSurname.value !== undefined) {
    filter.surname = decodeURIComponent(req.swagger.params.filterSurname.value);
  }
  userModel.listUsers(filter, function(users) {
    res.json(users);
    res.status(200).end();
  });
}
