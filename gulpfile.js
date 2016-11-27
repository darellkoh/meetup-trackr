// const browserify = require('browserify');
// const gulp = require('gulp');
// const source = require("vinyl-source-stream");
// const reactify = require('reactify');

// gulp.task('browserify', () => {
// 	const b = browserify({
// 		entries: ['src/app.js'],
// 		debug: true
// 	});
// 	b.transform(reactify); // use the reactify transform
// 	return b.bundle()
// 		.pipe(source('main.js'))
// 		.pipe(gulp.dest('./dist'));
// });

// gulp.task('watch', () => {
// 	gulp.watch('src/*.js', ['browserify']);
// 	gulp.watch('src/*.jsx', ['browserify']);
// });

// gulp.task('default', ['watch', 'browserify']);
