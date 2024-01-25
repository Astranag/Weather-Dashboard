var APIKey = "f9cd450693b025c5bdb950be4dd48855";
var cityHistory = [];

// Display the current weather
var showCurrentWeather = function (city, data) {
    $("#today").empty(); // empty old forecast
    $("div").toggleClass("hide", false); // Show hidden content
    console.log(data);
    // Append HTML to current weather section to display forecast
    if (data && data.current) {
      $("#today").append(`
         <h2 id="cityTitle">${city} ${dayjs().format("(DD/M/YYYY)")}</h2>
         <p>Temp: ${data.current.temp} °C</p>
         <p>Wind: ${data.current.wind_speed} KM/H</p>
         <p>Humidity: ${data.current.humidity} %</p>
         `);
      $("#cityTitle").append(
        `<img src="https://openweathermap.org/img/w/${data.current.weather[0].icon}.png" alt="Weather Conditions Icon" width="50">`
      );
    } else {
      console.log("Error: data or data.current is undefined");
    }
  };

// Display the 5-day forecast
var showDailyForecast = function (data) {
  $("#forecast").empty(); // empty old forecast
  $("#forecast").append(`<h3>5-Day Forecast:</h3>`); // Append HTML to forecast section to display forecast
  for (i = 1; i < 6; i++) {
    // For loop to generate cards for 5-day forecast
    $("#forecast")
      .append(`<div class="dayCards col-md-2 mb-3 p-2" style="min-width: 100px">
            <h5>${dayjs.unix(data.daily[i].dt).format("DD/M/YYYY")}</h5>
            <img src="https://openweathermap.org/img/w/${
              data.daily[i].weather[0].icon
            }.png" alt="Weather Conditions Icon" width="50">
            <p>Temp: ${data.daily[i].temp.day} °C</p>
            <p>Wind: ${data.daily[i].wind_speed} KM/H</p>
            <p>Humidity: ${data.daily[i].humidity} %</p>
            </div>
            `);
  }
};

// Function to query weather API's
var queryWeather = function (city) {
  var queryGeoURL =
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    city +
    "&limit=1&appid=" +
    APIKey;
  fetch(queryGeoURL) // fetch call to get coordinates
    .then(function (response) {
      return response.json();
    })
    .then(function (geoData) {
      if (geoData.length > 0) {
        // Statement to check for data and store lat and lon into variables
        var lat = geoData[0].lat;
        var lon = geoData[0].lon;
        var queryWeatherURL =
          "https://api.openweathermap.org/data/3.0/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&exclude=minutely,hourly&appid=" +
          APIKey +
          "&units=metric";
        var cityName = geoData[0].name;
        // Fetch call to get city names and extended weather information from lat and lon input
        fetch(queryWeatherURL) 
          .then(function (response) {
            return response.json();
          })
          .then(function (weatherData) {
            showCurrentWeather(cityName, weatherData); // Call function to show current weather
            showDailyForecast(weatherData); // call function to show forecast
            if ($(`.city-button:contains('${cityName}')`).length === 0) {
              // Create buttons if none already exists
              $("#history").append(
                `<button type="submit" class="btn city-button btn-secondary mb-3" aria-label="submit">${cityName}</button>`
              );
              storeCity(cityName);
            }
          });
      } else {
        alert("No city found, please try again.");
      }
    });
};

// Function to store search value in localStorage
var storeCity = function (city) {
  cityHistory.push(city); // Push city to cityHistory array
  localStorage.setItem("cityHistory", JSON.stringify(cityHistory)); //Store cityHistory array in localstorage
};

// Function to get search history from localStorage
var getCityHistory = function () {
  var storedCities = localStorage.getItem("cityHistory");
  if (storedCities) {
    // Check for data in localStorage parse it back into cityHistory array
    cityHistory = JSON.parse(storedCities);
    updateCityButtons(); // Call function to update city buttons from cityHistory array.
  }
};

var updateCityButtons = function () {
  for (var i = 0; i < cityHistory.length; i++) {
    // For loop to create a new button out of each item in cityHistory array
    $("#history").append(
      `<button type="submit" class="btn city-button btn-secondary mb-3" aria-label="submit">${cityHistory[i]}</button>`
    );
  }
};

getCityHistory(); // Call function to get history from localStorage

// Event listener for user generated city buttons
$(document).on("click", ".city-button", function () {
  var cityClicked = $(this).text(); // Get text from button
  queryWeather(cityClicked); // Call queryWeather function and pass in text from button
});

// Event listener for main search button
$("#search-button").on("click", function (event) {
  event.preventDefault(); // Prevent default form behaviour
  var cityInput = $("#search-input").val().trim(); // Get value from form field and trim any space around
  if (cityInput !== "") {
    // Check that field isn't blank
    queryWeather(cityInput); // Call queryWeather function and pass in text from form field
  } else {
    alert("Enter a valid city");
  }
});


// This code is written in JavaScript, using the jQuery library, and it is used to create a simple weather application that allows the user to search for weather information of a city. Here is an explanation of what the code does:

// updateCityButtons function: This function updates the city history by creating new buttons for each item in the cityHistory array. It appends these buttons to the history element in the HTML.
// getCityHistory function call: This function is called to retrieve the city history from the local storage.
// Event listener for user-generated city buttons: This listener is attached to the document and listens for a click event on any element with the class city-button. When a button is clicked, it gets the text from the button, and calls the queryWeather function with the text as an argument.
// Event listener for the main search button: This listener is attached to the search-button element and listens for a click event. When the button is clicked, it prevents the default form behavior, gets the value from the search-input field, trims any space around it, and checks if it's not blank. If it's not blank, it calls the queryWeather function with the input as an argument. If it's blank, it shows an alert message.

