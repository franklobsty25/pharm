import gulp from 'gulp';
import * as nunjucks from 'gulp-nunjucks';

// // Task to process Nunjucks templates
// gulp.task('buildViews', () => {
//   return gulp
//     .src('views/*.html')
//     .pipe(nunjucks.nunjucksCompile())
//     .pipe(gulp.dest('./public'));
// });

// Default task
// gulp.task('default', gulp.series('buildViews'));

// gulp.task('buildHtmx', () => {
//   return gulp
//     .src([
//       './node_modules/htmx.org/dist/htmx.js',
//       './node_modules/htmx.org/dist/htmx.min.js',
//     ])
//     .pipe(gulp.dest('./public/javascripts'));
// });

// // Default task
// gulp.task('default', gulp.series('buildHtmx'));

gulp.task('buildJWTDecode', () => {
  return gulp
    .src([
      './node_modules/jwt-decode/build/cjs/index.js',
      './node_modules/jwt-decode/build/esm/index.js',
    ])
    .pipe(gulp.dest('./public/javascripts/jwt-decode'));
});

// Default task
gulp.task('default', gulp.series('buildJWTDecode'));
