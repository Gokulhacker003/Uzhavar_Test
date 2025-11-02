import React, { useState } from 'react';
import { apiUrl } from '../api';

export default function AdminSubmissionsPage() {
  const [subs, setSubs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl('/api/submissions'));
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to fetch submissions');
      }
      const data = await res.json();
      setSubs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter submissions
  const filteredSubs = subs ? subs.filter(s => {
    // Search filter (name, email, phone, message)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      (s.payload?.name?.toLowerCase().includes(searchLower)) ||
      (s.payload?.email?.toLowerCase().includes(searchLower)) ||
      (s.payload?.phone?.toLowerCase().includes(searchLower)) ||
      (s.payload?.message?.toLowerCase().includes(searchLower));

    // Subject filter
    const matchesSubject = filterSubject === 'all' || s.subject === filterSubject;

    // Date range filter
    const submissionDate = new Date(s.receivedAt);
    const matchesDateFrom = !dateFrom || submissionDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || submissionDate <= new Date(dateTo + 'T23:59:59');

    return matchesSearch && matchesSubject && matchesDateFrom && matchesDateTo;
  }) : [];

  // Get unique subjects for filter dropdown
  const subjects = subs ? ['all', ...new Set(subs.map(s => s.subject).filter(Boolean))] : ['all'];

  const clearFilters = () => {
    setSearchTerm('');
    setFilterSubject('all');
    setDateFrom('');
    setDateTo('');
  };

  const deleteSubmission = async (submission) => {
    if (!window.confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      // Find the actual index in the full submissions array
      const actualIndex = subs.findIndex(s => 
        s.receivedAt === submission.receivedAt && 
        s.subject === submission.subject &&
        s.payload?.email === submission.payload?.email
      );

      if (actualIndex === -1) {
        throw new Error('Submission not found');
      }

      const res = await fetch(apiUrl(`/api/submissions/${actualIndex}`), {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete submission');
      }

      // Remove from local state
      const updatedSubs = subs.filter((_, index) => index !== actualIndex);
      setSubs(updatedSubs);
      alert('Submission deleted successfully');
    } catch (err) {
      setError(`Failed to delete submission: ${err.message}`);
      alert(`Error: ${err.message}`);
    }
  };

  const viewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowViewModal(true);
  };

  const downloadCSV = () => {
    if (!filteredSubs || filteredSubs.length === 0) {
      alert('No submissions to download');
      return;
    }

    // Create CSV content with all fields
    const headers = ['Received Date', 'Subject', 'Name', 'Email', 'Phone', 'Company', 'Location', 'Service Type', 'Farm Size', 'Message'];
    const csvRows = [headers.join(',')];

    filteredSubs.forEach(s => {
      const row = [
        new Date(s.receivedAt).toLocaleString(),
        s.subject || '',
        s.payload?.name || '',
        s.payload?.email || '',
        s.payload?.phone || '',
        s.payload?.company || '',
        s.payload?.location || '',
        s.payload?.serviceType || '',
        s.payload?.farmSize || '',
        (s.payload?.message || '').replace(/,/g, ';') // Replace commas to avoid CSV issues
      ];
      csvRows.push(row.map(field => `"${field}"`).join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `submissions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    if (!filteredSubs || filteredSubs.length === 0) {
      alert('No submissions to download');
      return;
    }

    const jsonContent = JSON.stringify(filteredSubs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `submissions_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ 
      padding: '2em',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{
        background: 'white',
        padding: '2em',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2em'
      }}>
        <h2 style={{
          color: '#2e7d32',
          fontSize: '2em',
          marginBottom: '0.5em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5em'
        }}>
          📨 Form Submissions
        </h2>
        <p style={{ color: '#666', marginBottom: '1.5em' }}>
          View and manage all form submissions from your website
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1em', flexWrap: 'wrap' }}>
          <button 
            onClick={load} 
            disabled={loading}
            style={{
              background: loading ? '#ccc' : 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
              color: 'white',
              border: 'none',
              padding: '0.8em 1.5em',
              borderRadius: '8px',
              fontSize: '1em',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5em',
              boxShadow: '0 2px 8px rgba(56,142,60,0.3)',
              transition: 'all 0.3s'
            }}
          >
            🔄 {loading ? 'Loading...' : 'Load Submissions'}
          </button>

          {subs && subs.length > 0 && (
            <>
              <button 
                onClick={downloadCSV}
                style={{
                  background: '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '0.8em 1.5em',
                  borderRadius: '8px',
                  fontSize: '1em',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5em',
                  boxShadow: '0 2px 8px rgba(25,118,210,0.3)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#1565c0'}
                onMouseLeave={(e) => e.target.style.background = '#1976d2'}
              >
                📥 Download CSV
              </button>

              <button 
                onClick={downloadJSON}
                style={{
                  background: '#f57c00',
                  color: 'white',
                  border: 'none',
                  padding: '0.8em 1.5em',
                  borderRadius: '8px',
                  fontSize: '1em',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5em',
                  boxShadow: '0 2px 8px rgba(245,124,0,0.3)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e65100'}
                onMouseLeave={(e) => e.target.style.background = '#f57c00'}
              >
                📥 Download JSON
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Section */}
      {subs && subs.length > 0 && (
        <div style={{
          background: 'white',
          padding: '1.5em',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2em'
        }}>
          <h3 style={{ 
            color: '#2e7d32', 
            marginBottom: '1em',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5em'
          }}>
            🔍 Filter Submissions
          </h3>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1em',
            marginBottom: '1em'
          }}>
            {/* Search Input */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5em',
                fontWeight: 600,
                color: '#555',
                fontSize: '0.9em'
              }}>
                Search
              </label>
              <input
                type="text"
                placeholder="Search name, email, phone, message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7em',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.95em'
                }}
              />
            </div>

            {/* Subject Filter */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5em',
                fontWeight: 600,
                color: '#555',
                fontSize: '0.9em'
              }}>
                Subject
              </label>
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7em',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.95em',
                  cursor: 'pointer'
                }}
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5em',
                fontWeight: 600,
                color: '#555',
                fontSize: '0.9em'
              }}>
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7em',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.95em'
                }}
              />
            </div>

            {/* Date To */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5em',
                fontWeight: 600,
                color: '#555',
                fontSize: '0.9em'
              }}>
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.7em',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '0.95em'
                }}
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={clearFilters}
            style={{
              background: '#757575',
              color: 'white',
              border: 'none',
              padding: '0.6em 1.2em',
              borderRadius: '6px',
              fontSize: '0.9em',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#616161'}
            onMouseLeave={(e) => e.target.style.background = '#757575'}
          >
            🔄 Clear Filters
          </button>

          {/* Filter Results Info */}
          <div style={{
            marginTop: '1em',
            padding: '0.8em',
            background: '#f0f0f0',
            borderRadius: '6px',
            fontSize: '0.9em',
            color: '#555'
          }}>
            Showing <strong>{filteredSubs.length}</strong> of <strong>{subs.length}</strong> submissions
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ 
          background: '#ffebee',
          color: '#c62828',
          padding: '1em',
          borderRadius: '8px',
          marginBottom: '1em',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5em'
        }}>
          ⚠️ Error: {error}
        </div>
      )}

      {/* Stats Card */}
      {subs && subs.length > 0 && (
        <div style={{
          background: 'white',
          padding: '1.5em',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '2em',
          display: 'flex',
          alignItems: 'center',
          gap: '1em'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)',
            color: 'white',
            padding: '1em',
            borderRadius: '12px',
            fontSize: '2em',
            fontWeight: 700,
            minWidth: '80px',
            textAlign: 'center'
          }}>
            {filteredSubs.length}
          </div>
          <div>
            <div style={{ fontSize: '1.2em', fontWeight: 600, color: '#333' }}>
              {filteredSubs.length === subs.length ? 'Total' : 'Filtered'} Submissions
            </div>
            <div style={{ color: '#666', fontSize: '0.9em' }}>
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Submissions Table */}
      {!subs || subs.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '3em',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
          color: '#999'
        }}>
          <div style={{ fontSize: '3em', marginBottom: '0.5em' }}>📭</div>
          <div style={{ fontSize: '1.2em' }}>No submissions found</div>
        </div>
      ) : filteredSubs.length === 0 ? (
        <div style={{
          background: 'white',
          padding: '3em',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
          color: '#999'
        }}>
          <div style={{ fontSize: '3em', marginBottom: '0.5em' }}>🔍</div>
          <div style={{ fontSize: '1.2em' }}>No submissions match your filters</div>
          <button
            onClick={clearFilters}
            style={{
              marginTop: '1em',
              background: '#388e3c',
              color: 'white',
              border: 'none',
              padding: '0.7em 1.5em',
              borderRadius: '6px',
              fontSize: '0.95em',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '0.95em'
            }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '1em',
                    fontWeight: 600,
                    color: '#333',
                    borderBottom: '2px solid #e0e0e0'
                  }}>📅 Received</th>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '1em',
                    fontWeight: 600,
                    color: '#333',
                    borderBottom: '2px solid #e0e0e0'
                  }}>📋 Subject</th>
                  <th style={{ 
                    textAlign: 'left', 
                    padding: '1em',
                    fontWeight: 600,
                    color: '#333',
                    borderBottom: '2px solid #e0e0e0'
                  }}>👤 Name</th>
                  <th style={{ 
                    textAlign: 'center', 
                    padding: '1em',
                    fontWeight: 600,
                    color: '#333',
                    borderBottom: '2px solid #e0e0e0'
                  }}>⚡ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubs.map((s, i) => (
                  <tr 
                    key={i} 
                    style={{ 
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={{ 
                      padding: '1em',
                      verticalAlign: 'middle',
                      color: '#666',
                      fontSize: '0.9em'
                    }}>
                      {new Date(s.receivedAt).toLocaleString()}
                    </td>
                    <td style={{ 
                      padding: '1em',
                      verticalAlign: 'middle',
                      fontWeight: 600,
                      color: '#333'
                    }}>
                      {s.subject || 'N/A'}
                    </td>
                    <td style={{ 
                      padding: '1em',
                      verticalAlign: 'middle',
                      color: '#333'
                    }}>
                      {s.payload?.name || 'N/A'}
                    </td>
                    <td style={{ 
                      padding: '1em',
                      verticalAlign: 'middle',
                      textAlign: 'center'
                    }}>
                      <button
                        onClick={() => viewSubmission(s)}
                        style={{
                          padding: '0.5em 1em',
                          marginRight: '0.5em',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9em',
                          fontWeight: 500,
                          transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => deleteSubmission(s)}
                        style={{
                          padding: '0.5em 1em',
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.9em',
                          fontWeight: 500,
                          transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 87, 108, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Submission Modal */}
      {showViewModal && selectedSubmission && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2em',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowViewModal(false)}
              style={{
                position: 'absolute',
                top: '1em',
                right: '1em',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5em',
                cursor: 'pointer',
                color: '#666',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#333'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
            >
              ✕
            </button>

            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '1.5em',
              margin: '-2em -2em 1.5em -2em',
              borderRadius: '12px 12px 0 0',
              color: 'white'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5em' }}>📋 Submission Details</h2>
              <p style={{ margin: '0.5em 0 0 0', opacity: 0.9, fontSize: '0.9em' }}>
                Received: {new Date(selectedSubmission.receivedAt).toLocaleString()}
              </p>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '1.5em' }}>
              <h3 style={{ 
                color: '#333', 
                marginBottom: '0.5em',
                fontSize: '1.2em',
                borderBottom: '2px solid #667eea',
                paddingBottom: '0.5em'
              }}>
                {selectedSubmission.subject || 'No Subject'}
              </h3>
            </div>

            {/* Contact Information */}
            <div style={{
              background: '#f9f9f9',
              padding: '1.5em',
              borderRadius: '8px',
              marginBottom: '1.5em'
            }}>
              <h4 style={{ color: '#333', marginTop: 0, marginBottom: '1em' }}>👤 Contact Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1em' }}>
                <div>
                  <strong style={{ color: '#667eea' }}>Name:</strong>
                  <p style={{ margin: '0.3em 0', color: '#333' }}>{selectedSubmission.payload?.name || 'N/A'}</p>
                </div>
                <div>
                  <strong style={{ color: '#667eea' }}>Email:</strong>
                  <p style={{ margin: '0.3em 0', color: '#333' }}>{selectedSubmission.payload?.email || 'N/A'}</p>
                </div>
                <div>
                  <strong style={{ color: '#667eea' }}>Phone:</strong>
                  <p style={{ margin: '0.3em 0', color: '#333' }}>{selectedSubmission.payload?.phone || 'N/A'}</p>
                </div>
                {selectedSubmission.payload?.company && (
                  <div>
                    <strong style={{ color: '#667eea' }}>Company:</strong>
                    <p style={{ margin: '0.3em 0', color: '#333' }}>{selectedSubmission.payload.company}</p>
                  </div>
                )}
                {selectedSubmission.payload?.location && (
                  <div>
                    <strong style={{ color: '#667eea' }}>Location:</strong>
                    <p style={{ margin: '0.3em 0', color: '#333' }}>{selectedSubmission.payload.location}</p>
                  </div>
                )}
                {selectedSubmission.payload?.serviceType && (
                  <div>
                    <strong style={{ color: '#667eea' }}>Service Type:</strong>
                    <p style={{ margin: '0.3em 0', color: '#333' }}>{selectedSubmission.payload.serviceType}</p>
                  </div>
                )}
                {selectedSubmission.payload?.farmSize && (
                  <div>
                    <strong style={{ color: '#667eea' }}>Farm Size:</strong>
                    <p style={{ margin: '0.3em 0', color: '#333' }}>{selectedSubmission.payload.farmSize}</p>
                  </div>
                )}
                {(selectedSubmission.payload?.extra?.Address || 
                  selectedSubmission.payload?.extra?.['Delivery Address'] || 
                  selectedSubmission.payload?.extra?.['Land Location']) && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <strong style={{ color: '#667eea' }}>Address:</strong>
                    <p style={{ margin: '0.3em 0', color: '#333' }}>
                      {selectedSubmission.payload?.extra?.Address || 
                       selectedSubmission.payload?.extra?.['Delivery Address'] || 
                       selectedSubmission.payload?.extra?.['Land Location']}
                    </p>
                  </div>
                )}
                {selectedSubmission.payload?.extra?.City && (
                  <div>
                    <strong style={{ color: '#667eea' }}>City:</strong>
                    <p style={{ margin: '0.3em 0', color: '#333' }}>{selectedSubmission.payload.extra.City}</p>
                  </div>
                )}
                {selectedSubmission.payload?.extra?.State && (
                  <div>
                    <strong style={{ color: '#667eea' }}>State:</strong>
                    <p style={{ margin: '0.3em 0', color: '#333' }}>{selectedSubmission.payload.extra.State}</p>
                  </div>
                )}
                {selectedSubmission.payload?.extra?.Pincode && (
                  <div>
                    <strong style={{ color: '#667eea' }}>Pincode:</strong>
                    <p style={{ margin: '0.3em 0', color: '#333' }}>{selectedSubmission.payload.extra.Pincode}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: '1.5em' }}>
              <h4 style={{ color: '#333', marginBottom: '0.5em' }}>💬 Message</h4>
              <div style={{
                background: '#f9f9f9',
                padding: '1em',
                borderRadius: '8px',
                borderLeft: '4px solid #667eea',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                color: '#555',
                lineHeight: '1.6'
              }}>
                {selectedSubmission.payload?.message || 'No message provided'}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: '1em',
              justifyContent: 'flex-end',
              marginTop: '2em',
              paddingTop: '1em',
              borderTop: '1px solid #e0e0e0'
            }}>
              <button
                onClick={() => setShowViewModal(false)}
                style={{
                  padding: '0.8em 1.5em',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1em',
                  fontWeight: 500,
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
