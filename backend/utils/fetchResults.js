// utils/fetchResults.js
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models/db');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const startPollingUntilSuccess = async () => {
  const maxAttempts = 1000;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      console.log(`🔄 Attempt ${attempt + 1}: Checking if result site is live...`);
      await fetchResultsFromSite();
      console.log("✅ Result site is live and results have been fetched.");
      break; // Exit loop if successful
    } catch (err) {
      console.log(`⚠️ Site not live yet or failed to fetch: ${err.message}`);
      await sleep(15000); // Wait 15 seconds before retrying
      attempt++;
    }
  }

  if (attempt === maxAttempts) {
    console.log("❌ Max attempts reached. Site still not live.");
  }
};

const fetchResultsFromSite = async () => {
  const [students] = await db.query(`
    SELECT seat_number, mother_name 
    FROM student_results 
    WHERE total_marks IS NULL 
  `);
  
  if (students.length === 0) {
    console.log('✅ All student results already fetched.');
    return;
  }

  for (let student of students) {
    const url = `https://sscresult-4.mahahsscboard.in/api/result/getResult/${student.seat_number}`;

    const headers = {

      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:138.0) Gecko/20100101 Firefox/138.0",
      "Content-Type": "application/json; charset=utf-8",
      "Origin": "https://sscresult.mahahsscboard.in",
      "Referer": "https://sscresult.mahahsscboard.in/"
    };

    try {
      const payload = {
        mother: student.mother_name
      };

      const response = await axios.post(url, payload, { headers });
      const resultData = response.data?.result;

      if (!resultData) {
        console.error(`❌ No result found for ${student.seat_number}`);
        continue;
      }

      // Convert percentage from integer (6960) to decimal (69.60)
      const percentage = parseFloat(resultData.perc) / 100;

      const studentResult = {
        marathi: parseInt(resultData.mark2),
        hindi: parseInt(resultData.mark3),
        english: parseInt(resultData.mark1),
        mathematics: parseInt(resultData.mark4),
        science: parseInt(resultData.mark5),
        socialScience: parseInt(resultData.mark6),
        totalMarks: parseInt(resultData.total),
        percentage: percentage,
        resultStatus: resultData.result === 'P' ? 'PASS' : 'FAIL',
        division: resultData.div_name
      };

      await db.query(
        'UPDATE student_results SET marathi = ?, hindi = ?, english = ?, mathematics = ?, science = ?, social_science = ?, total_marks = ?, percentage = ?, result_status = ?, division = ? WHERE seat_number = ? AND mother_name = ?',
        [
          studentResult.marathi,
          studentResult.hindi,
          studentResult.english,
          studentResult.mathematics,
          studentResult.science,
          studentResult.socialScience,
          studentResult.totalMarks,
          studentResult.percentage,
          studentResult.resultStatus,
          studentResult.division,
          student.seat_number,
          student.mother_name
        ]
      );

      console.log(`✅ Results updated for ${student.seat_number} with ${percentage}%`);

    } catch (error) {
      console.error(`❌ Error for ${student.seat_number}:`, error.message);
      await sleep(1000);
    }
  }
};

module.exports = { startPollingUntilSuccess };
