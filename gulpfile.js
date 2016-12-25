"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var cssmin = require('gulp-cssmin');
var del = require("del");
var server = require("browser-sync").create();

gulp.task("style", function() {
  gulp
    .src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: [
        "last 2 versions"
      ]})
    ]))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("clean", function() {
 return del("build");
});

gulp.task('cssmine', function () {
    gulp.src('css/**/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('css'));
});

gulp.task('svg', function () {
  return gulp
    .src('img/*.svg')
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(gulp.dest('img'));
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: ".",
    notify: false,
    open: true,
    cors: true,
    ui: false
});

gulp.task("build", function() {
  run("style", "cssmine");
});

  gulp.task("copy", function() {
    return gulp.src([
      "fonts/**/*.{woff,woff2}",
      "img/**",
      "js/**",
      "*.html"
    ], {
      base: "."
    })
    .pipe(gulp.dest("build"));
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("css/**/*.css", ["cssmine"]);
  gulp.watch("*.html").on("change", server.reload);
});
