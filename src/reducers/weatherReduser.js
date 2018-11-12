export const defaultCities = [
    {
        id: 1,
        name: 'Барнаул',
        active: false
    },
    {
        id: 2,
        name: 'Москва',
        active: false
    },
    {
        id: 3,
        name: 'Санкт-Петербург',
        active: false
    },
];

const initialState = {
    citiesLoaded: false,    // Загружены ли города из локальной базы в state
    cities: [],
    maxCityId: 0,
    weatherInfo: null,      // Информация с сервиса о погоде
    activeCityId: 0,        // id выбранного города
    showCitiesList: false,  // Показать - скрыть список городов
    weatherIsLoading: false, // Показать - скрыть компонент загрузки
    newCityPage: false,      // Показать компонент добавления нового города
    errorCityMsg: "",       // Сообщение об ошибке
    addingCity: false,      // Идет запрос на добавление города
    showWeather: false,     // Показать информацию о погоде
    showBtnAdd: false,      // Показать кнопку "Добавить город в список"
    cityName: "",
    renders: {              // какие компоненты нужно перерендрить
        CityList: {
            needUpdate: false,
        },
        SearchByCityName: {
            needUpdate: false,
        },
        NewCityPage: {
            needUpdate: false,
        },
        WeatherInfo: {
            needUpdate: false,
        },

    }
};

export default function weatherReduser(state = initialState, action) {

    let newRenders = {
        CityList: {
            needUpdate: false,
        },
        SearchByCityName: {
            needUpdate: false,
        },
        NewCityPage: {
            needUpdate: false,
        },
        WeatherInfo: {
            needUpdate: false,
        },
    };

    switch (action.type) {
        case "SET_CITY":

            state.cities.forEach((city)=>{
                if(city.id === action.payload.cityId) {
                    city.active = true;
                    state.activeCityId = city.id;
                    state.cityName = city.name;
                } else {
                    city.active = false;
                }
            });

            newRenders.CityList.needUpdate = true;
            newRenders.WeatherInfo.needUpdate = true;

            return {...state,
                cities: state.cities,
                activeCityId: state.activeCityId,
                showCitiesList: false,
                weatherIsLoading: false,
                newCityPage: false,
                showWeather: true,
                searchCityName: "",
                showBtnAdd: false,
                cityName: state.cityName,
                renders: newRenders,
            };

        case "SHOW_CITIES":

            let citiesLoaded = state.citiesLoaded;

            if(typeof (action.payload) !== "undefined") {
                citiesLoaded = action.payload.citiesLoaded;
                state.maxCityId = action.payload.maxId;
                state.cities = action.payload.cities;
            }
            newRenders.CityList.needUpdate = true;
            return {...state,
                cities: state.cities,
                showCitiesList: !state.showCitiesList ,
                maxCityId: state.maxCityId,
                citiesLoaded: citiesLoaded,
                renders: newRenders,
            };

        case "SUCCESS_LOADING_WEATHER":

            newRenders.WeatherInfo.needUpdate = true;

            return {...state,
                weatherIsLoading: true,
                weatherInfo: action.payload,
                newCityPage: false,
                successSearch: false,
                showWeather: true,
                showBtnAdd: false,
                errorCityMsg: "",
                renders: newRenders,
            };

        case "SUCCESS_SEARCH_WEATHER":
            let showBtnAdd = true;
            state.cities.forEach((city)=>{
                city.active = false;
                if(action.payload.cityName.toLowerCase() === city.name.toLowerCase()) {
                    showBtnAdd = false;
                }
            });
            newRenders.CityList.needUpdate = true;
            newRenders.WeatherInfo.needUpdate = true;
            return {...state,
                cities: state.cities,
                weatherIsLoading: true,
                weatherInfo: action.payload.weather,
                showCitiesList: false,
                newCityPage: false,
                activeCityId: 0,
                showWeather: true,
                showBtnAdd: showBtnAdd,
                errorCityMsg: "",
                cityName: action.payload.cityName,
                renders: newRenders,
            };

        case "SEARCHING":

            return {...state,
                weatherIsLoading: false,
                showWeather: true,
                showBtnAdd: false,
                newCityPage: false,
                cityName: "",
                renders: newRenders,
            };

        case "ERROR_LOADING_WEATHER":

            newRenders.CityList.needUpdate = true;
            newRenders.NewCityPage.needUpdate = true;
            newRenders.WeatherInfo.needUpdate = true;

            return {...state,
                weatherIsLoading: true,
                newCityPage: false,
                showWeather: true,
                searchCityName: "",
                errorCityMsg: "Город не найден",
                weatherInfo: null,
                showBtnAdd: false,
                cityName: "",
                renders: newRenders,
                showCitiesList: false,
            };

        case "CREATE_CITY_PAGE":

            newRenders.CityList.needUpdate = true;

            state.cities.forEach((city)=>{
                city.active = false;
            });

            return {...state,
                cities: state.cities,
                activeCityId: 0,
                showCitiesList: false,
                weatherIsLoading: false,
                newCityPage: true,
                addingCity: false,
                errorCityMsg: "",
                showWeather: false,
                searchCityName: "",
                showBtnAdd: false,
                renders: newRenders,
            };

        case "SUCCESS_CITY_NAME":

            state.maxCityId = state.maxCityId + 1;
            const newCity = action.payload.city;

            newCity.id = state.maxCityId;
            newCity.active = true;
            state.cities.unshift(newCity);
            state.cityName = newCity.name;
            return {...state,
                cities: state.cities,
                activeCityId: newCity.id,
                showCitiesList: false,
                newCityPage: false,
                maxCityId: state.maxCityId,
                weatherIsLoading: true,
                weatherInfo: action.payload.data,
                addingCity: false,
                showWeather: true,
                showBtnAdd: false,
                cityName: state.cityName,
                renders: newRenders,
                errorCityMsg: "",
            };

        case "ERROR_CITY_NAME":

            newRenders.NewCityPage.needUpdate = true;
            newRenders.WeatherInfo.needUpdate = true;

            return {...state,
                newCityPage: true,
                errorCityMsg: action.payload.message,
                addingCity: false,
                showWeather: false,
                showBtnAdd: false,
                cityName: "",
                renders: newRenders,
            };

        case "NEW_CITY_ADDING":

            newRenders.WeatherInfo.needUpdate = true;

            return {...state,
                addingCity: true,
                showWeather: false,
                showBtnAdd: false,
                cityName: "",
                renders: newRenders,
            };

        case "DEL_CITY":

            newRenders.CityList.needUpdate = true;

            state.cities = state.cities.filter((city) => (city.name.toLowerCase() !== action.payload.toLowerCase()));

            return {...state,
                cities: state.cities,
                renders: newRenders,
            };

	    default:
		    return state;
	}

}