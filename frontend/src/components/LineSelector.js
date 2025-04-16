// src/components/LineSelector.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LineSelector = ({ setSelectedLineId }) => {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLines = async () => {
      try {
        const response = await axios.get('/api/lines'); // uses proxy
        setLines(response.data); // store the lines
      } catch (error) {
        console.error('Failed to fetch lines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLines();
  }, []);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Select a Line</label>
      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 bg-white shadow-sm"
          onChange={(e) => setSelectedLineId(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Select a line</option>
          {lines.map((line) => (
            <option key={line.id} value={line.id}>
              {line.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default LineSelector;
