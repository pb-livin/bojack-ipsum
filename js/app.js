'use strict';

const $tagline = $('#tagline');
const $userInput = $('#userInput');
const $paragraphs = $('#paragraphs');
const $loading = $('#loading');
const $rocksGlass = $('#loading svg');
const $iceLeft = $('#iceLeft');
const $iceRight = $('#iceRight');
const $getIpsum = $('#getIpsum');
const $results = $('#results');
const $plainText = $('#plainText');
const $htmlFormattedButton = $('#htmlFormattedButton');
const $copyButtonDiv = $('#copyButtonDiv');
const $copyButton = $('#copyButton');
const $ipsum = $('#ipsum');
const $htmlFormatted = $('#htmlFormatted');
const $reload = $('#reload');

// return an array of x unique random numbers in a given range
function randomNumberArray(x, range) {
  const randomArray = [];
  let count = 0;
  while (count < x) {
    const randomChoice = Math.floor(Math.random() * range);
    // check to see if number is in array before adding
    if (!randomArray.includes(randomChoice)) {
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
    // use spread operator? to add ...array to ipsumArray?
    for (let array in quotesObject) {
      ipsumArray = ipsumArray.concat(quotesObject[array]);
    }

    // call randomNumberArray() with user input and ipsum array length, store in indexes
    const indexes = randomNumberArray($numberOfParagraphs, ipsumArray.length);

    // modify so that getJSON returns array of random paragraphs, then build them outside the JSON call: that way there will be a reference for creating the 4 different versions of the list of paragraphs
    // use filter?
    // example:
    // const animals = [
    //   {name: 'Fluffykins', species: 'rabbit'},
    //   {name: 'Caro', species: 'dog'},
    //   {name: 'Hamilton', species: 'dog'},
    //   {name: 'Harold', species: 'fish'},
    //   {name: 'Ursula', species: 'cat'},
    //   {name: 'Jimmy', species: 'fish'}
    // ];
    
    // const dogs = animals.filter(animal => animal.species === 'dog');

    // const isDog = function(animal) {
    //   return animal.species === 'dog';
    // };
    // const dogs = animals.filter(isDog);

    // use map to map over array, do something, and return a new array
    // or use reduce?
    // forEach: similar to map, but doesn't return a new array, just runs a function for each item in array

    // loop over indexes and add paragraphs from ipsumArray at each index listed in indexes
    $.each(indexes, (i, indexValue) => {
      const $p = $('<p>').text(ipsumArray[indexValue]);
      $ipsum.append($p);
      // raw html display
      const $htmlP = $('<p>');
      const openingPTag = $('<span>').addClass('highlight').text(`<p>`);
      const pText = $('<span>').text(ipsumArray[indexValue]);
      const closingPTag = $('<span>').addClass('highlight').text(`</p>`);
      $htmlP.append(openingPTag);
      $htmlP.append(pText);
      $htmlP.append(closingPTag);
      // $htmlP.css({fontFamily: 'Inconsolata'});
      // const $htmlP = $('<p>').text(`<p>${ipsumArray[indexValue]}</p>`).css({fontFamily: 'Inconsolata'});
      $htmlFormatted.append($htmlP);
    });

    // use promises to dipslay results after 1. animation is complete, and 2. json paragraphs are ready

    // move animation above ajax call

    // display ipsum results
    $loading.delay(400).fadeIn(200).delay(4000).fadeOut(200);
    $results.delay(5000).fadeIn(500);
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
$copyButtonDiv.click(() => {
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
    // use multiline string instead of \n?
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