var conf = {
    base: {
        src: "src",
        dist: 'dist',
        test: "**/*.spec.js",
        watch: "src",
        serve: "src"
    },
    modules: {
        main: {
            browserify: "src/main.js",
            sass: "src/index.scss"
        },
        nodes: {
            browserify: "lib/node/all.js",
            sass: "lib/node/all.scss"
        },
        standalone: {
          jsConcat: "lib/standalone"
        },
        assets: {
          css: "src",
          html: "src",
          other: "src"
        }
    }
};

require("rauricoste-gulp")(conf);
