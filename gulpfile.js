var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	imagemin = require('gulp-imagemin'),
	responsive = require('gulp-responsive'),
	pump = require('pump'),
	beautify = require('gulp-beautify'),
	htmlminify = require("gulp-html-minify");
    cssbeautify = require('gulp-cssbeautify');

// Paths to various files
var paths = {
    scripts: ['src/js/**/*.js'],
    styles: ['src/styles/*.css'],
    images: ['src/image/*.{png,jpg,svg}'],
    content: ['src/index.html']
};


gulp.task('build-html' , function(){
    return gulp.src('src/index.html')
        .pipe(htmlminify())
        .pipe(gulp.dest("dist/"));
});

gulp.task('minify-css', function() {
  return gulp.src(paths.styles)
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/styles'));
});


gulp.task('beautify', function() {
  gulp.src(paths.scripts)
    .pipe(beautify({indentSize: 4}))
    .pipe(gulp.dest('src/js'));
});


gulp.task('css-beautify', function() {
    return gulp.src(paths.styles)
        .pipe(cssbeautify())
        .pipe(gulp.dest('src/styles'));;
});

gulp.task('imgOpt', () =>
    gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/image'))
);

gulp.task('compress', function (cb) {
  pump([
        gulp.src(paths.scripts),
        uglify(),
        gulp.dest('dist/js/')
    ],
    cb
  );
});

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('responsive', function () {
  return gulp.src(paths.images)
    .pipe(responsive({
      '*.png': {
        width: 75,
        quality: 80
      }
      }))
    .pipe(gulp.dest('dist'));
});


gulp.task('watch', function(){
	gulp.watch('src/index.html', ['build-html']);
	gulp.watch(paths.scripts, ['compress']);
	gulp.watch(paths.styles, ['minify-css']);
	gulp.watch(paths.images, ['imgOpt']);
});

gulp.task('default', ['css-beautify', 'beautify', 'watch', 'compress', 'build-html', 'minify-css', 'imgOpt']);
