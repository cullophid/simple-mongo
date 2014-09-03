'use strict';
var mongo = require('mongodb'),
  lo = require('lodash'),
  P = require('bluebird'),
  client = mongo.MongoClient;

P.promisifyAll(mongo);
exports.connect = function(url) {
  return client.connectAsync(url)
    .then(this._addCollections)
    .then(function (db) {
      module.exports.db = db;
      return db;
    });

};
exports._addCollections = function (db) {
  return module.exports._getCollections(db)
    .then(module.exports._extractCollectionNames)
    .then(function (collections) {
      collections.forEach(function (collection) {
        if(db.hasOwnProperty(collection)) {
          throw new Error(collection, 'is a registered mongo property and cannot be used as a collection name');
        }
        db[collection] = db.collection(collection);
      });
      return db;
    });
};

exports._getCollections = function (db) {
  return db.collectionsInfoAsync()
    .then(function(cursor) {
      return cursor.toArrayAsync();
    });
};
exports._extractCollectionNames = function (items) {
  return items.reduce(function (list, item) {
      var name = item.name.split('.')[1];
      if (name !== 'system' && list.indexOf(name) === -1) {
        list.push(name);
      }
      return list;
  },[]);
};
