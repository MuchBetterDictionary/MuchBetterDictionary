// Declare Global Variables
const apiKey = '676327db-9f8e-4212-a0e1-d73850d216df';
const mainEl = document.getElementById("main-content");
const wordEl = document.getElementById("word");
const phonetics = document.getElementById("phonetics");
const audio = document.getElementById("audio");
const wordMeaning = document.getElementById("word-definition");
const synonyms = document.getElementById("synonyms");
const imagesRow1 = document.getElementById("images-first-row");
const imagesRow2 = document.getElementById("images-second-row");
const searchWord = document.getElementById("word-search-form");
const wordHistoryEl = document.getElementById("word-history");
let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let notFound = document.querySelector('.not_found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');


searchBtn.addEventListener('click', function(e){
    e.preventDefault();

    // CLEAR FIELD
    audioBox.innerHTML = '';
    notFound.innerText = '';
    defBox.innerText = '';

    // GET INPUT
    let word = input.value;
    // call API get data
    if (word === '') {
        alert('Word is required');
        return;
    }

    getData(word);
})

//FETCH AND RESPONSE
async function getData(word) {
    loading.style.display = 'block';
    // Ajax call 
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`);
    const data = await response.json();
    // if empty result 
    if (!data.length) {
        loading.style.display = 'none';
        notFound.innerText = ' No result found';
        return;
    }

    // SUGGESTIONS WHEN WORD IS MISPELLED
    if (typeof data[0] === 'string') {
        loading.style.display = 'none';
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean?'
        notFound.appendChild(heading);
        data.forEach(element => {
            let suggetion = document.createElement('span');
            suggetion.classList.add('suggested');
            suggetion.innerText = element;
            notFound.appendChild(suggetion);
            
        })
        return;
    }

   //AUDIO
    loading.style.display = 'none';
    let definition = data[0].shortdef[0];
    defBox.innerText = definition;

   
    const soundName = data[0].hwi.prs[0].sound.audio;
        if(soundName) {
            renderSound(soundName);
        }

    console.log(data);
}

function renderSound(soundName) {
    // MERRIAM WEBSTER SOUNDCLOUD
    let subfolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);

}

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
    getImages(response.data[0].word);
}

var historySearch = function (event) {
  var wordSearch = event.target.textContent;

  handleDictResponse(wordSearch);
  getData(wordSearch);
  
};

var storeWord = function (searchWord) {
  var wordBtn = document.createElement("btn");
  wordBtn.textContent = wordName;
  wordBtn.classList = "col-12 word-btn";

  wordHistoryEl.appendChild(wordBtn);

  searchHistory.push(searchWord);

  localStorage.setItem("words", JSON.stringify(searchHistory));
};

var loadWord = function () {
  storedSearches = JSON.parse(localStorage.getItem("words"));

  if (!storedSearches) {
    storedSearches = [];
  }

  for (var i = 0; i < storedSearches.length; i++) {
    storeWord(storedSearches[i]);
  }
};

loadWord();

// wordHistoryEl.addEventListener("click", historySearch);
searchWord.addEventListener("submit", getData);

