var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    rename = require('gulp-rename'),
    cssnano = require('gulp-cssnano'),
    browserify = require('gulp-browserify'),
    del = require('del'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache');

gulp.task('sass', function () {
   return gulp.src('app/sass/**/*.sass')
       .pipe(sass())
       .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
       .pipe(gulp.dest('app/css'))
       .pipe(browserSync.reload({stream:true}))
});

gulp.task('cssnano', function () {
   return gulp.src([
       'app/libs/jquery-arcticmodal/jquery.arcticmodal-0.3.css',
       'app/libs/jquery-arcticmodal/dark.css'])
       .pipe(concat('jquery-arcticmodal.min.css'))
       .pipe(cssnano())
       .pipe(gulp.dest('app/css'))
       .pipe(browserSync.reload({stream:true}))
});

gulp.task('browserify', function () {
   return gulp.src('app/js/common.js')
       .pipe(browserify())
       .pipe(rename('result.js'))
       .pipe(gulp.dest('app/js'))
});

gulp.task('css-libs', function () {
   return gulp.src([
       'node_modules/bootstrap/dist/css/bootstrap.min.css',
       'node_modules/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css',
       'app/css/jquery-arcticmodal.min.css'])
       .pipe(concat('libs.min.css'))
       .pipe(gulp.dest('app/css'))
});

gulp.task('libs', function () {
    gulp.series('browserify');
   return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/lodash/lodash.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
        'node_modules/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js',
        'app/libs/jquery-arcticmodal/jquery.arcticmodal-0.3.min.js',
        'app/js/result.js'])
       .pipe(concat('result.min.js'))
       .pipe(gulp.dest('app/js'))
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
           baseDir: './app'
        },
        notify: false
    });
});

gulp.task('clean', async function() {
    return del.sync('dist');
});

gulp.task('code', function() {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('prebuild', async function() {

    var buildCss = gulp.src([
        'app/css/main.css',
        'app/css/libs.min.css'])
        .pipe(gulp.dest('dist/css'));

    var buildJs = gulp.src('app/js/result.min.js')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));

    var buildJSON = gulp.src('app/json/*.json')
        .pipe(gulp.dest('dist/json'));
});

gulp.task('watch', function () {
    gulp.watch('app/sass/**/*.sass', gulp.parallel('sass'));
    gulp.watch('app/*.html', gulp.parallel('code'));
    gulp.watch('app/**/*.*'). on('change',browserSync.reload);
    gulp.watch(['app/js/common.js', 'app/libs/**/*.js'], gulp.parallel('libs'));
});

gulp.task('default', gulp.parallel('libs','watch','sass','cssnano','browser-sync', 'css-libs'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'sass', 'libs'));