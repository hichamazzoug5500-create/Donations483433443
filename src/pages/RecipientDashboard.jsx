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
  AlertCircle
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
  const [selectedResponseReqId, setSelectedResponseReqId] = useState(null);

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
        ? 'هل تم استلام المساعدات وتلبية هذا الاحتياج بالفعل؟'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Dashboard Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {t('recipientDashTitle')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            <Building2 className="w-7 h-7 text-amber-300 shrink-0" />
            <span>{userProfile?.orgName || 'الجمعية'}</span>
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm max-w-xl">
            {userProfile?.city} • رقم الهاتف المعتمد: {userProfile?.phone}
          </p>
        </div>

        <button
          onClick={() => { setEditingRequest(null); setIsPostModalOpen(true); }}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center gap-2 shrink-0 min-h-[46px]"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t('postNeed')}</span>
        </button>
      </div>

      {/* Stats Cards */}
      {loadingRequests ? (
        <DashboardStatsSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase">{t('totalPosted')}</span>
              <div className="text-2xl font-bold text-slate-900">{ownRequests.length}</div>
            </div>
            <div className="p-3 bg-slate-100 text-slate-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase">{t('activeNeeds')}</span>
              <div className="text-2xl font-bold text-teal-600">{openCount}</div>
            </div>
            <div className="p-3 bg-teal-50 text-teal-700 rounded-xl">
              <HelpingHand className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase">{t('inProgressRequests')}</span>
              <div className="text-2xl font-bold text-amber-600">{inProgressCount}</div>
            </div>
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <PackageCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase">{t('fulfilledNeeds')}</span>
              <div className="text-2xl font-bold text-emerald-600">{fulfilledCount}</div>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'all' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('allRequests')} ({ownRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('open')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'open' ? 'bg-teal-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('openRequests')} ({openCount})
        </button>

        <button
          onClick={() => setActiveTab('in_progress')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'in_progress' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('inProgressRequests')} ({inProgressCount})
        </button>

        <button
          onClick={() => setActiveTab('fulfilled')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'fulfilled' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          {t('fulfilledRequests')} ({fulfilledCount})
        </button>
      </div>

      {/* Requests Feed */}
      {loadingRequests ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <RequestCardSkeleton key={i} />)}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-dashed border-slate-300">
          <h3 className="text-lg font-bold text-slate-800">{t('noRequestsFound')}</h3>
          <button
            onClick={() => { setEditingRequest(null); setIsPostModalOpen(true); }}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow transition-all active:scale-95 min-h-[42px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('postFirstNeed')}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((req) => {
            const responsesForThisReq = donorResponsesMap[req.requestId] || [];

            return (
              <div key={req.requestId} className="space-y-3">
                <div className="relative group">
                  <RequestCard
                    request={req}
                    isOwner={true}
                    onEdit={handleEdit}
                    onToggleStatus={handleToggleStatus}
                  />
                  <button
                    onClick={() => handleDelete(req)}
                    className="absolute top-4 left-4 rtl:left-auto rtl:right-auto opacity-0 group-hover:opacity-100 p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                    title="حذف الطلب"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Assigned Donor Commitment Info */}
                {req.assignedDonorName && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs space-y-2">
                    <div className="flex items-center justify-between text-amber-950 font-bold">
                      <span className="flex items-center gap-1.5">
                        <PackageCheck className="w-4 h-4 text-amber-600" />
                        <span>جهة متبرعة ملتزمة بالتكفل:</span>
                      </span>
                      <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md text-[10px]">
                        جاري التنسيق
                      </span>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-amber-100 space-y-1.5">
                      <div className="font-bold text-slate-900 text-sm">{req.assignedDonorName}</div>
                      {req.assignedDonorPhone && (
                        <div className="flex items-center gap-2 text-slate-600">
                          <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                          <a href={`tel:${req.assignedDonorPhone}`} className="dir-ltr text-teal-700 font-bold hover:underline">
                            {req.assignedDonorPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Donors Reached Out / Response History */}
                {responsesForThisReq.length > 0 && !req.assignedDonorName && (
                  <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3.5 text-xs space-y-2">
                    <div className="flex items-center justify-between text-teal-900 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-teal-600" />
                        <span>{responsesForThisReq.length} {t('donorsReachedOut')}</span>
                      </span>
                      <button 
                        onClick={() => setSelectedResponseReqId(selectedResponseReqId === req.requestId ? null : req.requestId)}
                        className="text-teal-700 underline font-semibold text-[11px]"
                      >
                        {selectedResponseReqId === req.requestId ? t('hideDetails') : t('viewContacts')}
                      </button>
                    </div>

                    {selectedResponseReqId === req.requestId && (
                      <div className="space-y-2 pt-2 border-t border-teal-200/60">
                        {responsesForThisReq.map((resp, idx) => (
                          <div key={resp.responseId || idx} className="bg-white p-3 rounded-xl border border-teal-100 text-slate-800 space-y-1.5">
                            <div className="font-bold text-teal-900 text-sm">{resp.donorOrgName}</div>
                            <div className="flex items-center gap-2 text-slate-600 text-xs">
                              <PhoneCall className="w-3 h-3 text-emerald-600" />
                              <a href={`tel:${resp.donorPhone}`} className="dir-ltr text-teal-700 font-semibold hover:underline">
                                {resp.donorPhone}
                              </a>
                            </div>
                            {resp.pledgedQuantity && (
                              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                <PackageCheck className="w-3 h-3 text-teal-600" />
                                <span>الكمية الملتزم بها: {resp.pledgedQuantity}</span>
                              </div>
                            )}
                            {resp.deliveryDate && (
                              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-amber-600" />
                                <span>موعد التوصيل: {resp.deliveryDate}</span>
                              </div>
                            )}
                          </div>
                        ))}
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
