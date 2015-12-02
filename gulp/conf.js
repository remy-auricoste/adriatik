/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');
var path = require("path");

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
  e2e: 'e2e',
  js: {
    main: [
      '/lib/*.js',
      '/app/**/*.module.js',
      '/app/**/*.js'
    ],
    test: [
      '/test/**/*.mock.js',
      '/test/**/*.spec.js'
    ]
  },
  getJsPaths: function() {
    var self = this;
    return self.js.main.map(function(relPath) {
      return path.join(exports.paths.src, relPath);
    }).concat(self.js.test.map(function(relPath) {
      return path.join('!'+self.src, relPath);
    }));
  },
  getJsPathsForTest: function() {
    var self = this;
    return self.js.main.concat(self.js.test).map(function(relPath) {
      return path.join(exports.paths.src, relPath);
    });
  }
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  exclude: [/jquery/, /\/bootstrap\.js$/, /\/bootstrap-sass\/.*\.js/, /\/bootstrap\.css/],
  directory: 'bower_components'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};

exports.npm = {
  export: {
    Meta: "rauricoste-meta",
    Socket: "rauricoste-websocket-room-client"
  }
}
