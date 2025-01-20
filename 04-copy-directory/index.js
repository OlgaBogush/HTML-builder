const fs = require('fs');
const path = require('path');
const folderPath = path.resolve(__dirname, 'files');
const copyFolderPath = path.resolve(__dirname, 'files-copy');
fs.rm(copyFolderPath, { recursive: true }, () => {
    fs.mkdir(copyFolderPath, { recursive: true, force: true }, () => {
        fs.readdir(folderPath, (err, files) => {
            for(let file of files) {
                const filePath = path.join(folderPath, file);
                const copyFilePath = path.join(copyFolderPath, file);
                fs.copyFile(filePath, copyFilePath, err => {
                    if(err) {
                        throw err;
                    }
                })
            }
        })
    })
})