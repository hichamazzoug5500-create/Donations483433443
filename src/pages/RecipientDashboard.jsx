import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { RequestCard } from '../components/RequestCard';
import { PostRequestModal } from '../components/PostRequestModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { RequestCardSkeleton, DashboardStatsSkeleton } from '../components/SkeletonLoader';
import { 
  PlusCircle, 
  HelpingHand, 
  CheckCircle, 
  Clock, 
  Building2, 
  Users, 
  PhoneCall,
  Calendar,
  PackageCheck,
  Trash2,
  Copy,
  Phone
} from 'lucide-react';

export const RecipientDashboard = () => {
  const { userProfile } = useAuth();
  const { requests, loadingRequests, setRequestStatus, deleteRequest, getResponsesForRequest } = useData();
  const { t } = useLanguage();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState('all');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [donorResponsesMap, setDonorResponsesMap] = useState({});
  const [copiedPhoneId, setCopiedPhoneId] = useState(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    isDestructive: false,
    onConfirm: () => {}
  });

  const ownRequests = requests.filter(req => req.recipientId === userProfile?.uid);

  const filteredRequests = ownRequests.filter(req => {
    if (activeTab === 'open') return req.status === 'open';
    if (activeTab === 'in_progress') return req.status === 'in_progress';
    if (activeTab === 'fulfilled') return req.status === 'fulfilled';
    return true;
  });

  const openCount = ownRequests.filter(req => req.status === 'open').length;
  const inProgressCount = ownRequests.filter(req => req.status === 'in_progress').length;
  const fulfilledCount = ownRequests.filter(req => req.status === 'fulfilled').length;

  useEffect(() => {
    const fetchResponses = async () => {
      const respMap = {};
      for (const req of ownRequests) {
        const resps = await getResponsesForRequest(req.requestId);
        if (resps && resps.length > 0) {
          respMap[req.requestId] = resps;
        }
      }
      setDonorResponsesMap(respMap);
    };

    if (ownRequests.length > 0) {
      fetchResponses();
    }
  }, [requests, userProfile]);

  const handleCopyPhone = (phone, id) => {
    if (phone) {
      navigator.clipboard.writeText(phone);
      setCopiedPhoneId(id);
      setTimeout(() => setCopiedPhoneId(null), 2000);
      showSuccess('تم نسخ رقم الهاتف!');
    }
  };

  const handleEdit = (request) => {
    setEditingRequest(request);
    setIsPostModalOpen(true);
  };

  const handleToggleStatus = (request) => {
    const willFulfill = request.status !== 'fulfilled';
    setConfirmDialog({
      isOpen: true,
      title: willFulfill ? 'تعليم الطلب كمكتمل؟' : 'إعادة فتح الطلب؟',
      message: willFulfill 
        ? 'هل تم استلام المساعدات وتلبية هذا الاحتياج بالفعل من المتبرع؟'
        : 'سيتم إعادة عرض هذا الطلب في قائمة الاحتياجات المفتوحة للمتبرعين.',
      isDestructive: false,
      onConfirm: async () => {
        try {
          await setRequestStatus(request.requestId, willFulfill ? 'fulfilled' : 'open');
          showSuccess(willFulfill ? 'تم تعليم الطلب كمكتمل بنجاح!' : 'تمت إعادة فتح الطلب!');
        } catch (err) {
          console.error("Error toggling status:", err);
          showError('تعذر تحديث حالة الطلب.');
        } finally {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleDelete = (request) => {
    setConfirmDialog({
      isOpen: true,
      title: 'حذف طلب المساعدة',
      message: 'هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟ لن يمكن التراجع عن هذه الخطوة.',
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteRequest(request.requestId);
          showSuccess('تم حذف الطلب بنجاح.');
        } catch (err) {
          console.error("Error deleting request:", err);
          showError('تعذر حذف الطلب.');
        } finally {
          setConfirmDialog(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const handleCloseModal = () => {
    setIsPostModalOpen(false);
    setEditingRequest(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 pb-24 md:pb-12">
      
      {/* Dashboard Banner */}
      <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="bg-amber-400 text-slate-950 text-[11px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
            لوحة قيادة الجمعية
          </span>
          <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-300 shrink-0" />
            <span>{userProfile?.orgName || 'الجمعية'}</span>
          </h1>
          <p className="text-slate-300 text-xs">
            {userProfile?.city} • هاتف الجمعية: <span className="dir-ltr inline-block font-bold">{userProfile?.phone}</span>
          </p>
        </div>

        <button
          onClick={() => { setEditingRequest(null); setIsPostModalOpen(true); }}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 min-h-[46px]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إضافة طلب مساعدة جديد</span>
        </button>
      </div>

      {/* Stats Grid (2x2 on mobile, 4 columns on desktop) */}
      {loadingRequests ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-bold block">إجمالي الطلبات</span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">{ownRequests.length}</div>
            </div>
            <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-bold block">مفتوحة للمساعدة</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-800 mt-0.5">{openCount}</div>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
              <HelpingHand className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-bold block">قيد التكفل</span>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-0.5">{inProgressCount}</div>
            </div>
            <div className="p-2 bg-amber-50 text-amber-800 rounded-lg">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-bold block">مكتملة</span>
              <div className="text-xl sm:text-2xl font-extrabold text-emerald-800 mt-0.5">{fulfilledCount}</div>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Swipeable Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all min-h-[38px] ${
            activeTab === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          جميع الطلبات ({ownRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('open')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all min-h-[38px] ${
            activeTab === 'open' ? 'bg-emerald-800 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          مفتوحة ({openCount})
        </button>

        <button
          onClick={() => setActiveTab('in_progress')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all min-h-[38px] ${
            activeTab === 'in_progress' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          قيد التكفل ({inProgressCount})
        </button>

        <button
          onClick={() => setActiveTab('fulfilled')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all min-h-[38px] ${
            activeTab === 'fulfilled' ? 'bg-emerald-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          مكتملة ({fulfilledCount})
        </button>
      </div>

      {/* Requests Feed */}
      {loadingRequests ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map(i => <RequestCardSkeleton key={i} />)}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center space-y-3 border border-dashed border-slate-300">
          <h3 className="text-base font-bold text-slate-800">لا توجد طلبات في هذه القائمة حالياً</h3>
          <button
            onClick={() => { setEditingRequest(null); setIsPostModalOpen(true); }}
            className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 min-h-[42px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة أول طلب مساعدة</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredRequests.map((req) => {
            const responsesForThisReq = donorResponsesMap[req.requestId] || [];
            const latestCommitment = responsesForThisReq[0] || null;

            return (
              <div key={req.requestId} className="space-y-2.5">
                <div className="relative group">
                  <RequestCard
                    request={req}
                    isOwner={true}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                  />
                  <button
                    onClick={() => handleDelete(req)}
                    className="absolute top-3 left-3 rtl:left-auto rtl:right-3 p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="حذف الطلب"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 🌟 PROMINENT COMMITTED DONOR CONTACT BOX 🌟 */}
                {(req.assignedDonorName || req.status === 'in_progress') && (
                  <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-3.5 sm:p-4 text-xs space-y-3 shadow-xs">
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 font-extrabold text-emerald-950 text-xs sm:text-sm">
                        <PackageCheck className="w-4 h-4 text-emerald-700" />
                        <span>معلومات المتبرع المتكفل:</span>
                      </span>
                      <span className="bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        ملتزم بالتكفل
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-2">
                      
                      {/* Donor Name */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[11px]">اسم المتبرع / الجهة:</span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          {req.assignedDonorName || latestCommitment?.donorOrgName || 'متبرع مسجل'}
                        </span>
                      </div>

                      {/* Donor Phone */}
                      {(req.assignedDonorPhone || latestCommitment?.donorPhone) && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                          <span className="text-slate-500 text-[11px]">رقم هاتف المتبرع:</span>
                          <span className="font-extrabold text-slate-900 text-sm dir-ltr">
                            {req.assignedDonorPhone || latestCommitment?.donorPhone}
                          </span>
                        </div>
                      )}

                      {/* Pledged quantity / notes if available */}
                      {latestCommitment?.pledgedQuantity && (
                        <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                          <span>الكمية المتعهد بها:</span>
                          <span className="font-bold text-emerald-900">{latestCommitment.pledgedQuantity}</span>
                        </div>
                      )}

                      {latestCommitment?.deliveryDate && (
                        <div className="flex items-center justify-between text-[11px] text-slate-600">
                          <span>موعد التسليم المقترح:</span>
                          <span className="font-bold text-slate-800">{latestCommitment.deliveryDate}</span>
                        </div>
                      )}
                    </div>

                    {/* 1-Tap Action Buttons (Call Now & Copy Number) */}
                    {(req.assignedDonorPhone || latestCommitment?.donorPhone) && (
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => handleCopyPhone(req.assignedDonorPhone || latestCommitment?.donorPhone, req.requestId)}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-900 font-bold rounded-xl text-xs min-h-[42px] transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedPhoneId === req.requestId ? 'تم النسخ!' : 'نسخ الرقم'}</span>
                        </button>

                        <a
                          href={`tel:${req.assignedDonorPhone || latestCommitment?.donorPhone}`}
                          className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-emerald-800 hover:bg-emerald-900 active:bg-slate-950 text-white font-bold rounded-xl text-xs shadow-xs min-h-[42px] transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>اتصال بالمتبرع</span>
                        </a>
                      </div>
                    )}

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      <PostRequestModal
        isOpen={isPostModalOpen}
        onClose={handleCloseModal}
        initialData={editingRequest}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        isDestructive={confirmDialog.isDestructive}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
};
