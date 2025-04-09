// src/pages/SchedulePage.js
import React from 'react';

const SchedulePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          MBTA Schedule Explorer
        </h1>

        {/* We'll insert components here in future steps */}
        <p className="text-center text-gray-500">
          Choose a subway line to begin.
        </p>
      </div>
    </div>
  );
};

export default SchedulePage;
