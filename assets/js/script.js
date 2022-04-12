// Declare Global Variables
//Public API Keys
let merriamApiKey = "676327db-9f8e-4212-a0e1-d73850d216df";
let pexelApiKey = "563492ad6f917000010000014a4078a4f8b545fda3f3c33d260ab9d0";

// Get Elements
let mainEl = document.querySelector("#main-content");
let mainCard = document.querySelector("#card-main");
let definitionCard = document.querySelector("#card-definitions");
let searchWord = document.querySelector("#word-search-form");
let randomWord = document.querySelector("#random-word");

// Function to Display Definitions by Part of Speech
function meanings(meaningsData) {
  for (let i = 0; i < meaningsData.length; i++) {
    let definitions = meaningsData[i].definitions;

    // Create a New Card for Each Definition Returned for Each Part of Speech
    for (let j = 0; j < definitions.length; j++) {
      let slide = document.createElement("li");
      let slideDiv = document.createElement("div");
      let partofSpeech = document.createElement("h3");
      let definition = document.createElement("p");

      partofSpeech.textContent = meaningsData[i].partOfSpeech;
      definition.textContent = definitions[j].definition;

      definition.classList.add("definition");
      slideDiv.appendChild(partofSpeech);
      slideDiv.appendChild(definition);

      // Validate and Get Example Sentence, if available
      if (definitions[j].example) {
        let example = document.createElement("p");
        example.textContent = `ex. ${definitions[j].example}`;
        example.classList.add("example");
        slideDiv.appendChild(example);
      }

      // Get Antonyms and Synonyms Arrays
      let antonymsArray = meaningsData[i].antonyms;
      let synonymsArray = meaningsData[i].synonyms;

      // Validate and Get Antonyms, if available
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

      // Validate and Get Synonyms, if available
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

      // Append Everything Created to Orbit Slides
      slide.appendChild(slideDiv);
      definitionCard.appendChild(slide);
    }
  }
}

// Function to Display Images
function displayImages(response) {
  let imagesCont = document.createElement("ul");
  for (i = 0; i < 6; i++) {
    let imagesEl = document.createElement("li");
    let imageEl = document.createElement("figure");
    let imageLink = document.createElement("a");
    let image = document.createElement("img");

    imageLink.href = response.data.photos[i].src.landscape;
    imageLink.target = "_blank";
    image.src = response.data.photos[i].src.landscape;
    image.alt = response.data.photos[i].photographer;
    image.classList.add("img-thumbnail");

    imageEl.appendChild(imageLink);
    imageEl.appendChild(image);
    imagesEl.appendChild(imageEl);
    imagesCont.appendChild(imagesEl);
  }

  imagesCont.classList.add("orbit-container");
  mainCard.appendChild(imagesCont);
}

// Function to Get Images
function imageProcessor(term) {
  let pexelURL = `https://api.pexels.com/v1/search?query=${term}&per_page=6`;
  axios
    .get(pexelURL, { headers: { Authorization: `Bearer ${pexelApiKey}` } })
    .then(displayImages)
    .catch((err) => {
      console.log(err);
      return "Not able to retrieve Images";
    });
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
      console.log(err);
      return "Not able to retrieve Etymology Details";
    });

  return;
}

// Function to Display Phonetics
function phonetics(phoneticsData) {
  for (let i = 0; i < phoneticsData.length; i++) {
    let phoneticBox = document.createElement("p");
    let phoneticText = document.createElement("span");
    let audioBox = document.createElement("a");

    phoneticText.textContent = phoneticsData[i].text;
    audioBox.textContent = " 🔊";
    audioBox.href = phoneticsData[i].audio;
    audioBox.target = "_blank";
    phoneticBox.setAttribute("style", "display:inline-block;");

    phoneticBox.appendChild(phoneticText);
    phoneticBox.appendChild(audioBox);
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

  phonetics(dictResponse.data[0].phonetics);
  getEtymologies(dictResponse.data[0].word);
  imageProcessor(dictResponse.data[0].word);
  meanings(dictResponse.data[0].meanings);
}

// Function to Process Dictionary API Request
function dictProcessor(term) {
  let dictApiURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${term}`;
  axios
    .get(dictApiURL)
    .then(displayDict)
    .catch((err) => {
      console.log(err);
      return "Not able to retrieve Dictionary Details";
    });
}

// Function to Get Basic Dictionary Details from Dictionary API Entry API

// Function to Handle Search Request
function searchHandler(event) {
  event.preventDefault();

  // Reset Main Section
  mainCard.innerHTML = "";
  definitionCard.innerHTML = "";

  // Get Searched Word
  let wordInput = document.querySelector("#word-input");
  let word = wordInput.value.trim();

  // Call API to Get Data
  if (!word) {
    alert("Word is required");
  } else {
    dictProcessor(word);

    // Reset Search Field
    wordInput.value = "";
  }
}

// Function to Process Random API Response
function randomProcessor(randomResponse) {
  console.log(randomResponse.data[0]);
  dictProcessor(randomResponse.data[0]);
}

// Function to Handle Random Word Request
// TO DO: Convert to a Set Interval so only ONE Word is generated per day
function randomHandler() {
  let randomApiURL = "https://random-word-api.herokuapp.com/word?number=1";
  axios
    .get(randomApiURL)
    .then(randomProcessor)
    .catch((err) => {
      console.log(err);
      return "No Word Available";
    });
}

// Event Listeners
searchWord.addEventListener("submit", searchHandler);
randomWord.addEventListener("click", randomHandler);
