import React, { useState, useEffect } from 'react'; //rename
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import '../../css/alerts.css';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [selectedType, setSelectedType] = useState("train"); // Default to train
  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedDirection, setSelectedDirection] = useState(null);
  const [busSearch, setBusSearch] = useState('');
  const [loading, setLoading,] = useState(true);
  const [error, setError] = useState(null);

  const trainLines = [
    { id: 'red', name: 'Red Line', color: '#FA2D27' },
    { id: 'green', name: 'Green Line', color: '#00843D' },
    { id: 'blue', name: 'Blue Line', color: '#003DA5' },
    { id: 'orange', name: 'Orange Line', color: '#ED8B00' }
  ];

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true);
        const result = await axios.get(
          'https://api-v3.mbta.com/alerts?sort=-updated_at&fields%5Balert%5D=header%2Ceffect-name%2Cseverity%2Cupdated_at%2Clifecycle&include=stops&filter%5Bactivity%5D=BOARD%2CEXIT%2CRIDE'
        );
        setAlerts(result.data.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch alerts. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 300000);
    return () => clearInterval(interval);
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    const header = alert.attributes.header?.toLowerCase() || '';
    const updatedAt = alert.attributes.updated_at ? new Date(alert.attributes.updated_at) : null;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Filter out alerts older than 1 month
    if (updatedAt && updatedAt < oneMonthAgo) {
      return false;
    }

    if (!selectedType && !selectedLine && !busSearch) return true;

    if (selectedType === 'train') {
      if (!selectedLine) return header.includes('train');
      const matchesLine = header.includes(selectedLine);
      if (selectedDirection) {
        return matchesLine && header.includes(selectedDirection);
      }
      return matchesLine;
    }

    if (selectedType === 'bus' || busSearch) {
      return header.includes(`route ${busSearch.toLowerCase()}`);
    }

    return true;
  });

  const getSeverityClass = (severity) => {
    if (!severity) return 'alert-info';
    const severityStr = String(severity).toLowerCase();
    switch (severityStr) {
      case 'severe': return 'alert-severe';
      case 'moderate': return 'alert-moderate';
      case 'minor': return 'alert-minor';
      default: return 'alert-info';
    }
  };

  if (loading) return <div className="loading-spinner">Loading alerts...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="alerts-container">
      <h2 className="alerts-title">MBTA Service Alerts</h2>
      
      <div className="filters-container">
        <div className="train-filters">
          <h3>Train Lines</h3>
          <div className="train-buttons">
            {trainLines.map(line => (
              <button
                key={line.id}
                className={`train-button ${selectedLine === line.id ? 'active' : ''}`}
                style={{ '--line-color': line.color }}
                onClick={() => {
                  setSelectedType('train');
                  setSelectedLine(selectedLine === line.id ? null : line.id);
                }}
              >
                {line.name}
              </button>
            ))}
          </div>
          
          {selectedLine && (
            <div className="direction-buttons">
              {['Inbound', 'Outbound'].map(direction => (
                <button
                  key={direction}
                  className={`direction-button ${selectedDirection === direction.toLowerCase() ? 'active' : ''}`}
                  onClick={() => setSelectedDirection(
                    selectedDirection === direction.toLowerCase() ? null : direction.toLowerCase()
                  )}
                >
                  {direction}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="bus-filters">
          <h3>Bus Routes</h3>
          <Form.Control
            type="text"
            placeholder="Search bus routes..."
            value={busSearch}
            onChange={(e) => {
              setSelectedType('bus');
              setBusSearch(e.target.value);
            }}
            className="bus-search"
          />
        </div>
      </div>

      <div className="alerts-grid">
        {filteredAlerts.length === 0 ? (
          <p className="no-alerts">No alerts match your current filters.</p>
        ) : (
          filteredAlerts.map(alert => (
            
            <Card
              key={alert.id}
              className={`alert-card ${getSeverityClass(alert.attributes.severity)}`}
            >
              <Card.Body>
                <Card.Title className="alert-header">
                  {alert.attributes.effect_name}
                </Card.Title>
                <Card.Text>{alert.attributes.header}</Card.Text>
                <div className="alert-severity">
                  Severity: {alert.attributes.severity}
                </div>
                <div className="alert-lifecycle">
                  Status: {alert.attributes.lifecycle || 'Unknown'}
                </div>
                <div className="alert-updated">
                  {alert.attributes.updated_at
                    ? `Updated ${formatDistanceToNow(new Date(alert.attributes.updated_at), { addSuffix: true })}`
                    : 'Update time unknown'}
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default Alerts;
