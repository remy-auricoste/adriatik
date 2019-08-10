const File = require("rauricoste-file");

class FileImport {
  constructor({ name, path }) {
    this.name = name;
    this.path = path;
  }
  getRequireLine() {
    const { name, path } = this;
    return `const ${name} = require("./${path}");`;
  }
}

const removeExtension = path => {
  const index = path.lastIndexOf(".");
  return path.substring(0, index);
};

const noFilter = () => true;

const generateIndex = async params => {
  const {
    directory,
    shouldFlatten = false,
    filenameFilter = noFilter
  } = params;

  const files = await directory.list();
  const subDirectories = files.filter(file => !file.isFile());
  const jsFiles = files.filter(
    file =>
      file.path.endsWith(".js") &&
      file.name() !== "index.js" &&
      file.path.split(".").length === 2 &&
      file.name() !== "test.js"
  );
  const indexFile = directory.child("index.js");
  const isReplaced = await indexFile.exists();
  if (isReplaced) {
    await indexFile.delete();
  }
  if (!subDirectories.length && !jsFiles.length) {
    return null;
  }

  const subResults = await Promise.all(
    subDirectories.map(subDir => {
      return generateIndex({
        ...params,
        directory: subDir
      });
    })
  );
  const subIndexFiles = subResults.filter(_ => _);
  const subImports = subIndexFiles
    .map(file => {
      const localFile = file.getRelativeFile(directory);
      return new FileImport({
        path: removeExtension(localFile.path),
        name: localFile.parent().name()
      });
    })
    .filter(_ => filenameFilter(_.name));
  const jsImports = jsFiles
    .map(file => {
      const localFile = file.getRelativeFile(directory);
      return new FileImport({
        name: removeExtension(localFile.name()),
        path: removeExtension(localFile.path)
      });
    })
    .filter(_ => filenameFilter(_.name));

  const fileImports = subImports.concat(jsImports);
  if (!fileImports.length) {
    return null;
  }

  const toDepObject = imports => {
    const importNames = imports
      .map(_ => _.name)
      .map(_ => "\t" + _)
      .join(",\n");
    return `{\n${importNames}\n}`;
  };

  const requireLines = fileImports.map(_ => _.getRequireLine()).join("\n");
  const jsDeps = `const jsDeps = ${toDepObject(jsImports)}`;
  const indexDeps = shouldFlatten
    ? ""
    : `const indexDeps = ${toDepObject(subImports)}`;
  const assignDeps = shouldFlatten
    ? subImports.map(_ => _.name).join(", ")
    : "indexDeps";
  const exportLine = `module.exports = Object.assign({}, jsDeps, ${assignDeps})`;

  const fileContent = [requireLines, jsDeps, indexDeps, exportLine].join("\n");

  console.log(isReplaced ? "rewriting" : "creating", indexFile.path);
  await indexFile.write(fileContent);
  return indexFile;
};

const skipped = ["components", "main"];

generateIndex({
  directory: new File("src"),
  shouldFlatten: true,
  filenameFilter: filename => skipped.indexOf(filename) === -1
});
