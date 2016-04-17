
var microservice_util = require('./microservice-util');

module.exports = {
  Microservice: Microservice,
  MicroserviceBuilder: MicroserviceBuilder
};

function Microservice(aMicroserviceBuilder){
  var microlib_service_name = aMicroserviceBuilder.microlib_service_name;
  var microlib_injected_services = aMicroserviceBuilder.microlib_injected_services.slice(0);
  var microlib_function = aMicroserviceBuilder.microlib_function;

  return {
    getServiceName: function() {
      return microlib_service_name;
    },
    getInjectedServices: function() {
      return microlib_injected_services;
    },
    getServiceFunction: function() {
      return microlib_function;
    },
    prep: function() {
      microservice_util.generateEntryScript(this);
      microservice_util.generateDockerfile(this);
      microservice_util.buildDockerfile(this);
      return this;
    },
    run: function() {
      microservice_util.runDockerfile(this);
      return this;
    }
  };
}

function MicroserviceBuilder(){
  return {
    microlib_service_name: "default_name",
    microlib_injected_services: [],
    microlib_function: "console.log('hello world');",

    setServiceName: function(service_name) {
      this.microlib_service_name = service_name.toLowerCase();
      return this;
    },
    addInjectedService: function(injected_service) {
      this.microlib_injected_services.push(injected_service);
      return this;
    },
    setServiceFunction: function(service_function) {
      this.microlib_function = service_function.toString();
      return this;
    },
    build: function() {
      return new Microservice(this);
    },
  };
}
