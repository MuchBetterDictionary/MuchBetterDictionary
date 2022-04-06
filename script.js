const resultDiv = document.querySelector(".result");
const wordEl = document.querySelector(".word");
const phonetics = document.querySelector(".phonetics");
const audio = document.querySelector("audio");
const wordMeaning = document.querySelector(".word-definition");
const synonyms = document.querySelector(".synonyms");

// API handle function

const handle = async (e) => {
  if (e.keyCode === 13) {
    const word = e.target.value;
    // make a req to the api
    const result = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!result.ok) {
      console.log("No definition found");
      return;
    }
    const data = await result.json();
    wordEl.innerText = data[0].word;
    phonetics.innerText = data[0].phonetics[0].text;
    audio.src = data[0].phonetics[0].audio;
    wordMeaning.innerText = data[0].meanings[0].definitions[0].definition;
    synonyms.innerText = data[0].meanings[0].definitions[0].synonyms;
  }
};


