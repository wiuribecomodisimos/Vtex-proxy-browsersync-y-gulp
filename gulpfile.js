require('dotenv').config();

const { watch, series, src, dest }  = require('gulp');
const browserSync                   = require('browser-sync').create();
const sass                          = require('gulp-sass');
const sourcemaps                    = require('gulp-sourcemaps');
const concat                        = require('gulp-concat');
const rename                        = require('gulp-rename');
const del                           = require('del');
const cssmin                        = require('gulp-cssmin');
const uglify                        = require('gulp-uglify');
const pipeline                      = require('readable-stream').pipeline;

const URL_PROXY                     = process.env.URL_PROXY;
const URL_REMPLAZOS                 = process.env.URL_REMPLAZOS;
const FOLDER_FROM                   = process.env.FOLDER_FROM;
const FOLDER_TO                     = process.env.FOLDER_TO;
const FOLDER_DIST                   = process.env.FOLDER_DIST;

/**
 * DEFAULT TASKS
 */

// Elimina folders
async function taskClean(cb) {
  return  await del([FOLDER_TO,FOLDER_DIST]);
}

// Copia los estilos
function taskCss(cb) {
  return  src(`${FOLDER_FROM}/**/*.css`)
            .pipe(rename(function(path){
              // Remuevo los sub directorios dejando solo el directorio base, ejemplo: ./arquivos/css -> ./arquivos
              path.dirname = path.dirname.split("/")[0];
            }))
            .pipe(dest(FOLDER_TO))
            .pipe(browserSync.stream())
}

// Precompila los archivos SASS
function taskSass(cb) {  
  return src(`${FOLDER_FROM}/**/*.scss`)
     .pipe(sourcemaps.init())
     .pipe(sass().on('error', sass.logError))
     .pipe(sourcemaps.write())
     .pipe(rename(function(path){
        // Remuevo los sub directorios dejando solo el directorio base, ejemplo: ./arquivos/css -> ./arquivos
        path.dirname = path.dirname.split("/")[0];
      }))
     .pipe(dest(FOLDER_TO))
     .pipe(browserSync.stream())
}


// Copia los scripts
function taskJavascript(cb) {
  return  src(`${FOLDER_FROM}/**/*.js`)
            .pipe(rename(function(path){
              // Remuevo los sub directorios dejando solo el directorio base, ejemplo: ./arquivos/css -> ./arquivos
              path.dirname = path.dirname.split("/")[0];
            }))
            .pipe(dest(FOLDER_TO))
            .pipe(browserSync.stream())
}


// Copia las imagenes
function taskImg(cb) {
  return  src([`${FOLDER_FROM}/**/*.jpg`,`${FOLDER_FROM}/**/*.png`])
            .pipe(dest(FOLDER_TO))
            .pipe(browserSync.stream())
}

// Crea un servidor proxy y Vigila cambios en los archivos.
function taskWatch(cb) {
  
  // Static server
  browserSync.init({
    open: false,
    rewriteRules: [{
      match: new RegExp(URL_REMPLAZOS,'g'),
      fn: function() {
          return ('/')
      }
    }],
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

  // Watchs
  watch(`${FOLDER_FROM}/**/*.css`, taskCss);
  watch(`${FOLDER_FROM}/**/*.scss`, taskSass);
  watch(`${FOLDER_FROM}/**/*.js`, taskJavascript);
  watch([`${FOLDER_FROM}/**/*.jpg`,`${FOLDER_TO}/**/*.png`], taskImg);
  
  // watch('dist/*.js', series(clean, javascript));

  cb();
}


/**
 * MIN TASKS
 */
function taskCssMin(cb) {
  return  src(`${FOLDER_TO}/**/*.css`)
            .pipe(cssmin())
            .pipe( dest(FOLDER_DIST) )
            .pipe(concat('styles.min.css'))
            .pipe( dest(`${FOLDER_DIST}/min`) )
}

function taskJavascreiptMin(cb) {
  return  pipeline(
            src(`${FOLDER_TO}/**/*.js`),
            uglify(),
            dest(FOLDER_DIST),
            concat('scripts.min.js'),
            dest(`${FOLDER_DIST}/min`)
          );
}


exports.default = series(taskClean, taskSass, taskCss, taskJavascript, taskImg, taskCssMin, taskJavascreiptMin);
exports.watch = series( taskClean, taskSass, taskCss, taskJavascript, taskImg, taskWatch );