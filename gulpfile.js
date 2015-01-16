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

// TASK: Compile JSX source
gulp.task('compile-jsx', function () {
    return gulp.src(['src/client/jsx/pages/StatusPage.jsx'])
		.pipe(plumber({
			errorHandler: onError
		}))
        .pipe(concat('views.js'))
        .pipe(react())
        .pipe(gulp.dest('src/server/js'));
});

// TASK: Concat Js Libs
gulp.task('concat-js-libs', function () {
    return gulp.src(['lib/jquery/jquery-1.11.1.min.js', 'lib/bootstrap/js/bootstrap.min.js', 'lib/toastr/js/toastr.min.js', 'lib/chart/Chart.js'])
		.pipe(plumber({
			errorHandler: onError
		}))
        .pipe(concat('libs.min.js'))
        .pipe(gulp.dest('src/server/js'));
});

// TASK: Concat Css Libs
gulp.task('concat-css-libs', function () {
    return gulp.src(['lib/bootstrap/css/bootstrap.min.css', 'lib/bootstrap/css/bootstrap-theme.min.css', 'lib/fontawesome/css/font-awesome.min.css', 'lib/toastr/css/toastr.min.css'])
		.pipe(plumber({
			errorHandler: onError
		}))
        .pipe(concat('libs.min.css'))
        .pipe(gulp.dest('src/server/css'));
});