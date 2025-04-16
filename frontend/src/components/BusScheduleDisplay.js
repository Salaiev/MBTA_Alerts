import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BusScheduleDisplay = ({ stopId }) => {
  const [arrivals, setArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stopId) return;

    const fetchArrivals = async () => {
      try {
        const res = await axios.get(`/api/bus-arrivals/${stopId}`);
        setArrivals(res.data);
      } catch (err) {
        console.error('Failed to fetch bus arrivals:', err);
        setArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArrivals();
  }, [stopId]);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm space-y-2">
      <h2 className="text-lg font-semibold text-blue-700 text-center">
        Upcoming Bus Arrivals
      </h2>

      {loading && <p className="text-sm text-gray-500 text-center">Loading...</p>}

      {!loading && arrivals.length === 0 && (
        <p className="text-sm text-red-500 text-center">No upcoming arrivals.</p>
      )}

      {!loading && arrivals.map((arrival, index) => (
        <div
          key={index}
          className="flex justify-between text-gray-800 bg-white px-4 py-2 rounded shadow-sm"
        >
          <span>{arrival.time}</span>
          <span className="text-sm text-gray-500">{arrival.status}</span>
        </div>
      ))}
    </div>
  );
};
/// The BusScheduleDisplay component fetches and displays the bus schedule for a given stop ID
export default BusScheduleDisplay;
