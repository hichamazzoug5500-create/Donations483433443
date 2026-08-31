import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Users, 
  Package, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Eye, 
  RefreshCw, 
  Search,
  Filter,
  Truck,
  Activity,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';
import LocationPicker from '../components/LocationPicker';

export default function AdminPanel() {
  const { userProfile, isSuperAdmin } = useAuth();
  const { 
    organizations, 
    branches, 
    needs, 
    dispatches, 
    systemUsers, 
    createOrganization, 
    createBranch, 
    createAdminUser, 
    deleteAdminUser,
    deleteNeed,
    updateNeed,
    updateDispatchStatus
  } = useData();
  const { isRtl, t } = useLanguage();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orgs' | 'branches' | 'users' | 'data'
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Form States
  const [orgForm, setOrgForm] = useState({ name: '', nameEn: '', type: 'ngo', allowCrossOrg: true });
  const [branchForm, setBranchForm] = useState({
    orgId: '',
    name: '',
    wilaya: 'الجزائر العاصمة',
    address: '',
    phone: '',
    status: 'active',
    capabilities: ['warehouse', 'volunteers'],
    location: { lat: 36.7538, lng: 3.0588 }
  });
  const [userForm, setUserForm] = useState({
    email: '',
    displayName: '',
    phone: '',
    role: 'branch_member',
    orgId: '',
    branchId: ''
  });

  const [saving, setSaving] = useState(false);

  if (!isSuperAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 mb-4">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {isRtl ? 'صلاحيات وصول مقيدة' : 'Restricted Access'}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md">
          {isRtl 
            ? 'لوحة التحكم المركزية مخصصة للمسؤولين العامين للمنظومة فقط (Super Admin).' 
            : 'The central administration panel is restricted to system Super Administrators only.'}
        </p>
      </div>
    );
  }

  // Handle Organization Creation
  const handleCreateOrg = async (e) => {
    e.preventDefault();
    if (!orgForm.name.trim()) return;
    setSaving(true);
    try {
      await createOrganization(orgForm);
      setShowOrgModal(false);
      setOrgForm({ name: '', nameEn: '', type: 'ngo', allowCrossOrg: true });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle Branch Creation
  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!branchForm.name.trim() || !branchForm.orgId) return;
    setSaving(true);
    try {
      const selectedOrg = organizations.find(o => o.id === branchForm.orgId);
      await createBranch({
        ...branchForm,
        orgName: selectedOrg ? selectedOrg.name : 'منظمة'
      });
      setShowBranchModal(false);
      setBranchForm({
        orgId: organizations[0]?.id || '',
        name: '',
        wilaya: 'الجزائر العاصمة',
        address: '',
        phone: '',
        status: 'active',
        capabilities: ['warehouse', 'volunteers'],
        location: { lat: 36.7538, lng: 3.0588 }
      });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle User Creation
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!userForm.email.trim() || !userForm.displayName.trim() || !userForm.orgId) return;
    setSaving(true);
    try {
      const selectedOrg = organizations.find(o => o.id === userForm.orgId);
      const selectedBranch = branches.find(b => b.id === userForm.branchId);
      await createAdminUser({
        ...userForm,
        orgName: selectedOrg ? selectedOrg.name : '',
        branchName: selectedBranch ? selectedBranch.name : ''
      });
      setShowUserModal(false);
      setUserForm({
        email: '',
        displayName: '',
        phone: '',
        role: 'branch_member',
        orgId: organizations[0]?.id || '',
        branchId: ''
      });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const activeDisasterBranches = branches.filter(b => b.status === 'disaster_zone');
  const activeNeedsCount = needs.filter(n => n.status !== 'fulfilled' && n.status !== 'cancelled').length;
  const inTransitDispatches = dispatches.filter(d => d.status === 'in_transit' || d.status === 'dispatched').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isRtl ? 'لوحة القيادة المركزية' : 'Central Admin Hub'}
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              Super Admin
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isRtl 
              ? 'إدارة المنظمات الخيرية، الفروع، الحسابات المعتمدة، ومراقبة تدفق المساعدات على المستوى الوطني.' 
              : 'Manage charity organizations, branches, authorized staff, and national aid logistics.'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl overflow-x-auto">
          {[
            { id: 'overview', label: isRtl ? 'نظرة عامة' : 'Overview', icon: Activity },
            { id: 'orgs', label: isRtl ? 'المنظمات' : 'Organizations', icon: Building2 },
            { id: 'branches', label: isRtl ? 'الفروع' : 'Branches', icon: MapPin },
            { id: 'users', label: isRtl ? 'المستخدمين' : 'Users', icon: Users },
            { id: 'data', label: isRtl ? 'البيانات والنداءات' : 'Data & Needs', icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================================== */}
      {/* 1. OVERVIEW TAB */}
      {/* ==================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">{isRtl ? 'المنظمات المعتمدة' : 'Organizations'}</span>
                <Building2 className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{organizations.length}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">{isRtl ? 'إجمالي الفروع' : 'Total Branches'}</span>
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-slate-900 dark:text-white">{branches.length}</p>
                {activeDisasterBranches.length > 0 && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                    {activeDisasterBranches.length} {isRtl ? 'في منطقة طوارئ' : 'disaster zones'}
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">{isRtl ? 'النداءات النشطة' : 'Active Needs'}</span>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{activeNeedsCount}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">{isRtl ? 'قوافل في المسار' : 'Convoys in Transit'}</span>
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{inTransitDispatches}</p>
            </div>
          </div>

          {/* Quick Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Disaster Branches List */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>{isRtl ? 'الفروع المصنفة في مناطق طوارئ / كوارث' : 'Emergency & Disaster Branches'}</span>
              </h3>

              {activeDisasterBranches.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">{isRtl ? 'لا توجد فروع في حالة طوارئ حالياً' : 'No branches currently in disaster zone status'}</p>
              ) : (
                <div className="space-y-3">
                  {activeDisasterBranches.map(branch => (
                    <div key={branch.id} className="p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{branch.name}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{branch.orgName} • {branch.wilaya}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-xs font-bold">
                        {isRtl ? 'منطقة طوارئ' : 'Disaster Zone'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Live Dispatches */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>{isRtl ? 'أحدث تحركات الإغاثة والقوافل' : 'Recent Convoys & Dispatches'}</span>
              </h3>

              {dispatches.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">{isRtl ? 'لا توجد قوافل مسجلة' : 'No dispatches recorded'}</p>
              ) : (
                <div className="space-y-3">
                  {dispatches.slice(0, 4).map(disp => (
                    <div key={disp.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {disp.fromBranchName} ➔ {disp.toBranchName}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {disp.items?.length || 0} {isRtl ? 'أصناف معونة' : 'items'} • {disp.transportDetails?.driverName || (isRtl ? 'سائق' : 'driver')}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                        {disp.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. ORGANIZATIONS TAB */}
      {/* ==================================================== */}
      {activeTab === 'orgs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isRtl ? 'المنظمات والجمعيات الخيرية' : 'Registered Organizations'} ({organizations.length})
            </h2>
            <button
              onClick={() => setShowOrgModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إضافة منظمة جديدة' : 'Add Organization'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizations.map(org => {
              const orgBranches = branches.filter(b => b.orgId === org.id);
              return (
                <div key={org.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                        {org.type}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{org.name}</h3>
                    {org.nameEn && <p className="text-xs text-slate-500 mb-3">{org.nameEn}</p>}
                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <span><strong>{orgBranches.length}</strong> {isRtl ? 'فروع' : 'branches'}</span>
                      <span>{org.allowCrossOrg ? '✅ تنسيق مشترك مفعّل' : '🔒 داخلي فقط'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. BRANCHES TAB */}
      {/* ==================================================== */}
      {activeTab === 'branches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isRtl ? 'فروع الجمعيات الإقليمية والمحلية' : 'Branch Locations'} ({branches.length})
            </h2>
            <button
              onClick={() => {
                if (organizations.length === 0) {
                  alert(isRtl ? "يرجى إضافة منظمة أولاً" : "Please create an organization first");
                  return;
                }
                setBranchForm(prev => ({ ...prev, orgId: organizations[0].id }));
                setShowBranchModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إضافة فرع جديد' : 'Add Branch'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map(branch => (
              <div key={branch.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
                      {branch.orgName}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      branch.status === 'disaster_zone' 
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' 
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {branch.status === 'disaster_zone' ? (isRtl ? 'منطقة طوارئ' : 'Disaster') : (isRtl ? 'نشط' : 'Active')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">{branch.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{branch.wilaya} {branch.address ? `— ${branch.address}` : ''}</span>
                  </p>

                  {/* Capabilities Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {branch.capabilities?.map((cap, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>📞 {branch.phone || '—'}</span>
                  <span>📍 {branch.location?.lat?.toFixed(2)}, {branch.location?.lng?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. USERS TAB */}
      {/* ==================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isRtl ? 'حسابات منسقي الفروع والمشرفين' : 'Authorized Staff & Users'} ({systemUsers.length})
              </h2>
              <p className="text-xs text-slate-500">
                {isRtl ? 'لا يمكن لأي مستخدم التسجيل ذاتياً — الحسابات تضاف يدوياً هنا.' : 'Self-registration is disabled. All users must be added by Admin.'}
              </p>
            </div>
            <button
              onClick={() => {
                if (organizations.length === 0) {
                  alert(isRtl ? "يرجى إضافة منظمة وفروع أولاً" : "Please create organizations and branches first");
                  return;
                }
                setUserForm(prev => ({
                  ...prev,
                  orgId: organizations[0].id,
                  branchId: branches.filter(b => b.orgId === organizations[0].id)[0]?.id || ''
                }));
                setShowUserModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إضافة منسق / مستخدم' : 'Add Staff User'}</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-4">{isRtl ? 'الاسم والبريد' : 'Name & Email'}</th>
                    <th className="px-6 py-4">{isRtl ? 'المنظمة والفرع' : 'Org & Branch'}</th>
                    <th className="px-6 py-4">{isRtl ? 'الدور' : 'Role'}</th>
                    <th className="px-6 py-4">{isRtl ? 'الهاتف' : 'Phone'}</th>
                    <th className="px-6 py-4 text-center">{isRtl ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {systemUsers.map(user => (
                    <tr key={user.uid || user.email} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 dark:text-white">{user.displayName}</p>
                        <p className="text-xs text-slate-500 font-mono">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900 dark:text-slate-100">{user.orgName}</p>
                        <p className="text-xs text-slate-500">{user.branchName || '—'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          user.role === 'super_admin'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {user.phone || '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.role !== 'super_admin' && (
                          <button
                            onClick={() => {
                              if (confirm(isRtl ? `حذف المستخدم ${user.displayName}؟` : `Delete user ${user.displayName}?`)) {
                                deleteAdminUser(user.uid);
                              }
                            }}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                            title={isRtl ? 'حذف الحساب' : 'Delete user'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. DATA & NEEDS MANAGEMENT TAB */}
      {/* ==================================================== */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isRtl ? 'كافة نداءات الإغاثة وقوافل المساعدات' : 'Global Needs & Dispatches'}
            </h2>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {isRtl ? 'نداءات الإغاثة المسجلة' : 'Registered Relief Needs'} ({needs.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {needs.map(need => (
                <div key={need.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                      {need.priority}
                    </span>
                    <span className="text-xs text-slate-500">{need.branchName}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">{need.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{need.location?.wilaya} — {need.location?.address}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-bold text-emerald-600">الحالة: {need.status}</span>
                    <div className="flex items-center gap-2">
                      {need.status !== 'fulfilled' && (
                        <button
                          onClick={() => updateNeed(need.id, { status: 'fulfilled' })}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold hover:bg-emerald-100 transition"
                        >
                          {isRtl ? 'تعليم كمكتمل' : 'Mark Fulfilled'}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(isRtl ? 'حذف هذا النداء؟' : 'Delete this need?')) {
                            deleteNeed(need.id);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD ORGANIZATION */}
      {/* ==================================================== */}
      {showOrgModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {isRtl ? 'إضافة منظمة خيرية جديدة' : 'Add New Organization'}
            </h3>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'اسم المنظمة (بالعربية)' : 'Organization Name (Arabic)'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الهلال الأحمر الجزائري"
                  value={orgForm.name}
                  onChange={e => setOrgForm({ ...orgForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'الاسم بالإنجليزية (اختياري)' : 'English Name (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Algerian Red Crescent"
                  value={orgForm.nameEn}
                  onChange={e => setOrgForm({ ...orgForm, nameEn: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'نوع المنظمة' : 'Type'}
                </label>
                <select
                  value={orgForm.type}
                  onChange={e => setOrgForm({ ...orgForm, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  <option value="red_crescent">الهلال الأحمر / Red Crescent</option>
                  <option value="ngo">جمعية إنسانية / NGO</option>
                  <option value="government">هيئة رسمية / Government</option>
                  <option value="community">مبادرة مجتمعية / Community</option>
                </select>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="crossOrg"
                  checked={orgForm.allowCrossOrg}
                  onChange={e => setOrgForm({ ...orgForm, allowCrossOrg: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <label htmlFor="crossOrg" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isRtl ? 'السماح بالتنسيق المشترك مع منظمات أخرى في الكوارث' : 'Allow Cross-Organization Disaster Coordination'}
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOrgModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 text-xs font-bold"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {saving ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ المنظمة' : 'Save Org')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD BRANCH */}
      {/* ==================================================== */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {isRtl ? 'إضافة فرع لمنظمة' : 'Add New Branch'}
            </h3>
            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'المنظمة الأم' : 'Parent Organization'} *
                </label>
                <select
                  required
                  value={branchForm.orgId}
                  onChange={e => setBranchForm({ ...branchForm, orgId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                >
                  {organizations.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'اسم الفرع' : 'Branch Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: فرع ولاية البليدة"
                  value={branchForm.name}
                  onChange={e => setBranchForm({ ...branchForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'الولاية' : 'Wilaya'} *
                  </label>
                  <select
                    value={branchForm.wilaya}
                    onChange={e => setBranchForm({ ...branchForm, wilaya: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    {ALGERIA_WILAYAS.map(w => (
                      <option key={w.code} value={w.nameAr}>{w.code} - {w.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'حالة الفرع' : 'Status'}
                  </label>
                  <select
                    value={branchForm.status}
                    onChange={e => setBranchForm({ ...branchForm, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="active">{isRtl ? 'نشط (طبيعي)' : 'Active'}</option>
                    <option value="disaster_zone">{isRtl ? 'منطقة طوارئ / كوارث' : 'Disaster Zone'}</option>
                    <option value="inactive">{isRtl ? 'غير مفعل' : 'Inactive'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'رقم هاتف المنسق' : 'Phone'}
                </label>
                <input
                  type="text"
                  placeholder="0550112233"
                  value={branchForm.phone}
                  onChange={e => setBranchForm({ ...branchForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBranchModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 text-xs font-bold"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {saving ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ الفرع' : 'Save Branch')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD USER */}
      {/* ==================================================== */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {isRtl ? 'إضافة مستخدم / منسق معتمد' : 'Add Authorized User'}
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'البريد الإلكتروني (جوجل)' : 'Email (Google)'} *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'الاسم واللقب' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="أحمد بن علي"
                  value={userForm.displayName}
                  onChange={e => setUserForm({ ...userForm, displayName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'المنظمة' : 'Organization'} *
                  </label>
                  <select
                    required
                    value={userForm.orgId}
                    onChange={e => {
                      const newOrgId = e.target.value;
                      const availableBranches = branches.filter(b => b.orgId === newOrgId);
                      setUserForm({ 
                        ...userForm, 
                        orgId: newOrgId, 
                        branchId: availableBranches[0]?.id || '' 
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    {organizations.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'الفرع' : 'Branch'}
                  </label>
                  <select
                    value={userForm.branchId}
                    onChange={e => setUserForm({ ...userForm, branchId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="">{isRtl ? 'بدون فرع (إدارة عليا)' : 'None (HQ)'}</option>
                    {branches
                      .filter(b => b.orgId === userForm.orgId)
                      .map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'الدور' : 'Role'}
                  </label>
                  <select
                    value={userForm.role}
                    onChange={e => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="branch_member">{isRtl ? 'منسق فرع' : 'Branch Member'}</option>
                    <option value="super_admin">{isRtl ? 'مسؤول عام (Super Admin)' : 'Super Admin'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'الهاتف' : 'Phone'}
                  </label>
                  <input
                    type="text"
                    placeholder="0550000000"
                    value={userForm.phone}
                    onChange={e => setUserForm({ ...userForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 text-xs font-bold"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {saving ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'حفظ المستخدم' : 'Save User')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
