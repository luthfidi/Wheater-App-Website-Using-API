const apiKey ="78864d879e25d6f9d32610ba5fb3193f";
const apiUrl ="https://api.openweathermap.org/data/2.5/weather?units=metric&q="

const searchBox = document.querySelector('.search input');
const searchBtn = document.querySelector('.search button');
const weatherIcon = document.querySelector('.weather-icon')

// `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`


const checkWeather = async (city) =>{
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if(response.status == 404){
        document.querySelector('.error').style.display = 'block';
        document.querySelector('.weather').style.display = 'none'
    }
    else{
        const data = await response.json();

        document.querySelector('.city').innerHTML = data.name;
        document.querySelector('.temp').innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector('.humidity').innerHTML = data.main.humidity +"%";
        document.querySelector('.wind').innerHTML = data.wind.speed + " km/h";
     
         if(data.weather[0].main =="Clouds"){
             weatherIcon.src = "images/clouds.png"
         }
         else if(data.weather[0].main == "Clear"){
             weatherIcon.src = "images/clear-sky.png"
         }
         else if(data.weather[0].main == "Rain"){
             weatherIcon.src = "images/rainy.png"
         }
         else if(data.weather[0].main == "Mist"){
             weatherIcon.src = "images/mist.png"
         }
         else if(data.weather[0].main == "Drizzle"){
             weatherIcon.src = "images/drizzle.png"
         }
         else if(data.weather[0].main == "Fog"){
             weatherIcon.src = "images/fog.png"
         }
         else if(data.weather[0].main == "Sun"){
             weatherIcon.src = "images/sun.png"
         }
         else if(data.weather[0].main == "Thunder Storm"){
             weatherIcon.src = "images/thunderstorm.png"
         }
         document.querySelector('.weather').style.display = 'block';
         document.querySelector('.error').style.display = 'none';
    }  
}

searchBtn.addEventListener('click', ()=>{
   checkWeather(searchBox.value);
   searchBox.value='';
})

searchBox.addEventListener("keypress", (event)=>{
    if(event.key === 'Enter'){
        event.preventDefault();
        checkWeather(searchBox.value);
        searchBox.value='';
    }
})