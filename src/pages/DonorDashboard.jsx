import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { RequestCard } from '../components/RequestCard';
import { RequestDetailModal } from '../components/RequestDetailModal';
import { MapView } from '../components/MapView';
import { RequestCardSkeleton } from '../components/SkeletonLoader';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';
import { 
  Search, 
  Map, 
  LayoutGrid, 
  Gift, 
  XCircle,
  PackageCheck,
  Building2
} from 'lucide-react';

export const DonorDashboard = () => {
  const { requests, loadingRequests } = useData();
  const { userProfile } = useAuth();
  const { isRTL } = useLanguage();

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

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      if (req.status === 'fulfilled' && selectedStatusTab !== 'fulfilled') return false;

      if (selectedStatusTab === 'open' && req.status !== 'open') return false;
      if (selectedStatusTab === 'in_progress' && req.status !== 'in_progress') return false;
      if (selectedStatusTab === 'my_commitments' && req.assignedDonorId !== userProfile?.uid) return false;

      const matchesSearch = searchTerm === '' || 
        req.orgName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.needDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.location?.address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCity = selectedCity === 'all' || req.location?.city?.includes(selectedCity);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24 md:pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-5 sm:p-7 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="bg-emerald-800 text-emerald-100 text-[11px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            لوحة المتبرع
          </span>
          <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Gift className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>قائمة الاحتياجات المفتوحة للمساعدات</span>
          </h1>
          <p className="text-xs text-slate-300">
            {userProfile?.orgName ? `المتبرع / الجهة: ${userProfile.orgName}` : 'استعرض وتكفل باحتياجات الجمعيات'}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 w-full sm:w-auto justify-center">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial min-h-[36px] ${
              viewMode === 'grid' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-300'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>قائمة ({filteredRequests.length})</span>
          </button>

          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial min-h-[36px] ${
              viewMode === 'map' 
                ? 'bg-emerald-600 text-white shadow-xs' 
                : 'text-slate-300'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>الخريطة</span>
          </button>
        </div>
      </div>

      {/* Horizontal Swipeable Tabs on Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        <button
          onClick={() => setSelectedStatusTab('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all min-h-[38px] ${
            selectedStatusTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          جميع الطلبات
        </button>

        <button
          onClick={() => setSelectedStatusTab('open')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all min-h-[38px] ${
            selectedStatusTab === 'open'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          مفتوحة للمساعدة
        </button>

        <button
          onClick={() => setSelectedStatusTab('in_progress')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all min-h-[38px] ${
            selectedStatusTab === 'in_progress'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          قيد التكفل والتنسيق
        </button>

        {userProfile?.uid && (
          <button
            onClick={() => setSelectedStatusTab('my_commitments')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 min-h-[38px] ${
              selectedStatusTab === 'my_commitments'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5" />
            <span>التزاماتي بالمساعدة ({myCommitmentsCount})</span>
          </button>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-3">
        
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم الجمعية، الولاية، أو نوع المساعدة..."
            className="w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none min-h-[42px]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 rtl:left-3 rtl:right-auto text-slate-400"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-100">
          
          {/* Wilaya Filter */}
          <div>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white font-medium min-h-[40px]"
            >
              <option value="all">جميع الولايات (58 ولاية)</option>
              {ALGERIA_WILAYAS.map(w => (
                <option key={w.code} value={isRTL ? w.nameAr : w.nameEn}>
                  {w.code} - {isRTL ? w.nameAr : w.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white font-medium min-h-[40px]"
            >
              <option value="all">جميع فئات المساعدات</option>
              <option value="food">مواد غذائية ومؤونة</option>
              <option value="clothing">ألبسة وأغطية</option>
              <option value="medical">مستلزمات طبية وأدوية</option>
              <option value="shelter">مأوى وسكن مؤقت</option>
              <option value="other">عام / أخرى</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white font-medium min-h-[40px]"
            >
              <option value="all">درجة الاستعجال (الكل)</option>
              <option value="high">عاجل جداً</option>
              <option value="medium">متوسط (خلال أيام)</option>
              <option value="low">عادي / مستمر</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Feed Content */}
      {loadingRequests ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map(i => <RequestCardSkeleton key={i} />)}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center space-y-3 border border-slate-200">
          <h3 className="text-base font-bold text-slate-800">لا توجد طلبات في هذه القائمة حالياً</h3>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-emerald-800 text-white rounded-lg font-bold text-xs"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredRequests.map(req => (
            <RequestCard
              key={req.requestId}
              request={req}
              onSelect={(request) => setActiveModalRequest(request)}
            />
          ))}
        </div>
      ) : (
        <div className="h-[340px] sm:h-[550px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
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
