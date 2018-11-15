import React, { Component } from 'react';

class SearchByCityName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchCityVal: "",
        };
        this.searchInputHandle = this.searchInputHandle.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.renders.needUpdate || nextState.searchCityVal !== this.state.searchCityVal);
    }

    searchInputHandle = (e) => {
        this.setState({
            searchCityVal: e.currentTarget.value
        });
        this.inputKeyPress = this.inputKeyPress.bind(this);
    };
    searchCity = () => {
        this.props.searchCity(this.state.searchCityVal);
    };

    inputKeyPress = (e) => {
        if(+e.which === 13) {
            this.props.searchCity(this.state.searchCityVal);
        }
    };

    render() {

        return (
            <div className="searchByCityName">
                <label htmlFor="searchCity">Ввести название города</label>
                <input
                    type="text"
                    name="city"
                    id="searchCity"
                    value={this.state.searchCityVal}
                    onChange={this.searchInputHandle}
                    placeholder="Ваш город..."
                    onKeyPress={this.inputKeyPress}
                /><span className="searchCityBtn" onClick={this.searchCity.bind(this)}>Найти</span>
            </div>
        )
    }
}

export default SearchByCityName;