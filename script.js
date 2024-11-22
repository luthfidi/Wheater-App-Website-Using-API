import config from "./config.js";

const apiKey = config.apiKey;
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// Elements
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const errorElement = document.querySelector(".error");
const weatherElement = document.querySelector(".weather");

// Vanta.js effect holder
let vantaEffect = null;

// Weather theme configurations
const weatherThemes = {
  Clear: {
    backgroundColor: "#87CEEB",
    cloudColor: "#FFFFFF",
    sunColor: "#FFD700",
    cardBackground: "rgba(0, 0, 0, 0.85)",
  },
  Clouds: {
    backgroundColor: "#465760",
    cloudColor: "#B8C6DB",
    sunColor: "#C9C9C9",
    cardBackground: "rgba(255, 255, 255, 0.2)",
  },
  Rain: {
    backgroundColor: "#2F343B",
    cloudColor: "#4A6670",
    sunColor: "#85939E",
    cardBackground: "rgba(255, 255, 255, 0.25)",
  },
  Snow: {
    backgroundColor: "#E3E3E3",
    cloudColor: "#FFFFFF",
    sunColor: "#D4D4D4",
    cardBackground: "rgba(0, 0, 0, 0.8)",
  },
  Mist: {
    backgroundColor: "#B8C6DB",
    cloudColor: "#E2E8F0",
    sunColor: "#CBD5E1",
    cardBackground: "rgba(0, 0, 0, 0.85)",
  },
  Fog: {
    backgroundColor: "#A4B0C0",
    cloudColor: "#D0D8E0",
    sunColor: "#BBC3CF",
    cardBackground: "rgba(0, 0, 0, 0.9)",
  },
};

// Set contrast automate
function updateCardContrast(weatherCondition) {
  try {
    const theme = weatherThemes[weatherCondition] || weatherThemes.Clear;
    const backgroundColor = theme.backgroundColor;

    // Convert hex to RGB
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);

    // Calculate relative luminance
    // Formula: https://www.w3.org/TR/WCAG20/#relativeluminancedef
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Adjust card background based on background luminance
    const card = document.querySelector(".card");
    if (luminance > 0.5) {
      // Light background - use darker card
      card.style.background = "rgba(0, 0, 0, 0.4)";
      card.style.color = "#ffffff";
    } else {
      // Dark background - use lighter card
      card.style.background = "rgba(255, 255, 255, 0.25)";
      card.style.color = "#ffffff";
    }

    // Adjust card shadow based on background
    card.style.boxShadow =
      luminance > 0.5
        ? "0 15px 35px rgba(0, 0, 0, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.1)"
        : "0 15px 35px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(255, 255, 255, 0.2)";

    console.log(
      "Card contrast updated for weather condition:",
      weatherCondition
    );
  } catch (error) {
    console.error("Error updating card contrast:", error);
  }
}

// Initialize Vanta.js effect
function initVanta() {
  try {
    vantaEffect = VANTA.CLOUDS({
      el: "#vanta-background",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      backgroundColor: 0x87ceeb,
      cloudColor: 0xffffff,
      sunColor: 0xffd700,
      cloudShadowColor: 0x000000,
      sunGlareColor: 0xff6633,
      sunlightColor: 0xff9933,
      speed: 1,
    });
    console.log("Vanta.js initialized successfully");
  } catch (error) {
    console.error("Error initializing Vanta.js:", error);
  }
}

// Update time display
function updateTime() {
  try {
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    document.getElementById("current-time").textContent = now.toLocaleString(
      "en-US",
      options
    );
  } catch (error) {
    console.error("Error updating time:", error);
  }
}

function showError(message = "Invalid city name") {
  errorElement.textContent = message;
  errorElement.style.display = "block";
  weatherElement.style.display = "none";
}

function showWeather() {
  weatherElement.style.display = "block";
  errorElement.style.display = "none";
}

function validateInput(city) {
  return city && city.trim() !== "";
}

// Update Vanta theme based on weather
function updateVantaTheme(weatherCondition) {
  try {
    console.log("Updating theme for weather condition:", weatherCondition);
    const theme = weatherThemes[weatherCondition] || weatherThemes.Clear;

    // Convert hex to numbers for Vanta.js
    const bgColor = parseInt(theme.backgroundColor.replace("#", ""), 16);
    const cloudColor = parseInt(theme.cloudColor.replace("#", ""), 16);
    const sunColor = parseInt(theme.sunColor.replace("#", ""), 16);

    // Update Vanta effect with smooth transition
    if (vantaEffect) {
      vantaEffect.setOptions({
        backgroundColor: bgColor,
        cloudColor: cloudColor,
        sunColor: sunColor,
      });
    }

    // Update card contrast
    updateCardContrast(weatherCondition);

    // Add smooth transition to card
    const card = document.querySelector(".card");
    card.style.transition = "all 0.5s ease-in-out";
  } catch (error) {
    console.error("Error updating Vanta theme:", error);
  }
}

