// src/components/ScheduleDisplay.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ScheduleDisplay = ({ stationId, direction }) => {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stationId || direction === null) return;

    const fetchArrivals = async () => {
      try {
        const res = await axios.get(`/api/arrivals/${stationId}?direction=${direction}`);
        setArrivals(res.data);
      } catch (err) {
        console.error('Failed to fetch arrivals:', err);
        setArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArrivals();
  }, [stationId, direction]);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm space-y-2">
      <h2 className="text-lg font-semibold text-blue-700 text-center">
        Upcoming Arrivals
      </h2>

      {loading && <p className="text-sm text-gray-500 text-center">Loading...</p>}

      {!loading && arrivals.length === 0 && (
        <p className="text-sm text-red-500 text-center">No upcoming arrivals.</p>
      )}

      {!loading &&
        arrivals.map((arrival, idx) => (
          <div
            key={idx}
            className="flex justify-between text-gray-800 bg-white px-4 py-2 rounded shadow-sm"
          >
            <span>{arrival.time}</span>
            <span className="text-sm text-gray-500">{arrival.status}</span>
          </div>
        ))}
    </div>
  );
};

export default ScheduleDisplay;
