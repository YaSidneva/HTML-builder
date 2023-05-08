const fs = require("fs");
const path = require("path");

const sourcePath = "./04-copy-directory/files";
const destinationPath = "./04-copy-directory/files-copy";

function copyDir(srcDir, destDir, callback) {
  fs.mkdir(destDir, { recursive: true }, (err) => {
    if (err) return callback(err);
    fs.readdir(srcDir, { withFileTypes: true }, (err, files) => {
      if (err) return callback(err);

      files.forEach((file) => {
        const srcPath = path.join(srcDir, file.name);
        const destPath = path.join(destDir, file.name);

        if (file.isDirectory()) {
          copyDir(srcPath, destPath, (err) => {
            if (err) return callback(err);
          });
        } else {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) return callback(err);
          });
        }
      });
      callback(null);
    });
  });
}

fs.rm(destinationPath, { recursive: true }, (err) => {
  copyDir(sourcePath, destinationPath, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Directory copied successfully!");
    }
  });
});
