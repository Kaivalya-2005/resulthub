import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
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
    window.open(student.pdf_url, '_blank');
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
            {/* <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2> */}
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
              Percentage:{' '}
              <span className="font-bold">{student.percentage.toFixed(2)}%</span>
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-lg">
            Status:{' '}
            <span className={`font-bold ${
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