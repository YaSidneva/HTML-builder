const fs = require('fs');
const path = require('path');

const projectDistPath = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');

function createProjectDistFolder() {
    return new Promise((resolve, reject) => {
        fs.mkdir(projectDistPath, { recursive: true }, (err) => {
            if (err) {
                reject(`Error creating project-dist folder: ${err}`);
            } else {
                resolve();
            }
        });
    });
}

function readTemplateFile() {
    return new Promise((resolve, reject) => {
        fs.readFile(templatePath, 'utf-8', (err, data) => {
            if (err) {
                reject(`Error reading template file: ${err}`);
            } else {
                resolve(data);
            }
        });
    });
}

function findTagNames(templateContent) {
    const regex = /\{\{(\w+)\}\}/g;
    const matches = templateContent.match(regex);
    return matches ? matches.map(match => match.slice(2, -2)) : [];
}

async function replaceTemplateTags(templateContent, tagNames) {
    for (const tagName of tagNames) {
        const componentFilePath = path.join(componentsPath, `${tagName}.html`);

        try {
            const componentContent = await fs.promises.readFile(componentFilePath, 'utf-8');
            templateContent = templateContent.replace(new RegExp(`\\{\\{${tagName}\\}\\}`, 'g'), componentContent);
        } catch (error) {
            console.error(`Error reading component file ${componentFilePath}: ${error}`);
        }
    }

    return templateContent;
}

function writeIndexFile(modifiedTemplate) {
    const indexPath = path.join(projectDistPath, 'index.html');
    return new Promise((resolve, reject) => {
        fs.writeFile(indexPath, modifiedTemplate, 'utf-8', (err) => {
            if (err) {
                reject(`Error writing index.html: ${err}`);
            } else {
                resolve();
            }
        });
    });
}

async function buildPage() {
    try {
        await createProjectDistFolder();

        const templateContent = await readTemplateFile();
        const tagNames = findTagNames(templateContent);
        const modifiedTemplate = await replaceTemplateTags(templateContent, tagNames);
        await writeIndexFile(modifiedTemplate);

        require('../05-merge-styles/index');

        require('../04-copy-directory/index')(assetsPath, path.join(projectDistPath, 'assets'));

        console.log('Page build successful!');
    } catch (error) {
        console.error(error);
    }
}

buildPage();
