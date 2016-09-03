var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	imagemin = require('gulp-imagemin'),
	responsive = require('gulp-responsive');

// Paths to various files
var paths = {
    scripts: ['js/*.js'],
    styles: ['styles/*.css'],
    images: ['image/*.{png,jpg}'],
    content: ['index.html']
};

gulp.task('minify-css', function() {
  return gulp.src(paths.styles)
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});


gulp.task('imgOpt', () =>
    gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
);

gulp.task('scripts', function(){
	gulp.src(paths.scripts)
		.pipe(uglify())
		.pipe(gulp.dest('js/app.min.js'));
});


gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('responsive', function () {
  return gulp.src('image/logo_foursquare.png')
    .pipe(responsive({
      'logo_foursquare.png': {
        width: 100,
        quality: 90
      }
      }))
    .pipe(gulp.dest('dist'));
});


gulp.task('watch', function(){
	gulp.watch(paths.scripts, ['scripts']);
	gulp.watch(paths.styles, ['minify-css']);
	gulp.watch(paths.lint, ['lint']);
	gulp.watch(paths.images, ['imgOpt']);
});

gulp.task('default', ['scripts', 'styles', 'watch', 'lint', 'imgOpt']);
