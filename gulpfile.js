'use strict';

var gulp            = require('gulp');
var sass            = require('gulp-sass');
var browserSync     = require('browser-sync');
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var notify          = require("gulp-notify");
var concat          = require('gulp-concat');
var bourbon         = require("bourbon").includePaths;
var del             = require('del');
var uglify          = require('gulp-uglify');
var rigger          = require('gulp-rigger');

gulp.task('html', function () {
	return gulp.src('./dev/src/index.html')
		.pipe(rigger())
		.pipe(gulp.dest('./dev'))
		.pipe(browserSync.reload({stream:true}));
});

gulp.task('js', function() {
	return gulp.src([
//-----------------------Include libraries-------------------------
		'./dev/assets/scripts/libs/barbajs/barba.min.js',
//-----------------------------------------------------------------
		])
	.pipe(concat('scripts.min.js'))
	//.pipe(uglify()) // Minimize JS
	.pipe(gulp.dest('./dev/assets/scripts'))
	.pipe(browserSync.reload({stream: true}));
});



gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: './dev'
		},
		notify: false
	});
});

gulp.task('sass-base', function () {
	setTimeout(() => {
  return gulp.src('./dev/assets/scss/base.scss')
  	.pipe(sourcemaps.init())
    .pipe(sass({
		includePaths: [bourbon],
		outputStyle: 'compressed'
    }).on("error", notify.onError()))
    .pipe(autoprefixer(['last 3 versions', '> 5%', 'Firefox ESR', 'ie >= 7']))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dev/assets/css'))
    .pipe(browserSync.reload({stream: true}));
  },200);
});

gulp.task('sass-main', function () {
	setTimeout(() => {
	return gulp.src('./dev/assets/scss/main.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({
		includePaths: [bourbon]
    }).on("error", notify.onError()))
	.pipe(autoprefixer(['last 3 versions', '> 5%', 'Firefox ESR', 'ie >= 7']))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./dev/assets/css'))
	.pipe(browserSync.reload({stream: true}));
	},200);
});

gulp.task('sass', ['sass-base', 'sass-main']);  

gulp.task('watch', ['html', 'sass', 'js', 'browser-sync'], function() {
	gulp.watch('./dev/assets/scss/**/*.scss', ['sass']);
	gulp.watch('./dev/assets/scripts/**/*.js', browserSync.reload);
	gulp.watch("./dev/src/**/*.html", ['html']);
});

gulp.task('build', ['removerel', 'html', 'sass', 'js'], function() {

	var buildFiles = gulp.src([
		'./dev/*.html',
		]).pipe(gulp.dest('./rel'));

	var buildCss = gulp.src([
		'./dev/assets/css/main.css',
		'./dev/assets/css/base.css',
		'./dev/assets/css/ui-library.css',
		]).pipe(gulp.dest('./rel/assets/css'));
	

	var buildJs = gulp.src([
		'./dev/assets/scripts/scripts.min.js',
		'./dev/assets/scripts/common.js',
		]).pipe(gulp.dest('./rel/assets/scripts'));

	var buildFonts = gulp.src([
		'./dev/assets/fonts/**/*',
		]).pipe(gulp.dest('./rel/assets/fonts'));

});

gulp.task('removerel', function() { return del.sync('./rel'); });
 
gulp.task('default', ['watch']);