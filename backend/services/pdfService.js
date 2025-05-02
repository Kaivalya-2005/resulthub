// const puppeteer = require('puppeteer-core');
const { Storage } = require('@google-cloud/storage');
const db = require('../models/db');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    keyFilename: process.env.GCP_KEY_FILE
});

const bucketName = process.env.GCP_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

// Fixed PDF generation with proper buffer handling
const generatePDF = async (student) => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process'
        ]
    });
    
    const page = await browser.newPage();
    const bootstrapCSS = fs.readFileSync(path.resolve(__dirname, '../public/css/bootstrap.min.css'), 'utf-8');
    const mainCSS = fs.readFileSync(path.resolve(__dirname, '../public/css/main.css'), 'utf-8');

    // Simplified HTML template with proper error handling
    let html = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>${bootstrapCSS}${mainCSS}</style>
    </head>
    <body>
        <!-- Simplified body content with null checks -->
        <div class="container">
            <h2>${student.student_name || 'Student Name Not Available'}</h2>
            <table class="table">
                ${student.subjects.map(sub => `
                    <tr>
                        <td>${sub.code}</td>
                        <td>${sub.name}</td>
                        <td>${sub.marks}</td>
                    </tr>
                `).join('')}
            </table>
        </div>
    </body>
    </html>`;

    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    
    // Generate PDF buffer directly
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', bottom: '20px' }
    });

    await browser.close();
    return pdfBuffer;
};

// Improved upload function with error handling
const uploadToGCS = async (buffer, seatNumber) => {
    try {
        const filename = `results/${seatNumber}-${Date.now()}.pdf`;
        const file = bucket.file(filename);
        
        await file.save(buffer, { contentType: 'application/pdf' });
        return file.publicUrl();
    } catch (error) {
        console.error('Upload failed:', error);
        return null;
    }
};

// Main processor with proper async handling
const generateAndStorePDFs = async () => {
    try {
        const [students] = await db.query(`
            SELECT * 
            FROM student_results 
            WHERE pdf_url IS NULL
            LIMIT 10
        `);

        for (const student of students) {
            try {
                const pdfBuffer = await generatePDF(student);
                const pdfUrl = await uploadToGCS(pdfBuffer, student.seat_number);
                
                if (pdfUrl) {
                    await db.query(
                        'UPDATE student_results SET pdf_url = ? WHERE seat_number = ?',
                        [pdfUrl, student.seat_number]
                    );
                }
            } catch (error) {
                console.error(`Failed to process ${student.seat_number}:`, error);
            }
        }
    } catch (error) {
        console.error('Database error:', error);
    }
};

module.exports = { generateAndStorePDFs };
