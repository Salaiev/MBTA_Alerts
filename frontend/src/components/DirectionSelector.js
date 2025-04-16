// This component allows the user to select between two directions: "Outbound" and "Inbound".
// It uses a button group to toggle between the two options, and the selected option is highlighted with a different style.
import React from 'react';

const DirectionSelector = ({ direction, setDirection }) => {
  return (
    <div className="flex gap-4 justify-center">
      {['0', '1'].map((dir) => (
        <button
          key={dir}
          onClick={() => setDirection(dir)}
          className={`px-4 py-2 rounded-lg font-medium transition-all
            ${
              direction === dir
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
        >
          {dir === '0' ? 'Outbound' : 'Inbound'}
        </button>
      ))}
    </div>
  );
};

export default DirectionSelector;
