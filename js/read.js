function makeTranscript() {
  const fs = require('fs');
  const filepath = process.argv.slice(2);
  const parsedFiles = [];
  let parsedString = '';
  filepath.forEach((file) => {
    const textFile = file
                     .replace('xml', 'txt')
                     .replace(/.+\//g, '');

    fs.readFile(file, 'utf-8', (err, data) => {
      data = data
        .replace(/<br\/?>/g, ' ')
        .replace(/<\/?span[^<>]*>/g, '')
        .replace(/<p begin="/g, '')
        .replace(/"\send=[^<>]+>/g, '\n')
        .replace(/<\/p[^<>]*>/g, '\n')
        .replace(/<[^<>]+>\n/g, '')
        .replace(/\d+t/g, (match) => {
          // const newTime = '3766347743t';
          const captionTime = new Date(null);
          captionTime.setMilliseconds(parseInt(match)/10000);
          return `[${captionTime.toISOString().substr(14,5)}]`;
        });
      fs.writeFile(textFile, data, (err) => {
        if (err) {
          throw err;
        }
      });
    });
    parsedFiles.push(textFile);
  });
  console.log(`Successfully parsed:\n\n    ${parsedFiles.join('\n    ')}\n\nto ${__dirname}\n`);
}

makeTranscript();