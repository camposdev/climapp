var gulp = require( 'gulp' ),
    concat = require( 'gulp-concat' ),
    uglify = require( 'gulp-uglify' ),
    stylus = require( 'gulp-stylus' ),
    cssmin = require( 'gulp-cssmin' );


// Build vendors bower
gulp.task( 'vendors', function() {

  gulp.src( [
    'bower_components/angular/angular.js',
    'bower_components/angular-cookies/angular-cookies.js',
    'bower_components/angular-i18n/angular-locale_pt-br.js',
    'bower_components/chart.js/dist/Chart.js',
    'bower_components/angular-chart.js/dist/angular-chart.js'
  ] )
    .pipe( concat( 'vendor.js' ) )
    .pipe( gulp.dest( 'assets/js' ) );

  gulp.src( 'bower_components/weather-icons/css/weather-icons.min.css' )
    .pipe( concat( 'vendor.css' ) )
    .pipe( gulp.dest( 'assets/css' ) );

  gulp.src( 'bower_components/weather-icons/font/**/*' )
    .pipe( gulp.dest( 'assets/font' ) );

});

// Build main file js
gulp.task( 'buildJS', function() {

  return gulp.src( 'app/**/*js' )
    .pipe( concat( 'main.js' ) )
    .pipe( gulp.dest( 'assets/js/' ));

});

// Build main file css
gulp.task( 'buildCSS', function() {

  return gulp.src( 'assets/styl/app.styl' )
    .pipe( stylus( {compress: false} ) )
    .pipe( concat( 'main.css' ) )
    .pipe( gulp.dest( 'assets/css/' ) );

});

// Watch
gulp.task('watch', function() {

  gulp.watch( 'app/**/*js', ['buildJS'] );
  gulp.watch( 'assets/styl/**/*.styl', ['buildCSS'] );

});

// build for development
gulp.task( 'default', ['vendors', 'buildJS', 'buildCSS', 'watch'] );
