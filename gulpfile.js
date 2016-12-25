"use strict";

var gulp = require("gulp");
var del = require("del");
var rename = require("gulp-rename");
var runSequence = require("run-sequence");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var imagemin = require("gulp-imagemin");
var csso = require("gulp-csso");

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
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("svg", function () {
  return gulp
    .src([
      "img/**/*.svg",
      "!img/img.svg"
    ])
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(gulp.dest("img"));
});

gulp.task("svgmin", function () {
  return gulp
    .src([
      "img/**/*.svg",
      "!img/img.svg"
    ])
    .pipe(svgmin())
    .pipe(gulp.dest("build/img"))
});

gulp.task("imagemin", function() {
  gulp
    .src([
      "img/**/*.{jpg,jpeg,png,gif}"
    ])
    .pipe(imagemin())
    .pipe(gulp.dest("build/img"))
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: "build",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html").on("change", server.reload);
});

gulp.task("build", function() {
  runSequence("clean", "style", "copy", "svgmin", "imagemin");
});

gulp.task("copy", function() {
  gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/img.svg",
    "*.html"
  ], {
    base: "."
  })
  .pipe(gulp.dest("build"));
});
