const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const pathNewFolder = path.join(__dirname, 'project-dist');
const pathIndexFile = path.join(pathNewFolder, 'index.html');
const pathStyleFile = path.join(pathNewFolder, 'style.css');
const pathAssetsFolder = path.join(__dirname, 'assets');
const pathAssetsCopyFolder = path.join(pathNewFolder, 'assets');
const pathStyleFolder = path.join(__dirname, 'styles');
const pathComponentsFolder = path.join(__dirname, 'components');
const pathTemplateFile = path.join(__dirname, 'template.html');

async function createNewFolder() {
  try {
    await createDir(pathNewFolder);
    await copyDir();
    await createIndexFile();
    await createStyleFile();
  } catch (error) {
    throwError(error);
  }
}

async function createDir(path) {
  return await fsPromises.mkdir(path, { recursive: true });
}

async function copyDir() {
  try {
    await createDir(pathAssetsCopyFolder);
    await copyFile(pathAssetsFolder, pathAssetsCopyFolder);
  } catch (error) {
    throwError(error);
  }
}

async function readDir(path) {
  return await fsPromises.readdir(path, {
    withFileTypes: true,
  });
}

async function throwError(e) {
  console.log('Error: ' + e.message);
  throw e;
}

async function copyFile(origin, copy) {
  const files = await readDir(origin);

  for (const file of files) {
    const originPath = path.join(origin, file.name);
    const copyPath = path.join(copy, file.name);

    if (file.isDirectory()) {
      await createDir(copyPath);
      await copyFile(originPath, copyPath);
    } else {
      await createCopyFile(originPath, copyPath);
    }
  }
}

async function createCopyFile(origin, copy) {
  try {
    await fsPromises.copyFile(path.join(origin), path.join(copy));
  } catch (error) {
    throwError(error);
    return;
  }
}

async function createIndexFile() {
  try {
    const templateContent = await getContent(pathTemplateFile);
    const components = await readDir(pathComponentsFolder);
    let indexContent = templateContent;
    for (const component of components) {
      const componentName = path.parse(component.name).name;
      const componentContent = await getContent(
        path.join(pathComponentsFolder, component.name),
      );
      indexContent = indexContent.replace(
        new RegExp(`{{${componentName}}}`, 'g'),
        componentContent,
      );
    }
    await fsPromises.writeFile(pathIndexFile, indexContent);
  } catch (error) {
    throwError(error);
  }
}

async function getContent(path) {
  try {
    const data = await fsPromises.readFile(path, 'utf-8');
    return data;
  } catch (error) {
    throwError(error);
  }
}

async function createStyleFile() {
  try {
    const files = await readDir(pathStyleFolder);
    const styleFile = await getStyleFile(files);
    const writeStream = fs.createWriteStream(pathStyleFile);
    for (const file of styleFile) {
      await readWriteData(file, writeStream);
    }
    writeStream.end();
  } catch (error) {
    throwError(error);
    return;
  }
}

async function getStyleFile(arr) {
  return arr
    .filter((file) => file.isFile())
    .filter((file) => path.extname(file.name) === '.css');
}

async function readWriteData(item, stream) {
  const pathFile = path.join(pathStyleFolder, item.name);
  const data = await fsPromises.readFile(pathFile);
  stream.write(data + '\n');
}

createNewFolder();