import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./employeeHome.css";

class EmployeeHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      tests: [],
    };
    this.updateTests = this.updateTests.bind(this);
  }

  async componentDidMount() {
    if (this.props.location.state) {
      await this.setState({ email: this.props.location.state.email });
    } else {
      this.props.history.push("/employeeLogin");
    }
    this.updateTests();
  }

  updateTests() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: this.state.email }),
    };
    fetch("/api/employeeTests", requestOptions)
      .then((res) => res.json())
      .then((tests) => {
        this.setState({ tests }, () => console.log("Fetched all tests"));
      });
  }

  render() {
    return (
      <div>
        <nav class="nav">
          <Link to="/">
            <button class="button">Logout</button>
          </Link>
        </nav>
        <div className="employee-home">
          <h1 className="page-title">Test Collection</h1>
          <h3>Logged in as {this.state.email}</h3>
          <table className="tests">
            <tr>
              <th>Collection Date</th>
              <th>Result</th>
            </tr>
            {this.state.tests.map((test) => (
              <tr>
                <td>{test.collectionTime}</td>
                <td>{test.result}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    );
  }
}

export default EmployeeHome;
