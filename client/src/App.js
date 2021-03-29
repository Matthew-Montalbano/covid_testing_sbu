import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ChooseLogin from "./components/pages/chooseLogin/chooseLogin";
import EmployeeLogin from "./components/pages/employeeLogin/employeeLogin";
import EmployeeHome from "./components/pages/employeeHome/employeeHome";
import LabLogin from "./components/pages/labLogin/labLogin";
import LabHome from "./components/pages/labHome/labHome";
import PoolMapping from "./components/pages/poolMapping/poolMapping";
import WellTesting from "./components/pages/wellTesting/wellTesting";
import TestCollection from "./components/pages/testCollection/testCollection";

class App extends Component {
  state = {};
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={ChooseLogin} />
          <Route path="/employeeLogin" component={EmployeeLogin} />
          <Route path="/employeeHome" component={EmployeeHome} />
          <Route path="/labLogin" component={LabLogin} />
          <Route path="/labEmployee/labHome" component={LabHome} />
          <Route path="/labEmployee/poolMapping" component={PoolMapping} />
          <Route path="/labEmployee/wellTesting" component={WellTesting} />
          <Route
            path="/labEmployee/testCollection"
            component={TestCollection}
          />
        </div>
      </Router>
    );
  }
}

export default App;
