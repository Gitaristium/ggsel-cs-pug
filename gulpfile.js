const { src, dest, watch, parallel, series } = require("gulp");
const scss = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();
const fs = require("fs");

// пути
const paths = {
    pages: {
        src: "./src/*.pug",
        watch: "./src/**/*.pug",
        dist: "./dist",
    },
    styles: {
        src: "./src/assets/scss/**/*.scss",
        dist: "./dist/assets/css",
    },
    scripts: {
        src: "./src/assets/js/**/*.js",
        dist: "./dist/assets/js",
    },
    images: {
        src: "./src/assets/img/**/*",
        dist: "./dist/assets/img",
    },
};

// обработка страниц
const pages = () => {
    return src(paths.pages.src)
        .pipe(
            pug({
                // Your options in here.
                pretty: true,
                locals: {
                    JSONguns: JSON.parse(
                        fs.readFileSync("src/services/gun-list.json")
                    ),
                    JSONgiveaways: JSON.parse(
                        fs.readFileSync("src/services/giveaways-list.json")
                    ),
                },
            })
        )
        .pipe(dest(paths.pages.dist))
        .pipe(browserSync.stream());
};

// обработка стилей
const styles = () => {
    return src([paths.styles.src])
        .pipe(scss({ outputStyle: "expanded" }).on("error", scss.logError))
        .pipe(
            autoprefixer({
                overrideBrowserlist: ["last 10 version"],
                grid: true,
            })
        )
        .pipe(concat("main.css"))
        .pipe(dest(paths.styles.dist))
        .pipe(browserSync.stream());
};

// обработка скриптов
const scripts = () => {
    return src(["node_modules/jquery/dist/jquery.js", paths.scripts.src])
        .pipe(concat("main.js"))
        .pipe(dest(paths.scripts.dist))
        .pipe(browserSync.stream());
};

// обработка изображений
const images = () => {
    return src([paths.images.src])
        .pipe(dest(paths.images.dist))
        .pipe(browserSync.stream());
};

// обновление страницы
const browsersync = () => {
    browserSync.init({
        server: {
            baseDir: paths.pages.dist,
        },
    });
};

// слежение за изменениями
const watching = () => {
    watch([paths.pages.watch], pages);
    watch([paths.styles.src], styles);
    watch([paths.scripts.src], scripts);
    watch([paths.images.src], images);
};

// список функций для терминала
exports.default = parallel(
    pages,
    styles,
    scripts,
    images,
    watching,
    browsersync
);
exports.build = parallel(pages, styles, scripts, images);
