import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Save, AlertCircle, Phone } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { LocationPicker } from './LocationPicker';
import { ALGERIA_WILAYAS } from '../data/algeriaWilayas';
import { sanitizePhoneInput, isValidAlgerianPhone } from '../utils/phoneUtils';

export const PostRequestModal = ({ isOpen, onClose, initialData = null }) => {
  const { createRequest, updateRequest } = useData();
  const { userProfile } = useAuth();
  const { t, isRTL } = useLanguage();
  const { showSuccess, showError } = useToast();
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    needDescription: '',
    category: 'food',
    quantity: '',
    city: userProfile?.city || 'الجزائر العاصمة',
    address: '',
    lat: 36.7538,
    lng: 3.0588,
    phone: userProfile?.phone || '',
    urgency: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        needDescription: initialData.needDescription || '',
        category: initialData.category || 'food',
        quantity: initialData.quantity || '',
        city: initialData.location?.city || userProfile?.city || 'الجزائر العاصمة',
        address: initialData.location?.address || '',
        lat: initialData.location?.lat || 36.7538,
        lng: initialData.location?.lng || 3.0588,
        phone: initialData.phone || userProfile?.phone || '',
        urgency: initialData.urgency || 'medium'
      });
    } else if (userProfile) {
      setFormData(prev => ({
        ...prev,
        city: userProfile.city || 'الجزائر العاصمة',
        phone: userProfile.phone || ''
      }));
    }
  }, [initialData, userProfile, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const sanitized = sanitizePhoneInput(value);
      setFormData(prev => ({ ...prev, phone: sanitized }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
    setError('');

    if (!formData.needDescription.trim()) {
      setError('يرجى وصف الاحتياج المطلوب بدقة');
      return;
    }

    if (!formData.city.trim()) {
      setError('يرجى اختيار الولاية');
      return;
    }

    if (!formData.phone.trim() || !isValidAlgerianPhone(formData.phone)) {
      setError('يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0550123456 أو 0661987654)');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        needDescription: formData.needDescription.trim(),
        category: formData.category,
        quantity: formData.quantity.trim(),
        location: {
          city: formData.city.trim(),
          address: formData.address.trim(),
          lat: Number(formData.lat) || 36.7538,
          lng: Number(formData.lng) || 3.0588
        },
        phone: formData.phone.trim(),
        urgency: formData.urgency
      };

      if (isEditing) {
        await updateRequest(initialData.requestId, payload);
        showSuccess('تم تحديث بيانات طلب المساعدة بنجاح!');
      } else {
        await createRequest(payload);
        showSuccess('تم نشر طلب المساعدة بنجاح وسيظهر للمتبرعين!');
      }

      onClose();
    } catch (err) {
      console.error("Error saving request:", err);
      setError(err.message || 'حدث خطأ أثناء حفظ الطلب.');
      showError('تعذر حفظ الطلب.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      {/* Mobile Bottom Sheet Drawer / Desktop Modal */}
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[94vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200">
        
        {/* Mobile Drag Bar */}
        <div className="sm:hidden w-full pt-3 pb-1 flex justify-center bg-slate-900">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold">
              {isEditing ? 'تعديل طلب المساعدة' : 'نشر احتياج مساعدة جديد'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-grow pb-24 sm:pb-6">
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Need Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                تفاصيل الاحتياج المطلوب بدقة *
              </label>
              <textarea
                name="needDescription"
                rows={3}
                required
                value={formData.needDescription}
                onChange={handleChange}
                placeholder="اكتب هنا ما تحتاجه الجمعية... مثال: نحتاج 30 طرد غذائي يحتوي على زيت، سكر ودقيق."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-sm outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Category & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  نوع المساعدة *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm outline-none bg-white font-medium min-h-[42px]"
                >
                  <option value="food">مواد غذائية ومؤونة</option>
                  <option value="clothing">ألبسة وأغطية</option>
                  <option value="medical">مستلزمات طبية وأدوية</option>
                  <option value="shelter">مأوى وسكن مؤقت</option>
                  <option value="other">عام / أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  درجة الاستعجال *
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm outline-none bg-white font-bold text-slate-800 min-h-[42px]"
                >
                  <option value="high">عاجل جداً (حالة طارئة)</option>
                  <option value="medium">متوسط (خلال أيام)</option>
                  <option value="low">عادي (احتياج مستمر)</option>
                </select>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الكمية المطلوبة (اختياري)
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="مثال: 50 طرد / 20 بطانية / 10 علب دواء"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm min-h-[42px]"
              />
            </div>

            {/* Wilaya Selection & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  الولاية *
                </label>
                <select
                  value={formData.city}
                  onChange={handleWilayaSelect}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm bg-white font-medium min-h-[42px]"
                >
                  {ALGERIA_WILAYAS.map((w) => (
                    <option key={w.code} value={isRTL ? w.nameAr : w.nameEn}>
                      {w.code} - {isRTL ? w.nameAr : w.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">رقم الهاتف للتواصل *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:right-3 rtl:left-auto" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0550 12 34 56"
                    className="w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm dir-ltr min-h-[42px]"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">العنوان أو الحي</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="مثال: شارع ديدوش مراد، القبة، الجزائر"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm min-h-[42px]"
              />
            </div>

            {/* Location & GPS Picker */}
            <LocationPicker
              lat={formData.lat}
              lng={formData.lng}
              city={formData.city}
              address={formData.address}
              onChange={handleLocationPickerChange}
            />

          </div>

          {/* Sticky Bottom Thumb Action Bar on Mobile */}
          <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-end gap-2.5 shrink-0 shadow-lg sm:shadow-none">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl min-h-[44px]"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-xs min-h-[44px] flex-grow sm:flex-grow-0 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'جاري الحفظ...' : isEditing ? 'تحديث الطلب' : 'نشر الطلب الآن'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
