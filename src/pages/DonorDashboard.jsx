import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { RequestCard } from '../components/RequestCard';
import { RequestDetailModal } from '../components/RequestDetailModal';
import { MapView } from '../components/MapView';
import { 
  Search, 
  Map, 
  LayoutGrid, 
  Gift, 
  XCircle,
  PackageCheck,
  Clock,
  Sparkles
} from 'lucide-react';

export const DonorDashboard = () => {
  const { requests, loadingRequests } = useData();
  const { userProfile } = useAuth();
  const { t } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [selectedStatusTab, setSelectedStatusTab] = useState('all'); // all, open, in_progress, my_commitments
  const [viewMode, setViewMode] = useState('grid');
  const [activeModalRequest, setActiveModalRequest] = useState(null);

  const myCommitmentsCount = useMemo(() => {
    if (!userProfile?.uid) return 0;
    return requests.filter(r => r.assignedDonorId === userProfile.uid).length;
  }, [requests, userProfile]);

  const uniqueCities = useMemo(() => {
    const cities = new Set(requests.map(r => r.location?.city).filter(Boolean));
    return Array.from(cities);
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      // Exclude fulfilled requests from donor active feed unless explicitly searching
      if (req.status === 'fulfilled' && selectedStatusTab !== 'fulfilled') return false;

      if (selectedStatusTab === 'open' && req.status !== 'open') return false;
      if (selectedStatusTab === 'in_progress' && req.status !== 'in_progress') return false;
      if (selectedStatusTab === 'my_commitments' && req.assignedDonorId !== userProfile?.uid) return false;

      const matchesSearch = searchTerm === '' || 
        req.orgName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.needDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location?.address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCity = selectedCity === 'all' || req.location?.city === selectedCity;
      const matchesCategory = selectedCategory === 'all' || req.category === selectedCategory;
      const matchesUrgency = selectedUrgency === 'all' || req.urgency === selectedUrgency;

      return matchesSearch && matchesCity && matchesCategory && matchesUrgency;
    });
  }, [requests, selectedStatusTab, userProfile, searchTerm, selectedCity, selectedCategory, selectedUrgency]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCity('all');
    setSelectedCategory('all');
    setSelectedUrgency('all');
    setSelectedStatusTab('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <span className="bg-teal-500 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {t('roleDonor')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            <Gift className="w-7 h-7 text-teal-300" />
            <span>{t('donorDashTitle')}</span>
          </h1>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-teal-950/60 p-1.5 rounded-xl border border-teal-700/50 backdrop-blur">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'grid' 
                ? 'bg-teal-500 text-slate-950 shadow-md' 
                : 'text-teal-200 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>{t('gridView')} ({filteredRequests.length})</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              viewMode === 'map' 
                ? 'bg-teal-500 text-slate-950 shadow-md' 
                : 'text-teal-200 hover:text-white'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>{t('mapView')}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedStatusTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedStatusTab === 'all'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('allRequests')}
        </button>

        <button
          onClick={() => setSelectedStatusTab('open')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedStatusTab === 'open'
              ? 'bg-teal-600 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('openRequests')}
        </button>

        <button
          onClick={() => setSelectedStatusTab('in_progress')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            selectedStatusTab === 'in_progress'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('inProgressRequests')}
        </button>

        {userProfile?.uid && (
          <button
            onClick={() => setSelectedStatusTab('my_commitments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedStatusTab === 'my_commitments'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>{t('myCommitments')} ({myCommitmentsCount})</span>
          </button>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 rtl:right-4 rtl:left-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-4 rtl:pr-12 rtl:pl-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-3.5 rtl:left-4 rtl:right-auto text-slate-400 hover:text-slate-600"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          
          {/* City */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">{t('filterByCity')}</label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="all">{t('allCities')} ({requests.length})</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">{t('filterByCategory')}</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="all">{t('supportedCategories')}</option>
              <option value="food">{t('catFood')}</option>
              <option value="clothing">{t('catClothing')}</option>
              <option value="medical">{t('catMedical')}</option>
              <option value="shelter">{t('catShelter')}</option>
              <option value="other">{t('catOther')}</option>
            </select>
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-[11px] uppercase font-bold text-slate-500 mb-1">{t('filterByUrgency')}</label>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
            >
              <option value="all">{t('urgencyLabel')}</option>
              <option value="high">{t('urgencyHigh')}</option>
              <option value="medium">{t('urgencyMedium')}</option>
              <option value="low">{t('urgencyLow')}</option>
            </select>
          </div>

        </div>

        {(searchTerm || selectedCity !== 'all' || selectedCategory !== 'all' || selectedUrgency !== 'all' || selectedStatusTab !== 'all') && (
          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-slate-500 font-medium">
              النتائج المعروضة: {filteredRequests.length}
            </span>
            <button
              onClick={resetFilters}
              className="text-teal-600 font-semibold hover:underline"
            >
              {t('resetFilters')}
            </button>
          </div>
        )}

      </div>

      {/* Main Feed Content */}
      {loadingRequests ? (
        <div className="py-16 text-center text-slate-500 space-y-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center space-y-4 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">{t('noRequestsFound')}</h3>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold text-xs"
          >
            {t('resetFilters')}
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map(req => (
            <RequestCard
              key={req.requestId}
              request={req}
              onSelect={(request) => setActiveModalRequest(request)}
            />
          ))}
        </div>
      ) : (
        <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-md">
          <MapView
            requests={filteredRequests}
            onSelectRequest={(request) => setActiveModalRequest(request)}
          />
        </div>
      )}

      {activeModalRequest && (
        <RequestDetailModal
          request={activeModalRequest}
          onClose={() => setActiveModalRequest(null)}
        />
      )}

    </div>
  );
};
