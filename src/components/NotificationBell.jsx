import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Truck, AlertTriangle, Info, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';

export default function NotificationBell({ onSelectNeed }) {
  const { notifications, unreadNotifsCount, markNotificationRead, markAllNotificationsRead } = useData();
  const { isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const getIconForType = (type) => {
    switch (type) {
      case 'dispatch_pledged':
      case 'dispatch_status_update':
      case 'dispatch_delivered':
        return <Truck className="w-4 h-4 text-emerald-700" />;
      case 'new_need':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return isRtl ? 'الآن' : 'Just now';
    if (diffMins < 60) return isRtl ? `منذ ${diffMins} دقيقة` : `${diffMins}m ago`;
    if (diffHours < 24) return isRtl ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
    return isRtl ? `منذ ${Math.floor(diffHours / 24)} يوم` : `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition min-h-[36px] min-w-[36px] flex items-center justify-center border border-slate-200"
        title={isRtl ? 'الإشعارات' : 'Notifications'}
      >
        <Bell className="w-4 h-4" />
        {unreadNotifsCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 text-white text-[9px] font-bold items-center justify-center">
              {unreadNotifsCount > 9 ? '9+' : unreadNotifsCount}
            </span>
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={`absolute ${isRtl ? 'left-0 sm:left-auto sm:right-0' : 'right-0'} mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-800" />
              <h3 className="text-xs font-bold text-slate-900">
                {isRtl ? 'إشعارات الإغاثة' : 'Relief Alerts'}
              </h3>
              {unreadNotifsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                  {unreadNotifsCount}
                </span>
              )}
            </div>

            {unreadNotifsCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] text-emerald-800 hover:underline flex items-center gap-1 font-bold"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>{isRtl ? 'قراءة الكل' : 'Mark all read'}</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">{isRtl ? 'لا توجد إشعارات جديدة' : 'No notifications'}</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.relatedNeedId && onSelectNeed) {
                      onSelectNeed(notif.relatedNeedId);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                    notif.isRead 
                      ? 'bg-white opacity-70 hover:bg-slate-50' 
                      : 'bg-emerald-50/50 hover:bg-emerald-50'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white border border-slate-200 shrink-0 mt-0.5 shadow-2xs">
                    {getIconForType(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {notif.title}
                      </p>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {notif.body}
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatTimeAgo(notif.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { NotificationBell };
