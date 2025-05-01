import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ResultCard from '../components/results/ResultCard';

interface StudentResult {
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
}

const Home = () => {
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
      const response = await axios.get('http://localhost:5000/api/fetch', {
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
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('No student found with these credentials. Please check and try again.');
      } else {
        setError('An error occurred while fetching the results. Please try again later.');
      }
      setStudent(null);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent mb-4">
            Student Results Portal
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Access your academic results by entering your mother's name and seat number below
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <Card className="max-w-2xl mx-auto p-8">
            <form onSubmit={handleSearch}>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Your Results</h2>
                <p className="text-gray-600 mb-4">
                  Enter your credentials to view and download your results
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <Input
                  label="Seat Number"
                  placeholder="Enter your seat number (e.g., A000001)"
                  value={seatNumber}
                  onChange={(e) => setSeatNumber(e.target.value)}
                />
                <Input
                  label="Mother's Name"
                  placeholder="Enter your mother's name"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                />
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
                isLoading={isSearching}
              >
                <Search size={18} className="mr-2" />
                Find Results
              </Button>
              
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>
                  Need help? Contact your school administration or email{' '}
                  <a href="mailto:support@resulthub.edu" className="text-purple-600 hover:underline">
                    support@resulthub.edu
                  </a>
                </p>
              </div>
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
      </div>
    </div>
  );
};

export default Home;