require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const AWS = require('aws-sdk');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure cloud accessibility
// Import the Google Cloud client library
const { Storage } = require('@google-cloud/storage');

// Initialize a Google Cloud Storage client
const storage = new Storage({
  projectId: process.env.result-455905, // Replace with your Google Cloud project ID
  keyFilename: process.env.GCP_KEY_FILE // Path to your service account key file
});

// Example: Access a specific bucket
const bucketName = process.env.GCP_BUCKET_NAME; // Replace with your bucket name
const bucket = storage.bucket(bucketName);

// Example function to upload a file to the bucket
async function uploadFile(filePath, destination) {
  try {
    await bucket.upload(filePath, {
      destination: destination,
    });
    console.log(`${filePath} uploaded to ${bucketName}/${destination}`);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

// Example usage:
// uploadFile('local/path/to/file.txt', 'remote/destination/path.txt');


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
    "Cookie": "ASPSESSIONIDSQQSQTBS=HCBNDHOAMGGFIAEPOHBMJDGA; ASPSESSIONIDAASBRCRT=DENFGHOAFPPIAPEHNJAPMLBO; ASPSESSIONIDQQTQSTBS=MAKHDNKALLCBBBFHGFCHCEDG; ASPSESSIONIDACQCSDTT=OIDPKIOAEDDDMIACEIMOPKLB; ASPSESSIONIDSQTTRSBT=HKFHGNKAPGGGBEABDGPCJLCJ; ASPSESSIONIDSQSQTTAS=PLFNAGABFHLMDDCHKFGONEEL; ASPSESSIONIDQQSCSBRR=JMNPNKOAOINAOALGMMACOHJA",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1"
};

// Function to fetch result from the website
async function fetchResult(seatNumber, motherName) {
    try {
        console.log(`Attempting to fetch result for Seat Number: ${seatNumber}, Mother's Name: ${motherName}`);

        const postData = `regno=${seatNumber}&mname=${motherName}`;
        
        const response = await axios.post(
            "https://mahresult.nic.in/sscmarch2024/sscresultviewmarch24.asp",
            postData,
            {
                headers: {
                    ...HEADERS,
                    'Content-Length': Buffer.byteLength(postData, 'utf8') // Ensure correct content length
                },
                timeout: 10000,
                validateStatus: () => true // Accept all responses
            }
        );

        const html = response.data;
        const $ = cheerio.load(html);

        // Extract student information
        const studentInfo = $('#cardbody .card-body');
        const studentName = studentInfo.find('p:contains("Candidate Name")').next().text().trim();
        const seatNo = studentInfo.find('p:contains("Seat Number")').next().text().trim();
        const division = studentInfo.find('p:contains("Division")').next().text().trim();
        const extractedMotherName = studentInfo.find('p:contains("Mother\'s Name")').next().text().trim();

        // Ensure we are selecting the correct marks table
        const marksTable = $('#table table').first();
        const marks = {
            student_name: studentName,
            mother_name: extractedMotherName,
            seat_number: seatNo,
            division: division,
            marathi: parseInt(marksTable.find('td:contains("MARATHI")').next().text().trim()) || 0,
            hindi: parseInt(marksTable.find('td:contains("HINDI")').next().text().trim()) || 0,
            english: parseInt(marksTable.find('td:contains("ENGLISH")').next().text().trim()) || 0,
            mathematics: parseInt(marksTable.find('td:contains("MATHEMATICS")').next().text().trim()) || 0,
            science: parseInt(marksTable.find('td:contains("SCIENCE & TECHNOLOGY")').next().text().trim()) || 0,
            social_science: parseInt(marksTable.find('td:contains("SOCIAL SCIENCES")').next().text().trim()) || 0
        };

        // Extract total and additional marks
        const totalMarksText = marksTable.find('td:contains("Total Marks")').next().text().trim();
        const totalMarksParts = totalMarksText.split('+').map(t => t.trim());

        marks.total_marks = totalMarksParts[0] ? parseInt(totalMarksParts[0]) : 0;
        marks.additional_marks = totalMarksParts[1] ? parseInt(totalMarksParts[1]) : 0;
        marks.result_status = marksTable.find('td:contains("Result")').next().text().trim();

        // Extract percentage safely
        const percentageElement = marksTable.find('td:contains("% Percentage")').next();
        const percentageText = percentageElement.text().trim().replace(/[^\d.]/g, '');
        const percentage = percentageText ? parseFloat(percentageText) : null;
        console.log(marks);
        console.log(totalMarksText);
        console.log(percentage);
        // Validation Checks
        if (!studentName || !seatNo || !division || !extractedMotherName) {
            console.warn(`Incomplete student info for ${seatNumber}:`, {
                studentName,
                seatNo,
                division,
                extractedMotherName
            });
            return { percentage: null, html: null, marks: null };
        }

        if (isNaN(percentage)) {
            console.warn(`Invalid percentage format for ${seatNumber}: ${percentageText}`);
            return { percentage: null, html: null, marks: null };
        }

        return { 
            percentage,
            html,
            marks
        };

    } catch (error) {
        console.error(`Error fetching result for ${seatNumber}:`, error.message);
        return { percentage: null, html: null, marks: null };
    }
}

module.exports = fetchResult;

// Function to upload PDF to S3
async function uploadToS3(pdfBuffer, seatNumber) {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `results/${seatNumber}_result.pdf`,
            Body: pdfBuffer,
            ContentType: 'application/pdf',
            ACL: 'public-read'
        };

        const data = await s3.upload(params).promise();
        return data.Location;
    } catch (error) {
        console.error('Error uploading to S3:', error);
        throw error;
    }
}

