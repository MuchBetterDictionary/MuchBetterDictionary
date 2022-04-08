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

function displayImages(response) {
  for (i = 0; i < 3; i++) {
    imagesRow1.innerHTML += `<div class="col"><div class="m-3">
  <a href=${response.data.photos[i].src.landscape} target="_blank" rel="noopener noreferrer">
  <img src=${response.data.photos[i].src.landscape} className="img-thumbnail mb-3" alt=${response.data.photos[i].photographer}/>
  </a>
  </div>`;
  }
  for (i = 3; i < 6; i++) {
    imagesRow2.innerHTML += `<div class="col"><div class="m-3">
  <a href=${response.data.photos[i].src.landscape} target="_blank" rel="noopener noreferrer">
  <img src=${response.data.photos[i].src.landscape} className="img-thumbnail mb-3" alt=${response.data.photos[i].photographer}/>
  </a>
  </div>`;
  }
}

function getImages(term) {
  const pexelURL = `https://api.pexels.com/v1/search?query=${term}&per_page=6`;
  const pexelApiKey = config.pexel_api_key;

  axios
    .get(pexelURL, { headers: { Authorization: `Bearer ${pexelApiKey}` } })
    .then(displayImages);
}

function handleDictResponse(response) {
  console.log(response);
  mainEl.setAttribute("style", "display: block;");
  wordEl.innerText = response.data[0].word;
  phonetics.innerText = response.data[0].phonetics[0].text;

  getImages(response.data[0].word);
}

function getDefinition(event) {
  event.preventDefault();

  const word = document.querySelector("#word-input");
  const dictRequestUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.value}`;

  axios.get(dictRequestUrl).then(handleDictResponse);
}

// Event Listener for Search Bar
searchWord.addEventListener("submit", getDefinition);
