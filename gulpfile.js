require('dotenv').config();

const { watch, series, src, dest } = require('gulp');
const browserSync = require('browser-sync').create();
const browserSync2 = require('browser-sync').create();

const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
// const concat = require('gulp-concat');
const rename = require('gulp-rename');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const webpackConfigProduction = require('./webpackprod.config.js');

const URL_PROXY = process.env.URL_PROXY;
const URL_REMPLAZOS = process.env.URL_REMPLAZOS;
const FOLDER_FROM = process.env.FOLDER_FROM;
const FOLDER_TO = process.env.FOLDER_TO;
const FOLDER_DIST = process.env.FOLDER_DIST;
const IP_LOCAL = process.env.IP_LOCAL;

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

// Copia  los scripts
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

// Webpack genera el bundle de los scripts en la carpeta `arquivos/webpack_files` para trabajar ES6
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
  return src([
    `${FOLDER_FROM}/**/*.jpg`,
    `${FOLDER_FROM}/**/*.png`,
    `${FOLDER_FROM}/**/*.svg`,
    `${FOLDER_FROM}/**/*.gif`,
  ])
    .pipe(
      rename(function(path) {
        // Remuevo los sub directorios dejando solo el directorio base, ejemplo: ./arquivos/css -> ./arquivos
        path.dirname = path.dirname.split('/')[0];
      })
    )
    .pipe(dest(FOLDER_TO))
    .pipe(browserSync.stream());
}

// Copia las fuentes
function taskFont() {
  return src(`${FOLDER_FROM}/arquivos/font/*.*`)
    .pipe(dest(`${FOLDER_TO}/arquivos/`))
    .pipe(browserSync.stream());
}

// Crea un servidor proxy y Vigila cambios en los archivos.
function taskWatch(cb) {
  // Static server
  browserSync.init(
    {
      open: false,
      rewriteRules: [
        {
          match: new RegExp(URL_REMPLAZOS, 'g'),
          fn: function() {
            /**
             * Remplaza las URLs por el segundo proxy creado ya que vtex tiene una url aparte
             * solo para los archivos
             */
            return `https://${IP_LOCAL}:3002`;
          },
        },
      ],
      proxy: URL_PROXY,
      serveStatic: [FOLDER_TO],
      /**
       * Permite modificar el buffer, e inyecta un html desde un archivo local
       * 1. en el layout de vtex agregar el tag: `<div></div><!--closepage-->` esta etiqueta sera buscada para inyectar el codigo
       * 2. en la variable asynfile ingresar el path del archivo local
       * 3. en el archivo local ingresar el tag `<page></page>` 'todo lo que esta dentro de este tag se inyectara encima de closepage `<div></div><!--closepage-->`
       */
      // snippetOptions: {
      //   rule: {
      //     // match: /<\/body>/i,
      //     match: /<\/div><!--closepage-->/i,
      //     fn: function(snippet, match) {
      //       const fs = require('fs');
      //       const asynfile = fs.readFileSync('./src/index-Home.html', 'utf8');
      //       let bodytext;

      //       // var m = asynfile.match(/<body[^>]*>([^<]*(?:(?!<\/?body)<[^<]*)*)<\/body\s*>/i); // ejemplo body
      //       var m = asynfile.match(/<page[^>]*>([^<]*(?:(?!<\/?page)<[^<]*)*)<\/page\s*>/i);
      //       if (m) bodytext = m[1];
      //       return bodytext + snippet + match;
      //     },
      //   },
      // },
    },
    function() {
      // Crea un segundo proxy solo para los archivos
      browserSync2.init({
        open: false,
        proxy: URL_REMPLAZOS,
        serveStatic: [FOLDER_TO],
      });
    }
  );

  // Vigila los cambios
  watch(`${FOLDER_FROM}/**/*.html`, taskHtml);
  watch(`${FOLDER_FROM}/**/*.css`, taskCss);
  watch(`${FOLDER_FROM}/**/*.scss`, taskSass);
  watch([`${FOLDER_FROM}/**/*.js`, `!${FOLDER_FROM}/arquivos/webpack-files/**/*.js`], taskJavascript);
  watch(`${FOLDER_FROM}/arquivos/webpack-files/**/*.js`, taskWebpack);
  watch(
    [`${FOLDER_FROM}/**/*.jpg`, `${FOLDER_FROM}/**/*.png`, `${FOLDER_FROM}/**/*.svg`, `${FOLDER_FROM}/**/*.gif`],
    taskImg
  );

  cb();
}

/**
 * MIN TASKS
 */
function taskCssMin() {
  return src(`${FOLDER_FROM}/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(rename(path => (path.dirname = '/')))
    .pipe(dest(FOLDER_DIST));
}

function taskJavascreiptMin() {
  return src(`${FOLDER_FROM}/arquivos/webpack-files/main.js`)
    .pipe(
      webpackStream(webpackConfigProduction),
      webpack
    )
    .pipe(dest(`${FOLDER_DIST}/`))
    .pipe(browserSync.stream());
}

exports.default = series(
  taskClean,
  taskSass,
  taskCss,
  taskJavascript,
  taskImg,
  taskFont,
  taskCssMin,
  taskJavascreiptMin
);
exports.watch = series(
  taskClean,
  taskHtml,
  taskSass,
  taskCss,
  taskJavascript,
  taskImg,
  taskFont,
  taskWebpack,
  taskWatch
);
