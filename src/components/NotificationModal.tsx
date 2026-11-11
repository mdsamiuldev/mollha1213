import React from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  Mail,
  CalendarCheck2,
  HeartHandshake,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { AppNotification } from '../types.ts';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onClearAll: () => void;
  onNavigateTab: (tabId: string) => void;
  onOpenPayModal: () => void;
  currentUserEmail?: string;
  isAdmin: boolean;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onClearAll,
  onNavigateTab,
  onOpenPayModal,
  currentUserEmail,
  isAdmin,
}) => {
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  // Filter notifications relevant to current user:
  // Admins see all notifications; regular members see their own or global announcements
  const userNotifications = notifications.filter((n) => {
    if (isAdmin) return true;
    if (!currentUserEmail) return true;
    if (!n.recipientEmail) return true;
    return n.recipientEmail.toLowerCase() === currentUserEmail.toLowerCase();
  });

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  const displayList = filter === 'unread'
    ? userNotifications.filter((n) => !n.isRead)
    : userNotifications;

  const formatTimestamp = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString('bn-BD', {
        hour: '2-digit',
        minute: '2-digit',
        day: 'numeric',
        month: 'short',
      });
    } catch {
      return 'কয়েক মুহূর্ত আগে';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 bg-white/10 rounded-2xl backdrop-blur-xs">
              <Bell className="w-6 h-6 text-amber-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold">বিজ্ঞপ্তি ও নোটিফিকেশন সেন্টার</h3>
              <p className="text-xs text-emerald-200">
                {unreadCount > 0
                  ? `আপনার ${unreadCount}টি অপঠিত নোটিফিকেশন রয়েছে`
                  : 'সকল নোটিফিকেশন হালনাগাদ রয়েছে'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar & Filter */}
        <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'all'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              সব ({userNotifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filter === 'unread'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              অপঠিত ({unreadCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs"
              >
                সব পঠিত করুন
              </button>
            )}
            {userNotifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-stone-400 hover:text-red-600 p-1"
                title="সব মুছে ফেলুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-stone-100">
          {displayList.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <Bell className="w-7 h-7 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-stone-800 mb-1">কোনো নোটিফিকেশন নেই</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                {filter === 'unread'
                  ? 'আপনার কোনো অপঠিত নোটিফিকেশন নেই।'
                  : 'চাঁদা যাচাই, সাহায্যের আবেদনের আপডেট এবং অটো রিমাইন্ডার এখানে প্রদর্শিত হবে।'}
              </p>
            </div>
          ) : (
            displayList.map((notif) => {
              const isUnread = !notif.isRead;
              return (
                <div
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`pt-3 first:pt-0 transition-all cursor-pointer group ${
                    isUnread ? 'bg-amber-50/40 -mx-2 px-3 py-2.5 rounded-2xl border border-amber-200/60' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'due_reminder' && (
                          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                            <Clock className="w-4 h-4" />
                          </div>
                        )}
                        {notif.type === 'subscription_verified' && (
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                        {notif.type === 'aid_status' && (
                          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                            <HeartHandshake className="w-4 h-4" />
                          </div>
                        )}
                        {notif.type === 'system' && (
                          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h5 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                            {notif.title}
                          </h5>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          )}
                        </div>

                        <p className="text-xs text-stone-600 leading-relaxed">
                          {notif.message}
                        </p>

                        {/* Automated Email notification tag */}
                        {notif.metadata?.emailSent && (
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-medium mt-1">
                            <Mail className="w-3 h-3 text-blue-600" />
                            <span>
                              স্বয়ংক্রিয় ইমেইল নোটিফিকেশন প্রেরিত:{' '}
                              <strong>{notif.metadata.emailRecipient || 'আপনার জিমেইল'}</strong>
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-400">
                          <span>{formatTimestamp(notif.timestamp)}</span>
                          {notif.linkTab && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateTab(notif.linkTab!);
                                onClose();
                              }}
                              className="text-emerald-700 hover:text-emerald-900 font-bold inline-flex items-center gap-1"
                            >
                              <span>দেখুন</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                          {notif.type === 'due_reminder' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenPayModal();
                                onClose();
                              }}
                              className="text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-md font-bold text-[10px]"
                            >
                              ৳ ৫০০ চাঁদা দিন
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNotification(notif.id);
                      }}
                      className="text-stone-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="মুছুন"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 text-center text-[11px] text-stone-500">
          চলতি মাসের চাঁদা অপরিশোধিত থাকলে সিস্টেমে স্বয়ংক্রিয় জিমেইল রিমাইন্ডার প্রেরিত হয়।
        </div>
      </div>
    </div>
  );
};
