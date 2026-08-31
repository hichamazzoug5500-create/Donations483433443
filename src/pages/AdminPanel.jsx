import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Plus, 
  Trash2, 
  KeyRound,
  Mail,
  User,
  Layers,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';

export default function AdminPanel() {
  const { isSuperAdmin, createNewStaffAccount } = useAuth();
  const { 
    organizations, 
    branches, 
    needs, 
    createOrganization, 
    deleteOrganization,
    createBranch, 
    deleteBranch,
    deleteNeed,
    purgeAllData
  } = useData();
  const { isRtl } = useLanguage();

  const [activeTab, setActiveTab] = useState('orgs'); // 'orgs' | 'branches' | 'needs' | 'maintenance'
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);

  // Forms
  const [orgForm, setOrgForm] = useState({ name: '', nameEn: '', type: 'ngo' });
  const [branchForm, setBranchForm] = useState({
    orgId: '',
    name: '',
    wilaya: 'البليدة',
    address: '',
    phone: '',
    email: '',
    username: '',
    password: ''
  });

  const [saving, setSaving] = useState(false);
  const [createdBranchInfo, setCreatedBranchInfo] = useState(null);

  if (!isSuperAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="p-4 rounded-full bg-red-100 text-red-600 mb-4">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          {isRtl ? 'صلاحيات وصول مقيدة' : 'Restricted Access'}
        </h2>
        <p className="text-slate-600 max-w-md text-xs">
          {isRtl ? 'لوحة التحكم مخصصة لحساب المشرف العام فقط.' : 'This panel is restricted to the Super Admin.'}
        </p>
      </div>
    );
  }

  // 1. Create Organization
  const handleCreateOrg = async (e) => {
    e.preventDefault();
    if (!orgForm.name.trim()) return;
    setSaving(true);
    try {
      await createOrganization(orgForm);
      setShowOrgModal(false);
      setOrgForm({ name: '', nameEn: '', type: 'ngo' });
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // 2. Create Branch + Create its Login Credentials (with optional Email)
  const handleCreateBranch = async (e) => {
    e.preventDefault();
    if (!branchForm.name.trim() || !branchForm.orgId || !branchForm.username.trim() || !branchForm.password) {
      alert(isRtl ? 'يرجى ملء جميع الحقول بما في ذلك اسم المستخدم وكلمة المرور' : 'Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      const selectedOrg = organizations.find(o => o.id === branchForm.orgId);
      const cleanUsername = branchForm.username.trim().toLowerCase();
      const cleanEmail = branchForm.email ? branchForm.email.trim().toLowerCase() : '';

      // 1. Create Branch record in Firestore
      const branchId = await createBranch({
        orgId: branchForm.orgId,
        orgName: selectedOrg ? selectedOrg.name : 'الجمعية',
        name: branchForm.name,
        wilaya: branchForm.wilaya,
        address: branchForm.address,
        phone: branchForm.phone,
        email: cleanEmail,
        loginUsername: cleanUsername
      });

      // 2. Create Login Account in Firebase Auth & Firestore Users
      await createNewStaffAccount({
        email: cleanEmail,
        username: cleanUsername,
        password: branchForm.password,
        displayName: branchForm.name,
        role: 'branch_member',
        orgId: branchForm.orgId,
        orgName: selectedOrg ? selectedOrg.name : 'الجمعية',
        branchId: branchId,
        branchName: branchForm.name,
        phone: branchForm.phone
      });

      setCreatedBranchInfo({
        branchName: branchForm.name,
        orgName: selectedOrg?.name,
        username: cleanUsername,
        email: cleanEmail,
        password: branchForm.password
      });

      setShowBranchModal(false);
      setBranchForm({
        orgId: organizations[0]?.id || '',
        name: '',
        wilaya: 'البليدة',
        address: '',
        phone: '',
        email: '',
        username: '',
        password: ''
      });
    } catch (err) {
      alert("Error creating branch account: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // 3. Purge all dummy data
  const handlePurgeAll = async () => {
    if (confirm(isRtl ? 'هل أنت متأكد من حذف وتصفير جميع البيانات السابقة؟' : 'Are you sure you want to clear all data?')) {
      setSaving(true);
      try {
        await purgeAllData();
        alert(isRtl ? 'تم حذف وتصفير كافة البيانات بنجاح!' : 'All data wiped successfully!');
      } catch (err) {
        alert("Error: " + err.message);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-5 animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-xl bg-purple-800 text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black text-slate-900">
              {isRtl ? 'لوحة إدارة الجمعيات والفروع' : 'Organizations & Branches Hub'}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-bold">
              Admin
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {isRtl 
              ? 'إنشاء الجمعيات، وتعيين الفروع وحسابات الدخول الخاصة بكل فرع.' 
              : 'Create charities, attach branches, and issue login credentials.'}
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => setActiveTab('orgs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'orgs' ? 'bg-white text-purple-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{isRtl ? '1. الجمعيات' : '1. Charities'} ({organizations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branches')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'branches' ? 'bg-white text-purple-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{isRtl ? '2. الفروع والحسابات' : '2. Branches & Logins'} ({branches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('needs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'needs' ? 'bg-white text-purple-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isRtl ? 'النداءات' : 'Needs'} ({needs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              activeTab === 'maintenance' ? 'bg-white text-red-700 shadow-2xs' : 'text-slate-400 hover:text-red-600'
            }`}
            title={isRtl ? 'تصفير البيانات القديمة' : 'Clean data'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Success Notification after Branch Creation */}
      {createdBranchInfo && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              <span>{isRtl ? 'تم إنشاء الفرع وحساب الدخول بنجاح!' : 'Branch and login account created!'}</span>
            </span>
            <button onClick={() => setCreatedBranchInfo(null)} className="text-xs text-slate-400 hover:text-slate-600">✕</button>
          </div>
          <p className="text-xs text-emerald-950">
            {isRtl ? 'يمكن لمنسق الفرع تسجيل الدخول عبر البيانات التالية:' : 'The branch coordinator can sign in using:'}
          </p>
          <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs font-mono flex flex-wrap gap-4 text-slate-800">
            <span>👤 <strong>{isRtl ? 'اسم المستخدم للدخول:' : 'Username:'}</strong> {createdBranchInfo.username}</span>
            {createdBranchInfo.email && (
              <span>✉️ <strong>{isRtl ? 'البريد:' : 'Email:'}</strong> {createdBranchInfo.email}</span>
            )}
            <span>🔑 <strong>{isRtl ? 'كلمة المرور:' : 'Password:'}</strong> {createdBranchInfo.password}</span>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 1. ORGANIZATIONS TAB */}
      {/* ==================================================== */}
      {activeTab === 'orgs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isRtl ? 'قائمة الجمعيات الإنسانية المسجلة' : 'Registered Charities'}
              </h2>
              <p className="text-xs text-slate-500">
                {isRtl ? 'أضف الجمعيات أولاً، ثم انتقل لتبويب الفروع لإنشاء الفروع التابعة لها.' : 'Add charities first, then add their branches in Tab 2.'}
              </p>
            </div>
            <button
              onClick={() => setShowOrgModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إضافة جمعية جديدة' : 'Add Charity'}</span>
            </button>
          </div>

          {organizations.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                {isRtl ? 'لا توجد جمعيات مضافة حالياً' : 'No charities added yet'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRtl ? 'اضغط على زر "إضافة جمعية جديدة" في الأعلى للبدء.' : 'Click "Add Charity" above to create your first organization.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {organizations.map(org => {
                const orgBranchesCount = branches.filter(b => b.orgId === org.id).length;
                return (
                  <div key={org.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          <Building2 className="w-4 h-4" />
                        </span>
                        <h3 className="font-bold text-sm text-slate-900">{org.name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {orgBranchesCount} {isRtl ? 'فروع تابعة' : 'branches'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(isRtl ? `حذف جمعية "${org.name}"؟` : `Delete ${org.name}?`)) {
                          deleteOrganization(org.id);
                        }
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                      title={isRtl ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. BRANCHES & LOGINS TAB */}
      {/* ==================================================== */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {isRtl ? 'فروع الجمعيات وحسابات الدخول' : 'Branch Locations & Logins'}
              </h2>
              <p className="text-xs text-slate-500">
                {isRtl ? 'إدارة الفروع الإقليمية وتعيين بيانات الاعتماد وحسابات الدخول المؤسساتية.' : 'Manage branch locations and issue official login credentials.'}
              </p>
            </div>

            <button
              onClick={() => {
                if (organizations.length === 0) {
                  alert(isRtl ? 'يرجى إضافة جمعية أولاً في التبويب 1' : 'Please add a charity first in Tab 1');
                  setActiveTab('orgs');
                  return;
                }
                setBranchForm(prev => ({ ...prev, orgId: organizations[0].id }));
                setShowBranchModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>{isRtl ? 'إضافة فرع وتعيين حساب الدخول' : 'Add Branch & Login'}</span>
            </button>
          </div>

          {branches.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">
                {isRtl ? 'لا توجد فروع مضافة حالياً' : 'No branches added yet'}
              </h3>
              <p className="text-xs text-slate-500">
                {isRtl ? 'أنشئ فرعاً وحدد اسم المستخدم وكلمة المرور للدخول.' : 'Create a branch and set its login credentials.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {branches.map(branch => (
                <div key={branch.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 inline-block mb-1">
                        {branch.orgName}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">{branch.name}</h3>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(isRtl ? `حذف فرع "${branch.name}"؟` : `Delete ${branch.name}?`)) {
                          deleteBranch(branch.id);
                        }
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 space-y-0.5">
                    <p>📍 {branch.wilaya} {branch.address ? `— ${branch.address}` : ''}</p>
                    {branch.phone && <p>📞 {branch.phone}</p>}
                    {branch.email && <p className="text-emerald-800 font-mono">✉️ {branch.email}</p>}
                  </div>

                  {branch.loginUsername && (
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                      <span>👤 {isRtl ? 'اسم الدخول:' : 'Login:'} <strong className="text-slate-900">{branch.loginUsername}</strong></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. NEEDS MANAGEMENT TAB */}
      {/* ==================================================== */}
      {activeTab === 'needs' && (
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">
            {isRtl ? 'إدارة نداءات المساعدة المنشورة' : 'Posted Relief Needs'} ({needs.length})
          </h2>

          {needs.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">{isRtl ? 'لا توجد نداءات منشورة' : 'No posted needs'}</p>
          ) : (
            <div className="space-y-2">
              {needs.map(n => (
                <div key={n.id} className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{n.title || n.needDescription}</span>
                    <span className="text-slate-500">{n.orgName} • {n.branchName} • {n.location?.city || n.location?.wilaya}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(isRtl ? 'حذف هذا الطلب؟' : 'Delete need?')) {
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
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. MAINTENANCE TAB */}
      {/* ==================================================== */}
      {activeTab === 'maintenance' && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3">
          <h3 className="text-sm font-bold text-red-700 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>{isRtl ? 'تصفير وحذف البيانات التجريبية' : 'Wipe Dummy / Test Data'}</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isRtl 
              ? 'إذا كانت هناك جمعيات أو فروع قديمة ترغب في مسحها دفعة واحدة للبدء من الصفر بقاعدة بيانات نظيفة.' 
              : 'Purge any residual mock/dummy collections to start with a fresh database.'}
          </p>
          <button
            onClick={handlePurgeAll}
            disabled={saving}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            {saving ? (isRtl ? 'جاري المسح...' : 'Wiping...') : (isRtl ? 'مسح وتصفير كافة البيانات الآن' : 'Wipe All Data')}
          </button>
        </div>
      )}

      {/* MODAL: ADD ORGANIZATION */}
      {showOrgModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-slate-200">
            <h3 className="text-sm font-black text-slate-900 mb-3">{isRtl ? 'إضافة جمعية جديدة' : 'Add Charity Organization'}</h3>
            <form onSubmit={handleCreateOrg} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{isRtl ? 'اسم الجمعية أو المنظمة *' : 'Charity Name *'}</label>
                <input
                  required
                  type="text"
                  placeholder={isRtl ? 'مثال: جمعية الإحسان الخيرية / الهلال الأحمر' : 'e.g. Red Crescent / Ihsan Charity'}
                  value={orgForm.name}
                  onChange={e => setOrgForm({ ...orgForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowOrgModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl">
                  {isRtl ? 'حفظ الجمعية' : 'Save Charity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD BRANCH + CREATE LOGIN CREDENTIALS */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 my-auto animate-in fade-in">
            <h3 className="text-sm font-black text-slate-900 mb-3">
              {isRtl ? 'إضافة فرع وتعيين بيانات الدخول' : 'Add Branch & Issue Login'}
            </h3>

            <form onSubmit={handleCreateBranch} className="space-y-3">
              {/* Select Parent Org */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{isRtl ? 'الجمعية التابع لها *' : 'Parent Charity *'}</label>
                <select
                  required
                  value={branchForm.orgId}
                  onChange={e => setBranchForm({ ...branchForm, orgId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                >
                  {organizations.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              {/* Branch Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{isRtl ? 'اسم الفرع *' : 'Branch Name *'}</label>
                <input
                  required
                  type="text"
                  placeholder={isRtl ? 'مثال: فرع ولاية البليدة' : 'e.g. Blida Branch'}
                  value={branchForm.name}
                  onChange={e => setBranchForm({ ...branchForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              {/* Wilaya & Phone */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{isRtl ? 'الولاية *' : 'Wilaya *'}</label>
                  <select
                    value={branchForm.wilaya}
                    onChange={e => setBranchForm({ ...branchForm, wilaya: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                  >
                    {ALGERIA_WILAYAS.map(w => (
                      <option key={w.code} value={w.nameAr}>{w.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{isRtl ? 'رقم الهاتف' : 'Phone'}</label>
                  <input
                    type="tel"
                    placeholder="0550 12 34 56"
                    value={branchForm.phone}
                    onChange={e => setBranchForm({ ...branchForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs dir-ltr"
                  />
                </div>
              </div>

              {/* Official Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isRtl ? 'البريد الإلكتروني الرسمي للفرع' : 'Official Branch Email'}
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:right-3 rtl:left-auto pointer-events-none" />
                  <input
                    type="email"
                    placeholder="contact@charity.dz"
                    value={branchForm.email}
                    onChange={e => setBranchForm({ ...branchForm, email: e.target.value })}
                    className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 rounded-xl border border-slate-300 text-xs dir-ltr"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{isRtl ? 'العنوان / المقر' : 'Address'}</label>
                <input
                  type="text"
                  placeholder={isRtl ? 'مثال: وسط مدينة البليدة' : 'e.g. City center'}
                  value={branchForm.address}
                  onChange={e => setBranchForm({ ...branchForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              {/* LOGIN CREDENTIALS SECTION */}
              <div className="p-3.5 bg-purple-50/70 rounded-2xl border border-purple-200 space-y-2.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-purple-900">
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'بيانات الاعتماد وحساب الدخول المؤسساتي:' : 'Branch Login Credentials:'}</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-950 mb-0.5">
                    {isRtl ? 'اسم المستخدم للدخول *' : 'Login Username *'}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={isRtl ? 'مثال: blida' : 'e.g. blida'}
                    value={branchForm.username}
                    onChange={e => setBranchForm({ ...branchForm, username: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-purple-300 text-xs bg-white dir-ltr font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-purple-950 mb-0.5">
                    {isRtl ? 'كلمة المرور للدخول *' : 'Login Password *'}
                  </label>
                  <input
                    required
                    type="text"
                    placeholder={isRtl ? 'مثال: blida123456' : 'e.g. blida123456'}
                    value={branchForm.password}
                    onChange={e => setBranchForm({ ...branchForm, password: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-purple-300 text-xs bg-white dir-ltr font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowBranchModal(false)} className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl">
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl">
                  {saving ? (isRtl ? 'جاري الإنشاء...' : 'Creating...') : (isRtl ? 'إنشاء الفرع وحساب الدخول' : 'Create Branch')}
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
