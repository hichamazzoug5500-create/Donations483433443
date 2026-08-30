import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  PlusCircle,
  Building2,
  PhoneCall,
  CheckCircle2,
  ArrowLeft,
  Users,
  ShieldCheck,
  PackageCheck,
  HeartHandshake
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
    { id: 'all', label: 'جميع الاحتياجات' },
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
    <div className="space-y-10 pb-safe-nav md:pb-16">
      
      {/* 🌟 1. HERO SECTION & PLATFORM PURPOSE 🌟 */}
      <section className="bg-slate-900 text-white pt-8 sm:pt-14 pb-12 sm:pb-18 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-5xl mx-auto text-center space-y-5 sm:space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/90 text-emerald-300 border border-emerald-700/60 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>المنصة الوطنية المباشرة للتكافل الخيري بالجزائر 🇩🇿</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight">
            نربط الجمعيات الخيرية بالمحسنين مباشرة
            <span className="block text-emerald-400 mt-1 sm:mt-2 text-xl sm:text-3xl md:text-4xl font-bold">
              دون وسيط مالي • تسليم يداً بيد
            </span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-base max-w-2xl mx-auto leading-relaxed">
            الجمعيات المعتمدة تنشر احتياجاتها الواقعية (طرود غذائية، ملابس، أدوية)، والمتبرعون يتكفلون بها مباشرة مع التواصل الهاتفي الفوري للتسليم.
          </p>

          {/* 🌟 2. TWO DISTINCT INTERACTIVE WORKFLOW PATHS 🌟 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto pt-4 text-right">
            
            {/* Path 1: Recipient / Charity Path */}
            <div className="bg-slate-800/90 border-2 border-emerald-500/40 hover:border-emerald-400 p-5 rounded-2xl shadow-lg transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-700/80 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  أنا جمعية أو مبادرة خيرية
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  لديكم عائلات معوزة أو أيتام بحاجة إلى مؤونة أو ألبسة أو أدوية؟ انشروا طلب المساعدة ليظهر فوراً للمحسنين في ولايتكم.
                </p>
              </div>

              <button
                onClick={() => {
                  if (currentUser) {
                    navigate('/dashboard');
                  } else {
                    navigate('/login');
                  }
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>أنشر احتياجاتك للمحسنين</span>
              </button>
            </div>

            {/* Path 2: Donor / Contributor Path */}
            <div className="bg-slate-800/90 border-2 border-amber-500/40 hover:border-amber-400 p-5 rounded-2xl shadow-lg transition-all space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-600/80 text-white flex items-center justify-center font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  أنا محسن / أريد تقديم مساعدة
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  تريد التكفل بطرود غذائية، أدوية، أو ملابس شتوية؟ تصفح الاحتياجات المفتوحة عبر 58 ولاية وتكفل بطلب وتواصل مع الجمعية مباشرة.
                </p>
              </div>

              <a
                href="#needs-feed"
                className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Gift className="w-4 h-4" />
                <span>تصفح وتكفل بطلب ({openCount})</span>
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* 🌟 3. HOW IT WORKS (كيف تعمل المنصة في 3 خطوات) 🌟 */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              آلية العمل والتنسيق المباشر
            </span>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900">
              كيف تتم عملية التكفل والمساعدة في 3 خطوات؟
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-2">
            
            {/* Step 1 */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm">
                1
              </div>
              <h4 className="font-bold text-sm text-slate-900">الجمعية تنشر الاحتياج</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                تحدد الجمعية نوع المساعدة (قفة، دواء، ملابس)، والكمية المطلوبة، والولاية، ورقم هاتف المسؤول.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-emerald-50/70 p-4 sm:p-5 rounded-2xl border border-emerald-200 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-extrabold text-sm">
                2
              </div>
              <h4 className="font-bold text-sm text-emerald-950">المحسن يتكفل بالطلب</h4>
              <p className="text-xs text-emerald-900 leading-relaxed">
                يضغط المتبرع على "أتكفل بهذه المساعدة" ويحدد الكمية وموعد التسليم، ويظهر رقمه للجمعية فوراً.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm">
                3
              </div>
              <h4 className="font-bold text-sm text-slate-900">التواصل الهاتفي والتسليم</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                يتواصل الطرفان هاتفياً لتحديد نقطة الاستلام والتسليم يداً بيد على أرض الواقع بكل شفافية.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 🌟 4. LIVE REQUESTS FEED & DIRECT PLEDGING 🌟 */}
      <section id="needs-feed" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Section Header & View Mode */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>الاحتياجات الخيرية المفتوحة للمساعدة</span>
              <span className="text-xs bg-emerald-100 text-emerald-900 font-extrabold px-2.5 py-0.5 rounded-full">
                {filteredRequests.length} طلب مفتوح
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              اختر الاحتياج المناسب لمقدورك وتكفل به مباشرة للتنسيق مع الجمعية
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[34px] ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <List className="w-4 h-4" />
              <span>عرض القائمة</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[34px] ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>الخريطة التفاعلية</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
          {CATEGORY_CHIPS.map(chip => (
            <button
              key={chip.id}
              onClick={() => setSelectedCategory(chip.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all border min-h-[38px] ${
                selectedCategory === chip.id
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Search & Wilaya Dropdown */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الجمعية، الولاية، أو نوع المساعدة..."
                className="w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-700 outline-none min-h-[42px]"
              />
            </div>

            {/* Wilaya Filter */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-emerald-700 outline-none font-medium min-h-[42px]"
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

        {/* Content Feed Grid / Map */}
        {loadingRequests ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(i => <RequestCardSkeleton key={i} />)}
          </div>
        ) : viewMode === 'map' ? (
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[360px] sm:h-[520px]">
            <MapView
              requests={filteredRequests}
              onSelectRequest={(req) => setActiveRequestModal(req)}
            />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center space-y-3 border border-dashed border-slate-300">
            <h3 className="text-base font-bold text-slate-800">لا توجد طلبات مساعدة تطابق هذا البحث</h3>
            <p className="text-xs text-slate-500">جرب اختيار ولاية أخرى أو فئة مختلفة</p>
            <button
              onClick={() => { setSelectedCity('all'); setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl"
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
