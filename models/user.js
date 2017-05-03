
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var userCollection;

MongoClient.connect(process.env.MONGOLAB_URI, function(err, db) {
  assert.equal(null, err);
  userCollection = db.collection('users');


  /**
   * Retrieves a single user specified by id
   *
   * @param {string} id The user's id
   * @param {function} success Function called if user is found
   * @param {function} failure Function called if user cannot be found
   */
  exports.getUser = function(id, success, failure) {

    userCollection.find({'_id': ObjectID(id)}).toArray(function(err, users) {
      if (users.length >= 1) {
        renameId(users[0]);
        success(users[0]);
      } else {
        failure();
      }
    });
  }

  /**
   * Adds a new user
   *
   * @param {object} user User object. email, forename and surname should be set
   * @param {function} success Called if adding is successful
   * @param {function} failure Called if adding the user fails
   */
  exports.addUser = function(user, success, failure) {
    var createdDate = new Date();
    var newUser = {email: user.email,
                   forename: user.forename,
                   surname: user.surname,
                   created: createdDate.toISOString()}
    userCollection.insert(newUser, function(err, result) {
      if (err === null && 1 === result.result.n) {
        renameId(newUser);
        success(newUser);
      } else {
        failure();
      }
    });
  }

  /**
   * Deletes a user
   *
   * @param {string} id Id identifying the user to delete
   * @param {function} success Called if deletion is successful
   * @param {function} failure Called if deleting the user fails (normally because the user does not exist)
   */
  exports.deleteUser = function(id, success, failure) {
    userCollection.deleteOne({'_id': ObjectID (id)}, function(err, result) {
      if (err === null && 1 === result.result.n) {
        success();
      } else {
        failure();
      }
    });

  }

  /**
   * Modifies the properties of an existing user
   *
   * @param {string} id Id identifying the user to modify
   * @param {object} user User object. email, forename or surname may be set. All properties are optional.
   * @param {function} success Called if modification is successful
   * @param {function} failure Called if modifying the user fails
   */
  exports.updateUser = function(id, user, success, failure) {

    userCollection.updateOne({'_id': ObjectID (id)},
                             {$set: user},
                             function(err, result) {
      if (err === null && 1 === result.result.n) {
        //now just do a find to get the new object to return
        userCollection.find({'_id': ObjectID(id)}).toArray(function(err, users) {
          if (users.length >= 1) {
            renameId(users[0]);
            success(users[0]);
          }
          else {
            failure();
          }
        });
      }
      else {
        failure();
      }
    });
  }

  /**
   * Lists users. By default, lists all users. If any properties are defined in
   * 'filter', the returned users will be constrained to those exactly matching
   * those properties.
   *
   * @todo Listing all users won't scale well
   *
   * @param {object} filter Object containing properties on which to filter the results.
   * @param {function} callback Called on completion. Parameter 'users' contains an array of users.
   */
  exports.listUsers = function(filter, callback) {
    userCollection.find(filter).toArray(function(err, users) {
      for(user of users) {
        renameId(user);
      }
      callback(users);
    });

  }

  var renameId = function(user) {
    user.id = user._id;
    delete user._id;
  }

});
