import React, { useState, useMemo } from 'react';
import { 
  Gift, 
  MapPin, 
  PhoneCall, 
  Search, 
  List, 
  Map as MapIcon, 
  PackageCheck, 
  Clock, 
  CheckCircle, 
  HeartHandshake, 
  Building2, 
  Copy, 
  Check, 
  Calendar, 
  FileText, 
  XCircle, 
  Package,
  Utensils,
  Shirt,
  Stethoscope,
  Home,
  X,
  PieChart,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { RequestCard } from '../components/RequestCard';
import { RequestDetailModal } from '../components/RequestDetailModal';
import { MapView } from '../components/MapView';
import { RequestCardSkeleton, DashboardStatsSkeleton } from '../components/SkeletonLoader';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';

export const DonorDashboard = () => {
  const { userProfile } = useAuth();
  const { requests, responses, loadingRequests, cancelCommitment } = useData();
  const { t, isRTL } = useLanguage();
  const { showSuccess, showError } = useToast();

  const [activeMainTab, setActiveMainTab] = useState('browse'); // 'browse' or 'commitments'
  const [commitmentsSubTab, setCommitmentsSubTab] = useState('all'); // 'all', 'in_progress', 'fulfilled'
  
  // Filters for browsing open needs
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [activeRequestModal, setActiveRequestModal] = useState(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState(null);

  // 🌟 Filter open needs:
  // Show only open requests and partially committed requests.
  // Fully committed requests (in_progress with isFullCommitment) are REMOVED from the list for other donors!
  const openRequests = useMemo(() => {
    return requests.filter(req => {
      if (req.status === 'fulfilled') return false;
      // If fully committed by someone else, hide it from the open list
      if (req.status === 'in_progress' && req.isFullCommitment && req.assignedDonorId !== userProfile?.uid) {
        return false;
      }
      return true;
    });
  }, [requests, userProfile?.uid]);

  const filteredOpenRequests = useMemo(() => {
    return openRequests.filter(req => {
      if (selectedWilaya !== 'all' && !req.location?.city?.includes(selectedWilaya)) {
        return false;
      }
      if (selectedCategory !== 'all' && req.category !== selectedCategory) {
        return false;
      }
      if (selectedUrgency !== 'all' && req.urgency !== selectedUrgency) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDesc = req.needDescription?.toLowerCase().includes(q);
        const matchOrg = req.orgName?.toLowerCase().includes(q);
        const matchCity = req.location?.city?.toLowerCase().includes(q);
        const matchAddress = req.location?.address?.toLowerCase().includes(q);
        if (!matchDesc && !matchOrg && !matchCity && !matchAddress) return false;
      }
      return true;
    });
  }, [openRequests, selectedWilaya, selectedCategory, selectedUrgency, searchQuery]);

  // Donor's own commitments (Full or Partial)
  const myCommitments = useMemo(() => {
    if (!userProfile?.uid) return [];
    const myResponseRequestIds = new Set(
      responses.filter(r => r.donorId === userProfile.uid).map(r => r.requestId)
    );
    return requests.filter(r => r.assignedDonorId === userProfile.uid || myResponseRequestIds.has(r.requestId));
  }, [requests, responses, userProfile?.uid]);

  const activeCommitmentsCount = myCommitments.filter(c => c.status !== 'fulfilled').length;
  const fulfilledCommitmentsCount = myCommitments.filter(c => c.status === 'fulfilled').length;

  const filteredCommitments = useMemo(() => {
    if (commitmentsSubTab === 'all') return myCommitments;
    if (commitmentsSubTab === 'fulfilled') return myCommitments.filter(c => c.status === 'fulfilled');
    return myCommitments.filter(c => c.status !== 'fulfilled');
  }, [myCommitments, commitmentsSubTab]);

  const CATEGORY_MAP = {
    food: { label: t('catFood'), icon: Utensils, color: 'bg-emerald-50 text-emerald-900 border-emerald-200' },
    clothing: { label: t('catClothing'), icon: Shirt, color: 'bg-blue-50 text-blue-900 border-blue-200' },
    medical: { label: t('catMedical'), icon: Stethoscope, color: 'bg-rose-50 text-rose-900 border-rose-200' },
    shelter: { label: t('catShelter'), icon: Home, color: 'bg-amber-50 text-amber-900 border-amber-200' },
    other: { label: t('catOther'), icon: Package, color: 'bg-purple-50 text-purple-900 border-purple-200' }
  };

  const URGENCY_MAP = {
    high: { label: t('urgencyHigh'), color: 'bg-red-600 text-white' },
    medium: { label: t('urgencyMedium'), color: 'bg-amber-600 text-white' },
    low: { label: t('urgencyLow'), color: 'bg-slate-600 text-white' }
  };

  const handleCopyPhone = (phone, id) => {
    if (phone) {
      navigator.clipboard.writeText(phone);
      setCopiedPhoneId(id);
      setTimeout(() => setCopiedPhoneId(null), 2000);
      showSuccess(t('copiedPhone'));
    }
  };

  const handleCancelCommitment = async (requestId) => {
    if (window.confirm(t('confirmCancelCommitment'))) {
      try {
        await cancelCommitment(requestId);
        showSuccess(t('commitmentCancelledSuccess'));
      } catch (err) {
        console.error("Cancel commitment error:", err);
        showError('Error cancelling commitment');
      }
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedWilaya('all');
    setSelectedCategory('all');
    setSelectedUrgency('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4 sm:space-y-6 pb-safe-nav md:pb-12">
      
      {/* 🌟 Welcome Banner */}
      <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
        <div className="space-y-1">
          <span className="bg-emerald-800 text-emerald-100 text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            {t('donorDashBadge')}
          </span>
          <h1 className="text-base sm:text-2xl font-bold flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{userProfile?.orgName || t('donorOrg')}</span>
          </h1>
          <p className="text-slate-300 text-[11px] sm:text-xs flex items-center gap-3 flex-wrap">
            {userProfile?.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {userProfile.city}
              </span>
            )}
            {userProfile?.phone && (
              <span className="flex items-center gap-1">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span className="dir-ltr inline-block font-bold">{userProfile.phone}</span>
              </span>
            )}
          </p>
        </div>

        {/* View Mode Toggle when browsing */}
        {activeMainTab === 'browse' && (
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 w-full sm:w-auto justify-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial min-h-[36px] ${
                viewMode === 'grid' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span>{t('gridView')} ({filteredOpenRequests.length})</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial min-h-[36px] ${
                viewMode === 'map' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>{t('mapView')}</span>
            </button>
          </div>
        )}
      </div>

      {/* 🌟 Summary Stats */}
      {loadingRequests ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold block">{t('availableNeedsCount')}</span>
              <div className="text-lg sm:text-2xl font-extrabold text-emerald-800 mt-0.5">{openRequests.length}</div>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold block">{t('activeCommitments')}</span>
              <div className="text-lg sm:text-2xl font-extrabold text-amber-600 mt-0.5">{activeCommitmentsCount}</div>
            </div>
            <div className="p-2 bg-amber-50 text-amber-800 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-bold block">{t('fulfilledCommitments')}</span>
              <div className="text-lg sm:text-2xl font-extrabold text-emerald-800 mt-0.5">{fulfilledCommitmentsCount}</div>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* 🌟 Primary Switchable Tabs: Browse Needs vs My Commitments */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveMainTab('browse')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all min-h-[40px] flex items-center gap-1.5 ${
            activeMainTab === 'browse'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>{t('tabAllNeeds')} ({openRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('commitments')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all min-h-[40px] flex items-center gap-1.5 ${
            activeMainTab === 'commitments'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>{t('tabMyCommitments')} ({myCommitments.length})</span>
        </button>
      </div>

      {/* 🌟 TAB 1: BROWSE OPEN NEEDS 🌟 */}
      {activeMainTab === 'browse' && (
        <div className="space-y-4">
          
          {/* Search & Filter Controls */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 rtl:right-3.5 rtl:left-auto" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-700 outline-none min-h-[44px]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 rtl:left-3.5 rtl:right-auto text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* 🌟 Fast Swipeable Category Chips 🌟 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
              {[
                { id: 'all', label: isRTL ? 'جميع الأصناف' : 'All Categories', icon: Package },
                { id: 'food', label: t('catFood'), icon: Utensils },
                { id: 'clothing', label: t('catClothing'), icon: Shirt },
                { id: 'medical', label: t('catMedical'), icon: Stethoscope },
                { id: 'shelter', label: t('catShelter'), icon: Home },
                { id: 'other', label: t('catOther'), icon: Package }
              ].map(cat => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all min-h-[36px] ${
                      isSelected
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Wilaya & Urgency Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-100">
              
              {/* Wilaya Filter */}
              <div>
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white font-medium min-h-[42px] outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="all">{t('filterWilaya')}</option>
                  {ALGERIA_WILAYAS.map(w => (
                    <option key={w.code} value={isRTL ? w.nameAr : w.nameEn}>
                      {w.code} - {isRTL ? w.nameAr : w.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency Filter */}
              <div>
                <select
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white font-medium min-h-[42px] outline-none focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="all">{t('filterUrgency')}</option>
                  <option value="high">{t('urgencyHigh')}</option>
                  <option value="medium">{t('urgencyMedium')}</option>
                  <option value="low">{t('urgencyLow')}</option>
                </select>
              </div>

            </div>

            {/* Active filters reset bar */}
            {(searchQuery || selectedWilaya !== 'all' || selectedCategory !== 'all' || selectedUrgency !== 'all') && (
              <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                <span>{filteredOpenRequests.length} {isRTL ? 'طلب مطابق للبحث' : 'matching requests'}</span>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-emerald-800 hover:text-emerald-900 font-bold hover:underline"
                >
                  {t('resetFilters')}
                </button>
              </div>
            )}

          </div>

          {/* Open Needs Feed / Map */}
          {loadingRequests ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => <RequestCardSkeleton key={i} />)}
            </div>
          ) : viewMode === 'map' ? (
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[360px] sm:h-[540px]">
              <MapView
                requests={filteredOpenRequests}
                onSelectRequest={(req) => setActiveRequestModal(req)}
              />
            </div>
          ) : filteredOpenRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center space-y-3 border border-slate-200">
              <h3 className="text-base font-bold text-slate-800">{t('noNeedsFound')}</h3>
              <p className="text-xs text-slate-500">{t('noNeedsFoundSub')}</p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs"
              >
                {t('resetFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {filteredOpenRequests.map(req => (
                <RequestCard
                  key={req.requestId}
                  request={req}
                  onSelect={(request) => setActiveRequestModal(request)}
                />
              ))}
            </div>
          )}

        </div>
      )}

      {/* 🌟 TAB 2: MY COMMITMENTS (التزاماتي) 🌟 */}
      {activeMainTab === 'commitments' && (
        <div className="space-y-4">
          
          {/* Sub-tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setCommitmentsSubTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all min-h-[36px] ${
                commitmentsSubTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {t('tabAllCommitments')} ({myCommitments.length})
            </button>

            <button
              onClick={() => setCommitmentsSubTab('in_progress')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all min-h-[36px] ${
                commitmentsSubTab === 'in_progress'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {t('tabInProgress')} ({activeCommitmentsCount})
            </button>

            <button
              onClick={() => setCommitmentsSubTab('fulfilled')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all min-h-[36px] ${
                commitmentsSubTab === 'fulfilled'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {t('tabFulfilled')} ({fulfilledCommitmentsCount})
            </button>
          </div>

          {/* Commitments List */}
          {filteredCommitments.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 sm:p-12 text-center space-y-3 border border-dashed border-slate-300">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <HeartHandshake className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {t('noCommitmentsYet')}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                {t('noCommitmentsYetSub')}
              </p>
              <button
                onClick={() => setActiveMainTab('browse')}
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all min-h-[42px]"
              >
                <Search className="w-4 h-4" />
                <span>{t('browseOpenNeedsBtn')}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filteredCommitments.map((req) => {
                const catMeta = CATEGORY_MAP[req.category] || CATEGORY_MAP.other;
                const CatIcon = catMeta.icon;
                const urgMeta = URGENCY_MAP[req.urgency] || URGENCY_MAP.medium;
                const myResponse = responses.find(r => r.requestId === req.requestId && r.donorId === userProfile?.uid);
                const isPartial = myResponse?.commitmentType === 'partial' || (!req.isFullCommitment && Boolean(req.remainingQuantity));

                return (
                  <div key={req.requestId} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-3.5 sm:p-5 space-y-3">

                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold border ${catMeta.color}`}>
                            <CatIcon className="w-3 h-3" />
                            <span>{catMeta.label}</span>
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${urgMeta.color}`}>
                            {urgMeta.label}
                          </span>
                          {isPartial ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                              {t('partialAidBadge')}
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">
                              {t('fullCoverageBadge')}
                            </span>
                          )}
                        </div>

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          req.status === 'fulfilled'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : 'bg-amber-50 text-amber-900 border-amber-300'
                        }`}>
                          {req.status === 'fulfilled' ? t('statusFulfilled') : t('statusInProgress')}
                        </span>
                      </div>

                      {/* Org Name & Location */}
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5 leading-snug">
                          <Building2 className="w-4 h-4 text-emerald-800 shrink-0" />
                          <span>{req.orgName}</span>
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                          <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                          <span className="font-bold text-slate-700">{req.location?.city || 'الجزائر'}</span>
                          {req.location?.address && (
                            <span className="truncate max-w-[180px] text-slate-400">• {req.location.address}</span>
                          )}
                        </div>
                      </div>

                      {/* Need Description */}
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                        {req.needDescription}
                      </p>

                      {/* Quantity & Remaining scope */}
                      <div className="space-y-1">
                        {req.quantity && (
                          <div className="bg-slate-50 rounded-xl p-2 text-[11px] text-slate-800 font-medium border border-slate-200/70 flex items-center justify-between">
                            <span className="text-slate-500 font-normal">{t('quantityNeeded')}</span>
                            <span className="font-bold text-emerald-900">{req.quantity}</span>
                          </div>
                        )}

                        {myResponse?.remainingQuantity && (
                          <div className="bg-amber-50 rounded-xl p-2 text-[11px] text-amber-950 font-bold border border-amber-300 flex items-center justify-between">
                            <span className="text-amber-800 font-medium">{t('remainingNeededTag')}</span>
                            <span className="text-amber-900 font-extrabold">{myResponse.remainingQuantity}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-emerald-50 border-t border-emerald-200 p-3.5 sm:p-4 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-bold text-emerald-950 text-[11px] sm:text-xs">
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                          <span>{t('charityPhoneLabel')}</span>
                        </span>
                        <span className="font-extrabold text-slate-900 text-sm dir-ltr">
                          {req.phone || 'N/A'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleCopyPhone(req.phone, req.requestId)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-900 font-bold rounded-xl text-[11px] min-h-[40px] transition-colors"
                        >
                          {copiedPhoneId === req.requestId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedPhoneId === req.requestId ? t('copiedPhone') : t('copyPhoneBtn')}</span>
                        </button>
                        <a
                          href={`tel:${req.phone}`}
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-[11px] shadow-xs min-h-[40px] transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>{t('callNow')}</span>
                        </a>
                      </div>
                    </div>

                    {/* Pledge Details */}
                    {myResponse && (myResponse.pledgedQuantity || myResponse.deliveryDate || myResponse.donorNotes) && (
                      <div className="bg-amber-50/60 border-t border-amber-200 p-3 sm:p-3.5 space-y-1.5">
                        <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                          <Gift className="w-3 h-3" />
                          {t('committedDetails') || 'تفاصيل التزامك:'}
                        </span>
                        {myResponse.pledgedQuantity && (
                          <div className="text-[11px] text-slate-700 flex items-center gap-1.5">
                            <Package className="w-3 h-3 text-amber-600" />
                            <span className="font-medium">{t('pledgedQtyLabel')}</span>
                            <span className="font-bold text-emerald-900">{myResponse.pledgedQuantity}</span>
                          </div>
                        )}
                        {myResponse.deliveryDate && (
                          <div className="text-[11px] text-slate-700 flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-amber-600" />
                            <span className="font-medium">{t('deliveryDateLabel')}</span>
                            <span>{myResponse.deliveryDate}</span>
                          </div>
                        )}
                        {myResponse.donorNotes && (
                          <div className="text-[11px] text-slate-700 flex items-start gap-1.5">
                            <FileText className="w-3 h-3 text-amber-600 mt-0.5 shrink-0" />
                            <span className="line-clamp-2">{myResponse.donorNotes}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cancel Commitment Button */}
                    {req.status !== 'fulfilled' && (
                      <div className="px-3.5 py-2.5 border-t border-slate-100 flex justify-center">
                        <button
                          onClick={() => handleCancelCommitment(req.requestId)}
                          className="text-[11px] font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 min-h-[36px] px-3 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          {t('cancelCommitmentLink')}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* Detail & Commitment Modal */}
      {activeRequestModal && (
        <RequestDetailModal
          request={activeRequestModal}
          onClose={() => setActiveRequestModal(null)}
        />
      )}

    </div>
  );
};
