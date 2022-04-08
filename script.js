// Declare Global Variables
const mainEl = document.getElementById("main-content");
const wordEl = document.getElementById("word");
const phonetics = document.getElementById("phonetics");
const audio = document.getElementById("audio");
const wordMeaning = document.getElementById("word-definition");
const synonyms = document.getElementById("synonyms");
const imagesRow1 = document.getElementById("images-first-row");
const imagesRow2 = document.getElementById("images-second-row");
const searchWord = document.getElementById("word-search-form");

function displayImages(imageData) {
  for (i = 0; i < 3; i++) {
    imagesRow1.innerHTML += `<div class="col"><div class="m-3">
  <a href=${imageData.photos[i].src.landscape} target="_blank" rel="noopener noreferrer">
  <img src=${imageData.photos[i].src.landscape} className="img-thumbnail mb-3" alt=${imageData.photos[i].photographer}/>
  </a>
  </div>`;
  }
  for (i = 3; i < 6; i++) {
    imagesRow2.innerHTML += `<div class="col"><div class="m-3">
  <a href=${imageData.photos[i].src.landscape} target="_blank" rel="noopener noreferrer">
  <img src=${imageData.photos[i].src.landscape} className="img-thumbnail mb-3" alt=${imageData.photos[i].photographer}/>
  </a>
  </div>`;
  }
}

function getImages(term) {
  const pexelURL = `https://api.pexels.com/v1/search?query=${term}&per_page=6`;
  const pexelApiKey =
    "563492ad6f917000010000014a4078a4f8b545fda3f3c33d260ab9d0";

  fetch(pexelURL, {
    headers: {
      Authorization: `token ${pexelApiKey}`,
    },
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      displayImages(data);
    });
}

function getDefinition(event) {
  event.preventDefault();

  const word = document.querySelector("#word-input");
  const dictRequestUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.value}`;

  fetch(dictRequestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      mainEl.setAttribute("style", "display: block;");
      wordEl.innerText = data[0].word;
      phonetics.innerText = data[0].phonetics[0].text;

      getImages(data[0].word);
    });
}

// Event Listener for Search Bar
searchWord.addEventListener("submit", getDefinition);