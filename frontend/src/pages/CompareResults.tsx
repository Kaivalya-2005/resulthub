const API_URL = import.meta.env.VITE_API_URL;
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import StudentComparisonCard from '../components/results/StudentComparisonCard';
import { Student } from '../types';

const CompareResults = () => {
  const [seatNumber1, setSeatNumber1] = useState('');
  const [motherName1, setMotherName1] = useState('');
  const [seatNumber2, setSeatNumber2] = useState('');
  const [motherName2, setMotherName2] = useState('');
  const [student1, setStudent1] = useState<Student | null>(null);
  const [student2, setStudent2] = useState<Student | null>(null);
  const [error, setError] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!seatNumber1 || !seatNumber2 || !motherName1 || !motherName2) {
      setError('Please fill in all fields');
      return;
    }

    if (seatNumber1 === seatNumber2) {
      setError('Please enter different seat numbers to compare');
      return;
    }

    setError('');
    setIsComparing(true);

    try {
      const response = await fetch(
        `${API_URL}/api/compare-students?seat1=${seatNumber1}&mother1=${motherName1}&seat2=${seatNumber2}&mother2=${motherName2}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch comparison data');
      }

      const data = await response.json();
      
      setStudent1(data.student1);
      setStudent2(data.student2);

      // Scroll with offset
      setTimeout(() => {
        const yOffset = -100; // 100px from the top of the result
        const element = resultsRef.current;
        if (element) {
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);

    } catch (error) {
      setError('Failed to fetch comparison data. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent mb-4">
            Compare Results
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8">
            Compare the academic performance of two students side by side
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 md:mb-16"
        >
          <Card className="max-w-3xl mx-auto p-4 md:p-8">
            <form onSubmit={handleCompare}>
              <div className="mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-4">Enter Seat Numbers to Compare</h2>
                <p className="text-sm md:text-base text-gray-600 mb-4">
                  Enter the seat numbers of two students to compare their results
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="w-full flex flex-col items-center justify-center">
                  <Input
                    label="First Student Seat Number"
                    placeholder="e.g., A000001"
                    value={seatNumber1}
                    onChange={(e) => setSeatNumber1(e.target.value.trim())}
                  />
                  <Input
                    label="First Student's Mother's Name"
                    placeholder="Enter mother's name"
                    value={motherName1}
                    onChange={(e) => setMotherName1(e.target.value.trim())}
                  />
                </div>

                <div className="w-full flex flex-col items-center justify-center">
                  <Input
                    label="Second Student Seat Number"
                    placeholder="e.g., A000002"
                    value={seatNumber2}
                    onChange={(e) => setSeatNumber2(e.target.value.trim())}
                  />
                  <Input
                    label="Second Student's Mother's Name"
                    placeholder="Enter mother's name"
                    value={motherName2}
                    onChange={(e) => setMotherName2(e.target.value.trim())}
                  />
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
                  <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button
                type="submit"
                fullWidth
                isLoading={isComparing}
              >
                Compare Results
              </Button>

              <div className="mt-4 text-center text-sm text-gray-500">
                <p>
                  This tool allows you to compare subject-wise and overall performance between two students
                </p>
              </div>
            </form>
          </Card>
        </motion.div>

        {student1 && student2 && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 md:mb-16"
          >
            <StudentComparisonCard student1={student1} student2={student2} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CompareResults;