var should = require('should');
var chai = require('chai');
var expect = chai.expect;

var app = require('../lib/app.js');

describe('microservice-util', function() {

  before(function() {
    app.run();
  });

  describe('when run', function() {
    it('should create a Dockerfile', function(done) {
      done();
    });
  });
});
