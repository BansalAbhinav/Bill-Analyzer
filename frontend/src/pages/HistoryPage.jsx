import React, { useState, useEffect } from 'react';
import { api, endpoints } from '../services/api';
import { Link } from 'react-router-dom';

// History Page - Shows all previous analyses
export const HistoryPage = () => {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch analyses on component mount
  useEffect(() => {
    fetchAnalyses();
  }, []);
  
  const fetchAnalyses = async () => {
    try {
      const response = await api.get(endpoints.bills.getAll);
      setAnalyses(response.data.analyses || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this analysis?')) {
      return;
    }
    
    try {
      await api.delete(endpoints.bills.delete(id));
      // Remove from list
      setAnalyses(analyses.filter(a => a._id !== id));
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
      </div>
    );
  }
  
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Analysis History</h1>
      
      {analyses.length === 0 ? (
        <div style={styles.empty}>
          <p>No analyses yet</p>
          <Link to="/upload" style={styles.button}>
            Upload Your First Bill
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {analyses.map((analysis) => (
            <div key={analysis._id} style={styles.card}>
              <h3>{analysis.originalFileName}</h3>
              <p style={styles.date}>
                {new Date(analysis.createdAt).toLocaleDateString()}
              </p>
              <p><strong>Pages:</strong> {analysis.totalPages}</p>
              <p><strong>Method:</strong> {analysis.extractedVia}</p>
              
              {analysis.analysis?.overall_summary && (
                <p style={styles.verdict}>
                  <strong>Verdict:</strong> {analysis.analysis.overall_summary.verdict}
                </p>
              )}
              
              <div style={styles.actions}>
                <Link to={`/analysis/${analysis._id}`} style={styles.viewButton}>
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(analysis._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  title: {
    marginBottom: '2rem',
    color: '#333',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    textDecoration: 'none',
    marginTop: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  date: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '1rem',
  },
  verdict: {
    marginTop: '1rem',
    padding: '0.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  viewButton: {
    flex: 1,
    textAlign: 'center',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '0.5rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '0.9rem',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};
