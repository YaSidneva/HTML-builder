const fs = require("fs");
const readLine = require("readline");

const reading = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const nameFile = "text.txt";
const filePath = "02-write-file/text.txt";

fs.access(nameFile, (err) => {
  if (err) {
    fs.writeFile(nameFile, "", (err) => {
      if (err) throw err;
    });
  }
});

const writeStream = fs.createWriteStream(filePath, { flags: "a" });

console.log('Добавьте текст (для выхода введите "exit"):');

reading.on("line", (inputData) => {
  if (inputData.toLowerCase() === "exit") {
    console.log("Уже уходишь? До встречи в будущем");
    process.exit(0);
  } else {
    writeStream.write(inputData + "\n");
  }
});

process.on('exit', (code) => {
  console.log("Уже уходишь? До встречи в будущем");
});