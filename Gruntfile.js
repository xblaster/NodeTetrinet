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
          '<%= distdir %>/src/public/js/app.js': 'src/public/js/app.js',
          '<%= distdir %>/src/public/js/lib/angular.js': 'src/public/js/lib/angular.js',
          '<%= distdir %>/src/public/js/jquery-latest.js': 'src/public/js/jquery-latest.js',
          '<%= distdir %>/src/public/js/controllers.js': 'src/public/js/controllers.js'
          
        }
      }
    },
    less: {
      development: {
        options: {
          yuicompress: true
        },
        files: {
          "<%= distdir %>/src/public/stylesheets/tetrinet.css": "src/public/stylesheets/tetrinet.less",
          "src/public/stylesheets/tetrinet.css": "src/public/stylesheets/tetrinet.less"
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

  
jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        node: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        angular: true,
        jQuery: true
      },
      all: ['src/public/js/app.js','src/public/js/controllers.js',
            'src/app.js']
    },

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

   grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('default', ['clean','less','copy','uglify'/*,'jshint'*/]);

};