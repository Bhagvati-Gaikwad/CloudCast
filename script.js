const apiKey = "abda5d766d83d785f86a19e9a64d5dd1"; // Use your OpenWeather API key

async function fetchWeather() {
    let searchInput = document.getElementById("search").value.trim();
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";

    if (searchInput === "") {
        weatherDataSection.innerHTML = `
        <div>
            <h2>Empty Input!</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>`;
        return;
    }

    // Step 1: Get latitude and longitude via Geocoding API
    async function getLonAndLat() {
        const countryCode = "IN"; // India-specific results
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)},${countryCode}&limit=1&appid=${apiKey}`;

        try {
            const response = await fetch(geocodeURL);
            if (!response.ok) throw new Error(`Geocode API Error: ${response.status}`);

            const data = await response.json();
            if (data.length === 0) throw new Error(`City "${searchInput}" not found in India!`);

            return { lat: data[0].lat, lon: data[0].lon, name: data[0].name };
        } catch (error) {
            console.error(error);
            weatherDataSection.innerHTML = `<h2>Error</h2><p>${error.message}</p>`;
        }
    }

    // Step 2: Get weather data using lat/lon
    async function getWeatherData(lat, lon, cityName) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        try {
            const response = await fetch(weatherURL);
            if (!response.ok) throw new Error(`Weather API Error: ${response.status}`);

            const data = await response.json();

            weatherDataSection.style.display = "flex";
            weatherDataSection.innerHTML = `
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" 
                     alt="${data.weather[0].description}" width="100" />
                <div>
                    <h2>${cityName}</h2>
                    <p><strong>Temperature:</strong> ${Math.round(data.main.temp)}°C</p>
                    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                </div>`;
        } catch (error) {
            console.error(error);
            weatherDataSection.innerHTML = `<h2>Error</h2><p>${error.message}</p>`;
        }
    }

    // Fetch location first, then fetch weather
    const geocodeData = await getLonAndLat();
    if (geocodeData) {
        getWeatherData(geocodeData.lat, geocodeData.lon, geocodeData.name);
    }
}
document.getElementById("search").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission (if inside a form)
        fetchWeather(); // Call the function to fetch weather data
    }
});
document.getElementById("search").addEventListener("input", function () {
    let value = this.value;
    this.value = value.charAt(0).toUpperCase() + value.slice(1);
});
