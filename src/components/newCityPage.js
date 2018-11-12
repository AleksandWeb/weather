import React, { Component } from 'react';
import Loading from "./loading";


class NewCityPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newCity: "",
        }
        this.inputKeyPress = this.inputKeyPress.bind(this);
        this.inputHandle = this.inputHandle.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.renders.needUpdate || nextState.newCity !== this.state.newCity);
    }

    addCity = () => {
        this.props.addCity(this.state.newCity);
    };
    inputHandle = (e) => {
        this.setState({
            newCity: e.currentTarget.value
        });
    };

    inputKeyPress = (e) => {
        if(+e.which === 13) {
            this.props.addCity(this.state.newCity);
        }
    };

    render() {
        const {errorCityMsg, addingCity} = this.props;
        return (
            <div className="createNewCity weatherContent">
                <h1>Добавление нового города</h1>
                {
                    (errorCityMsg.length) ?
                    <p className="error">{errorCityMsg}</p> :
                    ""
                }
                <label htmlFor="addCity">Введите название города</label><br />
                <input
                    type="text"
                    id="addCity"
                    value={this.state.newCity}
                    onChange={this.inputHandle}
                    onKeyPress={this.inputKeyPress}
                /><br />
                <span className="saveCity" onClick={this.addCity.bind(this)}>
                    Добавить город в список
                </span>
                {
                    (addingCity) ?
                        <Loading /> : ""
                }
            </div>
        )
    }
}

export default NewCityPage;