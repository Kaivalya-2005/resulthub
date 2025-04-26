const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const { fetchResultsFromSite } = require('./utils/fetchResults.js');  // Import your fetchResults function
const { generateAndStorePDFs } = require('./services/pdfService.js'); // Import the PDF generation function

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000'],
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

// Add this at the end of your file
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});
