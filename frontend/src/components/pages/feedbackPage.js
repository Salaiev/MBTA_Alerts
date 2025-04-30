import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import getUserInfo from '../../utilities/decodeJwt';
import '../../css/feedback.css';

const FeedbackPage = () => {
  const [transportType, setTransportType] = useState('train');
  const [selectedLine, setSelectedLine] = useState('');
  const [selectedStation, setSelectedStation] = useState('');
  const [lines, setLines] = useState([]);
  const [stations, setStations] = useState([]);
  const [feedbackPosts, setFeedbackPosts] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const userInfo = getUserInfo();
    setUser(userInfo);
  }, []);

  useEffect(() => {
    const fetchLines = async () => {
      setLoading(true);
      setError('');
      try {
        let endpoint = transportType === 'train' 
          ? 'https://api-v3.mbta.com/routes?filter[type]=0,1'
          : 'https://api-v3.mbta.com/routes?filter[type]=3';
        
        const response = await axios.get(endpoint);
        const lineList = response.data.data.map(line => ({
          id: line.id,
          name: line.attributes.long_name || line.attributes.short_name
        }));
        setLines(lineList);
        setSelectedLine('');
        setSelectedStation('');
      } catch (err) {
        setError('Failed to load lines. Please try again later.');
        console.error('Error fetching lines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLines();
  }, [transportType]);

  useEffect(() => {
    const fetchStations = async () => {
      if (!selectedLine) {
        setStations([]);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`https://api-v3.mbta.com/stops?filter[route]=${selectedLine}`);
        const stationList = response.data.data.map(station => ({
          id: station.id,
          name: station.attributes.name
        }));
        setStations(stationList);
      } catch (err) {
        setError('Failed to load stations. Please try again later.');
        console.error('Error fetching stations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [selectedLine]);

  useEffect(() => {
    const fetchFeedbackPosts = async () => {
      if (!selectedStation) return;

      setLoading(true);
      setError('');
      try {
        const response = await axios.get('http://localhost:8081/api/feedback/getPost');
        const filteredPosts = response.data.filter(post => post.Station === selectedStation);
        setFeedbackPosts(filteredPosts);
      } catch (err) {
        setError('Failed to load feedback. Please try again later.');
        console.error('Error fetching feedback posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbackPosts();
  }, [selectedStation]);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedStation || !user) {
      setError('Please log in and fill out all fields to submit feedback.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const feedbackData = {
        username: user.username,
        comment: newComment.trim(),
        station: selectedStation
      };

      await axios.post('http://localhost:8081/api/feedback/createPost', feedbackData);

      // ✅ Updated only this part:
      setFeedbackPosts(prev => [
        ...prev,
        { ...feedbackData, postDate: new Date().toISOString() }
      ]);

      setNewComment('');
      setSuccess('Your feedback has been submitted successfully!');
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-container">
      <h2 className="mb-4">Station Feedback</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="filter-section">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Transport Type</Form.Label>
            <Form.Select 
              value={transportType} 
              onChange={(e) => setTransportType(e.target.value)}
              disabled={loading}
            >
              <option value="train">Subway</option>
              <option value="bus">Bus</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{transportType === 'train' ? 'Line' : 'Route'}</Form.Label>
            <Form.Select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              disabled={loading}
            >
              <option value="">Select {transportType === 'train' ? 'a line' : 'a route'}</option>
              {lines.map(line => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Station</Form.Label>
            <Form.Select
              value={selectedStation}
              onChange={(e) => setSelectedStation(e.target.value)}
              disabled={!selectedLine || loading}
            >
              <option value="">Select a station</option>
              {stations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </div>

      {selectedStation && (
        <div className="feedback-section">
          <h3>Feedback for <span className="station-name">
            {stations.find(s => s.id === selectedStation)?.name}
          </span></h3>
          
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <div className="feedback-list">
              {feedbackPosts.length === 0 ? (
                <div className="no-feedback">
                  No feedback yet for this station.
                </div>
              ) : (
                feedbackPosts.map(post => (
                  <Card key={post._id || post.comment} className="feedback-card">
                    <Card.Body>
                      <Card.Title>{post.username}</Card.Title>
                      <Card.Text>{post.comment}</Card.Text>
                      <div className="feedback-timestamp">
                        {new Date(post.postDate).toLocaleString()}
                      </div>
                    </Card.Body>
                  </Card>
                ))
              )}
            </div>
          )}

          {user ? (
            <Form onSubmit={handleSubmitFeedback} className="feedback-form">
              <Form.Group className="mb-3">
                <Form.Label>Add Your Feedback</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience..."
                  disabled={loading}
                />
              </Form.Group>
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading || !newComment.trim()}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </Form>
          ) : (
            <Alert variant="info" className="mt-4">
              Please log in to leave feedback. You can still view all feedback without logging in.
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;