import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, 
  Search, 
  SlidersHorizontal,
  RotateCcw,
  Utensils,
  Shirt,
  Stethoscope,
  Home,
  Package,
  Layers,
  Building2,
  MapPin,
  X,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';
import NeedCard from '../components/NeedCard';
import PostNeedModal from '../components/PostNeedModal';
import RequestDetailModal from '../components/RequestDetailModal';

export default function Dashboard() {
  const { userProfile, isSuperAdmin } = useAuth();
  const { needs, organizations, updateNeed, loading } = useData();
  const { isRtl } = useLanguage();

  // Modals state
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingNeed, setEditingNeed] = useState(null);
  const [selectedNeed, setSelectedNeed] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWilaya, setSelectedWilaya] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [adminSelectedOrg, setAdminSelectedOrg] = useState('all');
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [scopeFilter, setScopeFilter] = useState('all'); // 'all' (all branches in this charity) | 'mine' (this branch only)

  const CATEGORIES = [
    { key: 'all', label: isRtl ? 'الكل' : 'All', emoji: '✨', icon: Layers },
    { key: 'food', label: isRtl ? 'غذاء' : 'Food', emoji: '🍱', icon: Utensils },
    { key: 'clothing', label: isRtl ? 'ألبسة' : 'Clothes', emoji: '🧥', icon: Shirt },
    { key: 'medical', label: isRtl ? 'أدوية' : 'Meds', emoji: '💊', icon: Stethoscope },
    { key: 'shelter', label: isRtl ? 'مأوى' : 'Shelter', emoji: '⛺', icon: Home },
    { key: 'other', label: isRtl ? 'أخرى' : 'Other', emoji: '📦', icon: Package }
  ];

  // Filtered Needs Feed (STRICT CHARITY ISOLATION)
  const filteredNeeds = useMemo(() => {
    return needs.filter(need => {
      // 1. STRICT CHARITY ISOLATION:
      // If user is a branch member, they ONLY see needs posted by branches of the SAME charity!
      if (!isSuperAdmin) {
        if (userProfile?.orgId && need.orgId && need.orgId !== userProfile.orgId) {
          return false;
        }
      } else {
        // Admin can optionally filter by charity
        if (adminSelectedOrg !== 'all' && need.orgId !== adminSelectedOrg) {
          return false;
        }
      }

      // 2. Scope Filter within this charity (All branches of this charity vs My branch only)
      if (scopeFilter === 'mine') {
        if (need.branchId !== userProfile?.branchId && !isSuperAdmin) return false;
      }

      // 3. Text Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = need.title?.toLowerCase().includes(q);
        const matchDesc = need.needDescription?.toLowerCase().includes(q);
        const matchBranch = need.branchName?.toLowerCase().includes(q);
        const matchWilaya = (need.location?.city || need.location?.wilaya)?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchBranch && !matchWilaya) return false;
      }

      // 4. Category Filter
      if (selectedCategory !== 'all') {
        const itemCategory = need.category || (need.items && need.items[0]?.category);
        if (itemCategory !== selectedCategory) return false;
      }

      // 5. Wilaya Filter
      if (selectedWilaya !== 'all') {
        const needWilaya = need.location?.city || need.location?.wilaya;
        if (needWilaya !== selectedWilaya) return false;
      }

      // 6. Urgency Filter
      if (selectedUrgency !== 'all') {
        if (need.urgency !== selectedUrgency && need.priority !== selectedUrgency) return false;
      }

      return true;
    });
  }, [needs, scopeFilter, userProfile?.orgId, userProfile?.branchId, isSuperAdmin, adminSelectedOrg, searchTerm, selectedCategory, selectedWilaya, selectedUrgency]);

  const activeFiltersCount = (selectedWilaya !== 'all' ? 1 : 0) + (selectedUrgency !== 'all' ? 1 : 0) + (adminSelectedOrg !== 'all' ? 1 : 0);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedWilaya('all');
    setSelectedUrgency('all');
    setAdminSelectedOrg('all');
    setShowFiltersDropdown(false);
  };

  const handleToggleStatus = async (need) => {
    const newStatus = need.status === 'fulfilled' ? 'open' : 'fulfilled';
    try {
      await updateNeed(need.id, { status: newStatus });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const currentOrgTitle = isSuperAdmin ? (isRtl ? 'لوحة المراقبة الشاملة' : 'Global Network') : (userProfile?.orgName || 'الجمعية');
  const currentBranchTitle = isSuperAdmin ? 'Super Admin' : (userProfile?.branchName || 'الفرع الميداني');

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-3.5 animate-in fade-in duration-200">
      
      {/* 0. CHARITY & BRANCH IDENTITY HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs sm:text-sm font-black text-slate-900 truncate">{currentOrgTitle}</h2>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 shrink-0">
                {isSuperAdmin ? 'Admin' : (isRtl ? 'تنسيق داخلي' : 'Same Charity')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-700" />
              <span>{currentBranchTitle}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingNeed(null);
            setShowPostModal(true);
          }}
          className="bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-xs flex items-center gap-1.5 transition shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-emerald-300" />
          <span>{isRtl ? 'طلب مساعدة' : 'Post Need'}</span>
        </button>
      </div>

      {/* 1. TOP STICKY SEARCH & ACTIONS BAR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-2.5 space-y-2">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isRtl ? 'ابحث في نداءات فروع جمعيتك...' : 'Search needs across branches...'}
              className="w-full pl-9 pr-8 rtl:pr-9 rtl:pl-8 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-700 outline-none transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rtl:left-2.5 rtl:right-auto text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
              showFiltersDropdown || activeFiltersCount > 0
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title={isRtl ? 'تصفية حسب الولاية والاستعجال' : 'Filters'}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-800 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Collapsible Filter Drawer */}
        {showFiltersDropdown && (
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in">
            {isSuperAdmin && (
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  {isRtl ? 'تصفية حسب الجمعية (للمشرف العام)' : 'Filter by Charity'}
                </label>
                <select
                  value={adminSelectedOrg}
                  onChange={e => setAdminSelectedOrg(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-700 outline-none font-medium"
                >
                  <option value="all">{isRtl ? 'جميع الجمعيات' : 'All Charities'}</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {isRtl ? 'تصفية حسب الولاية' : 'Wilaya'}
              </label>
              <select
                value={selectedWilaya}
                onChange={e => setSelectedWilaya(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-700 outline-none"
              >
                <option value="all">{isRtl ? 'جميع الولايات (58 ولاية)' : 'All Wilayas'}</option>
                {ALGERIA_WILAYAS.map(w => (
                  <option key={w.code} value={isRtl ? w.nameAr : w.nameEn}>
                    {w.code} - {isRtl ? w.nameAr : w.nameEn}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                {isRtl ? 'درجة الاستعجال' : 'Urgency'}
              </label>
              <select
                value={selectedUrgency}
                onChange={e => setSelectedUrgency(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-700 outline-none"
              >
                <option value="all">{isRtl ? 'جميع الدرجات' : 'All Levels'}</option>
                <option value="high">{isRtl ? '🔴 حالة عاجلة' : 'Urgent'}</option>
                <option value="medium">{isRtl ? '🟡 خلال أيام' : 'Within Days'}</option>
                <option value="low">{isRtl ? '🟢 عادي / مستمر' : 'Normal'}</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 2. ICON-ONLY CATEGORY PILLS + SCOPE TOGGLE */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-0.5 scrollbar-none">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0 border ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scope Toggle (All branches in this charity vs My branch) */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-xl shrink-0">
          <button
            onClick={() => setScopeFilter('all')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
              scopeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
            }`}
          >
            {isRtl ? 'كل فروع الجمعية' : 'All Branches'}
          </button>
          <button
            onClick={() => setScopeFilter('mine')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
              scopeFilter === 'mine' ? 'bg-white text-emerald-900 shadow-2xs font-extrabold' : 'text-slate-500'
            }`}
          >
            {isRtl ? 'فرعنا فقط' : 'My Branch'}
          </button>
        </div>
      </div>

      {/* 3. SCROLLABLE CLEAN FEED */}
      <div className="space-y-2.5 pt-1">
        {filteredNeeds.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">
              {isRtl ? 'لا توجد طلبات مساعدة من فروع جمعيتكم حالياً' : 'No relief needs found for your charity'}
            </h3>
            <p className="text-xs text-slate-500">
              {isRtl ? 'عندما يقوم أي فرع تابع لجمعيتكم بنشر طلب، سيظهر هنا فوراً.' : 'When any branch of your charity posts a need, it will appear here.'}
            </p>
            {(searchTerm || selectedCategory !== 'all' || selectedWilaya !== 'all' || selectedUrgency !== 'all' || scopeFilter !== 'all') && (
              <button
                onClick={() => {
                  handleResetFilters();
                  setScopeFilter('all');
                }}
                className="mt-2 text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isRtl ? 'إعادة ضبط كل الفلاتر' : 'Reset All'}</span>
              </button>
            )}
          </div>
        ) : (
          filteredNeeds.map(need => (
            <NeedCard
              key={need.id}
              need={need}
              onSelect={(req) => setSelectedNeed(req)}
              onEdit={(req) => {
                setEditingNeed(req);
                setShowPostModal(true);
              }}
              onToggleStatus={handleToggleStatus}
            />
          ))
        )}
      </div>

      {/* Post/Edit Need Modal */}
      {showPostModal && (
        <PostNeedModal
          isOpen={showPostModal}
          onClose={() => {
            setShowPostModal(false);
            setEditingNeed(null);
          }}
          initialData={editingNeed}
        />
      )}

      {/* Request Detail Sheet */}
      {selectedNeed && (
        <RequestDetailModal
          isOpen={Boolean(selectedNeed)}
          onClose={() => setSelectedNeed(null)}
          request={selectedNeed}
        />
      )}

    </div>
  );
}

export { Dashboard };
