/**
 * @license AGPLv3 2014
 * @author indolering
 */

'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
//// Basic usage
gulp.task('default', function() {
  // Single entry point to browserify
  gulp.src('./scripts/speech.js')
    .pipe(browserify({
//      insertGlobals : true
      debug : !gulp.env.production
    }))
    .pipe(uglify({outSourceMap: true}))
    .pipe(gulp.dest('./site/'));
});

//// Basic usage
//gulp.task('compileTests', function() {
//  // Single entry point to browserify
//  gulp.src('./test/testNav.js')
//    .pipe(browserify({
////      insertGlobals : true
//      debug : true
//    }))
//    .pipe(gulp.dest('./test/compiled/'));
//});


