const fs = require('fs');
const readStream = fs.createReadStream('./01-read-file/text.txt', { encoding: 'utf8' });

readStream.on('data', (text) => {
  console.log(text);
});

readStream.on('error', (error) => {
  console.error(error);
});