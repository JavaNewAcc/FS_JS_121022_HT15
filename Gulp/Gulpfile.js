const { src, dest, parallel, watch } = require('gulp');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
const beautify = require('gulp-beautify');


function scssToCss() {
    return src('app/css/styles.scss')
        .pipe(plumber())
        .pipe(rename('styles.css'))
        .pipe(cleanCSS())
        .pipe(dest('dist/css/'))
}

function minifyHTML() {
    return src('app/*.html')
        .pipe(plumber())
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(dest('dist/'))
}

function minifyJS() {
    return src('app/js/*.js')
        .pipe(plumber())
        .pipe(beautify.js({ indent_size: 2 }))
        .pipe(dest('dist/js/'))
}

function minifyIMG() {
    return src('app/img/*.gif')
        .pipe(imagemin())
        .pipe(dest('dist/img/'))
}

exports.default = parallel(scssToCss, minifyHTML, minifyIMG, minifyJS);