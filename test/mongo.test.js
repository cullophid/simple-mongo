'use strict';
var chai = require('chai'),
  should = chai.should(),
  mongo = require('../'),
  sinon = require('sinon');

chai.use(require('chai-as-promised'));

describe('Mongo', function() {
  describe('_extractCollectionNames', function() {
    it('should return only the right collections', function() {
      var input = require('./helper/collections.json').list,
        collections = mongo._extractCollectionNames(input);
        collections.should.be.an.Array;
        collections.should.have.property('length', 12, collections);
    });
  });
});
