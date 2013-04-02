module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    distdir: 'dist',
    clean: ['<%= distdir %>'],
    uglify: {
      options: {
        mangle: false
      },
      my_target: {
        files: {
          '<%= distdir %>/src/js/app.js': 'src/js/app.js',
          '<%= distdir %>/src/js/controllers.js': 'src/js/controllers.js'
          
        }
      }
    },
    less: {
      development: {
        options: {
          yuicompress: true
        },
        files: {
          "<%= distdir %>/src/public/stylesheets/tetrinet.css": "src/public/stylesheets/tetrinet.less"
        }
      },
      production: {
        options: {
          yuicompress: true
        },
        files: {
           "<%= distdir %>/src/public/stylesheets/tetrinet.css": "src/public/stylesheets/tetrinet.less"
       }
     }
   },

  ,


copy: {
  main: {
    files: [
      {src: ['src/*'], dest: '<%= distdir %>/', filter: 'isFile'}, // includes files in path
      {src: ['src/**'], dest: '<%= distdir %>/'} // includes files in path and its subdirs
      ]
    }
  }
}
);
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.loadNpmTasks('grunt-string-replace');

  // Default task(s).
  grunt.registerTask('default', ['clean','copy','string-replace','less','uglify']);

};