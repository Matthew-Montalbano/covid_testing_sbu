import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./labHome.css";
import "../../../App.css";

class LabHome extends Component {
  state = {};

  componentDidMount() {
    if (this.props.location.state) {
      this.setState({ labID: this.props.location.state.labID });
    } else {
      this.props.history.push("/labLogin");
    }
  }

  render() {
    return (
      <div>
        <nav class="nav">
          <Link to="/">
            <button class="button">Logout</button>
          </Link>
        </nav>
        <div className="labHome">
          <h1>Lab Home</h1>
          <div className="button-container">
            <Link
              to={{
                pathname: "/labEmployee/poolMapping",
                state: {
                  labID: this.state.labID,
                },
              }}
            >
              <button className="button">Pool Mapping</button>
            </Link>
            <Link
              to={{
                pathname: "/labEmployee/wellTesting",
                state: {
                  labID: this.state.labID,
                },
              }}
            >
              <button className="button">Well Testing</button>
            </Link>
            <Link
              to={{
                pathname: "/labEmployee/testCollection",
                state: {
                  labID: this.state.labID,
                },
              }}
            >
              <button className="button">Test Collection</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default LabHome;
