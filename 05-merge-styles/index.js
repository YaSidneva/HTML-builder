const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const outputFolderPath = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputFolderPath, 'bundle.css');

function createOutputFolder(callback) {
    fs.mkdir(outputFolderPath, (err) => {
        if (err && err.code !== 'EEXIST') {
            console.error('Error creating project-dist folder:', err);
        }
        callback();
    });
}

function compileStyles() {
    fs.readdir(stylesFolderPath, (readErr, files) => {
        if (readErr) {
            console.error('Error reading styles folder:', readErr);
            return;
        }

        const cssFiles = files.filter(file => path.extname(file) === '.css');

        const stylesArray = [];

        function readFile(index) {
            if (index === cssFiles.length) {
                const combinedStyles = stylesArray.join('\n');

                fs.writeFile(outputFile, combinedStyles, (writeErr) => {
                    if (writeErr) {
                        console.error('Error writing bundle.css:', writeErr);
                        return;
                    }
                    console.log('Compilation successful! bundle.css has been created in project-dist folder.');
                });
                return;
            }

            const filePath = path.join(stylesFolderPath, cssFiles[index]);
            fs.readFile(filePath, 'utf-8', (readFileErr, fileContent) => {
                if (readFileErr) {
                    console.error(`Error reading ${cssFiles[index]}:`, readFileErr);
                    return;
                }
                stylesArray.push(fileContent);
                readFile(index + 1);
            });
        }

        readFile(0);
    });
}

createOutputFolder(compileStyles);
