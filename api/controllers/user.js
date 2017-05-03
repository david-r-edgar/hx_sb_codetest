'use strict';

var util = require('util');

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

  if (!validateId(requestedUserId)) {
      res.statusMessage = "Invalid ID";
      res.status(400).end();
  } else {
    userModel.getUser(requestedUserId, function(user) {
        res.json(user);
    }, function() {
      res.statusMessage = "User not found";
      res.status(404).end();
    });
  }
}

/**
 * Handles the POST /user request
 *
 * @param {object} req The request object
 * @param {object} res The result object
 */
function addUser(req, res) {
  //basic validation
  //TODO we should really check that forename and surname are composed of
  //alphabetic characters (perhaps allowing for UTF-8 non-Latin characters?)
  //TODO and we could give more helpful error information
  if ((!req.swagger.params.user.value.email) ||
      (!req.swagger.params.user.value.forename) ||
      (!req.swagger.params.user.value.surname) ||
      (!validateEmail(req.swagger.params.user.value.email)) ||
      (req.swagger.params.user.value.forename.length < 3) ||
      (req.swagger.params.user.value.surname.length < 3)) {

    res.statusMessage = "Invalid parameter";
    res.status(400).end();
  }
  else {

    //FIXME email should be unique

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
}

/**
 * Handles the PUT /user/{id} request
 *
 * @param {object} req The request object
 * @param {object} res The result object
 */
function updateUser(req, res) {
  //basic validation
  var requestedUserId = req.swagger.params.id.value;
  if ((req.swagger.params.user.value.email &&
        !validateEmail(req.swagger.params.user.value.email)) ||
      (req.swagger.params.user.value.forename
        && req.swagger.params.user.value.forename.length < 3) ||
      (req.swagger.params.user.value.surname
        && req.swagger.params.user.value.surname.length < 3)) {
    res.statusMessage = "Invalid parameter";
    res.status(400).end();
  } else if (!validateId(requestedUserId)) {
    res.statusMessage = "Invalid ID";
    res.status(400).end();
  } else {
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
}

/**
 * Handles the DELETE /user/{id} request
 *
 * @param {object} req The request object
 * @param {object} res The result object
 */
function deleteUser(req, res) {
  var requestedUserId = req.swagger.params.id.value;
  if (!validateId(requestedUserId)) {
    res.statusMessage = "Invalid ID";
    res.status(400).end();
  } else {
    userModel.deleteUser(requestedUserId, function(user) {
        res.json({message: "deleted user " + requestedUserId});
        res.status(200).end();
      }, function() {
      res.statusMessage = "User not found";
      res.status(404).end();
    });
  }
}

/**
 * Handles the GET /users request
 *
 * @param {object} req The request object
 * @param {object} res The result object
 */

//TODO email should be urlencoded

function listUsers(req, res) {
  var filter = {}
  if (req.swagger.params.filterEmail.value !== undefined) {
    filter.email = req.swagger.params.filterEmail.value;
  }
  if (req.swagger.params.filterForename.value !== undefined) {
    filter.forename = req.swagger.params.filterForename.value;
  }
  if (req.swagger.params.filterSurname.value !== undefined) {
    filter.surname = req.swagger.params.filterSurname.value;
  }
  userModel.listUsers(filter, function(users) {
    res.json(users);
    res.status(200).end();
  });
}


//I didn't write this, just copied from stackoverflow.
//It's not bulletproof / 100% correct...
function validateEmail(email) {
  var re = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/;
  return re.test(email);
}

function validateId(id) {
  var re = /^[0-9a-fA-F]{24}$/;
  return re.test(id);
}
