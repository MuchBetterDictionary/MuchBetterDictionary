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



// //Merriam Webster API key (Ross account)
// var apiKey = "676327db-9f8e-4212-a0e1-d73850d216df"
// //Request URL `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word)?key=apiKey`
// var formSubmitHandler = function (event) {
//   event.preventDefault();

//   var wordName = wordNameEl.value.trim();
//   console.log(wordName);

//   if (wordName) {
// //functions to write to be called within this fetch
//     getWordData(wordName);
//     getDefinition(wordName);
//     getEtymology(wordName);
//     storeWord(wordName);
//     wordNameEl.value = "";
//   } else {
//     alert("Do you have the correct spelling?");
//   }
// };

// var getWordData = function (word) {
//   var wordData =
//     "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" +
//     word +
//     "?key=" +
//     apiKey;

//   fetch(wordData).then(function (response) {
//     if (response.ok) {
//       response.json().then(function (data) {
//         console.log(data);
//         //short definition
//         console.log(data[0].shortdef[0]);
//         //pronounciation
//         console.log(data[0].hwi.prs[0]);
//         displayWordData(data);

//       });
//     } else {
//       alert("Error: " + response.cod);
//     }
    
//   });
// };
