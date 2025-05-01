import { SubjectTopper } from '../../types';
import Card from '../ui/Card';

interface SubjectToppersListProps {
  subject: string;
  toppers: SubjectTopper[];
}

const SubjectToppersList = ({ subject, toppers }: SubjectToppersListProps) => {
  return (
    <Card className="w-full">
      <div className="p-6">
        <h3 className="text-xl font-bold text-center mb-4">{subject} Toppers</h3>
        <div className="overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {toppers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                toppers.map((topper, index) => (
                  <tr 
                    key={index}
                    className={index === 0 ? 'bg-purple-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {index + 1}
                      {index === 0 && (
                        <span className="ml-1 inline-flex items-center text-yellow-500">
                          👑
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {topper.student_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`px-2 py-1 rounded-full ${
                        index === 0
                          ? 'bg-purple-100 text-purple-800'
                          : index === 1
                          ? 'bg-blue-100 text-blue-800'
                          : index === 2
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {topper.marks}/100
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default SubjectToppersList;