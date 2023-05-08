const fs = require('fs');
const path = require('path');

const folderPath = './03-files-in-folder/secret-folder';

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }

      if (stats.isFile()) {
        const name = path.parse(file).name;
        const extension = path.parse(file).ext.slice(1);
        const size = stats.size/1024;
        console.log(`${name} - ${extension} - ${size.toFixed(3)}kb`);
      }
    });
  });
});
