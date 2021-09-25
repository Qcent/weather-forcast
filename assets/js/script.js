let apiCallOpenWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid={API key}";

let searchBtnEL = document.querySelector('#city-search-button');

const getForcast = (location) => {

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
                        getForcast({ loc: location, LAT: lat, LGN: lon });
                    });
            } else {
                alert('Error: Location not Found!');
            }
        });
}

searchBtnEL.addEventListener('click', () => {
    let searchString = document.querySelector('#city-search').value;
    document.querySelector('#city-search').value = '';

    if (searchString) {
        // searchForCity(searchString);
    }

})