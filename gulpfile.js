'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var inlinesource = require('gulp-inline-source');
var pug = require('gulp-pug');

gulp.task('sass_css_minify', function() {
    gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cssnano())

    .pipe(gulp.dest('./pre-build/css/'));
});

gulp.task('js_minify', function() {
    gulp.src('./js/**/*', { cwd: 'src' })
        .pipe(uglify())
        .pipe(gulp.dest('./pre-build/js/'));
});

gulp.task('pugify', function() {
    return gulp.src('index.pug', { cwd: 'src' })
        .pipe(pug())
        .pipe(gulp.dest('./pre-build/'));
});

gulp.task('copy_lib_assets', function() {
    return gulp.src('lib/**/*', { cwd: 'src' })
        .pipe(gulp.dest('./pre-build/lib/'));
});

gulp.task('move_json', function() {
    return gulp.src('json/**/*', { cwd: 'src' })
        .pipe(gulp.dest('./dist/json'));
})

gulp.task('move_font', function() {
    return gulp.src('font/**/*', { cwd: 'src' })
        .pipe(gulp.dest('./dist/font'));
})

gulp.task('inlinesource', ['pugify', 'copy_lib_assets'], function() {
    return gulp.src('./pre-build/index.html')
        .pipe(inlinesource())
        .pipe(gulp.dest('./dist'));
});

gulp.task('move_cname', function() {
    return gulp.src('CNAME', { cwd: 'src' })
        .pipe(gulp.dest('./dist'));
});

gulp.task('move_bg', function() {
    return gulp.src('img/**/*', { cwd: 'src' })
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('default', function() {
    gulp.watch('src/**/*', [
        'sass_css_minify', 'js_minify', 'pugify', 'copy_lib_assets', 'inlinesource', 'move_json', 'move_font', 'move_cname', 'move_bg'
    ]);
});