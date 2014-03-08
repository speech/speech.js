/**
 * @license AGPLv3 2014
 * @author indolering
 */

'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var zip = require('gulp-zopfli');
var closure = require('gulp-closure-compiler');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


gulp.task('test', function() {
  gulp.src('./scripts/index.js', {read: false})
    .pipe(browserify({
      insertGlobals: false,
      debug: true
    }))
    .pipe(rename('speech.js'))
    .pipe(gulp.dest('./test/'));
});

gulp.task('production', function() {

  gulp.src('./scripts/index.js', {read: false})
    .pipe(browserify({
      insertGlobals: false,
      debug: true,
      transform: ['uglifyify'],
      'global-transform': true
    }))
    .pipe(rename('speech.js'))
//    .pipe(uglify({outSourceMap: true}))
    .pipe(gulp.dest('./spx/meta/'));
});

gulp.task('babel', function() {
  gulp.src('./babel/src/babel.js')
    .pipe(closure({compilation_level: 'ADVANCED_OPTIMIZATIONS'}))
    .pipe(rename('babel.mini.js'))
    .pipe(gulp.dest('./babel/'));

  gulp.src('./babel/src/babel.js')
    .pipe(closure({compilation_level: 'ADVANCED_OPTIMIZATIONS'}))
    .pipe(zip())
    .pipe(rename('babel.mini.js.gz'))
    .pipe(gulp.dest('./babel/'));
});
