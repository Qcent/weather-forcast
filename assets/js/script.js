let deleteMode = false;

//array of objects to hold url to images
const bgPics = {
    sevenHun: "https://i.cbc.ca/1.4043542.1490696856!/fileImage/httpImage/image.jpg_gen/derivatives/16x9_620/foggy-driving.jpg",
    Clouds: "https://images.pexels.com/photos/53594/blue-clouds-day-fluffy-53594.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    Rain: "https://images.pexels.com/photos/2259232/pexels-photo-2259232.jpeg",
    Drizzle: "https://images.pexels.com/photos/2259232/pexels-photo-2259232.jpeg",
    Clear: "https://www.langleyadvancetimes.com/wp-content/uploads/2019/11/19458466_web1_Langley-Weather-Sun-Clear-Sky-Skies.jpg",
    Snow: "https://www.metoffice.gov.uk/binaries/content/gallery/metofficegovuk/hero-images/events/christmas/pine-trees-in-christmas-snow.jpg",
    Thunderstorm: "https://images.pexels.com/photos/6510369/pexels-photo-6510369.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
};

// an array to store a list of saved cities
let cityList = [];

// some objects that will hold the forecast information
let forecast = {};
let daily = {};

//save the city list
const saveCityList = () => {
        localStorage.setItem("WeatherForecast-Cities", JSON.stringify(cityList));
    }
    //add a searched city to a list of saved cities
const saveCity = (city) => {
    let alreadyPresent = false;
    cityList.forEach((cti) => {
        if (cti.loc === city.loc) { alreadyPresent = true; }
    });

    if (!alreadyPresent) {
        cityList.push(city);

        saveCityList();
        displaySavedCities();
    }
};

//diaplayes a list of saved cities
const displaySavedCities = () => {
    if (cityList) {
        let i = 0;
        document.getElementById('city-list-container').innerHTML = '';
        cityList.forEach((cti) => {
            let cityBtn = document.createElement('button');
            cityBtn.classList = 'btn';
            cityBtn.setAttribute('data-index', i);
            cityBtn.setAttribute('data-lat', cti.LAT);
            cityBtn.setAttribute('data-lng', cti.LNG);
            cityBtn.textContent = cti.loc;

            document.getElementById('city-list-container').appendChild(cityBtn);
            i++;
        });

        if (window.screen.width < 686) { createDropDown(); }
    }
}

//uses OpenWeather OneCall API to get current and 5-day weather forecast from lat/lng coordinates
const getForecast = (loc) => {
    let apiKey = "1be3e8e5b8a843e3e02788dc70cdc2e8";
    let apiCallforecast = "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        loc.LAT + "&lon=" + loc.LNG + "&exclude=minutely,hourly&units=metric&appid=" + apiKey;

    fetch(apiCallforecast)
        .then((response) => {
            if (response.ok) {
                response.json()
                    .then((data) => {
                        forecast = data.current;
                        daily = data.daily;
                        displayCurrentForecast(loc.loc);
                        displayFiveDayForecast();
                        //save last city to local storage
                        localStorage.setItem("WeatherForecast-mostRecent", JSON.stringify(loc));
                    })
            } else {
                alert("ERROR!");
            }
        });
};

// uses OpenCage API for searching locations and returning lat/lng coordinates
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
                        if (data.results.length) {
                            let location = data.results[0].formatted;
                            let lon = data.results[0].geometry.lng
                            let lat = data.results[0].geometry.lat;

                            let city = {
                                loc: location,
                                LAT: lat,
                                LNG: lon
                            }
                            saveCity(city);
                            getForecast(city);
                        } else {
                            alert('Error: Location not Found!');
                        }
                    });
            } else {
                alert('Error: Invalid Server Response!\nPlease try a more detailed search');
            }
        });
};

