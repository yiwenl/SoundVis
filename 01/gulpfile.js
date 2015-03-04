var gulp        = require('gulp');
var browserSync = require('browser-sync');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream2')
var uglify      = require('gulp-uglify');
var sass        = require('gulp-ruby-sass');
var prefix      = require('gulp-autoprefixer');
var reload      = browserSync.reload;

//	BROWSERIFY
gulp.task('browserify', function() {
	var bundleStream = browserify('./src/js/app.js')
	.bundle()
	.on('error', function(err){
		console.log(err.message);
		this.end();
	});

	bundleStream
	.pipe(source('bundle.js'))
	.pipe(gulp.dest('./bundle/'));
});

//	COMPILE FOR BUILD
gulp.task('compile', function() {
	var bundleStream = browserify('./src/js/app.js')
	.bundle()
	.on('error', function(err){
		console.warn(err.message);
		this.end();
	});
 
	bundleStream
	.pipe(source('bundle.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./bundle/'));
});

gulp.task('watch', function() {
	gulp.watch('src/js/*.js', ['browserify', browserSync.reload]);
	gulp.watch('src/scss/*.scss', ['sass']);
	// gulp.watch("scss/*.scss", ['sass']);
});

gulp.task('sass', function() {
	return sass('./src/scss/main.scss') 
	.on('error', function (err) {
	  console.error('Error!', err.message);
	})
	.pipe(prefix({
			browsers: ['last 2 versions'],
			cascade: false
		}))
	.pipe(gulp.dest('css'))
	.pipe(reload({stream:true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: "./"
		},
		watchOptions: {
			debounceDelay: 1000
		}
	});
});

gulp.task('default', ['watch', 'browserify', 'browser-sync']);
