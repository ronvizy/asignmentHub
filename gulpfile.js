const isProduction = process.env.NODE_ENV == 'production';

const {src, dest, watch, parallel, series} = require("gulp");
const concat = require('gulp-concat');
const minify = require('gulp-minifier');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const clean = require("del");
const imgMinify = require("gulp-imagemin");
const noop = require("gulp-noop");
const copy = require('gulp-copy');
const sync = isProduction ? null : require("browser-sync").create();


const cleanBuild = () => {
    return clean(['./public/']);
}

const prepAssets = async (cb) => {
    return src('./img/**')
        .pipe(isProduction ? imgMinify() : noop())
        .pipe(dest('public/img'));
}

const copyFonts = async (cb) => {
    return src(['media/*', 'fonts/*'])
        .pipe(copy('public'));
}

const copyMapFile = async (cb) => {
    return src(['./sitemap.xml', './robots.txt'])
        .pipe(dest('public/'));
}

const generateCSS = () => {
    return src([
        './css/ionicons.css',
        './css/fonts.css',
        './css/bootstrap.css',
        './css/animate.css',
        './css/magnific-popup.css',
        './css/lightbox.css',
        './css/swiper.css',
        './css/fullpage.css',
        './css/theme.css',
    ])
        .pipe(concat('style.css'))
        .pipe(minify({
            minify: true,
            minifyCSS: true,
        }))
        .pipe(cleanCss())
        .pipe(dest('public'))
        .pipe(isProduction ? noop() : sync.stream());
}


const generateJS = () => {
    return src([
        './js/gtm.js',
        './js/modernizr.js',
        './js/jquery.js',
        './js/jquery.easing.1.3.js',
        './js/bootstrap.js',
        './js/jquery.transit.js',
        './js/swiper.js',
        './js/jquery.appear.js',
        './js/jquery.magnific-popup.js',
        './js/jquery.ticker.js',
        './js/contact.js',
        './js/fullpage.js',
        './js/main.js',
        './js/paynow.js',
        './js/career.js',
        './js/lazyloading.js'
    ])
        .pipe(concat('main.js'))
        .pipe(minify({
            minify: true,
            minifyJS: true,
        }))
        .pipe(uglify())
        .pipe(dest('public'))
        .pipe(isProduction ? noop() : sync.stream());
}


const generateHTML = async () => {
    return src(["./**/*.html", '!node_modules/**/*.html'])
        .pipe(minify({
            minify: true,
            minifyHTML: {
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
                removeComments: true,
                // removeEmptyAttributes: true,
                // removeEmptyElements: true,
                // removeOptionalTags: true,
                conservativeCollapse: true
            },
        }))
        .pipe(dest("public"))
        .pipe(isProduction ? noop() : sync.stream());
}


const browserSync = () => {
    if (!isProduction) {
        sync.init({
            server: {
                baseDir: "./public"
            }
        });

        watch('./**.html', generateHTML);
        watch('./**.css', generateCSS).on('change', sync.reload);
        watch('./**.js', generateJS).on('change', sync.reload);
        watch("./public/**.html").on('change', sync.reload);
        watch("./public/**.css").on('change', sync.reload);
        watch("./public/**.js").on('change', sync.reload);
    } else {
        return Promise.resolve();
    }
}

exports.default = series(cleanBuild, parallel(prepAssets, copyFonts, copyMapFile), parallel(generateCSS, generateHTML, generateJS), browserSync);