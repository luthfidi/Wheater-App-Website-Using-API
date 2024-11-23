// Import API key from config
import config from "./config.js";

// Constants
const API = {
    key: config.apiKey,
    base: "https://api.openweathermap.org/data/2.5/weather?units=metric&q="
};

// DOM Elements
const DOM = {
    searchBox: document.querySelector(".search input"),
    searchBtn: document.querySelector(".search button"),
    weatherIcon: document.querySelector(".weather-icon"),
    errorElement: document.querySelector(".error"),
    weatherElement: document.querySelector(".weather"),
    cityElement: document.querySelector(".city"),
    tempElement: document.querySelector(".temp"),
    humidityElement: document.querySelector(".humidity"),
    windElement: document.querySelector(".wind"),
    timeElement: document.getElementById("current-time")
};

// Weather Theme Configuration
const WEATHER_THEMES = {
    Clear: {
        backgroundColor: "#87CEEB",
        cloudColor: "#FFFFFF",
        sunColor: "#FFD700"
    },
    Clouds: {
        backgroundColor: "#465760",
        cloudColor: "#B8C6DB",
        sunColor: "#C9C9C9"
    },
    Rain: {
        backgroundColor: "#2F343B",
        cloudColor: "#4A6670",
        sunColor: "#85939E"
    },
    Snow: {
        backgroundColor: "#E3E3E3",
        cloudColor: "#FFFFFF",
        sunColor: "#D4D4D4"
    },
    Mist: {
        backgroundColor: "#B8C6DB",
        cloudColor: "#E2E8F0",
        sunColor: "#CBD5E1"
    },
    Drizzle: {
        backgroundColor: "#4A6670",
        cloudColor: "#85939E",
        sunColor: "#A4B0BE"
    },
    Thunderstorm: {
        backgroundColor: "#1F2937",
        cloudColor: "#374151",
        sunColor: "#4B5563"
    }
};

// Vanta.js effect holder
let vantaEffect = null;

/**
 * Card Style Manager
 */
class CardStyleManager {
    static updateCard() {
        try {
            const card = document.querySelector(".card");
            
            // Enhanced dark theme with more blur and opacity
            card.style.background = "rgba(0, 0, 0, 0.65)"; // Increased opacity
            card.style.backdropFilter = "blur(15px)"; // Increased blur
            card.style.webkitBackdropFilter = "blur(15px)"; // For Safari support
            card.style.color = "#ffffff";
            card.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)";
            card.style.border = "1px solid rgba(255, 255, 255, 0.1)";
        } catch (error) {
            console.error('Error updating card styles:', error);
        }
    }
}

/**
 * Vanta Background Manager
 */
class VantaManager {
    static init() {
        try {
            vantaEffect = VANTA.CLOUDS({
                el: "#vanta-background",
                mouseControls: true,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.0,
                minWidth: 200.0,
                backgroundColor: 0x465760,
                cloudColor: 0xB8C6DB,
                sunColor: 0xC9C9C9,
                cloudShadowColor: 0x000000,
                sunGlareColor: 0x666666,
                sunlightColor: 0x888888,
                speed: 1
            });
        } catch (error) {
            console.error('Error initializing Vanta.js:', error);
        }
    }

    static updateTheme(weatherCondition) {
        try {
            const theme = WEATHER_THEMES[weatherCondition] || WEATHER_THEMES.Clouds;
            if (vantaEffect) {
                vantaEffect.setOptions({
                    backgroundColor: parseInt(theme.backgroundColor.replace("#", ""), 16),
                    cloudColor: parseInt(theme.cloudColor.replace("#", ""), 16),
                    sunColor: parseInt(theme.sunColor.replace("#", ""), 16)
                });
            }
        } catch (error) {
            console.error('Error updating Vanta theme:', error);
        }
    }
}

/**
 * Weather Display Manager
 */
