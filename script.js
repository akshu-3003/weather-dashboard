const apiKey = "ccb287790f3b8b0c1b7fb397a44da19e"; // Replace with your OpenWeatherMap API key
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherInfo = document.getElementById("weatherInfo");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city === "") {
    alert("Please enter a city name");
    return;
  }
  getWeatherData(city);
  getForecast(city); 
});

async function getWeatherData(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    console.log("Fetching URL:", url);

    const response = await fetch(url);
    const data = await response.json();

    console.log("API Data:", data);

    if (data.cod !== 200) {
      throw new Error(data.message);
    }

    displayWeather(data);
  } catch (error) {
    weatherInfo.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}


function displayWeather(data) {
  const { name, main, weather } = data;
  const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  weatherInfo.innerHTML = `
    <h2>${name}</h2>
    <img src="${icon}" alt="${weather[0].description}" />
    <p><strong>${main.temp}°C</strong></p>
    <p>${weather[0].description.toUpperCase()}</p>
  `;
}
// Fetch 5-day forecast
async function getForecast(city) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if(data.cod !== "200"){
      throw new Error(data.message);
    }

    displayForecast(data);
  } catch(error) {
    console.log("Forecast Error:", error.message);
  }
}

// Display 5-day forecast
function displayForecast(data){
  const forecastContainer = document.getElementById("forecastContainer");
  forecastContainer.innerHTML = ""; // Clear previous forecast

  // Filter one forecast per day (around 12:00 PM)
  const dailyForecast = data.list.filter(f => f.dt_txt.includes("12:00:00"));

  dailyForecast.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    const dayDiv = document.createElement("div");
    dayDiv.style.background = "rgba(255,255,255,0.1)";
    dayDiv.style.backdropFilter = "blur(5px)";
    dayDiv.style.borderRadius = "10px";
    dayDiv.style.padding = "10px";
    dayDiv.style.margin = "5px";
    dayDiv.style.width = "80px";
    dayDiv.style.textAlign = "center";
    dayDiv.style.color = "white";

    dayDiv.innerHTML = `
      <p>${dayName}</p>
      <img src="${iconUrl}" alt="${day.weather[0].description}">
      <p>${Math.round(day.main.temp)}°C</p>
    `;

    forecastContainer.appendChild(dayDiv);
  });
}
