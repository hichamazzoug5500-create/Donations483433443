import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Phone, 
  Save, 
  Building2,
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
  const { t, isRtl } = useLanguage();

  const isEditing = Boolean(initialData?.id);
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleNextStep = () => {
    if (!formData.needDescription.trim()) {
      alert(isRtl ? 'يرجى كتابة تفاصيل المساعدة المطلوبة' : 'Please describe the required aid');
      return;
    }
    setCurrentStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.needDescription.trim()) return;

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

  const NextArrow = isRtl ? ArrowLeft : ArrowRight;
  const PrevArrow = isRtl ? ArrowRight : ArrowLeft;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                {isEditing ? (isRtl ? 'تعديل طلب المساعدة' : 'Edit Request') : (isRtl ? 'نشر طلب مساعدة للفرع' : 'Post Branch Need')}
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

        {/* Wizard Step Indicator Tabs */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold text-center border-b-2 transition ${
              currentStep === 1 
                ? 'border-emerald-800 text-emerald-800 bg-emerald-50/20' 
                : 'border-transparent text-slate-400'
            }`}
          >
            1. {isRtl ? 'تفاصيل الاحتياج' : 'Need Details'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (formData.needDescription.trim()) setCurrentStep(2);
            }}
            className={`flex-1 py-2.5 text-xs sm:text-sm font-bold text-center border-b-2 transition ${
              currentStep === 2 
                ? 'border-emerald-800 text-emerald-800 bg-emerald-50/20' 
                : 'border-transparent text-slate-400'
            }`}
          >
            2. {isRtl ? 'الموقع ورقم الاتصال' : 'Location & Contact'}
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            
            {/* STEP 1: NEED DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                
                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRtl ? 'تفاصيل الاحتياج المطلوب بدقة *' : 'Detailed Description of Needed Supplies *'}
                  </label>
                  <textarea
                    required
                    name="needDescription"
                    rows={3}
                    value={formData.needDescription}
                    onChange={handleChange}
                    placeholder={isRtl ? 'اكتب هنا ما يحتاجه الفرع في منطقة الكارثة... مثال: نحتاج 50 قفة غذائية و 30 بطانية شتوية ومياه معقمة.' : 'Describe needed supplies... e.g. 50 food packs, 30 blankets, and clean water.'}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm outline-none resize-none leading-relaxed min-h-[90px]"
                  />
                </div>

                {/* Category & Urgency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isRtl ? 'نوع المساعدة *' : 'Aid Category *'}
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm outline-none bg-white font-medium min-h-[44px]"
                    >
                      <option value="food">{isRtl ? '🍱 مواد غذائية ومؤونة' : 'Food & Nutrition'}</option>
                      <option value="clothing">{isRtl ? '🧥 ألبسة وأغطية' : 'Clothing & Blankets'}</option>
                      <option value="medical">{isRtl ? '💊 أدوية ومستلزمات طبية' : 'Medicine & Medical'}</option>
                      <option value="shelter">{isRtl ? '⛺ مأوى وسكن مؤقت' : 'Temporary Shelter'}</option>
                      <option value="other">{isRtl ? '📦 عام / احتياجات أخرى' : 'General / Other'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {isRtl ? 'درجة الاستعجال *' : 'Urgency Level *'}
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm outline-none bg-white font-bold text-slate-800 min-h-[44px]"
                    >
                      <option value="high">{isRtl ? '🔴 حالة عاجلة جداً' : 'Urgent (Emergency)'}</option>
                      <option value="medium">{isRtl ? '🟡 خلال أيام' : 'Within Days'}</option>
                      <option value="low">{isRtl ? '🟢 مستمر / عادي' : 'Ongoing'}</option>
                    </select>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isRtl ? 'الكمية المطلوبة (اختياري)' : 'Quantity (Optional)'}
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder={isRtl ? 'مثال: 50 قفة غذائية / 30 بطانية / 10 علب حليب' : 'e.g. 50 food packs / 30 blankets'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm min-h-[44px]"
                  />
                </div>

              </div>
            )}

            {/* STEP 2: LOCATION & CONTACT */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                
                {/* Wilaya Selection & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isRtl ? 'الولاية *' : 'Wilaya *'}
                    </label>
                    <select
                      value={formData.city}
                      onChange={handleWilayaSelect}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm bg-white font-medium min-h-[44px]"
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
                      {isRtl ? 'رقم الهاتف للتواصل *' : 'Contact Phone Number *'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 rtl:right-3 rtl:left-auto" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0550 12 34 56"
                        className="w-full pl-9 pr-3.5 rtl:pr-9 rtl:pl-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm dir-ltr min-h-[44px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isRtl ? 'العنوان أو الحي / نقطة الاستلام' : 'Address / Drop-off Location'}
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={isRtl ? 'مثال: شارع فلسطين، وسط مدينة البليدة' : 'e.g. Downtown Blida'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm min-h-[44px]"
                  />
                </div>

                {/* Location & GPS Picker */}
                <div className="pt-1">
                  <LocationPicker
                    lat={formData.lat}
                    lng={formData.lng}
                    city={formData.city}
                    address={formData.address}
                    onChange={handleLocationPickerChange}
                  />
                </div>

              </div>
            )}

          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2.5 shrink-0">
            {currentStep === 1 ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl min-h-[44px]"
                >
                  {isRtl ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md min-h-[44px] transition-all"
                >
                  <span>{isRtl ? 'المتابعة للخطوة التالية' : 'Next Step'}</span>
                  <NextArrow className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl min-h-[44px]"
                >
                  <PrevArrow className="w-4 h-4" />
                  <span>{isRtl ? 'الخطوة السابقة' : 'Previous Step'}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md min-h-[44px] flex-grow sm:flex-grow-0 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : isEditing ? (isRtl ? 'تحديث الطلب' : 'Update') : (isRtl ? 'نشر الطلب الآن' : 'Publish Request')}</span>
                </button>
              </>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
