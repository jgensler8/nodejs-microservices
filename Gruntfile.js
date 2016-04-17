module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
      options: {
        // this sets up node.js environment variables
        node: true
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'mochaTest', 'shell:run_tests']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          clearRequireCache: true
        },
        src: ['test/*.js', 'test/**/*.js']
      },
    },
    shell: {
      run_tests: {
        command: 'echo "does something fancy"'
      },
      demo: {
        command: 'echo "runs some script for building"'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');
  // tried to get color working
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['watch']);

};
