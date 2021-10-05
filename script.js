const userInput = document.querySelector('.inputLocation');
const getInput = document.querySelector('.get-input');

const currentTime = document.getElementById('time');
const currentDate = document.getElementById('date');

const currentWeather =document.getElementById('current-condition-data');

const timezone =document.getElementById('timezone');
const place =document.getElementById('location');

const forecast =document.getElementById('weather-forecast');
const currentTemp =document.getElementById('current-temperature');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const API_KEY = '74884ed210fba6ee274570323d83d028';
let currentLatitude ='';
let currentLongitude ='';

let placeFromApi = '';
let countryFromApi = '';

const cities = document.querySelector('.cities');
const recents = document.querySelector('.recents');
const chosenCity = document.querySelector(".cities");
let records = [];

let favorites = [];
let favoritesRaw = [];

document.addEventListener("DOMContentLoaded", getPositionFromBrowser);
getInput.addEventListener("click", getPositionFromUserInput);
chosenCity.addEventListener("click", getWeatherForChosenCity);
recents.addEventListener("click", getWeatherFromRecents);

// todo: alert if city doesn't exist
// todo: recents with heatmap?
// todo: layout
// todo: canvas in header - city landscapes
// todo: git

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.strokeStyle = "#FFF";
ctx.moveTo(0, 0);
ctx.lineTo(1200, 0);
ctx.stroke();

function getWeatherFromRecents(e){
    const item = e.target;
    console.log("innerhml=   " + item.innerHTML);
    const chosenText = item.innerHTML;
    favorites.forEach(rec => {

        if(rec["txt"] == chosenText){

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${rec["lat"]}&lon=${rec["lon"]}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
                console.log(data);
                console.log("Running API call for LAT/LON from getWeatherFromRecents----------------------------");
            displayWeather(data, rec["city"], rec["country"]);
            })
        }
        
    })

}

function getPositionFromUserInput(e) {
    e.preventDefault(); 
    if (userInput.value !== "") { 
    console.log('YOU ENTERED:  '+userInput.value); //
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${userInput.value}&limit=5&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log("Running API call for cities----------------------------");
    console.log(data);
    console.log(data.length);

    if (data.length > 1){
        //let records = [];
        data.forEach(item => {
            var rec = new Object();
            if (item.state !== undefined ){
                rec["txt"] = item.name + ' - ' + item.country + '(' + item.state + ')'+ ' (' + item["lat"] + 'N ' + item["lon"] +'E)';
                rec["city"] = item.name;
                rec["country"] = item.country;
                rec["state"] = item.state;
            }
            else{
                rec["txt"] = item.name + ' - ' + item.country + ' (' +item["lat"]+'N ' +item["lon"] +'E)';
                rec["city"] = item.name;
                rec["country"] = item.country;
            }
            rec["lat"] = item.lat;
            rec["lon"] = item.lon;
            records.push(rec);
        })
        console.log("structure of records: "+records);
        records.forEach(item => {

            const divlist= document.createElement("div");
            divlist.classList.add("listdiv");

            const listItem=document.createElement("li")

            listItem.innerHTML = item["txt"]; 
            
            listItem.classList.add("listitem");
            divlist.appendChild(listItem);
            cities.appendChild(divlist);
            var element = document.querySelector('.popup');
            element.style.opacity = "1";
            element.style.visibility = "visible";
            //console.log(item.name + ' (' + item.country +')');
        });
    }else {
        console.log(data[0].name + '/' + data[0].country);
        currentLatitude = data[0].lat;
        currentLongitude =data[0].lon;
        placeFromApi = data[0].name;
        countryFromApi = data[0].country;
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${currentLatitude}&lon=${currentLongitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log("Running API onecall from getPositionFromUserInput for single city----------------------------");
            console.log(data);
            records =[];
            saveToStorage(placeFromApi, countryFromApi, currentLatitude, currentLongitude);
            clearDOM();
            loadFromStorageAndDisplayRecents();
            displayWeather(data, placeFromApi, countryFromApi);
            })
    }   
    
    userInput.value = '';
    })
    }
}
function getWeatherForChosenCity(e) {
    const item = e.target;
    console.log(item.innerHTML);
    const chosenText = item.innerHTML;
    records.forEach(rec => {
        if(rec["txt"] == chosenText){
            console.log(rec["txt"]);
            console.log(rec["lat"]);
            console.log(rec["lon"]);

            fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${rec["lat"]}&lon=${rec["lon"]}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log("Running API call for LAT/LON from getWeatherForChosenCity----------------------------");
            console.log(data);
            records =[];
            clearDOM();
            saveToStorage(rec["city"], rec["country"], rec["lat"], rec["lon"]);
            clearDOM();
            loadFromStorageAndDisplayRecents();
            displayWeather(data, rec["city"], rec["country"]);
            })
        }
    })
    var element = document.querySelector('.popup');
    element.style.opacity = "0";
    element.style.visibility = "hidden";
}

function clearDOM(){
    const elements = document.getElementsByClassName('listdiv'); 
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);}
}

