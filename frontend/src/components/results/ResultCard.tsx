import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import html2pdf from 'html2pdf.js/dist/html2pdf.min';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface ResultCardProps {
  student: {
    seat_number: string;
    student_name: string;
    mother_name: string;
    division: string;
    marathi: number;
    hindi: number;
    english: number;
    mathematics: number;
    science: number;
    social_science: number;
    additional_marks: number;
    total_marks: number;
    percentage: number;
    pdf_url: string;
    result_status: string;
  };
}

function getResultHTML(student: ResultCardProps['student']) {
  return `
    <div class="page">
      <div class="header" align="center">
        <a href="https://imgbb.com/" class="logo-link">
          <img src="https://i.ibb.co/bMbKBhw3/logo.jpg" alt="logo" border="0" />
        </a>
        <div class="header-titles" align="center">
          <div class="title">
            MAHARASHTRA STATE BOARD<br> OF SECONDARY AND HIGHER<br>
            SECONDARY EDUCATION, PUNE
          </div><br><br>
          <div class="board-title">
            SSC Examination March- 2025<br/>
            <span style="margin-left: 108px;">RESULT<br /><br><br><br><br>
          </div>
        </div>
      </div>
      <div class="info-row"><span class="label">Candidate Name:</span> ${student.student_name}</div><br>
      <div class="info-row"><span class="label">Mother's Name:</span> ${student.mother_name}</div>
      <div class="info-row"><span class="label">Seat Number:</span> ${student.seat_number}</div><br>
      <div class="info-row"><span class="label">Division:</span> ${student.division}</div>
      <div class="table-section">
        <table>
          <thead>
            <tr>
              <th style="width:120px;">Subjects<br/>Code</th>
              <th>Subject Name</th>
              <th style="width:180px;">Marks Obtained</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="center">01</td>
              <td>MARATHI (1ST LANG)</td>
              <td class="center">${student.marathi.toString().padStart(3, "0")}</td>
            </tr>
            <tr>
              <td class="center">15</td>
              <td>HINDI (2/3 LANG)</td>
              <td class="center">${student.hindi.toString().padStart(3, "0")}</td>
            </tr>
            <tr>
              <td class="center">17</td>
              <td>ENGLISH (2/3 LANG)</td>
              <td class="center">${student.english.toString().padStart(3, "0")}</td>
            </tr>
            <tr>
              <td class="center">71</td>
              <td>MATHEMATICS</td>
              <td class="center">${student.mathematics.toString().padStart(3, "0")}</td>
            </tr>
            <tr>
              <td class="center">72</td>
              <td>SCIENCE AND TECHNOLOGY</td>
              <td class="center">${student.science.toString().padStart(3, "0")}</td>
            </tr>
            <tr>
              <td class="center">73</td>
              <td>SOCIAL STUDIES</td>
              <td class="center">${student.social_science.toString().padStart(3, "0")}</td>
            </tr>
            <tr class="success">
              <td>£ Percentage</td>
              <td>£ ${student.percentage}</td>
              <td>Total Marks: ${student.total_marks}</td>
            </tr>
            <tr class="success">
              <td>Result</td>
              <td>${student.result_status}</td>
              <td>Out of 600</td>
            </tr>
            <tr>
            <td colspan="3" style="height:24px; border:none; color:#888; text-align:center;">
           <i>$-Additional sport/arts marks</i>
           </td>
          </tr>
            </tr>
            <tr>
            <td colspan="3" style="height:24px; border:none;">£-Indicates total marks and Percentage calculated on the basis of "Best of 5" criteria
            </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;" />
      
      <div class="disclaimer">
        <b>Disclaimer</b> Neither NIC nor Maharashtra State Board of Secondary and Higher Secondary Education, Pune is responsible for any inadvertent error that may have crept in the results being published online. The results published on net are for immediate information only. These cannot be treated as original statement of mark, please verify the information from original statement of marks issued by the Board separately and available at the time of declaration with the respective School.
      </div>
      <div class="note">
        <b>Note for CIS candidates</b> It is obligatory for candidates admitted for class improvement to give their option within one month from the date on which marklists have been distributed. After that the board marklist with option will be given within the period of six months after paying extra charges. If no application with option is received within 6 months the class improvement performance will be considered as "Cancelled" and previous performance will be taken into account by divisional board.
      </div>
      <div class="hosted">
        Hosted By National Informatics Centre (NIC). Data Provided By MSBSHSE, Pune
      </div>
    </div>
  `;
}

const ResultCard = ({ student }: ResultCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!printRef.current) return;
    setIsGeneratingPDF(true);
    
    try {
      const resultHTML = getResultHTML(student);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = resultHTML;
      document.body.appendChild(tempDiv);
      
      await html2pdf()
        .set({
          margin: 10,
          filename: `result_${student.seat_number}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(tempDiv)
        .save();
        
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const subjects = [
    { name: 'Marathi', marks: student.marathi },
    { name: 'Hindi', marks: student.hindi },
    { name: 'English', marks: student.english },
    { name: 'Mathematics', marks: student.mathematics },
    { name: 'Science', marks: student.science },
    { name: 'Social Science', marks: student.social_science }
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div className="space-y-2">
            <p className="text-gray-600 text-sm md:text-base">
              <span className="font-medium">Seat Number:</span> {student.seat_number}
            </p>
            <p className="text-gray-600 text-sm md:text-base">
              <span className="font-medium">Name:</span> {student.student_name}
            </p>
            <p className="text-gray-600 text-sm md:text-base">
              <span className="font-medium">Mother's Name:</span> {student.mother_name}
            </p>
          </div>
          <div className="mt-4 md:mt-0 p-4 bg-gray-50 rounded-lg">
            <p className="text-base md:text-lg font-medium">
              Total: <span className="font-bold">
                {student.total_marks}
                {student.additional_marks > 0 && 
                  <span className="text-green-600">{`+${student.additional_marks}`}</span>
                }
                /500
              </span>
            </p>
            <p className="text-base md:text-lg font-medium">
              Percentage: <span className="font-bold">{student.percentage}%</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <p className="text-base md:text-lg order-2 sm:order-1">
            Status: <span className={`font-bold ${
              student.result_status === 'PASS' ? 'text-green-600' : 'text-red-600'
            }`}>
              {student.result_status}
            </span>
          </p>
          <div className="flex flex-wrap gap-2 order-1 sm:order-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 sm:flex-none"
            >
              <Eye size={16} className="mr-1" />
              {showDetails ? 'Hide Details' : 'View Details'}
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleDownload}
              disabled={isGeneratingPDF}
              className="flex-1 sm:flex-none"
            >
              <Download size={16} className="mr-1" />
              {isGeneratingPDF ? 'Generating...' : 'Download Result'}
            </Button>
          </div>
        </div>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-3">Subject Performance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.name}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-medium text-sm md:text-base">{subject.name}</span>
                    <div className="flex items-center">
                      <div className="w-1 h-8 mr-3 rounded-full" 
                        style={{
                          backgroundColor: 
                            subject.marks >= 75 ? '#10B981' :
                            subject.marks >= 60 ? '#60A5FA' :
                            subject.marks >= 35 ? '#F59E0B' : '#EF4444'
                        }}
                      />
                      <span className="font-bold text-sm md:text-base">{subject.marks}/100</span>
                    </div>
                  </div>
                ))}
                {student.additional_marks > 0 && (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-md">
                    <span className="font-medium text-sm md:text-base">Additional Marks</span>
                    <span className="font-bold text-sm md:text-base text-green-600">
                      +{student.additional_marks}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default ResultCard;