import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./chooseLogin.css";
import "../../../App.css";

class ChooseLogin extends Component {
  state = {};
  render() {
    return (
      <div className="login">
        <h1 className="whichLogin">
          Are you a Stony Brook Employee or a Lab Worker?
        </h1>
        <div className="loginChoices">
          <Link className="loginLink" to="/employeeLogin">
            <button className="button loginButton">I'm an Employee</button>
          </Link>
          <Link className="loginLink" to="/labLogin">
            <button className="button loginButton">I'm a Lab Worker</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default ChooseLogin;
