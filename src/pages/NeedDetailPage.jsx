import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  MapPin, 
  Package, 
  Truck, 
  Phone, 
  Users, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle, 
  Trash2, 
  Building2,
  Navigation
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import StatusPipeline from '../components/StatusPipeline';
import DispatchModal from '../components/DispatchModal';

export default function NeedDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { needs, dispatches, deleteNeed, updateNeed, confirmDispatchDelivery } = useData();
  const { userProfile, isSuperAdmin } = useAuth();
  const { isRtl } = useLanguage();

  const [showDispatchModal, setShowDispatchModal] = useState(false);

  const need = needs.find(n => n.id === id);

  if (!need) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="p-4 rounded-full bg-slate-100 text-slate-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          {isRtl ? 'طلب المساعدة غير موجود أو تم حذفه' : 'Aid request not found'}
        </h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-xs hover:bg-emerald-900 transition"
        >
          {isRtl ? 'العودة للوحة القيادة' : 'Back to Dashboard'}
        </button>
      </div>
    );
  }

  const isOwnBranch = need.branchId === userProfile?.branchId;
  const canManage = isOwnBranch || isSuperAdmin;
  const needDispatches = dispatches.filter(d => d.needId === need.id);

  const displayQuantity = need.quantity || (need.items && need.items[0]?.quantity ? `${need.items[0].quantity} ${need.items[0].unit || ''}` : '');
  const descriptionText = need.needDescription || need.title || (need.items && need.items[0]?.description) || '';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Top Back Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-800 transition"
        >
          {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isRtl ? 'العودة للوحة القيادة' : 'Back to Dashboard'}</span>
        </button>

        {canManage && (
          <div className="flex items-center gap-2">
            {need.status !== 'fulfilled' && (
              <button
                onClick={() => updateNeed(need.id, { status: 'fulfilled' })}
                className="px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>{isRtl ? 'تعليم كمكتمل' : 'Mark Fulfilled'}</span>
              </button>
            )}

            <button
              onClick={() => {
                if (confirm(isRtl ? 'هل أنت متأكد من حذف هذا الطلب؟' : 'Delete this need?')) {
                  deleteNeed(need.id);
                  navigate('/dashboard');
                }
              }}
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition"
              title={isRtl ? 'حذف الطلب' : 'Delete Need'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Details Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
            {need.category}
          </span>
          <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
            need.urgency === 'high' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
          }`}>
            {need.urgency === 'high' ? (isRtl ? 'حالة عاجلة' : 'Urgent') : (isRtl ? 'خلال أيام' : 'Within days')}
          </span>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
            {descriptionText}
          </h1>

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
            <Building2 className="w-4 h-4 text-emerald-800" />
            <span className="font-bold text-slate-800">{need.branchName || need.orgName}</span>
            <span>•</span>
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>{need.location?.city || need.location?.wilaya} {need.location?.address ? `— ${need.location.address}` : ''}</span>
          </div>
        </div>

        {displayQuantity && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">{isRtl ? 'الكمية المطلوبة:' : 'Quantity Needed:'}</span>
            <span className="text-sm font-black text-emerald-900">{displayQuantity}</span>
          </div>
        )}

        {/* Coordinator Direct Phone Call */}
        {need.contactPhone && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-900 block">{isRtl ? 'رقم هاتف المنسق المسؤول للتواصل المباشر:' : 'Coordinator Phone:'}</span>
              <span className="text-sm font-bold font-mono text-emerald-950 dir-ltr">{need.contactPhone}</span>
            </div>
            <a
              href={`tel:${need.contactPhone}`}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isRtl ? 'اتصال هاتفي مباشر' : 'Call Coordinator'}</span>
            </a>
          </div>
        )}

        {/* Map link */}
        {need.location?.lat && (
          <div className="pt-2">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${need.location.lat},${need.location.lng}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-emerald-800 hover:underline text-xs font-bold"
            >
              <Navigation className="w-4 h-4" />
              <span>{isRtl ? 'عرض الموقع في خرائط Google' : 'Open in Google Maps'}</span>
            </a>
          </div>
        )}
      </div>

    </div>
  );
}

export { NeedDetailPage };
