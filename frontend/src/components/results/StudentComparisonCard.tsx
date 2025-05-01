import { Student } from '../../types';
import Card from '../ui/Card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StudentComparisonCardProps {
  student1: Student;
  student2: Student;
}

const StudentComparisonCard = ({ student1, student2 }: StudentComparisonCardProps) => {
  const subjects = [
    { key: 'english', label: 'English' },
    { key: 'hindi', label: 'Hindi' },
    { key: 'marathi', label: 'Marathi' },
    { key: 'mathematics', label: 'Mathematics' },
    { key: 'science', label: 'Science' },
    { key: 'social_science', label: 'Social Science' },
  ];

  const getComparisonData = (val1: number, val2: number) => {
    if (val1 > val2) return { color: 'text-green-600', icon: <ArrowUp className="inline w-4 h-4" /> };
    if (val1 < val2) return { color: 'text-red-600', icon: <ArrowDown className="inline w-4 h-4" /> };
    return { color: 'text-gray-600', icon: <Minus className="inline w-4 h-4" /> };
  };

  const renderStudentColumn = (student: Student, otherStudent: Student) => (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-800">{student.student_name}</h3>
      <p className="text-gray-600">Seat Number: {student.seat_number}</p>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Subject</th>
              <th className="text-right py-2">Marks</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(({ key, label }) => {
              const marks = student[key as keyof Student] as number;
              const otherMarks = otherStudent[key as keyof Student] as number;
              const { color, icon } = getComparisonData(marks, otherMarks);
              return (
                <tr key={key} className="border-b">
                  <td className="py-2">{label}</td>
                  <td className={`text-right py-2 ${color}`}>{marks}</td>
                  <td className={`text-center ${color}`}>{icon}</td>
                </tr>
              );
            })}
            <tr>
              <td className="py-2">Additional Marks</td>
              <td className={`text-right py-2 ${getComparisonData(student.additional_marks || 0, otherStudent.additional_marks || 0).color}`}>
                {student.additional_marks || 0}
              </td>
              <td className={`text-center ${getComparisonData(student.additional_marks || 0, otherStudent.additional_marks || 0).color}`}>
                {getComparisonData(student.additional_marks || 0, otherStudent.additional_marks || 0).icon}
              </td>
            </tr>
            <tr className="font-bold">
              <td className="py-2">Total</td>
              <td className={`text-right py-2 ${getComparisonData(student.total_marks + (student.additional_marks || 0), otherStudent.total_marks + (otherStudent.additional_marks || 0)).color}`}>
                {student.total_marks + (student.additional_marks || 0)}
              </td>
              <td className={`text-center ${getComparisonData(student.total_marks + (student.additional_marks || 0), otherStudent.total_marks + (otherStudent.additional_marks || 0)).color}`}>
                {getComparisonData(student.total_marks + (student.additional_marks || 0), otherStudent.total_marks + (otherStudent.additional_marks || 0)).icon}
              </td>
            </tr>
            <tr className="font-bold">
              <td className="py-2">Percentage</td>
              <td className={`text-right py-2 ${getComparisonData(student.percentage, otherStudent.percentage).color}`}>
                {student.percentage.toFixed(2)}%
              </td>
              <td className={`text-center ${getComparisonData(student.percentage, otherStudent.percentage).color}`}>
                {getComparisonData(student.percentage, otherStudent.percentage).icon}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 gap-8">
        {renderStudentColumn(student2, student1)}
        {renderStudentColumn(student1, student2)}
      </div>
    </Card>
  );
};

export default StudentComparisonCard;