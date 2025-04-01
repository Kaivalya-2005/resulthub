require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

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

// Function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to process a single student and store result
async function processAndStoreStudent(rollNumber, motherName, connection) {
    try {
        console.log(`Processing student: ${rollNumber}`);
        
        // Check if result already exists in database
        const [existing] = await connection.execute(
            'SELECT * FROM results WHERE rollNumber = ?',
            [rollNumber]
        );

        if (existing.length > 0 && existing[0].percentage) {
            console.log(`Result already exists for ${rollNumber}`);
            return;
        }

        // Fetch result from website
        const { percentage, html } = await fetchResult(rollNumber, motherName);
        
        if (!percentage || !html) {
            console.log(`No result available for ${rollNumber}`);
            return;
        }

        console.log(`Got percentage ${percentage} for ${rollNumber}`);

        // First update the percentage (smaller update)
        const [percentageResult] = await connection.execute(
            `UPDATE results 
             SET percentage = ?
             WHERE rollNumber = ?`,
            [percentage, rollNumber]
        );

        console.log('Percentage update result:', percentageResult);

        // Generate PDF
        console.log('Generating PDF...');
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        // Then update the PDF separately
        console.log('Updating PDF in database...');
        const [pdfResult] = await connection.execute(
            `UPDATE results 
             SET pdf = ?
             WHERE rollNumber = ?`,
            [pdfBuffer, rollNumber]
        );

        console.log('PDF update result:', pdfResult);

        // Verify the updates
        const [verification] = await connection.execute(
            'SELECT rollNumber, studentName, percentage, (pdf IS NOT NULL) as hasPdf FROM results WHERE rollNumber = ?',
            [rollNumber]
        );
        console.log('Verification after updates:', verification);

    } catch (error) {
        console.error(`Error processing student ${rollNumber}:`, error.message);
        console.error('Full error:', error);
        // Try to log the current database state
        try {
            const [current] = await connection.execute(
                'SELECT rollNumber, studentName, percentage, (pdf IS NOT NULL) as hasPdf FROM results WHERE rollNumber = ?',
                [rollNumber]
            );
            console.log('Current database state for student:', current);
        } catch (verifyError) {
            console.error('Error checking current state:', verifyError);
        }
    }
}

