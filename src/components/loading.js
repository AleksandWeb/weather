import React, { Component } from 'react';


class Loading extends Component {
    render() {
        return (
            <div className="LoadContent">
                <span className="h100"> </span>{" "}
                <span className="spin"> </span>{" "}
                <span className="h100"> </span>{" "}
            </div>
        )
    }
}

export default Loading;