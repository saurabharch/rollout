import pkg from "gulp";
const { src, dest, series, watch } = pkg;
import gulp from "gulp";
import nodemon from "gulp-nodemon";
import less from "gulp-less";
import colors from "colors";
import cleanCSS from "gulp-clean-css";
import minify from "gulp-minify";
import rename from "gulp-rename";
import babel from "gulp-babel";

const nodemonOptions = {
  script: "src/index.js",
  ext: "js json",
  env: { NODE_ENV: "development" },
  verbose: false,
  ignore: [],
  watch: [
    "src/lib/*",
    "src/controllers/*",
    "src/config/*",
    "src/routes/*",
    "src/index.js"
  ]
};

function lessCss() {
  return gulp
    .src("src/public/stylesheets/less/**/*.less")
    .pipe(babel({ plugins: ["@babel/transform-runtime"] }))
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(less({ paths: ["src/public/stylesheets/less"] }))
    .pipe(rename({ dirname: "src/public/stylesheets", extname: ".css" }))
    .pipe(gulp.dest("./src/"));
}

function compressJS() {
  return src([
    "src/public/javascripts/*.js",
    "!src/public/javascripts/*.min.js"
  ])
    .pipe(babel({ plugins: ["@babel/transform-runtime"] }))
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(minify({ ext: { src: ".js", min: ".min.js" } }))
    .pipe(dest("src/public/javascripts"));
}

function compressCss() {
  return src([
    "src/public/stylesheets/*.css",
    "!src/public/stylesheets/*.min.css"
  ])
    .pipe(babel({ plugins: ["@babel/transform-runtime"] }))
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename({ dirname: "src/public/stylesheets", extname: ".min.css" }))
    .pipe(dest("./src/"));
}

function compressThemeCss() {
  return src(["src/views/themes/**/*.css", "!src/views/themes/**/*.min.css"])
    .pipe(babel({ plugins: ["@babel/transform-runtime"] }))
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename({ extname: ".min.css" }))
    .pipe(dest("src/views/themes/"));
}

function compressThemeJS() {
  return src(["src/views/themes/**/*.js", "!src/views/themes/**/*.min.js"])
    .pipe(babel({ plugins: ["@babel/transform-runtime"] }))
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(minify({ ext: { src: ".js", min: ".min.js" } }))
    .pipe(dest("src/views/themes/"));
}

// run the tasks
gulp.task(
  "default",
  series(lessCss, compressJS, compressCss, compressThemeCss, compressThemeJS)
);

gulp.task("watch", done => {
  // Watch LESS files and generate CSS
  watch(["src/public/stylesheets/less/**/*.less"], async () => {
    lessCss();
    console.log(colors.blue("CSS generation complete"));
  });

  // run, watch and restart app
  nodemon(nodemonOptions).once("quit", () => {
    done();
  });
});
