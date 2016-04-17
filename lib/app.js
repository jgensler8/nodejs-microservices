var microlib = require('./microlib');

module.exports = {
  run: function() {
    microlib.builder()
    .setServiceName("addTwo")
    .setServiceFunction(function(services, args) {
      return args[0] + args[1];
    })
    .build()
    .prep();
    // .run();
  }
};
