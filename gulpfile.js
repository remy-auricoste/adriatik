var conf = {
    base: {
        src: ".",
        lib: 'lib',
        dist: 'dist',
        test: "**/*.spec.js",
        css: "src",
        html: "src"
    },
    modules: {
        main: {
            src: "src",
            browserify: "main.js",
            sass: "index.scss",
            css: true,
            html: true,
            other: true
        },
        angular: {
            src: ".",
            browserify: "lib/node/angular.js",
            css: false,
            html: false,
            other: false
        },
        standalone: {
            src: ".",
            lib: true,
            css: false,
            html: false,
            other: false
        }
    }
};

require("rauricoste-gulp")(conf);
