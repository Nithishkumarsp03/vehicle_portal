const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;

// app.use(cors({
//   origin: 'https://bitvehicle.000webhostapp.com', // Allow only your frontend domain
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// }));

app.use(cors());

app.use(express.json());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: "localhost",
  // user: "id22367027_vehicleportal",
  user: "root",
  // password: "Bitsathy@001",
  password: "",
  // database: "id22367027_vehicleportal",
  database: "vehicle_portal",
  connectionLimit: 200,
});

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post("/api/google", (req, res) => {
  const { name, email } = req.body;
  console.log('Received data:', req.body);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(
      "SELECT ROLE, USER_ID, USERNAME FROM data WHERE USERNAME = ? AND EMAIL = ?",
      [name, email],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing database query:", err);
          return res.status(500).json({ message: "Database error" });
        }

        if (results.length > 0) {
          const role = results[0].ROLE;
          const userid = results[0].USER_ID;
          const username = results[0].USERNAME;
          res.status(200).json({ message: "Login successful", role, userid, username });
        } else {
          res.status(401).json({ message: "Invalid username or password" });
        }
      }
    );
  });
});

app.post("/api/login", (req, res) => {
  const { userid, password } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.query(
      "SELECT USERNAME, ROLE FROM data WHERE USER_ID = ? AND PASSWORD = ?",
      [userid, password],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing database query:", err);
          return res.status(500).json({ message: "Database error" });
        }

        if (results.length > 0) {
          const username = results[0].USERNAME;
          const role = results[0].ROLE;
          res.status(200).json({ message: "Login successful", username, role });
        } else {
          res.status(401).json({ message: "Invalid username or password" });
        }
      }
    );
  });
});

app.post("/api/signin", (req, res) => {
  const { userid, password, name, email, number, design } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql =
      "INSERT into data (USER_ID, PASSWORD, USERNAME, EMAIL, PHONENUMBER, DESIGNATION) VALUES (?,?,?,?,?,?)";
    connection.query(
      sql,
      [userid, password, name, email, number, design],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing database query:", err);
          return res.status(500).json({ message: "Database error" });
        }

        if (results.affectedRows > 0) {
          res.status(200).json({ message: "Signin successful" });
        } else {
          res.status(500).json({ message: "Failed to insert data" });
        }
      }
    );
  });
});


app.post("/api/input", (req, res) => {
  const {
    username,
    userid,
    fromDatetime,
    toDatetime,
    startingplace,
    endingplace,
    purpose,
    typeoftrip,
    passengers,
  } = req.body;

  console.log(username);
  console.log(userid);
  console.log(startingplace);
  console.log(endingplace);
  console.log(fromDatetime);
  console.log(toDatetime);
  console.log(purpose);
  console.log(typeoftrip);
  console.log(passengers);
  // console.log(req.body);

  // Basic validation
  if (
    !username ||
    !userid ||
    !fromDatetime ||
    !toDatetime ||
    !startingplace ||
    !endingplace ||
    !purpose ||
    !typeoftrip ||
    !passengers
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql =
      "INSERT INTO form_data (NAME, USER_ID, FROM_DATETIME, TO_DATETIME, STARTING_PLACE, ENDING_PLACE, PURPOSE, TYPE, PASSENGERS) VALUES (?,?,?,?,?,?,?,?,?)";
    connection.query(
      sql,
      [
        username,
        userid,
        fromDatetime,
        toDatetime,
        startingplace,
        endingplace,
        purpose,
        typeoftrip,
        passengers,
      ],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing database query:", err);
          return res.status(500).json({ message: "Database error" });
        }

        if (results.affectedRows > 0) {
          res.status(200).json({ message: "Data inserted" });
        } else {
          res.status(401).json({ message: "Error from server" });
        }
      }
    );
  });
});

app.post("/api/data", (req, res) => {
  const { userid } = req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql =
      "SELECT ID, NAME, USER_ID, FROM_DATETIME, TO_DATETIME, STARTING_PLACE, ENDING_PLACE, PURPOSE, TYPE, PASSENGERS, DRIVER, VEHICLE, REMARKS, STATUS FROM form_data WHERE USER_ID = ? AND (STATUS = '1' OR STATUS = '2' OR STATUS = '0')";
    pool.query(sql, [userid], (err, data) => {
      connection.release();
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
        console.log(err);
      }
      return res.status(200).json(data);
    });
  });
});

app.put("/api/updateStatus", (req, res) => {
  const { from_datetime, status, key, driver, vehicle, description } = req.body;

  // Start a transaction
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error("Error beginning transaction:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Prepare the SQL statements
      const sqlUpdateDriver = "UPDATE form_data SET DRIVER = ? WHERE FROM_DATETIME = ? AND ID = ?";
      const sqlUpdateVehicle = "UPDATE form_data SET VEHICLE = ? WHERE FROM_DATETIME = ? AND ID = ?";
      const sqlUpdateStatus = "UPDATE form_data SET STATUS = ? WHERE FROM_DATETIME = ? AND ID = ?";
      const sqlUpdateDescription = "UPDATE form_data SET REMARKS = ? WHERE FROM_DATETIME = ? AND ID = ?";

      // Execute the SQL statements
      connection.query(sqlUpdateDriver, [driver, from_datetime, key], (err, result) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            console.error("Error updating DRIVER:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          });
        }

        connection.query(sqlUpdateVehicle, [vehicle, from_datetime, key], (err, result) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error("Error updating VEHICLE:", err);
              return res.status(500).json({ error: "Internal Server Error" });
            });
          }

          connection.query(sqlUpdateStatus, [status, from_datetime, key], (err, result) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error("Error updating STATUS:", err);
                return res.status(500).json({ error: "Internal Server Error" });
              });
            }

            // Update description if provided
            if (description) {
              connection.query(sqlUpdateDescription, [description, from_datetime, key], (err, result) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error("Error updating DESCRIPTION:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                  });
                }

                // Commit the transaction if all queries succeed
                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      console.error("Error committing transaction:", err);
                      return res.status(500).json({ error: "Internal Server Error" });
                    });
                  }

                  connection.release();
                  return res.status(200).json({ message: "Driver, Vehicle, Status, and Description updated successfully" });
                });
              });
            } else {
              // Commit the transaction if all queries succeed
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error("Error committing transaction:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                  });
                }

                connection.release();
                return res.status(200).json({ message: "Driver, Vehicle, and Status updated successfully" });
              });
            }
          });
        });
      });
    });
  });
});



