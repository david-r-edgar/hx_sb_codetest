
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';


// Use connect method to connect to the server
/*MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  insertDocuments(db, function() {
    db.close();
  });
});*/


var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}



var nextId = 0;

exports.getUser = function(userId) {

  var createdDate = new Date();
  var user = {id: userId,
              email: "xyz@example.com",
              forename: "david",
              surname: "edgar",
              created: createdDate.toISOString()}
  return user;
}

exports.addUser = function(user) {

  var id = nextId;
  nextId ++;
  var createdDate = new Date();
  var newUser = {id: id,
                 email: user.email,
                 forename: user.forename,
                 surname: user.surname,
                 created: createdDate.toISOString()}

  return newUser;
}

exports.deleteUser = function(userId) {


}

exports.updateUser = function(userId, email, forename, surname) {
  //find user

  //update email, forename, surname

}

exports.searchByEmail = function(email) {

  return user;
}
