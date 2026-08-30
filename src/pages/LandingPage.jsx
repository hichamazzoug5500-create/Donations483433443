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
  CheckCircle2
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
    <div className="space-y-12 pb-16">
      
      {/* Civic Editorial Header */}
      <section className="bg-slate-900 text-white pt-14 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
            شبكة التكافل الخيري والإنساني في الجزائر
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            منصة التنسيق المباشر بين الجمعيات والمحسنين
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-normal">
            تتيح للجمعيات الخيرية والمبادرات الإنسانية في جميع الولايات نشر احتياجاتها العاجلة بدقة، وتمكّن المتبرعين من تقديم المساعدات والتكفل بها مباشرة دون وسيط.
          </p>

          {/* Clean Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                if (currentUser) {
                  navigate(userRole === 'recipient' ? '/dashboard' : '/donor');
                } else {
                  navigate('/login');
                }
              }}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow transition-all flex items-center justify-center gap-2 min-h-[46px]"
            >
              <HelpingHand className="w-4 h-4" />
              <span>طلب مساعدة لجمعية</span>
            </button>

            <a
              href="#needs-feed"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 min-h-[46px]"
            >
              <Gift className="w-4 h-4 text-emerald-400" />
              <span>تصفح الاحتياجات الحالية ({openCount})</span>
            </a>
          </div>

        </div>
      </section>

      {/* Live Needs Feed Section */}
      <section id="needs-feed" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Title & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>الاحتياجات المفتوحة للمساعدات في الجزائر</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                {filteredRequests.length} طلب
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              يمكن للمتبرعين والمحسنين الاتصال مباشرة بالجمعيات للتنسيق وتقديم العون
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span>قائمة</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>الخريطة</span>
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالجمعية، الولاية، أو نوع الاحتياج..."
                className="w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-2 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-600 outline-none"
              />
            </div>

            {/* Wilaya Filter */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
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
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-600 outline-none font-medium"
              >
                <option value="all">جميع فئات المساعدات</option>
                <option value="food">مواد غذائية ومؤونة</option>
                <option value="clothing">ألبسة وأغطية</option>
                <option value="medical">مستلزمات طبية وأدوية</option>
                <option value="shelter">مأوى وسكن مؤقت</option>
                <option value="other">عام / أخرى</option>
              </select>
            </div>

          </div>
        </div>

        {/* Feed Content */}
        {loadingRequests ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <RequestCardSkeleton key={i} />)}
          </div>
        ) : viewMode === 'map' ? (
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[500px]">
            <MapView
              requests={filteredRequests}
              onSelectRequest={(req) => setActiveRequestModal(req)}
            />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-dashed border-slate-300">
            <h3 className="text-base font-bold text-slate-800">لا توجد طلبات تطابق هذا البحث حالياً</h3>
            <p className="text-xs text-slate-500">جرب اختيار ولاية أخرى أو إعادة تعيين الفلاتر</p>
            <button
              onClick={() => { setSelectedCity('all'); setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Authentic Mission Details Modal */}
      {activeRequestModal && (
        <RequestDetailModal
          request={activeRequestModal}
          isOpen={Boolean(activeRequestModal)}
          onClose={() => setActiveRequestModal(null)}
        />
      )}

    </div>
  );
};
