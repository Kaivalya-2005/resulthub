import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [rollNumber, setRollNumber] = useState("");
  const [motherName, setMotherName] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const fetchResult = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    try {
      const response = await axios.post("http://localhost:5000/get-result", {
        rollNumber,
        motherName,
      });

      setResult(response.data);
    } catch (err) {
      setError("No record found or server error");
    }
  };

  return (
    <div className="App">
      <h1>10th Grade Result Portal</h1>
      <form onSubmit={fetchResult}>
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter Mother's Name"
          value={motherName}
          onChange={(e) => setMotherName(e.target.value)}
          required
        />
        <button type="submit">Get Result</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div className="result-container">
          <h2>Result</h2>
          <p><strong>Student Name:</strong> {result.studentName}</p>
          <p><strong>Roll Number:</strong> {result.rollNumber}</p>
          <p><strong>Mother's Name:</strong> {result.motherName}</p>
          <p><strong>Marks:</strong> {result.percentage}</p>
        </div>
      )}
    </div>
  );
}

export default App;


