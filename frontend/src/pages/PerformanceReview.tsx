import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DistributionData, Topper, Subject, SubjectToppersData, SubjectDistribution } from '../types';
import { fetchDistribution, fetchToppers, fetchSubjectToppers, fetchSubjectDistribution } from '../services/api';
import DistributionChart from '../components/charts/DistributionChart';
import ToppersList from '../components/results/ToppersList';
import SubjectToppersList from '../components/results/SubjectToppersList';
import SubjectDistributionChart from '../components/charts/SubjectDistributionChart';

const subjects: Subject[] = [
  { id: 'english', name: 'English' },
  { id: 'marathi', name: 'Marathi' },
  { id: 'hindi', name: 'Hindi' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'science', name: 'Science' },
  { id: 'social_science', name: 'Social Science' },
];

const PerformanceReview = () => {
  const [activeSubject, setActiveSubject] = useState<string>('english');
  const [distribution, setDistribution] = useState<DistributionData[]>([]);
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [subjectToppers, setSubjectToppers] = useState<SubjectToppersData[]>([]);
  const [subjectDistribution, setSubjectDistribution] = useState<SubjectDistribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [distributionData, toppersData, subjectToppersData] = await Promise.all([
          fetchDistribution(),
          fetchToppers(),
          fetchSubjectToppers()
        ]);
        setDistribution(distributionData);
        setToppers(toppersData);
        setSubjectToppers(subjectToppersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const distribution = await fetchSubjectDistribution(activeSubject);
        setSubjectDistribution(distribution);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch subject distribution');
      }
    };

    if (activeSubject) {
      fetchSubjectData();
    }
  }, [activeSubject]);

  const getCurrentSubjectToppers = () => {
    const subjectData = subjectToppers.find(
      s => s.subject.toLowerCase() === activeSubject.toLowerCase()
    );
    return subjectData?.topStudents || [];
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
            Performance Review
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Analyze overall performance and see the top performers in each subject
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <DistributionChart 
              distribution={distribution}
              loading={loading}
              error={error}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ToppersList toppers={toppers} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Subject-Wise Toppers
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {subjects.map((subject) => (
                <motion.button
                  key={subject.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    activeSubject === subject.id
                      ? 'bg-gradient-to-r from-purple-600 to-teal-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveSubject(subject.id)}
                >
                  {subject.name}
                </motion.button>
              ))}
            </div>
            
            {activeSubject && (
              <motion.div
                key={activeSubject}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                  <SubjectToppersList 
                    subject={subjects.find(s => s.id === activeSubject)?.name || ''} 
                    toppers={getCurrentSubjectToppers()} 
                  />
                  {subjectDistribution && (
                    <SubjectDistributionChart
                      subject={subjects.find(s => s.id === activeSubject)?.name || ''}
                      distribution={subjectDistribution}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PerformanceReview;