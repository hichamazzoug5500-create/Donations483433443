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
    if (center && typeof center[0] === 'number' && typeof center[1] === 'number') {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

export const LocationPicker = ({ lat, lng, city, address, value, onChange }) => {
  const { isRtl } = useLanguage();
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [isSearchingOSM, setIsSearchingOSM] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const effectiveLat = Number(value?.lat ?? lat) || 36.4700;
  const effectiveLng = Number(value?.lng ?? lng) || 2.8300;
  const effectiveAddress = value?.address ?? address ?? '';

  // Reverse geocoding via free OpenStreetMap Nominatim API
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=${isRtl ? 'ar' : 'en'}`);
      const data = await res.json();
      if (data && data.address) {
        const detectedCity = data.address.state || data.address.city || data.address.town || data.address.county || (isRtl ? 'الجزائر' : 'Algeria');
        const detectedAddress = data.display_name || '';
        return { city: detectedCity, address: detectedAddress };
      }
    } catch (err) {
      console.warn("Reverse geocode error:", err);
    }
    return null;
  };

  const handleSelectCoords = async (latitude, longitude) => {
    setStatusMsg({ type: 'info', text: isRtl ? 'جاري تحديد العنوان...' : 'Detecting address...' });
    const geocodeResult = await reverseGeocode(latitude, longitude);
    
    if (onChange) {
      onChange({
        lat: latitude,
        lng: longitude,
        city: geocodeResult?.city || city || (isRtl ? 'البليدة' : 'Blida'),
        address: geocodeResult?.address || effectiveAddress || ''
      });
    }

    setStatusMsg({ type: 'success', text: isRtl ? 'تم تحديد الإحداثيات بنجاح' : 'Location coordinates pinned!' });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
  };

  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      setStatusMsg({ type: 'error', text: isRtl ? 'تحديد الموقع غير مدعوم في متصفحك' : 'Geolocation not supported' });
      return;
    }

    setIsLocatingGPS(true);
    setStatusMsg({ type: 'info', text: isRtl ? 'جاري الاتصال بالأقمار الاصطناعية (GPS)...' : 'Detecting GPS position...' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await handleSelectCoords(latitude, longitude);
        setIsLocatingGPS(false);
      },
      (error) => {
        console.error("GPS detection error:", error);
        setStatusMsg({ type: 'error', text: isRtl ? 'تعذر تحديد الموقع تلقائياً' : 'Could not detect GPS' });
        setIsLocatingGPS(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleOSMSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearchingOSM(true);
    setSearchResults([]);

    try {
      const queryWithCountry = `${searchQuery.trim()}, Algeria`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryWithCountry)}&limit=5&accept-language=${isRtl ? 'ar' : 'en'}`);
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

    if (onChange) {
      onChange({
        lat: newLat,
        lng: newLng,
        city: itemCity || city,
        address: item.display_name
      });
    }

    setSearchResults([]);
    setSearchQuery('');
    setStatusMsg({ type: 'success', text: isRtl ? 'تم تحديد المكان' : 'Location selected' });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
  };

  return (
    <div className="space-y-2.5 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-emerald-800" />
          <span>{isRtl ? 'انقر على الخريطة لتحديد نقطة الاستلام بدقة' : 'Click on map to pin exact site'}</span>
        </span>

        {/* GPS Auto Location Button */}
        <button
          type="button"
          onClick={handleGPSDetect}
          disabled={isLocatingGPS}
          className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs transition min-h-[36px]"
        >
          {isLocatingGPS ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
          <span>{isRtl ? 'تحديد موقعي الحالي (GPS)' : 'Auto-Detect (GPS)'}</span>
        </button>
      </div>

      {statusMsg.text && (
        <div className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
          statusMsg.type === 'success' ? 'bg-emerald-100 text-emerald-900' :
          statusMsg.type === 'error' ? 'bg-red-100 text-red-900' : 'bg-slate-200 text-slate-800'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Address Search Bar */}
      <div className="relative">
        <form onSubmit={handleOSMSearch} className="flex items-center gap-1.5">
          <div className="relative flex-grow">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'ابحث عن بلدية، حي أو شارع في الجزائر...' : 'Search street or municipality in Algeria...'}
              className="w-full pl-8 pr-3 rtl:pr-8 rtl:pl-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 outline-none focus:ring-2 focus:ring-emerald-700 min-h-[38px]"
            />
          </div>
          <button
            type="submit"
            disabled={isSearchingOSM}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition shrink-0 min-h-[38px]"
          >
            {isSearchingOSM ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (isRtl ? 'بحث' : 'Search')}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-2xl border border-slate-200 shadow-xl max-h-44 overflow-y-auto">
            {searchResults.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSearchResult(item)}
                className="w-full text-left rtl:text-right px-3.5 py-2.5 text-xs hover:bg-emerald-50 border-b border-slate-100 text-slate-800 truncate block"
              >
                {item.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Leaflet Map Picker */}
      <div className="h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-slate-300 relative shadow-inner">
        <MapContainer
          center={[effectiveLat, effectiveLng]}
          zoom={12}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapRecenter center={[effectiveLat, effectiveLng]} />
          <MapClickHandler onLocationSelect={handleSelectCoords} />
          <Marker position={[effectiveLat, effectiveLng]} />
        </MapContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-mono">
        <div>Lat: {effectiveLat.toFixed(4)}</div>
        <div>Lng: {effectiveLng.toFixed(4)}</div>
      </div>
    </div>
  );
};

export default LocationPicker;
