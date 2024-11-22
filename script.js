import config from './config.js';

const apiKey = config.apiKey;
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// Elements
const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon');
const errorElement = document.querySelector('.error');
const weatherElement = document.querySelector('.weather');

// Vanta.js effect holder
let vantaEffect = null;

// Weather theme configurations
const weatherThemes = {
    Clear: {
        backgroundColor: '#87CEEB',
        cloudColor: '#FFFFFF',
        sunColor: '#FFD700',
        cardBackground: 'rgba(0, 0, 0, 0.2)'
    },
    Clouds: {
        backgroundColor: '#465760',
        cloudColor: '#B8C6DB',
        sunColor: '#C9C9C9',
        cardBackground: 'rgba(255, 255, 255, 0.15)'
    },
    Rain: {
        backgroundColor: '#2F343B',
        cloudColor: '#4A6670',
        sunColor: '#85939E',
        cardBackground: 'rgba(255, 255, 255, 0.2)'
    },
    Drizzle: {
        backgroundColor: '#40484E',
        cloudColor: '#5B777F',
        sunColor: '#95A3AE',
        cardBackground: 'rgba(255, 255, 255, 0.18)'
    },
    Thunderstorm: {
        backgroundColor: '#1a1a1a',
        cloudColor: '#333333',
        sunColor: '#4A4A4A',
        cardBackground: 'rgba(255, 255, 255, 0.25)'
    },
    Snow: {
        backgroundColor: '#E3E3E3',
        cloudColor: '#FFFFFF',
        sunColor: '#D4D4D4',
        cardBackground: 'rgba(0, 0, 0, 0.1)'
    },
    Mist: {
        backgroundColor: '#B8C6DB',
        cloudColor: '#E2E8F0',
        sunColor: '#CBD5E1',
        cardBackground: 'rgba(0, 0, 0, 0.15)'
    },
    Fog: {
        backgroundColor: '#A4B0C0',
        cloudColor: '#D0D8E0',
        sunColor: '#BBC3CF',
        cardBackground: 'rgba(0, 0, 0, 0.12)'
    }
};

// Initialize Vanta.js effect
function initVanta() {
    vantaEffect = VANTA.CLOUDS({
        el: "#vanta-background",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        backgroundColor: 0x87ceeb,
        cloudColor: 0xffffff,
        sunColor: 0xffd700,
        cloudShadowColor: 0x000000,
        sunGlareColor: 0xff6633,
        sunlightColor: 0xff9933,
        speed: 1
    });
}

// Update time display
function updateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    };
    document.getElementById('current-time').textContent = now.toLocaleString('en-US', options);
}

function showError() {
    errorElement.style.display = 'block';
    weatherElement.style.display = 'none';
}

function showWeather() {
    weatherElement.style.display = 'block';
    errorElement.style.display = 'none';
}

function validateInput(city) {
    return city && city.trim() !== '';
}

// Update Vanta theme based on weather
function updateVantaTheme(weatherCondition) {
    const theme = weatherThemes[weatherCondition] || weatherThemes.Clear;
    
    // Convert hex to numbers for Vanta.js
    const bgColor = parseInt(theme.backgroundColor.replace('#', ''), 16);
    const cloudColor = parseInt(theme.cloudColor.replace('#', ''), 16);
    const sunColor = parseInt(theme.sunColor.replace('#', ''), 16);

    // Update Vanta effect with smooth transition
    if (vantaEffect) {
        vantaEffect.setOptions({
            backgroundColor: bgColor,
            cloudColor: cloudColor,
            sunColor: sunColor
        });
    }

    // Update card background with transition
    const card = document.querySelector('.card');
    card.style.background = theme.cardBackground;
}

function updateWeatherIcon(weatherCondition) {
    switch(weatherCondition) {
        case "Clouds":
            weatherIcon.src = "images/clouds.png";
            break;
        case "Clear":
            weatherIcon.src = "images/clear-sky.png";
            break;
        case "Rain":
            weatherIcon.src = "images/rainy.png";
            break;
        case "Drizzle":
            weatherIcon.src = "images/drizzle.png";
            break;
        case "Mist":
            weatherIcon.src = "images/mist.png";
            break;
        case "Fog":
            weatherIcon.src = "images/fog.png";
            break;
        case "Snow":
            weatherIcon.src = "images/snow.png";
            break;
        case "Thunderstorm":
            weatherIcon.src = "images/thunderstorm.png";
            break;
        default:
            weatherIcon.src = "images/clear-sky.png";
    }
}

function updateWeatherInfo(data) {
    document.querySelector('.city').innerHTML = data.name;
    document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + "°c";
    document.querySelector('.humidity').innerHTML = data.main.humidity + "%";
    document.querySelector('.wind').innerHTML = data.wind.speed + " km/h";
}

async function checkWeather(city) {
    if (!validateInput(city)) {
        showError();
        return;
    }

    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

        if(response.status == 404) {
            showError();
            return;
        }

        const data = await response.json();
        
        updateWeatherInfo(data);
        updateWeatherIcon(data.weather[0].main);
        updateVantaTheme(data.weather[0].main);
        showWeather();

    } catch (error) {
        console.error('Error fetching weather:', error);
        showError();
    }
}

function handleSearch() {
    checkWeather(searchBox.value);
    searchBox.value = '';
    searchBox.blur();
}

// Event Listeners
searchBtn.addEventListener('click', handleSearch);

searchBox.addEventListener("keypress", (event) => {
    if(event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Vanta.js
    initVanta();
    
    // Initialize time display
    updateTime();
    setInterval(updateTime, 1000);
    
    // Prevent image interactions
    const images = document.querySelectorAll('img');
    const preventDefaultActions = (e) => e.preventDefault();
    
    images.forEach(img => {
        ['dragstart', 'contextmenu', 'touchstart', 'touchmove'].forEach(event => {
            img.addEventListener(event, preventDefaultActions, 
                event.startsWith('touch') ? { passive: false } : undefined
            );
        });
    });
});