'use strict';

// having some problems with fs/require in the browser (node syntax): just use an ajax call...? but how? need to figure out how make this accessible to the app
const fs = require('fs');

const output = fs.readFileSync('data/transcript-1.txt', 'UTF-8')
  .split('\n')
  .map(line => line.trim('\r'))
  .filter(line => line.length > 0)
  .map(line => line.split(': '))
  .filter(line => line.length > 1)
  .reduce((script, line) => {
    script[line[0]] = script[line[0]] || [];
    script[line[0]].push(line[1]);
    return script;
  }, {})
;

// console.log(output);
const bojackQuotes = output.BOJACK;
console.log(bojackQuotes);