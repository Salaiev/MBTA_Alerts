import React, { useState } from 'react';

const BusRouteInput = ({ setRouteId }) => {
  const [input, setInput] = useState('');

  const handleSearch = () => {
    const route = input.trim();
    if (route) {
      setRouteId(route);
    }
  };

  return (
    <div className="space-y-2">

      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>

      <label className="block text-sm font-medium text-gray-700">
        Enter Bus Route Number
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 66"
          className="flex-1 border border-gray-300 rounded px-4 py-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
      </form>
    </div>
  );
};

export default BusRouteInput;
