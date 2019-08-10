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

const generateIndex = async directory => {
  const files = await directory.list();
  const subDirectories = files.filter(file => !file.isFile());
  const jsFiles = files.filter(
    file =>
      file.path.endsWith(".js") &&
      file.name() !== "index.js" &&
      file.path.split(".").length === 2
  );
  if (!subDirectories.length && !jsFiles.length) {
    return null;
  }
  const indexFile = directory.child("index.js");
  const isReplaced = await indexFile.exists();
  if (isReplaced) {
    await indexFile.delete();
  }

  const subResults = await Promise.all(
    subDirectories.map(subDir => {
      return generateIndex(subDir);
    })
  );
  const subIndexFiles = subResults.filter(_ => _);
  const subImports = subIndexFiles.map(file => {
    const localFile = file.getRelativeFile(directory);
    return new FileImport({
      path: removeExtension(localFile.path),
      name: localFile.parent().name()
    });
  });
  const jsImports = jsFiles.map(file => {
    const localFile = file.getRelativeFile(directory);
    return new FileImport({
      name: removeExtension(localFile.name()),
      path: removeExtension(localFile.path)
    });
  });

  const fileImports = subImports.concat(jsImports);
  const requireLines = fileImports.map(_ => _.getRequireLine()).join("\n");
  const importNames = fileImports.map(_ => _.name);
  const exportLines = `module.exports = {\n${importNames.join(",\n")}\n}`;
  const fileContent = `${requireLines}\n${exportLines}`;

  console.log(isReplaced ? "rewriting" : "creating", indexFile.path);
  await indexFile.write(fileContent);
  return indexFile;
};

generateIndex(new File("src"));
