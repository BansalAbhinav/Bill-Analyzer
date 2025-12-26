import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api, endpoints } from '../services/api';

// Analysis Detail Page - Shows full details of one analysis
export const AnalysisDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFullText, setShowFullText] = useState(false);
  
  useEffect(() => {
    fetchAnalysis();
  }, [id]);
  
  const fetchAnalysis = async () => {
    try {
      const response = await api.get(endpoints.bills.getById(id));
      setAnalysis(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch analysis');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this analysis?')) {
      return;
    }
    
    try {
      await api.delete(endpoints.bills.delete(id));
      navigate('/history');
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };
  
  if (loading) {
    return <div style={styles.container}><p>Loading...</p></div>;
  }
  
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
        <Link to="/history" style={styles.backLink}>← Back to History</Link>
      </div>
    );
  }
  
  if (!analysis) {
    return (
      <div style={styles.container}>
        <p>Analysis not found</p>
        <Link to="/history" style={styles.backLink}>← Back to History</Link>
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <Link to="/history" style={styles.backLink}>← Back to History</Link>
        <button onClick={handleDelete} style={styles.deleteButton}>
          Delete Analysis
        </button>
      </div>
      
      {/* File Info */}
      <div style={styles.fileInfo}>
        <h1>{analysis.originalFileName}</h1>
        <p><strong>Uploaded:</strong> {new Date(analysis.createdAt).toLocaleString()}</p>
        <p><strong>Pages:</strong> {analysis.totalPages}</p>
        <p><strong>Extraction Method:</strong> {analysis.extractedVia}</p>
        <p><strong>Status:</strong> <span style={styles.badge}>{analysis.status}</span></p>
      </div>
      
      {/* AI Analysis Results */}
      {analysis.analysis && (
        <div style={styles.results}>
          <h2>📋 AI Analysis</h2>
          
          {/* Overall Summary */}
          {analysis.analysis.overall_summary && (
            <div style={styles.section}>
              <h3>📊 Overall Assessment</h3>
              <div style={styles.summaryCard}>
                <p><strong>Verdict:</strong> {analysis.analysis.overall_summary.verdict}</p>
                <p><strong>Confidence:</strong> {analysis.analysis.overall_summary.confidence_level}</p>
                <p style={styles.summary}>{analysis.analysis.overall_summary.one_line_summary}</p>
              </div>
            </div>
          )}
          
          {/* Positive Points */}
          {analysis.analysis.positive_points?.length > 0 && (
            <div style={styles.section}>
              <h3>✅ Positive Points</h3>
              {analysis.analysis.positive_points.map((point, index) => (
                <div key={index} style={styles.positiveCard}>
                  <h4>{point.title}</h4>
                  <p>{point.explanation}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Potential Issues */}
          {analysis.analysis.potential_issues?.length > 0 && (
            <div style={styles.section}>
              <h3>⚠️ Potential Issues</h3>
              {analysis.analysis.potential_issues.map((issue, index) => (
                <div key={index} style={styles.issueCard}>
                  <h4>{issue.item_name}</h4>
                  <div style={styles.issueMeta}>
                    <span style={styles.severity}>{issue.severity}</span>
                    <span style={styles.type}>{issue.type}</span>
                  </div>
                  <p><strong>Why flagged:</strong> {issue.why_flagged}</p>
                  <p style={styles.action}>
                    <strong>Suggested action:</strong> {issue.suggested_action}
                  </p>
                </div>
              ))}
            </div>
          )}
          
          {/* Insurance Items */}
          {analysis.analysis.insurance_attention_items?.length > 0 && (
            <div style={styles.section}>
              <h3>🏥 Insurance Coverage Notes</h3>
              {analysis.analysis.insurance_attention_items.map((item, index) => (
                <div key={index} style={styles.insuranceCard}>
                  <h4>{item.item_name}</h4>
                  <p>{item.reason}</p>
                  <p><strong>Coverage likelihood:</strong> {item.coverage_likelihood}</p>
                </div>
              ))}
            </div>
          )}
          
          {/* Final Advice */}
          {analysis.analysis.final_advice_for_patient?.length > 0 && (
            <div style={styles.section}>
              <h3>💡 Recommendations for You</h3>
              <ul style={styles.adviceList}>
                {analysis.analysis.final_advice_for_patient.map((advice, index) => (
                  <li key={index}>{advice}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Extracted Text */}
      <div style={styles.section}>
        <h3>📄 Extracted Text</h3>
        <button
          onClick={() => setShowFullText(!showFullText)}
          style={styles.toggleButton}
        >
          {showFullText ? 'Hide' : 'Show'} Full Text
        </button>
        
        {showFullText && (
          <div style={styles.textBox}>
            <pre style={styles.preText}>{analysis.extractedText}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  backLink: {
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  fileInfo: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#28a745',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  results: {
    marginBottom: '2rem',
  },
  section: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '1.5rem',
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '4px',
  },
  summary: {
    marginTop: '0.5rem',
    fontSize: '1.05rem',
    lineHeight: '1.5',
  },
  positiveCard: {
    backgroundColor: '#d4edda',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '0.75rem',
    borderLeft: '4px solid #28a745',
  },
  issueCard: {
    backgroundColor: '#fff3cd',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '0.75rem',
    borderLeft: '4px solid #ffc107',
  },
  issueMeta: {
    marginBottom: '0.5rem',
  },
  severity: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#ffc107',
    color: '#000',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '500',
    marginRight: '0.5rem',
  },
  type: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#17a2b8',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: '500',
  },
  action: {
    marginTop: '0.5rem',
    padding: '0.5rem',
    backgroundColor: '#fff',
    borderRadius: '4px',
    fontStyle: 'italic',
  },
  insuranceCard: {
    backgroundColor: '#d1ecf1',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '0.75rem',
    borderLeft: '4px solid #17a2b8',
  },
  adviceList: {
    paddingLeft: '1.5rem',
    lineHeight: '1.8',
  },
  toggleButton: {
    backgroundColor: '#6c757d',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  textBox: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '4px',
    maxHeight: '400px',
    overflow: 'auto',
  },
  preText: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    margin: 0,
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
};
