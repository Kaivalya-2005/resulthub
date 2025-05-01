const db = require('../models/db');

const getResultDistribution = async () => {
    try {
        const [results] = await db.execute(`
            SELECT 
                CASE 
                    WHEN percentage >= 75 THEN 'Distinction'
                    WHEN percentage >= 60 THEN 'First Class'
                    WHEN percentage >= 45 THEN 'Second Class'
                    WHEN percentage >= 35 THEN 'Pass Class'
                    ELSE 'Fail'
                END as grade,
                COUNT(*) as count
            FROM student_results
            GROUP BY grade
            ORDER BY 
                CASE grade
                    WHEN 'Distinction' THEN 1
                    WHEN 'First Class' THEN 2
                    WHEN 'Second Class' THEN 3
                    WHEN 'Pass Class' THEN 4
                    WHEN 'Fail' THEN 5
                END
        `);
        
        return results;
    } catch (error) {
        console.error('Error getting result distribution:', error);
        throw error;
    }
};

const compareStudents = async (seatNumber1, motherName1, seatNumber2, motherName2) => {
    try {
        const [students] = await db.execute(`
            SELECT 
                seat_number,
                student_name,
                mother_name,
                marathi,
                hindi,
                english,
                mathematics,
                science,
                social_science,
                additional_marks,
                total_marks,
                percentage,
                result_status
            FROM student_results
            WHERE (seat_number = ? AND mother_name = ?) 
               OR (seat_number = ? AND mother_name = ?)
        `, [seatNumber1, motherName1, seatNumber2, motherName2]);

        if (students.length !== 2) {
            throw new Error('One or both students not found or mother names do not match');
        }

        return {
            student1 : students[0],
            student2 : students[1]
        };
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
};

// Function to get a single student's result
async function getStudentResult(seat_number, mother_name) {
    try {
        const [rows] = await db.query(
            "SELECT * FROM student_results WHERE seat_number = ? AND mother_name = ?",
            [seat_number, mother_name]
        );
        return rows[0]; // Return first matching row
    } catch (error) {
        console.error('Error fetching student result:', error);
        throw error;
    }
}

// Get the top 10 students
const getTopToppers = async () => {
    try {
      const [topToppers] = await db.execute(`
        SELECT student_name, total_marks, percentage ,additional_marks
        FROM student_results
        ORDER BY percentage DESC
        LIMIT 10
      `);
      return topToppers;
    } catch (error) {
      console.error('Error getting top 10 students:', error);
      throw error;
    }
};

// Function to get top 5 students for each subject
const getSubjectwiseToppers = async () => {
    try {
      // Query to get top 5 students for each subject
      const subjects = ['marathi', 'hindi', 'english', 'mathematics', 'science', 'social_science'];
      let subjectwiseTopperData = [];
  
      for (let subject of subjects) {
        const [topperData] = await db.execute(`
          SELECT student_name, ${subject} AS marks
          FROM student_results
          ORDER BY ${subject} DESC
          LIMIT 5
        `);
        
        subjectwiseTopperData.push({
          subject,
          topStudents: topperData
        });
      }
  
      return subjectwiseTopperData;
  
    } catch (error) {
      console.error('Error fetching subjectwise toppers:', error);
      throw error;
    }
};

module.exports = {
    getResultDistribution,
    compareStudents,
    getStudentResult,
    getTopToppers,
    getSubjectwiseToppers
};