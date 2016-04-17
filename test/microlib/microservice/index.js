var should = require('should');
var chai = require('chai');
var expect = chai.expect;

var microservice = require('../../../lib/microlib/microservice/index.js');

describe('microservice', function() {
  describe('MicroserviceBuilder', function() {
    describe('when given no parameters', function() {

      var result;
      before(function() {
        var builder = microservice.MicroserviceBuilder();
        result = builder.build();
      });

      it('should build an Object', function(done) {
        expect(result).to.be.an('object');
        done();
      });

      it('should have a default name', function(done) {
        expect(result.getServiceName()).to.equal('default_name');
        done();
      });

      it('should have no injected services', function(done) {
        expect(result.getInjectedServices()).to.have.lengthOf(0);
        done();
      });

      it('should have a default function', function(done) {
        expect(result.getServiceFunction()).to.contain('hello world');
        done();
      });

    });

    describe('when setting the function', function() {

      var result;
      before(function() {
        var sampleFunction = function() {
          console.log('TESTING');
        };
        var builder = microservice.MicroserviceBuilder();
        result = builder.setServiceFunction(sampleFunction).build();
      });

      it('should be read from getFunction and be a string', function(done) {
        expect(result.getServiceFunction()).to.be.a('string');
        done();
      });

      it('should be read from getFunction and be a string', function(done) {
        expect(result.getServiceFunction()).to.contain('TESTING');
        done();
      });
    });

    describe('when creating building multiple microservices', function(done) {

      var builder, defaultResult, customResult;

      before(function(){
        builder = microservice.MicroserviceBuilder();
        defaultResult = builder.build();
        var sampleFunction = function() {
          console.log('TESTING');
        };
        customResult = builder
          .setServiceName("newName")
          .addInjectedService("someService")
          .setServiceFunction(sampleFunction)
          .build();
      });

      it('should not modify the first ones name', function(done) {
        expect(defaultResult.getServiceName()).to.not.equal(customResult.getServiceName());
        done();
      });

      it('should not modify the first ones injected services', function(done) {
        expect(defaultResult.getInjectedServices()).to.have.lengthOf(0).and.not.equal(customResult.getInjectedServices().length);
        done();
      });

      it('should not modify the first ones function', function(done) {
        expect(defaultResult.getServiceFunction()).to.contain('hello world').and.not.contain('TESTING');
        done();
      });


    });
  });
});
