var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    oldie = require('oldie'),
    imagemin = require('gulp-imagemin'),
    browserify = require('browserify'),
    clean = require('gulp-clean');


gulp.task('clean', function () {
    gulp.src('../public/html/*', {read: false})
        .pipe(clean({force: true}));
    gulp.src('../public/css/*', {read: false})
        .pipe(clean({force: true}));
    gulp.src('../public/js/*/*', {read: false})
        .pipe(clean({force: true}));
    gulp.src('../public/img/*', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('buildClean', function () {
    gulp.src('../build/**', {read: false})
        .pipe(clean({force: true}));
});


gulp.task('server', ['publicStyles', 'templates'], function() {
    browserSync({
        server: {
            baseDir: '../public/'
        }
    });
});


gulp.task('templates', function() {
    gulp.src('templates/pages/*.jade')
        .pipe( jade({
            locals: true,
            pretty: true
            }) )
        .pipe( gulp.dest('../public/html/') )
});

gulp.task('html', function() {
    gulp.src('../public/html/*.html')
        .pipe( gulp.dest('../build/') )
});


gulp.task('publicStyles', function() {
    var processors = [
        autoprefixer({browsers: ['> 1%']}),
        cssnano()
    ];
    gulp.src('styles/inheritable-css/*.css')
        .pipe( gulp.dest('../public/css') );

    gulp.src('styles/*.scss')
        .pipe( sass().on('error', sass.logError) )
        .pipe( sourcemaps.init() )
        .pipe( sourcemaps.write() )
        .pipe( gulp.dest('../public/css') )
        .pipe( postcss(processors) )
        .pipe( gulp.dest('../public/css') );
});


//gulp.task('bundle', function() {
//    browserify('scripts/page-observer/script.js')
//        .bundle()
//        .pipe(gulp.dest('public/js/module.js'));
//});


gulp.task('publicScripts', function() {
    gulp.src('scripts/vendor/**')
        .pipe( gulp.dest('../public/js/vendor/') );

    gulp.src('scripts/*', !'page-observer')
        .pipe( concat('main.js') )
        //.pipe( uglify() )
        .pipe( gulp.dest('../public/js/') );
});



gulp.task('publicImages', function() {
    gulp.src('images/**')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe ( gulp.dest('../public/img') );
});


gulp.task('watch', function() {
    gulp.watch('scripts/**/*.js', ['publicScripts']);
    gulp.watch('styles/**/*.scss', ['publicStyles']);
    gulp.watch('templates/*/*.jade', ['templates']);
    gulp.watch(['scripts/**/*.js', 'styles/**/*.scss', 'templates/*/*.jade'], {cwd: ''}, reload);
});

//Dev > Public task
gulp.task('default', ['clean', 'publicImages', 'templates', 'publicStyles', 'publicScripts', 'server', 'watch']);

gulp.task('build', ['buildClean', 'buildImages', 'html', 'buildStyles', 'publicScripts']);

