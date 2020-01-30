const gulp = require('gulp'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	rename = require('gulp-rename'),
	beautify = require('gulp-jsbeautify'),
	cssnano = require('gulp-cssnano'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	del = require('del'),
	tabify = require('gulp-tabify'),
	prettify = require('gulp-prettify'),
	sass = require('gulp-sass');

sass.compiler = require('node-sass');

gulp.task('html', function() {
	return gulp.src('app/*.html')
		.pipe(prettify({
			unformatted: []
		}))
		.pipe(tabify(2, true))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('scss', function() {
	return gulp.src('app/sass/*.scss')
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false 
		}))
		//.pipe(tabify(2, true))
		.pipe(cssnano())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('libs-js', function() {
	return gulp.src('app/js/libs/*.js')
		.pipe(concat('libs.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

gulp.task('scripts', function() {
	return gulp.src('app/js/*.js')
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function() {
	return gulp.src('app/img/*')
		.pipe(cache(imagemin({
			interlased: true,
			progressive: true,
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img'))
});

gulp.task('pic', function() {
	return gulp.src('app/pic/*/**')
		.pipe(cache(imagemin({
			interlased: true,
			progressive: true,
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/pic'))
});

gulp.task('graphic', ['img', 'pic']);

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('watch', ['browser-sync', 'scss', 'html', 'scripts'], function() {
	setTimeout(function() {
		gulp.watch('app/sass/**/*.scss', ['scss']);
	}, 500);
	gulp.watch('app/**/*.html', ['html']);
	gulp.watch('app/js/*.js', ['scripts']);
});

gulp.task('fonts', function() {
	gulp.src('app/fonts/*')
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('default', ['watch']);

gulp.task('build', ['clean', 'scss', 'libs-js', 'scripts', 'html', 'graphic', 'fonts']);