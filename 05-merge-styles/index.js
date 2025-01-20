const fs = require('fs');
const path = require('path');

const stylePath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

fs.readdir(stylePath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err.message);
  }
  const writeStream = fs.createWriteStream(bundlePath);
  for (let file of files) {
    if (file.isFile()) {
      const filePath = path.join(stylePath, file.name);
      const fileExtension = path.extname(filePath);
      if (fileExtension === '.css') {
        const readStream = fs.createReadStream(filePath, 'utf-8');
        readStream.pipe(writeStream);
      }
    }
  }
});
