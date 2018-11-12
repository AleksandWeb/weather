import React, { Component } from 'react';
import closeImg from "../img/close_button.png";


class CityList extends Component {

    shouldComponentUpdate(nextProps) {
        return nextProps.renders.needUpdate;
    }

    setCityFromList = (cityId, cityName) => {
        this.props.setCity(cityId , cityName);
    };
    showCities = () => {
        this.props.showCities(this.props.citiesLoaded)
    };
    delCity = (cityName) => {
        this.props.delCity(cityName);
    };

    render() {

        const {
            cities,
            showCitiesList,
            createCityPage,
        } = this.props;

        let citiesList = cities.map((city) => {

            let delCityBtn = "";
            if(city.local) { // Если город сохранен локально добавляем кнопку удалить город
                delCityBtn = <img
                    className="delCity"
                    onClick={this.delCity.bind(this, city.name)}
                    src={closeImg}
                    title="Удалить город" alt="close button"/>
            }

            if(city.active) {
                return <div key={city.id} className="cityBtn active">{city.name} {delCityBtn}</div>
            }
            return <div
                key={city.id}
                className="cityBtn">
                <div className="cityName" onClick={this.setCityFromList.bind(this, city.id, city.name)} >{city.name}</div> {delCityBtn}</div>
        });

        return (
            <div className="cityList">
                <div className="showCitiesBtn" onClick={this.showCities.bind(this)}>Выбрать город из списка</div>
                {showCitiesList &&
                <div className="list">
                    {citiesList}
                    <span className="cityBtn newCity" onClick={createCityPage}>Добавить свой город</span>
                </div>
                }
            </div>
        )
    }
}

export default CityList;