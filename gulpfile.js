var conf = {
    base: {
        src: "src",
        dist: 'dist',
        test: "**/*.spec.js",
        watch: "src"
    },
    modules: {
        main: {
            browserify: "main.js",
            sass: "index.scss"
        },
        nodes: {
            src: ".",
            browserify: "lib/node/all.js",
            sass: "lib/node/all.scss"
        },
        standalone: {
          src: ".",
          jsConcat: "lib/standalone",
        },
        assets: {
          css: "src",
          html: "src",
          other: "src"
        }
    }
};

require("rauricoste-gulp")(conf);
