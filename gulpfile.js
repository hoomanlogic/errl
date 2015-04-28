var gulp = require('gulp');
var react = require('gulp-react');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

var onError = function (err) {  
    gutil.beep();
    console.log(err);
};

var jsLibs = [
    'bower_components/jquery/dist/jquery.min.js', 
    'bower_components/underscore/underscore-min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js',
    'bower_components/toastr/build/toastr.min.js', 
    'bower_components/Chart.js/Chart.min.js',
    'bower_components/errl_js/dist/errl.min.js',
    'bower_components/common_js/dist/common.min.js'
];

var cssLibs = [
    'bower_components/bootstrap/dist/css/bootstrap.min.css', 
    'bower_components/bootstrap/dist/css/bootstrap-theme.min.css', 
    'bower_components/fontawesome/css/font-awesome.min.css', 
    'bower_components/toastr/build/toastr.min.css'
];

var jsApp = [
    'src/client/js/*.js',
    'build/views.js'
];

var lessPaths = [
    'src/client/less/*.less'
];

var jsxPaths = [
    '../react_components/src/*.jsx', 
    'src/client/jsx/components/*.jsx', 
    'src/client/jsx/pages/*.jsx'
];

// TASK: Compile JSX source
gulp.task('compile-jsx', function () {
    return gulp.src(jsxPaths)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('views.js'))
        .pipe(react())
        .pipe(gulp.dest('build'));
});

// TASK: Compile LESS source
gulp.task('compile-less', function () {
    return gulp.src(lessPaths)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('app.css'))
        .pipe(less())
        .pipe(gulp.dest('src/server/css'))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('src/server/css'));
});

// TASK: Concat Js Libs
gulp.task('concat-js-libs', function () {
    return gulp.src(jsLibs)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('libs.min.js'))
        .pipe(gulp.dest('src/server/js'));
});

// TASK: Concat Js Internal Code
gulp.task('concat-js-app', ['compile-jsx'], function () {
    return gulp.src(jsApp)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest('src/server/js'))
        .pipe(rename(function (path) {
            path.basename += '.min';
        }))
        .pipe(uglify())
        .pipe(gulp.dest('src/server/js'));
});

// TASK: Concat Css Libs
gulp.task('concat-css-libs', function () {
    return gulp.src(cssLibs)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(concat('libs.min.css'))
        .pipe(gulp.dest('src/server/css'));
});

gulp.task('watch', function () {
    // Watch JSX source and recompile whenever a change occurs
    var jsxWatcher = gulp.watch(['../react_components/src/**', 'src/client/jsx/components/**', 'src/client/jsx/pages/**', 'src/client/js/**'], ['compile-jsx', 'concat-js-app']);
    jsxWatcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running task...');
    });

    // Watch LESS source and recompile whenever a change occurs
    var lessWatcher = gulp.watch(lessPaths, ['compile-less']);
    lessWatcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running task...');
    });
    
});

// TODO: Finish this to compile from local sources instead of bower
gulp.task('watch-local', function () {

    // Watch JSX source and recompile whenever a change occurs
    var jsxWatcher = gulp.watch(['../react_components/src/*.jsx'], ['compile-local-jsx-local', 'concat-local-js']);
    jsxWatcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running task...');
    });

    // Watch Internal JS Libraries for Updates
    var jsLibWatcher = gulp.watch(['../errl_js/dist/*.min.js', '../common_js/dist/common.min.js'], ['concat-js-libs']);
    jsLibWatcher.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running task...');
    }); 
});