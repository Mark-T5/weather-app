let isCelsius = true;

function toggleTemperature() {
    let tempElement = document.getElementById("temperature");

    let weatherData = JSON.parse(localStorage.getItem("weather"));
    if (!weatherData) {
        console.error("No weather data found!");
        return;
    }

    let temperatureC = weatherData.temperatureCelsius; 

    if (isCelsius) {
        let fahrenheit = (temperatureC * 9/5) + 32;
        tempElement.innerHTML = `${fahrenheit.toFixed(1)}°F`;
    } else {
        tempElement.innerHTML = `${temperatureC}°C`;
    }

    isCelsius = !isCelsius;
}


async function getWeather() {
    const cityInput = document.getElementById("cityInput").value.trim();
    const infoBox = document.getElementById("weather-info");

    try {
        const response = await fetch("Weather.json"); 
        const weatherData = await response.json();

        const cityWeather = weatherData.find(city => city.cityName.toLowerCase() === cityInput.toLowerCase());

        if (cityWeather) {
            infoBox.innerHTML = `
                <p>Temperature: <span id="temp">${cityWeather.temperatureCelsius}°C</span></p>
                <p>Humidity: <span id="humidity">${cityWeather.humidity * 100}%</span></p>
                <p>UV Index: <span id="uv">${cityWeather.uvIndex}</span></p>
                <p>Wind Speed: <span id="wind">${cityWeather.windSpeed}</span></p>
            `;

            // Save to LocalStorage for other pages, needs to be stored as a string for localStorage
            localStorage.setItem("weather", JSON.stringify(cityWeather));

            updateStyles(cityWeather);
        } else {
            infoBox.innerHTML = `<p>City not found. Try another city!</p>`;
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        infoBox.innerHTML = `<p>Error fetching data. Please try again.</p>`;
    }
}

function updateStyles(weather) {
    let tempIcon = document.getElementById("temp-icon");
    let humidityIcon = document.getElementById("humidity-icon");
    let uvIcon = document.getElementById("uv-icon");
    let windIcon = document.getElementById("wind-icon");

    if (tempIcon) {
        tempIcon.style.color = weather.temperatureCelsius > 22 ? "red" : "blue";
    }
    if (humidityIcon) {
        humidityIcon.style.color = weather.humidity > 0.6 ? "green" : "gray";
    }
    if (uvIcon) {
        uvIcon.style.color = weather.uvIndex > 6 ? "red" : "orange";
    }
    if (windIcon) {
        let windSpeed = parseInt(weather.windSpeed); // Convert number in km to number
        windIcon.style.color = windSpeed > 20 ? "darkblue" : "purple";
    }
}

// Load weather data on individual pages, only after entire html file is loaded
document.addEventListener("DOMContentLoaded", function () {
    let weatherData = JSON.parse(localStorage.getItem("weather"));
    if (weatherData) {
        if (document.getElementById("temperature")) {
            document.getElementById("temperature").innerText = `${weatherData.temperatureCelsius}°C`;
        }
        if (document.getElementById("humidity")) {
            document.getElementById("humidity").innerText = `${weatherData.humidity * 100}%`;
        }
        if (document.getElementById("uv")) {
            document.getElementById("uv").innerText = `${weatherData.uvIndex}`;
        }
        if (document.getElementById("wind")) {
            document.getElementById("wind").innerText = `${weatherData.windSpeed}`;
        }

        updateStyles(weatherData);
    }
});

