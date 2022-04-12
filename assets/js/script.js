// Declare Global Variables
//Public API Keys
let dictApiKey = "676327db-9f8e-4212-a0e1-d73850d216df";
let pexelApiKey = "563492ad6f917000010000014a4078a4f8b545fda3f3c33d260ab9d0";

// Get Elements
let mainEl = document.querySelector("#main-content");
let mainCard = document.querySelector("#card-main");
let wordEl = document.querySelector("#word");
let phonetics = document.querySelector("#phonetics");
let audio = document.querySelector("#audio");
let wordMeaning = document.querySelector("#word-definition");
let synonyms = document.querySelector("#synonyms");
let imagesRow1 = document.querySelector("#images-first-row");
let imagesRow2 = document.querySelector("#images-second-row");
let searchWord = document.querySelector("#word-search-form");
let wordHistoryEl = document.querySelector("#word-history");
let input = document.querySelector("#input");
let defBox = document.querySelector("#short-def");
let audioBox = document.querySelector(".audio");

// Storing Searches
// function storeWord(searchWord) {
//   var wordBtn = document.createElement("btn");
//   wordBtn.textContent = wordName;
//   wordBtn.classList = "col-12 word-btn";

//   wordHistoryEl.appendChild(wordBtn);

//   searchHistory.push(searchWord);

//   localStorage.setItem("words", JSON.stringify(searchHistory));
// }

// var loadWord = function () {
//   storedSearches = JSON.parse(localStorage.getItem("words"));

//   if (!storedSearches) {
//     storedSearches = [];
//   }

//   for (var i = 0; i < storedSearches.length; i++) {
//     storeWord(storedSearches[i]);
//   }
// };

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

  axios
    .get(pexelURL, { headers: { Authorization: `Bearer ${pexelApiKey}` } })
    .then(displayImages);
}

function renderSound(soundName) {
  // MERRIAM WEBSTER SOUNDCLOUD
  let subfolder = soundName.charAt(0);
  let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${dictApiKey}`;

  let aud = document.createElement("audio");
  aud.src = soundSrc;
  aud.controls = true;
  audioBox.appendChild(aud);
}

async function getData(word) {
  mainEl.style.display = "block";

  // Ajax call
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${dictApiKey}`
  );
  const data = await response.json();
  // if empty result
  if (!data.length) {
    wordEl.textContent = " No result found";
  }
  // SUGGESTIONS WHEN WORD IS MISPELLED
  else if (typeof data[0] === "string") {
    wordEl.innerText = "Did you mean?";
    data.forEach((element) => {
      let suggestion = document.createElement("span");
      suggestion.classList.add("suggested");
      suggestion.innerText = element;
      mainCard.appendChild(suggestion);
    });
  } else {
    wordEl.textContent = word;
    console.log(data);
    //AUDIO
    let definition = data[0].shortdef[0];
    defBox.innerText = definition;

    const soundName = data[0].hwi.prs[0].sound.audio;
    if (soundName) {
      renderSound(soundName);
    }
    getImages(data[0].meta.id);
  }
}

function searchHandler(event) {
  event.preventDefault();

  // CLEAR FIELD
  audioBox.innerHTML = "";
  wordEl.innerHTML = "";
  imagesRow1.innerHTML = "";
  imagesRow2.innerHTML = "";
  defBox.innerHTML = "";

  // GET INPUT
  let wordInput = document.querySelector("#word-input");
  let word = wordInput.value;
  // call API get data
  if (word === "") {
    alert("Word is required");
    return;
  }

  getData(word);

  // Reset Search Field
  wordInput.value = "";
}

// Event Listener for Search Bar
searchWord.addEventListener("submit", searchHandler);

const randomWord = () => {
  fetch('https://random-word-api.herokuapp.com/word?number=1')
  .then(response => {
      return response.json();
  })
  .then(response => {
      word.textContent = response
      searchHandler(word);
  })
  .catch(err => {
      console.log(err);
      return "No Word Available"
  });
  
}
searchWord.addEventListener('click', function(){
  randomWord();
})


