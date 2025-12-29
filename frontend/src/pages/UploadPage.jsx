import React, { useState } from "react";
import { api, endpoints } from "../services/api";

// Upload Page - Protected (requires login)
export const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Validate file type
    if (selectedFile) {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
      ];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please select a PDF or image file (JPG, PNG)");
        setFile(null);
        return;
      }

      setFile(selectedFile);
      setError("");
      setResult(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Send request to backend
      const response = await api.post(endpoints.bills.process, formData);

      // Show results - backend returns { message, Data: { analysis, rawText } }
      setResult(response.Data.analysis);
      setFile(null);
    } catch (err) {
      setError(err.message || "Failed to analyze bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Upload Your Bill</h1>
      <p style={styles.subtitle}>
        Upload a PDF or image of your hospital bill for instant AI analysis
      </p>

      {/* Upload Form */}
      <div style={styles.uploadCard}>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* File Input */}
          <div style={styles.fileInput}>
            <label htmlFor="file-upload" style={styles.fileLabel}>
              {file ? file.name : "Choose a file (PDF or Image)"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              style={styles.hiddenInput}
            />
          </div>

          {/* Error Message */}
          {error && <div style={styles.error}>{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            style={styles.button}
            disabled={loading || !file}
          >
            {loading ? "Analyzing..." : "Analyze Bill"}
          </button>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loading}>
          <p>⏳ Extracting text and analyzing with AI...</p>
          <p style={styles.loadingSubtext}>This may take 5-10 seconds</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={styles.results}>
          <h2>Analysis Results</h2>

          {/* Overall Summary */}
          {result?.overall_summary && (
            <div style={styles.section}>
              <h3>📊 Overall Summary</h3>
              <p>
                <strong>Verdict:</strong> {result.overall_summary.verdict}
              </p>
              <p>
                <strong>Confidence:</strong>{" "}
                {result.overall_summary.confidence_level}
              </p>
              <p>{result.overall_summary.one_line_summary}</p>
            </div>
          )}

          {/* Positive Points */}
          {result?.positive_points?.length > 0 && (
            <div style={styles.section}>
              <h3>✅ Positive Points</h3>
              {result.positive_points.map((point, index) => (
                <div key={index} style={styles.point}>
                  <strong>{point.title}</strong>
                  <p>{point.explanation}</p>
                </div>
              ))}
            </div>
          )}

          {/* Potential Issues */}
          {result?.potential_issues?.length > 0 && (
            <div style={styles.section}>
              <h3>⚠️ Potential Issues</h3>
              {result.potential_issues.map((issue, index) => (
                <div key={index} style={styles.issue}>
                  <strong>{issue.item_name}</strong>
                  <p>
                    <span style={styles.badge}>{issue.severity}</span>{" "}
                    {issue.type}
                  </p>
                  <p>{issue.why_flagged}</p>
                  <p style={styles.action}>
                    <strong>Action:</strong> {issue.suggested_action}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Insurance Attention Items */}
          {result?.insurance_attention_items?.length > 0 && (
            <div style={styles.section}>
              <h3>🏥 Insurance Coverage Notes</h3>
              {result.insurance_attention_items.map((item, index) => (
                <div key={index} style={styles.point}>
                  <strong>{item.item_name}</strong>
                  <p>{item.reason}</p>
                  <p>
                    <strong>Coverage:</strong> {item.coverage_likelihood}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Final Advice */}
          {result?.final_advice_for_patient?.length > 0 && (
            <div style={styles.section}>
              <h3>💡 Recommendations</h3>
              <ul>
                {result.final_advice_for_patient.map((advice, index) => (
                  <li key={index}>{advice}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem 1rem",
  },
  title: {
    textAlign: "center",
    marginBottom: "0.5rem",
    color: "#333",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "2rem",
  },
  uploadCard: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "2rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  fileInput: {
    position: "relative",
  },
  fileLabel: {
    display: "block",
    padding: "3rem 1rem",
    border: "2px dashed #ddd",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#f8f9fa",
  },
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
  },
  error: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "0.75rem",
    borderRadius: "4px",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    padding: "1rem",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  loading: {
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    marginBottom: "2rem",
  },
  loadingSubtext: {
    color: "#666",
    fontSize: "0.9rem",
  },
  results: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  section: {
    marginBottom: "2rem",
    padding: "1rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  point: {
    marginBottom: "1rem",
    padding: "1rem",
    backgroundColor: "#fff",
    borderRadius: "4px",
  },
  issue: {
    marginBottom: "1rem",
    padding: "1rem",
    backgroundColor: "#fff",
    borderLeft: "4px solid #ffc107",
    borderRadius: "4px",
  },
  badge: {
    display: "inline-block",
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    backgroundColor: "#ffc107",
    color: "#000",
    fontSize: "0.8rem",
    fontWeight: "500",
    marginRight: "0.5rem",
  },
  action: {
    marginTop: "0.5rem",
    fontStyle: "italic",
    color: "#666",
  },
};
