import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { RequestCard } from '../components/RequestCard';
import { RequestDetailModal } from '../components/RequestDetailModal';
import { MapView } from '../components/MapView';
import { RequestCardSkeleton } from '../components/SkeletonLoader';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';
import { 
  HelpingHand, 
  Gift, 
  Search, 
  Filter, 
  MapPin, 
  List, 
  Map as MapIcon, 
  Building2,
  PhoneCall,
  SlidersHorizontal,
  X
} from 'lucide-react';

export const LandingPage = () => {
  const { requests, loadingRequests } = useData();
  const { currentUser, role: userRole } = useAuth();
  const { isRTL } = useLanguage();
  const navigate = useNavigate();

  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeRequestModal, setActiveRequestModal] = useState(null);

  const CATEGORY_CHIPS = [
    { id: 'all', label: 'الكل' },
    { id: 'food', label: 'مواد غذائية 🥫' },
    { id: 'clothing', label: 'ألبسة وأغطية 👕' },
    { id: 'medical', label: 'أدوية ومستلزمات 💊' },
    { id: 'shelter', label: 'مأوى وسكن 🏠' },
    { id: 'other', label: 'احتياجات أخرى 📦' }
  ];

  // Filter open & in-progress requests
  const filteredRequests = requests.filter(req => {
    if (req.status === 'fulfilled') return false;
    
    if (selectedCity !== 'all' && !req.location?.city?.includes(selectedCity)) {
      return false;
    }
    if (selectedCategory !== 'all' && req.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = req.needDescription?.toLowerCase().includes(q);
      const matchOrg = req.orgName?.toLowerCase().includes(q);
      const matchCity = req.location?.city?.toLowerCase().includes(q);
      if (!matchDesc && !matchOrg && !matchCity) return false;
    }
    return true;
  });

  const openCount = requests.filter(r => r.status === 'open').length;

  return (
    <div className="space-y-8 pb-24 md:pb-16">
      
      {/* Mobile-Optimized Civic Header */}
      <section className="bg-slate-900 text-white pt-8 sm:pt-14 pb-10 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-[11px] font-bold">
            شبكة التكافل الخيري والإنساني في الجزائر
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-snug sm:leading-tight">
            التنسيق المباشر بين الجمعيات والمحسنين
          </h1>

          <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            تتيح للجمعيات الخيرية والمبادرات الإنسانية في جميع الولايات نشر احتياجاتها العاجلة بدقة، وتمكّن المتبرعين من تقديم المساعدات والتكفل بها مباشرة.
          </p>

          {/* Clean Action Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:justify-center gap-2.5 pt-1">
            <button
              onClick={() => {
                if (currentUser) {
                  navigate(userRole === 'recipient' ? '/dashboard' : '/donor');
                } else {
                  navigate('/login');
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <HelpingHand className="w-4 h-4 shrink-0" />
              <span>طلب مساعدة</span>
            </button>

            <a
              href="#needs-feed"
              className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20 font-bold text-xs sm:text-sm px-4 sm:px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>الاحتياجات ({openCount})</span>
            </a>
          </div>

        </div>
      </section>

      {/* Live Needs Feed Section */}
      <section id="needs-feed" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Section Header & View Mode */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-1.5">
              <span>الاحتياجات المفتوحة</span>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {filteredRequests.length}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all min-h-[32px] ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>قائمة</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all min-h-[32px] ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>الخريطة</span>
            </button>
          </div>
        </div>

        {/* Horizontal Category Chips (Mobile Swipe Carousel) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {CATEGORY_CHIPS.map(chip => (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all border min-h-[38px] ${
                selectedCategory === chip.id
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Compact Search & Wilaya Dropdown */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، الولاية، أو الاحتياج..."
                className="w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none min-h-[40px]"
              />
            </div>

            {/* Wilaya Filter */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-700 outline-none font-medium min-h-[40px]"
              >
                <option value="all">جميع الولايات (58 ولاية)</option>
                {ALGERIA_WILAYAS.map(w => (
                  <option key={w.code} value={isRTL ? w.nameAr : w.nameEn}>
                    {w.code} - {isRTL ? w.nameAr : w.nameEn}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Content Feed */}
        {loadingRequests ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(i => <RequestCardSkeleton key={i} />)}
          </div>
        ) : viewMode === 'map' ? (
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[340px] sm:h-[500px]">
            <MapView
              requests={filteredRequests}
              onSelectRequest={(req) => setActiveRequestModal(req)}
            />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center space-y-3 border border-dashed border-slate-300">
            <h3 className="text-sm sm:text-base font-bold text-slate-800">لا توجد طلبات تطابق هذا البحث حالياً</h3>
            <p className="text-xs text-slate-500">جرب اختيار ولاية أخرى أو فئة مختلفة</p>
            <button
              onClick={() => { setSelectedCity('all'); setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredRequests.map(req => (
              <RequestCard
                key={req.requestId}
                request={req}
                onSelect={(selected) => setActiveRequestModal(selected)}
              />
            ))}
          </div>
        )}

      </section>

      {/* Mobile Drawer Detail Modal */}
      {activeRequestModal && (
        <RequestDetailModal
          request={activeRequestModal}
          onClose={() => setActiveRequestModal(null)}
        />
      )}

    </div>
  );
};
