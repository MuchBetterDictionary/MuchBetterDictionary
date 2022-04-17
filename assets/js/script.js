// Declare Global Variables
// Public API Keys
let merriamApiKey = "676327db-9f8e-4212-a0e1-d73850d216df";
let thesaurusApiKey = "ec3f068a-4d0a-4a29-a7d8-11736607dc7e";
let pexelApiKey = "563492ad6f917000010000014a4078a4f8b545fda3f3c33d260ab9d0";

// Get Elements
let nav = document.querySelector("#nav-bar");
let header = document.querySelector("#header-section");
let mainEl = document.querySelector("#main-content");
let mainCard = document.querySelector("#card-main");
let errorEl = document.querySelector("#errors");
let wordInput = document.querySelector("#word-input");
let pastSearchEl = document.querySelector("#past-searches");
let pastSearch = document.querySelector("#past-search-cont");
let searchWord = document.querySelector("#input");
let randomWord = document.querySelector("#random-word");
let resetSearch = document.querySelector("#clear-searches");
let imageCont = document.querySelector("#images");
let carouselEl = document.querySelector("#imageCarousel");
let definitionCard = document.querySelector("#card-definitions");

// Function to Handle Events for Past Searches
function pastSearchHandler(event) {
  var word = event.target.getAttribute("data-word");

  // Reset Main Section
  resetContent();

  if (word) {
    dictProcessor(word);
  }
}

// Function to Display Search History On Load
function displaySearchHistory() {
  // Get History from Local Storage
  var history = localStorage.getItem("searches");

  // Reset Search History Section Before Load
  pastSearch.innerHTML = "";

  // Parse and Display History, if available
  if (history) {
    pastSearchEl.classList.remove("hidden");
    history = JSON.parse(history);

    for (var i = 0; i < history.length; i++) {
      var searchEntry = document.createElement("button");
      searchEntry.textContent = history[i].word;
      searchEntry.classList.add("search-entry");
      searchEntry.setAttribute("data-word", history[i].word);
      searchEntry.setAttribute("type", "submit");

      pastSearch.appendChild(searchEntry);
    }
  }
}

// Function to Store Past Searches in Local Storage
function storeWord(term) {
  var entry = {
    word: term,
  };

  // Get Current Search List
  var currentSearches = localStorage.getItem("searches");

  // Validate/Parse Current List
  if (!currentSearches) {
    currentSearches = [];
  } else {
    currentSearches = JSON.parse(currentSearches);
  }
  // Append New Entry to List
  currentSearches.push(entry);

  // Set Updated List in Local Storage
  localStorage.setItem("searches", JSON.stringify(currentSearches));
}

// Function to Validate and Get Synonyms
function getSynonyms(synonymsArray) {
  if (synonymsArray[0].length > 0) {
    let synonymsEl = document.createElement("div");
    let synonymsTitle = document.createElement("p");

    synonymsTitle.textContent = "Synonyms: ";
    synonymsEl.classList.add("synonyms");
    synonymsEl.appendChild(synonymsTitle);

    for (let k = 0; k < synonymsArray.length; k++) {
      let synData = synonymsArray[k];
      let synonymsList = document.createElement("ul");

      synData.forEach((elements) => {
        elements.forEach((element) => {
          let synEntry = document.createElement("li");
          synEntry.textContent = element;
          synonymsList.appendChild(synEntry);
        });
      });

      synonymsEl.appendChild(synonymsList);
    }
    mainCard.appendChild(synonymsEl);
  }
}

// Function to Validate and Get Antonyms
function getAntonyms(antonymsArray) {
  if (antonymsArray[0].length > 0) {
    let antonymsEl = document.createElement("div");
    let antonymsTitle = document.createElement("p");

    antonymsEl.classList.add("antonyms");

    antonymsTitle.textContent = "Antonyms: ";
    antonymsEl.appendChild(antonymsTitle);

    for (let k = 0; k < antonymsArray.length; k++) {
      let antData = antonymsArray[k];
      let antonymsList = document.createElement("ul");

      antData.forEach((elements) => {
        elements.forEach((element) => {
          let antEntry = document.createElement("li");
          antEntry.textContent = element;
          antonymsList.appendChild(antEntry);
        });
      });

      antonymsEl.appendChild(antonymsList);
    }
    mainCard.appendChild(antonymsEl);
  }
}

function thesaurusProcessor(term) {
  return function (thesauResponse) {
    let response = thesauResponse.data;
    let data = [];
    for (let i = 0; i < response.length; i++) {
      let metaId = response[i].meta.id;
      metaId = metaId.split(":");
      if (term.toLowerCase() === metaId[0].toLowerCase()) {
        let thesaurEnry = response[i];
        data.push(thesaurEnry);
      }
    }

    let antArray = [];
    let synArray = [];

    for (let i = 0; i < data.length; i++) {
      let antEntry = data[i].meta.ants;
      let synEntry = data[i].meta.syns;

      antArray.push(antEntry);
      synArray.push(synEntry);
    }

    getAntonyms(antArray);
    getSynonyms(synArray);
  };
}

