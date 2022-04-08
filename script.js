//Merriam Webster API key (Ross account)
var apiKey = "676327db-9f8e-4212-a0e1-d73850d216df"
//Request URL `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word)?key=apiKey`

var wordSearchEl = document.querySelector("#word-search");
var wordNameEl = document.querySelector("#word-name");
var wordDefinitionEl = document.querySelector("#word-definition");
var wordEtymologyEl = document.querySelector("#etymology");
var storeWordEl = document.querySelector("#word-history");
var searchHistory = [];

var formSubmitHandler = function (event) {
  event.preventDefault();

  var wordName = wordNameEl.value.trim();

  if (wordName) {
    getWordData(wordName);
    getDefinition(wordName);
    getEtymology(wordName);
    storeWord(wordName);
    wordNameEl.value = "";
  } else {
    alert("Do you have the correct spelling?");
  }
};

var getWordData = function (word) {
  var wordData =
    "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" +
    word +
    "?key=" +
    apiKey;

  fetch(wordData).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayWordData(data);
      });
    } else {
      alert("Error: " + response.cod);
    }
    console.log(wordData);
  });
  
};


// var displayWordData = function (word) {
//   currentWeatherEl.textContent = "";
//   var currentTime = city.dt * 1000;
//   var currentDate = new Date(currentTime);
//   var formattedDate = currentDate
//     .toLocaleString("en-US", { timeZoneName: "short" })
//     .split(",", 1);

//   var weatherCityEl = document.createElement("h2");
//   var weatherIcon = document.createElement("img");
//   weatherIcon.setAttribute(
//     "src",
//     "https://openweathermap.org/img/wn/" + city.weather[0].icon + ".png"
//   );
//   weatherCityEl.textContent = city.name + " " + formattedDate;

//   currentWeatherEl.appendChild(weatherCityEl);
//   weatherCityEl.appendChild(weatherIcon);

//   var temperatureEl = document.createElement("p");
//   temperatureEl.classList =
//     "list-item flex-row justify-space-between align-left";
//   temperatureEl.textContent = "Temperature: " + city.main.temp + "\u00B0F";

//   var humidityEl = document.createElement("p");
//   humidityEl.classList = "list-item flex-row justify-space-between align-left";
//   humidityEl.textContent = "Humidity: " + city.main.humidity + "%";

//   var windSpeedEl = document.createElement("p");
//   windSpeedEl.classList = "list-item flex-row justify-space-between align-left";
//   windSpeedEl.textContent = "Wind Speed: " + city.wind.speed + " mph";

//   currentWeatherEl.appendChild(temperatureEl);
//   currentWeatherEl.appendChild(humidityEl);
//   currentWeatherEl.appendChild(windSpeedEl);
// };








// const resultDiv = document.querySelector(".result");
// const wordEl = document.querySelector(".word");
// const phonetics = document.querySelector(".phonetics");
// const audio = document.querySelector("audio");
// const wordMeaning = document.querySelector(".word-definition");
// const synonyms = document.querySelector(".synonyms");

// // API handle function

// const handle = async (e) => {
//   if (e.keyCode === 13) {
//     const word = e.target.value;
//     // make a req to the api
//     const result = await fetch(
//       `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word)?key=apiKey`
//     );
//     if (!result.ok) {
//       console.log("No definition found");
//       return;
//     }
//   }

//     const data = await result.json();
//     wordEl.innerText = data[0].word;
//     phonetics.innerText = data[0].phonetics[0].text;
//     audio.src = data[0].phonetics[0].audio;
//     wordMeaning.innerText = data[0].meanings[0].partOfSpeech[0].noun[0];defintions[0];
//     for (var i=0; i < defintions.length; i++);    
//     synonyms.innerText = data[0].meanings[0].definitions[0].synonyms;
//   }
// };