// Function to process all students
async function processAllStudents() {
    let connection;
    try {
        connection = await db.getConnection();
        
        // Get list of all students to process
        const [students] = await connection.execute('SELECT rollNumber, motherName FROM results WHERE percentage IS NULL');
        
        console.log(`Found ${students.length} students to process`);

        // Process each student with a delay between requests
        for (const student of students) {
            await processAndStoreStudent(student.rollNumber, student.motherName, connection);
            await delay(2000); // 2 second delay between requests
        }

        console.log('Finished processing all students');
    } catch (error) {
        console.error('Error in batch processing:', error.message);
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

// Initialize database and start processing
db.getConnection()
    .then(async connection => {
        console.log('Successfully connected to the database!');
        
        try {
            // Create database if it doesn't exist
            await connection.execute('CREATE DATABASE IF NOT EXISTS StudentResults');
            await connection.execute('USE StudentResults');

            // Drop and recreate table with LONGBLOB
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS results (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    rollNumber VARCHAR(20) UNIQUE NOT NULL,
                    studentName VARCHAR(100) NOT NULL,    
                    motherName VARCHAR(100) NOT NULL,
                    percentage DECIMAL(5,2) DEFAULT NULL,
                    pdf LONGBLOB DEFAULT NULL
                )
            `);

            // Alter existing table if it exists
            try {
                await connection.execute('ALTER TABLE results MODIFY COLUMN pdf LONGBLOB');
                console.log('Updated PDF column to LONGBLOB');
            } catch (alterError) {
                console.log('Table already has correct structure or was just created');
            }

            console.log('Database and table created successfully!');
        } catch (error) {
            console.error('Error creating database/table:', error.message);
        } finally {
            connection.release();
        }

        // Start processing students
        console.log('Starting to process all students...');
        processAllStudents();
    })
    .catch(error => {
        console.error('Failed to connect to the database:', error.message);
    });

// Headers required for the request
const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://mahresult.nic.in",
    "Referer": "https://mahresult.nic.in/sscmarch2024/sscmarch2024.htm",
    "Connection": "keep-alive",
    "Cookie": "ASPSESSIONIDCATBATDD=AAIFOJJBHHHMINNJLAPBGLNN; ASPSESSIONIDSQSSRSAT=FMPHAINBLDKKBDNMJEBLFEMF",
    "Cache-Control": "max-age=0",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-User": "?1",
    "Sec-Fetch-Dest": "document",
    "Sec-Ch-Ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Google Chrome\";v=\"122\"",
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": "\"Windows\"",
    "Upgrade-Insecure-Requests": "1"
};

// Function to fetch result from the website
async function fetchResult(rollNumber, motherName) {
    try {
        console.log(`Attempting to fetch result for Roll Number: ${rollNumber}, Mother's Name: ${motherName}`);
        
        // Create raw form data string
        const postData = `regno=${rollNumber}&mname=${motherName}`;
        console.log('Post Data:', postData);
        
        const response = await axios.post(
            "https://mahresult.nic.in/sscmarch2024/sscresultviewmarch24.asp",
            postData,
            { 
                headers: {
                    ...HEADERS,
                    'Content-Length': postData.length
                },
                timeout: 10000, // 10 second timeout
                validateStatus: false // Allow any status code
            }
        );

        console.log('Response Status:', response.status);
        console.log('Response Headers:', response.headers);
        
        if (response.status !== 200) {
            console.error('Error Response:', response.data);
            throw new Error(`Server returned status ${response.status}`);
        }

        const html = response.data;
        console.log('Received HTML length:', html.length);
        
        const $ = cheerio.load(html);
        
        // Extract percentage from the HTML
        const percentage = $("td:contains('Percentage')").next().text().trim();
        console.log('Found percentage:', percentage);
        
        if (!percentage) {
            console.log('No percentage found in HTML');
            return { percentage: null, html: null };
        }

        // Clean the percentage value
        const cleanedPercentage = percentage.replace(/[^\d.]/g, '');
        console.log('Cleaned percentage:', cleanedPercentage);

        if (isNaN(cleanedPercentage) || cleanedPercentage === '') {
            console.log(`Invalid percentage value: ${percentage}`);
            return { percentage: null, html: null };
        }

        return { 
            percentage: parseFloat(cleanedPercentage),
            html: html
        };
    } catch (error) {
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            response: error.response ? {
                status: error.response.status,
                statusText: error.response.statusText,
                headers: error.response.headers,
                data: error.response.data
            } : 'No response'
        });
        return { percentage: null, html: null };
    }
}

// Function to generate PDF from HTML
async function generatePdf(html) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({ 
            format: "A4",
            printBackground: true,
            margin: {
                top: "20px",
                bottom: "20px",
                left: "20px",
                right: "20px"
            }
        });
        await browser.close();
        return pdfBuffer;
    } catch (error) {
        console.error("Error generating PDF:", error.message);
        return null;
    }
}

