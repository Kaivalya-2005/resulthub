const API_URL = import.meta.env.VITE_API_URL;

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertCircle, TrendingUp, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ResultCard from '../components/results/ResultCard';

interface StudentResult {
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
}

const Home = () => {
  const navigate = useNavigate();
  const resultRef = useRef<HTMLDivElement>(null);
  const [motherName, setMotherName] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [error, setError] = useState('');
  const [student, setStudent] = useState<StudentResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!motherName || !seatNumber) {
      setError('Please enter both Mother\'s Name and Seat Number');
      return;
    }
    
    setError('');
    setIsSearching(true);
    
    try {
      const response = await axios.get(`${API_URL}/api/fetch`, {
        params: {
          seat_number: seatNumber,
          mother_name: motherName
        }
      });
      
      setStudent(response.data);
      // Scroll with offset
      setTimeout(() => {
        const yOffset = -100; // 100px from the top of the result
        const element = resultRef.current;
        if (element) {
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('No student found with these credentials. Please check and try again.');
        } else if (err.response?.status === 400) {
          setError('Invalid input. Please check your seat number and mother\'s name.');
        } else {
          setError('Server error. Please try again later.');
        }
      } else {
        setError('An error occurred while fetching the results. Please try again later.');
      }
      setStudent(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleNavigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => navigate(path), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent mb-4">
            SSC Result Portal 2025
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your details below to check your results
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Card className="max-w-2xl mx-auto p-6 md:p-8 shadow-lg">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Seat Number"
                  placeholder="e.g., A000001"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                  autoFocus
                />
                <Input
                  label="Mother's Name"
                  placeholder="Enter your mother's name"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
                  <AlertCircle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                fullWidth 
                isLoading={isSearching}
                className="py-3 text-lg"
              >
                <Search size={20} className="mr-2" />
                Check Result
              </Button>
            </form>
          </Card>
        </motion.div>

        {student && (
          <motion.div
            ref={resultRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <ResultCard student={student} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8"
        >
          <Card 
            className="p-6 bg-gradient-to-br from-purple-50 to-white cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleNavigate('/compare')}
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Scale size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Compare Results</h3>
                <p className="text-gray-600">
                  Compare your performance with other students and see where you stand in different subjects.
                  Get detailed insights about your strengths and areas for improvement.
                </p>
              </div>
            </div>
          </Card>

          <Card 
            className="p-6 bg-gradient-to-br from-teal-50 to-white cursor-pointer transition-transform hover:scale-105"
            onClick={() => handleNavigate('/performance')}
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-teal-100 rounded-lg">
                <TrendingUp size={24} className="text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Performance Overview</h3>
                <p className="text-gray-600">
                  Get a comprehensive analysis of your academic performance with subject-wise breakdown
                  and downloadable PDF reports for future reference.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;