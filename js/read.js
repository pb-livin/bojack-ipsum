const fs = require('fs');

// command line: `node read.js <args>`
// args: directory of xml files, or 1 or more individual xml files
const args = process.argv.slice(2);
const isDir = !args[0].endsWith('.xml');

(function() {
  if (isDir) {
    fs.readdir(args[0], 'utf8', (err, filenames) => {
      if (err) console.log(err);
      parseFiles(filenames);
    });
  } else {
    parseFiles(args);
  }
})();

function parseFiles(files) {
  const parsedFiles = [];

  files.forEach((file) => {
    const textFileName = file
      .replace('xml', 'txt')
      .replace(/.+\//g, '');

    const path = isDir ? args[0] + '/' + file : file;

    fs.readFile(path, 'utf-8', (err, text) => {
      if (err) console.log(err);
      text = text
        // xml tag parsing
        .replace(/<br\/?>/g, ' ')
        .replace(/<\/?span[^<>]*>/g, '')
        .replace(/<p begin="/g, '')
        .replace(/"\send=[^<>]+>/g, '\n')
        .replace(/<\/p[^<>]*>/g, '\n')
        .replace(/<[^<>]+>\n/g, '')
        // timestamp parsing
        .replace(/\d+t/g, (match) => {
          const captionTime = new Date(null);
          captionTime.setMilliseconds(parseInt(match)/10000);
          return `[${captionTime.toISOString().substr(14,5)}]`;
        });
      fs.writeFile(textFileName, text, (err) => {
        if (err) console.log(err);
      });
    });
    parsedFiles.push(textFileName);
  });
  // currently logs even if there's an error
  console.log(`Successfully parsed:\n    ${parsedFiles.join('\n    ')}\nto ${process.cwd()}`);
}