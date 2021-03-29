import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./wellTesting.css";

class WellTesting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labID: "",
      wells: {},
    };
    this.updateWell = this.updateWell.bind(this);
    this.addResult = this.addResult.bind(this);
    this.editWell = this.editWell.bind(this);
    this.showEditPopup = this.showEditPopup.bind(this);
    this.deleteWell = this.deleteWell.bind(this);
  }

  async componentDidMount() {
    if (this.props.location.state) {
      let labID = this.props.location.state.labID;
      await this.setState({ labID });
    } else {
      this.props.history.push("/labLogin");
    }
    this.updateWell();
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
          <h1 className="page-title">Well Barcode</h1>
          <div className="new-test-container">
            <div className="inputs">
              <div className="well-barcode-input">
                <label>
                  <b>Well Barcode: </b>
                </label>
                <input
                  type="text"
                  name="well-barcode"
                  autoComplete="off"
                  id="well-barcode-input"
                />
              </div>
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
              <div className="result-input">
                <label>
                  <b>Result: </b>
                </label>
                <select name="result">
                  <option value="in progress">In Progress</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
            </div>
            <button className="button margin-button" onClick={this.addResult}>
              Submit Result
            </button>
          </div>
          <div className="new-test-container">
            <table className="tests">
              <tr>
                <th>Well Barcode</th>
                <th>Pool Barcode</th>
                <th>Result</th>
              </tr>
              {Object.keys(this.state.wells).map((well) => (
                <tr className="well-row">
                  <td>
                    <input type="radio" name="well" value={well} />
                    {well}
                  </td>
                  <td>{this.state.wells[well].pool}</td>
                  <td>{this.state.wells[well].result}</td>
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
                onClick={this.deleteWell}
              >
                Delete
              </button>
            </div>
          </div>
          <div className="edit-well-popup">
            <h1 className="page-title">Edit Pool</h1>
            <div className="inputs">
              <div className="edit-well-barcode">
                <label>
                  <b>Well Barcode: </b>
                </label>
                <input
                  type="text"
                  name="well-barcode-edit"
                  autoComplete="off"
                  id="well-barcode-edit"
                />
              </div>
              <div className="pool-barcode-edit">
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
              <div className="result-edit">
                <label>
                  <b>Result: </b>
                </label>
                <select name="result-edit">
                  <option value="in progress">In Progress</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
            </div>
            <button className="button margin-button" onClick={this.editWell}>
              Submit Edit
            </button>
          </div>
        </div>
      </div>
    );
  }

  showEditPopup() {
    const checkedWell = document.querySelectorAll("input[name=well]:checked");
    if (checkedWell.length == 0) {
      alert("Please select a well to edit.");
      return;
    }
    const currentWell = checkedWell[0].value;
    const wellBarcodeInput = document.getElementById("well-barcode-edit");
    wellBarcodeInput.value = currentWell;
    const currentPool = checkedWell[0].parentElement.nextSibling.innerText;
    const poolInput = document.getElementById("pool-barcode-edit");
    poolInput.value = currentPool;
    const currentResult =
      checkedWell[0].parentElement.nextSibling.nextSibling.innerText;
    const resultInput = document.getElementsByName("result-edit")[0];
    resultInput.value = currentResult;
    const popup = document.getElementsByClassName("edit-well-popup")[0];
    popup.style.display = "flex";
  }

  updateWell() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/wellTesting", requestOptions)
      .then((res) => res.json())
      .then((wells) => {
        this.setState({ wells }, () => console.log("Fetched All Wells"));
      });
  }

  addResult() {
    const wellBarcodeElement = document.getElementsByName("well-barcode")[0];
    const wellBarcode = wellBarcodeElement.value;
    wellBarcodeElement.value = "";
    const poolBarcodeElement = document.getElementsByName("pool-barcode")[0];
    const poolBarcode = poolBarcodeElement.value;
    poolBarcodeElement.value = "";
    const resultElement = document.getElementsByName("result")[0];
    const result = resultElement.value;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        well: wellBarcode,
        pool: poolBarcode,
        result: result,
      }),
    };
    fetch("/api/addResult", requestOptions).then((res) => {
      this.updateWell();
    });
  }

  editWell() {
    const popup = document.getElementsByClassName("edit-well-popup")[0];
    popup.style.display = "none";
    const wellBarcode = document.getElementsByName("well-barcode-edit")[0]
      .value;
    const checkedWell = document.querySelectorAll("input[name=well]:checked");
    const oldWell = checkedWell[0].value;
    const poolBarcodeElement = document.getElementsByName(
      "pool-barcode-edit"
    )[0];
    const poolBarcode = poolBarcodeElement.value;
    const resultElement = document.getElementsByName("result-edit")[0];
    const result = resultElement.value;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldWell: oldWell,
        newWell: wellBarcode,
        pool: poolBarcode,
        result: result,
      }),
    };
    fetch("/api/editWell", requestOptions).then((res) => {
      this.updateWell();
    });
  }

  deleteWell() {
    const checkedWell = document.querySelectorAll("input[name=well]:checked");
    const well = checkedWell[0].value;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        well: well,
      }),
    };
    fetch("/api/deleteWell", requestOptions).then((res) => this.updateWell());
  }
}

export default WellTesting;
