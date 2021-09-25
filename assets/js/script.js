let searchBtnEL = document.querySelector('#city-search-button');

const getforecast = (loc) => {
    let apiKey = "1be3e8e5b8a843e3e02788dc70cdc2e8";
    let apiCallforecast = "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        loc.LAT + "&lon=" + loc.LNG + "&exclude=minutely,hourly&units=metric&appid=" + apiKey;

    fetch(apiCallforecast)
        .then((response) => {
            if (response.ok) {
                response.json()
                    .then((data) => {
                        console.log(loc)
                        displayCurrentForecast(loc.loc, data.current);
                        //displayFiveDayForecast(data.daily);
                    })
            } else {
                alert("ERROR!");
            }
        });
}
const searchForCity = (searchVal) => {
    let OpenCageApiKey = "a31aaf6189ea4b81879c2695221eb02c";
    let OpenCageApiLang = "en";

    let OpenCageApiSearch = encodeURIComponent(searchVal);

    fetch("https://api.opencagedata.com/geocode/v1/json?q=" +
            OpenCageApiSearch +
            "&key=" + OpenCageApiKey +
            "&language=" + OpenCageApiLang + "&limit=1&no_annotations=1&pretty=1")
        .then((response) => {
            if (response.ok) {
                response.json()
                    .then((data) => {
                        let location = data.results[0].formatted;
                        let lon = data.results[0].geometry.lng
                        let lat = data.results[0].geometry.lat;
                        getforecast({ loc: location, LAT: lat, LNG: lon });
                    });
            } else {
                alert('Error: Location not Found!');
            }
        });
}

const displayCurrentForecast = (city, forecast) => {
    // Update City/Location
    document.querySelector('#current-forecast h2').textContent = city;
    // Update current Date
    let forecastDate = luxon.DateTime.fromMillis(forecast.dt * 1000);
    document.querySelector('#cur-Date').textContent = '(' + forecastDate.toISODate() + ')';
    //Update Current Weather Icon
    document.getElementById('cur-ConditionsIcon').setAttribute('src', "http://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png");
    //Update Current Temp
    document.getElementById('cur-Temp').innerHTML = forecast.temp + "&deg;";
    //Update Current Wind Speed
    document.getElementById('cur-Wind').textContent = forecast.wind_speed + " km/h";
    //Update Current Humidity
    document.getElementById('cur-Humidity').textContent = forecast.humidity + "%";
    //Update UV Index
    let UV = document.getElementById('cur-UV');
    UV.textContent = forecast.uvi;
    //Update UV Index background color
    (forecast.uvi >= 3) ? (forecast.uvi > 7) ?
    UV.style.backgroundColor = '#e8470a': UV.style.backgroundColor = '#d8d01f': UV.style.backgroundColor = '#57e45b';

}

/*
const display5DayForecast = (days) => {

    let container = document.getElementById('fiveDay-forecast');
    container.innerHTML = '';

    for (let i = 0; i < 5; i++) {

        // Update current Date
        let forecastDate = luxon.DateTime.fromMillis(days[i].dt * 1000);
        document.querySelector('#cur-Date').textContent = '(' + forecastDate.toISODate() + ')';
        //Update Current Weather Icon
        document.getElementById('cur-ConditionsIcon').setAttribute('src', "http://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png");
        //Update Current Temp
        document.getElementById('cur-Temp').innerHTML = forecast.temp + "&deg;";
        //Update Current Wind Speed
        document.getElementById('cur-Wind').textContent = forecast.wind_speed + " km/h";
        //Update Current Humidity
        document.getElementById('cur-Humidity').textContent = forecast.humidity + "%";
        //Update UV Index
        let UV = document.getElementById('cur-UV');
        UV.textContent = forecast.uvi;
        //Update UV Index background color
        (forecast.uvi >= 3) ?
        (forecast.uvi > 7) ?
        UV.style.backgroundColor = '#F1A13D': UV.style.backgroundColor = '#F0EB74': UV.style.backgroundColor = '#141518';

    }
}
*/

searchBtnEL.addEventListener('click', () => {
    let searchString = document.querySelector('#city-search').value;
    document.querySelector('#city-search').value = '';

    if (searchString) {
        searchForCity(searchString);
        //getforecast({ location: 'sarnia', LAT: 33.44, LNG: -94.04 });
    }

})