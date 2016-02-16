const gulp = require('gulp');
const eslint = require('gulp-eslint');
const webserver = require('gulp-webserver');
const webpack = require('webpack');

const dest = __dirname + '/dist';

gulp.task('default', ['webpack', 'lint'], () => {});

gulp.task('lint', function () {
    return gulp.src(['js/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('webpack', function(callback) {
    webpack({
        context: __dirname + '/js',
        entry: './app.js',
        output: {
            path: dest,
            filename: 'bundle.js'
        },
        module: {
            loaders: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            }]
        }
    }, (err) => {
        if (err) console.dir(err);
    });
    callback();
});

gulp.task('webserver', ['webpack'], function() {
    gulp.src('./')
        .pipe(webserver({
            livereload: {
                enable: true,
                filter: function (name) {
                    return name.match(new RegExp(dest));
                }
            },
            open: 'index.html'
        }));
    gulp.watch(['js/**/*.js', 'index.html'], ['lint', 'webpack']);
});
