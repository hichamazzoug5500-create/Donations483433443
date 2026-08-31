import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  MapPin, 
  Package, 
  Users, 
  Activity, 
  Check, 
  Flame, 
  Waves, 
  ShieldAlert, 
  Globe2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';
import LocationPicker from './LocationPicker';

export default function PostNeedModal({ isOpen, onClose, initialData = null }) {
  const { userProfile } = useAuth();
  const { createNeed, updateNeed, organizations } = useData();
  const { isRtl, t } = useLanguage();

  const currentOrg = organizations.find(o => o.id === userProfile?.orgId);
  const allowCrossOrgSetting = currentOrg?.allowCrossOrg ?? true;

  const [step, setStep] = useState(1); // 1: Need Details & Items, 2: Location & Impact
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState(initialData?.title || '');
  const [disasterType, setDisasterType] = useState(initialData?.disasterType || 'flood');
  const [priority, setPriority] = useState(initialData?.priority || 'P2_urgent');
  const [isCrossOrg, setIsCrossOrg] = useState(initialData?.isCrossOrg ?? allowCrossOrgSetting);
  const [notes, setNotes] = useState(initialData?.notes || '');

  // Multi-item list
  const [items, setItems] = useState(initialData?.items || [
    {
      itemId: 'item_init_1',
      category: 'food',
      description: '',
      quantity: 50,
      unit: 'pack',
      priority: 'P1_critical'
    }
  ]);

  // Location & Population State
  const [wilaya, setWilaya] = useState(initialData?.location?.wilaya || userProfile?.city || 'البليدة');
  const [address, setAddress] = useState(initialData?.location?.address || '');
  const [lat, setLat] = useState(initialData?.location?.lat || 36.4700);
  const [lng, setLng] = useState(initialData?.location?.lng || 2.8300);
  const [accessStatus, setAccessStatus] = useState(initialData?.location?.accessStatus || 'open');

  const [households, setHouseholds] = useState(initialData?.affectedPopulation?.households || '');
  const [individuals, setIndividuals] = useState(initialData?.affectedPopulation?.individuals || '');
  const [contactName, setContactName] = useState(initialData?.contactName || userProfile?.displayName || '');
  const [contactPhone, setContactPhone] = useState(initialData?.contactPhone || userProfile?.phone || '');

  if (!isOpen) return null;

  const addItem = () => {
    setItems([
      ...items,
      {
        itemId: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        category: 'food',
        description: '',
        quantity: 20,
        unit: 'pack',
        priority
      }
    ]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItemField = (index, field, value) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.some(it => !it.description.trim())) {
      alert(isRtl ? 'يرجى كتابة وصف لجميع الأصناف المطلوبة' : 'Please provide descriptions for all requested items');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim() || `${isRtl ? 'نداء إغاثة' : 'Relief Call'} - ${wilaya}`,
        disasterType,
        priority,
        isCrossOrg,
        notes,
        items,
        location: {
          wilaya,
          address,
          lat: Number(lat),
          lng: Number(lng),
          accessStatus
        },
        affectedPopulation: {
          households: Number(households) || 0,
          individuals: Number(individuals) || 0
        },
        contactName,
        contactPhone
      };

      if (initialData?.id) {
        await updateNeed(initialData.id, payload);
      } else {
        await createNeed(payload);
      }

      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-600 text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {initialData ? (isRtl ? 'تعديل نداء الإغاثة' : 'Edit Relief Need') : (isRtl ? 'إطلاق نداء إغاثة واحتياجات ميدانية' : 'Post Disaster Relief Need')}
              </h2>
              <p className="text-xs text-slate-500">
                {userProfile?.branchName} • {userProfile?.orgName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition ${
              step === 1 
                ? 'border-emerald-600 text-emerald-600 bg-emerald-50/20' 
                : 'border-transparent text-slate-400'
            }`}
          >
            1. {isRtl ? 'الأصناف والمستلزمات المطلوبة' : 'Requested Aid Items'}
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition ${
              step === 2 
                ? 'border-emerald-600 text-emerald-600 bg-emerald-50/20' 
                : 'border-transparent text-slate-400'
            }`}
          >
            2. {isRtl ? 'الموقع وعدد المتضررين' : 'Location & Population'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* ==================================================== */}
          {/* STEP 1: ITEMS & EMERGENCY DETAILS */}
          {/* ==================================================== */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Title & Disaster Type */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'عنوان النداء أو الكارثة' : 'Emergency Need Title'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: إغاثة عاجلة لمتضرري فيضانات وادي الشفة"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'نوع الكارثة / الطارئ' : 'Disaster Type'}
                  </label>
                  <select
                    value={disasterType}
                    onChange={e => setDisasterType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium"
                  >
                    <option value="flood">{isRtl ? '🌊 فيضانات وسيول' : 'Flood'}</option>
                    <option value="earthquake">{isRtl ? '🏚️ زلزال / هزة أرضية' : 'Earthquake'}</option>
                    <option value="fire">{isRtl ? '🔥 حرائق غابات' : 'Wildfire'}</option>
                    <option value="drought">{isRtl ? '☀️ جفاف وموجة حر' : 'Drought'}</option>
                    <option value="cold_wave">{isRtl ? '❄️ موجة برد وثلوج' : 'Cold Wave'}</option>
                    <option value="medical_crisis">{isRtl ? '🏥 طارئ صحي / وبائي' : 'Health Crisis'}</option>
                    <option value="other">{isRtl ? '⚠️ أخرى' : 'Other'}</option>
                  </select>
                </div>
              </div>

              {/* Priority & Cross-Org Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {isRtl ? 'درجة الأولوية الإنسانية' : 'Priority Level'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'P1_critical', label: isRtl ? 'P1 - حرج (0-24 س)' : 'P1 Critical', color: 'border-rose-500 text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
                      { id: 'P2_urgent', label: isRtl ? 'P2 - عاجل (24-48 س)' : 'P2 Urgent', color: 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/40' },
                      { id: 'P3_high', label: isRtl ? 'P3 - مرتفع' : 'P3 High', color: 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
                      { id: 'P4_medium', label: isRtl ? 'P4 - متوسط' : 'P4 Medium', color: 'border-slate-400 text-slate-600 bg-slate-50' }
                    ].map(p => (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setPriority(p.id)}
                        className={`py-2 px-2.5 rounded-xl border-2 text-xs font-bold text-center transition ${
                          priority === p.id ? p.color : 'border-slate-200 dark:border-slate-700 text-slate-500 bg-white dark:bg-slate-900'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Globe2 className="w-4 h-4 text-emerald-600" />
                    <span>{isRtl ? 'نطاق الرؤية والتنسيق' : 'Visibility Scope'}</span>
                  </label>
                  <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCrossOrg}
                      onChange={e => setIsCrossOrg(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {isRtl ? 'نداء مفتوح للمنظمات الشريكة (Cross-Org)' : 'Allow Partner NGOs to view & send aid'}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        {isRtl ? 'تسمح لفروع الجمعيات الأخرى بتقديم المساعدة لفرعكم' : 'Other certified NGO branches can coordinate'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Items Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-emerald-600" />
                    <span>{isRtl ? 'قائمة المستلزمات والأصناف المطلوبة' : 'Required Aid Items'} ({items.length})</span>
                  </label>

                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'إضافة صنف آخر' : 'Add Another Item'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div 
                      key={item.itemId || index} 
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-3">
                        <select
                          value={item.category}
                          onChange={e => updateItemField(index, 'category', e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium"
                        >
                          <option value="food">{isRtl ? '🍱 طرود غذائية' : 'Food Packs'}</option>
                          <option value="water">{isRtl ? '💧 مياه شرب معقمة' : 'Clean Water'}</option>
                          <option value="medical">{isRtl ? '💊 أدوية وإسعافات' : 'Medical'}</option>
                          <option value="shelter">{isRtl ? '⛺ خيام وإيواء' : 'Shelter'}</option>
                          <option value="clothing">{isRtl ? '🧥 أغطية وألبسة' : 'Clothing/Blankets'}</option>
                          <option value="hygiene">{isRtl ? '🧼 نظافة شخصية' : 'Hygiene'}</option>
                          <option value="volunteers">{isRtl ? '👥 فرق متطوعين' : 'Volunteers'}</option>
                          <option value="equipment">{isRtl ? '🚜 معدات ومضخات' : 'Equipment'}</option>
                          <option value="other">{isRtl ? '📦 مستلزمات أخرى' : 'Other'}</option>
                        </select>
                      </div>

                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          required
                          placeholder={isRtl ? 'وصف الصنف (مثلاً: طرود سميد وزيت وحليب)' : 'Item description'}
                          value={item.description}
                          onChange={e => updateItemField(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <input
                          type="number"
                          min="1"
                          required
                          placeholder={isRtl ? 'الكمية' : 'Qty'}
                          value={item.quantity}
                          onChange={e => updateItemField(index, 'quantity', e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold text-center"
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center gap-1.5">
                        <select
                          value={item.unit}
                          onChange={e => updateItemField(index, 'unit', e.target.value)}
                          className="w-full px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                        >
                          <option value="pack">{isRtl ? 'طرد / قفة' : 'Pack'}</option>
                          <option value="unit">{isRtl ? 'قطعة / وحدة' : 'Unit'}</option>
                          <option value="kg">{isRtl ? 'كغ' : 'Kg'}</option>
                          <option value="liter">{isRtl ? 'لتر' : 'Liter'}</option>
                          <option value="person">{isRtl ? 'فرد / مسعف' : 'Person'}</option>
                        </select>

                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-2 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-950/60 rounded-xl transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes / Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isRtl ? 'ملاحظات وتفاصيل إضافية للوضع الميداني' : 'Field Situation Notes'}
                </label>
                <textarea
                  rows={2}
                  placeholder={isRtl ? 'وصف دقيق للأضرار ومسارات الوصول الممكنة...' : 'Describe damages, access routes, urgent notes...'}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: LOCATION & IMPACT */}
          {/* ==================================================== */}
          {step === 2 && (
            <div className="space-y-5">
              {/* Affected Population */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>{isRtl ? 'تقديرات السكان المتضررين' : 'Estimated Affected Population'}</span>
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">{isRtl ? 'عدد العائلات' : 'Households'}</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="120"
                      value={households}
                      onChange={e => setHouseholds(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">{isRtl ? 'إجمالي الأفراد' : 'Individuals'}</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="650"
                      value={individuals}
                      onChange={e => setIndividuals(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Location Picker */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isRtl ? 'الولاية' : 'Wilaya'} *
                    </label>
                    <select
                      value={wilaya}
                      onChange={e => {
                        const selected = ALGERIA_WILAYAS.find(w => w.nameAr === e.target.value);
                        setWilaya(e.target.value);
                        if (selected) {
                          setLat(selected.lat);
                          setLng(selected.lng);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                    >
                      {ALGERIA_WILAYAS.map(w => (
                        <option key={w.code} value={w.nameAr}>{w.code} - {w.nameAr}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isRtl ? 'حالة المسالك والطرق' : 'Road Access Status'}
                    </label>
                    <select
                      value={accessStatus}
                      onChange={e => setAccessStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                    >
                      <option value="open">🟢 {isRtl ? 'مسالك سالكة ومفتوحة' : 'Open / Accessible'}</option>
                      <option value="obstructed">🟡 {isRtl ? 'مسالك صعبة / بها عوائق' : 'Obstructed'}</option>
                      <option value="cut_off">🔴 {isRtl ? 'منطقة معزولة ومقطوعة' : 'Cut Off / Isolated'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'العنوان الميداني أو نقطة التجمع' : 'Field Address / Staging Point'} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: بلدية الشفة، حي الشهداء، بالقرب من مدرسة النور"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                {/* Interactive Map Pin / GPS Detection */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <LocationPicker
                    value={{ lat, lng, address }}
                    onChange={loc => {
                      setLat(loc.lat);
                      setLng(loc.lng);
                      if (loc.address) setAddress(loc.address);
                    }}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'اسم مسؤول الطوارئ الميداني' : 'Field Coordinator Name'}
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isRtl ? 'رقم هاتف الاتصال والتنسيق' : 'Contact Phone'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 text-xs font-bold transition"
              >
                {isRtl ? '➔ رجوع للأصناف' : '➔ Back to Items'}
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
              >
                {isRtl ? 'إلغاء' : 'Cancel'}
              </button>

              {step === 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (items.some(it => !it.description.trim())) {
                      alert(isRtl ? 'يرجى كتابة وصف لجميع الأصناف المطلوبة' : 'Please provide item descriptions');
                      return;
                    }
                    setStep(2);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
                >
                  {isRtl ? 'التالي: تحديد الموقع ➔' : 'Next: Location ➔'}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg transition disabled:opacity-50 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>{submitting ? (isRtl ? 'جاري الإرسال...' : 'Submitting...') : (isRtl ? 'نشر نداء الإغاثة' : 'Broadcast Need')}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
