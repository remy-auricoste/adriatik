'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

gulp.task('scripts', function () {
  return gulp.src(conf.paths.getJsPaths())
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe(browserSync.reload({ stream: true }))
    .pipe($.size())
});