function getThesaurus(term) {
  let thesaurusApiUrl = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${term}?key=${thesaurusApiKey}`;
  axios
    .get(thesaurusApiUrl)
    .then(thesaurusProcessor(term))
    .catch((err) => {
      console.log("No Thesaurus Results Available");
    });
}

// Display Definitions by Part of Speech
function meanings(term, meaningsData) {
  // Get Antonyms and Synonyms
  getThesaurus(term);

  definitionCard.innerHTML = "";
  for (let i = 0; i < meaningsData.length; i++) {
    let definitions = meaningsData[i].shortdef;

    //   // Create a New Card for Each Definition Returned for Each Part of Speech
    for (let j = 0; j < definitions.length; j++) {
      let slideEl = document.createElement("li");
      let slideDiv = document.createElement("div");
      let partofSpeech = document.createElement("h3");
      let definition = document.createElement("p");

      partofSpeech.textContent = meaningsData[i].fl;
      definition.textContent = definitions[j];

      definition.classList.add("definition");
      slideDiv.appendChild(partofSpeech);
      slideDiv.appendChild(definition);

      // Append Everything Created to Carousel
      partofSpeech.classList.add("text-center");
      slideEl.classList.add("orbit-slide");

      slideEl.appendChild(slideDiv);
      definitionCard.appendChild(slideEl);
    }
  }
  let firstChild = definitionCard.firstElementChild;
  firstChild.classList.add("is-active");

  Foundation.reInit("orbit");
}

// Display Images
function displayImages(response) {
  let imagesResp = response.data.photos;

  if (imagesResp.length) {
    imageCont.classList.remove("hidden");
    carouselEl.innerHTML = "";
    let numOfImages = 6;
    for (i = 0; i < numOfImages; i++) {
      let imagesEl = document.createElement("li");
      let imageEl = document.createElement("figure");
      let image = document.createElement("img");

      image.src = imagesResp[i].src.landscape;
      image.alt = imagesResp[i].photographer;

      image.classList.add("orbit-image");
      imagesEl.classList.add("orbit-slide");
      imageEl.classList.add("orbit-figure");

      image.style.height = 667;

      imageEl.appendChild(image);
      imagesEl.appendChild(imageEl);
      carouselEl.appendChild(imagesEl);
    }

    let firstChild = carouselEl.firstElementChild;
    firstChild.classList.add("is-active");

    Foundation.reInit("orbit");
  }
}

// Function to Get Images
function imageProcessor(term) {
  let pexelURL = `https://api.pexels.com/v1/search?query=${term}&per_page=6`;
  axios
    .get(pexelURL, { headers: { Authorization: `Bearer ${pexelApiKey}` } })
    .then(displayImages);
}

// Function to Display Word Origins
function displayEtymology(etResponse) {
  for (let i = 0; i < etResponse.length; i++) {
    let et = etResponse[i];

    if (et) {
      let etymologyText = document.createElement("p");
      etymologyText.textContent = et[0][1];

      mainCard.appendChild(etymologyText);
    }
  }
}

// Function to Display Phonetics
function phonetics(phoneticsData) {
  for (let i = 0; i < phoneticsData.length; i++) {
    let phonetic = phoneticsData[i].prs;

    // Valiation to Check if Phonetics is Available
    if (phonetic) {
      let phoneticBox = document.createElement("p");
      let phoneticText = document.createElement("span");
      phoneticText.textContent = phoneticsData[i].prs[0].mw;
      phoneticBox.classList.add("phoneticText");

      phoneticBox.appendChild(phoneticText);
      mainCard.appendChild(phoneticBox);
    }
  }

  let audio = phoneticsData[0].prs[0].sound.audio;
  let subfolder = phoneticsData[0].prs[0].sound.audio.charAt(0);

  // Valiation to Check if Audio is Available
  if (audio) {
    let audioBox = document.createElement("a");
    audioBox.textContent = " 🔊 ";
    audioBox.href = `https://media.merriam-webster.com/soundc11/${subfolder}/${audio}.wav?key=${merriamApiKey}`;
    audioBox.target = "_blank";
    mainCard.appendChild(audioBox);
  }
}

// Main Function to Display Dictionary Results
function displayDict(term, dictArray) {
  // Expose Main Container
  mainEl.classList.remove("hidden");

  // // Display Contents of Summary Container
  let wordTitle = document.createElement("h2");
  wordTitle.textContent = term.toLowerCase();
  wordTitle.classList.add("text-capitalize");
  mainCard.appendChild(wordTitle);

  // Parse Response to Handle Separately
  let phoneticArray = [];
  let etArray = [];

  for (let i = 0; i < dictArray.length; i++) {
    let phoneticEntry = dictArray[i].hwi;
    let etEntry = dictArray[i].et;

    phoneticArray.push(phoneticEntry);
    etArray.push(etEntry);
  }

  phonetics(phoneticArray);
  displayEtymology(etArray);
  imageProcessor(term);
  meanings(term, dictArray);
}

