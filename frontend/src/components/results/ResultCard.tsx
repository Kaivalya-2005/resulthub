import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Card from '../ui/Card';
import Button from '../ui/Button';

// Import images
// import mahastatuLogo from 'logo.jpg';
//import resultIcon from '../../assets/images/icon01.gif';

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
const mahastatuLogo = 'https://drive.google.com/uc?export=view&id=1DtrPyZAEnjAdtPt8hAD6x-S2GFB7yDqR';
function getResultHTML(student: ResultCardProps['student']) {
  try {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #fff; padding: 24px;">
      <div style="display: flex; align-items: center; margin-bottom: 18px;">
        <img src="${mahastatuLogo}" alt="Board Logo" style="max-width: 90px; margin-right: 18px;" />
        <div>
          <h1 style="font-size: 1.3em; margin: 0 0 4px 0;">MAHARASHTRA STATE BOARD OF SECONDARY AND HIGHER SECONDARY EDUCATION, PUNE</h1>
          <h2 style="font-size: 1.1em; margin: 0;">SSC Examination March- 2025 RESULT</h2>
        </div>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <img src="" alt="Result Icon" style="max-width: 36px; margin-right: 10px;" />
        <span>Brought to you by: <a href="http://www.nic.in/" style="color:#0056b3;text-decoration:none;">NATIONAL INFORMATICS CENTRE</a></span>
      </div>
      <div style="margin: 24px 0 12px 0; padding: 16px 18px; background: #f8f9fa; border-radius: 8px;">
        <p><b>Candidate Name:</b> ${student.student_name}</p>
        <p><b>Mother's Name:</b> ${student.mother_name}</p>
        <p><b>Seat Number:</b> ${student.seat_number}</p>
        <p><b>Division:</b> ${student.division}</p>
      </div>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 18px;">
        <thead>
          <tr>
            <th style="border: 1px solid #bbb; padding: 8px 10px;">Subjects Code</th>
            <th style="border: 1px solid #bbb; padding: 8px 10px;">Subject Name</th>
            <th style="border: 1px solid #bbb; padding: 8px 10px;" colspan="2">Marks Obtained</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #bbb; padding: 8px 10px;">01</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px;">MARATHI (1ST LANG)</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px;" colspan="2">${student.marathi.toString().padStart(3, "0")}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bbb; padding: 8px 10px;">15</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px;">HINDI (2/3 LANG)</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px;" colspan="2">${student.hindi.toString().padStart(3, "0")}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bbb; padding: 8px 10px;">17</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px;">ENGLISH (2/3 LANG)</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px;" colspan="2">${student.english.toString().padStart(3, "0")}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bbb; padding: 8px 10px;">71</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px;">MATHEMATICS</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px;" colspan="2">${student.mathematics.toString().padStart(3, "0")}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bbb; padding: 8px 10px;">72</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px;">SCIENCE &amp; TECHNOLOGY</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px;" colspan="2">${student.science.toString().padStart(3, "0")}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bbb; padding: 8px 10px;">73</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px;">SOCIAL SCIENCES</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px;" colspan="2">${student.social_science.toString().padStart(3, "0")}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #bbb; padding: 8px 10px; background: #e6f4ea; font-weight: bold;">£ Percentage</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px; background: #e6f4ea; font-weight: bold;">£ ${student.percentage}</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px; background: #e6f4ea; font-weight: bold;">Total Marks</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px; background: #e6f4ea; font-weight: bold;">
              $ ${student.total_marks.toString().padStart(3, "0")}+${student.additional_marks
      .toString()
      .padStart(2, "0")}
            </td>
          </tr>
          <tr>
            <td style="border: 1px solid #bbb; padding: 8px 10px; background: #e6f4ea; font-weight: bold;">Result</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px; background: #e6f4ea; font-weight: bold;">${student.result_status}</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px; background: #e6f4ea; font-weight: bold;">Out of</td>
            <td style="border: 1px solid #bbb; padding: 8px 10px; background: #e6f4ea; font-weight: bold;">500</td>
          </tr>
          <tr>
            <td colspan="4" style="border: 1px solid #bbb; padding: 8px 10px; background: #fff3cd; color: #856404; font-style: italic;">$ - Additional sport/art marks.</td>
          </tr>
          <tr>
            <td colspan="4" style="border: 1px solid #bbb; padding: 8px 10px;">£ - Indicates total marks and Percentage calculated on the basis of "Best of 5" criteria</td>
          </tr>
        </tbody>
      </table>
      <div style="font-size: 0.9em; color: #666; margin-top: 18px; line-height: 1.5;">
        <b>Disclaimer:</b> Neither NIC nor Maharashtra State Board of Secondary and Higher Secondary Education, Pune is responsible for any inadvertent error that may have crept in the results being published online. The results published on net are for immediate information only. These cannot be treated as original statement of mark, please verify the information from original statement of marks issued by the Board separately and available at the time of declaration with the respective School.
        <br><br>
        <b>Note for CIS candidates:</b> It is obligatory for candidates admitted for class improvement to give their option within one month from the date on which marklists have been distributed. After that the board marklist with option will be given within the period of six months after paying extra charges. If no application with option is received within 6 months the class improvement performance will be considered as "Cancelled" and previous performance will be taken into account by divisional board.
      </div>
      <div style="text-align: center; margin-top: 18px; font-size: 0.97em; color: #333;">
        Hosted By National Informatics Centre (NIC). Data Provided By MSBSHSE, Pune
      </div>
    </div>
    `;
  } catch (error) {
    console.error('Error generating HTML template:', error);
    throw new Error('Failed to generate result HTML');
  }
}

const ResultCard = ({ student }: ResultCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleDownload = async () => {
    if (isGeneratingPDF) return;

    setIsGeneratingPDF(true);
    try {
      // Preload the logo
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";  // Enable CORS
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load logo'));
        img.src = mahastatuLogo;
      });

      const template = document.createElement("div");
      template.style.position = "absolute";
      template.style.left = "-9999px";
      template.style.width = "800px";
      document.body.appendChild(template);

      template.innerHTML = getResultHTML(student);

      const canvas = await html2canvas(template, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        imageTimeout: 15000, // Increase timeout to 15 seconds
        onclone: (clonedDoc) => {
          // Force image loading in cloned document
          const images = clonedDoc.getElementsByTagName('img');
          for (let img of images) {
            img.crossOrigin = "anonymous";
          }
        }
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);

      document.body.removeChild(template);
      pdf.save(`${student.seat_number}_result.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
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
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <p className="text-gray-600">Seat Number: {student.seat_number}</p>
            <p className="text-gray-600">Candidate Name: {student.student_name}</p>
            <p className="text-gray-600">Mother's Name: {student.mother_name}</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <p className="text-lg font-medium">
              Total: <span className="font-bold">
                {student.total_marks}
                {student.additional_marks > 0 && `+${student.additional_marks}`}
                /500
              </span>
            </p>
            <p className="text-lg font-medium">
              Percentage: <span className="font-bold">{student.percentage}%</span>
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-lg">
            Status: <span className={`font-bold ${
              student.result_status === 'PASS' ? 'text-green-600' : 'text-red-600'
            }`}>
              {student.result_status}
            </span>
          </p>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              <Eye size={16} className="mr-1" />
              {showDetails ? 'Hide Details' : 'View Details'}
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              onClick={handleDownload}
              disabled={isGeneratingPDF}
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
              <h3 className="text-lg font-medium mb-3">Subject Marks</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((subject) => (
                  <div
                    key={subject.name}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                  >
                    <span className="font-medium">{subject.name}</span>
                    <span className="font-bold">{subject.marks}/100</span>
                  </div>
                ))}
                {student.additional_marks > 0 && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <span className="font-medium">Additional Marks</span>
                    <span className="font-bold">{student.additional_marks}</span>
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