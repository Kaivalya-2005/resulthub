const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",   // Change if needed
    password: "Kaivalya@2005",   // Change if needed
    database: "StudentResults"
});

// Fetch data from external API & store in MySQL
app.get("/fetch-and-store-results", async (req, res) => {
    console.log("Received request to /fetch-and-store-results");
    try {
        const response = await axios.post(
            "https://sandbox.api-setu.in/certificate/v3/hsscboardmh/sscer",
            {
                txnId: "f7f1469c-29b0-4325-9dfc-c567200a70f7",
                format: "xml",
                certificateParameters: {
                    YEAR: "2023",
                    rollnumber: "123456",
                    totalmarks: "123",
                    exsession: "MAR",
                    FullName: "Demo user"
                },
                consentArtifact: {
                    consent: {
                        consentId: "ea9c43aa-7f5a-4bf3-a0be-e1caa24737ba",
                        timestamp: "2024-12-13T06:30:48.485Z",
                        dataConsumer: { id: "string" },
                        dataProvider: { id: "string" },
                        purpose: { description: "string" },
                        user: {
                            idType: "string",
                            idNumber: "string",
                            mobile: "9988776655",
                            email: "test@email.com"
                        },
                        data: { id: "string" },
                        permission: {
                            access: "string",
                            dateRange: {
                                from: "2024-12-13T06:30:48.485Z",
                                to: "2024-12-13T06:30:48.485Z"
                            },
                            frequency: { unit: "string", value: 0, repeats: 0 }
                        }
                    },
                    signature: { signature: "string" }
                }
            },
            {
                headers: {
                    "Accept": "application/xml, application/json",
                    "Content-Type": "application/json",
                    "X-APISETU-APIKEY": "demokey123456ABCD789",
                    "X-APISETU-CLIENTID": "in.gov.sandbox"
                }
            }
        );

        // Extract student details from API response
        const studentData = response.data; // Modify according to actual API response
        const rollNumber = studentData.certificateParameters.rollnumber;
        const studentName = studentData.certificateParameters.FullName;
        const marks = studentData.certificateParameters.totalmarks;
        const motherName = "Not Provided"; // If API does not give this, set manually
        const status = marks >= 35 ? "Pass" : "Fail";

        // Insert into MySQL
        const query = `
            INSERT INTO results (rollNumber, motherName, studentName, marks, status) 
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                studentName = VALUES(studentName),
                marks = VALUES(marks),
                status = VALUES(status);
        `;
        db.query(query, [rollNumber, motherName, studentName, marks, status], (err) => {
            if (err) {
                return res.status(500).json({ error: "Database insertion failed" });
            }
            console.log("API Response received:", response.data);  // Debugging log
            res.json({ message: "Data fetched and stored successfully" });
        });

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database ✅");
    }
});

// API to fetch student result by roll number & mother's name
app.post("/get-result", (req, res) => {
    const { rollNumber, motherName } = req.body;

    const query = "SELECT * FROM results WHERE rollNumber = ? AND motherName = ?";
    db.query(query, [rollNumber, motherName], (err, results) => {
        if (err) {
            res.status(500).json({ error: "Database error" });
        } else if (results.length === 0) {
            res.status(404).json({ message: "No record found" });
        } else {
            res.json(results[0]);
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🚀`);
});