//displays info on current weather conditions in pre made HTML elements
const displayCurrentForecast = (city) => {
    // Update City/Location
    document.querySelector('#current-forecast h2').textContent = city;
    // Update current Date
    let forecastDate = luxon.DateTime.fromMillis(forecast.dt * 1000);
    document.querySelector('#cur-Date').textContent = forecastDate.toFormat('LLL dd yyyy');
    //Update Current Weather Icon
    document.getElementById('cur-ConditionsIcon').setAttribute('src', "http://openweathermap.org/img/w/" + forecast.weather[0].icon + ".png");
    //Update Current Feels
    document.getElementById('cur-Feels').innerHTML = forecast.feels_like + "&deg;";
    //Update Current Temp
    document.getElementById('cur-Temp').innerHTML = forecast.temp + "&deg;";
    //Update Current high
    document.getElementById('cur-High').innerHTML = daily[0].temp.max + "&deg;";
    //Update Current low
    document.getElementById('cur-Low').innerHTML = daily[0].temp.min + "&deg;";
    //Update Current pop
    document.getElementById('cur-Pop').innerHTML = daily[0].pop * 100 + "%";
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


    //update bg pic
    if (forecast.weather[0].id >= 700 && forecast.weather[0].id < 800) {
        document.getElementById('current-forecast').style.backgroundImage = "url('" + bgPics['sevenHun'] + "')";
    } else {
        document.getElementById('current-forecast').style.backgroundImage = "url('" + bgPics[forecast.weather[0].main] + "')";
    }
    document.getElementById('current-forecast').style.backgroundSize = 'cover';

};

//displays 5-day forecast weather conditions in dynamically created HTML elements
const displayFiveDayForecast = () => {

    let container = document.getElementById('fiveDay-forecast');
    container.innerHTML = '';
    let title = document.createElement('h3');
    title.textContent = "5-Day Forecast:";

    container.appendChild(title);

    for (let i = 1; i < 6; i++) {
        let dayHolder = document.createElement('div');
        dayHolder.classList = 'fiveDay-box';

        // add a Date
        let forecastDate = luxon.DateTime.fromMillis(daily[i].dt * 1000);
        let date = document.createElement('h4');
        date.textContent = forecastDate.toFormat('LLL dd yyyy');
        //add a Weather Icon
        let icon = document.createElement('img');
        icon.setAttribute('src', "http://openweathermap.org/img/w/" + daily[i].weather[0].icon + ".png");
        //add a Temp
        let tempHi = document.createElement('div');
        tempHi.innerHTML = "High: " + daily[i].temp.max + "&deg;";
        let tempLo = document.createElement('div');
        tempLo.innerHTML = "Low: " + daily[i].temp.min + "&deg;";
        //add Pop
        let pop = document.createElement('div');
        pop.textContent = "Pop: " + daily[i].pop * 100 + "%";
        //add a Wind Speed
        let wind = document.createElement('div');
        wind.textContent = "Wind: " + daily[i].wind_speed + " km/h";
        //add a Humidity
        let humidity = document.createElement('div');
        humidity.textContent = "Humidity: " + daily[i].humidity + "%";
        //add UV Index
        let UV = document.createElement('div');
        UV.textContent = "UV Index: ";
        let uvBox = document.createElement('span');
        uvBox.classList = 'uv-index';
        uvBox.textContent = daily[i].uvi;
        //add UV Index background color
        (daily[i].uvi >= 3) ?
        (daily[i].uvi > 7) ?
        uvBox.style.backgroundColor = '#e8470a': uvBox.style.backgroundColor = '#d8d01f': uvBox.style.backgroundColor = '#57e45b';
        UV.appendChild(uvBox)

        dayHolder.appendChild(date);
        dayHolder.appendChild(icon);
        dayHolder.appendChild(tempHi);
        dayHolder.appendChild(tempLo);
        dayHolder.appendChild(pop);
        dayHolder.appendChild(wind);
        dayHolder.appendChild(humidity);
        dayHolder.appendChild(UV);
        container.appendChild(dayHolder);

    }
};

