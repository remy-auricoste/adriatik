const File = require("rauricoste-file");

const generateIndex = directory => {
  return directory.list().then(files => {
    const jsFiles = files.filter(
      file =>
        file.path.endsWith(".js") &&
        file.name() !== "index.js" &&
        file.path.split(".").length === 2
    );
    let firstPromise = Promise.resolve();
    const indexFile = directory.child("index.js");
    firstPromise = firstPromise.then(() => {
      return indexFile.exists().then(exists => {
        if (exists) {
          console.log("deleting", indexFile.path);
          return indexFile.delete();
        }
      });
    });

    if (jsFiles.length) {
      const data = jsFiles.map(file => {
        const filename = file.name();
        const index = filename.lastIndexOf(".");
        const name = filename.substring(0, index);
        return {
          requireLine: `const ${name} = require("./${name}");`,
          name
        };
      });
      const requireLines = data.map(x => x.requireLine).join("\n");
      const exportLines = `module.exports = {\n${data
        .map(x => x.name)
        .join(",\n")}\n}`;
      const fileContent = `${requireLines}\n${exportLines}`;

      firstPromise = firstPromise.then(() => {
        console.log("writing", indexFile.path);
        return indexFile.write(fileContent);
      });
    }
    const subPromises = files
      .filter(file => !file.isFile())
      .map(subDir => {
        return generateIndex(subDir);
      });
    return Promise.all([firstPromise].concat(subPromises));
  });
};

generateIndex(new File("src"));
