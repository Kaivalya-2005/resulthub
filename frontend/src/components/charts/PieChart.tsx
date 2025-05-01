import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { PerformanceData } from '../../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: PerformanceData;
}

const PieChart = ({ data }: PieChartProps) => {
  const chartData: ChartData<'pie'> = {
    labels: ['Distinction', 'First Class', 'Second Class', 'Pass', 'Fail'],
    datasets: [
      {
        data: [data.distinction, data.firstClass, data.secondClass, data.pass, data.fail],
        backgroundColor: [
          '#8B5CF6', // purple-500
          '#06B6D4', // cyan-500
          '#10B981', // emerald-500
          '#F59E0B', // amber-500
          '#EF4444', // red-500
        ],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;