var microlib = require('./microlib');

module.exports = {
  prepAddTwo: function() {
    microlib.builder()
    .setServiceName("addtwo")
    .setServiceFunction(function(services, args, callback) {
      callback(null, args[0] + args[1]);
    })
    .build()
    .prep();
  },
  prepAddThree: function() {
    microlib.builder()
    .setServiceName("addthree")
    .addInjectedService("addtwo")
    .setServiceFunction(function(services, args, callback) {
      callback(null, serivces[0](args[0], args[1]) + args[3] );
    })
    .build()
    .prep();
  }
};
