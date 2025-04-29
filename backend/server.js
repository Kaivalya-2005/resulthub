const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { fetchResultsFromSite } = require('./utils/fetchResults.js');  // Import your fetchResults function
const { generateAndStorePDFs } = require('./services/pdfService.js'); // Import the PDF generation function
const { getResultDistribution, compareStudents, getStudentResult } = require('./services/analysisService.js'); // Add this after other requires

const app = express();

// Middleware
app.use(cors({
    origin: ['*'],
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(bodyParser.json());

// Automatically fetch results and generate PDFs when server starts
(async () => {
  try {
    await fetchResultsFromSite();
    console.log('✅ Results fetched and stored in DB successfully');

    await generateAndStorePDFs();
    console.log('✅ PDFs generated and uploaded successfully');
  } catch (error) {
    console.error('❌ Error during startup:', error.message);
  }
})();

// Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Show statistics of the results
app.get('/api/statistics/distribution', async (req, res) => {
    try {
        const distribution = await getResultDistribution();
        res.json(distribution);
    } catch (error) {
        console.error('Error fetching distribution:', error);
        res.status(500).json({ error: "Failed to fetch result distribution" });
    }
});

// Fetch results from the database and compare them
app.get('/api/compare-students', async (req, res) => {
    try {
        const { seat1, mother1, seat2, mother2 } = req.query;

        if (!seat1 || !mother1 || !seat2 || !mother2) {
            return res.status(400).json({ error: "Both seat numbers and mother names are required" });
        }

        const result = await compareStudents(seat1, mother1, seat2, mother2);
        res.json(result);
    } catch (error) {
        console.error('Error in /api/compare-students:', error);
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

// Route to fetch a single student's result
app.get('/api/fetch', async (req, res) => {
    try {
        const { seat_number, mother_name } = req.query;

        if (!seat_number || !mother_name) {
            return res.status(400).json({ error: "Both seat number and mother's name are required" });
        }

        const student = await getStudentResult(seat_number, mother_name);

        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json(student);
    } catch (error) {
        console.error('Error getting student data:', error);
        res.status(500).json({ error: "Error getting student data" });
    }
});

// Add this at the end of your file
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});
