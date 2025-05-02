import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import jsPDF from 'jspdf';
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

const ResultCard = ({ student }: ResultCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatMark = (mark: number) => {
    return mark.toString().padStart(3, '0');
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    let y = 20;

    // Set font style and color
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0); // Black color

    // Header with URL
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 255); // Blue color for URL
    doc.textWithLink('SSC Result 2024::MSBSHSE, PUNE', 14, y, { url: 'https://mahresult.nic.in/sscmarch2024/sscresultviewmarch24.asp' });
    doc.setTextColor(0, 0, 0); // Reset to black
    y += 10;

    // Board information
    doc.setFontSize(12);
    doc.text('MAHARASHTRA STATE BOARD OF SECONDARY AND HIGHER SECONDARY EDUCATION, PUNE', 14, y); 
    y += 8;
    doc.text('SSC Examination March-2024 RESULT', 14, y); 
    y += 10;

    // Candidate details
    doc.text(`Candidate Name: ${student.student_name.toUpperCase()}`, 14, y); 
    y += 6;
    doc.text(`Mother's Name: ${student.mother_name.toUpperCase()}`, 14, y); 
    y += 6;
    doc.text(`Seat Number: ${student.seat_number.toUpperCase()}`, 14, y); 
    y += 6;
    doc.text(`Division: ${student.division}`, 14, y); 
    y += 10;

    // Subjects header
    doc.setFontSize(12);
    doc.text('Subjects', 14, y); 
    y += 6;
    
    // Table header
    doc.setFontSize(10);
    doc.text('Code    Subject Name               Marks Obtained', 14, y);
    y += 6;
    
    // Horizontal line
    doc.line(14, y, 200, y);
    y += 4;

    // Subjects list - using dynamic data from props
    const subjects = [
      { code: '01', name: 'MARATHI (1ST LANG)', marks: formatMark(student.marathi) },
      { code: '15', name: 'HINDI (2/3 LANG)', marks: formatMark(student.hindi) },
      { code: '17', name: 'ENGLISH (2/3 LANG)', marks: formatMark(student.english) },
      { code: '71', name: 'MATHEMATICS', marks: formatMark(student.mathematics) },
      { code: '72', name: 'SCIENCE & TECHNOLOGY', marks: formatMark(student.science) },
      { code: '73', name: 'SOCIAL SCIENCES', marks: formatMark(student.social_science) }
    ];

    // Table rows
    subjects.forEach(subject => {
      doc.text(`${subject.code}    ${subject.name.padEnd(25, ' ')} ${subject.marks}`, 14, y);
      y += 6;
    });

    // Summary section
    y += 6;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black for symbols
    doc.text(`£ Percentage £ ${student.percentage}    Total Marks $ ${student.total_marks - student.additional_marks}+${student.additional_marks}`, 14, y); 
    y += 8;
    doc.text(`Result    ${student.result_status}    Out of 500`, 14, y); 
    y += 8;
    doc.text('$ - Additional sport/art marks.', 14, y); 
    y += 6;
    doc.text('£-Indicates total marks and Percentage calculated on the basis of "Best of 5" criteria', 14, y); 
    y += 10;

    // Disclaimer
    doc.setFontSize(9);
    doc.text('Disclaimer Neither NIC nor Maharashtra State Board of Secondary and Higher Secondary Education, Pune is', 14, y); 
    y += 4;
    doc.text('responsible for any inadvertent error that may have crept in the results being published online. The results', 14, y); 
    y += 4;
    doc.text('published on net are for immediate information only. These cannot be treated as original statement of', 14, y); 
    y += 4;
    doc.text('mark,please verify the information from original statement of marks issued by the Board separately and available', 14, y); 
    y += 4;
    doc.text('at the time of declaration with the respective School.', 14, y); 
    y += 6;
    
    // CIS note
    doc.setFontSize(10);
    doc.setTextColor(255, 0, 0); // Red color for note
    doc.text('*Note for CIS candidates It is obligatory for candidates admitted for class improvement to give their option*', 14, y); 
    y += 4;
    doc.text('within one month from the date on which marklists have been distributed.After that the board marklist with', 14, y); 
    y += 4;
    doc.text('option will be given within the period of six months after paying extra charges.If no application with option is', 14, y); 
    y += 4;
    doc.text('received within 6 months the class improvement performance will be considered as "Cancelled" and previous', 14, y); 
    y += 4;
    doc.text('performance will be taken into account by divisional board.', 14, y); 
    y += 6;
    
    // Footer
    doc.setTextColor(0, 0, 0); // Black color
    doc.setFontSize(10);
    doc.text('Hosted By National Informatics Centre (NIC). Data Provided By MSBSHSE, Pune', 14, y); 
    y += 6;
    
    // Date
    const date = new Date();
    doc.setTextColor(100, 100, 100); // Gray color for date
    doc.text(`${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`, 14, y);

    doc.save(`${student.seat_number}_result.pdf`);
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
            <Button variant="primary" size="sm" onClick={handleDownload}>
              <Download size={16} className="mr-1" />
              Download Result
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