// pretty simple build file for TSMT Graph tests
const gulp       = require('gulp');
const typescript = require('gulp-tsc'); 
const tscConfig  = require('./tsconfig.json');
const mocha      = require('gulp-mocha');

// compile the source code and test suite
gulp.task('compile', function () {
    return gulp
    .src([
      './test/graph.specs.ts',
      './src/**/*.ts'
    ], { base: "." })
    .pipe(typescript(tscConfig.compilerOptions))
    .pipe(gulp.dest('.'))
});

gulp.task('test', function () {
  return gulp.src("./test/graph.specs.js", {read:false})
  .pipe(mocha({reporter:'spec'}));
});
