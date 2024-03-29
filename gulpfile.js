/*
 Copyright (C) 2016 Grigor Khachatryan <grig@i2vr.io>
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
 AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const rename = require("gulp-rename");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const sequence = require('run-sequence');
const del = require('del');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const size = require('gulp-size');
const connect = require('gulp-connect');

const JS = ['src/js/**/*.js', '!src/js/systemjs/system.js', '!src/js/rodinjs/resources/**/*', '!src/js/systemjs/glsl.js', '!src/js/{vendor,vendor/**}', '!src/js/Three.custom.js', '!src/js/THREE.GLOBAL.js'];
const SYSTEMJS = ['src/js/systemjs/*.js'];
const SASS = ['src/sass/**/*.scss', '!src/sass/{vendor,vendor/**}'];
const FONT = ['src/font/**/*.{ttf,woff,woff2,eof,svg}'];
const IMG = ['src/img/**/*.{jpg,jpeg,ico,png}'];
const SHADER = ['src/shader/**/*'];
const MODEL = ['src/model/**/*'];
const VIDEO = ['src/video/**/*'];
const EX_JS = ['examples/**/*.js', '!examples/**/*_c.js', '!examples/**/model/**/*.js', '!examples/**/models/**/*.js'];

const VENDOR = require('./vendor.json');
const RESOURCES = ['src/js/rodinjs/resources/**/*'];

const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

const UGLIFY_AGRESIVE = {
    // conditionals  : true,  // optimize if-s and conditional expressions
    // comparisons   : true,  // optimize comparisons
    // evaluate      : true,  // evaluate constant expressions
    // booleans      : true  // optimize boolean expressions
    preserveComments: 'license',
    mangle: true,
    compress: true
};

const SIZE_OPTIONS = {
    onLast: true,
    title: 'SASS -> ',
    // gzip: true,
    // showFiles: true,
    // showTotal: true,
    pretty: true
};

const ERROR_MESSAGE = {
    errorHandler: notify.onError("Error: <%= error.message %>")
};

gulp.task('js', () => {
    const s = size({title: 'JS -> ', pretty: true});
    return gulp.src(JS)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(babel())
        .pipe(s)
        .pipe(plumber.stop())
        .pipe(gulp.dest('./_build/js'))
        .pipe(notify({
            onLast: true,
            message: () => `JS - Total size ${s.prettySize}`
        }));
});

gulp.task('vendor', () => {
    for (let i = 0, ln = VENDOR.length; i < VENDOR.length; i++) {
        let module = VENDOR[i];
        let task = gulp.src(module.src);

        if (module.babelyfi) {
            task = task.pipe(plumber(ERROR_MESSAGE))
                .pipe(babel())
                .pipe(plumber.stop())
        }

        task.pipe(gulp.dest(`./_build/js/vendor${(module.dest || "/")}`))
            .pipe(gulp.dest(`./src/js/vendor${(module.dest || "/")}`));
    }

    return true;
});

gulp.task('resources', () => {
    return gulp.src(RESOURCES)
        .pipe(gulp.dest('./_build/js/rodinjs/resources'));
});

gulp.task('systemjs', () => {
    return gulp.src(SYSTEMJS)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(gulp.dest('./_build/js/systemjs'));
});

gulp.task('js-prod', () => {
    const s = size({title: 'JS production -> ', pretty: true});
    return gulp.src(JS)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(uglify(UGLIFY_AGRESIVE))
        .pipe(sourcemaps.write('.'))
        .pipe(s)
        .pipe(gulp.dest('./_build/js'))
        .pipe(notify({
            onLast: true,
            message: () => `JS(prod) - Total size ${s.prettySize}`
        }));
});

gulp.task('sass', () => {
    const s = size(SIZE_OPTIONS);
    return gulp.src(SASS)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(sourcemaps.write())
        .pipe(s)
        .pipe(gulp.dest('./_build/css'))
        .pipe(notify({
            onLast: true,
            message: () => `SASS - Total size ${s.prettySize}`
        }));
});

gulp.task('sass-prod', () => {
    const s = size(SIZE_OPTIONS);
    return gulp.src(SASS)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())
        .pipe(s)
        .pipe(gulp.dest('./_build/css'))
        .pipe(notify({
            onLast: true,
            message: () => `SASS(prod) - Total size ${s.prettySize}`
        }));
});

gulp.task('font', () => {
    gulp.src(FONT)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(gulp.dest('./_build/font'));
});

gulp.task('img', () => {
    gulp.src(IMG)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(gulp.dest('./_build/img'));
});

gulp.task('video', () => {
    gulp.src(VIDEO)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(gulp.dest('./_build/video'));
});

gulp.task('model', () => {
    gulp.src(MODEL)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(gulp.dest('./_build/model'));
});

gulp.task('shader', () => {
    gulp.src(SHADER)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(gulp.dest('./_build/shader'));
    // .pipe(connect.reload());
});

gulp.task('watch', () => {
    gulp.watch(EX_JS, ['examples']);
    gulp.watch(SASS, ['sass']);
    gulp.watch(JS, ['js']);
    gulp.watch(FONT, ['fonts']);
    gulp.watch(IMG, ['img']);
    gulp.watch(VIDEO, ['video']);
    gulp.watch(MODEL, ['model']);
    gulp.watch(SHADER, ['shader']);
});

gulp.task('clean', () => {
    return del(['./_build']);
});

gulp.task('examples', () => {
    const s = size({title: 'Examples -> ', pretty: true});
    return gulp.src(EX_JS)
        .pipe(plumber(ERROR_MESSAGE))
        .pipe(babel())
        .pipe(s)
        .pipe(rename({suffix: '_c'}))
        .pipe(plumber.stop())
        .pipe(gulp.dest('./examples'))
        // .pipe(gulp.dest('./old_examples'))
        .pipe(notify({
            onLast: true,
            message: () => `Examples - Total size ${s.prettySize}`
        }));
});

gulp.task('connect', () => {
    connect.server({
        root: './',
        port: 8000,
        livereload: true
    });
});


gulp.task('prod', (done) => {
    sequence('clean', ['js-prod', 'vendor', 'resources', 'systemjs', 'examples', 'sass-prod', 'font', 'img'], done);
});

gulp.task('default', (done) => {
    sequence('clean', ['js', 'vendor', 'resources', 'systemjs', 'examples', 'sass', 'font', 'img', 'connect', 'watch'], done);
});


/*
 npm install jshint gulp-jshint --save-dev
 var jshint = require('gulp-jshint');
 .pipe(jshint())
 .pipe(jshint.reporter('YOUR_REPORTER_HERE'));
 npm install --save-dev jshint-stylish
 var stylish = require('jshint-stylish');
 .pipe(jshint.reporter(stylish))


 */

