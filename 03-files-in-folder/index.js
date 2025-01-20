const fs = require("fs").promises
const path = require("path")
const dirname = path.join(__dirname, "secret-folder")
const readFiles = async function(dir) {
  const files = await fs.readdir(dir, {withFileTypes: true})
  try {
    for (file of files) {
      if (file.isFile()) {
        const stat = await fs.stat(path.resolve(dir, file.name))
        console.log(`${file.name.split('.')[0]} - ${path.extname(file.name).split('.').pop()} - ${(stat.size / 1024).toFixed(3)}kb`)
      }
    }

  } catch(err) {
    console.log(err);
  }
}

readFiles(dirname)