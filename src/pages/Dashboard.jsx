import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  PlusCircle, 
  Search, 
  Filter, 
  RotateCcw,
  LayoutGrid,
  Map as MapIcon,
  Phone,
  Clock,
  HeartHandshake,
  CheckCircle,
  PackageCheck,
  Utensils,
  Shirt,
  Stethoscope,
  Home,
  Package,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';
import NeedCard from '../components/NeedCard';
import PostNeedModal from '../components/PostNeedModal';
import RequestDetailModal from '../components/RequestDetailModal';
import MapView from '../components/MapView';

export default function Dashboard() {
  const { userProfile, isSuperAdmin } = useAuth();
  const { needs, branches, dispatches, updateNeed, deleteNeed, loading } = useData();
  const { isRtl, t } = useLanguage();

  // Active Main Tab
  const [activeTab, setActiveTab] = useState('all_needs'); // 'all_needs' | 'our_needs' | 'our_commitments' | 'map'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'

  // Modals state
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingNeed, setEditingNeed] = useState(null);
  const [selectedNeed, setSelectedNeed] = useState(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');

  const CATEGORIES = [
    { key: 'all', label: isRtl ? 'جميع الاحتياجات' : 'All Categories', icon: Layers },
    { key: 'food', label: isRtl ? 'مواد غذائية' : 'Food', icon: Utensils },
    { key: 'clothing', label: isRtl ? 'ألبسة وأغطية' : 'Clothing', icon: Shirt },
    { key: 'medical', label: isRtl ? 'أدوية ومستلزمات' : 'Medical', icon: Stethoscope },
    { key: 'shelter', label: isRtl ? 'مأوى وسكن' : 'Shelter', icon: Home },
    { key: 'other', label: isRtl ? 'احتياجات أخرى' : 'Other', icon: Package }
  ];

  const userBranchName = userProfile?.branchName || userProfile?.orgName || (isRtl ? 'فرع الهلال الأحمر' : 'Branch');

  // Filtered Needs
  const filteredNeeds = useMemo(() => {
    return needs.filter(need => {
      // Tab Filtering
      if (activeTab === 'our_needs') {
        if (need.branchId !== userProfile?.branchId && !isSuperAdmin) return false;
      } else if (activeTab === 'our_commitments') {
        // Dispatches / commitments from our branch
        const isCommittedByUs = need.committedDonorId === userProfile?.branchId || need.status === 'in_progress';
        if (!isCommittedByUs && !isSuperAdmin) return false;
      }

      // Text Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchTitle = need.title?.toLowerCase().includes(q);
        const matchDesc = need.needDescription?.toLowerCase().includes(q);
        const matchBranch = need.branchName?.toLowerCase().includes(q);
        const matchWilaya = (need.location?.city || need.location?.wilaya)?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchBranch && !matchWilaya) return false;
      }

      // Wilaya Filter
      if (selectedWilaya !== 'all') {
        const needWilaya = need.location?.city || need.location?.wilaya;
        if (needWilaya !== selectedWilaya) return false;
      }

      // Category Filter
      if (selectedCategory !== 'all') {
        const itemCategory = need.category || (need.items && need.items[0]?.category);
        if (itemCategory !== selectedCategory) return false;
      }

      // Urgency Filter
      if (selectedUrgency !== 'all') {
        if (need.urgency !== selectedUrgency && need.priority !== selectedUrgency) return false;
      }

      return true;
    });
  }, [needs, activeTab, userProfile?.branchId, isSuperAdmin, searchTerm, selectedWilaya, selectedCategory, selectedUrgency]);

  // Quick stats
  const totalOpenCount = needs.filter(n => n.status === 'open' || n.status === 'active').length;
  const ourNeedsCount = needs.filter(n => n.branchId === userProfile?.branchId).length;
  const ourCommitmentsCount = needs.filter(n => n.status === 'in_progress' || n.status === 'partially_fulfilled').length;

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedWilaya('all');
    setSelectedCategory('all');
    setSelectedUrgency('all');
  };

  const handleToggleStatus = async (need) => {
    const newStatus = need.status === 'fulfilled' ? 'open' : 'fulfilled';
    try {
      await updateNeed(need.id, { status: newStatus });
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>{userProfile?.orgName}</span>
            </span>
            <span className="text-xs text-slate-500 font-bold">📍 {userProfile?.city || 'الجزائر'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {isRtl ? 'لوحة التنسيق والإغاثة — ' : 'Relief Coordination Hub — '}{userBranchName}
          </h1>
          <p className="text-xs text-slate-500">
            {isRtl ? 'نشر وتصفح احتياجات المساعدات وتنسيق وصول المعونات بين فروع الجمعيات مباشرة.' : 'Post and browse aid needs and coordinate relief delivery directly between branches.'}
          </p>
        </div>

        <button
          onClick={() => {
            setEditingNeed(null);
            setShowPostModal(true);
          }}
          className="bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 transition shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-emerald-300" />
          <span>{isRtl ? 'نشر طلب مساعدة جديد' : 'Post New Need'}</span>
        </button>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all_needs')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'all_needs'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{isRtl ? 'جميع الاحتياجات المفتوحة' : 'All Open Needs'}</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-white/20 text-white font-bold">{totalOpenCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('our_needs')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'our_needs'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>{isRtl ? 'طلبات فرعنا' : 'Our Branch Needs'}</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200 text-slate-700 font-bold">{ourNeedsCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('our_commitments')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'our_commitments'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>{isRtl ? 'التزامات المساعدة' : 'Our Commitments'}</span>
          <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200 text-slate-700 font-bold">{ourCommitmentsCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('map')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
            activeTab === 'map'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          <span>{isRtl ? 'الخريطة التفاعلية' : 'Interactive Map'}</span>
        </button>
      </div>

      {activeTab !== 'map' && (
        <>
          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search and Wilaya Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search */}
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:right-3.5 rtl:left-auto" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder={isRtl ? 'ابحث باسم الفرع، الولاية، أو تفاصيل المساعدة...' : 'Search by branch, wilaya, or supplies needed...'}
                  className="w-full pl-10 pr-3.5 rtl:pr-10 rtl:pl-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              {/* Wilaya Filter */}
              <div className="sm:col-span-3">
                <select
                  value={selectedWilaya}
                  onChange={e => setSelectedWilaya(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-700 outline-none font-medium"
                >
                  <option value="all">{isRtl ? 'جميع الولايات (58 ولاية)' : 'All Wilayas'}</option>
                  {ALGERIA_WILAYAS.map(w => (
                    <option key={w.code} value={isRtl ? w.nameAr : w.nameEn}>
                      {w.code} - {isRtl ? w.nameAr : w.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency Filter */}
              <div className="sm:col-span-3">
                <select
                  value={selectedUrgency}
                  onChange={e => setSelectedUrgency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-700 outline-none font-medium"
                >
                  <option value="all">{isRtl ? 'درجة الاستعجال (الكل)' : 'Urgency (All)'}</option>
                  <option value="high">{isRtl ? '🔴 حالة عاجلة' : 'Urgent'}</option>
                  <option value="medium">{isRtl ? '🟡 خلال أيام' : 'Within Days'}</option>
                  <option value="low">{isRtl ? '🟢 مستمر / عادي' : 'Ongoing'}</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>{filteredNeeds.length} {isRtl ? 'طلب مساعدة متاح' : 'requests found'}</span>
              {(searchTerm || selectedWilaya !== 'all' || selectedCategory !== 'all' || selectedUrgency !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  className="text-emerald-800 hover:underline font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredNeeds.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">
                {isRtl ? 'لا توجد طلبات تطابق هذا البحث' : 'No requests match your filters'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRtl ? 'جرب اختيار ولاية أخرى أو فئة مختلفة.' : 'Try selecting a different wilaya or category.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNeeds.map(need => (
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
              ))}
            </div>
          )}
        </>
      )}

      {/* Interactive Map Tab */}
      {activeTab === 'map' && (
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm h-[600px]">
          <MapView
            needs={needs}
            branches={branches}
            dispatches={dispatches}
            onSelectNeed={(needId) => {
              const req = needs.find(n => n.id === needId);
              if (req) setSelectedNeed(req);
            }}
          />
        </div>
      )}

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

      {/* Request Details & Pledge Modal */}
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
