const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: null,
  database: "busbooking",
});

connection.connect(function (err) {
  if (err) {
    console.log(err.code);
    console.log(err.fatal);
  }
});

app.get("/api/buses", (req, res) => {
  const { source, destination } = req.query;
  const query = "SELECT * FROM bus WHERE source = ? AND destination = ?";
  connection.query(query, [source, destination], (err, rows, fields) => {
    if (err) {
      console.log("An error occurred performing the query.");
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(rows);
  });
});

app.put("/api/buses/:busId", (req, res) => {
  const { busId } = req.params;
  const { source, destination, timming } = req.body;

  const query =
    "UPDATE bus SET source = ?, destination = ?, timming = ? WHERE bus_id = ?";
  connection.query(
    query,
    [source, destination, timming, busId],
    (err, result) => {
      if (err) {
        console.log("An error occurred performing the query.");
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json({ message: "Bus details updated successfully" });
    }
  );
});

app.delete("/api/buses/:busId", (req, res) => {
  const { busId } = req.params;

  const query = "DELETE FROM bus WHERE bus_id = ?";
  connection.query(query, [busId], (err, result) => {
    if (err) {
      console.log("An error occurred performing the query.");
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.json({ message: "Bus record deleted successfully" });
  });
});

app.get("/api/passengers/:busId", (req, res) => {
  const { busId } = req.params;
  const query = "SELECT * FROM passenger WHERE bus_id = ?";

  connection.query(query, [busId], (err, rows, fields) => {
    if (err) {
      console.log("An error occurred performing the query.");
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(rows);
  });
});

app.post("/api/buses", (req, res) => {
  const { busId, source, destination, timming } = req.body;

  const checkQuery = "SELECT * FROM bus WHERE bus_id = ?";
  connection.query(checkQuery, [busId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error("Error checking bus_id:", checkErr);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (checkResults.length > 0) {
      console.log("Bus with the same bus_id already exists");

      res
        .status(400)
        .json({ error: "Bus with the same bus_id already exists" });
    } else {
      const insertQuery =
        "INSERT INTO bus (bus_id, source, destination, timming) VALUES (?, ?, ?, ?)";
      connection.query(
        insertQuery,
        [busId, source, destination, timming],
        (insertErr, insertResults) => {
          if (insertErr) {
            console.error("Error inserting bus:", insertErr);
            res.status(500).json({ error: "Internal Server Error" });
            return;
          }

          console.log("Bus inserted successfully");
          res.status(200).json({ message: "Bus added successfully" });
        }
      );
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
