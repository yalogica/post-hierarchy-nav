import browserSync from 'browser-sync';
import { deleteSync } from 'del';
import path from 'path';
import * as sass from 'sass';
import rename from 'gulp-rename';
import cached from 'gulp-cached';
import debug from 'gulp-debug';
import gsass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleancss from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import notify from 'gulp-notify';
import gulp from 'gulp';

const config = {
    host: 'http://debug.local',
    paths: {
        dist: './dist',
        wordpress: 'w:/localwp/debug/app/public/wp-content/plugins/post-hierarchy-nav'
    },
    routes: {
        copy: [
            'src/*.txt',
            'src/languages/**/*'
        ],
        scss: ['src/assets/css/**/*.scss'],
        js: ['src/assets/js/**/*.js'],
        php: ['src/index.php', 'src/post-hierarchy-nav.php', 'src/includes/**/*.php'],
        components: {
            gutenberg: [
                'src/monorepo/packages/navigation-block/build/**/*'
            ]
        }
    },
    autoprefixerOptions: {
        overrideBrowserslist: ['last 2 versions'],
        cascade: false
    }
};

const handleError = (err) => {
    notify.onError({
        title: 'Gulp Error',
        message: 'Error: <%= error.message %>'
    })(err);
    this.emit('end');
};

const do_clean = (done) => {
    deleteSync([config.paths.dist, config.paths.wordpress], { force: true });
    done();
};

const do_browserSync = (done) => {
    browserSync.init({
        proxy: {
            target: config.host
        },
        middleware: function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            next();
        },
        notify: false
    });
    done();
};

const do_copy = () => {
    return gulp.src( config.routes.copy, { base: 'src', encoding: false })
    .pipe(cached('cache_copy'))
    .pipe(debug({ title: 'Copying:' }))
    .pipe(gulp.dest(config.paths.dist))
    .pipe(gulp.dest(config.paths.wordpress))
    .pipe(browserSync.stream());
};

const do_scss = () => {
    return gulp.src( config.routes.scss, { base: 'src' })
    .pipe(cached('cache_scss'))
    .pipe(debug({ title: 'Compiling SCSS:' }))
    .pipe(gsass(sass)().on('error', handleError))
    .pipe(autoprefixer(config.autoprefixerOptions)).on('error', handleError)
    .pipe(cleancss({compatibility: 'ie8'}))
    .pipe(gulp.dest(config.paths.dist))
    .pipe(gulp.dest(config.paths.wordpress))
    .pipe(browserSync.stream());
};

const do_js = () => {
    return gulp.src( config.routes.js, { base: 'src' })
    .pipe(cached('cache_js'))
    .pipe(debug({ title: 'Compiling JS:' }))
    .pipe(uglify({
        output: {
            beautify: false,
            comments: '/^!|@preserve|@license|@cc_on/i'
        }
    }).on('error', handleError))
    .pipe(gulp.dest(config.paths.dist))
    .pipe(gulp.dest(config.paths.wordpress))
    .pipe(browserSync.stream());
};

const do_php = () => {
    return gulp.src( config.routes.php, { base: 'src' })
    .pipe(cached('cache_php'))
    .pipe(debug({ title: 'Compiling PHP:' }))
    .pipe(gulp.dest(config.paths.dist))
    .pipe(gulp.dest(config.paths.wordpress))
    .pipe(browserSync.stream());
};

const do_component_gutenberg = () => {
    return gulp.src( config.routes.components.gutenberg, { base: 'src/monorepo/packages' })
    .pipe(debug({ title: 'Compiling Component "gutenberg":' }))
    .pipe(rename(function(file) {
        const parts = file.dirname.split(path.sep);
        if (parts[parts.length - 1] === 'build') parts.pop();
        file.dirname = parts.join(path.sep);
    }))
    .pipe(gulp.dest(path.join(config.paths.dist, 'assets/blocks')))
    .pipe(gulp.dest(path.join(config.paths.wordpress, 'assets/blocks')))
    .pipe(browserSync.stream());
};

const do_watch = (done) => {
    gulp.watch(config.routes.copy, do_copy);
    //gulp.watch(config.routes.scss, do_scss);
    gulp.watch(config.routes.php, do_php);
    gulp.watch(config.routes.components.gutenberg, do_component_gutenberg);
    done();
};

const do_tasks = gulp.series(
    do_clean,
    do_browserSync,
    do_copy,
    //do_scss,
    do_php,
    do_component_gutenberg,
    do_watch
);

export default do_tasks;