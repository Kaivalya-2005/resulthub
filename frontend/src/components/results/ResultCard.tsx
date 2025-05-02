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

  const handleDownload = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(14);
    doc.text('SSC Result 2024::MSBSHSE, PUNE', 14, y); y += 10;

    doc.setFontSize(12);
    doc.text('MAHARASHTRA STATE BOARD OF SECONDARY AND HIGHER SECONDARY EDUCATION, PUNE', 14, y); y += 8;
    doc.text('SSC Examination March - 2024', 14, y); y += 10;
    doc.setFontSize(13);
    doc.text('RESULT', 14, y); y += 10;

    doc.setFontSize(12);
    doc.text('Subjects', 14, y); y += 6;
    doc.text('Code   Subject Name         Marks Obtained', 14, y); y += 6;

    const subjectList = [
      { code: '01', name: 'Marathi', marks: student.marathi },
      { code: '15', name: 'Hindi', marks: student.hindi },
      { code: '16', name: 'English', marks: student.english },
      { code: '71', name: 'Mathematics', marks: student.mathematics },
      { code: '72', name: 'Science', marks: student.science },
      { code: '73', name: 'Social Science', marks: student.social_science },
    ];

    subjectList.forEach(subject => {
      doc.text(`${subject.code}     ${subject.name.padEnd(20)} ${String(subject.marks).padStart(3, '0')}`, 14, y);
      y += 6;
    });

    if (student.additional_marks > 0) {
      doc.text(`      Additional Marks         ${student.additional_marks}`, 14, y); y += 6;
    }

    y += 4;
    doc.text(`Total: ${student.total_marks}${student.additional_marks > 0 ? ` +${student.additional_marks}` : ''}/500`, 14, y); y += 6;
    doc.text(`Percentage: ${student.percentage}%`, 14, y); y += 6;
    doc.text(`Result: ${student.result_status}`, 14, y); y += 10;

    doc.text(`Candidate Name: ${student.student_name}`, 14, y); y += 6;
    doc.text(`Mother's Name: ${student.mother_name}`, 14, y); y += 6;
    doc.text(`Seat Number: ${student.seat_number}`, 14, y); y += 6;

    doc.setFontSize(9);
    y += 8;
    doc.text('Disclaimer: Results on net are for immediate info only. Verify from original mark sheet.', 14, y);

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