app.get("/api/approval", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql =
      "SELECT form_data.ID, form_data.NAME, form_data.USER_ID, data.EMAIL, data.PHONENUMBER, data.DESIGNATION, form_data.FROM_DATETIME, form_data.TO_DATETIME, form_data.STARTING_PLACE, form_data.ENDING_PLACE, form_data.PURPOSE, form_data.TYPE, form_data.PASSENGERS, form_data.DRIVER, form_data.VEHICLE, form_data.STATUS FROM form_data INNER JOIN data ON form_data.USER_ID = data.USER_ID WHERE form_data.STATUS = '1'";
    pool.query(sql, (err, data) => {
      connection.release();
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json(data);
    });
  });
});

app.get("/api/cancelled", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql =
      "SELECT form_data.ID, form_data.NAME, form_data.USER_ID, data.EMAIL, data.PHONENUMBER, data.DESIGNATION, form_data.FROM_DATETIME, form_data.TO_DATETIME, form_data.STARTING_PLACE, form_data.ENDING_PLACE, form_data.PURPOSE, form_data.TYPE, form_data.PASSENGERS FROM form_data INNER JOIN data ON form_data.USER_ID = data.USER_ID WHERE form_data.STATUS = '0'";
    pool.query(sql, (err, data) => {
      connection.release();
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json(data);
    });
  });
});

app.get("/api/approved", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql =
      "SELECT form_data.ID, form_data.NAME, form_data.USER_ID, data.EMAIL, data.PHONENUMBER, data.DESIGNATION, form_data.FROM_DATETIME, form_data.TO_DATETIME, form_data.STARTING_PLACE, form_data.ENDING_PLACE, form_data.PURPOSE, form_data.TYPE, form_data.PASSENGERS, form_data.DRIVER, form_data.VEHICLE FROM form_data INNER JOIN data ON form_data.USER_ID = data.USER_ID WHERE form_data.STATUS = '2'";
    pool.query(sql, (err, data) => {
      connection.release();
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json(data);
    });
  });
});

app.get("/api/driverdata", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting database connection:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const sql = "SELECT * from driver";
    pool.query(sql, (err, data) => {
      connection.release();
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      return res.status(200).json(data);
    });
  });
});

app.post("/api/uploadDriverDetails", upload.single("driverLicense"), (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting database connection:", err);
        return res.status(500).json({ message: "Database error" });
      }
  
      const { driverName, phoneNumber, address } = req.body;
      const driverLicensePath = req.file ? `/uploads/${req.file.filename}` : null;
  
      if (!driverName || !phoneNumber || !address || !driverLicensePath) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const sql = "INSERT INTO driver (NAME, PHONENUMBER, ADDRESS, LICENSE) VALUES (?,?,?,?)";
      connection.query(
        sql,
        [driverName, phoneNumber, address, driverLicensePath],
        (err, results) => {
          connection.release();
  
          console.log("License", driverLicensePath);
          if (err) {
            console.error("Error executing database query:", err);
            return res.status(500).json({ message: "Database error" });
          }
  
          res.status(200).json({ message: "Driver details uploaded successfully" });
        }
      );
    });
  });



  app.post("/api/uploadvehicleDetails", upload.single("vehicleRc"), (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting database connection:", err);
        return res.status(500).json({ message: "Database error" });
      }
  
      const { vehicleName, regNumber, fuel, mileage} = req.body;
      const vehicleRcpath = req.file ? `/uploads/${req.file.filename}` : null;
  
      if (!vehicleName || !regNumber || !fuel || !mileage|| !vehicleRcpath) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const sql = "INSERT INTO vehicle (NAME, NUMBER, FUEL, MILEAGE, IMAGE) VALUES (?,?,?,?,?)";
      connection.query(
        sql,
        [vehicleName, regNumber, fuel, mileage, vehicleRcpath],
        (err, results) => {
          connection.release();
  
          console.log("License", vehicleRcpath);
          if (err) {
            console.error("Error executing database query:", err);
            return res.status(500).json({ message: "Database error" });
          }
  
          res.status(200).json({ message: "Vehicle details uploaded successfully" });
        }
      );
    });
  });


  app.get("/api/vehicledata", (req, res) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting database connection:", err);
        return res.status(500).json({ message: "Database error" });
      }
  
      const sql = "SELECT * from vehicle";
      pool.query(sql, (err, data) => {
        connection.release();
        if (err) {
          console.error("Error executing SQL query:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(200).json(data);
      });
    });
  });

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
