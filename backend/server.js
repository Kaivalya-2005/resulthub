require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");  // For URL encoding


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
  .then(connection => {
    console.log('Successfully connected to the database!');
    connection.release(); // Release the connection back to the pool
  })
  .catch(error => {
    console.error('Failed to connect to the database:', error.message);
  });

// Headers required for the request
const HEADERS = {
    "Host": "mahresult.nic.in",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Referer": "https://mahresult.nic.in/sscmarch2024/sscmarch2024.htm",
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://mahresult.nic.in",
    "Connection": "keep-alive",
    "Cookie": "ASPSESSIONIDSQSQTTAS=MPFNAGABHDEMEJIJIEPFMPFI; ASPSESSIONIDSSRTSQAS=LMLJIKABEGEPNMMCNFFHOGGC; ASPSESSIONIDACQCSDTT=DNDPKIOABCFEDMPAPJAADEAL; ASPSESSIONIDSQQSQTBS=OGBNDHOALJGOHMOBAFFEINAJ",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Priority": "u=0, i"
};

// Function to fetch result from the website
async function fetchResult(rollNumber, motherName) {
    try {
        const postData = qs.stringify({ regno: rollNumber, mname: motherName });
        
        const response = await axios.post(
            "https://mahresult.nic.in/sscmarch2024/sscresultviewmarch24.asp",
            postData,
            { headers: HEADERS }
        );

        const html = response.data;
        const $ = cheerio.load(html);
        
        // Extract percentage from the HTML (modify selector if needed)
        const percentage = $("td:contains('Percentage')").next().text().trim();
        
        if (!percentage) {
            console.log(`No percentage found for ${rollNumber}`);
            return null;
        }

        // Clean the percentage value by removing non-numeric characters (except decimal point)
        const cleanedPercentage = percentage.replace(/[^\d.]/g, '');

        // Ensure the cleaned value is a valid number
        if (isNaN(cleanedPercentage) || cleanedPercentage === '') {
            console.log(`Invalid percentage for ${rollNumber}: ${percentage}`);
            return null;
        }

        return parseFloat(cleanedPercentage);
    } catch (error) {
        console.error(`Error fetching result for ${rollNumber}:`, error.message);
        return null;
    }
}

// POST route for fetching results
app.post("/get-result", async (req, res) => {
    const { rollNumber, motherName } = req.body;
  
    try {
      // Fetch the student details from the database based on the roll number and mother's name
      const [student] = await db.query(
        "SELECT studentName, rollNumber, motherName, percentage FROM results WHERE rollNumber = ? AND motherName = ?",
        [rollNumber, motherName]
      );
  
      // If no record is found, return a 404 error
      if (student.length === 0) {
        return res.status(404).json({ error: "No record found" });
      }
  
      // If percentage is not available, fetch it from the website
      if (!percentage) {
        const fetchedPercentage = await fetchResult(dbRollNumber, dbMotherName);
  
        if (!fetchedPercentage) {
          return res.status(500).json({ error: "Unable to fetch percentage" });
        }
  
        // Update the database with the fetched percentage
        await db.query(
          "UPDATE results SET percentage = ? WHERE rollNumber = ? AND motherName = ?",
          [fetchedPercentage, dbRollNumber, dbMotherName]
        );
        
        return res.json({
          studentName,
          rollNumber: dbRollNumber,
          motherName: dbMotherName,
          percentage: fetchedPercentage,
        });
      }
  
      // If the percentage exists in the database, return the data
      res.json({
        studentName,
        rollNumber: dbRollNumber,
        motherName: dbMotherName,
        percentage,
      });
    } catch (error) {
      console.error("Error fetching result:", error.message);
      res.status(500).json({ error: "Server error" });
    }
  });

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🚀`);
});
