var gulp       = require('gulp'),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    buffer     = require('vinyl-buffer'),
    uglify     = require('gulp-uglify'),
    reactify   = require('reactify'),
    fs         = require('fs');

gulp.task('default', function() {
  var b = browserify({
    entries   : './lib/barista.js',
    debug     : true, 
    transform : [reactify]
  });

  return b.bundle()
          .pipe(source('./lib/barista.min.js'))
          .pipe(buffer())
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(uglify())
          .pipe(gulp.dest('./barista.min.js'))
          .pipe(fs.createReadStream('./lib/barista.min.js').pipe(fs.createWriteStream('./example/vendor/barista.min.js')));
});