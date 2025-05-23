import React, { useState } from 'react';
import LineSelector from '../LineSelector';
import StationSelector from '../StationSelector';
import DirectionSelector from '../DirectionSelector';
import ScheduleDisplay from '../ScheduleDisplay';
import BusRouteInput from '../BusRouteInput';
import BusStopSelector from '../BusStopSelector';
import BusScheduleDisplay from '../BusScheduleDisplay';
import LiveVehicleMap from '../map/LiveVehicleMap';

const MainSchedule = () => {
  const [mode, setMode] = useState('train');
  const [direction, setDirection] = useState('0');
  const [selectedLineId, setSelectedLineId] = useState('');
  const [selectedStationId, setSelectedStationId] = useState('');
  const [busRouteId, setBusRouteId] = useState('');
  const [selectedBusStopId, setSelectedBusStopId] = useState('');

  const activeRouteId = mode === 'train' ? selectedLineId : busRouteId;
  const activeStopId = mode === 'train' ? selectedStationId : selectedBusStopId;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center pt-10 px-4">
      <div className="w-full max-w-7xl bg-white rounded-xl shadow p-6 flex flex-col lg:flex-row gap-6">

        {/* Left Column */}
        <div className="w-full lg:w-[38%] space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            MBTA Schedule Explorer
          </h1>

          {/* Mode Toggle */}
          <div className="flex justify-center gap-4">
            <button
              className={`px-4 py-2 rounded-lg ${
                mode === 'train' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => {
                setMode('train');
                setBusRouteId('');
                setSelectedBusStopId('');
              }}
            >
              Train
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                mode === 'bus' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
              onClick={() => {
                setMode('bus');
                setSelectedLineId('');
                setSelectedStationId('');
                setDirection('0');
              }}
            >
              Bus
            </button>
          </div>

          {/* Train Mode */}
          {mode === 'train' && (
            <>
              <LineSelector setSelectedLineId={setSelectedLineId} />
              {selectedLineId && (
                <>
                  <StationSelector
                    selectedLineId={selectedLineId}
                    setSelectedStationId={setSelectedStationId}
                  />
                  <DirectionSelector
                    direction={direction}
                    setDirection={setDirection}
                  />
                </>
              )}
              {selectedStationId && (
                <ScheduleDisplay
                  stationId={selectedStationId}
                  direction={direction}
                />
              )}
            </>
          )}

          {/* Bus Mode */}
          {mode === 'bus' && (
            <>
              <BusRouteInput setRouteId={setBusRouteId} />
              {busRouteId && (
                <BusStopSelector
                  routeId={busRouteId}
                  setSelectedStopId={setSelectedBusStopId}
                />
              )}
              {selectedBusStopId && (
                <BusScheduleDisplay stopId={selectedBusStopId} />
              )}
            </>
          )}
        </div>

        {/* Right Column - Big Map */}
        <div className="w-full lg:w-[62%] h-[650px]">
         
            <LiveVehicleMap
              routeId={activeRouteId}
              stationId={activeStopId}
              direction={direction}
            />
          
        </div>
      </div>
    </div>
  );
};

export default MainSchedule;
