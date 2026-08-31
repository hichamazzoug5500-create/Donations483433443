import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  AlertTriangle, 
  Plus, 
  Truck, 
  Package, 
  Search, 
  Filter, 
  Layers, 
  Activity, 
  Globe2, 
  CheckCircle,
  Map as MapIcon,
  Phone,
  Flame,
  Waves,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';
import NeedCard from '../components/NeedCard';
import DispatchCard from '../components/DispatchCard';
import PostNeedModal from '../components/PostNeedModal';
import DispatchModal from '../components/DispatchModal';
import MapView from '../components/MapView';

export default function Dashboard() {
  const navigate = useNavigate();
  const { userProfile, isSuperAdmin, isBranchMember } = useAuth();
  const { needs, dispatches, branches, organizations, loading } = useData();
  const { isRtl, t } = useLanguage();

  const [activeTab, setActiveTab] = useState('live_needs'); // 'overview' | 'live_needs' | 'our_dispatches' | 'our_needs' | 'map'
  const [showPostNeedModal, setShowPostNeedModal] = useState(false);
  const [activeDispatchNeed, setActiveDispatchNeed] = useState(null);

  // Filters for Live Needs Tab
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyCrossOrg, setOnlyCrossOrg] = useState(false);

  // Current branch details
  const userBranch = branches.find(b => b.id === userProfile?.branchId) || {
    name: userProfile?.branchName || (isRtl ? 'الفرع الإقليمي' : 'Regional Branch'),
    wilaya: userProfile?.city || 'الجزائر العاصمة',
    status: 'active'
  };

  // Filtered Needs
  const filteredNeeds = useMemo(() => {
    return needs.filter(need => {
      // Exclude fulfilled/cancelled from active feed unless searched
      if (need.status === 'fulfilled' || need.status === 'cancelled') return false;

      // Text search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchTitle = need.title?.toLowerCase().includes(query);
        const matchBranch = need.branchName?.toLowerCase().includes(query);
        const matchWilaya = need.location?.wilaya?.toLowerCase().includes(query);
        const matchItems = need.items?.some(it => it.description?.toLowerCase().includes(query));
        if (!matchTitle && !matchBranch && !matchWilaya && !matchItems) return false;
      }

      // Wilaya filter
      if (selectedWilaya !== 'all' && need.location?.wilaya !== selectedWilaya) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'all' && need.priority !== selectedPriority) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const hasCategory = need.items?.some(it => it.category === selectedCategory);
        if (!hasCategory) return false;
      }

      // Cross-Org filter
      if (onlyCrossOrg && !need.isCrossOrg) {
        return false;
      }

      return true;
    });
  }, [needs, searchTerm, selectedWilaya, selectedPriority, selectedCategory, onlyCrossOrg]);

  // Outgoing Dispatches from this branch
  const ourDispatches = useMemo(() => {
    return dispatches.filter(d => d.fromBranchId === userProfile?.branchId || isSuperAdmin);
  }, [dispatches, userProfile?.branchId, isSuperAdmin]);

  // Needs posted by our branch
  const ourBranchNeeds = useMemo(() => {
    return needs.filter(n => n.branchId === userProfile?.branchId || isSuperAdmin);
  }, [needs, userProfile?.branchId, isSuperAdmin]);

  // Metrics
  const criticalNeedsCount = needs.filter(n => n.priority === 'P1_critical' && n.status !== 'fulfilled').length;
  const inTransitCount = dispatches.filter(d => d.status === 'in_transit' || d.status === 'dispatched').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Branch Command Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{userProfile?.orgName || (isRtl ? 'منظمة إغاثية' : 'Relief Org')}</span>
              </span>

              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                userBranch.status === 'disaster_zone'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                <span className={`w-2 h-2 rounded-full ${userBranch.status === 'disaster_zone' ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}`} />
                <span>{userBranch.status === 'disaster_zone' ? (isRtl ? 'حالة طوارئ وكوارث' : 'Disaster Zone Status') : (isRtl ? 'فرع تشغيلي نشط' : 'Active Branch')}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black mb-1">
              {userBranch.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{userBranch.wilaya} {userBranch.address ? `— ${userBranch.address}` : ''}</span>
              <span>•</span>
              <span>{userProfile?.displayName}</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowPostNeedModal(true)}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition flex items-center gap-2 transform active:scale-95"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isRtl ? 'إطلاق نداء إغاثة لفرعنا +' : 'Broadcast Need +'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto">
        {[
          { id: 'live_needs', label: isRtl ? 'نداءات الإغاثة الحية' : 'Live Relief Needs', icon: AlertTriangle, count: filteredNeeds.length },
          { id: 'overview', label: isRtl ? 'نظرة عامة' : 'Overview', icon: Activity },
          { id: 'our_dispatches', label: isRtl ? 'قوافلنا المرسلة' : 'Our Dispatches', icon: Truck, count: ourDispatches.length },
          { id: 'our_needs', label: isRtl ? 'نداءات فرعنا' : 'Our Branch Needs', icon: Package, count: ourBranchNeeds.length },
          { id: 'map', label: isRtl ? 'الخريطة التفاعلية' : 'Interactive Map', icon: MapIcon }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ==================================================== */}
      {/* 1. LIVE NEEDS TAB */}
      {/* ==================================================== */}
      {activeTab === 'live_needs' && (
        <div className="space-y-6">
          
          {/* Multi-Filter Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search Box */}
              <div className="sm:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={isRtl ? 'بحث في النداءات، الفروع، أو الأصناف...' : 'Search needs, branches, items...'}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                />
              </div>

              {/* Wilaya Filter */}
              <div className="sm:col-span-3">
                <select
                  value={selectedWilaya}
                  onChange={e => setSelectedWilaya(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="all">{isRtl ? '📍 كافة الولايات (58 ولاية)' : 'All Wilayas'}</option>
                  {ALGERIA_WILAYAS.map(w => (
                    <option key={w.code} value={w.nameAr}>{w.code} - {w.nameAr}</option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div className="sm:col-span-3">
                <select
                  value={selectedPriority}
                  onChange={e => setSelectedPriority(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="all">{isRtl ? '⚡ جميع مستويات الأولوية' : 'All Priorities'}</option>
                  <option value="P1_critical">🔴 P1 - {isRtl ? 'حرج (0-24 ساعة)' : 'P1 Critical'}</option>
                  <option value="P2_urgent">🟡 P2 - {isRtl ? 'عاجل (24-48 ساعة)' : 'P2 Urgent'}</option>
                  <option value="P3_high">🔵 P3 - {isRtl ? 'مرتفع' : 'P3 High'}</option>
                  <option value="P4_medium">⚪ P4 - {isRtl ? 'متوسط' : 'P4 Medium'}</option>
                </select>
              </div>

              {/* Category Filter */}
              <div className="sm:col-span-2">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium"
                >
                  <option value="all">{isRtl ? '📦 كل الأصناف' : 'All Categories'}</option>
                  <option value="food">{isRtl ? '🍱 غذاء' : 'Food'}</option>
                  <option value="water">{isRtl ? '💧 مياه' : 'Water'}</option>
                  <option value="medical">{isRtl ? '💊 صحة' : 'Medical'}</option>
                  <option value="shelter">{isRtl ? '⛺ إيواء' : 'Shelter'}</option>
                  <option value="clothing">{isRtl ? '🧥 ألبسة' : 'Clothing'}</option>
                </select>
              </div>
            </div>

            {/* Cross-Org Toggle Pill */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={onlyCrossOrg}
                  onChange={e => setOnlyCrossOrg(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>{isRtl ? 'عرض النداءات المشتركة بين الجمعيات فقط (Cross-Org)' : 'Show Cross-Org Needs Only'}</span>
              </label>

              <span className="text-xs text-slate-400 font-mono">
                {filteredNeeds.length} {isRtl ? 'نداء متاح للتنسيق' : 'needs available'}
              </span>
            </div>
          </div>

          {/* Needs Cards Grid */}
          {filteredNeeds.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                {isRtl ? 'لا توجد نداءات إغاثة مطابقة لخيارات البحث' : 'No relief needs match your criteria'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRtl ? 'يمكنك تجربة تغيير فلاتر الولاية أو الأولوية.' : 'Try changing your wilaya or priority filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNeeds.map(need => (
                <NeedCard
                  key={need.id}
                  need={need}
                  onSelect={(needId) => navigate(`/needs/${needId}`)}
                  onOpenDispatch={(targetNeed) => setActiveDispatchNeed(targetNeed)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. OVERVIEW TAB */}
      {/* ==================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 block mb-2">{isRtl ? 'إجمالي نداءات الطوارئ' : 'Active Emergency Needs'}</span>
              <p className="text-3xl font-black text-rose-600">{criticalNeedsCount}</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 block mb-2">{isRtl ? 'قوافل الإغاثة في المسار' : 'Convoys in Transit'}</span>
              <p className="text-3xl font-black text-emerald-600">{inTransitCount}</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 block mb-2">{isRtl ? 'شحنات أرسلها فرعنا' : 'Our Dispatches'}</span>
              <p className="text-3xl font-black text-blue-600">{ourDispatches.length}</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-xs font-bold text-slate-500 block mb-2">{isRtl ? 'نداءات مسجلة لفرعنا' : 'Our Branch Needs'}</span>
              <p className="text-3xl font-black text-purple-600">{ourBranchNeeds.length}</p>
            </div>
          </div>

          {/* Urgent Needs Feed */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>{isRtl ? 'النداءات الحرجة ذات الأولوية القصوى (P1)' : 'Top Critical P1 Emergency Needs'}</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {needs.filter(n => n.priority === 'P1_critical').slice(0, 4).map(need => (
                <div 
                  key={need.id}
                  onClick={() => navigate(`/needs/${need.id}`)}
                  className="p-4 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">P1 Critical</span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">{need.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{need.branchName} • {need.location?.wilaya}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 shrink-0 self-center">➔</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. OUR DISPATCHES TAB */}
      {/* ==================================================== */}
      {activeTab === 'our_dispatches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isRtl ? 'سجل قوافل المساعدات التي أرسلها فرعنا' : 'Aid Convoys Sent by Our Branch'} ({ourDispatches.length})
            </h2>
          </div>

          {ourDispatches.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Truck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                {isRtl ? 'لم يقم فرعكم بإرسال أي شحنة إغاثة بعد' : 'No dispatches sent by your branch yet'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRtl ? 'استعرض نداءات الإغاثة الحية وقدم المساعدة للفروع المتضررة.' : 'Browse live needs to commit aid to affected branches.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ourDispatches.map(disp => (
                <DispatchCard
                  key={disp.id}
                  dispatch={disp}
                  onSelectNeed={(needId) => navigate(`/needs/${needId}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. OUR NEEDS TAB */}
      {/* ==================================================== */}
      {activeTab === 'our_needs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isRtl ? 'النداءات والمستلزمات المطلوبة لفرعنا' : 'Needs Broadcasted by Our Branch'} ({ourBranchNeeds.length})
              </h2>
              <p className="text-xs text-slate-500">
                {isRtl ? 'الاحتياجات التي تم نشرها لمساعدة المناطق المنكوبة الواقعة ضمن اختصاص فرعكم.' : 'Needs posted for affected areas under your branch jurisdiction.'}
              </p>
            </div>

            <button
              onClick={() => setShowPostNeedModal(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إضافة نداء جديد' : 'New Need'}</span>
            </button>
          </div>

          {ourBranchNeeds.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                {isRtl ? 'لا توجد نداءات مسجلة لفرعكم' : 'No needs posted by your branch'}
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ourBranchNeeds.map(need => (
                <NeedCard
                  key={need.id}
                  need={need}
                  onSelect={(needId) => navigate(`/needs/${needId}`)}
                  onOpenDispatch={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. INTERACTIVE MAP TAB */}
      {/* ==================================================== */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-[600px]">
            <MapView
              needs={needs}
              branches={branches}
              dispatches={dispatches}
              onSelectNeed={(needId) => navigate(`/needs/${needId}`)}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {showPostNeedModal && (
        <PostNeedModal
          isOpen={showPostNeedModal}
          onClose={() => setShowPostNeedModal(false)}
        />
      )}

      {activeDispatchNeed && (
        <DispatchModal
          isOpen={Boolean(activeDispatchNeed)}
          onClose={() => setActiveDispatchNeed(null)}
          targetNeed={activeDispatchNeed}
        />
      )}
    </div>
  );
}
