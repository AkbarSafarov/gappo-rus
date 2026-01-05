import gulp from 'gulp';
import gulpIf from 'gulp-if';
import fileInclude from 'gulp-file-include';
import browser from 'browser-sync';
import clean from 'gulp-clean';
import debug from 'gulp-debug';
import path from 'path';

// Style
import sass from 'gulp-sass';
import * as sassCompiler from 'sass';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import smartGrid from 'smart-grid';
import groupMediaQueries from 'gulp-group-css-media-queries';
import autoPrefixer from 'gulp-autoprefixer';

// JavaScript
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import minifyJS from 'gulp-minify';

import javascriptObfuscator from 'gulp-javascript-obfuscator';
import changed from 'gulp-changed';

const browserSync = browser.create();
const sassInstance = sass(sassCompiler);

const fileIncludeSettings = {
    prefix: '@@',
    basepath: '@file'
};

const smartGridStart = (cb) => {
    smartGrid("./src/styles/vendor", {
        outputStyle: "scss",
        filename: "_smart-grid",
        columns: 12,
        offset: "15px",
        mobileFirst: true,
        mixinNames: {
            container: "wrap",
            row: "row",
        },
        container: {
            maxWidth: '1370px',
            fields: "15px"
        },
        breakPoints: {
            // bootstrap bp
            x4l: {
                width: '2560px'
            },
            x3l: {
                width: '1920px'
            },
            x2l: {
                width: '1400px'
            },
            xl: {
                width: '1200px'
            },
            lg: {
                width: '992px'
            },
            md: {
                width: '768px'
            },
            sm: {
                width: '576px'
            },
            // + very small
            xs: {
                width: '400px',
            }
        }
    });
    cb();
};

const path_list = {
    root: (env) => env === 'dev' ? './build/' : './dist/',
    html: (env) => env === 'dev' ? './build/' : './dist/',
    styles: (env) => env === 'dev' ? './build/styles/' : './dist/styles/',
    images: (env) => env === 'dev' ? './build/img/' : './dist/img/',
    fonts: (env) => env === 'dev' ? './build/fonts/' : './dist/fonts/',
    scripts: (env) => env === 'dev' ? './build/js/' : './dist/js/',
    libs: (env) => env === 'dev' ? './build/libs/' : './dist/libs/',
};

const paths = (env = 'dev') => ({
    root: path_list.root(env),
    html: {
        src: [
            './src/html/**/*.html',
            '!./src/html/blocks/*.html',
            '!./src/html/pages/*.html',
        ],
        dist: path_list.html(env),
        watch: './src/**/*.html'
    },
    styles: {
        src: [
            "./src/styles/**/*.scss",
        ],
        dist: path_list.styles(env),
        watch: "./src/styles/**/*.scss"
    },
    images: {
        src: "./src/img/**/*.{jpg,jpeg,png,gif,svg}",
        dist: path_list.images(env),
        watch: "./src/img/**/*.{jpg,jpeg,png,gif,svg}"
    },
    fonts: {
        src: "./src/fonts/**/*.{ttf,otf,woff,woff2}",
        dist: path_list.fonts(env),
        watch: "./src/fonts/**/*.{ttf,otf,woff,woff2}"
    },
    scripts: {
        src: [
            "./src/js/**/*.js",
            "!./src/js/lib/**/*.js",
        ],
        dist: path_list.scripts(env),
        watch: "./src/js/**/*.js"
    },
    libs: {
        styles: {
            src: "./src/libs/*/scss/**/*.scss",
        },
        scripts: {
            src: "./src/libs/**/js/**/*.js",
        },
        dist: path_list.libs(env),
        watch: "./src/libs/**/*.scss"
    }
});

const server = (env) => {
    browserSync.init({
        server: paths(env).root,
        tunnel: false,
        notify: true
    });

    gulp.watch(paths(env).html.watch, () => html());
    gulp.watch(paths(env).styles.watch, () => styles());
    gulp.watch(paths(env).scripts.watch, () => scripts());
    gulp.watch(paths(env).images.watch, () => images());
    gulp.watch(paths(env).libs.watch, () => libStyles());
};

const cleanFiles = (env) => gulp.src(paths(env).root, { allowEmpty: true, read: false })
    .pipe(clean())
    .pipe(debug({ "title": "Cleaning..." }));

