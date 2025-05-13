const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { startPollingUntilSuccess } = require('./utils/fetchResults.js');  // Import your fetchResults function
const { getResultDistribution, compareStudents, getStudentResult, getTopToppers, getSubjectwiseToppers, getSubjectDistribution } = require('./services/analysisService.js'); // Add this after other requires

const app = express();

// Middleware
// Update CORS configuration
app.use(cors({
    origin: '*', // Add your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
}));
app.use(bodyParser.json());

// Automatically fetch results and generate PDFs when server starts
(async () => {
  try {
    await startPollingUntilSuccess();

    //await generateAndStorePDFs();
    //console.log('✅ PDFs generated and uploaded successfully');
  } catch (error) {
    console.error('❌ Error during startup:', error.message);
  }
})();

// Server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// API Route to show statistics distribution of the results
app.get('/api/statistics/distribution', async (req, res) => {
    try {
        const distribution = await getResultDistribution();
        res.json(distribution);
    } catch (error) {
        console.error('Error fetching distribution:', error);
        res.status(500).json({ error: "Failed to fetch result distribution" });
    }
});

// API Route to Fetch results from the database and compare them
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

// API Route to fetch a single student's result
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

// API Route to fetch the top 10 students
app.get('/api/statistics/toppers', async (req, res) => {
    try {
      const toppers = await getTopToppers();
      res.json(toppers);
    } catch (error) {
      console.error('Error fetching toppers:', error);
      res.status(500).json({ error: "Failed to fetch top 10 students" });
    }
});

// API Route to get subjectwise toppers
app.get('/api/statistics/subjectwise-toppers', async (req, res) => {
    try {
      const subjectwiseToppers = await getSubjectwiseToppers();
      res.json(subjectwiseToppers);
    } catch (error) {
      console.error('Error fetching subjectwise toppers:', error);
      res.status(500).json({ error: "Failed to fetch subjectwise toppers" });
    }
});

// API Route to get subject-wise distribution
app.get('/api/statistics/subject-distribution/:subject', async (req, res) => {
    try {
        const { subject } = req.params;
        const distribution = await getSubjectDistribution(subject);
        res.json(distribution);
    } catch (error) {
        console.error('Error fetching subject distribution:', error);
        res.status(error.message === 'Invalid subject' ? 400 : 500)
            .json({ error: error.message || "Failed to fetch subject distribution" });
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
