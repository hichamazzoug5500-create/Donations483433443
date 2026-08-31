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
  KeyRound,
  Truck,
  Activity,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';

export default function AdminPanel() {
  const { userProfile, isSuperAdmin, createNewStaffAccount } = useAuth();
  const { 
    organizations, 
    branches, 
    needs, 
    dispatches, 
    systemUsers, 
    createOrganization, 
    createBranch, 
    deleteAdminUser,
    deleteNeed
  } = useData();
  const { isRtl } = useLanguage();

  const [activeTab, setActiveTab] = useState('overview');
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
    password: 'password123',
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
        orgName: selectedOrg ? selectedOrg.name : 'الهلال الأحمر الجزائري'
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
      await createNewStaffAccount({
        ...userForm,
        orgName: selectedOrg ? selectedOrg.name : 'الهلال الأحمر الجزائري',
        branchName: selectedBranch ? selectedBranch.name : 'الفرع الميداني'
      });
      alert(isRtl ? 'تم إنشاء الحساب بنجاح! يمكن للمستخدم تسجيل الدخول الآن.' : 'User account created successfully!');
      setShowUserModal(false);
      setUserForm({
        email: '',
        password: 'password123',
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

  const activeNeedsCount = needs.filter(n => n.status !== 'fulfilled' && n.status !== 'cancelled').length;
  const inTransitDispatches = dispatches.filter(d => d.status === 'in_transit' || d.status === 'dispatched').length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-xl bg-purple-700 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              {isRtl ? 'لوحة الإدارة والتحكم' : 'Admin Hub'}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isRtl 
              ? 'إدارة المنظمات الخيرية، الفروع، والحسابات المعتمدة.' 
              : 'Manage charity organizations, branches, and authorized staff.'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          {[
            { id: 'overview', label: isRtl ? 'نظرة عامة' : 'Overview', icon: Activity },
            { id: 'orgs', label: isRtl ? 'المنظمات' : 'Orgs', icon: Building2 },
            { id: 'branches', label: isRtl ? 'الفروع' : 'Branches', icon: MapPin },
            { id: 'users', label: isRtl ? 'المستخدمين' : 'Users', icon: Users },
            { id: 'data', label: isRtl ? 'النداءات' : 'Needs', icon: Layers }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-purple-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">{isRtl ? 'المنظمات' : 'Orgs'}</span>
            <p className="text-2xl font-black text-slate-900">{organizations.length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">{isRtl ? 'الفروع' : 'Branches'}</span>
            <p className="text-2xl font-black text-slate-900">{branches.length}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">{isRtl ? 'النداءات الحية' : 'Active Needs'}</span>
            <p className="text-2xl font-black text-slate-900">{activeNeedsCount}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">{isRtl ? 'القوافل' : 'Dispatches'}</span>
            <p className="text-2xl font-black text-slate-900">{inTransitDispatches}</p>
          </div>
        </div>
      )}

      {/* 2. ORGANIZATIONS TAB */}
      {activeTab === 'orgs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              {isRtl ? 'المنظمات والجمعيات' : 'Organizations'} ({organizations.length})
            </h2>
            <button
              onClick={() => setShowOrgModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة منظمة' : 'Add Org'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {organizations.map(org => (
              <div key={org.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{org.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">{org.type}</span>
                </div>
                {org.nameEn && <p className="text-xs text-slate-400">{org.nameEn}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. BRANCHES TAB */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              {isRtl ? 'فروع الجمعيات' : 'Branch Locations'} ({branches.length})
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
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة فرع' : 'Add Branch'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {branches.map(branch => (
              <div key={branch.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">{branch.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{branch.status}</span>
                </div>
                <p className="text-xs text-slate-500">📍 {branch.wilaya} {branch.address ? `— ${branch.address}` : ''}</p>
                {branch.phone && <p className="text-xs text-slate-500 font-mono">📞 {branch.phone}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. USERS TAB */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isRtl ? 'حسابات المنسقين والمشرفين' : 'Staff Accounts'} ({systemUsers.length})
              </h2>
              <p className="text-[11px] text-slate-500">
                {isRtl ? 'يمكنك إضافة حساب جديد وتعيين كلمة المرور الخاصة به.' : 'Create new coordinator accounts with passwords.'}
              </p>
            </div>
            <button
              onClick={() => {
                setUserForm(prev => ({
                  ...prev,
                  orgId: organizations[0]?.id || 'org-crescent-dz',
                  branchId: branches[0]?.id || 'branch-cra-blida'
                }));
                setShowUserModal(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isRtl ? 'إضافة منسق' : 'Add User'}</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-right">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">{isRtl ? 'الاسم والبريد' : 'Name & Email'}</th>
                  <th className="px-4 py-2.5">{isRtl ? 'الفرع' : 'Branch'}</th>
                  <th className="px-4 py-2.5">{isRtl ? 'الدور' : 'Role'}</th>
                  <th className="px-4 py-2.5 text-center">{isRtl ? 'حذف' : 'Delete'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {systemUsers.map(u => (
                  <tr key={u.uid || u.email} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-2.5">
                      <p className="font-bold text-slate-900">{u.displayName}</p>
                      <p className="text-slate-400 font-mono text-[11px]">{u.email}</p>
                    </td>
                    <td className="px-4 py-2.5 text-slate-600">
                      {u.branchName || u.orgName || '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {u.role !== 'super_admin' && (
                        <button
                          onClick={() => {
                            if (confirm(isRtl ? `حذف ${u.displayName}؟` : `Delete ${u.displayName}?`)) {
                              deleteAdminUser(u.uid);
                            }
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* 5. DATA TAB */}
      {activeTab === 'data' && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">
            {isRtl ? 'إدارة وحذف النداءات' : 'Manage Needs'} ({needs.length})
          </h2>

          <div className="space-y-2">
            {needs.map(n => (
              <div key={n.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{n.title || n.needDescription}</span>
                  <span className="text-slate-500">{n.branchName} • {n.location?.city || n.location?.wilaya}</span>
                </div>
                <button
                  onClick={() => {
                    if (confirm(isRtl ? 'حذف هذا النداء نهائياً؟' : 'Delete this need?')) {
                      deleteNeed(n.id);
                    }
                  }}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {showOrgModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3">{isRtl ? 'إضافة منظمة جديدة' : 'Add Org'}</h3>
            <form onSubmit={handleCreateOrg} className="space-y-3">
              <input
                required
                type="text"
                placeholder={isRtl ? 'اسم المنظمة' : 'Org Name'}
                value={orgForm.name}
                onChange={e => setOrgForm({ ...orgForm, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowOrgModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 rounded-xl">
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
            <h3 className="text-sm font-bold text-slate-900 mb-3">{isRtl ? 'إضافة فرع جديد' : 'Add Branch'}</h3>
            <form onSubmit={handleCreateBranch} className="space-y-3">
              <input
                required
                type="text"
                placeholder={isRtl ? 'اسم الفرع' : 'Branch Name'}
                value={branchForm.name}
                onChange={e => setBranchForm({ ...branchForm, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
              <select
                value={branchForm.wilaya}
                onChange={e => setBranchForm({ ...branchForm, wilaya: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                {ALGERIA_WILAYAS.map(w => (
                  <option key={w.code} value={w.nameAr}>{w.code} - {w.nameAr}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowBranchModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 rounded-xl">
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
            <h3 className="text-sm font-bold text-slate-900 mb-3">{isRtl ? 'إضافة حساب منسق جديد' : 'Add Staff User'}</h3>
            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">{isRtl ? 'الاسم الكامل' : 'Full Name'}</label>
                <input
                  required
                  type="text"
                  placeholder="محمد بن علي"
                  value={userForm.displayName}
                  onChange={e => setUserForm({ ...userForm, displayName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">{isRtl ? 'البريد الإلكتروني أو اسم المستخدم' : 'Email / Username'}</label>
                <input
                  required
                  type="text"
                  placeholder="blida@hopelink.dz"
                  value={userForm.email}
                  onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs dir-ltr"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">{isRtl ? 'كلمة المرور' : 'Password'}</label>
                <input
                  required
                  type="text"
                  placeholder="password123"
                  value={userForm.password}
                  onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs dir-ltr font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 rounded-xl">
                  {isRtl ? 'إنشاء الحساب' : 'Create Account'}
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
