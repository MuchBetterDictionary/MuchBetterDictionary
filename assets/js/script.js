// Declare Global Variables
// Public API Keys
let merriamApiKey = "676327db-9f8e-4212-a0e1-d73850d216df";
let pexelApiKey = "563492ad6f917000010000014a4078a4f8b545fda3f3c33d260ab9d0";

// Get Elements
let mainEl = document.querySelector("#main-content");
let mainCard = document.querySelector("#card-main");
let wordInput = document.querySelector("#word-input");
let pastSearchEl = document.querySelector("#past-searches");
let pastSearch = document.querySelector("#past-search-cont");
let searchWord = document.querySelector("#word-search-form");
let randomWord = document.querySelector("#random-word");
let resetSearch = document.querySelector("#clear-searches");
let carouselEl = document.querySelector("#image-carousel");
let definitionCard = document.querySelector("#card-definitions");

// Function to Handle Events for Past Searches
function pastSearchHandler(event) {
  var word = event.target.getAttribute("data-word");

  // Reset Main Section
  mainCard.innerHTML = "";
  definitionCard.innerHTML = "";

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
function getSynonyms(slideDiv, synonymsArray) {
  if (synonymsArray.length > 0) {
    let synonymsEl = document.createElement("p");
    let synonymsTitle = document.createElement("span");
    let synonymsList = document.createElement("ul");

    for (let k = 0; k < synonymsArray.length; k++) {
      let synonyms = document.createElement("li");

      synonyms.textContent = synonymsArray[k];

      synonymsList.appendChild(synonyms);
    }

    synonymsTitle.textContent = "Synonyms:";
    synonymsEl.classList.add("synonyms");
    synonymsEl.appendChild(synonymsTitle);
    synonymsEl.appendChild(synonymsList);
    slideDiv.appendChild(synonymsEl);
  }
}

// Function to Validate and Get Antonyms
function getAntonyms(slideDiv, antonymsArray) {
  if (antonymsArray.length > 0) {
    let antonymsEl = document.createElement("p");
    let antonymsTitle = document.createElement("span");
    let antonymsList = document.createElement("ul");

    for (let k = 0; k < antonymsArray.length; k++) {
      let antonyms = document.createElement("li");

      antonyms.textContent = antonymsArray[k];

      antonymsList.appendChild(antonyms);
    }

    antonymsTitle.textContent = "Antonyms:";
    antonymsEl.classList.add("antonyms");
    antonymsEl.appendChild(antonymsTitle);
    antonymsEl.appendChild(antonymsList);
    slideDiv.appendChild(antonymsEl);
  }
}

// Function to Validate and Get Example
function getExample(slideDiv, definition) {
  if (definition.example) {
    let example = document.createElement("p");
    example.textContent = `ex. ${definition.example}`;
    example.classList.add("example");
    slideDiv.appendChild(example);
  }
}

// Display Definitions by Part of Speech
function meanings(meaningsData) {
  for (let i = 0; i < meaningsData.length; i++) {
    let definitions = meaningsData[i].definitions;

    // Create a New Card for Each Definition Returned for Each Part of Speech
    for (let j = 0; j < definitions.length; j++) {
      let slideDiv = document.createElement("div");
      let partofSpeech = document.createElement("h3");
      let definition = document.createElement("p");

      partofSpeech.textContent = meaningsData[i].partOfSpeech;
      definition.textContent = definitions[j].definition;

      definition.classList.add("definition");
      slideDiv.appendChild(partofSpeech);
      slideDiv.appendChild(definition);

      // Validate and Get Example Sentence, if available
      getExample(slideDiv, definitions[j]);

      // Get Antonyms and Synonyms Arrays
      let antonymsArray = meaningsData[i].antonyms;
      let synonymsArray = meaningsData[i].synonyms;

      // Validate and Get Antonyms & Synonyms, if available
      getAntonyms(slideDiv, antonymsArray);
      getSynonyms(slideDiv, synonymsArray);

      // Append Everything Created to Carousel
      slideDiv.classList.add("carousel-item");

      definitionCard.appendChild(slideDiv);
    }
  }
  const firstChild = definitionCard.firstElementChild;
  firstChild.classList.add("active");
}

// Display Images
function displayImages(response) {
  let numOfImages = 6;
  for (i = 0; i < numOfImages; i++) {
    let imageEl = document.createElement("div");
    let image = document.createElement("img");

    image.src = response.data.photos[i].src.landscape;
    image.alt = response.data.photos[i].photographer;
    image.classList.add("d-block");
    image.classList.add("w-100");
    imageEl.classList.add("carousel-item");

    if (i === 0) {
      imageEl.classList.add("active");
    }

    imageEl.appendChild(image);
    carouselEl.appendChild(imageEl);
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
function displayEtymology(etymologyResponse) {
  let etymologyText = document.createElement("p");
  etymologyText.textContent = etymologyResponse.data[0].et[0][1];

  mainCard.appendChild(etymologyText);
}

// Function to Get Word Origins
function getEtymologies(term) {
  let merriamApiURL = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${term}?key=${merriamApiKey}`;
  axios
    .get(merriamApiURL)
    .then(displayEtymology)
    .catch((err) => {
      console.log("No Entymology Available");
    });
}

// Function to Display Phonetics
function phonetics(phoneticsData) {
  for (let i = 0; i < phoneticsData.length; i++) {
    let phoneticBox = document.createElement("p");
    let phoneticText = document.createElement("span");
    let audio = phoneticsData[i].audio;

    if (audio) {
      let audioBox = document.createElement("a");
      audioBox.textContent = " 🔊 ";
      audioBox.href = phoneticsData[i].audio;
      audioBox.target = "_blank";
      phoneticBox.appendChild(audioBox);
    }

    phoneticText.textContent = phoneticsData[i].text;
    phoneticBox.setAttribute("style", "display:inline-block;");

    phoneticBox.appendChild(phoneticText);
    mainCard.appendChild(phoneticBox);
  }
}

// Main Function to Display Dictionary Results
function displayDict(dictResponse) {
  // Expose Main Container
  mainEl.classList.remove("hidden");

  // Display Contents of Summary Container
  let wordTitle = document.createElement("h2");
  wordTitle.textContent = dictResponse.data[0].word;
  wordTitle.classList.add("text-capitalize");
  mainCard.appendChild(wordTitle);

  let responseData = dictResponse.data[0];
  phonetics(responseData.phonetics);
  getEtymologies(responseData.word);
  imageProcessor(responseData.word);
  meanings(responseData.meanings);
}

// Error Handling Function
function dictErrorHandler(term, response) {
  mainEl.classList.remove("hidden");

  let errorMessage = document.createElement("h2");
  errorMessage.textContent = `${response.data.message} - ${term}`;
  mainCard.appendChild(errorMessage);
}

// Function to Process Dictionary API Request
function dictProcessor(term) {
  let dictApiURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${term}`;
  axios
    .get(dictApiURL)
    .then(displayDict)
    .catch((error) => {
      if (error.response) {
        dictErrorHandler(term, error.response);
      }
    });
}

// Function to Handle Search Request
function searchHandler(event) {
  event.preventDefault();

  // Reset Main Section
  mainCard.innerHTML = "";
  definitionCard.innerHTML = "";

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
  mainCard.innerHTML = "";
  definitionCard.innerHTML = "";

  // dictProcessor(randomResponse.data[0]);
  var randomWord =
    randomResponse[Math.floor(Math.random() * randomResponse.length)];
  dictProcessor(randomWord);
  displaySearchHistory();
}

// Function to Handle Random Word Request
function randomHandler() {
  // let randomApiURL = "https://random-word-api.herokuapp.com/word?number=1";
  // axios
  //   .get(randomApiURL)
  //   .then(randomProcessor)
  //   .catch((err) => {
  //     console.log("No Word Available");
  //   });

  let randomArray = ["snood", "cupboard", "knife", "refrigerator", "indict"];

  randomProcessor(randomArray);
}

// Reset History
function resetHandler() {
  localStorage.clear();
  pastSearch.innerHTML = "";
  pastSearchEl.classList.add("hidden");
}
function record() {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var recognition = new SpeechRecognition();

  recognition.onresult = function (event) {
    var transcript = event.results[0][0].transcript;
    wordInput.value = transcript;
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