// Get result endpoint
app.post("/get-result", async (req, res) => {
    const { rollNumber, motherName } = req.body;
    
    if (!rollNumber || !motherName) {
        return res.status(400).json({ error: "Roll number and mother's name are required" });
    }

    try {
        const connection = await db.getConnection();
        
        try {
            // Get student data from database
            const [students] = await connection.execute(
                'SELECT rollNumber, studentName, motherName, percentage FROM results WHERE rollNumber = ? AND motherName = ?',
                [rollNumber, motherName]
            );

            if (students.length === 0) {
                // If not in database, try to fetch and store
                await processAndStoreStudent(rollNumber, motherName, connection);
                
                // Check again after processing
                const [updatedStudents] = await connection.execute(
                    'SELECT rollNumber, studentName, motherName, percentage FROM results WHERE rollNumber = ? AND motherName = ?',
                    [rollNumber, motherName]
                );

                if (updatedStudents.length === 0) {
                    return res.status(404).json({ error: "No record found" });
                }

                const student = updatedStudents[0];
                if (!student.percentage) {
                    return res.status(404).json({ error: "Result not yet available" });
                }

                return res.json({
                    studentName: student.studentName,
                    rollNumber: student.rollNumber,
                    motherName: student.motherName,
                    percentage: student.percentage,
                    hasPdf: true
                });
            }

            const student = students[0];
            if (!student.percentage) {
                return res.status(404).json({ error: "Result not yet available" });
            }

            return res.json({
                studentName: student.studentName,
                rollNumber: student.rollNumber,
                motherName: student.motherName,
                percentage: student.percentage,
                hasPdf: true
            });

        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error in /get-result:', error);
        res.status(500).json({ error: "Server error" });
    }
});

// Download PDF endpoint
app.get("/download-pdf/:rollNumber", async (req, res) => {
    const { rollNumber } = req.params;

    try {
        const connection = await db.getConnection();
        
        try {
            const [students] = await connection.execute(
                'SELECT studentName, pdf FROM results WHERE rollNumber = ?',
                [rollNumber]
            );

            if (students.length === 0 || !students[0].pdf) {
                return res.status(404).json({ error: "PDF not found" });
            }

            const student = students[0];
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${rollNumber}_result.pdf`);
            res.send(student.pdf);

        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error in /download-pdf:', error);
        res.status(500).json({ error: "Server error" });
    }
});

// Bulk processing endpoint
app.post("/process-bulk-results", async (req, res) => {
    try {
        // Get all students without percentage
        const [students] = await db.query(
            "SELECT id, rollNumber, motherName FROM results WHERE percentage IS NULL"
        );

        let processed = 0;
        let failed = 0;

        // Process each student with a delay to avoid overwhelming the server
        for (const student of students) {
            try {
                // Fetch result from website
                const { percentage, html } = await fetchResult(student.rollNumber, student.motherName);
                
                if (percentage && html) {
                    // Generate PDF
                    const pdfBuffer = await generatePdf(html);
                    
                    // Update database with percentage and PDF
                    await db.query(
                        "UPDATE results SET percentage = ?, pdf = ? WHERE id = ?",
                        [percentage, pdfBuffer, student.id]
                    );
                    
                    processed++;
                } else {
                    failed++;
                }

                // Add a small delay between requests (1 second)
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Error processing student ${student.rollNumber}:`, error.message);
                failed++;
            }
        }

        res.json({
            message: "Bulk processing completed",
            totalProcessed: processed,
            failed: failed,
            remaining: students.length - (processed + failed)
        });
    } catch (error) {
        console.error("Error in bulk processing:", error.message);
        res.status(500).json({ error: "Server error during bulk processing" });
    }
});

// Add student endpoint
app.post("/add-student", async (req, res) => {
    const { rollNumber, studentName, motherName } = req.body;

    // Validate input
    if (!rollNumber || !studentName || !motherName) {
        return res.status(400).json({ 
            error: "Roll number, student name, and mother's name are required" 
        });
    }

    try {
        const connection = await db.getConnection();
        
        try {
            // Insert student into database
            await connection.execute(
                `INSERT INTO results (rollNumber, studentName, motherName) 
                 VALUES (?, ?, ?)`,
                [rollNumber, studentName, motherName]
            );

            // Start processing this student's result
            processAndStoreStudent(rollNumber, motherName, connection);

            res.json({ 
                message: "Student added successfully",
                student: { rollNumber, studentName, motherName }
            });

        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error in /add-student:', error);
        
        // Check for duplicate entry error
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                error: "Student with this roll number already exists" 
            });
        }
        
        res.status(500).json({ error: "Server error" });
    }
});

