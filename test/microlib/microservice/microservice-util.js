var should = require('should');
var chai = require('chai');
var expect = chai.expect;

var microservice = require('../../../lib/microlib/microservice/index.js');
var microservice_util = require('../../../lib/microlib/microservice/microservice-util.js');

describe('microservice-util', function() {
  var ms;
  before(function() {
    var builder = microservice.MicroserviceBuilder();
    var sampleFunction = function() {
      console.log('sizzle');
    };
    ms = builder
      .setServiceName('pie')
      .setServiceFunction(sampleFunction)
      .addInjectedService('anInjectedService')
      .build();
  });

  describe('generateEntrypointScriptName', function() {
    describe('when given a custom microservice', function() {
      var name;
      before(function() {
        name = microservice_util.generateEntrypointScriptName(ms);
      });

      it('should return a string', function(done) {
        expect(name).to.be.a('string');
        done();
      });

      it('should contain the service name', function(done) {
        expect(name).to.contain('pie');
        done();
      });
    });
  });

  describe('generateEntryScriptText', function() {

    var result;
    before(function() {
      result = microservice_util.generateEntryScriptText(ms);
    });

    describe('when given a custom microservice', function() {
      it('should return a string', function(done) {
        expect(result).to.be.a('string');
        done();
      });

      it('should generate a template with the custom name', function(done) {
        expect(result).to.contain('pie');
        done();
      });

      it('should generate a template with the custom function', function(done) {
        expect(result).to.contain('sizzle');
        done();
      });
    });
  });

});
