import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import debounce from 'lodash.debounce';
import { Link } from 'react-router-dom';

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <div>
      <div className="absolute top-4 left-16 w-80 md:w-96 z-50">
  {/* Caseta albă cu search bar */}
  <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md mx-auto">
    <div className="mb-3">
      <div className="flex justify-between items-center">
        <label htmlFor="start-address" className="block text-base font-medium text-gray-700">Start</label>
        <button
          onClick={retryGeolocation}
          className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
          title="Try to get your current location again"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          My Location
        </button>
      </div>
      <input
        type="text"
        id="start-address"
        className="w-full p-2 text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Your starting point"
        value={startAddress}
        onChange={handleStartAddressChange}
        onClick={() => setActiveSearchField('start')}
      />
    </div>

    <div className="mb-3">
      <label htmlFor="end-address" className="block text-base font-medium text-gray-700">Destination</label>
      <input
        type="text"
        id="end-address"
        className="w-full p-2 text-base border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        placeholder="Where do you want to go?"
        value={endAddress}
        onChange={handleEndAddressChange}
        onClick={() => setActiveSearchField('end')}
      />
    </div>

    <TransportControls transportMode={transportMode} setTransportMode={setTransportMode} />

    {searchResults.length > 0 && activeSearchField && (
      <div className="absolute left-0 right-0 bg-white mt-0.5 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
        {searchResults.map((result, index) => (
          <div 
            key={index}
            className="p-3 hover:bg-gray-100 cursor-pointer text-base"
            onClick={() => selectSearchResult(result)}
          >
            {result.place_name}
          </div>
        ))}
      </div>
    )}

    {isSearching && (
      <div className="text-center text-sm text-gray-500">Searching...</div>
    )}

    <div className="flex justify-between mt-3 gap-2">
      <button 
        onClick={resetPoints}
        className="flex-1 bg-gray-200 text-gray-700 py-2 text-base rounded hover:bg-gray-300"
      >
        Reset
      </button>
      
      <button 
        onClick={fetchRoute}
        disabled={!start || !end || loading}
        className={`flex-1 py-2 text-base rounded ${!start || !end || loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
      >
        {loading ? 'Loading...' : 'Get Route'}
      </button>
    </div>
  </div>
</div>

{/* Buton rotund mutat în afara containerului principal */}
<div className="fixed bottom-4 right-4 z-50">
  <button 
    className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center"
    onClick={() => setDropdownOpen(!dropdownOpen)}
  >
      <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhIQEhAQEBISEhAQDxAQDw8NDxAPFRUWFhURFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGi0dHR0tKystLi0tLS0tLTAtLS0rKystKy0rNi0tLS0wKystLS0tLSstLSstLS0tKzUtLS0rLf/AABEIAOAA4AMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQIDBgEAB//EADwQAAEDAwIDBgMGBAUFAAAAAAEAAgMEESESMQVBURMiYXGBkQYyoRRScrHB4UJigtEjM0OywhUWU/Dx/8QAGgEAAgMBAQAAAAAAAAAAAAAAAQIAAwQFBv/EACcRAAICAgIBBAICAwAAAAAAAAABAhEDIQQSMRNBUXEFMiJhFCMz/9oADAMBAAIRAxEAPwD5lRSKdTlRpoLKNULKj3Gb0cDQq3hRDivFMKcurI3qhwKlA03RCkGB6sZIqdChdLQaC+0VD5UIZVwvR6ihrZVIFC06YNjwg0FI8xyujkyqdJUIKhrnFo3bg+Ntz73CHUjGLignnKvkfhAlxugkNovKvpjhC3V0JwjQUz1ccIIIisOEMxMkB+T0iqYFbIq490RfcseMLlJuvS7LlDkqRCx/T3smMBcEPwtmRdPnwCyYIkrpe6ViKod8+a2vF4bArHSjvFRisaxFSlgug6aVG9oqmCtFBpFW6nRhkXmBTYLF7oVOmhyj3RhSjYAg2FSKTAqnUpTIELtglTGcxGaI3UxQFOWsCmSAj3ZXYpgoSCmDYwAp6wq3lDs2FNnHMCTQ0rmaZ7EAnU78Lz+6dXwb9FsB8Oh9Dt3uwbjnfQE8XRZGN2Ywxod0WUfRjVGx3MtF/O2VXO0BAAHUchbZrR9Af1VtM24VUx7x87e2P0RNKcIyGigauZhCNTCvOECjFgl5K5iqYXZVsqhC3KYVeQh4wvcPZlWEYUqHdCIzNDQttZPwO6s/TP2Wghd3VYgCbjB7pWGlPeK3HGPlKxEw7xQYC6kaiHuVkUSi9ipu2O1o8x6ua5UtYrGtRK2WalF0qrfJZUmRSgBImVwmQTRlEtiwgx1E8apQdOSh5GZXQFKQKDIDdHxwakJw+PUQtVQ0OFnz5o40XYsfYzdbSd3T98tZ6OcGn6FfXA0Nhvbu9mfoFguI0w1xj7pY4m18l7SB7MefRb+tna2kkY8aXd0AkcnYvfyTQy9sXb7L446lR8ooYiA9v3ZJB6F1x+aHrhpNzsASfQXsnVTLEx7O+AZe6Rf/AFG7H1H5BLOON70TfvyNB/CN0YZO0l/ZVkx9bXwJWMOlpO5Fz5k3v9UVAMJrxOhtDSyt2dEI3/yysw4fmgoISQrpMqS2BVaGATaqozZL3RkboRkn4FmmgaQLlOMq6QKEG6d+AR8hDxhRot1ZLsqKLdSA8jT8OjuVoHABvos/wx1iE5muQrEKKOL/AClYqT5j5rb8SbdtlmHcOJJKTJJR8hSbCg1UPRenCW1L7KiDseS0EB4Vck4QTpSqXOJVqiUtF0sqhG7KpRFI25TeEFIPhGyNBwowxXsjGUZIVEppeS5RYlqH5VWtGVvDn3wFUygd0RU4V5EcWH8IkyFsKWrAAWSoaUjkmUhcAsfJwxy+5fim4of0vEoS6pjcQ2S1HJGSNV2doWEe7ne6d/GVM50cYbYuc+zww6rsaLucbbWNhblchfHPid5vG4kg95uCQdJH5f3R/DPi+ekDWMcXaxqeXHtL6gMC/iPyWrHgrEoh9dKWyjjNBIKk32YwGMHa552UPtbnae1c67Q4Ne21xcWva2SnXDHOqTLO65vZrSTcnTkn3KRVgs4rZjgkkvgyZJXJv5G3CZ2CH7OZnPHa9ozW3Ta7bFu55/mU6ooWHF87WIIN/VYSok0jG/unXBK9rmNYZHPk6OFiB0v6KnPgjPVtN/A+OcvOtGqfSg4SXiVJa+EwoOIt1Nikd33m0ePmHn1/uruKU91x7nhzdJM1OpwtGMljVEO6dVFJZLmxWcusppox1TOybKug3RTo8Kuijymgxpj2iOyes+VKKKLZNRtZXIUEli1FdjoQrWGysL1x/wAnKSao1cZKmZMSCyBlg1LlOSUzhiWv9EV/sKXUfguR0afdiCr4KJD1aWwdDOS0Srp4CHLUz0mEAKYAowy2iOFM7SsOE5ogOaqpYRhHspuix5siejRCL8nRA13JTFC3oF1sZCi+UhYpRfsy7XuXRUTeihV07QCTbAvfouNrEi+LOJkR9mDmTB/AN/fA91MOLLPKo35FnKMYtmS4zUCWRzx8t9LB/KOf6peJ2XGprzpwAHAAi5O9r8/3Rv2bU5rBvuT0CXTxWDT1F/rZemSS0vY5l2abgnHDqDbNa3ZrQMNHRO66hicC4gDGq4usXwZl3gdSAt9xanDYWAG+qIPPgOQSOaTS+R1BtN/BjnkMN7Gzr98ZGnp1B8ivMfG1jXseTIy2XN0l1j9VfGJHFrQAWj5hixClX8LN+63u+CerEv2G/ZNeY3306XskBabObY5t4EXC1jg2QXaQ4dR+vRYXh8MrQLtJbyuLo9okaC9t2kDBaS1Y+Zxlnp31aL8EnC0laHtbRCyzVRSnXsjqPj0pIa9hkbsXNAD2nxGx+iZilD+8M+FrH2WNLLx1/Pa+V4LX1yPXkUQ0OEIYdLvVa+GlASLikXev4o8XlOeSiZcdRsKohgJjGl1NJhOYILtBXXMgDKqta7UusSOiAmqbLk/kouUkka+O6TE9NGjWhUxsRDQrpSESOxuRsUoS9ysYqpq0NF0HPkuhXx5XmuVzSqovqO9llLdOKcYS2nCZwPFljz5LZfjjRGZ1kuqHFNJGXQU8SrhMkgCJhJWYkf8Aaanfug2HgxvP1z7rR8WqezhkcMHTpb+J2Afqs78ONAEjiQMAG/TcrtcCNpzf0jFyH4iMXU7GuAbgvDiSfut/dIuLcOIi1AfK5xx/43Hf0OPVc/6pqqtWzdLo2jlYA/qjOH8UF9D8scSM9Dgj6reZzO0k5aQRyIK2ddxB/ZxvZkkNAByNIFiElrfh031ROBG+l2PqnXw7Wshsyqic4AEsLRdurk09L9VTml1XZK2i7DHs+rdJh8FB2rWva7szjW0gj2Tg8LY1oLci33r2PQhWcHr6eV5LAWWGotO4HNhB/wDcp1CyKS5jcz+lwI8iAuXLkZmzqR4+JGIdWWdi99iBz9EwfJdliNLiMDa/pyV/GuAP1CaMNNiHOaCM+V0IT94G/TUQcAn5XbbdfVWRyd1/YJQ6PXgUwTCIyk7lt4xa93dB47HyvzsqP+4ZS9jYoHgucGsc+4dI/oG9PFUfEb+lvEkgfsmnwfwxwH2uSR8kjgWRlzibR4F85Jx7LZPP6WG5fRgljUsmjWyHHjbNuqzPE5M+qfSOwszX/N6rlfjo/wCwtzv+IbRi5WioPlAWWo3kELSUj7NXoUYQLikfePikXEI7BOaybU5K+J7Lmcz/AKRNGH9WUxsXrK2M4XCqlIeimyvYFCysDlJMiRxEwxoTtEVBOFTkutDxoLYyysbIQoMlBXHOWBpt7Lwpsy8cqqEIjSpVE8mZ+LWjQxl8vcXW6hoz9XBI6SFwjlGwLHZ8bXCL+M6k/aImjeNt/wCpxvb2DfdGyQjsiQLXaceYXo+GqwRv3ObmdzZgS7N1eyVUFdiObLSVmx4TUOe0XvbY26jmmVd8PSEXj7wcLgEhvoknBKoNGkC5OPIlbXjnFjTUwc0Xdpa1v4lk5TkqUfLNfFUbbl4RgaueppZOyfGC97Cxuk6i5jsAY3IIVbKwMIIbLTSX+Ua23N+Qsbp58P8ACZBM+oqCHSWaWZ1aS4XPkQLD1WquD6bLLPmLE+qV/I7xuW7+jIM+KK2D/MjkczYOcxzAfO+xVFd8TVM4Ijifi2ohpktfbDR+a3Lo2uaWuaHNIsWuAII6EKVHTMjGmNjY272Y0NF+uFm/z4LfTY/Sb12dGB4Z8Kz1BElQXxs30u/zHDwGzfz8F9Apog1rWNADWgNaByAFgFa9Va7LLn5M8/nwvYaGNQPTDBWXrj3vVaGqnFisxUvu/wBVs/GxfeyrkPQfQC5HgnofghLuEsFlfO+zl3TEQcMoHiOytqZ0PL3guby1/NM0Yv1AxMuiVCG6kwJOo1hzX3VlkG02V8MirkhkQmYVCJ5vZHEAqtsWUvfWw9QmncbK7dRibhXRgLHKSsuSLIAQi3SWBJ2AJPkFBtkn4jxVjJIw4uMd3tm0ZOi1zbqRYpuNj9bKk1r3Bkl0jfuY98hmndI7d77+Q5D0AATqonLmljeY03HLySupp2xSXveMnVHI3LCw/KQem/sehTamexp+YdRsvS0kqXscvd7MfW0TozYgjp4hC81vK1scrS02ODY3yPELExRXkDf5tP1QCOuDvDAHHcuvbwHNMeLcQkmLHHETLnzsM/29UoJ7xHIEgeSJ4hMexYwbvdbxLRy90HBPYyk1o1PD5SYWyH5njWfXYe1gp09QSV0wFrGN+61rfYL1LTm9156dNyZvV6GLCSjIGnmqInBHROCwyLkcezCW1RITcoOeG6kHvZJITvJIKRzN7y1M9PZpWYqD311/x0k5OjJyFSGvDXEYR04BF0DRO26oma67RjF9ScrrJML1U1VMYVz+Yto0YfAHpUwbKntFXJKq0rHCXPUmFL+0KtilUljpEUhox6KibzS6GRMI5MLHltF0dlr5bKplQgayYhdpHXS+lUbZO26CuK1jgxrWmxkOm4/hba7j58vVI6x1tsafl8DvtzHgqeMcWtUNjHyx4d4uNr+w/VGytD26hm/9l2ODiUMS+XsxZ5dpfQrpq2xZDp7g1kMLmnLzdzW33GPlP1K9V8La+7oHWI+aIkgtPhfIHgf2QtXEMgqmllcxwdcm2B3i1wHg7+91paaYsZJqmCvlkaSw6mnmDcFX8MitI17tr3TeGqEz2tkjbI2xuHDs3Hyc35T4tt5KVRBBh0WtjMDS4dpZ/PvXBttyQv5I4/B6BkYN3kcz/wDVCgj7eqjA+RjgfCwN1yogiDSXucTa7XW0sOflaL/U322V/wANVjGS202uO4ejiMe4v7pMsmoNrdIaMNq9G+MIK8YQEDHxAdVf9qBXmH2R0tFMzSNlyKpIVjpAVWLFC7WwDKGbC72yFbgKt7lVVj2E1coLSslOLyJ3WOOkpC0d66634qO2zLynoYUIIKauGEopZeXij2yXx0XcRhBKo96yIjhFroSoPeumDHYXM572jVgWjF9uvGW6FcVIFaFFFdhrCuOksh2vUXuS9dhsPgnTandcLN078p7Syiyy8iNFuNl80N0O1xaUxjcCl/GpmxRuebdGjq47BZYScn1LZKlZkeNOBnkI6j30i6K4DxItPZuPdOM8ilGokkk3JNyepUm7rvQXWKXwc9u3Y94lEQSlrd08pyJotJ+Zox1IS91IQdlZ5FPUsBdgJkOGP7jA52XNa0hxPfcbc8DJVXCRpeL+Ss4fKddREe9pcXNBvkarkeCDCil0YmjiA3Y+RmxAMZEZYd8kEyZ6EdEPPDome0YtpI9AMo+nYI29o86QDgC538eZx9ApVTdX+Lb5mBo65zf2URCH2twz1yjabiHUpaR3W+X6lRaCubkwxto0xm6s0jKm43XG1diltLJhWPNysforwXdxt9twuR1mUC1mFABUvDHwN2Y1qpwWpVG4EldkcbWVEe66XAxdEzPnlYxp4sjzR8oGfJVQswFXJJghdIzAhOUW16H6FVCaxXP5kLaZpwukZ3s1IMUrrgKdNi0cEai+JWxlXkBByaYaF2ggo+mlK72N1Y2KySc1JBjGgqOoIWZ47xAzPsD3GXDfE83I/jNVoZpG78eTeZ/RIoGXPkCU/GwJPuLlm/1KwF0rhXVtKBtwiqLSCFpmgPb8oCxtC+xWt4fJeLV0woQoihs7yKGrYXsqTIAdDgA4jba1yiO27yLqZO5fVpPI4siwCfiTXdk9rtrtLT/UP0XJ6/UGjoB7qyoLnREYsN7Zbbq08vJK6dhLreKJBxSOvoaf4u0t5jTj8/ZFTQgJZxa8bobf6YDvW9yE4qDcXGxFx5Fc7lQfdNe5pxNdaAY5bFERy5Q8cSJjiylcUMgmSawUI5V2aFcZDhVPGmPbJTSYXeHWN1VNFhe4c0rdx1SM+V7G+rYBVTjIVtPFkqRZdaCoXuB2VEgsUwc3vWVVTDkLLn8l+NaEMcBU+wTRlKbbKD4T0QIL2QK7skWyErroT0QasNg8catMKuijVHGqnsoXO520t/Ecfv6JPTtjdtGQ4tPqldY4b3R6b/W6s4PYudf7jktKN4Q+0rQdnXafVbkqVGZuwS6ndcnj0uLehIUQUQDDh0BebBamhZpY5m+MJD8Ous781paOAkPcOmErdBSsQmTvFdqw4i3JTkoH6ibFNKOj1DIyE3qR+Q9JfAFw2mOh4OAR6XQ9DHaZoOM2KacW1xx91pxvjl4pRSF0jg/yQc0lbIoNukT46/U7GUx4A7tGdmfmjsPNh2/UeiJpODNOTnzXKKn7KqaBs9rwfbUP9qzPNDIqRf6M8e2GDh+VZFR5TNxVQKppjFD6ZcfTYV5euPkQ6sNoX1UYDVVw0bo6pgLhgKmCnLRstOJ0inJtjGBov6LsTAQfNCmUj2U6SQ2Ct7ITqQnjs9SEN1GW5JPiuxVCqyqx8boMjpgMWVruHtKKe5pXA8LNsfqLXUYC8aYImVyrc8IqwdQf7MFivjmo77IR/CNbvM4H0v7rZVlUI2Oe42a0ElfLeI1bpZHyu3cb26DkPZX4ou7EnoHK602II3GQuFcWkqD+IuDwyQbuFn/iH7IEFW6u7bxBVShBzwI5K+g8NiAgv1O+F804TLZ1uq+kUs94mj13WHltrSN3ES8sg9gXKRrQd/qhOIVoas47jLtW+L3WLHhnkdo2ZM0IKhz8d19ohG3GrfP8KScBqw1tjyQPGq0yG5QEUll1HiTx9TmLLWTsfSeGVocLBVRt11bAP4WSu9MN/wCSznwvUkygX5Faj4TeH1VS77jGMH9TiT/tCyQw+nJmnJm7wHH2cqDoU3dGCoGEJnIz7EroSpwQ3KdNowV6KhyopAIwUzbZVVVStthHSwHkq/s55qdhkhK+mvsrm0RA2TuKnaFOUNsp3DRmZYsWQXZZWgqabVsg5aWyfvYOoI2YqZlQrHBWkDkjQxaHXUCLKvUQkvxJxgxN0tP+I8Y/kbzd/ZRRt0BulYr+LeJdo7sGHusN5D95/wB3yH5+Syj22KNhdn191PiFLYagtSVKjM3bsWry8vJgEgVxeBXnBQhdTOsQVveGVIMY6W67rAQ7p5JWFkVhzsB0tZU5sfdFuLJ0ZHjlfdxAKXQxEqi5cepJTEyhhA3IAGP0TQgoqhZzcnYNXwFth1Q8sdsIt0vaSt6AgnyCu4m1rhqbywR5lWCFXAajRKD4OHqQtb8B3tUS83yBt+ukE/8ANYunhNwT94AfqvovwtTaaaPx1PPjqcT+VlTm0vsshs00IJGFLS4LtBJZNmhpWMtBYAUayJWwwhce6yAThjQNU8jYI3tgoPe0okoTPe5cDyUVWyNS8VQ2UohOaq0hKKquN00dpKGlogcplRLP/9k=" alt="Menu" className="w-full h-full object-cover rounded-full" />

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
      console.log(API_URL);
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