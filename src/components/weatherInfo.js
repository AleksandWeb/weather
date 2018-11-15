import React, { Component } from 'react';
import Loading from "./loading"


class WeatherInfo extends Component {

    shouldComponentUpdate(nextProps) {
        return nextProps.renders.needUpdate;
    }

    addCity = () => {
        this.props.addCity(this.props.cityName);
    };

    render() {

        const {
            cityName,
            weatherIsLoading,
            weatherInfo,
            showBtnAdd,
            errorCityMsg,
        } = this.props;

        return (
            <React.Fragment>
                { (weatherIsLoading) ?
                    <div className="weatherInfo weatherContent">
                        {
                            (errorCityMsg.length) ?
                            <p className="error">{errorCityMsg}</p> : ""
                        }
                        {
                            weatherInfo &&
                            <React.Fragment>
                                <table className="info">
                                    <tbody>
                                    <tr>
                                        <td colSpan="2">{cityName}: {weatherInfo.main.temp} C&deg; {weatherInfo.weather[0].main} </td>
                                    </tr>
                                    <tr>
                                        <td>Ветер: </td>
                                        <td>{weatherInfo.wind.speed} м/с</td>
                                    </tr>
                                    <tr>
                                        <td>Влажность: </td>
                                        <td>{weatherInfo.main.humidity} %</td>
                                    </tr>
                                    <tr>
                                        <td>Давление: </td>
                                        <td>{parseInt(weatherInfo.main.pressure*0.75)} мм. рт. ст</td>
                                    </tr>
                                    </tbody>
                                </table>
                                {
                                    (showBtnAdd) &&
                                    <span className="saveCity" onClick={this.addCity.bind(this)}>
                                    Добавить город в список
                                    </span>
                                }
                            </React.Fragment>
                        }
                    </div> :
                    <Loading />
                }
            </React.Fragment>
        );
    }
}

export default WeatherInfo;