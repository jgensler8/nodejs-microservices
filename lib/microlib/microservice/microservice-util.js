var util = require('util');
var path = require('path');
var os = require('os');
var fs = require('fs');
var fstream = require('fstream');
var swig = require('swig');
var tar = require('tar');
var Dockerfile = require('node-dockerfile');
var Docker = require('dockerode');

module.exports = {
  generateDockerfile: generateDockerfile,
  generateEntryScript: generateEntryScript,
  generateEntryScriptText: generateEntryScriptText,
  generateEntrypointScriptName: generateEntrypointScriptName,
  buildDockerfile: buildDockerfile,
  packageDockerfile: packageDockerfile,
  runDockerfile: runDockerfile
};


var templateEntryScript_src = path.join(__dirname, 'templateService.js.j2');
var template = swig.compileFile(templateEntryScript_src);
function generateEntrypointScriptName(microservice) {
  return util.format("%s.js", microservice.getServiceName());
}
function generateEntrypointScriptDestination(microservice) {
  return path.join(os.tmpdir(), generateEntrypointScriptName(microservice));
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
  return util.format("Dockerfile_%s", microservice.getServiceName());
}
function generateDockerfileDestination(microservice) {
  return path.join(os.tmpdir(), generateDockerfileName(microservice));
}
function generateDockerfile(microservice) {
  return new Dockerfile()
    // .maintainer('you <you@you.org>')
    .from('alpine-node')
    .copy(generateEntrypointScriptDestination(microservice), "/")
    .entryPoint(["node", generateEntrypointScriptName(microservice)])
    .writeStream()
    .pipe(fs.createWriteStream(generateDockerfileDestination(microservice)));
}


function generateDockerfilePackagedDestination(microservice) {
  return util.format("%s.tar", generateDockerfileDestination(microservice));
}
function packageDockerfile(microservice) {
  var packer = tar.Pack();
  var destination = fs.createWriteStream(generateDockerfilePackagedDestination(microservice));
  fstream.Reader({ path: generateDockerfileDestination(microservice), type: "File"})
    .pipe(packer)
    .pipe(destination);
}

function generateDockerTag(microservice) {
  return microservice.getServiceName();
}
function buildDockerfile(microservice) {
  return docker.buildImage(generateDockerfilePackagedDestination(microservice),
    {t: generateDockerTag(microservice)},
    function(err, response) {

      console.log("err", err);

      stream.pipe(process.stdout, {end: true});

      stream.on('end', function() {
        done();
      });

      console.log("response", response);
  });
}

function runDockerfile(microservice) {
  return docker.createContainer({ Image: generateDockerTag(microservice)}, function(err, container) {
    console.log("err", err);
    // console.log("container", container);
  });
}
