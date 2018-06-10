const gulp = require("gulp");

// плагины галпа, объявлять не нужно, используем как $gp.имяПлагина (без приставки gulp-)
const $gp = require("gulp-load-plugins")();

const browserSync = require("browser-sync").create();
const reload = browserSync.reload;
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");
const moduleImporter = require("sass-module-importer");
const del = require("del");
const cssunit = require('gulp-css-unit');

const SRC_DIR = "src";
const DIST_DIR = "public/";
const ROOT_PATH = `./${DIST_DIR}`;

// стили
gulp.task("styles", () => {
  return gulp
    .src(`${SRC_DIR}/styles/main.scss`)
    .pipe($gp.plumber())
    .pipe($gp.sassGlob())
    .pipe($gp.sourcemaps.init())
    .pipe(
      $gp.sass({
        outputStyle: "compressed",
        importer: moduleImporter()
      })
    )
    .pipe(
      $gp.autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe($gp.sourcemaps.write())
    .pipe($gp.rename({ suffix: ".min" }))
    .pipe(gulp.dest(`${DIST_DIR}/styles/`))
    .pipe(reload({ stream: true }));
});

// очистка
gulp.task("clean", () => {
  return del(ROOT_PATH);
});

// собираем скрипты webpack
gulp.task("scripts", () => {
  return gulp
    .src(`${SRC_DIR}/scripts/main.js`)
    .pipe($gp.plumber())
    .pipe($gp.webpack(webpackConfig, webpack))
    .pipe(gulp.dest(`${DIST_DIR}/scripts`))
    .pipe(reload({ stream: true }));
});

// сервер node.js
gulp.task("nodemon", done => {
  let started = false;
  $gp
    .nodemon({
      script: "server.js",
      watch: "server.js"
    })
    .on("start", () => {
      if (started) return;
      done();
      started = true;
    });
});

// dev сервер + livereload (встроенный)
gulp.task(
  "server",
  gulp.series("nodemon", done => {
    browserSync.init({
      proxy: "http://localhost:3000",
      port: 8080,
      open: false
    });
  })
);

// галповский вотчер
gulp.task("watch", () => {
  gulp.watch(`${SRC_DIR}/styles/**/*.scss`, gulp.series("styles"));
  gulp.watch(`${SRC_DIR}/scripts/**/*.js`, gulp.series("scripts"));
  gulp.watch(`views/pages/*`).on("change", reload);
});

// GULP:RUN
gulp.task(
  "default",
  gulp.series(
    "clean",
    gulp.parallel("styles", "scripts"),
    gulp.parallel("watch", "server")
  )
);
