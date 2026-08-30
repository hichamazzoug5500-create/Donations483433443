import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, PhoneCall, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (urgency = 'medium') => {
  const colorHex = urgency === 'high' ? '#ef4444' : urgency === 'medium' ? '#f59e0b' : '#3b82f6';
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${colorHex}" width="32" height="32" stroke="#ffffff" stroke-width="1.5">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-map-marker',
    html: svg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const MapRecenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 12);
    }
  }, [center, zoom, map]);
  return null;
};

export const MapView = ({ requests = [], onSelectRequest, selectedRequestId = null, zoomLevel = 12 }) => {
  const { t } = useLanguage();

  const CATEGORY_LABELS = {
    food: t('catFood'),
    clothing: t('catClothing'),
    medical: t('catMedical'),
    shelter: t('catShelter'),
    other: t('catOther')
  };

  const URGENCY_STYLES = {
    high: { label: t('urgencyHigh'), color: 'bg-red-500' },
    medium: { label: t('urgencyMedium'), color: 'bg-amber-500' },
    low: { label: t('urgencyLow'), color: 'bg-blue-500' }
  };

  const validRequests = requests.filter(
    r => r.location && typeof r.location.lat === 'number' && typeof r.location.lng === 'number'
  );

  // Default center: Algiers, Algeria
  const defaultCenter = [36.7538, 3.0588];
  
  const selectedReq = validRequests.find(r => r.requestId === selectedRequestId);
  const mapCenter = selectedReq 
    ? [selectedReq.location.lat, selectedReq.location.lng] 
    : validRequests.length > 0 
      ? [validRequests[0].location.lat, validRequests[0].location.lng] 
      : defaultCenter;

  return (
    <div className="w-full h-full min-h-[350px] relative rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={mapCenter} zoom={zoomLevel} />

        {validRequests.map((req) => {
          const categoryLabel = CATEGORY_LABELS[req.category] || t('catOther');
          const urgencyStyle = URGENCY_STYLES[req.urgency] || URGENCY_STYLES.medium;
          const icon = createCustomIcon(req.urgency);

          return (
            <Marker
              key={req.requestId}
              position={[req.location.lat, req.location.lng]}
              icon={icon}
            >
              <Popup className="leaflet-popup-custom">
                <div className="p-1 space-y-2 max-w-xs">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      {categoryLabel}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded text-white ${urgencyStyle.color}`}>
                      {req.urgency}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    {req.orgName}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {req.needDescription}
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{req.location.city}</span>
                  </div>

                  {onSelectRequest && (
                    <button
                      onClick={() => onSelectRequest(req)}
                      className="w-full mt-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>{t('viewAndPledge')}</span>
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};
