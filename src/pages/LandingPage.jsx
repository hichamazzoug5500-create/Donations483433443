import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  List, 
  Map as MapIcon, 
  PlusCircle
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
  const [activeRequestModal, setActiveRequestModal] = useState(null);

  const CATEGORY_CHIPS = [
    { id: 'all', label: 'الكل' },
    { id: 'food', label: 'مواد غذائية 🥫' },
    { id: 'clothing', label: 'ألبسة وأغطية 👕' },
    { id: 'medical', label: 'أدوية ومستلزمات 💊' },
    { id: 'shelter', label: 'مأوى وسكن 🏠' },
    { id: 'other', label: 'أخرى 📦' }
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
    <div className="space-y-4 sm:space-y-6 pb-safe-nav md:pb-12">
      
      {/* Compact Civic Banner on Mobile */}
      <section className="bg-slate-900 text-white pt-5 sm:pt-10 pb-6 sm:pb-10 px-3 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
          
          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-900/90 text-emerald-300 border border-emerald-700/60">
            شبكة التكافل الخيري بالجزائر 🇩🇿
          </span>

          <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            التنسيق المباشر بين الجمعيات والمحسنين
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            منصة تتيح للجمعيات نشر احتياجاتها العاجلة بدقة، وتمكّن المتبرعين من تقديم المساعدات والتكفل بها مباشرة.
          </p>

          {/* Clean 2-Button Grid */}
          <div className="grid grid-cols-2 gap-2 max-w-md mx-auto pt-1">
            <button
              onClick={() => {
                if (currentUser) {
                  navigate(userRole === 'recipient' ? '/dashboard' : '/donor');
                } else {
                  navigate('/login');
                }
              }}
              className="bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 min-h-[42px]"
            >
              <HelpingHand className="w-4 h-4 shrink-0" />
              <span>طلب مساعدة</span>
            </button>

            <a
              href="#needs-feed"
              className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white border border-white/20 font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[42px]"
            >
              <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>الاحتياجات ({openCount})</span>
            </a>
          </div>

        </div>
      </section>

      {/* Main Feed Container */}
      <section id="needs-feed" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3">
        
        {/* Compact Title Bar & View Toggle */}
        <div className="flex justify-between items-center pb-1">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              الاحتياجات المفتوحة
            </h2>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.2 rounded-full">
              {filteredRequests.length}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all min-h-[30px] ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>قائمة</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all min-h-[30px] ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>خريطة</span>
            </button>
          </div>
        </div>

        {/* Swipeable Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 no-scrollbar">
          {CATEGORY_CHIPS.map(chip => (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all border min-h-[34px] ${
                selectedCategory === chip.id
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Search & Wilaya Controls */}
        <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 rtl:right-3 rtl:left-auto" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم، الولاية، أو الاحتياج..."
                className="w-full pl-8 pr-3 rtl:pr-8 rtl:pl-3 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none min-h-[38px]"
              />
            </div>

            {/* Wilaya Filter */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-700 outline-none font-medium min-h-[38px]"
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

        {/* Feed Content */}
        {loadingRequests ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {[1, 2, 3, 4].map(i => <RequestCardSkeleton key={i} />)}
          </div>
        ) : viewMode === 'map' ? (
          <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[340px] sm:h-[500px]">
            <MapView
              requests={filteredRequests}
              onSelectRequest={(req) => setActiveRequestModal(req)}
            />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center space-y-2.5 border border-dashed border-slate-300">
            <h3 className="text-sm font-bold text-slate-800">لا توجد طلبات تطابق هذا البحث حالياً</h3>
            <p className="text-xs text-slate-500">جرب اختيار ولاية أخرى أو فئة مختلفة</p>
            <button
              onClick={() => { setSelectedCity('all'); setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
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
