function getWeather(){
    const apiKey = '221d5f913fe524eb220b94398207ede2';
    const city = document.getElementById('city').value.trim();

    if(!city){
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', currentWeatherUrl, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log("Current Weather Data:", data); // Выводим данные о текущей погоде в консоль
            displayWeather(data);
        } else {
            console.error("Error fetching current weather:", xhr.statusText);
            alert("Error fetching current weather");
        }
    };

    xhr.onerror = function () {
        console.error("Network error while fetching current weather");
        alert("Network error");
    };

    xhr.send();

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error =>{
            console.error('Error fetching current weather', error);
            alert('Sosal!');
        });

    fetch(forecastUrl)
    .then(response => response.json())
    .then(data=>{
        console.log("Forecast Data:", data); // Выводим данные прогноза в консоль
        displayHourlyForecast(data.list);
    })
    .catch(error => {
        console.error('Error fetching current forecast', error);
        alert('Sosal!');
    })
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyforecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML= '';
    hourlyforecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if(data.cod === '404'){
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    }else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML =`
        <p>${temperature} C</p>
        `;

        const weatherHtml =`
        <p>${cityName}</p>
        <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt= description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData){
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24hours = hourlyData.slice(0, 8);

    next24hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
        <div class="hourly-item">
            <span>${hour}:00</span>
            <img src="${iconUrl}" alt="Hourly  Weather Icon">
            <span>${temperature} C</span>
        </div>
        `;
        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage(){
    const weatherIcon = document.getElementById('weather-icon');
    weatherIcon.style.display = 'block';
}