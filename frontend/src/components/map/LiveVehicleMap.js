// src/components/map/LiveVehicleMap.js

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import shadow from 'leaflet/dist/images/marker-shadow.png';

// 🔧 Fix default marker icon paths for Webpack/Vite
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: shadow,
});

const LiveVehicleMap = ({ routeId }) => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    if (!routeId) return;

    const fetchVehicles = async () => {
      try {
        const res = await axios.get(
          `https://api-v3.mbta.com/vehicles?filter[route]=${routeId}`
        );
        setVehicles(res.data.data);
      } catch (err) {
        console.error('Error fetching vehicles:', err.message);
      }
    };

    fetchVehicles();
    const interval = setInterval(fetchVehicles, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, [routeId]);

  return (
    <MapContainer center={[42.36, -71.06]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {vehicles.map((v) => {
        const { latitude, longitude } = v.attributes;
        if (!latitude || !longitude) return null;

        return (
          <Marker key={v.id} position={[latitude, longitude]}>
            <Popup>
              Vehicle ID: {v.id}<br />
              Status: {v.attributes.current_status}<br />
              Direction: {v.attributes.direction_id}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default LiveVehicleMap;