// Function to generate PDF from database data
async function generatePdfFromDatabase(seatNumber, motherName) {
    try {
        const connection = await db.getConnection();
        try {
            const [student] = await connection.execute(
                'SELECT * FROM student_results WHERE seat_number = ? AND mother_name = ?',
                [seatNumber, motherName]
            );

            if (student.length === 0) {
                throw new Error('Student not found');
            }

            // Create HTML template using database data
            const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta name="description" content="">
                <meta name="author" content="">
                <title>SSC Result 2025::MSBSHSE, PUNE</title>
                
                <!-- Bootstrap core CSS -->
                <link href="../css/bootstrap.min.css" rel="stylesheet">
                <link href="../css/main.css" rel="stylesheet">
                
                <style>
                    body {
                        font-family: 'Times New Roman', serif;
                        font-size: 14px;
                    }
                    .container {
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                    .card {
                        border: none !important;
                        box-shadow: none !important;
                    }
                    .card-body {
                        padding: 10px !important;
                    }
                    .table {
                        width: 100% !important;
                        margin-bottom: 1rem !important;
                        border-collapse: collapse !important;
                    }
                    .table th, .table td {
                        padding: 0.5rem !important;
                        vertical-align: middle !important;
                        border: 1px solid #ddd !important;
                    }
                    .table-striped tbody tr:nth-of-type(odd) {
                        background-color: rgba(0,0,0,.05) !important;
                    }
                    .success {
                        background-color: #D6EEEE !important;
                    }
                    .danger {
                        color: #a94442 !important;
                        background-color: #f2dede !important;
                    }
                    .footer {
                        margin-top: 20px !important;
                        font-size: 12px !important;
                        font-family: 'Times New Roman', serif !important;
                    }
                    .hidden-print {
                        display: none !important;
                    }
                    #imglogo {
                        margin-top: -3% !important;
                        width: 100px !important;
                        height: auto !important;
                    }
                    #mhboardbanner {
                        margin-top: -3% !important;
                    }
                    #examresicon {
                        margin-top: -4% !important;
                    }
                    #togglenav {
                        margin-top: -3% !important;
                        display: none !important;
                    }
                    #movup {
                        margin-top: 4% !important;
                    }
                    #hscexamdiv {
                        margin-top: 4% !important;
                    }
                    #movright {
                        margin-left: 50% !important;
                    }
                    #printdiv {
                        display: none !important;
                    }
                    .navbar {
                        display: none !important;
                    }
                    .logo {
                        padding-left: 5% !important;
                    }
                    #mhboardbannerin1 {
                        margin-top: -6% !important;
                    }
                    .btb {
                        padding: 10px !important;
                    }
                    .btb img {
                        width: 100px !important;
                        height: auto !important;
                    }
                    .cont {
                        margin-top: -1% !important;
                    }
                    #cardbody {
                        margin-top: -13% !important;
                    }
                    #res {
                        background: transparent !important;
                    }
                    #table {
                        margin-top: 20px !important;
                    }
                    .table-hover tbody tr:hover {
                        background-color: rgba(0,0,0,.075) !important;
                    }
                    .table-bordered {
                        border: 1px solid #ddd !important;
                    }
                    .table-hover {
                        cursor: default !important;
                    }
                    .table-striped {
                        background-color: #fff !important;
                    }
                    .table-bordered th, .table-bordered td {
                        border: 1px solid #ddd !important;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div id="header" class="header">
                        <div class="row">
                            <div id="imglogo" class="col-sm-2" style="margin-top: -3%;">
                                <div class="card border-0">
                                    <div class="card-body">
                                        <img src="../img/mahastateedu.gif">
                                    </div>
                                </div>
                            </div>
                            <div id="mhboardbanner" class="col-sm-10" style=" margin-top:-3%;">
                                <div id="mhboardbannerin" class="card border-0">
                                    <div class="card-body">
                                        <div class="logo col-lg-10 col-md-10 col-sm-10">
                                            <p style="font-size:1.05em;">MAHARASHTRA STATE BOARD OF SECONDARY AND HIGHER SECONDARY EDUCATION, PUNE</p>
                                        </div>
                                        <div id="mhboardbannerin1" class="logo col-lg-10 col-md-10 col-sm-10">
                                            <p style="font-size:1em;"><b>SSC Examination June- 2025 RESULT</b></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="examresicon" style=" margin-top:-4%;" class="btb col-sm-12 row">
                            <a class="col-3" href="http://results.gov.in" target="_blank">
                                <img src="../img/icon01.gif">
                            </a>
                            <div class="col-9 float-end">
                                <p style="font-size:.85em;">Brought to you by: <a style="text-decoration: none" href="http://www.nic.in/">NATIONAL INFORMATICS CENTRE</a></p>
                            </div>
                        </div>
                    </div>
                    <div style=" margin-top:-1%;" class="cont container">
                        <div id="hscexamdiv" style=" margin-top:4%;"><center><strong>SSC Examination June- 2025 RESULT</strong></center></div>
                        <div id="movup" class="row">
                            <div class="col-sm-12">
                                <div class="card border-0">
                                    <div class="card-body">
                                        <div class="cont container" id="container">
                                            <div class="row">
                                                <div style=" margin-top:-13%;" id="cardbody" class="col-sm-10">
                                                    <div id="res" style="background: transparent;" class="card border-0">
                                                        <div style=" margin-top:-1.5%;" class="card-body">
                                                            <p style="text-align: left; margin-left:-5%;margin-top: 1em ;"><b>Candidate Name</b>: &nbsp; ${student[0].student_name}</p>
                                                            <p style="text-align: left; margin-left:-5%;margin-top: -0.8em ;"><b>Mother's Name</b>: &nbsp; ${motherName}</p>
                                                            <div id="movright">
                                                                <p style="text-align: left; margin-left:-5%;margin-top: -0.8em ;"><b>Seat Number</b>: &nbsp; ${seatNumber}</p>
                                                                <p style="text-align: left; margin-left:-5%;margin-top: -0.8em ;"><b>Division</b>: &nbsp; ${student[0].division || 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="table">
                                            <table class="table table-striped table-bordered table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Subjects Code</th>
                                                        <th>Subject Name</th>
                                                        <th colspan="2">Marks Obtained</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>01</td>
                                                        <td>MARATHI (1ST LANG)</td>
                                                        <td colspan="2">${student[0].marathi || 0}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>15</td>
                                                        <td>HINDI (2/3 LANG)</td>
                                                        <td colspan="2">${student[0].hindi || 0}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>17</td>
                                                        <td>ENGLISH (2/3 LANG)</td>
                                                        <td colspan="2">${student[0].english || 0}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>71</td>
                                                        <td>MATHEMATICS</td>
                                                        <td colspan="2">${student[0].mathematics || 0}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>72</td>
                                                        <td>SCIENCE &amp; TECHNOLOGY</td>
                                                        <td colspan="2">${student[0].science || 0}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>73</td>
                                                        <td>SOCIAL SCIENCES</td>
                                                        <td colspan="2">${student[0].social_science || 0}</td>
                                                    </tr>
                                                    <tr class="success" style="background-color: #D6EEEE;">
                                                        <td>£&nbsp;Percentage</td>
                                                        <td>£&nbsp;${student[0].percentage}</td>
                                                        <td style="text-align:left"><b>Total Marks</b></td>
                                                        <td>$&nbsp;${student[0].total_marks}+${student[0].additional_marks}</td>
                                                    </tr>
                                                    <tr class="success" style="background-color: #D6EEEE;">
                                                        <td>Result</td>
                                                        <td>${student[0].result_status}</td>
                                                        <td style="text-align:left"><b>Out of</b></td>
                                                        <td style="text-align:left"><b>500</b></td>
                                                    </tr>
                                                    <tr class="danger">
                                                        <td colspan="4" style="text-align:center;font-style:italic">$ - Additional sport/art marks.</td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="4">£-Indicates total marks and Percentage calculated on the basis of "Best of 5" criteria</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="margin-top: -.5em;" id="notdisplay" class=" footer col-xs-12">
                        <p style="margin-top: 0.5em" align="justify"><font face="Times New Roman" size="1"> <b>Disclaimer</b>
                        Neither NIC nor Maharashtra State Board of Secondary and Higher Secondary 
                        Education, Pune is responsible for any inadvertent error that may have 
                        crept in the results being published online. The results published on 
                        net are for immediate information only. These cannot be treated as original 
                        statement of mark,please verify the information from original statement 
                        of marks issued by the Board separately and available at the time of declaration 
                        with the respective School.</font> </p>
                        <p style="margin-top: -1em ;margin-bottom: 0.5em ;" align="justify"><font face="Times New Roman" size="1"> <b>Note for CIS candidates</b>
                        It is obligatory for candidates admitted for class improvement to give their option
                        within one month from the date on which marklists have been distributed.After that
                        the board marklist with option will be given within the period of six months after
                        paying extra charges.If no application with option is received within 6 months the
                        class improvement performance will be considered as "Cancelled" and previous
                        performance will be taken into account by divisional board.</font></p>
                        <div style="margin-top:2.2em"><center><font face="Times New Roman" size="2">Hosted By National 
                        Informatics Centre (NIC). Data Provided By MSBSHSE, Pune</font></center><font face="Times New Roman" size="2"> </font></div>
                    </div>
                </div>
            </body>
            </html>
            `;

            // Generate PDF using Puppeteer
            const browser = await puppeteer.launch({ 
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            
            await page.setViewport({ width: 1200, height: 2000 });
            
            await page.setContent(html, {
                waitUntil: 'networkidle0'
            });

            const pdfBuffer = await page.pdf({ 
                format: "A4",
                printBackground: true,
                margin: {
                    top: "20px",
                    bottom: "20px",
                    left: "20px",
                    right: "20px"
                },
                preferCSSPageSize: true,
                displayHeaderFooter: false
            });

            await browser.close();
            return pdfBuffer;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error generating PDF:', error.message);
        throw error;
    }
}

// Function to fetch and update results for all existing students
async function processAllStudents() {
    try {
        const connection = await db.getConnection();
        try {
            // Get all students without results
            const [students] = await connection.execute(
                'SELECT seat_number, mother_name, student_name, division FROM student_results WHERE percentage IS NULL'
            );

            console.log(`Found ${students.length} students to process`);

            let processed = 0;
            let failed = 0;

            // Process each student with a delay between requests
            for (const student of students) {
                try {
                    const { seat_number, mother_name } = student;
                    
                    // Fetch result from website
                    console.log(`Fetching result for ${seat_number}... debuging`);
                    const { percentage, html, marks } = await fetchResult(seat_number, mother_name);
                    
                    if (!percentage || !html || !marks) {
                        console.log(`No result available for ${seat_number}`);
                        failed++;
                        continue;
                    }

                    // Insert new result
                    await connection.execute(
                        `INSERT INTO student_results (
                            seat_number, student_name, mother_name,
                            marathi, hindi, english, mathematics, science, social_science,
                            total_marks, additional_marks, percentage, result_status, division
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            seat_number,
                            marks.student_name,
                            mother_name,
                            marks.marathi,
                            marks.hindi,
                            marks.english,
                            marks.mathematics,
                            marks.science,
                            marks.social_science,
                            marks.total_marks,
                            marks.additional_marks,
                            percentage,
                            marks.result_status,
                            student.division
                        ]
                    );

                    // Generate PDF and upload to S3
                    const pdfBuffer = await generatePdfFromDatabase(seat_number, mother_name);
                    const s3Url = await uploadToS3(pdfBuffer, seat_number);

                    // Update the PDF URL in the database
                    await connection.execute(
                        'UPDATE student_results SET pdf_url = ? WHERE seat_number = ?',
                        [s3Url, seat_number]
                    );

                    processed++;
                    console.log(`Successfully processed ${seat_number}`);

                    // Add a delay between requests
                    await delay(2000);
                } catch (error) {
                    console.error(`Error processing ${seat_number}:`, error.message);
                    failed++;
                }
            }

            console.log(`Processing complete. Processed: ${processed}, Failed: ${failed}`);
            return { processed, failed };
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error in processAllStudents:', error);
        throw error;
    }
}

