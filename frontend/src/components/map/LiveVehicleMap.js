import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { fromLonLat } from 'ol/proj';
import { Style, Icon, Stroke, Circle as CircleStyle, Fill } from 'ol/style';
import Overlay from 'ol/Overlay';

const LiveVehicleMap = ({ routeId, stationId, direction }) => {
  const mapRef = useRef();
  const popupRef = useRef();
  const vehicleSource = useRef(new VectorSource());
  const routeSource = useRef(new VectorSource());
  const userLocationSource = useRef(new VectorSource());
  const overlayRef = useRef();
  const mapInstance = useRef();

  const statusMap = {
    IN_TRANSIT_TO: 'In Transit',
    STOPPED_AT: 'Stopped',
    INCOMING_AT: 'Approaching',
  };

  const directionMap = {
    0: 'Outbound',
    1: 'Inbound',
  };

  const lineColors = {
    Red: 'DA291C',
    Orange: 'ED8B00',
    Blue: '003DA5',
    Green: '00843D',
    Silver: 'A2AAAD',
  };

  useEffect(() => {
    if (!mapRef.current || !popupRef.current) return;

    overlayRef.current = new Overlay({
      element: popupRef.current,
      autoPan: true,
      autoPanAnimation: { duration: 250 },
    });

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        new VectorLayer({ source: routeSource.current }),
        new VectorLayer({ source: vehicleSource.current }),
        new VectorLayer({ source: userLocationSource.current }),
      ],
      view: new View({
        center: fromLonLat([-71.06, 42.36]),
        zoom: 13,
      }),
      overlays: [overlayRef.current],
    });

    mapInstance.current.on('singleclick', (evt) => {
      const feature = mapInstance.current.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const info = feature.get('vehicleInfo');
        if (info) {
          const coords = feature.getGeometry().getCoordinates();
          popupRef.current.innerHTML = `
            <div class="text-sm text-black leading-snug">
              <div><strong>Vehicle:</strong> ${info.id.slice(0, 6)}</div>
              <div><strong>Status:</strong> ${statusMap[info.status] || info.status}</div>
              <div><strong>Direction:</strong> ${directionMap[info.direction]}</div>
            </div>
          `;
          overlayRef.current.setPosition(coords);
        }
      } else {
        overlayRef.current.setPosition(undefined);
      }
    });

    // Show user location
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const userFeature = new Feature({
        geometry: new Point(fromLonLat([longitude, latitude])),
      });
      userFeature.setStyle(
        new Style({
          image: new CircleStyle({
            radius: 6,
            fill: new Fill({ color: '#0066cc' }),
            stroke: new Stroke({ color: '#ffffff', width: 2 }),
          }),
        })
      );
      userLocationSource.current.clear();
      userLocationSource.current.addFeature(userFeature);
    });

    return () => {
      mapInstance.current.setTarget(null);
    };
  }, []);

  useEffect(() => {
    if (!routeId || stationId === '') return;

    const isBus = /^[0-9]+$/.test(routeId);
    const routeName = routeId?.split('-')[0];
    const markerColor = isBus ? '8E24AA' : (lineColors[routeName] || '00843D');
    const iconName = isBus ? 'mdi:bus' : 'mdi:train-variant';
    const iconUrl = `https://api.iconify.design/${iconName}.svg?color=%23${markerColor}`;

    const fetchVehicles = async () => {
      try {
        const res = await fetch(`https://api-v3.mbta.com/vehicles?filter[route]=${routeId}`);
        const data = await res.json();
        if (!Array.isArray(data.data)) return;

        vehicleSource.current.clear();

        data.data
          .filter((v) => v.attributes.direction_id == direction)
          .forEach((v) => {
            const { latitude, longitude } = v.attributes;
            if (!latitude || !longitude) return;

            const feature = new Feature({
              geometry: new Point(fromLonLat([longitude, latitude])),
              vehicleInfo: {
                id: v.id,
                status: v.attributes.current_status,
                direction: v.attributes.direction_id,
              },
            });

            feature.setStyle(
              new Style({
                image: new Icon({ src: iconUrl, scale: 2.5 }),
              })
            );

            vehicleSource.current.addFeature(feature);
          });
      } catch (err) {
        console.error('Vehicle fetch error:', err.message);
      }
    };

    const fetchRouteLine = async () => {
      try {
        const res = await fetch(`https://api-v3.mbta.com/shapes?filter[route]=${routeId}&page[limit]=1`);
        const data = await res.json();
        if (!Array.isArray(data.data)) return;

        routeSource.current.clear();

        for (const shape of data.data) {
          if (!shape.attributes?.polyline) continue;

          const polyline = await import('@mapbox/polyline');
          const decoded = polyline.decode(shape.attributes.polyline);

          const line = new Feature({
            geometry: new LineString(decoded.map(([lat, lon]) => fromLonLat([lon, lat]))),
          });

          line.setStyle(
            new Style({
              stroke: new Stroke({
                color: `#${markerColor}`,
                width: 4,
              }),
            })
          );

          routeSource.current.addFeature(line);
        }
      } catch (err) {
        console.error('Route line fetch error:', err.message);
      }
    };

    fetchRouteLine();
    fetchVehicles();
    const interval = setInterval(fetchVehicles, 15000);
    return () => clearInterval(interval);
  }, [routeId, stationId, direction]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden shadow">
      <div ref={mapRef} className="w-full h-full" />
      <div
        ref={popupRef}
        className="absolute bg-white p-2 border border-gray-300 rounded shadow z-10"
        style={{ display: 'inline-block', minWidth: '160px' }}
      />
    </div>
  );
};

export default LiveVehicleMap;
