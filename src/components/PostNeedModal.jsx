import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Send, 
  Building2,
  MapPin,
  Sparkles,
  Utensils,
  Shirt,
  Stethoscope,
  Home,
  Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';
import LocationPicker from './LocationPicker';

export default function PostNeedModal({ isOpen, onClose, initialData = null }) {
  const { userProfile } = useAuth();
  const { createNeed, updateNeed } = useData();
  const { isRtl } = useLanguage();

  const isEditing = Boolean(initialData?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    needDescription: initialData?.needDescription || initialData?.title || '',
    category: initialData?.category || 'food',
    urgency: initialData?.urgency || 'high',
    quantity: initialData?.quantity || '',
    city: initialData?.location?.city || initialData?.location?.wilaya || userProfile?.city || 'البليدة',
    phone: initialData?.phone || initialData?.contactPhone || userProfile?.phone || '',
    address: initialData?.location?.address || '',
    lat: initialData?.location?.lat || 36.4700,
    lng: initialData?.location?.lng || 2.8300
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWilayaSelect = (e) => {
    const selectedWilayaName = e.target.value;
    const wilayaObj = ALGERIA_WILAYAS.find(w => w.nameAr === selectedWilayaName || w.nameEn === selectedWilayaName);

    setFormData(prev => ({
      ...prev,
      city: selectedWilayaName,
      lat: wilayaObj ? wilayaObj.lat : prev.lat,
      lng: wilayaObj ? wilayaObj.lng : prev.lng
    }));
  };

  const handleLocationPickerChange = (loc) => {
    setFormData(prev => ({
      ...prev,
      lat: loc.lat,
      lng: loc.lng,
      city: loc.city || prev.city,
      address: loc.address || prev.address
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.needDescription.trim()) {
      alert(isRtl ? 'يرجى كتابة ما يحتاجه الفرع' : 'Please describe the needed supplies');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.needDescription.slice(0, 80),
        needDescription: formData.needDescription,
        category: formData.category,
        urgency: formData.urgency,
        quantity: formData.quantity,
        phone: formData.phone,
        contactPhone: formData.phone,
        contactName: userProfile?.displayName || userProfile?.branchName || 'منسق الفرع',
        location: {
          city: formData.city,
          wilaya: formData.city,
          address: formData.address,
          lat: Number(formData.lat),
          lng: Number(formData.lng)
        },
        items: [
          {
            itemId: 'item_' + Date.now(),
            category: formData.category,
            description: formData.needDescription,
            quantity: formData.quantity || '1',
            unit: ''
          }
        ]
      };

      if (isEditing) {
        await updateNeed(initialData.id, payload);
      } else {
        await createNeed(payload);
      }

      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                {isEditing ? (isRtl ? 'تعديل طلب المساعدة' : 'Edit Request') : (isRtl ? 'نشر طلب مساعدة جديد' : 'Post Aid Need')}
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                {userProfile?.branchName || userProfile?.orgName}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Single Scrollable Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            
            {/* 1. Need Description */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {isRtl ? 'ما هي المساعدات أو المواد المطلوبة؟ *' : 'What supplies are needed? *'}
              </label>
              <textarea
                required
                rows={3}
                name="needDescription"
                value={formData.needDescription}
                onChange={handleChange}
                placeholder={isRtl ? 'مثال: نحتاج 50 قفة غذائية عاجلة و 30 بطانية شتوية وحليب أطفال...' : 'e.g. 50 urgent food packs, 30 blankets, and baby milk...'}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm outline-none resize-none leading-relaxed min-h-[80px]"
              />
            </div>

            {/* 2. Category & Urgency */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isRtl ? 'التصنيف *' : 'Category *'}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:ring-2 focus:ring-emerald-700 outline-none"
                >
                  <option value="food">{isRtl ? '🍱 مواد غذائية' : 'Food'}</option>
                  <option value="clothing">{isRtl ? '🧥 ألبسة وأغطية' : 'Clothing'}</option>
                  <option value="medical">{isRtl ? '💊 أدوية ومستلزمات' : 'Medical'}</option>
                  <option value="shelter">{isRtl ? '⛺ خيم ومأوى' : 'Shelter'}</option>
                  <option value="other">{isRtl ? '📦 أخرى' : 'Other'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isRtl ? 'درجة الاستعجال *' : 'Urgency *'}
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold focus:ring-2 focus:ring-emerald-700 outline-none text-slate-800"
                >
                  <option value="high">{isRtl ? '🔴 حالة عاجلة' : 'Urgent'}</option>
                  <option value="medium">{isRtl ? '🟡 خلال أيام' : 'Within Days'}</option>
                  <option value="low">{isRtl ? '🟢 عادي / مستمر' : 'Normal'}</option>
                </select>
              </div>
            </div>

            {/* 3. Quantity & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isRtl ? 'الكمية التقديرية المطلوبة' : 'Required Quantity'}
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder={isRtl ? 'مثال: 50 قفة / 30 بطانية' : 'e.g. 50 packs'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isRtl ? 'رقم هاتف المنسق *' : 'Coordinator Phone *'}
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0550 12 34 56"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs dir-ltr focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>
            </div>

            {/* 4. Wilaya & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isRtl ? 'الولاية *' : 'Wilaya *'}
                </label>
                <select
                  value={formData.city}
                  onChange={handleWilayaSelect}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:ring-2 focus:ring-emerald-700 outline-none"
                >
                  {ALGERIA_WILAYAS.map((w) => (
                    <option key={w.code} value={isRtl ? w.nameAr : w.nameEn}>
                      {w.code} - {isRtl ? w.nameAr : w.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isRtl ? 'الحي / مكان التسليم' : 'Drop-off Location'}
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={isRtl ? 'مثال: وسط مدينة البليدة' : 'e.g. City Center'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                />
              </div>
            </div>

            {/* 5. Location GPS Map Picker */}
            <div>
              <LocationPicker
                lat={formData.lat}
                lng={formData.lng}
                city={formData.city}
                address={formData.address}
                onChange={handleLocationPickerChange}
              />
            </div>

          </div>

          {/* Bottom Action Button */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl"
            >
              {isRtl ? 'إلغاء' : 'Cancel'}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? (isRtl ? 'جاري النشر...' : 'Publishing...') : isEditing ? (isRtl ? 'حفظ التعديلات' : 'Save Changes') : (isRtl ? 'نشر طلب المساعدة' : 'Publish Need')}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export { PostNeedModal };
