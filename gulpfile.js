require('dotenv').config();

const { watch, series, src, dest } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const del = require('del');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;
const babel = require('gulp-babel');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

const URL_PROXY = process.env.URL_PROXY;
const URL_REMPLAZOS = process.env.URL_REMPLAZOS;
const FOLDER_FROM = process.env.FOLDER_FROM;
const FOLDER_TO = process.env.FOLDER_TO;
const FOLDER_DIST = process.env.FOLDER_DIST;

/**
 * DEFAULT TASKS
 */

// Elimina folders
async function taskClean() {
  return await del([FOLDER_TO, FOLDER_DIST]);
}

// Copia los html
function taskHtml() {
  return src(`${FOLDER_FROM}/**/*.html`)
    .pipe(
      rename(function(path) {
        // Remuevo los sub directorios dejando solo el directorio base, ejemplo: ./arquivos/css -> ./arquivos
        path.dirname = path.dirname.split('/')[0];
      })
    )
    .pipe(dest(FOLDER_TO))
    .pipe(browserSync.stream());
}

// Copia los estilos
function taskCss() {
  return src(`${FOLDER_FROM}/**/*.css`)
    .pipe(
      rename(function(path) {
        // Remuevo los sub directorios dejando solo el directorio base, ejemplo: ./arquivos/css -> ./arquivos
        path.dirname = path.dirname.split('/')[0];
      })
    )
    .pipe(dest(FOLDER_TO))
    .pipe(browserSync.stream());
}

// Precompila los archivos SASS
function taskSass() {
  return src(`${FOLDER_FROM}/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(
      rename(function(path) {
        // Remuevo los sub directorios dejando solo el directorio base, ejemplo: ./arquivos/css -> ./arquivos
        path.dirname = path.dirname.split('/')[0];
      })
    )
    .pipe(dest(FOLDER_TO))
    .pipe(browserSync.stream());
}

// Copia los scripts
function taskJavascript() {
  return src([`${FOLDER_FROM}/**/*.js`, `!${FOLDER_FROM}/arquivos/webpack-files/**/*.js`])
    .pipe(
      rename(function(path) {
        // Remuevo los sub directorios dejando solo el directorio base, ejemplo: ./arquivos/css -> ./arquivos
        path.dirname = path.dirname.split('/')[0];
      })
    )
    .pipe(dest(FOLDER_TO))
    .pipe(browserSync.stream());
}

// Webpack genera el bundle de los scripts en la carpeta `arquivos/webpack_files`
function taskWebpack() {
  return src(`${FOLDER_FROM}/arquivos/webpack-files/main.js`)
    .pipe(
      webpackStream(webpackConfig),
      webpack
    )
    .pipe(dest(`${FOLDER_TO}/arquivos`))
    .pipe(browserSync.stream());
}

// Copia las imagenes
function taskImg() {
  return src([`${FOLDER_FROM}/**/*.jpg`, `${FOLDER_FROM}/**/*.png`])
    .pipe(dest(FOLDER_TO))
    .pipe(browserSync.stream());
}

// Crea un servidor proxy y Vigila cambios en los archivos.
function taskWatch(cb) {
  // Static server
  browserSync.init({
    open: false,
    rewriteRules: [
      {
        match: new RegExp(URL_REMPLAZOS, 'g'),
        fn: function() {
          return '/';
        },
      },
    ],
    proxy: URL_PROXY,
    serveStatic: [FOLDER_TO],

    // Permite modificar el buffer, por ejemplo agregar un script
    //
    // snippetOptions: {
    //   rule: {
    //       match: /<\/head>/i,
    //       fn: function (snippet, match) {
    //           return '<link rel="stylesheet" type="text/css" href="/_custom.css"/>' + snippet + match;
    //       }
    //   }
    // },
  });

  // Vigila los cambios
  watch(`${FOLDER_FROM}/**/*.html`, taskHtml);
  watch(`${FOLDER_FROM}/**/*.css`, taskCss);
  watch(`${FOLDER_FROM}/**/*.scss`, taskSass);
  watch([`${FOLDER_FROM}/**/*.js`, `!${FOLDER_FROM}/arquivos/webpack-files/**/*.js`], taskJavascript);
  watch(`${FOLDER_FROM}/arquivos/webpack-files/**/*.js`, taskWebpack);
  watch([`${FOLDER_FROM}/**/*.jpg`, `${FOLDER_TO}/**/*.png`], taskImg);

  cb();
}

/**
 * MIN TASKS
 */
function taskCssMin() {
  return src(`${FOLDER_TO}/**/*.css`)
    .pipe(cssmin())
    .pipe(dest(FOLDER_DIST))
    .pipe(concat('styles.min.css'))
    .pipe(dest(`${FOLDER_DIST}/min`));
}

function taskJavascreiptMin() {
  return pipeline(
    src(`${FOLDER_TO}/**/*.js`),
    uglify(),
    dest(FOLDER_DIST),
    concat('scripts.min.js'),
    dest(`${FOLDER_DIST}/min`)
  );
}

exports.default = series(taskClean, taskSass, taskCss, taskJavascript, taskImg, taskCssMin, taskJavascreiptMin);
exports.watch = series(taskClean, taskHtml, taskSass, taskCss, taskJavascript, taskImg, taskWebpack, taskWatch);