function displayError(term) {
  // Expose Error Container
  errorEl.classList.remove("hidden");

  // Display Error When No Results Are Found
  let errorTitle = document.createElement("h2");
  errorTitle.textContent = `No result found for ${term}`;
  errorTitle.classList.add("text-capitalize");
  errorEl.appendChild(errorTitle);
}

function dictResponseHandler(term) {
  // Validate Response and Handle Accordingly
  return function (dictResponse) {
    let response = dictResponse.data;

    if (!response.length) {
      displayError(term);
    }
    // SUGGESTIONS WHEN WORD IS MISPELLED
    else if (dictResponse.data[0].length) {
      // Expose Error Container
      errorEl.classList.remove("hidden");

      // Display Suggestions Provided by Merriam for Typos
      let suggestionTitle = document.createElement("h2");
      suggestionTitle.textContent = "Did you mean?";
      suggestionTitle.classList.add("text-capitalize");
      errorEl.appendChild(suggestionTitle);

      let suggestionList = document.createElement("ul");
      suggestionList.classList.add("suggestion");

      dictResponse.data.forEach((element) => {
        let suggestion = document.createElement("li");
        suggestion.textContent = element;
        suggestionList.appendChild(suggestion);
      });

      errorEl.appendChild(suggestionList);
    }
    // Continue Workflow
    else {
      let data = [];
      // Only Store Response Entries Relevant to User's Searched Word
      for (let i = 0; i < response.length; i++) {
        let metaId = response[i].meta.id;
        metaId = metaId.split(":");
        if (term.toLowerCase() === metaId[0].toLowerCase()) {
          let dictEntry = response[i];
          data.push(dictEntry);
        }
      }
      if (data.length) {
        displayDict(term, data);
      } else {
        displayError(term);
      }
    }
  };
}

// Error Handling Function
function dictErrorHandler(term, response) {
  // Expose Error Container
  errorEl.classList.remove("hidden");

  let errorMessage = document.createElement("h2");
  errorMessage.textContent = `${response.data.message} - ${term}`;
  errorEl.appendChild(errorMessage);
}

// Function to Process Dictionary API Request
function dictProcessor(term) {
  let merriamApiURL = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${term}?key=${merriamApiKey}`;
  axios
    .get(merriamApiURL)
    .then(dictResponseHandler(term))
    .catch((error) => {
      if (error.response) {
        dictErrorHandler(term, error.response);
      }
    });
}

// Function to Reset Page for Next Search
function resetContent() {
  // Reset Main Section
  mainCard.innerHTML = "";
  definitionCard.innerHTML = "";
  carouselEl.innerHTML = "";
  errorEl.innerHTML = "";
  mainEl.classList.add("hidden");
  imageCont.classList.add("hidden");
  errorEl.classList.add("hidden");
}

// Function to Handle Search Request
function searchHandler(event) {
  event.preventDefault();

  // Change Page Layout
  nav.classList.remove("hidden");
  header.classList.add("hidden");
  jQuery("#search-cont").detach().appendTo(nav);
  jQuery(randomWord).detach().appendTo(nav);
  searchWord.classList.remove("input-cont");
  searchWord.classList.add("search-cont");
  randomWord.setAttribute(
    "style",
    "position: relative; margin-top: 0; width: 20%;"
  );

  // Reset Main Section
  resetContent();

  // Get Searched Word
  let word = wordInput.value.trim();

  // Call API to Get Data
  if (!word) {
    alert("Word is required");
  } else {
    dictProcessor(word);
    storeWord(word);
    displaySearchHistory();

    // Reset Search Field
    wordInput.value = "";
  }
}

// Function to Process Random API Response
function randomProcessor(randomResponse) {
  // Reset Main Section
  resetContent();

  dictProcessor(randomResponse.data[0]);
  storeWord(randomResponse.data[0]);
  displaySearchHistory();
}

// Function to Handle Random Word Request
function randomHandler() {
  let randomApiURL = "https://random-word-api.herokuapp.com/word?number=1";
  axios
    .get(randomApiURL)
    .then(randomProcessor)
    .catch((err) => {
      console.log("No Random Word Available");
    });
}

// Reset History
function resetHandler() {
  localStorage.clear();
  pastSearch.innerHTML = "";
  pastSearchEl.classList.add("hidden");
}

// Speech to Text Function
function record() {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var recognition = new SpeechRecognition();

  recognition.onresult = function (event) {
    var transcript = event.results[0][0].transcript;
    wordInput.value = transcript;

    // Reset Main Section
    resetContent();

    dictProcessor(transcript);
    storeWord(transcript);
    displaySearchHistory();

    // Reset Search Field
    wordInput.value = "";
  };
  recognition.start();
}

// Event Listeners
searchWord.addEventListener("submit", searchHandler);
randomWord.addEventListener("click", randomHandler);
pastSearch.addEventListener("click", pastSearchHandler);
resetSearch.addEventListener("click", resetHandler);

// Load Foundation CSS Framework
$(document).foundation();