class WeatherManager {
    static updateIcon(condition) {
        try {
            const weatherMap = {
                clouds: "clouds.png",
                clear: "clear-sky.png",
                rain: "rainy.png",
                drizzle: "drizzle.png",
                mist: "mist.png",
                fog: "fog.png",
                snow: "snow.png",
                thunderstorm: "thunderstorm.png"
            };

            const iconName = weatherMap[condition.toLowerCase()] || "clear-sky.png";
            DOM.weatherIcon.src = `images/${iconName}`;
            DOM.weatherIcon.onerror = () => {
                console.error('Failed to load weather icon:', DOM.weatherIcon.src);
                DOM.weatherIcon.src = "images/clear-sky.png";
            };
        } catch (error) {
            console.error('Error updating weather icon:', error);
            DOM.weatherIcon.src = "images/clear-sky.png";
        }
    }

    static updateInfo(data) {
        try {
            DOM.cityElement.textContent = data.name;
            DOM.tempElement.textContent = `${Math.round(data.main.temp)}°c`;
            DOM.humidityElement.textContent = `${data.main.humidity}%`;
            DOM.windElement.textContent = `${data.wind.speed} km/h`;
        } catch (error) {
            console.error('Error updating weather info:', error);
        }
    }

    static showError(message = "Invalid city name") {
        DOM.errorElement.textContent = message;
        DOM.errorElement.style.display = "block";
        DOM.weatherElement.style.display = "none";
    }

    static showWeather() {
        DOM.weatherElement.style.display = "block";
        DOM.errorElement.style.display = "none";
    }
}

/**
 * Time Manager
 */
class TimeManager {
    static update() {
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
                hour12: true
            };
            DOM.timeElement.textContent = now.toLocaleString("en-US", options);
        } catch (error) {
            console.error('Error updating time:', error);
        }
    }

    static startTimer() {
        this.update();
        setInterval(() => this.update(), 1000);
    }
}

/**
 * Weather API Service
 */
class WeatherService {
    static async getWeather(city) {
        if (!city?.trim()) {
            WeatherManager.showError("Please enter a city name");
            return null;
        }

        try {
            const response = await fetch(API.base + city + `&appid=${API.key}`);
            
            if (!response.ok) {
                const errorMessage = response.status === 404 ? 
                    "City not found" : `Error: ${response.status}`;
                WeatherManager.showError(errorMessage);
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching weather:', error);
            WeatherManager.showError("Failed to fetch weather data");
            return null;
        }
    }

    static async processWeatherData(data) {
        if (!data?.weather?.[0]) {
            throw new Error("Invalid weather data structure");
        }

        WeatherManager.updateInfo(data);
        WeatherManager.updateIcon(data.weather[0].main);
        VantaManager.updateTheme(data.weather[0].main);
        CardStyleManager.updateCard(); // Maintain consistent dark theme
        WeatherManager.showWeather();
    }
}

/**
 * Event Handler
 */
class EventHandler {
    static setupListeners() {
        try {
            // Search handlers
            DOM.searchBtn.addEventListener("click", this.handleSearch);
            DOM.searchBox.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    this.handleSearch();
                }
            });

            // Image interaction prevention
            this.setupImageProtection();
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    static async handleSearch() {
        const cityName = DOM.searchBox.value.trim();
        const weatherData = await WeatherService.getWeather(cityName);
        
        if (weatherData) {
            await WeatherService.processWeatherData(weatherData);
        }

        DOM.searchBox.value = "";
        DOM.searchBox.blur();
    }

    static setupImageProtection() {
        const preventDefaultActions = (e) => e.preventDefault();
        const events = ["dragstart", "contextmenu", "touchstart", "touchmove"];

        document.querySelectorAll("img").forEach(img => {
            events.forEach(event => {
                img.addEventListener(
                    event,
                    preventDefaultActions,
                    event.startsWith("touch") ? { passive: false } : undefined
                );
            });
        });
    }
}

/**
 * App Initialization
 */
document.addEventListener("DOMContentLoaded", function() {
    try {
        VantaManager.init();
        TimeManager.startTimer();
        EventHandler.setupListeners();
    } catch (error) {
        console.error('Error initializing weather app:', error);
    }
});