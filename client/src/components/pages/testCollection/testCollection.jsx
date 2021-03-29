import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./testCollection.css";

class TestCollection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labID: "",
      tests: [],
    };
    this.addTest = this.addTest.bind(this);
    this.updateTests = this.updateTests.bind(this);
    this.deleteTests = this.deleteTests.bind(this);
  }

  async componentDidMount() {
    if (this.props.location.state) {
      let labID = this.props.location.state.labID;
      await this.setState({ labID });
    } else {
      this.props.history.push("/labLogin");
    }
    this.updateTests();
  }

  render() {
    return (
      <div>
        <nav class="nav">
          <button
            class="button"
            style={{ marginRight: "10px" }}
            onClick={() => {
              this.props.history.goBack();
            }}
          >
            Home
          </button>
          <Link to="/">
            <button class="button">Logout</button>
          </Link>
        </nav>
        <div>
          <h1 className="page-title">Test Collection</h1>
          <div className="new-test-container">
            <div className="inputs">
              <div className="id-input">
                <label>
                  <b>Employee ID: </b>
                </label>
                <input
                  type="text"
                  name="id"
                  autoComplete="off"
                  onChange={(e) => {
                    this.setState({ employeeID: e.target.value });
                  }}
                />
              </div>
              <div className="test-barcode-input">
                <label>
                  <b>Test Barcode: </b>
                </label>
                <input
                  type="text"
                  name="barcode"
                  autoComplete="off"
                  onChange={(e) => {
                    this.setState({ testBarcode: e.target.value });
                  }}
                />
              </div>
            </div>
            <button className="button margin-button" onClick={this.addTest}>
              Add New Test
            </button>
          </div>
          <div className="new-test-container">
            <table className="tests">
              <tr>
                <th>Employee ID</th>
                <th>Test Barcode</th>
              </tr>
              {this.state.tests.map((test) => (
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      name="test"
                      value={test.testBarcode}
                    />
                    {test.employeeID}
                  </td>
                  <td>{test.testBarcode}</td>
                </tr>
              ))}
            </table>
            <button className="button margin-button" onClick={this.deleteTests}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  addTest() {
    let data = {
      employeeID: document.querySelector("input[name=id]").value,
      testBarcode: document.querySelector("input[name=barcode]").value,
      labID: this.state.labID,
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch("/api/testCollection/addTest", requestOptions).then((res) =>
      this.updateTests()
    );
  }

  updateTests() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ labID: this.state.labID }),
    };
    fetch("/api/testCollection", requestOptions)
      .then((res) => res.json())
      .then((tests) => {
        this.setState({ tests }, () => console.log("Fetched all tests"));
      });
  }

  deleteTests() {
    let checkedBoxes = document.querySelectorAll("input[name=test]:checked");
    let selectedTests = [];
    checkedBoxes.forEach((box) => {
      box.checked = false;
      selectedTests.push(box.value);
    });
    console.log(selectedTests);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tests: selectedTests }),
    };
    fetch("/api/testCollection/deleteTests", requestOptions).then((res) =>
      this.updateTests()
    );
  }
}

export default TestCollection;
