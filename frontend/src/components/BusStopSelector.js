import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BusStopSelector = ({ routeId, setSelectedStopId }) => {
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
 //  const [error, setError] = useState(null);
  // const [selectedStopId, setSelectedStopId] = useState(null);
  useEffect(() => {
    if (!routeId) return;

    const fetchStops = async () => {
      try {
        const res = await axios.get(`/api/bus-stops/${routeId}`);
        setStops(res.data);
      } catch (error) {
        console.error('Failed to fetch bus stops:', error);
        setStops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStops();
  }, [routeId]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Select a Bus Stop
      </label>
      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : stops.length === 0 ? (
        <div className="text-sm text-red-500">No stops found for this route.</div>
      ) : (
        <select
          onChange={(e) => setSelectedStopId(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
          defaultValue=""
        >
          <option value="" disabled>Select a stop</option>
          {stops.map((stop) => (
            <option key={stop.id} value={stop.id}>
              {stop.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default BusStopSelector;
