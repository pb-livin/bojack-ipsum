const $tagline = $('#tagline');
const $userInput = $('#userInput');
const $paragraphs = $('#paragraphs');
const $getIpsum = $('#getIpsum');
const $results = $('#results');
const $plainText = $('#plainText');
const $htmlFormattedButton = $('#htmlFormattedButton');
const $copyButton = $('#copyButton');
const $ipsum = $('#ipsum');
const $htmlFormatted = $('#htmlFormatted');
const $reload = $('#reload');

// return an array of x unique random numbers in a given range
function randomNumberArray(x, range) {
  randomArray = [];
  let count = 0;
  while (count < x) {
    const randomChoice = Math.floor(Math.random() * range);
    // check to see if number is already in array before adding
    if (randomArray.indexOf(randomChoice) === -1) {
      randomArray.push(randomChoice);
      count += 1;
    } // end if statement
  } // end while loop
  return randomArray;
} // end randomNumberArray()

$getIpsum.click(() => {
  // hide user input div
  $userInput.fadeOut(300);
  $tagline.fadeOut(300);

  // capture user input from select menu
  const $numberOfParagraphs = $paragraphs.val();
  const quotesURL = 'https://pb-livin.github.io/bojack-ipsum/data/quotes.json';

  function makeParagraphs(quotesObject) {
    // concatenate all arrays in json quotes object
    let ipsumArray = [];
    for (array in quotesObject) {
      ipsumArray = ipsumArray.concat(quotesObject[array]);
    }

    // call randomNumberArray() with user input and ipsum array length, store in indexes
    const indexes = randomNumberArray($numberOfParagraphs, ipsumArray.length);

    // loop over indexes and add paragraphs from ipsumArray at each index listed in indexes
    $.each(indexes, (i, indexValue) => {
      const $p = $('<p>').text(ipsumArray[indexValue]);
      $ipsum.append($p);
      // raw html display
      const $htmlP = $('<p>');
      const openingPTag = $('<span>').text(`<p>`).css({color: '#D7006D'});
      const pText = $('<span>').text(ipsumArray[indexValue]);
      const closingPTag = $('<span>').text(`</p>`).css({color: '#D7006D'});
      $htmlP.append(openingPTag);
      $htmlP.append(pText);
      $htmlP.append(closingPTag);
      $htmlP.css({fontFamily: 'Roboto Mono'});
      // const $htmlP = $('<p>').text(`<p>${ipsumArray[indexValue]}</p>`).css({fontFamily: 'Roboto Mono'});
      $htmlFormatted.append($htmlP);
    });

    // display ipsum results
    $results.delay(400).fadeIn(500);
  }

  // jQuery AJAX method
  $.getJSON(quotesURL, makeParagraphs)
  // jQuery AJAX fail
  .fail((jqXHR) => {
    $results.html(`<p>Bummer! Error ${jqXHR.status}: ${jqXHR.statusText}.</p>`);
    $results.fadeIn(500); // right now, getting 'Error 0: error' when it should be 'Error 404: Not Found'
  }); // end getJSON/fail
}); // end click listener

// toggle between plain text and formatted html
$htmlFormattedButton.click(() => {
  $ipsum.hide();
  $plainText.removeClass('active');
  $htmlFormattedButton.addClass('active');
  $htmlFormatted.show();
  $copyButton.text('Copy');
});

$plainText.click(() => {
  $htmlFormatted.hide();
  $htmlFormattedButton.removeClass('active');
  $plainText.addClass('active');
  $ipsum.show();
  $copyButton.text('Copy');
});

// copy displayed text to clipboard per https://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery
$copyButton.click(() => {
  // get text and add newlines between paragraphs
  let $paragraphs;
  let $selectedText = '';
  if ($htmlFormattedButton.hasClass('active')) {
    $paragraphs = $('#htmlFormatted p');
  } else {
    $paragraphs = $('#ipsum p');
  }
  $.each($paragraphs, (index, paragraph) => {
    $selectedText += paragraph.textContent;
    $selectedText += '\n\n';
  });
  // create a temporary textarea, select and copy text, remove
  const $temp = $('<textarea>');
  $('body').append($temp);
  $temp.val($selectedText).select();
  document.execCommand('copy');
  $temp.remove();
  $copyButton.text('Copied!');
}); // try/catch: https://jsfiddle.net/tvkrdjs8/1/

// resets the page to get new ipsum
$reload.click(() => {
  $results.hide();
  $tagline.delay(100).fadeIn(500);
  $userInput.delay(100).fadeIn(500);
  $ipsum.text('').show();
  $htmlFormatted.text('').hide();
  $plainText.addClass('active');
  $htmlFormattedButton.removeClass('active');
  $copyButton.text('Copy');
});