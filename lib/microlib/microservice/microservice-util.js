var util = require('util');
var path = require('path');
var os = require('os');
var fs = require('fs');
var fstream = require('fstream');
var tmp = require('tmp');
var swig = require('swig');
var tar = require('tar-fs');
var Dockerfile = require('node-dockerfile');
var Docker = require('dockerode');

module.exports = {
  generateDockerfile: generateDockerfile,
  generateEntryScript: generateEntryScript,
  generateEntryScriptText: generateEntryScriptText,
  generateEntrypointScriptName: generateEntrypointScriptName,
  buildDockerfile: buildDockerfile,
  runDockerfile: runDockerfile
};

var workingdir = tmp.dirSync();
// TODO: cleanup
// TODO: this isn't being generated for each build and weird things are happening
// for dependencies that live in the same directory
function tmpWorkingDir() {
  return workingdir.name;
}

var templateEntryScript_src = path.join(__dirname, 'templateService.js.j2');
var template = swig.compileFile(templateEntryScript_src);
function generateEntrypointScriptName(microservice) {
  return util.format("%s.js", microservice.getServiceName());
}
function generateEntrypointScriptDestination(microservice) {
  return path.join(tmpWorkingDir(), generateEntrypointScriptName(microservice));
}
function generateEntryScriptText(microservice) {
  return template({
    microlib_service_name: microservice.getServiceName(),
    microlib_injected_services: microservice.getInjectedServices(),
    microlib_service_function: microservice.getServiceFunction()
  });
}
function generateEntryScript(microservice) {
  return fs.writeFileSync(
    generateEntrypointScriptDestination(microservice),
    generateEntryScriptText(microservice) );
}


var docker = new Docker();
function generateDockerfileName(microservice) {
  // return util.format("Dockerfile_%s", microservice.getServiceName());
  return "Dockerfile";
}
function generateDockerfileDestination(microservice) {
  return path.join(tmpWorkingDir(), generateDockerfileName(microservice));
}
function generateDockerfile(microservice) {
  return new Dockerfile()
    // .maintainer('you <you@you.org>')
    .from('mhart/alpine-node')
    .run("npm install jayson")
    .copy(util.format("./%s", generateEntrypointScriptName(microservice)), "/")
    .entryPoint(["node", generateEntrypointScriptName(microservice)])
    .writeStream()
    .pipe(fs.createWriteStream(generateDockerfileDestination(microservice)));
}

function generateDockerTag(microservice) {
  return microservice.getServiceName();
}
function buildDockerfile(microservice) {
  var tarStream = tar.pack(tmpWorkingDir());
  return docker.buildImage(tarStream,
    {t: generateDockerTag(microservice)},
    function(err, response) {
      output.pipe(process.stdout);
  });
}

function runDockerfile(microservice) {
  return docker.createContainer({
      Image: generateDockerTag(microservice),
      Env: ["MICROLIB_SERVICE_PORT=9090", "MICROLIB_SERVICE_HOST=localhost"],
      PortBindings: { "9090/tcp": [{ "HostIp": "0.0.0.0", "HostPort": "9090"}]},
      name: generateDockerTag(microservice),
    },
    function(err, container) {
      console.log("err", err);
      console.log("container", container);
      container.start(function(err, data) {
        console.log("err", err);
        console.log("data", data);
      });
    }
  );
}
