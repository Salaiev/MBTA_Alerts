// src/components/StationSelector.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StationSelector = ({ selectedLineId, setSelectedStationId }) => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedLineId) return;

    const fetchStations = async () => {
      try {
        const response = await axios.get(`/api/stations/${selectedLineId}`);
        setStations(response.data);
      } catch (error) {
        console.error('Failed to fetch stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [selectedLineId]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Select a Station</label>
      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : (
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 bg-white shadow-sm"
          onChange={(e) => setSelectedStationId(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>Select a station</option>
          {stations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default StationSelector;
