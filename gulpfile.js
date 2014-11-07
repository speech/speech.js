'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var zip = require('gulp-zopfli');
var rename = require('gulp-rename');
var newer = require('gulp-newer');
var smoosher = require('gulp-smoosher');

gulp.task('default', ['inline'], function() {

  gulp.src('./dist/index.html')
    .pipe(zip())
    .pipe(gulp.dest("./dist/"));

});

gulp.task('inline', function(){

  gulp.src('./src/index.html')
    .pipe(smoosher())
    .pipe(gulp.dest("./dist/"));

});


gulp.task('setupTests', function () {

  //Source Files

  gulp.src('./src/*.js')
    .pipe(newer("./test/"))
    .pipe(gulp.dest("./test/"));

  gulp.src('./src/*.css')
    .pipe(newer("./test/"))
    .pipe(gulp.dest("./test/"));

  //Libraries
  var libs = './test/libs/';

  gulp.src('./node_modules/mocha/mocha.js')
    .pipe(newer(libs))
    .pipe(gulp.dest(libs));

  gulp.src('./node_modules/mocha/mocha.css')
    .pipe(newer(libs))
    .pipe(gulp.dest(libs));

  gulp.src('./node_modules/chai/chai.js')
    .pipe(newer(libs))
    .pipe(gulp.dest(libs));

  gulp.src('./node_modules/qunitjs/qunit/*')
    .pipe(newer(libs))
    .pipe(gulp.dest(libs));

});