import React, { useState } from "react";
import axios from "axios";
import { Search, Award, Download, Loader2 } from "lucide-react";
import { endpoints } from "./config/api";

function App() {
  const [rollNumber, setRollNumber] = useState("");
  const [motherName, setMotherName] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResult = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const response = await axios.post(endpoints.getResult, {
        seatNumber: rollNumber,
        motherName: motherName
      });
      
      // Log the response to debug
      console.log('API Response:', response.data);
      
      // Check if response has data
      if (response.data && response.data.student) {
        setResult({
          studentName: response.data.student.student_name,
          rollNumber: response.data.student.seat_number,
          motherName: response.data.student.mother_name,
          percentage: response.data.student.percentage,
          division: response.data.student.division,
          hasPdf: response.data.student.pdf_url ? true : false,
          pdfUrl: response.data.student.pdf_url
        });
      } else {
        setError("No result data found");
      }
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.error || "Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (result?.pdfUrl) {
      window.open(result.pdfUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Award className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-blue-800 mb-2">
            SSC Result Portal 2024
          </h1>
          <p className="text-gray-600">
            Check your Secondary School Certificate examination results
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-blue-600 py-4 px-6">
            <h2 className="text-white font-semibold text-lg">
              Enter Your Details
            </h2>
          </div>
          <form onSubmit={fetchResult} className="p-6">
            <div className="mb-6">
              <label
                htmlFor="rollNumber"
                className="block text-gray-700 font-medium mb-2"
              >
                Roll Number
              </label>
              <div className="relative">
                <input
                  id="rollNumber"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pl-10"
                  placeholder="Enter your roll number"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  required
                />
                <div className="absolute left-3 top-3 text-gray-400">
                  <Search size={18} />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="motherName"
                className="block text-gray-700 font-medium mb-2"
              >
                Mother's Name
              </label>
              <input
                id="motherName"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter your mother's name"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:bg-blue-400"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Fetching Results...
                </>
              ) : (
                "Get Result"
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-600 py-4 px-6">
              <h2 className="text-white font-semibold text-lg flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Result Details
              </h2>
            </div>

            <div className="p-6">
              <div className="border-b pb-4 mb-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {result.studentName}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Roll Number: {result.rollNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-500 text-sm">Student Name</p>
                  <p className="font-semibold text-gray-800">
                    {result.studentName}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-500 text-sm">Roll Number</p>
                  <p className="font-semibold text-gray-800">
                    {result.rollNumber}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-gray-500 text-sm">Mother's Name</p>
                  <p className="font-semibold text-gray-800">
                    {result.motherName}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded">
                  <p className="text-blue-500 text-sm">Percentage</p>
                  <p className="font-bold text-blue-800 text-xl">
                    {result.percentage}%
                  </p>
                </div>
              </div>

              {result.hasPdf && (
                <button
                  onClick={downloadPdf}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Result PDF
                </button>
              )}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 SSC Result Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;