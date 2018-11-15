import {idb} from "../actions/indexeddb";
import {defaultCities} from "../reducers/weatherReduser";


idb.init({
    database: "Weather",
    version: 1,
    tables: [
        {
            name: "CitiesList",
            keyPath: "id",
            autoIncrement: true,
            index: [{ name: "name", unique: false}]
        }
    ]
});

export function setCity(cityId, cityName) {
    return dispatch => {

        dispatch({
            type: "SET_CITY",
            payload: {cityId}
        });

        fetch('https://openweathermap.org/data/2.5/weather/?appid=b6907d289e10d714a6e88b30761fae22&q='+cityName+'&units=metric')
            .then( function(response) {
                if (response.status !== 200) {
                    dispatch({
                        type: "ERROR_LOADING_WEATHER",
                        payload: response.status,
                    });
                } else {
                    response.json().then(function (data) {
                        const succesDispatch = function(){
                            dispatch({
                                type: "SUCCESS_LOADING_WEATHER",
                                payload: data,
                            });
                        };

                        let weatherName = data.weather[0].main;

                        const options = {
                            method: 'POST',
                            headers: {
                                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                            },
                            body: 'key=trnsl.1.1.20150220T075029Z.9cf93bf0c577ba4e.fd759dcc8e44209dc60e5046affe74f9db4bde05'
                        };

                        options.body += "&text=sky " + weatherName + "&lang=en-ru";


                        fetch('https://translate.yandex.net/api/v1.5/tr.json/translate', options)
                            .then(function(response) {
                                if (response.status === 200) {
                                    response.json().then(function (result) {
                                        data.weather[0].main = result.text[0].substring(5);
                                        succesDispatch();
                                    });

                                } else {
                                    succesDispatch();
                                }
                            })
                            .catch(function() {
                                succesDispatch();
                            });
                    });
                }
            })
            .catch(function(err) {
                console.log('Fetch Error :-S', err);
            });

    }

}

export function showCities(citiesLoaded) {
    return dispatch => {
        // Если города загружены то просто показываем
        if(citiesLoaded) {
            dispatch({
                type: "SHOW_CITIES",
            });
        } else {
            // Если города не загружены объединяем
            // дефолтные города и города из локальной базы

            idb.select("CitiesList", function (isSelected, responseData) {
                if (isSelected && responseData.length) {

                    responseData.forEach(function (city) {
                        city.local = true;
                        city.active = false;
                    });
                    responseData.reverse();
                    let allCities = [...responseData, ...defaultCities],
                        maxId = 0;

                    allCities.forEach(function (city, index) {
                        city.id = index + 1;
                        maxId = city.id;
                    });

                    dispatch({
                        type: "SHOW_CITIES",
                        payload: {
                            cities: allCities,
                            citiesLoaded: true,
                            maxId: maxId
                        },
                    });
                } else {
                    dispatch({
                        type: "SHOW_CITIES",
                        payload: {
                            cities: [...defaultCities],
                            citiesLoaded: true,
                            maxId: defaultCities.length + 1
                        },
                    });
                }
            });

        }
    }
}

export function createCityPage() {
    return {
        type: "CREATE_CITY_PAGE"
    }
}

