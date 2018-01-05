const $tagline = $('#tagline');
const $userInput = $('#userInput');
const $paragraphs = $('#paragraphs');
const $getIpsum = $('#getIpsum');
const $results = $('#results');
const $ipsum = $('#ipsum');
const $reload = $('#reload');

$results.hide();
$getIpsum.on('click', () => {
  // capture user input from select menu
  const numberOfParagraphs = $paragraphs.val();
  // hide user input div
  $userInput.fadeOut(300);
  $tagline.fadeOut(300);
  // jQuery AJAX method
  $.getJSON('../data/quotes.json', (response) => {
    // concatenate all arrays in json response
    let ipsumArray = [];
    for (array in response) {
      ipsumArray = ipsumArray.concat(response[array]);
    }
    // return an array of unique random numbers
    function randomP(num) {
      randomArray = [];
      let count = 0;
      while (count < num) {
        const randomChoice = Math.floor(Math.random() * ipsumArray.length);
        if (randomArray.indexOf(randomChoice) === -1) {
          randomArray.push(randomChoice);
          count += 1;
        } // end if statement
      } // end while loop
      return randomArray;
    } // end randomP()
    // call randomP() with user input, store in indexes
    const indexes = randomP(numberOfParagraphs);
    // loop over indexes and add paragraphs from ipsumArray at each index listed in indexes
    for (let i = 0; i < indexes.length; i += 1) {
      const p = document.createElement('p');
      const index = indexes[i];
      p.textContent = ipsumArray[index];
      $ipsum.append(p);
    } // end for loop
    $results.delay(400).fadeIn(500);
  }).fail((jqXHR) => {
    $('#ipsum').html(`<p>Bummer! Error ${jqXHR.status}: ${jqXHR.statusText}. Refresh your browser to try again.</p>`);
  }); // end getJSON/fail
}); // end click listener
$reload.click(() => {
  location.reload();
});