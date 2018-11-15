import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from "react-redux";

import './App.css';

import { setCity, showCities, createCityPage, addCity, searchCity, delCity } from "../actions/actionWeather";

import WeatherInfo from "../components/weatherInfo";
import NewCityPage from "../components/newCityPage";
import SearchByCityName from "../components/searchByCityName";
import CityList from "../components/cityList";

class App extends Component {

    render() {

        const {
            cities,
            showCitiesList,
            weatherIsLoading,
            weatherInfo,
            newCityPage,
            errorCityMsg,
            searchCity,
            addingCity,
            showWeather,
            showBtnAdd,
            citiesLoaded,
            cityName,
            renders
        } = this.props;

        return (
            <React.Fragment>
                <div className="header">
                    <h1>Погода в городе {cityName}</h1>
                </div>
                <div className="selectionCity">
                    <CityList
                        showCitiesList={showCitiesList}
                        cities={cities}
                        citiesLoaded={citiesLoaded}
                        createCityPage={this.props.createCityPage}
                        showCities={this.props.showCities}
                        setCity={this.props.setCity}
                        delCity={this.props.delCity}
                        renders={renders.CityList}
                    />
                    <SearchByCityName searchCity={searchCity} renders={renders.SearchByCityName} />
                </div>
                {
                    (newCityPage) ?
                    <NewCityPage
                        addCity={this.props.addCity}
                        errorCityMsg={errorCityMsg}
                        addingCity={addingCity}
                        renders={renders.NewCityPage}
                    /> : ""
                }
                {
                    (showWeather) ?
                    <WeatherInfo
                        weatherIsLoading={weatherIsLoading}
                        cityName={cityName}
                        weatherInfo={weatherInfo}
                        showBtnAdd={showBtnAdd}
                        addCity={this.props.addCity}
                        errorCityMsg={errorCityMsg}
                        renders={renders.WeatherInfo}
                    /> : ""
                }

            </React.Fragment>
        );
    }
}

const mapStateToProps = store => {
    return store.weatherReduser;
};

function mapDispatchToProps(dispatch) {
    return {
        setCity: (cityId , cityName) => {
            dispatch(setCity(cityId , cityName))
        },
        showCities: (citiesLoaded) => {
            dispatch(showCities(citiesLoaded))
        },
        createCityPage: () => {
            dispatch(createCityPage())
        },
        addCity: (cityName) => {
            dispatch(addCity(cityName))
        },
        searchCity: (cityName) => {
            dispatch(searchCity(cityName))
        },
        delCity: (cityName) => {
            dispatch(delCity(cityName))
        }
    }
}

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(App));

