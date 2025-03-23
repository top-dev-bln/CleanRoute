import React, { useEffect, useRef, useState } from 'react';
import {Link} from 'react-router-dom';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import debounce from 'lodash.debounce';
import { getUserLocation, getAddressFromCoords } from './utils/locationUtils';
import { SearchBar } from './map/SearchBar';
import { TransportControls } from './map/TransportControls';
import { AirQualityControl } from './map/AirQualityControl';

import { getAQIColor, displayAirSensorsOnMap } from './utils/airQualityUtils';

// Server API URL - update this to your actual server URL
const API_URL = 'https://cleanroute-api.vercel.app/api';

const Map = () => {
  // Core refs
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({ start: null, end: null });
  const routeLayerRef = useRef(null);
  const airSensorsLayerRef = useRef(null);
  
  // Location states
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  
  // UI states
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [transportMode, setTransportMode] = useState('foot-walking');
  const [showAirSensors, setShowAirSensors] = useState(false);
  const [loadingAirSensors, setLoadingAirSensors] = useState(false);
  
  // Add new state for healthy routing
  const [useHealthyRoute, setUseHealthyRoute] = useState(false);
  const [loadingHealthyRoute, setLoadingHealthyRoute] = useState(false);
  const healthyRouteLayerRef = useRef(null);
  
  // Add a new state for route-specific matrix
  const [routeMatrixVisible, setRouteMatrixVisible] = useState(false);
  const routeMatrixLayerRef = useRef(null);
  
  // Initialize map
  useEffect(() => {
    mapInstance.current = L.map(mapRef.current).setView([46.77, 23.58], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);
    
    initializeLocation();
    
    return () => {
      if (mapInstance.current) mapInstance.current.remove();
    };
  }, []);
  
  // Initialize user location
  const initializeLocation = async () => {
    try {
      const location = await getUserLocation(
        API_URL,
        handleLocationSuccess,
        handleLocationError,
        handleLocationFallback
      );
      setStart([location.lat, location.lng]);
    } catch (err) {
      console.error("Location initialization failed:", err);
      setError('Location services unavailable. Please enter your starting point manually.');
    }
  };
  
  // Location callbacks
  const handleLocationSuccess = (locationData) => {
    console.log(`Successfully got location from ${locationData.source}`);
    mapInstance.current.setView([locationData.lat, locationData.lng], 15);
    getAddressFromCoords(API_URL, locationData.lng, locationData.lat)
      .then(address => setStartAddress(address || 'Current Location'))
      .catch(() => setStartAddress('Current Location'));
  };
  
  const handleLocationError = (error) => {
    console.error("Location error:", error);
    setError('Could not determine your location. Please enter your starting point manually.');
    setTimeout(() => setError(''), 7000);
  };
  
  const handleLocationFallback = (fallbackData) => {
    console.log(`Using fallback location from ${fallbackData.source}`);
    mapInstance.current.setView([fallbackData.lat, fallbackData.lng], 13);
    setStartAddress(fallbackData.place_name || 'Default Location');
    setError('Could not determine your precise location. Using a default location instead.');
    setTimeout(() => setError(''), 5000);
  };
  
  // Handle markers when coordinates change
  useEffect(() => {
    updateMarker('start', start);
  }, [start]);
  
  useEffect(() => {
    updateMarker('end', end);
  }, [end]);
  
  // Update markers helper
  const updateMarker = (type, position) => {
    if (!position || !mapInstance.current) return;
    
    if (markersRef.current[type]) {
      markersRef.current[type].setLatLng(position);
    } else {
      const marker = L.marker(position, { draggable: true ,icon: L.icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })}).addTo(mapInstance.current)
        .bindPopup(type === 'start' ? "Start" : "End")
        .openPopup();

      
      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        if (type === 'start') {
          setStart([lat, lng]);
          updateAddressFromCoords(lng, lat, setStartAddress);
        } else {
          setEnd([lat, lng]);
          updateAddressFromCoords(lng, lat, setEndAddress);
        }
      });
      
      markersRef.current[type] = marker;
    }
  };
  
  // Update address from coordinates
  const updateAddressFromCoords = async (lng, lat, setAddressFunc) => {
    try {
      const address = await fetchReverseGeocode(lng, lat);
      setAddressFunc(address);
    } catch (err) {
      console.error('Error getting address:', err);
    }
  };
  
  // Fetch route when start, end or transportMode changes
  useEffect(() => {
    if (start && end) fetchRoute();
  }, [start, end, transportMode]);
  
  // Map click handler for setting end point
  useEffect(() => {
    if (!mapInstance.current) return;
    
    const handleMapClick = (e) => {
      if (!end) {
        const { lat, lng } = e.latlng;
        setEnd([lat, lng]);
        updateAddressFromCoords(lng, lat, setEndAddress);
      }
    };
    
    mapInstance.current.on('click', handleMapClick);
    return () => {
      if (mapInstance.current) mapInstance.current.off('click', handleMapClick);
    };
  }, [end]);
  
  // Air quality sensors logic
  useEffect(() => {
    if (!mapInstance.current || !showAirSensors) return;
    
    const handleMapMove = debounce(() => fetchAirSensors(), 500);
    mapInstance.current.on('moveend', handleMapMove);
    
    fetchAirSensors();
    
    return () => {
      if (mapInstance.current) mapInstance.current.off('moveend', handleMapMove);
    };
  }, [mapInstance.current, showAirSensors]);

  // Add a useEffect to preserve routes when showing air quality
  useEffect(() => {
    // When air quality sensors are toggled, ensure the route remains visible if it exists
    if (routeLayerRef.current && mapInstance.current) {
      // Bring route layer to front
      routeLayerRef.current.bringToFront();
    }
  }, [showAirSensors]);

   // Add a new useEffect that resets the healthy route when start or end changes
  useEffect(() => {
    // Reset healthy route when start or end location is changed
    if (healthyRouteLayerRef.current) {
      mapInstance.current.removeLayer(healthyRouteLayerRef.current);
      healthyRouteLayerRef.current = null;
    }
    
    // Also reset any route-specific matrix
    if (routeMatrixLayerRef.current) {
      mapInstance.current.removeLayer(routeMatrixLayerRef.current);
      routeMatrixLayerRef.current = null;
      setRouteMatrixVisible(false);
    }
    
    // Reset the healthy route state
    setUseHealthyRoute(false);
    
  }, [start, end]); // This effect runs whenever start or end changes
  
  // Reset route points
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
    setEnd(null);
    setEndAddress('');
    setError('');
  };
  
  // Core data fetching functions
  const fetchReverseGeocode = async (lng, lat) => {
    try {
      const response = await axios.get(`${API_URL}/reverse-geocode`, {
        params: { lng, lat }
      });
      return response.data.place_name;
    } catch (err) {
      console.error('Error in reverse geocoding:', err);
      throw err;
    }
  };
  
  const fetchRoute = async () => {
    if (!start || !end) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Log coordinates for debugging
      console.log('Fetching route with coordinates:', {
        start: start,
        end: end,
        profile: transportMode
      });
      
      // Ensure coordinates are valid arrays
      if (!Array.isArray(start) || !Array.isArray(end) || start.length !== 2 || end.length !== 2) {
        throw new Error('Invalid coordinates format');
      }
      
      const response = await axios.post(`${API_URL}/directions`, {
        start,
        end,
        profile: transportMode
      }, {
        timeout: 20000 // Increase timeout to 20 seconds
      });
      console.log('Route response:', response.data);
      
      if (routeLayerRef.current) {
        mapInstance.current.removeLayer(routeLayerRef.current);
      }
      
      if (response.data && response.data.features && response.data.features.length > 0) {
        const routeCoordinates = response.data.features[0].geometry.coordinates;
        console.log('Route coordinates received:', routeCoordinates);

        // Add the route to the map
        routeLayerRef.current = L.geoJSON(response.data).addTo(mapInstance.current);
        
        // Style the route
        if (routeLayerRef.current) {
          routeLayerRef.current.setStyle({
            color: '#3388ff',
            weight: 6,
            opacity: 0.7
          });
          
          // Ensure route is above air quality markers
          routeLayerRef.current.bringToFront();
        }
        
        const bounds = routeLayerRef.current.getBounds();
        mapInstance.current.fitBounds(bounds, { padding: [30, 30] });
      } else {
        setError("No route found between these points.");
      }
    } catch (err) {
      console.error("Error fetching route:", err.response?.data || err.message);
      
      // Special handling for rate limit errors
      if (err.response?.status === 429) {
        setError("Service is busy. Please wait a minute and try again (API rate limit reached).");
      } else if (err.response?.data?.details?.error?.message) {
        setError(`Route error: ${err.response.data.details.error.message}`);
      } else {
        setError("Failed to fetch route. Please try different points or try again later.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAirSensors = async () => {
    if (!mapInstance.current) return;
    
    setLoadingAirSensors(true);
    try {
      const bounds = mapInstance.current.getBounds();
      const params = {
        minLat: bounds.getSouth().toFixed(6),
        minLng: bounds.getWest().toFixed(6),
        maxLat: bounds.getNorth().toFixed(6),
        maxLng: bounds.getEast().toFixed(6)
      };
      
      const response = await axios.get(`${API_URL}/air-sensors`, {
        params: params,
        timeout: 10000
      });
      
      if (response.data) {
        // Log detailed information about each sensor to the console
        console.log('=== AIR QUALITY SENSORS ===');
        console.log('Total sensors found:', response.data.length);
        
        // Create a table in console for better readability
        console.table(
          response.data.map(sensor => ({
            Station: sensor.station?.name || 'Unknown',
            Latitude: sensor.lat,
            Longitude: sensor.lon,
            AQI: sensor.aqi,
            URL: sensor.station?.url || 'N/A'
          }))
        );
        
        // Also log raw data for advanced inspection
        console.log('Raw sensor data:');
        response.data.forEach((sensor, index) => {
          console.log(`Sensor #${index + 1}: lat=${sensor.lat.toFixed(6)}, lon=${sensor.lon.toFixed(6)}, aqi=${sensor.aqi}`);
        });
        
        // Save the current route if it exists so we can restore it
        const currentRoute = routeLayerRef.current;
        
        displayAirSensorsOnMap(
          response.data, 
          mapInstance.current, 
          airSensorsLayerRef, 
          showAirSensors, 
          API_URL
        );
        
        // Make sure the route stays on top of air quality markers
        if (currentRoute) {
          currentRoute.bringToFront();
        }
      }
    } catch (err) {
      console.error('Error fetching air sensors:', err);
      setError('Failed to load air quality sensors. ' + (err.response?.data?.error || err.message));
    } finally {
      setLoadingAirSensors(false);
    }
  };
  
  // Funcție helper pentru a obține descrierea calității aerului
  const getAirQualityDescription = (pm10) => {
    if (pm10 <= 20) return "Bună";
    if (pm10 <= 50) return "Moderată";
    if (pm10 <= 100) return "Nesănătoasă pentru grupuri sensibile";
    if (pm10 <= 150) return "Nesănătoasă";
    if (pm10 <= 200) return "Foarte nesănătoasă";
    return "Periculoasă";
  };
  
  const toggleAirSensors = () => {
    const newState = !showAirSensors;
    setShowAirSensors(newState);
    
    if (newState) {
      console.log('Showing air quality sensors...');
      fetchAirSensors();
    } else if (airSensorsLayerRef.current && mapInstance.current) {
      console.log('Hiding air quality sensors');
      mapInstance.current.removeLayer(airSensorsLayerRef.current);
      airSensorsLayerRef.current = null;
      
      // Re-fetch the route if start and end points exist to ensure it's displayed properly
      if (start && end) {
        fetchRoute();
      }
    }
  };
  
  const retryGeolocation = async () => {
    setError('Trying to get your location...');
    try {
      await getUserLocation(
        API_URL,
        handleLocationSuccess,
        handleLocationError,
        handleLocationFallback
      );
    } catch (err) {
      console.error("Location retry failed:", err);
      setError('Location services unavailable. Please enter your starting point manually.');
    }
  };
  
  // Add a new function to fetch a healthy route
  const fetchHealthyRoute = async () => {
    if (!start || !end) {
      setError("Please set start and end points first.");
      return;
    }
    
    setLoadingHealthyRoute(true);
    setError('');
    
    try {
      console.log('Fetching healthy route from', start, 'to', end);
      
      // Make sure air quality is enabled when finding a healthy route
      if (!showAirSensors) {
        toggleAirSensors(); // Turn on air quality visualization first
      }
      
      // First ensure we have a regular route calculated
      if (!routeLayerRef.current) {
        await fetchRoute();
      }
      
      const response = await axios.post(`${API_URL}/healthy-route`, {
        start,
        end,
        profile: transportMode
      }, { 
        timeout: 45000 // Increase timeout to 45 seconds for this complex operation
      });
      
      if (healthyRouteLayerRef.current) {
        mapInstance.current.removeLayer(healthyRouteLayerRef.current);
      }
      
      if (response.data && response.data.route) {
        console.log('Healthy route received:', response.data);
        
        // Add the healthier route to the map with a different color
        healthyRouteLayerRef.current = L.geoJSON(response.data.route).addTo(mapInstance.current);
        
        // Style the healthy route differently (green color)
        if (healthyRouteLayerRef.current) {
          healthyRouteLayerRef.current.setStyle({
            color: '#4ade80', // Green color
            weight: 6,
            opacity: 0.8,
            dashArray: '10, 5' // Dashed line
          });
          
          // If we have both routes, zoom to show both
          if (routeLayerRef.current) {
            // Create a bounds object that includes both routes
            const standardBounds = routeLayerRef.current.getBounds();
            const healthyBounds = healthyRouteLayerRef.current.getBounds();
            const combinedBounds = standardBounds.extend(healthyBounds);
            
            // Fit the map to show both routes
            mapInstance.current.fitBounds(combinedBounds, { padding: [30, 30] });
          }
        }
        
        // Generate a route-specific matrix
        await generateRouteMatrix(response.data.route, response.data.metrics);
        
        // Show health metrics
        if (response.data.metrics) {
          console.log('Route health comparison:', response.data.metrics);
          const { standard, healthy } = response.data.metrics;
          
          // Show message about the health benefit
          const benefitPercent = Math.round(((standard.avgAqi - healthy.avgAqi) / standard.avgAqi) * 100);
          
          
        }
      } else {
        setError("Could not find a healthier alternative route.");
      }
    } catch (err) {
      console.error("Error fetching healthy route:", err.response?.data || err.message);
      
      // Special handling for rate limit errors
      if (err.response?.status === 429) {
        setError("Service is busy. Please wait a minute and try again (API rate limit reached).");
      } else {
        setError("Failed to calculate a healthier route. " + (err.response?.data?.error || err.message));
      }
    } finally {
      setLoadingHealthyRoute(false);
    }
  };

  // Add a new function to generate air quality matrix around both routes
  const generateRouteMatrix = async (healthyRouteGeoJSON, metrics) => {
    try {
      // Create bounds that include both standard and healthy routes
      // Create a combined bounds for both routes
      const standardRouteBounds = routeLayerRef.current.getBounds();
      const healthyRouteBounds = L.geoJSON(healthyRouteGeoJSON).getBounds();
      
      const combinedBounds = standardRouteBounds.extend(healthyRouteBounds).pad(0.3);
      
      // Get matrix data focused on the route area
      const params = {
        minLat: combinedBounds.getSouth().toFixed(6),
        minLng: combinedBounds.getWest().toFixed(6),
        maxLat: combinedBounds.getNorth().toFixed(6),
        maxLng: combinedBounds.getEast().toFixed(6),
        gridSize: 40 // Higher density for route-specific matrix
      };
      
      console.log('Fetching route-specific AQI data with params:', params);
      
      const response = await axios.get(`${API_URL}/kriging-matrix`, {
        params: params,
        timeout: 15000
      });
      
      if (response.data && response.data.matrix) {
        console.log('Route-specific matrix received:', response.data.matrix.length, 'points');
        
        // Ensure both routes are visible above the matrix
        if (routeLayerRef.current) {
          routeLayerRef.current.bringToFront();
        }
        if (healthyRouteLayerRef.current) {
          healthyRouteLayerRef.current.bringToFront();
        }
        
        // Show comparison lines between the routes
        if (metrics) {
          // Add labels to show route AQI values at various points
          addAqiComparisonLabels(metrics);
        }
      }
    } catch (err) {
      console.error('Error generating route matrix:', err);
    }
  };

  // Helper to add AQI comparison labels
  const addAqiComparisonLabels = (metrics) => {
    // Implementation left out for brevity, but this would add
    // labels at key points showing the AQI difference between routes
  };

  // Add toggle handler for healthy route feature
  const toggleHealthyRoute = () => {
    if (useHealthyRoute) {
      // Turn off healthy route and remove it from map
      if (healthyRouteLayerRef.current) {
        mapInstance.current.removeLayer(healthyRouteLayerRef.current);
        healthyRouteLayerRef.current = null;
      }
      
      // Also hide route matrix if it exists
      if (routeMatrixLayerRef.current) {
        mapInstance.current.removeLayer(routeMatrixLayerRef.current);
        routeMatrixLayerRef.current = null;
        setRouteMatrixVisible(false);
      }
      
      setUseHealthyRoute(false);
    } else {
      // Calculate and show healthy route
      fetchHealthyRoute();
      setUseHealthyRoute(true);
    }
  };
  
  // Props for child components
  const searchProps = {
    startAddress,
    setStartAddress,
    endAddress,
    setEndAddress,
    retryGeolocation,
    resetPoints,
    fetchRoute,
    loading,
    start,
    end,
    transportMode,
    setTransportMode,
    API_URL,
    setStart, // Add this
    setEnd    // Add this
  };
  
  const transportProps = {
    transportMode,
    setTransportMode
  };
  
  const airQualityProps = {
    showAirSensors,
    toggleAirSensors,
    loadingAirSensors,
    // Add these new props
    useHealthyRoute,
    toggleHealthyRoute,
    loadingHealthyRoute,
    canShowHealthyRoute: Boolean(start && end) // Only enable button when start/end are set
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div className="relative h-screen w-full">
      {/* Map */}
      <div ref={mapRef} className="w-full h-full absolute top-0 left-0 z-1"></div>
      
      {/* Search UI */}
      <SearchBar {...searchProps} />
      
      {/* Air Quality Controls - now includes the Healthy Route button */}
      <AirQualityControl {...airQualityProps} />
      

      
      {/* Error Message */}
      {error && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-700 px-4 py-2 rounded max-w-md w-full z-50">
          {error}
        </div>
      )}

<div className="fixed bottom-4 right-4 z-50">
  <button 
    className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center"
    onClick={() => setDropdownOpen(!dropdownOpen)}
  >
      <img src="data:image/jpeg;base64,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" alt="Menu" className="w-full h-full object-cover rounded-full" />

  </button>

  {/* Dropdown menu */}
  {dropdownOpen && (
    <div className="absolute bottom-16 right-0 bg-white shadow-lg rounded-md p-3">
      <ul>
        <Link to="/profile">
        <li className="p-2 hover:bg-gray-200 cursor-pointer">Profile</li>
        </Link>
        <Link to="/Subscription">
        <li className="p-2 hover:bg-gray-200 cursor-pointer">Subscriptions</li>
        </Link>
        <Link to="/settings">
        <li className="p-2 hover:bg-gray-200 cursor-pointer">Settings</li>
        </Link>
      </ul>
    </div>
  )}
</div>
    </div>
  );
};

export default Map;