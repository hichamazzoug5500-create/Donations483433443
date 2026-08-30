import React, { useState, useEffect } from 'react';
import { 
  X, 
  PlusCircle, 
  Save, 
  AlertCircle, 
  Phone, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  MapPin, 
  CheckCircle2,
  Package
} from 'lucide-react';
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

  const [currentStep, setCurrentStep] = useState(1); // 1 or 2

  const [formData, setFormData] = useState({
    needDescription: '',
    category: 'food',
    quantity: '',
    city: userProfile?.city || 'Alger',
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
        city: initialData.location?.city || userProfile?.city || 'Alger',
        address: initialData.location?.address || '',
        lat: initialData.location?.lat || 36.7538,
        lng: initialData.location?.lng || 3.0588,
        phone: initialData.phone || userProfile?.phone || '',
        urgency: initialData.urgency || 'medium'
      });
      setCurrentStep(1);
    } else if (userProfile) {
      setFormData(prev => ({
        ...prev,
        city: userProfile.city || 'Alger',
        phone: userProfile.phone || ''
      }));
      setCurrentStep(1);
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

  const handleNextStep = () => {
    setError('');
    if (!formData.needDescription.trim()) {
      setError(t('needDescLabel'));
      return;
    }
    setCurrentStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.needDescription.trim()) {
      setCurrentStep(1);
      setError(t('needDescLabel'));
      return;
    }

    if (!formData.city.trim()) {
      setError(t('wilayaLabel'));
      return;
    }

    if (!formData.phone.trim() || !isValidAlgerianPhone(formData.phone)) {
      setError(isRTL ? 'يرجى إدخال رقم هاتف جزائري صحيح (مثال: 0550123456 أو 0661987654)' : 'Please enter a valid Algerian phone number (e.g. 0550123456)');
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
        showSuccess(isRTL ? 'تم تحديث بيانات طلب المساعدة بنجاح!' : 'Aid request updated successfully!');
      } else {
        await createRequest(payload);
        showSuccess(isRTL ? 'تم نشر طلب المساعدة بنجاح وسيظهر للمتبرعين!' : 'Aid request published successfully!');
      }

      onClose();
    } catch (err) {
      console.error("Error saving request:", err);
      setError(err.message || 'Error saving request');
      showError('Error saving request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const NextArrow = isRTL ? ArrowLeft : ArrowRight;
  const PrevArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[94vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200">
        
        {/* Mobile Drag Bar */}
        <div className="sm:hidden w-full pt-3 pb-1 flex justify-center bg-slate-900">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full"></div>
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold">
              {isEditing ? t('postModalTitleEdit') : t('postModalTitleNew')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 🌟 Step Wizard Tabs / Indicator 🌟 */}
        <div className="bg-slate-100 p-1.5 border-b border-slate-200 grid grid-cols-2 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[38px] ${
              currentStep === 1
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{t('stepNeedDetails')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (formData.needDescription.trim()) {
                setCurrentStep(2);
              } else {
                setError(t('needDescLabel'));
              }
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 min-h-[38px] ${
              currentStep === 2
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{t('stepLocationContact')}</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-grow pb-24 sm:pb-6">
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 1: NEED DETAILS                                      */}
            {/* ========================================================= */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                
                {/* Need Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('needDescLabel')}
                  </label>
                  <textarea
                    name="needDescription"
                    rows={4}
                    required
                    value={formData.needDescription}
                    onChange={handleChange}
                    placeholder={t('needDescPlaceholder')}
                    className="w-full px-3.5 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Category & Urgency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('aidCategoryLabel')}
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm outline-none bg-white font-medium min-h-[44px]"
                    >
                      <option value="food">{t('catFood')}</option>
                      <option value="clothing">{t('catClothing')}</option>
                      <option value="medical">{t('catMedical')}</option>
                      <option value="shelter">{t('catShelter')}</option>
                      <option value="other">{t('catOther')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {t('urgencyLevelLabel')}
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm outline-none bg-white font-bold text-slate-800 min-h-[44px]"
                    >
                      <option value="high">{t('urgencyHigh')}</option>
                      <option value="medium">{t('urgencyMedium')}</option>
                      <option value="low">{t('urgencyLow')}</option>
                    </select>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('quantityOptionalLabel')}
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder={t('quantityOptionalPlaceholder')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm min-h-[44px]"
                  />
                </div>

              </div>
            )}

            {/* ========================================================= */}
            {/* STEP 2: LOCATION & CONTACT                                */}
            {/* ========================================================= */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                
                {/* Wilaya Selection & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t('wilayaLabel')}
                    </label>
                    <select
                      value={formData.city}
                      onChange={handleWilayaSelect}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-700 text-xs sm:text-sm bg-white font-medium min-h-[44px]"
                    >
                      {ALGERIA_WILAYAS.map((w) => (
                        <option key={w.code} value={isRTL ? w.nameAr : w.nameEn}>
                          {w.code} - {isRTL ? w.nameAr : w.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">{t('contactPhoneLabel')}</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 rtl:right-3 rtl:left-auto" />
                      <input
                        type="tel"
                        name="phone"
                        required
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">{t('addressNeighborhoodLabel')}</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder={t('addressPlaceholder')}
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
                  {t('cancelBtn')}
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md min-h-[44px] transition-all"
                >
                  <span>{t('nextStep')}</span>
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
                  <span>{t('prevStep')}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md min-h-[44px] flex-grow sm:flex-grow-0 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSubmitting ? t('savingBtn') : isEditing ? t('saveUpdateBtn') : t('saveAndPublishBtn')}</span>
                </button>
              </>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
