import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-400 h-32 flex items-center justify-center">
          <span className="text-4xl text-white">🚌</span>
          <h1 className="text-3xl font-bold text-white ml-3">MBTA Alerts</h1>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 mb-6 text-center">
            Stay informed with real-time MBTA updates right in your pocket.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl mb-4 font-semibold transition-shadow hover:shadow-lg"
          >
            Sign Up
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full border border-blue-600 text-blue-600 py-3 rounded-xl font-semibold transition-shadow hover:shadow-lg"
          >
            Login
          </button>
        </div>

        {/* Footer Features */}
        <div className="p-4 bg-gray-50 flex justify-around">
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">📋</span>
            <span className="text-xs text-gray-600">Routes</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">⚠️</span>
            <span className="text-xs text-gray-600">Alerts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
