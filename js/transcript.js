'use strict';

// Regexes for removing xml tags:
  // all tags:
    // (<[^(><)]+>)
    // or <[^(><)]+>
  // all tags, including newlines after:
    // <[^(><)]+>\n
  // all opening and closing <p> tags:
    // </?p[^<>]*>
  // only <p>:
    // <p[^<>]*>
  // only </p>:
    // </p[^<>]*>
  // all opening and closing <span> tags:
    // </?span[^<>]*>
  // all <br> tags:
    // <br/?>

// To get rid of all xml tags in Netflix subtitles:
  // 1. Replace all breaks with 1 space
  // 2. Delete all spans
  // 3. Delete all opening p tags
  // 4. Replace all closing p tags with newlines
  // 5. Delete all tags followed by newlines
  

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
  paragraphArray = paragraphArray.map(line => line.trim());
  return paragraphArray;
}

function appendIpsumToDOM(element, ipsumArray) {
  for (let i = 0; i < ipsumArray.length; i++) {
    $(element).append($('<p>').text(ipsumArray[i]));
  }
}

function appendHtmlFormatted(element, ipsumArray) {
  for (let i = 0; i < ipsumArray.length; i++) {
    const $p = $('<p>');
    const openingPTag = $('<span>').addClass('highlight').text(`<p>`);
  const closingPTag = $('<span>').addClass('highlight').text(`</p>`);
    $p.append(openingPTag);
    $p.append($('<span>').text(ipsumArray[i]));
    $p.append(closingPTag);
    $(element).append($p);
  }
}

$('#getIpsum').click( () => {
  $('#userInput').fadeOut(300);
  $('#tagline').fadeOut(300);

  const $numberOfParagraphs = $('#paragraphs').val();

  const output = fetch('https://pb-livin.github.io/bojack-ipsum/data/transcript-1.txt', {
    method: 'GET',
    headers: {
      "content-type": "text/plain"
    }
  })
    .then(response => response.text())
    .then(text => {
      text = text
        // splits on newlines between quotes
        .split(/\n\r?\n/)
        // removes carriage returns
        .map(line => line.replace(/\r/g, ''))
        // replaces newlines within quotes with a space
        .map(line => line.replace(/\n/g, ' '))
        // removes empty lines
        .filter(line => line.length > 0)
        // removes stage directions in [ ] or ( )
        .map(line => line.replace(/[\[(].*[\])]/g, ''))
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
      // concatenates character arrays before creating random paragraphs and appending to DOM
      let flattened = [];
      for (let array in text) {
        flattened = flattened.concat(text[array]);
      }
      const ipsum = makeIpsum($numberOfParagraphs, 10, flattened);
      appendIpsumToDOM('#ipsum', ipsum);
      appendHtmlFormatted('#htmlFormatted', ipsum);
    })
  ;

  $('#loading').delay(400).fadeIn(200).delay(4000).fadeOut(200);
  $('#results').delay(5000).fadeIn(500);
});

// toggle between plain text and formatted html
$('#htmlFormattedButton').click(() => {
  $('#ipsum').hide();
  $('#plainText').removeClass('active');
  $('#htmlFormattedButton').addClass('active');
  $('#htmlFormatted').show();
  $('#copyButton').text('Copy');
});

$('#plainText').click(() => {
  $('#htmlFormatted').hide();
  $('#htmlFormattedButton').removeClass('active');
  $('#plainText').addClass('active');
  $('#ipsum').show();
  $('#copyButton').text('Copy');
});

// copy displayed text to clipboard per https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
$('#copyButtonDiv').click(() => {
  // get text and add newlines between paragraphs
  let $paragraphs;
  let $selectedText = '';
  if ($('#htmlFormattedButton').hasClass('active')) {
    $paragraphs = $('#htmlFormatted p');
  } else {
    $paragraphs = $('#ipsum p');
  }
  for (let i = 0; i < $paragraphs.length; i++) {
    $selectedText += $paragraphs[i].textContent;
    $selectedText += '\n\n';
  }
  // $.each($paragraphs, (index, paragraph) => {
  //   $selectedText += paragraph.textContent;
  //   // use multiline string instead of \n?
  //   $selectedText += '\n\n';
  // });
  // create a temporary textarea, select and copy text, remove
  const $temp = $('<textarea>');
  $('body').append($temp);
  $temp.val($selectedText).select();
  document.execCommand('copy');
  $temp.remove();
  $('#copyButton').text('Copied!');
}); // try/catch: https://jsfiddle.net/tvkrdjs8/1/

// resets the page to get new ipsum
$('#reload').click(() => {
  $('#results').hide();
  $('#tagline').delay(100).fadeIn(500);
  $('#userInput').delay(100).fadeIn(500);
  $('#ipsum').text('').show();
  $('#htmlFormatted').text('').hide();
  $('#plainText').addClass('active');
  $('#htmlFormattedButton').removeClass('active');
  $('#copyButton').text('Copy');
});