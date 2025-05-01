// utils/fetchResults.js
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models/db');

const fetchResultsFromSite = async () => {
  const url = 'https://mahresult.nic.in/sscmarch2024/sscresultviewmarch24.asp';

  const headers = {
    "User-Agent": "Mozilla/5.0",
    "Content-Type": "application/x-www-form-urlencoded",
    "Origin": "https://mahresult.nic.in",
    "Referer": "https://mahresult.nic.in/sscmarch2024/sscmarch2024.htm"
  };

  const [students] = await db.query('SELECT seat_number, mother_name FROM student_results');

  const getMarksSafely = ($, subjectName) => {
    const td = $(`td:contains("${subjectName}")`).filter(function () {
      return $(this).text().toUpperCase().includes(subjectName.toUpperCase());
    }).first();
    const mark = parseInt(td.next().text().trim());
    return isNaN(mark) ? 0 : mark;
  };

  const getDivisionSafely = ($) => {
    const divisionText = $('p:contains("Division")').text();
    const divisionMatch = divisionText.match(/Division\s*:\s*(.*)/);
    return divisionMatch ? divisionMatch[1].trim() : '';
  };

  for (let student of students) {
    const formData = new URLSearchParams();
    formData.append('regno', student.seat_number);
    formData.append('mname', student.mother_name);

    try {
      const response = await axios.post(url, formData.toString(), { headers });
      const $ = cheerio.load(response.data);

        // Extract total_marks from the "Total Marks" row
        const totalMarksText = $('td:contains("Total Marks")').next().text().trim();
        const totalMarksMatch = totalMarksText.match(/(\d+)(?:\+|$)/);  // Capture number before "+" or end of string
        const totalMarks = totalMarksMatch ? parseInt(totalMarksMatch[1]) : 0;

        // Extract percentage from the "Percentage" row
        const percentageText = $('td:contains("Percentage")').next().text().trim();
        const percentage = parseFloat(percentageText.replace(/[^\d.]/g, '').trim());

         // Extract result_status directly from the "Result" row (no conversion)
        const resultStatusText = $('td:contains("Result")').next().text().trim();
        const resultStatus = resultStatusText;  // Directly use the result text ('PASS' or 'FAIL')
        
        // Extract additional marks from the "Total Marks" row
        const additionalMarksText = $('td:contains("Total Marks")').next().text().trim();
        const additionalMatch = additionalMarksText.match(/\+(\d+)/);
        const additionalMarks = additionalMatch ? parseInt(additionalMatch[1]) : 0;

        // Extract division from the HTML
        const division = getDivisionSafely($);

      const studentResult = {
        seatNumber: student.seat_number,
        motherName: student.mother_name,
        additionalMarks: additionalMarks,
        totalMarks: totalMarks,
        percentage: percentage,
        resultStatus: resultStatus,
        division: division,
        marks: {
          marathi: getMarksSafely($, "MARATHI"),
          hindi: getMarksSafely($, "HINDI"),
          english: getMarksSafely($, "ENGLISH"),
          mathematics: getMarksSafely($, "MATHEMATICS"),
          science: getMarksSafely($, "SCIENCE"),
          socialScience: getMarksSafely($, "SOCIAL SCIENCE")
        }
      };

      await db.query(
        'UPDATE student_results SET marathi = ?, hindi = ?, english = ?, mathematics = ?, science = ?, social_science = ?, additional_marks = ?, total_marks = ?, percentage = ?, result_status = ?, division = ? WHERE seat_number = ? AND mother_name = ?',
        [
          studentResult.marks.marathi,
          studentResult.marks.hindi,
          studentResult.marks.english,
          studentResult.marks.mathematics,
          studentResult.marks.science,
          studentResult.marks.socialScience,
          studentResult.additionalMarks,
          studentResult.totalMarks,
          studentResult.percentage,
          studentResult.resultStatus,
          studentResult.division,
          studentResult.seatNumber,
          studentResult.motherName
        ]
      );

      console.log(`✅ Results updated for ${studentResult.seatNumber}`);
    } catch (error) {
      console.error(`❌ Error for ${student.seat_number}:`, error.message);
    }
  }
};

module.exports = { fetchResultsFromSite };