const html = (env) => gulp.src(paths(env).html.src)
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(gulp.dest(paths(env).html.dist))
    .pipe(debug({ "title": "HTML files" }))
    .on("end", browserSync.reload);

const styles = (env = 'dev') => gulp.src(paths().styles.src)
    .pipe(changed(paths(env).root))
    .pipe(sassInstance())
    .pipe(autoPrefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
    .pipe(groupMediaQueries())
    .pipe(gulp.dest(paths(env).styles.dist))
    // .pipe(gulpIf(env === 'dev', sourcemaps.init()))
    .pipe(gulpIf(env === 'dev', cleanCSS()))
    // .pipe(gulpIf(env === 'dev', sourcemaps.write('.')))
    .pipe(gulpIf(env === 'dev', rename({ suffix: '.min' })))
    .pipe(gulpIf(env === 'dev', gulp.dest(paths(env).styles.dist)))
    .pipe(debug({ "title": "CSS files" }))
    // .pipe(browserSync.stream());
    .on("end", browserSync.reload);


const scripts = (env = 'dev') => gulp.src(paths().scripts.src)
    .pipe(changed(paths(env).root))
    // .pipe(gulpIf(env === 'dev', babel({ presets: ['@babel/env'] })))
    .pipe(gulp.dest(paths(env).scripts.dist))
    // .pipe(gulpIf(env === 'dev', sourcemaps.init()))
    // .pipe(gulpIf(env === 'dev', javascriptObfuscator({
    //     compact: false,
    //     deadCodeInjection: true,
    // })))
    // .pipe(gulpIf(env === 'dev', minifyJS({ ext: { min: '.min.js' }, })))
    // .pipe(gulpIf(env === 'dev', sourcemaps.write('.')))
    .pipe(gulpIf(env === 'dev', gulp.dest(paths(env).scripts.dist)))
    .pipe(debug({ "title": "JS files" }))
    .on("end", browserSync.reload);

const fonts = (env = 'dev') => gulp.src(paths().fonts.src, { encoding: false })
    .pipe(gulp.dest(paths(env).fonts.dist))
    .pipe(debug({ "title": "Fonts" }))
    .on("end", browserSync.reload);

const images = (env = 'dev') => gulp.src(paths().images.src, { encoding: false })
    .pipe(gulp.dest(paths(env).images.dist))
    .on('error', function (err) {
        console.error(err);
    })
    .pipe(debug({ "title": "Images" }))
    .on("end", browserSync.reload);

const libStyles = (env = 'dev') => gulp.src(paths().libs.styles.src)
    .pipe(changed(paths(env).root))
    .pipe(sassInstance())
    .pipe(groupMediaQueries())
    .pipe(gulp.dest(paths(env).libs.dist))
    .pipe(debug({ "title": "CSS Libs files" }))
    .on("end", browserSync.reload);

const libSripts = (env = 'dev') => gulp.src(paths().libs.scripts.src)
    .pipe(changed(paths(env).root))
    // .pipe(concat('combined.js'))
    // .pipe(gulp.dest((file) => {
    //     // Получаем имя библиотеки из пути
    //     const libraryName = path.basename(path.dirname(file.path)); // Извлечение имени библиотеки
    //     const distPath = path.join(paths(env).libs.scripts.dist, libraryName, 'js');

    //     // Возвращаем конечный путь
    //     return distPath;
    // }))

    .pipe(gulp.dest(paths(env).libs.dist))
    .pipe(debug({ "title": "JS Libs files" }))
    .on("end", browserSync.reload);


export const dev = gulp.series(
    () => cleanFiles(),
    smartGridStart,
    gulp.parallel(
        () => html(),
        () => styles(),
        () => scripts(),
        () => images(),
        () => fonts(),
        () => libStyles(),
        () => libSripts(),
    ),
    gulp.parallel(
        () => server()
    )
);

export const build = gulp.series(
    () => cleanFiles('b'),
    smartGridStart,
    gulp.parallel(
        () => html('b'),
        () => styles('b'),
        () => scripts('b'),
        () => images('b'),
        () => fonts('b'),
        () => libStyles('b'),
        () => libSripts('b'),
    )
);

export default dev;