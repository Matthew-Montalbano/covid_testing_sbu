const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const util = require("util");

const port = 5000;
app.use(bodyParser.json());

let con = mysql.createPool({
  host: "localhost",
  user: "316",
  password: "123456",
  database: "hw5",
});

const query = util.promisify(con.query).bind(con);

app.post("/api/employeeLogin", async (req, res) => {
  const result = await query(
    `SELECT * FROM employee WHERE email = "${req.body.email}" AND passcode = "${req.body.password}"`
  );
  if (result.length > 0) {
    res.json({ code: "1" });
  } else {
    res.json({ code: "0" });
  }
});

app.post("/api/employeeTests", async (req, res) => {
  const idResults = await query(
    `SELECT employeeID FROM employee WHERE email = "${req.body.email}"`
  );
  const testResults = await query(
    `SELECT E.collectionTime, W.result FROM 
      employeeTest E, poolmap P, welltesting W
      WHERE E.employeeID = "${idResults[0].employeeID}" AND E.testBarcode = P.testBarcode AND P.poolBarcode = W.poolBarcode`
  );
  testResults.forEach((result) => {
    const collectionTime = result.collectionTime.toString();
    result.collectionTime = collectionTime.substring(4, 15);
  });
  res.json(testResults);
});

app.post("/api/labLogin", async (req, res) => {
  const result = await query(
    `SELECT * FROM labemployee WHERE labID = "${req.body.loginID}" AND passcode = "${req.body.password}"`
  );
  if (result.length > 0) {
    res.json({ code: "1" });
  } else {
    res.json({ code: "0" });
  }
});

app.post("/api/testCollection", (req, res) => {
  con.query(
    `SELECT employeeID, testBarcode FROM employeetest`,
    (err, result) => {
      res.json(result);
    }
  );
});

app.post("/api/testCollection/addTest", async (req, res) => {
  let { testBarcode, employeeID, labID } = req.body;
  var today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  await query(
    `INSERT INTO employeetest VALUES("${testBarcode}", "${employeeID}", "${yyyy}-${mm}-${dd} 00:00:00", "${labID}")`
  ).catch((err) => console.log("Could not insert"));
  res.end();
});

app.post("/api/testCollection/deleteTests", async (req, res) => {
  const stringifiedText = req.body.tests.map((test) => '"' + test + '"');
  let queryString = stringifiedText.join(", ");
  await query(
    `DELETE FROM employeetest WHERE testBarcode IN(${queryString})`
  ).catch((err) => console.log("Could not delete"));
  res.end();
});

app.post("/api/poolMappings", async (req, res) => {
  const poolMapResults = await query("SELECT * FROM poolmap");
  let poolMappings = {};
  poolMapResults.forEach((result) => {
    if (result.poolBarcode in poolMappings) {
      poolMappings[result.poolBarcode].push(result.testBarcode);
    } else {
      poolMappings[result.poolBarcode] = [result.testBarcode];
    }
  });
  Object.keys(poolMappings).forEach((pool) => {
    poolMappings[pool] = poolMappings[pool].join(", ");
  });
  res.json(poolMappings);
});

app.post("/api/addPool", async (req, res) => {
  const testBarcodes = req.body.tests;
  let validTests = [];
  for (let i = 0; i < testBarcodes.length; i++) {
    let found = await query(
      `SELECT * FROM employeetest WHERE testBarcode = "${testBarcodes[i]}"`
    );
    if (found.length != 0) {
      validTests.push(testBarcodes[i]);
    }
  }
  if (validTests.length == 0) {
    res.end();
    return;
  }
  await query(`INSERT INTO pool VALUES("${req.body.pool}")`);
  validTests.forEach((test) => {
    query(`INSERT INTO poolmap VALUES("${test}", "${req.body.pool}")`);
  });
  res.end();
});

app.post("/api/editPool", async (req, res) => {
  const testBarcodes = req.body.tests;
  const oldPool = req.body.oldPool;
  const newPool = req.body.newPool;
  await query(
    `UPDATE pool SET poolBarcode = "${newPool}" WHERE poolBarcode = "${oldPool}"`
  );
  await query(`DELETE FROM poolmap WHERE poolBarcode = "${newPool}"`);
  for (let i = 0; i < testBarcodes.length; i++) {
    await query(
      `INSERT INTO poolmap VALUES("${testBarcodes[i]}", "${newPool}")`
    );
  }
  const results = await query(
    `SELECT * FROM poolmap WHERE poolBarcode = "${newPool}"`
  );
  if (results.length == 0) {
    await query(`DELETE FROM pool WHERE poolBarcode = "${newPool}"`);
  }
  res.end();
});

app.post("/api/deletePool", async (req, res) => {
  await query(`DELETE FROM pool WHERE poolBarcode = "${req.body.pool}"`);
  res.end();
});

app.post("/api/wellTesting", async (req, res) => {
  const wellTestResults = await query(
    `SELECT wellBarcode, poolBarcode, result FROM welltesting`
  );
  let wells = {};
  wellTestResults.forEach((well) => {
    wells[well.wellBarcode] = {
      pool: well.poolBarcode,
      result: well.result,
    };
  });
  res.json(wells);
});

app.post("/api/addResult", async (req, res) => {
  const well = req.body.well;
  const pool = req.body.pool;
  const result = req.body.result;
  await query(`INSERT INTO well VALUES("${well}")`);
  await query(
    `INSERT INTO welltesting VALUES("${pool}", "${well}", "2020-11-30 00:00:00", "2020-11-30 00:00:00", "${result}")`
  );
  res.end();
});

app.post("/api/editWell", async (req, res) => {
  const oldWell = req.body.oldWell;
  const newWell = req.body.newWell;
  const pool = req.body.pool;
  const result = req.body.result;
  await query(
    `UPDATE well SET wellBarcode = "${newWell}" WHERE wellBarcode = "${oldWell}"`
  );
  await query(
    `UPDATE welltesting SET poolBarcode = "${pool}" WHERE wellBarcode = "${newWell}"`
  );
  await query(
    `UPDATE welltesting SET result = "${result}" WHERE wellBarcode = "${newWell}"`
  );
  res.end();
});

app.post("/api/deleteWell", async (req, res) => {
  await query(`DELETE FROM well WHERE wellBarcode = "${req.body.well}"`);
  res.end();
});

app.listen(port, () => {
  console.log(`running on port ${port}`);
});
