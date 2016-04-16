var conf = {
    base: {
        src: "src",
        dist: 'dist',
        test: "**/*.spec.js",
        css: "src",
        html: "src",
        watch: "src"
    },
    modules: {
        main: {
            browserify: "main.js",
            sass: "index.scss",
            css: true,
            html: true,
            other: true
        },
        nodes: {
            src: ".",
            browserify: "lib/node/all.js",
            sass: "lib/node/all.scss",
            css: false,
            html: false,
            other: false
        },
        standalone: {
          src: ".",
          jsConcat: "lib/standalone",
          css: false,
          html: false,
          other: false
        }
    }
};

require("rauricoste-gulp")(conf);