setInterval(() => {
const time = new Date();
const month = time.getMonth();
const date = time.getDate();
const day = time.getDay();
const hour = time.getHours();
const hoursIn12hFormat = hour >= 13 ? hour %12 : hour;
const minutes = time.getMinutes();
const ampm = hour >= 12 ? 'PM' : 'AM';
currentTime.innerHTML = (hour<10?'0'+hour:hour) +':' + (minutes <10?'0'+minutes:minutes); //sIn12hFormat + ':' + minutes + `<span id="am-pm">${ampm}</span>`
currentDate.innerHTML = days[day] + ', ' + date + ' ' + months[month];

}, 1000); //every 1000ms


function getPositionFromFavorites(){

}

function getPositionFromBrowser() {
    navigator.geolocation.getCurrentPosition((success) => {
    let {latitude, longitude}= success.coords; 
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`).then(res => res.json()).then(info => {
        console.log("Running API call for cities from getPositionFromBrowser to get city name and country name----------------------------");    
        placeFromApi = info.city.name;
        countryFromApi = info.city.country;
        })
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
        console.log("Running API onecall for cities from getPositionFromBrowser to get data----------------------------");
    console.log(data);
    displayWeather(data, placeFromApi,countryFromApi);
    loadFromStorageAndDisplayRecents();
    })
    })
    
}

function saveToStorage(city, country, lat, lon){
    const storedCity = new Object();

    storedCity["txt"] = city + ' - ' + country + ' (' +lat+'N ' +lon +'E)';
    storedCity["city"] = city;
    storedCity["country"] = country;
    storedCity["lat"] = lat;
    storedCity["lon"] = lon;

    if (localStorage.getItem("favoritesRaw") === null) { 
        favoritesRaw = []; 
    } else { //annars
        favoritesRaw = JSON.parse(localStorage.getItem("favoritesRaw")); 
    }
    favoritesRaw.unshift(storedCity); 
    localStorage.setItem("favoritesRaw", JSON.stringify(favoritesRaw)); 

}

function loadFromStorageAndDisplayRecents(){

    if (localStorage.getItem("favoritesRaw") === null) 
    {favoritesRaw = [];} 
    else {
        favoritesRaw = JSON.parse(localStorage.getItem("favoritesRaw"));
    }
    favoritesRaw.forEach(item => {
        var fav = new Object();
        fav["txt"] = item.txt; 
        fav["city"] = item.city;
        fav["country"] = item.country;
        fav["lat"] = item.lat;
        fav["lon"] = item.lon;
        favorites.push(fav);
    })

    if(favoritesRaw.length>10){
        const slicedArray = favoritesRaw.slice(0, 10);
        slicedArray.forEach(item => {
            console.log("item from storage ="+item);
            const divlist= document.createElement("div");
            divlist.classList.add("listdiv");
    
            const listItem=document.createElement("li")
    
            listItem.innerHTML = item["txt"]; 
            
            listItem.classList.add("listitem");
            divlist.appendChild(listItem);
            recents.appendChild(divlist);
        })
    }
    else{
        console.log(favoritesRaw);
        favoritesRaw.forEach(item => {
            console.log("item from storage ="+item);
            const divlist= document.createElement("div");
            divlist.classList.add("listdiv");
    
            const listItem=document.createElement("li")
    
            listItem.innerHTML = item["txt"]; 
            
            listItem.classList.add("listitem");
            divlist.appendChild(listItem);
            recents.appendChild(divlist);
    
        })
    }
}


function displayWeather(data, city, country){

let {humidity, pressure, sunrise, sunset, temp, wind_speed}= data.current;
timezone.innerHTML = city + ' (' + country + ')';//data.timezone;
place.innerHTML = data.lat + 'N  ' + data.lon +'E';
currentWeather.innerHTML = `
<div class="condition-data">
<div>Current Temperature</div>
<div>${Math.round(temp)} &#176C</div>
</div><div class="condition-data">
<div>Humidity</div>
<div>${humidity} %</div>
</div>
<div class="condition-data">
<div>Pressure</div>
<div>${pressure} mmHg</div>
</div>
<div class="condition-data">
<div>Wind Speed</div>
<div>${wind_speed} m/s</div>
</div>
<div class="condition-data">
<div>Sunrise</div>
<div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
</div><div class="condition-data">
<div>Sunset</div>
<div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
</div>`;

let futureDayForecast = '';
var tomorrow = new Date();
data.daily.forEach((day, idx) => {
if(idx == 0){
        const time = new Date();
        const date = time.getDate();
        const month = time.getMonth();
currentTemp.innerHTML = `
        <div class="day">${window.moment(day.dt * 1000).format('ddd')} ${date}/${month+1}</div>
        <img src="/assets/${day.weather[0].icon}.svg" alt="weather icon" class="weather-icon">       
        <div class="temperature">${Math.round(day.temp.max)}&#176C / ${Math.round(day.temp.min)}&#176C</div>`
    }
    else{
        
        tomorrow.setDate(tomorrow.getDate()+1);
        const date = tomorrow.getDate();
        const month = tomorrow.getMonth();
futureDayForecast += `
    <div class="weather-forecast-item card col-2">
        <div class="day">${window.moment(day.dt * 1000).format('ddd')} ${date}/${month+1}</div>
        <img src="/assets/${day.weather[0].icon}.svg" alt="weather icon" class="weather-icon">
        <div class="temperature">${Math.round(day.temp.max)}&#176C / ${Math.round(day.temp.min)}&#176C</div>
</div>`
    }
})
forecast.innerHTML = futureDayForecast;
}
