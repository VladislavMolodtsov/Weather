const wrapper = document.querySelector('.wrapper'),
inputPart = document.querySelector('.input__part'),
infoTxt = document.querySelector('.info__txt'),
inputField = document.querySelector('input'),
locationBtn = document.querySelector('button'),
weatherPart = document.querySelector('.weather__part'),
wIcon = weatherPart.querySelector('img'),
arrowBack = wrapper.querySelector('header i');

/* 3de2e520da3948dec178608e3c751666 */
let api;

inputField.addEventListener('keyup', e => {
    if (e.key == "Enter" && inputField.value != "") {
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert('Your browser not support geological api');
    }
});

function requestApi(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=3de2e520da3948dec178608e3c751666`;
    fetchData();
}

function onSuccess(position) {
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=3de2e520da3948dec178608e3c751666`;
    fetchData();
}

function onError(error) {
    infoTxt.innerHTML = error.message;
    infoTxt.classList.add('error');
}

function fetchData() {
    infoTxt.innerHTML = "Getting weather details...";
    infoTxt.classList.add('pending');
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace('pending', 'error');
        infoTxt.innerHTML = `${inputField.value} isn't a valid city name`;
    } else {
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            wIcon.src = "../img/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "../img/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "../img/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "../img/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "../img/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "../img/rain.svg";
        }

        wrapper.querySelector('.temp .numb').innerText = Math.floor(temp);
        wrapper.querySelector('.weather').innerText = description;
        wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
        wrapper.querySelector('.temp .numb__2').innerText = Math.floor(feels_like);
        wrapper.querySelector('.humidity span').innerText = `${humidity}%`;

        infoTxt.classList.remove('pending', 'error');
        inputField.value = '';
        wrapper.classList.add('active');

        // console.log(info);
    }
};

arrowBack.addEventListener('click', () => {
    wrapper.classList.remove('active');
});