// Add multiple students endpoint
app.post("/add-students", async (req, res) => {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
        return res.status(400).json({ 
            error: "Please provide an array of students" 
        });
    }

    try {
        const connection = await db.getConnection();
        
        try {
            const results = {
                success: [],
                failed: []
            };

            for (const student of students) {
                const { rollNumber, studentName, motherName } = student;

                if (!rollNumber || !studentName || !motherName) {
                    results.failed.push({
                        student,
                        error: "Missing required fields"
                    });
                    continue;
                }

                try {
                    await connection.execute(
                        `INSERT INTO results (rollNumber, studentName, motherName) 
                         VALUES (?, ?, ?)`,
                        [rollNumber, studentName, motherName]
                    );
                    
                    results.success.push(student);
                } catch (error) {
                    results.failed.push({
                        student,
                        error: error.code === 'ER_DUP_ENTRY' 
                            ? "Duplicate roll number" 
                            : "Database error"
                    });
                }
            }

            // Start processing all new students
            processAllStudents();

            res.json({
                message: `Added ${results.success.length} students, ${results.failed.length} failed`,
                results
            });

        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error in /add-students:', error);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all students endpoint
app.get("/students", async (req, res) => {
    try {
        const connection = await db.getConnection();
        
        try {
            const [students] = await connection.execute(
                'SELECT rollNumber, studentName, motherName, percentage, (pdf IS NOT NULL) as hasPdf FROM results'
            );

            res.json({
                total: students.length,
                withResults: students.filter(s => s.percentage !== null).length,
                withPdf: students.filter(s => s.hasPdf).length,
                students: students
            });

        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error in /students:', error);
        res.status(500).json({ error: "Server error" });
    }
});

// Manually trigger processing for all students
app.post("/process-all", async (req, res) => {
    try {
        console.log('Manual trigger: Starting to process all students...');
        
        const connection = await db.getConnection();
        try {
            // Get all students without results
            const [students] = await connection.execute(
                'SELECT rollNumber, studentName, motherName FROM results WHERE percentage IS NULL'
            );
            
            console.log(`Found ${students.length} students without results`);
            
            // Process each student
            for (const student of students) {
                console.log(`Processing ${student.rollNumber}...`);
                await processAndStoreStudent(student.rollNumber, student.motherName, connection);
                // Wait 2 seconds between requests
                await delay(2000);
            }
            
            // Get updated status
            const [processed] = await connection.execute(
                'SELECT COUNT(*) as count FROM results WHERE percentage IS NOT NULL'
            );
            
            res.json({
                message: 'Processing completed',
                totalProcessed: processed[0].count,
                processedStudents: students.length
            });
            
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error in /process-all:', error);
        res.status(500).json({ error: "Server error" });
    }
});

// Get processing status
app.get("/status", async (req, res) => {
    try {
        const connection = await db.getConnection();
        try {
            const [total] = await connection.execute('SELECT COUNT(*) as count FROM results');
            const [processed] = await connection.execute('SELECT COUNT(*) as count FROM results WHERE percentage IS NOT NULL');
            const [withPdf] = await connection.execute('SELECT COUNT(*) as count FROM results WHERE pdf IS NOT NULL');
            const [pending] = await connection.execute('SELECT COUNT(*) as count FROM results WHERE percentage IS NULL');
            
            res.json({
                totalStudents: total[0].count,
                processedStudents: processed[0].count,
                withPdf: withPdf[0].count,
                pendingProcessing: pending[0].count
            });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error in /status:', error);
        res.status(500).json({ error: "Server error" });
    }
});

// Test database connection and table
app.get("/test-db", async (req, res) => {
    try {
        const connection = await db.getConnection();
        try {
            // Test database connection
            const [dbTest] = await connection.execute('SELECT 1');
            console.log('Database connection test:', dbTest);

            // Test table exists
            const [tables] = await connection.execute('SHOW TABLES LIKE "results"');
            console.log('Tables like results:', tables);

            if (tables.length === 0) {
                return res.status(500).json({ error: "Results table not found" });
            }

            // Test table structure
            const [columns] = await connection.execute('DESCRIBE results');
            console.log('Table structure:', columns);

            // Test sample query
            const [sample] = await connection.execute('SELECT * FROM results LIMIT 1');
            console.log('Sample row:', sample);

            res.json({
                connection: "success",
                tableExists: tables.length > 0,
                columns: columns,
                sampleData: sample
            });

        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({ 
            error: "Database error",
            details: error.message,
            code: error.code
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🚀`);
});