function updateWeatherIcon(weatherCondition) {
  console.log("Updating weather icon for condition:", weatherCondition);

  // Add error handling for the weather icon
  weatherIcon.onerror = function () {
    console.error("Failed to load weather icon:", this.src);
    this.src = "images/clear-sky.png"; // fallback image
  };

  try {
    // Convert to lowercase for case-insensitive comparison
    const condition = weatherCondition.toLowerCase();

    switch (condition) {
      case "clouds":
        weatherIcon.src = "images/clouds.png";
        break;
      case "clear":
        weatherIcon.src = "images/clear-sky.png";
        break;
      case "rain":
        weatherIcon.src = "images/rainy.png";
        break;
      case "drizzle":
        weatherIcon.src = "images/drizzle.png";
        break;
      case "mist":
        weatherIcon.src = "images/mist.png";
        break;
      case "fog":
        weatherIcon.src = "images/fog.png";
        break;
      case "snow":
        weatherIcon.src = "images/snow.png";
        break;
      case "thunderstorm":
        weatherIcon.src = "images/thunderstorm.png";
        break;
      default:
        console.warn("Unknown weather condition:", weatherCondition);
        weatherIcon.src = "images/clear-sky.png";
    }

    console.log("Weather icon updated successfully:", weatherIcon.src);
  } catch (error) {
    console.error("Error updating weather icon:", error);
    weatherIcon.src = "images/clear-sky.png";
  }
}

function updateWeatherInfo(data) {
  try {
    console.log("Updating weather info with data:", data);

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML =
      Math.round(data.main.temp) + "°c";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    console.log("Weather info updated successfully");
  } catch (error) {
    console.error("Error updating weather info:", error);
  }
}

async function checkWeather(city) {
  if (!validateInput(city)) {
    showError("Please enter a city name");
    return;
  }

  try {
    console.log("Fetching weather data for:", city);
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (!response.ok) {
      if (response.status === 404) {
        showError("City not found");
      } else {
        showError(`Error: ${response.status}`);
      }
      console.error("API response error:", response.status);
      return;
    }

    const data = await response.json();
    console.log("Weather data received:", data);

    if (data.weather && data.weather[0]) {
      updateWeatherInfo(data);
      updateWeatherIcon(data.weather[0].main);
      updateVantaTheme(data.weather[0].main);
      showWeather();
    } else {
      throw new Error("Invalid weather data structure");
    }
  } catch (error) {
    console.error("Error fetching weather:", error);
    showError("Failed to fetch weather data");
  }
}

function handleSearch() {
  const cityName = searchBox.value.trim();
  checkWeather(cityName);
  searchBox.value = "";
  searchBox.blur();
}

// Event Listeners
function setupEventListeners() {
  try {
    searchBtn.addEventListener("click", handleSearch);

    searchBox.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSearch();
      }
    });

    // Prevent image interactions
    const images = document.querySelectorAll("img");
    const preventDefaultActions = (e) => e.preventDefault();

    images.forEach((img) => {
      ["dragstart", "contextmenu", "touchstart", "touchmove"].forEach(
        (event) => {
          img.addEventListener(
            event,
            preventDefaultActions,
            event.startsWith("touch") ? { passive: false } : undefined
          );
        }
      );
    });

    console.log("Event listeners setup complete");
  } catch (error) {
    console.error("Error setting up event listeners:", error);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  try {
    console.log("Initializing weather app...");

    // Initialize Vanta.js
    initVanta();

    // Initialize time display
    updateTime();
    setInterval(updateTime, 1000);

    // Setup event listeners
    setupEventListeners();

    console.log("Weather app initialized successfully");
  } catch (error) {
    console.error("Error initializing weather app:", error);
  }
});

// Tambahkan CSS baru ke dalam style.css
const additionalStyles = `
.card {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.5s ease-in-out;
}

.card:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.search input {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    transition: all 0.3s ease;
}

.search input:focus {
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.search input::placeholder {
    color: rgba(255, 255, 255, 0.7);
}

.search button {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.search button:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(20deg);
}
`;
