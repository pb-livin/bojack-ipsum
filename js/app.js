const $tagline = $('#tagline');
const $userInput = $('#userInput');
const $paragraphs = $('#paragraphs');
const $getIpsum = $('#getIpsum');
const $results = $('#results');
const $ipsum = $('#ipsum');
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

$results.hide();

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

// reloads the page to get new ipsum
$reload.click(() => {
  location.reload();
});