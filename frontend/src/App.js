import React, { useState } from "react";
import axios from "axios";
import "./App.css";

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
      const response = await axios.post("http://localhost:5000/get-result", {
        rollNumber,
        motherName,
      });

      setResult(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "An error occurred";
      setError(errorMessage === "Result not yet available" 
        ? "Your result is not yet available. Please check back later." 
        : "No record found or server error");
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (result?.rollNumber) {
      window.open(`http://localhost:5000/download-pdf/${result.rollNumber}`, '_blank');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>SSC Result Portal 2024</h1>
        <div className="card">
          <form onSubmit={fetchResult}>
            <div className="input-group">
              <label htmlFor="rollNumber">Roll Number</label>
              <input
                id="rollNumber"
                type="text"
                placeholder="Enter Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="motherName">Mother's Name</label>
              <input
                id="motherName"
                type="text"
                placeholder="Enter Mother's Name"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Fetching..." : "Get Result"}
            </button>
          </form>
        </div>

        {error && <div className="error-message">{error}</div>}

        {result && (
          <div className="result-card">
            <h2>Result Details</h2>
            <div className="result-grid">
              <div className="result-item">
                <span>Student Name</span>
                <strong>{result.studentName}</strong>
              </div>
              <div className="result-item">
                <span>Roll Number</span>
                <strong>{result.rollNumber}</strong>
              </div>
              <div className="result-item">
                <span>Mother's Name</span>
                <strong>{result.motherName}</strong>
              </div>
              <div className="result-item">
                <span>Percentage</span>
                <strong>{result.percentage}%</strong>
              </div>
            </div>
            {result.hasPdf && (
              <button onClick={downloadPdf} className="download-btn">
                Download Result PDF
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
