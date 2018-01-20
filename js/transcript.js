'use strict';

function randomQuote(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function makeParagraph(lines, array) {
  let paragraphText = '';
  for (let i = 0; i < lines; i++) {
    paragraphText += `${randomQuote(array)} `;
  }
  return paragraphText;
}

function makeIpsum(paragraphs, lines, array) {
  let paragraphArray = [];
  for (let i = 0; i < paragraphs; i++) {
    paragraphArray.push(makeParagraph(lines, array));
  }
  return paragraphArray;
}

function appendIpsumToDOM(element, paragraphs, lines, array) {
  let paragraphArray = makeIpsum(paragraphs, lines, array);
  for (let i = 0; i < paragraphArray.length; i++) {
    $(element).append($('<p>').text(paragraphArray[i]));
  }
}

const output = fetch('data/transcript-1.txt', {
  method: 'GET',
  'content-type': "text/plain"
})
  .then(response => response.text())
  .then(text => {
    text = text
      // splits on newlines between quotes
      .split(/\n\r\n/)
      // trims carriage returns
      .map(line => line.trim('/r'))
      // replaces newlines within quotes with a space
      .map(line => line.replace(/\n/g, ' '))
      // removes empty lines
      .filter(line => line.length > 0)
      // removes stage directions in [ ], add ( )?
      .map(line => line.replace(/\[.*\]/g, ''))
      // removes whitespace at either end of a line
      .map(line => line.trim())
      // splits lines at : and one or more spaces
      .map(line => line.split(/:\s+/))
      // filters out single string arrays
      .filter(line => line.length > 1)
      .reduce( (transcript, line) => {
        // ensures ENT, " ENT", etc. are not included
        // and that there is content in the quote
        // before adding to character array
        if (!/^[\s"]*ENT[\s"]*$/.test(line[0]) && line[1].length>0) {
          // accounts for quotes that were split on ": "
          if (line.length > 2) {
            line[1] += `: ${line[2]}`;
          }
          // adds quote to character array, creating it if it doesn't already exist
          transcript[line[0]] = transcript[line[0]] || [];
          transcript[line[0]].push(line[1]);
        }
        return transcript;
      }, {});
    return text;
  }).then(text => {
    let flattened = [];
    for (let array in text) {
      flattened = flattened.concat(text[array]);
    }
    appendIpsumToDOM('header', 5, 10, flattened);
  })
;