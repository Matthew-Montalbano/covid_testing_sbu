import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./labLogin.css";
import "../../../App.css";

class LabLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginID: "",
      password: "",
    };
    this.login = this.login.bind(this);
  }

  render() {
    return (
      <div>
        <nav class="nav">
          <Link to="/">
            <button class="button">Home</button>
          </Link>
        </nav>
        <div className="login-container">
          <h1>Lab Worker Login</h1>
          <div>
            <div className="inputs">
              <div className="labInput">
                <label>
                  <b>Lab ID: </b>
                </label>
                <input
                  type="text"
                  name="id"
                  autoComplete="off"
                  onChange={(e) => {
                    this.setState({ loginID: e.target.value });
                  }}
                />
              </div>
              <div className="labInput">
                <label className="loginLabel">
                  <b>Password: </b>
                </label>
                <input
                  name="password"
                  autoComplete="off"
                  type="password"
                  onChange={(e) => {
                    this.setState({ password: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="labLoginButtons">
              <button className="button lab-login" onClick={this.login}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  async login() {
    const data = {
      loginID: this.state.loginID,
      password: this.state.password,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const res = await fetch("/api/labLogin", requestOptions).then((res) =>
      res.json()
    );
    if (res.code == 1) {
      this.props.history.push({
        pathname: "/labEmployee/labHome",
        state: {
          labID: data["loginID"],
        },
      });
    } else {
      window.location.reload();
    }
  }
}

export default LabLogin;