export function addCity(cityName) {
    return dispatch => {

        dispatch({
            type: "NEW_CITY_ADDING",
        });
        fetch('https://openweathermap.org/data/2.5/weather/?appid=b6907d289e10d714a6e88b30761fae22&q='+cityName+'&units=metric')
            .then(
                function(response) {
                    if (response.status !== 200) {
                        dispatch({
                            type: "ERROR_CITY_NAME",
                            payload: {
                                message: "Сервис погоды https://openweathermap.org/ не нашел такого города"
                            },
                        });
                    } else {
                        response.json().then(function (data) {

                            selectCity(cityName, function (isSelected, responseData) {
                                if (isSelected) {
                                    if(responseData.length || filterArr(defaultCities, "name", cityName).length) {
                                        dispatch({
                                            type: "ERROR_CITY_NAME",
                                            payload: {
                                                message: "Такой город уже есть в списке"
                                            },
                                        });
                                    } else {
                                        insertCity(cityName, function(responseData) {
                                            const succesDispatch = function(){
                                                responseData[0].local = true;
                                                dispatch({
                                                    type: "SUCCESS_CITY_NAME",
                                                    payload: {
                                                        data: data,
                                                        city: responseData[0],
                                                    },
                                                });
                                            };

                                            let weatherName = data.weather[0].main;

                                            const options = {
                                                method: 'POST',
                                                headers: {
                                                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                                                },
                                                body: 'key=trnsl.1.1.20150220T075029Z.9cf93bf0c577ba4e.fd759dcc8e44209dc60e5046affe74f9db4bde05'
                                            };

                                            options.body += "&text=sky " + weatherName + "&lang=en-ru";

                                            fetch('https://translate.yandex.net/api/v1.5/tr.json/translate', options)
                                                .then(function(response) {
                                                    if (response.status === 200) {
                                                        response.json().then(function (result) {
                                                            data.weather[0].main = result.text[0].substring(5);
                                                            succesDispatch();
                                                        });
                                                    } else {
                                                        succesDispatch();
                                                    }
                                                })
                                                .catch(function() {
                                                    succesDispatch();
                                                });
                                        });
                                    }
                                } else {
                                    dispatch({
                                        type: "ERROR_CITY_NAME",
                                        payload: {
                                            message: "Save error"
                                        },
                                    });
                                }
                            });
                        });
                    }
                }
            )
            .catch(function(err) {
                dispatch({
                    type: "ERROR_CITY_NAME",
                    payload: {
                        message: "Сервис погоды https://openweathermap.org/ не нашел такого города"
                    },
                });
            });

    }
}

export function delCity(cityName) {
    return dispatch => {
        selectCity(cityName, function (isSelected, responseData) {
            console.log(responseData);
            if(isSelected && responseData.length) {

                let cityId = responseData[0].id;

                idb.delete("CitiesList", cityId, function (isDeleted, responseText) {
                    console.log("isDeleted" , responseText);
                    if(isDeleted) {
                        dispatch({
                            type: "DEL_CITY",
                            payload: cityName,
                        });
                    }
                });
            }
        });

        dispatch({
            type: "NEW_CITY_ADDING",
        });

    }
}

export function searchCity(cityName) {
    return dispatch => {
        dispatch({
            type: "SEARCHING"
        });
        fetch('https://openweathermap.org/data/2.5/weather/?appid=b6907d289e10d714a6e88b30761fae22&q='+cityName+'&units=metric')
            .then(
                function(response) {
                    if (response.status !== 200) {
                        dispatch({
                            type: "ERROR_LOADING_WEATHER",
                            payload: response.status,
                        });
                    } else {
                        response.json().then(function (data) {

                            const succesDispatch = function(){
                                dispatch({
                                    type: "SUCCESS_SEARCH_WEATHER",
                                    payload: {
                                        weather: data,
                                        cityName: cityName
                                    },
                                });
                            };
                            let weatherName = data.weather[0].main;

                            const options = {
                                method: 'POST',
                                headers: {
                                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                                },
                                body: 'key=trnsl.1.1.20150220T075029Z.9cf93bf0c577ba4e.fd759dcc8e44209dc60e5046affe74f9db4bde05'
                            };

                            options.body += "&text=sky " + weatherName + "&lang=en-ru";


                            fetch('https://translate.yandex.net/api/v1.5/tr.json/translate', options)
                                .then(function(response) {
                                    if (response.status === 200) {
                                        response.json().then(function (result) {
                                            data.weather[0].main = result.text[0].substring(5);
                                            succesDispatch();
                                        });

                                    } else {
                                        succesDispatch();
                                    }
                                })
                                .catch(function() {
                                    succesDispatch();
                                });
                        });
                    }
                }
            )
            .catch(function(err) {
                dispatch({
                    type: "ERROR_LOADING_WEATHER",
                    payload: err,
                });
            });

    }
}

function insertCity(cityName, callback) {
    idb.insert("CitiesList",
        {
            name: cityName,
            active: false,
        },
        function (isInserted, responseText) {
            if(isInserted) {
                idb.select("CitiesList", {key : "name", value: cityName},
                    function (isSelected, responseData) {
                        if (isSelected) {
                            callback(responseData);
                        }
                        else {
                            console.log("Error: " + responseText);
                        }
                    }
                );
            }
            console.log(responseText);
        }
    );
}

function selectCity(cityName, callback)  {
    idb.select("CitiesList", {key : "name", value: cityName}, function (isSelected, responseData) {
        callback(isSelected, responseData);
    });
}

function filterArr(arr, name, value) {
    let result = [];

    arr.forEach((item) => {
        if(item[name] === value) {
            result.push(item)
        }
    });

    return result;
}
