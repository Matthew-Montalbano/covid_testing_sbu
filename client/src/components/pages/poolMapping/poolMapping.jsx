import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./poolMapping.css";

class PoolMapping extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labID: "",
      pools: {},
    };
    this.addRow = this.addRow.bind(this);
    this.updateTests = this.updateTests.bind(this);
    this.addPool = this.addPool.bind(this);
    this.editPool = this.editPool.bind(this);
    this.showEditPopup = this.showEditPopup.bind(this);
    this.deletePool = this.deletePool.bind(this);
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
          <h1 className="page-title">Pool Mapping</h1>
          <div className="new-test-container">
            <div className="inputs">
              <div className="pool-barcode-input">
                <label>
                  <b>Pool Barcode: </b>
                </label>
                <input
                  type="text"
                  name="pool-barcode"
                  autoComplete="off"
                  id="pool-barcode-input"
                />
              </div>
              <div className="test-barcode-input">
                <label>
                  <b>Test Barcodes: </b>
                </label>
                <div className="test-barcode-container">
                  <div
                    className="test-barcode-inputs"
                    id="test-barcode-inputs"
                  ></div>
                  <button
                    className="add-rows"
                    onClick={() => this.addRow("input")}
                  >
                    Add More Tests
                  </button>
                </div>
              </div>
            </div>
            <button className="button margin-button" onClick={this.addPool}>
              Submit Pool
            </button>
          </div>
          <div className="new-test-container">
            <table className="tests">
              <tr>
                <th>Pool Barcode</th>
                <th>Test Barcodes</th>
              </tr>
              {Object.keys(this.state.pools).map((pool) => (
                <tr className="pool-row">
                  <td>
                    <input type="radio" name="pool" value={pool} />
                    {pool}
                  </td>
                  <td>{this.state.pools[pool]}</td>
                </tr>
              ))}
            </table>
            <div className="row-buttons">
              <button
                className="button margin-button"
                onClick={this.showEditPopup}
              >
                Edit
              </button>
              <button
                className="button margin-button"
                onClick={this.deletePool}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="edit-pool-popup">
            <h1 className="page-title">Edit Pool</h1>
            <div className="inputs">
              <div className="edit-pool-barcode">
                <label>
                  <b>Pool Barcode: </b>
                </label>
                <input
                  type="text"
                  name="pool-barcode-edit"
                  autoComplete="off"
                  id="pool-barcode-edit"
                />
              </div>
              <div className="test-barcode-input">
                <label>
                  <b>Test Barcodes: </b>
                </label>
                <div className="test-barcode-container">
                  <div
                    className="test-barcode-edits"
                    id="test-barcode-edits"
                  ></div>
                  <button
                    className="add-rows"
                    onClick={() => this.addRow("edit")}
                  >
                    Add More Tests
                  </button>
                </div>
              </div>
            </div>
            <button className="button margin-button" onClick={this.editPool}>
              Submit Edit
            </button>
          </div>
        </div>
      </div>
    );
  }

  showEditPopup() {
    const checkedPool = document.querySelectorAll("input[name=pool]:checked");
    if (checkedPool.length == 0) {
      alert("Please select a pool to edit.");
      return;
    }
    const currentPool = checkedPool[0].value;
    const currentTestsString =
      checkedPool[0].parentElement.nextSibling.innerText;
    const currentTests = currentTestsString.split(", ");
    const poolBarcodeInput = document.getElementById("pool-barcode-edit");
    poolBarcodeInput.value = currentPool;
    currentTests.forEach((test) => {
      this.addRow("edit", test);
    });
    const popup = document.getElementsByClassName("edit-pool-popup")[0];
    popup.style.display = "flex";
  }

  addRow(type, value = "") {
    const inputs = document.getElementById(`test-barcode-${type}s`);
    let newInput = document.createElement("div");
    newInput.classList.add("test-input-container");
    newInput.innerHTML = `
        <input name="test-barcode-${type}" placeholder="Enter Test Barcode" autocomplete="off" value="${value}" />
      `;
    let deleteButton = document.createElement("button");
    deleteButton.onclick = () => {
      newInput.remove();
    };
    deleteButton.innerText = "Delete Test";
    newInput.appendChild(deleteButton);
    inputs.appendChild(newInput);
  }

  updateTests() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/poolMappings", requestOptions)
      .then((res) => res.json())
      .then((pools) => {
        this.setState({ pools }, () => console.log("Fetched all tests"));
      });
  }

  addPool() {
    const testInputs = document.querySelectorAll(
      "input[name=test-barcode-input]"
    );
    const testBarcodes = [...testInputs].map((input) => input.value);
    testInputs.forEach((input) => (input.value = ""));
    const poolBarcodeElement = document.getElementsByName("pool-barcode")[0];
    const poolBarcode = poolBarcodeElement.value;
    poolBarcodeElement.value = "";
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pool: poolBarcode, tests: testBarcodes }),
    };
    fetch("/api/addPool", requestOptions).then((res) => {
      this.updateTests();
    });
  }

  editPool() {
    const popup = document.getElementsByClassName("edit-pool-popup")[0];
    popup.style.display = "none";
    const testInputs = document.querySelectorAll(
      "input[name=test-barcode-edit]"
    );
    const testBarcodes = [...testInputs].map((input) => input.value);
    const poolBarcode = document.getElementsByName("pool-barcode-edit")[0]
      .value;
    const checkedPool = document.querySelectorAll("input[name=pool]:checked");
    const oldPool = checkedPool[0].value;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldPool: oldPool,
        newPool: poolBarcode,
        tests: testBarcodes,
      }),
    };
    fetch("/api/editPool", requestOptions).then((res) => {
      this.updateTests();
    });
    const testsElement = document.getElementById("test-barcode-edits");
    testsElement.innerHTML = "";
  }

  deletePool() {
    const checkedPool = document.querySelectorAll("input[name=pool]:checked");
    const pool = checkedPool[0].value;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pool: pool,
      }),
    };
    fetch("/api/deletePool", requestOptions).then((res) => this.updateTests());
  }
}

export default PoolMapping;
