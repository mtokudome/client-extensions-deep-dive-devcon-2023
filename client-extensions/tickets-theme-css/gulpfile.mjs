import browserSync from 'browser-sync';
import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import sass from 'sass-embedded';

const browserSyncInstance = browserSync.create();
const gulpSassInstance = gulpSass(sass);

gulp.task('copy:html', () => {
	return gulp.src('index.html').pipe(gulp.dest('build'));
});

gulp.task('copy:src', () => {
	return gulp.src('src/**/*').pipe(gulp.dest('build/buildTheme'));
});

function compileSass(cssFile) {
	return gulp
		.src(cssFile)
		.pipe(
			gulpSassInstance({
				includePaths: [
					'node_modules',
					'node_modules/bourbon/core',
					'../../node_modules/bourbon/core',
				],
			}).on('error', gulpSassInstance.logError)
		)
		.pipe(gulp.dest('build/css'))
		.pipe(browserSyncInstance.stream());
}

gulp.task(
	'clay:css',
	gulp.series('copy:src', () => compileSass('build/buildTheme/css/clay.scss'))
);

gulp.task(
	'main:css',
	gulp.series('copy:src', () => compileSass('build/buildTheme/css/main.scss'))
);

gulp.task(
	'serve',
	gulp.series('copy:html', 'main:css', 'clay:css', () => {
		browserSyncInstance.init({
			notify: false,
			open: false,
			server: './build',
			socket: {
				domain: 'localhost:3000',
			},
		});

		gulp.watch('src/**/*', gulp.parallel('main:css', 'clay:css'));
	})
);
