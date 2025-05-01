import { Pie } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';
import { SubjectDistribution } from '../../types';
import Card from '../ui/Card';

interface Props {
  subject: string;
  distribution: SubjectDistribution;
}

const SubjectDistributionChart = ({ subject, distribution }: Props) => {
  const chartData: ChartData<'pie'> = {
    labels: ['Excellent (75-100)', 'Good (60-74)', 'Average (35-59)', 'Poor (0-34)'],
    datasets: [{
      data: [
        distribution.excellent,
        distribution.good,
        distribution.average,
        distribution.poor
      ],
      backgroundColor: [
        '#8B5CF6', // purple
        '#06B6D4', // cyan
        '#F59E0B', // amber
        '#EF4444', // red
      ],
      borderWidth: 0,
    }]
  };

  const options: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Card className="w-full">
      <div className="p-6">
        <h3 className="text-xl font-bold text-center mb-4">{subject} Score Distribution</h3>
        <div className="h-64">
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </Card>
  );
};

export default SubjectDistributionChart;
