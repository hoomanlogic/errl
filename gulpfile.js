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
    return gulp.src(['../react_components/src/**', 'src/client/jsx/components/*.jsx', 'src/client/jsx/pages/*.jsx'])
		.pipe(plumber({
			errorHandler: onError
		}))
        .pipe(concat('views.js'))
        .pipe(react())
        .pipe(gulp.dest('src/server/js'));
});

// TASK: Compile LESS source
gulp.task('compile-less', function () {
    return gulp.src(['src/client/less/definitions/**', 'src/client/less/*.less'])
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
    return gulp.src(['lib/jquery/jquery-1.11.1.min.js', 'lib/underscore/underscore.min.js', 'lib/bootstrap/js/bootstrap.min.js', 'lib/toastr/js/toastr.min.js', 'lib/chart/Chart.js', '../errl_js/dist/*.min.js'])
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

gulp.task('watch', function () {
	// Watch JSX source and recompile whenever a change occurs
	var jsxWatcher = gulp.watch(['../react_components/src/**', 'src/client/jsx/components/**', 'src/client/jsx/pages/**'], ['compile-jsx']);
	jsxWatcher.on('change', function (event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running task...');
	});

	// Watch LESS source and recompile whenever a change occurs
	var lessWatcher = gulp.watch(['src/client/less/definitions/**', 'src/client/less/*.less'], ['compile-less']);
	lessWatcher.on('change', function (event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running task...');
	});
	
	// Watch Internal JS Libraries for Updates
	var jsLibWatcher = gulp.watch(['../errl_js/dist/*.min.js'], ['concat-js-libs']);
	jsLibWatcher.on('change', function (event) {
		console.log('File ' + event.path + ' was ' + event.type + ', running task...');
	});
});