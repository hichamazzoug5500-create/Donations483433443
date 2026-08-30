import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Search, MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Fix Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map click event listener to update location pin
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

// Recenter helper
const MapRecenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

export const LocationPicker = ({ lat, lng, city, address, onChange }) => {
  const { t, isRTL } = useLanguage();
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [isSearchingOSM, setIsSearchingOSM] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const currentLat = Number(lat) || 36.7538; // Default Algiers
  const currentLng = Number(lng) || 3.0588;

  // Perform reverse geocoding via free OpenStreetMap Nominatim API
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${isRTL ? 'ar' : 'en'}`);
      const data = await res.json();
      if (data && data.address) {
        const detectedCity = data.address.state || data.address.city || data.address.town || data.address.county || 'الجزائر';
        const detectedAddress = data.display_name || '';
        return { city: detectedCity, address: detectedAddress };
      }
    } catch (err) {
      console.warn("Reverse geocode error:", err);
    }
    return null;
  };

  // Handle map click or coordinate update
  const handleSelectCoords = async (latitude, longitude) => {
    setStatusMsg({ type: 'info', text: t('locating') });
    const geocodeResult = await reverseGeocode(latitude, longitude);
    
    onChange({
      lat: latitude,
      lng: longitude,
      city: geocodeResult?.city || city || 'الجزائر العاصمة',
      address: geocodeResult?.address || address || ''
    });

    setStatusMsg({ type: 'success', text: t('locationFound') });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
  };

  // GPS Auto-Detection button handler
  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      setStatusMsg({ type: 'error', text: t('locationError') });
      return;
    }

    setIsLocatingGPS(true);
    setStatusMsg({ type: 'info', text: t('locating') });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await handleSelectCoords(latitude, longitude);
        setIsLocatingGPS(false);
      },
      (error) => {
        console.error("GPS detection error:", error);
        setStatusMsg({ type: 'error', text: t('locationError') });
        setIsLocatingGPS(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // OpenStreetMap Nominatim free search
  const handleOSMSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingOSM(true);
    setSearchResults([]);

    try {
      // Append Algeria to prioritize local Algerian search results
      const queryWithCountry = `${searchQuery.trim()}, Algeria`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryWithCountry)}&limit=5&accept-language=${isRTL ? 'ar' : 'en'}`);
      const data = await res.json();
      setSearchResults(data || []);
    } catch (err) {
      console.error("OSM search error:", err);
    } finally {
      setIsSearchingOSM(false);
    }
  };

  const handleSelectSearchResult = (item) => {
    const newLat = parseFloat(item.lat);
    const newLng = parseFloat(item.lon);
    const itemCity = item.address?.state || item.address?.city || item.address?.town || item.display_name.split(',')[0];

    onChange({
      lat: newLat,
      lng: newLng,
      city: itemCity || city,
      address: item.display_name
    });

    setSearchResults([]);
    setSearchQuery('');
    setStatusMsg({ type: 'success', text: t('locationFound') });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
  };

  return (
    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-teal-600" />
          <span>{t('clickMapToPick')}</span>
        </span>

        {/* Free GPS Auto Location Button */}
        <button
          type="button"
          onClick={handleGPSDetect}
          disabled={isLocatingGPS}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-colors"
        >
          {isLocatingGPS ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
          <span>{t('useGPS')}</span>
        </button>
      </div>

      {statusMsg.text && (
        <div className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
          statusMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800' :
          statusMsg.type === 'error' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Free Address Search Bar */}
      <div className="relative">
        <form onSubmit={handleOSMSearch} className="flex items-center gap-2">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchAddressOSM')}
              className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 rounded-lg border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingOSM}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors shrink-0"
          >
            {isSearchingOSM ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : t('home')}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-lg border border-slate-200 shadow-xl max-h-48 overflow-y-auto">
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSearchResult(item)}
                className="w-full text-left rtl:text-right px-3 py-2 text-xs hover:bg-teal-50 border-b border-slate-100 transition-colors block text-slate-800 truncate"
              >
                {item.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Leaflet Map Picker */}
      <div className="h-52 w-full rounded-lg overflow-hidden border border-slate-300 relative shadow-inner">
        <MapContainer
          center={[currentLat, currentLng]}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapRecenter center={[currentLat, currentLng]} />
          <MapClickHandler onLocationSelect={handleSelectCoords} />
          <Marker position={[currentLat, currentLng]} />
        </MapContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-mono">
        <div>Lat: {currentLat.toFixed(5)}</div>
        <div>Lng: {currentLng.toFixed(5)}</div>
      </div>
    </div>
  );
};
