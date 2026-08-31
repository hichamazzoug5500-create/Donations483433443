import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Phone, Building2, Package } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createNeedIcon = (urgency = 'high') => {
  const color = urgency === 'high' ? '#e11d48' : urgency === 'medium' ? '#f59e0b' : '#2563eb';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="34" height="34" stroke="#ffffff" stroke-width="2">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-need-marker',
    html: svg,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34]
  });
};

const createBranchIcon = (status = 'active') => {
  const isDisaster = status === 'disaster_zone';
  const color = isDisaster ? '#dc2626' : '#059669';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="30" height="30" stroke="#ffffff" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke="#ffffff" stroke-width="1.5" />
    </svg>
  `;
  return L.divIcon({
    className: 'custom-branch-marker',
    html: svg,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

const MapRecenter = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && typeof center[0] === 'number' && typeof center[1] === 'number') {
      map.setView(center, zoom || 9);
    }
  }, [center, zoom, map]);
  return null;
};

export default function MapView({ 
  needs = [], 
  branches = [], 
  dispatches = [], 
  onSelectNeed = null, 
  zoomLevel = 8 
}) {
  const { isRtl } = useLanguage();

  const validNeeds = needs.filter(n => n.location && typeof n.location.lat === 'number' && typeof n.location.lng === 'number');
  const validBranches = branches.filter(b => b.location && typeof b.location.lat === 'number' && typeof b.location.lng === 'number');

  const defaultCenter = [36.5500, 3.0000];
  const mapCenter = validNeeds.length > 0
    ? [validNeeds[0].location.lat, validNeeds[0].location.lng]
    : validBranches.length > 0
    ? [validBranches[0].location.lat, validBranches[0].location.lng]
    : defaultCenter;

  return (
    <div className="w-full h-full min-h-[450px] relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRecenter center={mapCenter} zoom={zoomLevel} />

        {/* Branch Markers */}
        {validBranches.map((branch) => {
          const isDisaster = branch.status === 'disaster_zone';
          return (
            <Marker
              key={branch.id}
              position={[branch.location.lat, branch.location.lng]}
              icon={createBranchIcon(branch.status)}
            >
              <Popup>
                <div className="p-1 space-y-1 min-w-[180px] text-right" dir={isRtl ? 'rtl' : 'ltr'}>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-emerald-800">
                      {branch.orgName}
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${isDisaster ? 'bg-red-600' : 'bg-emerald-700'}`}>
                      {isDisaster ? (isRtl ? 'منطقة طوارئ' : 'Disaster') : (isRtl ? 'فرع نشط' : 'Active')}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs">
                    {branch.name}
                  </h4>

                  <p className="text-[11px] text-slate-500">
                    📍 {branch.wilaya} {branch.address ? `— ${branch.address}` : ''}
                  </p>

                  {branch.phone && (
                    <p className="text-[11px] font-mono text-slate-600">
                      📞 {branch.phone}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Need Markers */}
        {validNeeds.map((need) => {
          const title = need.needDescription || need.title || '';
          return (
            <Marker
              key={need.id}
              position={[need.location.lat, need.location.lng]}
              icon={createNeedIcon(need.urgency)}
            >
              <Popup>
                <div className="p-1 space-y-1.5 min-w-[200px] text-right" dir={isRtl ? 'rtl' : 'ltr'}>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-600 text-white">
                      {need.urgency === 'high' ? (isRtl ? 'عاجل' : 'Urgent') : (isRtl ? 'مستمر' : 'Open')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">
                      {need.category}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs line-clamp-2">
                    {title}
                  </h4>

                  <p className="text-[11px] text-slate-600">
                    🏢 {need.branchName || need.orgName}
                  </p>

                  {need.quantity && (
                    <p className="text-[10px] font-bold text-emerald-900 bg-emerald-50 p-1 rounded">
                      {isRtl ? 'الكمية:' : 'Qty:'} {need.quantity}
                    </p>
                  )}

                  {onSelectNeed && (
                    <button
                      onClick={() => onSelectNeed(need.id)}
                      className="w-full mt-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-1.5 px-3 rounded-lg shadow-xs flex items-center justify-center gap-1 transition"
                    >
                      <Package className="w-3 h-3" />
                      <span>{isRtl ? 'عرض الطلب' : 'View Need'}</span>
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
}

export { MapView };
