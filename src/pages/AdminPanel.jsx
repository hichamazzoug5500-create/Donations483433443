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
  const { isRtl } = useLanguage();

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
        <div className="p-4 rounded-full bg-red-100 text-red-600 mb-4">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {isRtl ? 'صلاحيات وصول مقيدة' : 'Restricted Access'}
        </h2>
        <p className="text-slate-600 max-w-md text-xs">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="p-2 rounded-xl bg-purple-700 text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isRtl ? 'لوحة الإدارة والتحكم العام' : 'Central Admin Hub'}
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isRtl 
              ? 'إدارة المنظمات الخيرية، الفروع، الحسابات المعتمدة، ومراقبة تدفق المساعدات على المستوى الوطني.' 
              : 'Manage charity organizations, branches, authorized staff, and national aid logistics.'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
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
                    ? 'bg-white text-purple-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">{isRtl ? 'المنظمات المعتمدة' : 'Organizations'}</span>
                <Building2 className="w-5 h-5 text-emerald-700" />
              </div>
              <p className="text-3xl font-black text-slate-900">{organizations.length}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">{isRtl ? 'إجمالي الفروع' : 'Total Branches'}</span>
                <MapPin className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">{branches.length}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">{isRtl ? 'النداءات النشطة' : 'Active Needs'}</span>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-3xl font-black text-slate-900">{activeNeedsCount}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">{isRtl ? 'قوافل في المسار' : 'Convoys in Transit'}</span>
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-3xl font-black text-slate-900">{inTransitDispatches}</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. ORGANIZATIONS TAB */}
      {/* ==================================================== */}
      {activeTab === 'orgs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {isRtl ? 'المنظمات والجمعيات الخيرية' : 'Registered Organizations'} ({organizations.length})
            </h2>
            <button
              onClick={() => setShowOrgModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إضافة منظمة جديدة' : 'Add Organization'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.map(org => (
              <div key={org.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                    {org.type}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{org.name}</h3>
                <p className="text-xs text-slate-500 mb-2">{org.nameEn || ''}</p>
                <div className="text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <span>{org.allowCrossOrg ? '✅ تنسيق مشترك مفعّل' : '🔒 داخلي فقط'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. BRANCHES TAB */}
      {/* ==================================================== */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
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
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إضافة فرع جديد' : 'Add Branch'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map(branch => (
              <div key={branch.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {branch.orgName}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    branch.status === 'disaster_zone' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {branch.status === 'disaster_zone' ? (isRtl ? 'منطقة طوارئ' : 'Disaster') : (isRtl ? 'نشط' : 'Active')}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{branch.name}</h3>
                <p className="text-xs text-slate-500">📍 {branch.wilaya} {branch.address ? `— ${branch.address}` : ''}</p>
                {branch.phone && <p className="text-xs text-slate-500 mt-1">📞 {branch.phone}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. USERS TAB */}
      {/* ==================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              {isRtl ? 'حسابات منسقي الفروع' : 'Authorized Staff'} ({systemUsers.length})
            </h2>
            <button
              onClick={() => {
                if (organizations.length === 0) {
                  alert(isRtl ? "يرجى إضافة منظمة أولاً" : "Please create an organization first");
                  return;
                }
                setUserForm(prev => ({
                  ...prev,
                  orgId: organizations[0].id,
                  branchId: branches[0]?.id || ''
                }));
                setShowUserModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إضافة منسق / مستخدم' : 'Add Staff User'}</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-xs text-right">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">{isRtl ? 'الاسم والبريد' : 'Name & Email'}</th>
                  <th className="px-5 py-3">{isRtl ? 'المنظمة والفرع' : 'Org & Branch'}</th>
                  <th className="px-5 py-3">{isRtl ? 'الدور' : 'Role'}</th>
                  <th className="px-5 py-3 text-center">{isRtl ? 'حذف' : 'Delete'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {systemUsers.map(u => (
                  <tr key={u.uid || u.email} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3">
                      <p className="font-bold text-slate-900">{u.displayName}</p>
                      <p className="text-slate-400 font-mono">{u.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-slate-800 font-medium">{u.orgName}</p>
                      <p className="text-slate-400">{u.branchName || '—'}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {u.role !== 'super_admin' && (
                        <button
                          onClick={() => {
                            if (confirm(isRtl ? `حذف ${u.displayName}؟` : `Delete ${u.displayName}?`)) {
                              deleteAdminUser(u.uid);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
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
      )}

      {/* ==================================================== */}
      {/* 5. DATA TAB */}
      {/* ==================================================== */}
      {activeTab === 'data' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            {isRtl ? 'إدارة كافة نداءات المساعدة' : 'Manage Needs'} ({needs.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {needs.map(n => (
              <div key={n.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-bold text-xs text-slate-900">{n.title || n.needDescription}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {n.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{n.branchName} • 📍 {n.location?.city || n.location?.wilaya}</p>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (confirm(isRtl ? 'حذف هذا الطلب؟' : 'Delete request?')) {
                        deleteNeed(n.id);
                      }
                    }}
                    className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showOrgModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">{isRtl ? 'إضافة منظمة جديدة' : 'Add Org'}</h3>
            <form onSubmit={handleCreateOrg} className="space-y-3">
              <input
                required
                type="text"
                placeholder={isRtl ? 'اسم المنظمة' : 'Org Name'}
                value={orgForm.name}
                onChange={e => setOrgForm({ ...orgForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowOrgModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl">
                  {isRtl ? 'حفظ' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBranchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">{isRtl ? 'إضافة فرع جديد' : 'Add Branch'}</h3>
            <form onSubmit={handleCreateBranch} className="space-y-3">
              <input
                required
                type="text"
                placeholder={isRtl ? 'اسم الفرع' : 'Branch Name'}
                value={branchForm.name}
                onChange={e => setBranchForm({ ...branchForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
              <select
                value={branchForm.wilaya}
                onChange={e => setBranchForm({ ...branchForm, wilaya: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
              >
                {ALGERIA_WILAYAS.map(w => (
                  <option key={w.code} value={w.nameAr}>{w.code} - {w.nameAr}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowBranchModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl">
                  {isRtl ? 'حفظ' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">{isRtl ? 'إضافة منسق' : 'Add Staff'}</h3>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <input
                required
                type="text"
                placeholder={isRtl ? 'الاسم الكامل' : 'Display Name'}
                value={userForm.displayName}
                onChange={e => setUserForm({ ...userForm, displayName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
              <input
                required
                type="email"
                placeholder="example@gmail.com"
                value={userForm.email}
                onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs dir-ltr"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl">
                  {isRtl ? 'حفظ' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export { AdminPanel };