//creates a drop down list for the saved cities on smaller screens 
const createDropDown = () => {

    if (!document.querySelector('#city-list-dropIcon')) {
        let target = document.querySelector('#city-list-container');
        let el = document.createElement('div');
        el.setAttribute('id', 'city-list-dropIcon');
        el.innerHTML = "City List<img src='https://www.svgrepo.com/show/18393/list.svg' width='1rem' />";

        // insert el before target element
        target.parentNode.insertBefore(el, target);

        //event listener for menu expand/collapse
        document.querySelector('#city-list-dropIcon').addEventListener('click', () => {
            collapseListToggle();
        });
    }
}

const collapseListToggle = () => {
    let listEl = document.querySelector('#city-list-container');
    listEl.className = (listEl.className != 'expanded') ? 'expanded' : 'collapsed';

    listEl = document.querySelector('#delete-container');
    listEl.className = (listEl.className != 'expanded') ? 'expanded' : 'collapsed';
}

//add a searched city to a list of saved cities
const loadSavedCities = (() => {
    cityList = JSON.parse(localStorage.getItem("WeatherForecast-Cities")) || [];

    let lastCity = JSON.parse(localStorage.getItem("WeatherForecast-mostRecent")) || '';

    if (cityList) {
        displaySavedCities();
    }
    if (lastCity) {
        getForecast(lastCity);
    }

})(); // will execute automatically

//Eventlistener:  when enter is pressed in search for city
document.querySelector('#city-search').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.querySelector('#city-search-button').click();
    }
});
//Eventlistener:  when clicked on search for city
document.querySelector('#city-search-button').addEventListener('click', () => {
    let searchString = document.querySelector('#city-search').value;
    document.querySelector('#city-search').value = '';
    if (searchString) {
        searchForCity(searchString);
    }
});
//Eventlistener:  when clicked on saved city
document.querySelector('#city-list-container').addEventListener('click', (e) => {

    if (!deleteMode && e.target.getAttribute('data-lat') && e.target.getAttribute('data-lng')) {
        getForecast({
            loc: e.target.textContent,
            LAT: e.target.getAttribute('data-lat'),
            LNG: e.target.getAttribute('data-lng')
        });
        if (document.querySelector('#city-list-dropIcon')) { //in dropdown list mode
            collapseListToggle();
        }
    }
});
//Eventlistener:  when clicked on remove all cities element
document.querySelector('#remove-all-cities').addEventListener('click', () => {
    if (confirm("Are you sure you want to remove all cities?")) {
        cityList = [];
        saveCityList();
        displaySavedCities();
    }
});
//Event listener on body handles deleting of individual cities
document.querySelector('body').addEventListener('click', (e) => {

        if (e.target.id === 'delete-city') { //delete city button was pressed
            deleteMode = true;
            list = document.querySelectorAll('#city-list-container .btn')
            list.forEach((cti) => {
                cti.classList = 'btn deleteable';

            });
        } else
        if (deleteMode && e.target.matches('.deleteable')) { // a city was selected to be deleted
            idx = e.target.getAttribute('data-index');
            cityList.splice(idx, 1);
            saveCityList();
            displaySavedCities();
        } else if (deleteMode) { //something other then a city was clicked when in delete mode
            deleteMode = false;
            list = document.querySelectorAll('#city-list-container .btn')
            list.forEach((cti) => {
                cti.classList = 'btn';
            });
        }
    })
    /// create a collapseable list for the cities
window.addEventListener('resize', () => {
    /******** */

    if (window.innerWidth < 686 && !document.querySelector('#city-list-dropIcon')) {
        createDropDown();
    }
    if (window.innerWidth >= 686 && document.querySelector('#city-list-dropIcon')) {
        document.querySelector('#city-list-dropIcon').remove();
    }
    /******* */
});