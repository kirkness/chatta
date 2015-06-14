module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.initConfig({
    uglify: {
      main: {
        files: {
          'chatta.min.js': 'chatta.js'
        }
      }
    }
  });

  grunt.registerTask('default', 'uglify:main')
}
