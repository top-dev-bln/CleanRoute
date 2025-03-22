import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import debounce from 'lodash.debounce';

const TransportControls = ({ transportMode, setTransportMode }) => {
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Transport Mode</label>
      <div className="flex space-x-1">
        <button 
          onClick={() => setTransportMode('foot-walking')}
          className={`flex-1 p-1 text-xs rounded ${transportMode === 'foot-walking' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Walking
        </button>
        <button 
          onClick={() => setTransportMode('cycling-regular')}
          className={`flex-1 p-1 text-xs rounded ${transportMode === 'cycling-regular' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Cycling
        </button>
        <button 
          onClick={() => setTransportMode('driving-car')}
          className={`flex-1 p-1 text-xs rounded ${transportMode === 'driving-car' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
        >
          Driving
        </button>
      </div>
    </div>
  );
};

const SearchBar = ({ 
  startAddress, setStartAddress,
  endAddress, setEndAddress,
  retryGeolocation, resetPoints,
  fetchRoute, loading, start, end,
  transportMode, setTransportMode,
  API_URL,
  setStart, setEnd
}) => {
  console.log('API_URL:', API_URL);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearchField, setActiveSearchField] = useState(null);
  
  const searchAddress = async (query) => {
    if (!query || query.length < 3) return;
    
    setIsSearching(true);
    try {
      const response = await axios.get(`${API_URL}/geocode`, {
        params: { query }
      });
      setSearchResults(response.data);
    } catch (err) {
      console.error('Error searching for address:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };
  
  const debouncedSearch = useRef(
    debounce(searchAddress, 500)
  ).current;
  
  const handleStartAddressChange = (e) => {
    const value = e.target.value;
    setStartAddress(value);
    setActiveSearchField('start');
    debouncedSearch(value);
  };
  
  const handleEndAddressChange = (e) => {
    const value = e.target.value;
    setEndAddress(value);
    setActiveSearchField('end');
    debouncedSearch(value);
  };
  
  const selectSearchResult = (result) => {
    if (!result || !result.center) {
      console.error('Invalid search result:', result);
      return;
    }
    
    try {
      const [lng, lat] = result.center;
      
      if (activeSearchField === 'start') {
        console.log('Setting start location:', [lat, lng]);
        setStart([lat, lng]);
        setStartAddress(result.place_name);
      } else if (activeSearchField === 'end') {
        console.log('Setting end location:', [lat, lng]);
        setEnd([lat, lng]);
        setEndAddress(result.place_name);
      }
      
      setSearchResults([]);
      setActiveSearchField(null);
    } catch (err) {
      console.error('Error setting location from search result:', err);
    }
  };
  
  return (
    <div className="absolute top-4 left-16 w-80 md:w-96 z-50">
      <div className="bg-white rounded-lg shadow-lg p-3">
        <div className="mb-2">
          <div className="flex justify-between items-center">
            <label htmlFor="start-address" className="block text-sm font-medium text-gray-700 mb-1">Start</label>
            <button
              onClick={retryGeolocation}
              className="text-xs text-blue-500 hover:text-blue-700"
              title="Try to get your current location again"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              My Location
            </button>
          </div>
          <input
            type="text"
            id="start-address"
            className="w-full p-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your starting point"
            value={startAddress}
            onChange={handleStartAddressChange}
            onClick={() => setActiveSearchField('start')}
          />
        </div>
        
        <div className="mb-2">
          <label htmlFor="end-address" className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <input
            type="text"
            id="end-address"
            className="w-full p-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Where do you want to go?"
            value={endAddress}
            onChange={handleEndAddressChange}
            onClick={() => setActiveSearchField('end')}
          />
        </div>
        
        <TransportControls transportMode={transportMode} setTransportMode={setTransportMode} />
        
        {searchResults.length > 0 && activeSearchField && (
          <div className="absolute left-0 right-0 bg-white mt-0.5 rounded-md shadow-lg max-h-60 overflow-y-auto z-51">
            {searchResults.map((result, index) => (
              <div 
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => selectSearchResult(result)}
              >
                {result.place_name}
              </div>
            ))}
          </div>
        )}
        
        {isSearching && (
          <div className="text-center text-xs text-gray-500">Searching...</div>
        )}
        
        <div className="flex justify-between mt-2">
          <button 
            onClick={resetPoints}
            className="bg-gray-200 text-gray-700 px-2 py-1 text-sm rounded hover:bg-gray-300"
          >
            Reset
          </button>
          
          <button 
            onClick={fetchRoute}
            disabled={!start || !end || loading}
            className={`px-2 py-1 text-sm rounded ${!start || !end || loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
          >
            {loading ? 'Loading...' : 'Get Route'}
          </button>
        </div>
      </div>
    </div>
  );
};

function Map() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({ start: null, end: null });
  const routeLayerRef = useRef(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [error, setError] = useState('');
  const [pickingMode, setPickingMode] = useState('start');
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [transportMode, setTransportMode] = useState('foot-walking');
  const [loading, setLoading] = useState(false);
URL
  const API_URL = process.env.REACT_APP_API_URL ;

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
        const startMarker = L.marker(start, { draggable: true,icon: L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })})
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
        const endMarker = L.marker(end, { draggable: true, icon: L.icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        })})
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
      setLoading(true);
      
      const response = await axios.post(`${API_URL}/directions`, {
        start,
        end,
        profile: transportMode
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
    } finally {
      setLoading(false);
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
    setStartAddress('');
    setEndAddress('');
  };

  const retryGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStart([latitude, longitude]);
          setPickingMode('end');
          console.log(`Current location: Lat ${latitude}, Lng ${longitude}`);
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="relative h-screen w-full">
      <div className=" md:w-96 z-50" ref={mapRef} style={{ width: '100%', height: '100%' }}></div>
      
      <SearchBar 
        startAddress={startAddress}
        setStartAddress={setStartAddress}
        endAddress={endAddress}
        setEndAddress={setEndAddress}
        retryGeolocation={retryGeolocation}
        resetPoints={resetPoints}
        fetchRoute={fetchRoute}
        loading={loading}
        start={start}
        end={end}
        transportMode={transportMode}
        setTransportMode={setTransportMode}
        API_URL={API_URL}
        setStart={setStart}
        setEnd={setEnd}
      />

      
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Map;