
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';


function Map() {

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({ start: null, end: null });
  const routeLayerRef = useRef(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [error, setError] = useState('');
  const [pickingMode, setPickingMode] = useState('start'); 

  const API_URL = import.meta.env.VITE_API_URL;
  

  useEffect(() => {
    mapInstance.current = L.map(mapRef.current).setView([46.77, 23.58], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstance.current) return;
    
    const clickHandler = (e) => {
      const { lat, lng } = e.latlng;
      
      if (pickingMode === 'start') {
        setStart([lat, lng]);
        setPickingMode('end');
        console.log(`Start: Lat ${lat}, Lng ${lng}`);
      } else if (pickingMode === 'end') {
        setEnd([lat, lng]);
        setPickingMode('done');
        console.log(`End: Lat ${lat}, Lng ${lng}`);
        mapInstance.current.off('click', clickHandler);
      }
    };
    

    mapInstance.current.on('click', clickHandler);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.off('click', clickHandler);
      }
    };
  }, [pickingMode]);

  useEffect(() => {

    if (start) {
      if (markersRef.current.start) {

        markersRef.current.start.setLatLng(start);
      } else {

        const startMarker = L.marker(start, { draggable: true })
          .addTo(mapInstance.current)
          .bindPopup("Start").openPopup();

        startMarker.on('dragend', (e) => {
          const { lat, lng } = e.target.getLatLng();
          setStart([lat, lng]);
          console.log(`Start moved: Lat ${lat}, Lng ${lng}`);
        });

        markersRef.current.start = startMarker;
      }
    }

    if (end) {
      if (markersRef.current.end) {

        markersRef.current.end.setLatLng(end);
      } else {

        const endMarker = L.marker(end, { draggable: true })
          .addTo(mapInstance.current)
          .bindPopup("End").openPopup();

        endMarker.on('dragend', (e) => {
          const { lat, lng } = e.target.getLatLng();
          setEnd([lat, lng]);
          console.log(`End moved: Lat ${lat}, Lng ${lng}`);
        });

        markersRef.current.end = endMarker;
      }
    }
  }, [start, end]);


  const fetchRoute = async () => {
    if (!start || !end) return;

    try {
      console.log("Fetching route from server...");
      setError(''); 
      
      const response = await axios.post(`${API_URL}/directions`, {
        start,
        end,
        profile: 'foot-walking'
      });
      
      console.log("Route response:", response.data);


      if (routeLayerRef.current) {
        mapInstance.current.removeLayer(routeLayerRef.current);
      }

      if (response.data && response.data.features && response.data.features.length > 0) {
        routeLayerRef.current = L.geoJSON(response.data).addTo(mapInstance.current);
        

        const bounds = routeLayerRef.current.getBounds();
        mapInstance.current.fitBounds(bounds, { padding: [30, 30] });
      } else {
        setError("No route found between these points.");
      }
    } catch (err) {
      console.error("Error fetching route:", err.response?.data || err.message);
      

      if (err.response?.data?.details?.error?.message) {
        setError(`Route error: ${err.response.data.details.error.message}`);
      } else {
        setError("Failed to fetch route. Please try different points or try again later.");
      }
    }
  };

  useEffect(() => {
    if (start && end) {
      fetchRoute();
    }
  }, [start, end]);

  const resetPoints = () => {
    if (markersRef.current.start) {
      mapInstance.current.removeLayer(markersRef.current.start);
      markersRef.current.start = null;
    }
    if (markersRef.current.end) {
      mapInstance.current.removeLayer(markersRef.current.end);
      markersRef.current.end = null; 
    }
    if (routeLayerRef.current) {
      mapInstance.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    setStart(null);
    setEnd(null);
    setPickingMode('start');
    setError('');
  };

  return (
    <div className="relative h-screen w-full">
      <div ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
      
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
        {pickingMode === 'start' && <p>Click to set start point</p>}
        {pickingMode === 'end' && <p>Click to set end point</p>}
        {pickingMode === 'done' && (
          <button 
            onClick={resetPoints}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Reset Points
          </button>
        )}
      </div>
      
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Map