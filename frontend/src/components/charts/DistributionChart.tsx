import { motion } from 'framer-motion';
import { DistributionData } from '../../types';
import Card from '../ui/Card';
import PieChart from './PieChart';

interface Props {
  distribution: DistributionData[];
  loading: boolean;
  error: string | null;
}

const DistributionChart = ({ distribution, loading, error }: Props) => {
  const chartData = {
    distinction: distribution.find(d => d.grade === 'Distinction')?.count || 0,
    firstClass: distribution.find(d => d.grade === 'First Class')?.count || 0,
    secondClass: distribution.find(d => d.grade === 'Second Class')?.count || 0,
    pass: distribution.find(d => d.grade === 'Pass Class')?.count || 0,
    fail: distribution.find(d => d.grade === 'Fail')?.count || 0,
  };

  const gradeColors = {
    distinction: '#8B5CF6', // purple-500
    firstClass: '#06B6D4', // cyan-500
    secondClass: '#10B981', // emerald-500
    pass: '#F59E0B', // amber-500
    fail: '#EF4444', // red-500
  };

  const gradeLabels = {
    distinction: 'Distinction',
    firstClass: 'First Class',
    secondClass: 'Second Class',
    pass: 'Pass',
    fail: 'Fail',
  };

  return (
    <Card className="h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Grade Distribution
        </h2>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <>
            <div className="h-64 mb-8">
              <PieChart data={chartData} />
            </div>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(gradeLabels).map(([key, label]) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: gradeColors[key as keyof typeof gradeColors] }}
                    />
                    <span className="text-sm text-gray-600">{label}</span>
                  </div>
                  <span className="font-semibold">
                    {chartData[key as keyof typeof chartData]}
                  </span>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default DistributionChart;