// API endpoint to process all students
app.post("/process-all-students", async (req, res) => {
    try {
        const result = await processAllStudents();
        res.json({
            message: "Batch processing completed",
            ...result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to get student result
app.get("/result/:seatNumber", async (req, res) => {
    try {
        const { seatNumber } = req.params;
        
        const connection = await db.getConnection();
        try {
            const [student] = await connection.execute(
                'SELECT * FROM student_results WHERE seat_number = ?',
                [seatNumber]
            );

            if (student.length === 0) {
                return res.status(404).json({ error: "Result not found" });
            }

            res.json(student[0]);
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Error fetching result:', error);
        res.status(500).json({ error: "Failed to fetch result" });
    }
});

// Initialize database and start server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    try {
        const connection = await db.getConnection();
        try {
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS student_results (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    seat_number VARCHAR(20) NOT NULL UNIQUE,
                    student_name VARCHAR(100) NOT NULL,
                    mother_name VARCHAR(100) NOT NULL,
                    division VARCHAR(50),
                    marathi INT,
                    hindi INT,
                    english INT,
                    mathematics INT,
                    science INT,
                    social_science INT,
                    additional_marks INT DEFAULT 0,
                    total_marks INT GENERATED ALWAYS AS (marathi + hindi + english + mathematics + science + social_science + additional_marks) STORED,
                    percentage DECIMAL(5,2) GENERATED ALWAYS AS (total_marks / 6) STORED,
                    result_status ENUM('Pass', 'Fail') GENERATED ALWAYS AS (CASE WHEN percentage >= 35 THEN 'Pass' ELSE 'Fail' END) STORED,
                    pdf_url VARCHAR(255) DEFAULT NULL
                )
            `);

            console.log('Database tables created/verified');

            // Start processing all students when server starts
            console.log('Starting to process all students...');
            await processAllStudents();

        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Failed to initialize database:', error.message);
    }
});
