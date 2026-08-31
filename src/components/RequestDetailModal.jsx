import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Building2,
  PieChart,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export default function RequestDetailModal({ 
  request, 
  isOpen, 
  onClose 
}) {
  const { userProfile } = useAuth();
  const { commitToNeed } = useData();
  const { isRtl } = useLanguage();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'map' | 'pledge'
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Commitment form state
  const [commitmentType, setCommitmentType] = useState('full'); // 'full' | 'partial'
  const [pledgedQuantity, setPledgedQuantity] = useState('');
  const [remainingQuantity, setRemainingQuantity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [donorNotes, setDonorNotes] = useState('');
  const [formError, setFormError] = useState('');

  if (!isOpen || !request) return null;

  const lat = request.location?.lat || 36.4700;
  const lng = request.location?.lng || 2.8300;
  const phone = request.phone || request.contactPhone || '';

  const handleCopyPhone = () => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (commitmentType === 'partial' && !remainingQuantity.trim()) {
      setFormError(isRtl ? 'يرجى تحديد الكمية المتبقية المطلوبة' : 'Please specify remaining quantity needed');
      return;
    }

    setIsSubmitting(true);
    try {
      await commitToNeed(request.id, {
        commitmentType,
        pledgedQuantity: pledgedQuantity || request.remainingQuantity || request.quantity || (isRtl ? 'كامل الطلب' : 'Full Request'),
        remainingQuantity: commitmentType === 'partial' ? remainingQuantity : null,
        deliveryDate,
        donorNotes,
        donorName: userProfile?.branchName || userProfile?.displayName || userProfile?.orgName,
        donorPhone: userProfile?.phone || ''
      });

      alert(isRtl ? 'تم تسجيل التزام فرعكم بالمساعدة بنجاح!' : 'Your branch commitment has been logged!');
      onClose();
    } catch (err) {
      setFormError(err.message || 'Error submitting commitment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayQuantity = request.quantity || (request.items && request.items[0]?.quantity ? `${request.items[0].quantity} ${request.items[0].unit || ''}` : '');
  const descriptionText = request.needDescription || request.title || (request.items && request.items[0]?.description) || '';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                {request.branchName || request.orgName}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{request.location?.city || request.location?.wilaya || 'الجزائر'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition ${
              activeTab === 'overview'
                ? 'border-emerald-800 text-emerald-800 bg-emerald-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {isRtl ? 'نظرة عامة والاتصال' : 'Overview & Call'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition ${
              activeTab === 'map'
                ? 'border-emerald-800 text-emerald-800 bg-emerald-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {isRtl ? 'الموقع والخريطة' : 'Location & Map'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pledge')}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold text-center border-b-2 transition ${
              activeTab === 'pledge'
                ? 'border-emerald-800 text-emerald-800 bg-emerald-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {isRtl ? 'التكفل بالمعونة' : 'Commit Aid'}
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4">
          
          {/* TAB 1: OVERVIEW & DIRECT PHONE CALL */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              
              {/* Direct Call Box */}
              {phone && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-1 text-center sm:text-right rtl:sm:text-right ltr:sm:text-left">
                    <span className="text-xs font-bold text-emerald-900 block">
                      {isRtl ? 'الاتصال المباشر بمنسق الفرع:' : 'Direct Branch Coordinator Phone:'}
                    </span>
                    <span className="text-sm font-bold font-mono text-emerald-950 dir-ltr inline-block">
                      {phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <a
                      href={`tel:${phone}`}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition min-h-[38px]"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{isRtl ? 'اتصال هاتفي' : 'Call Now'}</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="p-2 bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl transition min-h-[38px] min-w-[38px] flex items-center justify-center"
                      title={isRtl ? 'نسخ الرقم' : 'Copy Phone'}
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Need Description */}
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  {isRtl ? 'تفاصيل الاحتياج المطلوب:' : 'Need Description:'}
                </span>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  {descriptionText}
                </p>
              </div>

              {/* Quantity */}
              {displayQuantity && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    {isRtl ? 'الكمية المطلوبة:' : 'Quantity Needed:'}
                  </span>
                  <span className="text-sm font-black text-emerald-900">
                    {displayQuantity}
                  </span>
                </div>
              )}

              {request.remainingQuantity && (
                <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-300 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">
                    {isRtl ? 'المتبقي المطلوب:' : 'Remaining Needed:'}
                  </span>
                  <span className="text-sm font-black text-amber-950">
                    {request.remainingQuantity}
                  </span>
                </div>
              )}

              {/* Drop-off Address */}
              <div className="space-y-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <span className="text-xs font-semibold text-slate-500 block">
                  {isRtl ? 'موقع الاستلام والتفريغ:' : 'Drop-off Site / Address:'}
                </span>
                <p className="text-xs font-bold text-slate-800">
                  📍 {request.location?.city || 'الجزائر'} {request.location?.address ? `— ${request.location.address}` : ''}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('pledge')}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 px-4 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>{isRtl ? 'التكفل بهذه المعونة وإرسال المساعدات' : 'Commit Aid & Dispatch Help'}</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: LOCATION & MAP */}
          {activeTab === 'map' && (
            <div className="space-y-3">
              <div className="h-64 w-full rounded-2xl overflow-hidden border border-slate-300 relative shadow-inner">
                <MapContainer
                  center={[lat, lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[lat, lng]} />
                </MapContainer>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  📍 {request.location?.city} {request.location?.address ? `— ${request.location.address}` : ''}
                </span>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-900 font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'فتح في خرائط Google' : 'Open in Google Maps'}</span>
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: COMMIT AID (التكفل) */}
          {activeTab === 'pledge' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>{isRtl ? 'التكفل بهذه المساعدة من قِبل فرعكم' : 'Commit Aid from Your Branch'}</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isRtl 
                      ? 'حدد ما إذا كان فرعكم سيتكفل بالطلب كاملاً أو بجزء منه مع توضيح ما تبقى للفروع الأخرى.' 
                      : 'Choose full or partial commitment for this request.'}
                  </p>
                </div>

                <form onSubmit={handlePledgeSubmit} className="space-y-3.5 pt-2">
                  {formError && (
                    <div className="bg-rose-900/60 border border-rose-700 text-rose-200 p-3 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Full vs Partial Toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        setCommitmentType('full');
                        setPledgedQuantity(request.remainingQuantity || displayQuantity || 'كامل الطلب');
                      }}
                      className={`p-3.5 rounded-xl border text-right transition ${
                        commitmentType === 'full'
                          ? 'border-emerald-400 bg-emerald-950/80 ring-2 ring-emerald-400 text-white font-bold'
                          : 'border-slate-700 bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{isRtl ? 'تكفل كامل (تغطية الطلب كلياً)' : 'Full Commitment'}</span>
                        {commitmentType === 'full' && <Check className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 font-normal">
                        {isRtl ? 'سيتم حجز الطلب لفرعكم وإغلاقه عن باقي الفروع' : 'Fulfill entire need'}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCommitmentType('partial')}
                      className={`p-3.5 rounded-xl border text-right transition ${
                        commitmentType === 'partial'
                          ? 'border-amber-400 bg-amber-950/80 ring-2 ring-amber-400 text-white font-bold'
                          : 'border-slate-700 bg-slate-800/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{isRtl ? 'تكفل جزئي (تغطية جزء)' : 'Partial Commitment'}</span>
                        {commitmentType === 'partial' && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 font-normal">
                        {isRtl ? 'سيبقى الطلب متاحاً للفروع الأخرى لتغطية المتبقي' : 'Leave remainder open'}
                      </p>
                    </button>
                  </div>

                  {/* Quantity Pledged */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      {isRtl ? 'الكمية التي سيوفرها فرعكم:' : 'Quantity Your Branch Will Provide:'}
                    </label>
                    <input
                      type="text"
                      value={pledgedQuantity}
                      onChange={(e) => setPledgedQuantity(e.target.value)}
                      placeholder={isRtl ? 'مثال: سنوفر 50 قفة غذائية / 20 بطانية' : 'e.g. 50 food packs'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-xs sm:text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none min-h-[42px]"
                    />
                  </div>

                  {/* Remaining Quantity (If Partial) */}
                  {commitmentType === 'partial' && (
                    <div className="bg-amber-950/40 border border-amber-500/40 p-3.5 rounded-xl space-y-1.5">
                      <label className="block text-xs font-bold text-amber-300">
                        {isRtl ? 'الكمية المتبقية المطلوبة من الفروع الأخرى *' : 'Remaining Quantity Needed *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={remainingQuantity}
                        onChange={(e) => setRemainingQuantity(e.target.value)}
                        placeholder={isRtl ? 'مثال: متبقي 20 قفة غذائية / 10 بطانيات' : 'e.g. 20 food packs remaining'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-amber-500/60 text-xs sm:text-sm text-white focus:ring-2 focus:ring-amber-500 outline-none min-h-[42px]"
                      />
                    </div>
                  )}

                  {/* Delivery ETA */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      {isRtl ? 'موعد الوصول والتسليم المقترح:' : 'Estimated Arrival / Handover:'}
                    </label>
                    <input
                      type="text"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      placeholder={isRtl ? 'مثال: غداً صباحاً / السبت بعد الزوال' : 'e.g. Tomorrow morning'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-xs sm:text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none min-h-[42px]"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      {isRtl ? 'ملاحظات وتفاصيل النقل:' : 'Convoy Notes:'}
                    </label>
                    <textarea
                      rows={2}
                      value={donorNotes}
                      onChange={(e) => setDonorNotes(e.target.value)}
                      placeholder={isRtl ? 'مثال: سنقوم بنقل المساعدات بشاحنة الفرع مباشرة إلى مقركم' : 'e.g. Dispatching by branch truck'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-xs sm:text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-3 px-4 rounded-xl shadow-md text-xs sm:text-sm min-h-[44px] flex items-center justify-center gap-2 transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isSubmitting ? (isRtl ? 'جاري الحفظ...' : 'Saving...') : (isRtl ? 'تأكيد التكفل وإرسال المساعدة' : 'Confirm Commitment')}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs sm:text-sm min-h-[42px]"
          >
            {isRtl ? 'إغلاق النافذة' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
}

export { RequestDetailModal };
