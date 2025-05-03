import { Topper } from '../../types';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

const ToppersList = ({ toppers, loading }: { toppers: Topper[]; loading?: boolean }) => {
  if (loading) return <LoadingSpinner />;
  
  return (
    <Card className="w-full">
      <div className="p-3 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-center mb-4">Class Merit List</h3>
        <div className="overflow-x-auto max-h-[400px] md:max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marks
                </th>
                <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {toppers.map((student, index) => (
                <tr 
                  key={index}
                  className={`${index < 3 ? 'bg-purple-50' : ''} hover:bg-gray-50 transition-colors`}
                >
                  <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-xs md:text-sm font-medium text-gray-900">
                        {index + 1}
                      </span>
                      {index < 3 && (
                        <span className="ml-1 text-sm md:text-base">
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div className="text-xs md:text-sm font-medium text-gray-900">
                      {student.student_name}
                    </div>
                  </td>
                  <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div className="text-xs md:text-sm text-gray-500">
                      {student.total_marks+student.additional_marks}
                    </div>
                  </td>
                  <td className="px-2 md:px-6 py-2 md:py-4 whitespace-nowrap">
                    <div className="text-xs md:text-sm font-bold text-gray-900">
                      {student.percentage}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default ToppersList;