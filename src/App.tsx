import React, { useState, useEffect } from 'react';
import {
  AuthState,
  FamilyMember,
  EidEvent,
  KalyanTrustAid,
  SubscriptionRecord,
  BalanceAdjustment,
  EidExpenseItem,
  AppNotification,
  UserAccount,
  UserRole,
} from './types.ts';
import {
  ADMIN_PRIMARY_EMAIL,
  BASE_INITIAL_BALANCE,
  INITIAL_MEMBERS,
  INITIAL_EID_EVENTS,
  INITIAL_KALYAN_AIDS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_ADJUSTMENTS,
  INITIAL_ORGANIZERS,
  INITIAL_ACCOUNTS,
  INITIAL_NOTIFICATIONS,
} from './data/initialData.ts';
import {
  calculateMainBalance,
  aggregateFamilyCensus,
  maskAdminEmail,
  isUserAdmin,
  formatTaka,
  getCurrentMonthKey,
  getBengaliMonthTitle,
  checkMemberMonthlyPaid,
} from './utils/finance.ts';
import { Navbar } from './components/Navbar.tsx';
import { DashboardOverview } from './components/DashboardOverview.tsx';
import { EidFestivalsView } from './components/EidFestivalsView.tsx';
import { KalyanTrustView } from './components/KalyanTrustView.tsx';
import { MonthlySubscriptionView } from './components/MonthlySubscriptionView.tsx';
import { FamilyDirectoryView } from './components/FamilyDirectoryView.tsx';
import { OrganizersView } from './components/OrganizersView.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { PaymentModal } from './components/PaymentModal.tsx';
import { AdminBalanceModal } from './components/AdminBalanceModal.tsx';
import { NotificationModal } from './components/NotificationModal.tsx';
import { Footer } from './components/Footer.tsx';
import { Mail, CheckCircle2, AlertTriangle, X } from 'lucide-react';

// Storage keys
const STORAGE_KEYS = {
  MEMBERS: 'molla_poribar_members_v2',
  EID_EVENTS: 'molla_poribar_eid_events_v2',
  AIDS: 'molla_poribar_aids_v2',
  SUBSCRIPTIONS: 'molla_poribar_subs_v2',
  ADJUSTMENTS: 'molla_poribar_adjustments_v2',
  BASE_BALANCE: 'molla_poribar_base_balance_v2',
  AUTH: 'molla_poribar_auth_v2',
  ACCOUNTS: 'molla_poribar_accounts_v2',
  NOTIFICATIONS: 'molla_poribar_notifications_v2',
};


export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Auth State
  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      isLoggedIn: false,
      currentUser: null,
    };
  });

  // Data States
  const [members, setMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MEMBERS;
  });

  const [eidEvents, setEidEvents] = useState<EidEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EID_EVENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EID_EVENTS;
  });

  const [trustAids, setTrustAids] = useState<KalyanTrustAid[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AIDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_KALYAN_AIDS;
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SUBSCRIPTIONS;
  });

  const [adjustments, setAdjustments] = useState<BalanceAdjustment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADJUSTMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ADJUSTMENTS;
  });

  const [baseBalance, setBaseBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BASE_BALANCE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return BASE_INITIAL_BALANCE;
  });

  // User Accounts State (for secure login & member registration)
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_ACCOUNTS;
  });

  // In-App Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isAdminBalanceModalOpen, setIsAdminBalanceModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [emailAlertToast, setEmailAlertToast] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(authState));
  }, [authState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EID_EVENTS, JSON.stringify(eidEvents));
  }, [eidEvents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AIDS, JSON.stringify(trustAids));
  }, [trustAids]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADJUSTMENTS, JSON.stringify(adjustments));
  }, [adjustments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Determine if current user is Admin (Validates all 3 admins)
  const isAdmin =
    isUserAdmin(authState.currentUser?.email) ||
    authState.currentUser?.role === 'admin';

  // Compute live financials and census
  const financials = calculateMainBalance(
    baseBalance,
    subscriptions,
    eidEvents,
    trustAids,
    adjustments
  );

  const census = aggregateFamilyCensus(members);

  // Unread notifications count for the current viewer
  const unreadNotificationsCount = notifications.filter((n) => {
    if (isAdmin) return !n.isRead;
    if (!authState.currentUser?.email) return false;
    return !n.isRead && (!n.recipientEmail || n.recipientEmail.toLowerCase() === authState.currentUser.email.toLowerCase());
  }).length;

  // Automated Monthly Subscription Due Reminder:
  // "যে লগইন করবে মাসিক যদি সে চাঁদা না দেয় তার জিমেইলে অটো নোটিফিকেশন চলে যাবে যে তুমি এই মাসে চাঁদা দাওনি।"
  useEffect(() => {
    if (!authState.isLoggedIn || !authState.currentUser) return;
    if (authState.currentUser.role !== 'member') return;

    const currentMonthKey = getCurrentMonthKey();
    const paidStatus = checkMemberMonthlyPaid(
      authState.currentUser,
      currentMonthKey,
      subscriptions
    );

    if (!paidStatus.isPaid) {
      const userEmail = authState.currentUser.email?.toLowerCase();
      // Check if we have already generated a due reminder notification for this month
      const alreadyNotified = notifications.some(
        (n) =>
          n.type === 'due_reminder' &&
          n.metadata?.monthYear === currentMonthKey &&
          n.recipientEmail?.toLowerCase() === userEmail
      );

      if (!alreadyNotified) {
        const monthTitle = getBengaliMonthTitle(currentMonthKey);
        const newNotif: AppNotification = {
          id: `notif-due-${Date.now()}`,
          recipientEmail: authState.currentUser.email,
          recipientName: authState.currentUser.name,
          recipientPhone: authState.currentUser.phone,
          type: 'due_reminder',
          title: `মাসিক চাঁদা বকেয়া তাগিদ (${monthTitle})`,
          message: `আসসালামু আলাইকুম ${authState.currentUser.name}, আপনি এই মাসে (${monthTitle}) ৫০০ টাকা চাঁদা এখনো পরিশোধ করেননি। মোল্লা পরিবারের কেন্দ্রীয় ফান্ডে আপনার মাসিক চাঁদা জমা দেওয়ার জন্য বিনীত অনুরোধ করা হচ্ছে।`,
          timestamp: new Date().toISOString(),
          isRead: false,
          linkTab: 'monthly',
          metadata: {
            emailSent: true,
            emailRecipient: authState.currentUser.email,
            monthYear: currentMonthKey,
          },
        };

        setNotifications((prev) => [newNotif, ...prev]);
        setEmailAlertToast(
          `📧 স্বয়ংক্রিয় ইমেইল নোটিফিকেশন প্রেরিত: ${authState.currentUser.email} ঠিকানায় চলতি মাসের (${monthTitle}) চাঁদা বকেয়ার তাগিদপত্র সফলভাবে পাঠানো হয়েছে।`
        );
      }
    }
  }, [authState.isLoggedIn, authState.currentUser?.email, subscriptions]);

  // Handlers
  const handleLogin = (user: { name: string; email: string; role: UserRole; phone?: string }) => {
    setAuthState({
      isLoggedIn: true,
      currentUser: user,
    });
  };

  const handleLogout = () => {
    setAuthState({
      isLoggedIn: false,
      currentUser: null,
    });
    setEmailAlertToast(null);
  };

  const handleRegisterAccount = (data: {
    name: string;
    phone: string;
    email: string;
    password: string;
    fatherName?: string;
    branch?: string;
  }) => {
    const newAcc: UserAccount = {
      id: `acc-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email,
      password: data.password,
      role: 'member',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setAccounts((prev) => [newAcc, ...prev]);

    // Also register in family members census directory
    const newMember: FamilyMember = {
      id: `mem-${Date.now()}`,
      name: data.name,
      gender: 'male',
      relationType: 'son',
      age: 28,
      bloodGroup: 'B+',
      phone: data.phone,
      occupation: 'পারিবারিক সদস্য',
      fatherName: data.fatherName || 'মোল্লা পরিবার',
      motherName: '',
      address: data.branch || 'মোল্লা বাড়ি',
      branch: data.branch || 'প্রধান শাখা',
      isRegisteredUser: true,
    };
    setMembers((prev) => [newMember, ...prev]);

    // Welcome Notification
    const welcomeNotif: AppNotification = {
      id: `notif-wel-${Date.now()}`,
      recipientEmail: data.email,
      recipientName: data.name,
      recipientPhone: data.phone,
      type: 'system',
      title: 'মোল্লা পরিবার কল্যাণ ট্রাস্টে স্বাগতম',
      message: `আসসালামু আলাইকুম ${data.name}! মোল্লা পরিবার ডিজিটাল পোর্টালে আপনার সদস্য অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [welcomeNotif, ...prev]);

    return { success: true };
  };

  const handleAddMember = (newMemberData: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...newMemberData,
      id: `mem-${Date.now()}`,
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  // When a user pays, it goes into pending verification for admin verification
  const handleConfirmPayment = (paymentData: Omit<SubscriptionRecord, 'id'>) => {
    const newRecord: SubscriptionRecord = {
      ...paymentData,
      id: `sub-${Date.now()}`,
      status: 'pending_verification',
    };
    setSubscriptions((prev) => [newRecord, ...prev]);

    // Notify admins of new pending contribution
    const adminAlert: AppNotification = {
      id: `notif-sub-pending-${Date.now()}`,
      recipientName: 'পর্ষদ অ্যাডমিন',
      type: 'subscription_verified',
      title: 'নতুন চাঁদা জমার আবেদন (যাচাই প্রয়োজন)',
      message: `${paymentData.memberName} ৳ ${paymentData.amount} চাঁদা জমা দিয়েছেন (${paymentData.paymentMethod}, TrxID: ${paymentData.transactionId || 'N/A'})। বিকাশ স্টেটমেন্ট দেখে যাচাই করুন।`,
      timestamp: new Date().toISOString(),
      isRead: false,
      linkTab: 'monthly',
      metadata: { amount: paymentData.amount },
    };
    setNotifications((prev) => [adminAlert, ...prev]);
  };

  // Admin verifies and approves the subscription after checking bKash statement
  const handleApproveSubscription = (subscriptionId: string) => {
    let approvedSub: SubscriptionRecord | undefined;

    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subscriptionId) {
          approvedSub = sub;
          return {
            ...sub,
            status: 'paid',
            verifiedByAdmin: true,
            verifiedAt: new Date().toISOString().split('T')[0],
            verifiedByEmail: authState.currentUser?.email || 'admin',
          };
        }
        return sub;
      })
    );

    // IN-APP NOTIFICATION: Alert member that subscription is verified!
    if (approvedSub) {
      const monthTitle = getBengaliMonthTitle((approvedSub as SubscriptionRecord).monthYear);
      const notif: AppNotification = {
        id: `notif-appr-${Date.now()}`,
        recipientName: (approvedSub as SubscriptionRecord).memberName,
        recipientPhone: (approvedSub as SubscriptionRecord).senderPhone,
        type: 'subscription_verified',
        title: 'চাঁদা যাচাই সম্পন্ন ও তহবিল যুক্ত হয়েছে',
        message: `আপনার ${monthTitle} মাসের ৳ ${(approvedSub as SubscriptionRecord).amount} চাঁদা অ্যাডমিন কর্তৃক যাচাই সম্পন্ন হয়েছে এবং মূল তহবিলে সফলভাবে যুক্ত করা হয়েছে। (TrxID: ${(approvedSub as SubscriptionRecord).transactionId || 'যাচাইকৃত'})।`,
        timestamp: new Date().toISOString(),
        isRead: false,
        linkTab: 'monthly',
        metadata: {
          subscriptionId,
          amount: (approvedSub as SubscriptionRecord).amount,
          newStatus: 'paid',
          emailSent: true,
          emailRecipient: (approvedSub as SubscriptionRecord).senderPhone || (approvedSub as SubscriptionRecord).memberName,
        },
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // Admin rejects fraudulent or missing transaction
  const handleRejectSubscription = (subscriptionId: string, reason: string) => {
    let rejectedSub: SubscriptionRecord | undefined;

    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subscriptionId) {
          rejectedSub = sub;
          return {
            ...sub,
            status: 'rejected',
            rejectionReason: reason,
          };
        }
        return sub;
      })
    );

    // IN-APP NOTIFICATION: Alert member that subscription verification failed
    if (rejectedSub) {
      const notif: AppNotification = {
        id: `notif-sub-rej-${Date.now()}`,
        recipientName: (rejectedSub as SubscriptionRecord).memberName,
        recipientPhone: (rejectedSub as SubscriptionRecord).senderPhone,
        type: 'subscription_verified',
        title: 'চাঁদা যাচাই সংক্রান্ত নোটিশ',
        message: `আপনার জমাকৃত চাঁদা যাচাই সফল হয়নি। কারণ: ${reason}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        linkTab: 'monthly',
        metadata: {
          subscriptionId,
          newStatus: 'rejected',
        },
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const handleAddAdjustment = (adjData: Omit<BalanceAdjustment, 'id'>) => {
    const newAdj: BalanceAdjustment = {
      ...adjData,
      id: `adj-${Date.now()}`,
    };
    setAdjustments((prev) => [newAdj, ...prev]);
  };

  const handleAddEidExpense = (
    eventId: 'eid_ul_fitr' | 'eid_ul_adha',
    expenseData: Omit<EidExpenseItem, 'id'>
  ) => {
    const newExpense: EidExpenseItem = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };

    setEidEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            expenses: [newExpense, ...event.expenses],
          };
        }
        return event;
      })
    );
  };

  const handleDeleteEidExpense = (
    eventId: 'eid_ul_fitr' | 'eid_ul_adha',
    expenseId: string
  ) => {
    setEidEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            expenses: event.expenses.filter((exp) => exp.id !== expenseId),
          };
        }
        return event;
      })
    );
  };

  const handleUpdateEidBudget = (
    eventId: 'eid_ul_fitr' | 'eid_ul_adha',
    newBudget: number
  ) => {
    setEidEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            totalBudget: newBudget,
          };
        }
        return event;
      })
    );
  };

  const handleApplyAid = (
    aidData: Omit<KalyanTrustAid, 'id' | 'status' | 'applicationDate'>
  ) => {
    const newAid: KalyanTrustAid = {
      ...aidData,
      id: `aid-${Date.now()}`,
      status: 'pending',
      applicationDate: new Date().toISOString().split('T')[0],
    };
    setTrustAids((prev) => [newAid, ...prev]);

    // Admin notification of new aid request
    const adminNotif: AppNotification = {
      id: `notif-aid-req-${Date.now()}`,
      recipientName: 'পর্ষদ অ্যাডমিন',
      type: 'aid_status',
      title: 'কল্যাণ ট্রাস্টে নতুন সাহায্যের আবেদন',
      message: `${aidData.applicantName} "${aidData.problemTitle}" এর জন্য ৳ ${aidData.requestedAmount} আবেদন করেছেন।`,
      timestamp: new Date().toISOString(),
      isRead: false,
      linkTab: 'kalyan',
    };
    setNotifications((prev) => [adminNotif, ...prev]);
  };

  // IN-APP NOTIFICATION: Alert member when their aid application status changes (disbursed/approved)
  const handleDisburseAid = (
    aidId: string,
    grantedAmount: number,
    reviewNotes: string
  ) => {
    let disbursedAid: KalyanTrustAid | undefined;

    setTrustAids((prev) =>
      prev.map((a) => {
        if (a.id === aidId) {
          disbursedAid = a;
          return {
            ...a,
            status: 'disbursed',
            grantedAmount,
            disbursedDate: new Date().toISOString().split('T')[0],
            reviewNotes,
          };
        }
        return a;
      })
    );

    if (disbursedAid) {
      const notif: AppNotification = {
        id: `notif-aid-ok-${Date.now()}`,
        recipientName: (disbursedAid as KalyanTrustAid).applicantName,
        recipientPhone: (disbursedAid as KalyanTrustAid).applicantPhone,
        type: 'aid_status',
        title: 'কল্যাণ ট্রাস্ট সাহায্যের আবেদন মঞ্জুর ও অনুমোদন',
        message: `আপনার আবেদনকৃত "${(disbursedAid as KalyanTrustAid).problemTitle}" এর জন্য ৳ ${formatTaka(grantedAmount)} অনুদান ট্রাস্ট তহবিল থেকে মঞ্জুর করা হয়েছে। মন্তব্য: ${reviewNotes}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        linkTab: 'kalyan',
        metadata: {
          aidId,
          amount: grantedAmount,
          newStatus: 'disbursed',
          emailSent: true,
          emailRecipient: (disbursedAid as KalyanTrustAid).applicantPhone,
        },
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // IN-APP NOTIFICATION: Alert member when their aid application is rejected
  const handleRejectAid = (aidId: string, reviewNotes: string) => {
    let rejectedAid: KalyanTrustAid | undefined;

    setTrustAids((prev) =>
      prev.map((a) => {
        if (a.id === aidId) {
          rejectedAid = a;
          return {
            ...a,
            status: 'rejected',
            reviewNotes,
          };
        }
        return a;
      })
    );

    if (rejectedAid) {
      const notif: AppNotification = {
        id: `notif-aid-rej-${Date.now()}`,
        recipientName: (rejectedAid as KalyanTrustAid).applicantName,
        recipientPhone: (rejectedAid as KalyanTrustAid).applicantPhone,
        type: 'aid_status',
        title: 'কল্যাণ ট্রাস্ট আবেদন পর্যালোচনা সম্পন্ন',
        message: `আপনার সাহায্যের আবেদনটি পর্যালোচনা করা হয়েছে। বর্তমান ফান্ড পরিস্থিতি বা পর্যালোচনার আলোকে এটি মঞ্জুর করা সম্ভব হয়নি। মন্তব্য: ${reviewNotes}`,
        timestamp: new Date().toISOString(),
        isRead: false,
        linkTab: 'kalyan',
        metadata: {
          aidId,
          newStatus: 'rejected',
        },
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // Notification management handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-emerald-700 selection:text-white">
      {/* Automated Email Reminder Toast Banner */}
      {emailAlertToast && (
        <div className="bg-gradient-to-r from-teal-800 to-emerald-900 text-white px-4 py-2.5 text-xs border-b border-teal-700 shadow-sm animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="font-medium">{emailAlertToast}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsPayModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-[11px]"
              >
                এখনই চাঁদা দিন
              </button>
              <button
                onClick={() => setEmailAlertToast(null)}
                className="p-1 text-teal-200 hover:text-white"
                aria-label="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar with Centered Fund Balance & Notification Bell */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        authState={authState}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenPayModal={() => setIsPayModalOpen(true)}
        pendingSubsCount={financials.pendingSubscriptionsCount}
        mainBalance={financials.mainBalance}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotificationsModal={() => setIsNotificationsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            financials={financials}
            census={census}
            eidEvents={eidEvents}
            recentAids={trustAids}
            onNavigate={setActiveTab}
            onOpenPayModal={() => setIsPayModalOpen(true)}
            onOpenAdminBalanceModal={() => setIsAdminBalanceModalOpen(true)}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'eid' && (
          <EidFestivalsView
            eidEvents={eidEvents}
            isAdmin={isAdmin}
            onAddExpense={handleAddEidExpense}
            onDeleteExpense={handleDeleteEidExpense}
            onUpdateBudget={handleUpdateEidBudget}
          />
        )}

        {activeTab === 'kalyan' && (
          <KalyanTrustView
            aids={trustAids}
            isAdmin={isAdmin}
            onApplyAid={handleApplyAid}
            onDisburseAid={handleDisburseAid}
            onRejectAid={handleRejectAid}
          />
        )}

        {activeTab === 'monthly' && (
          <MonthlySubscriptionView
            subscriptions={subscriptions}
            members={members}
            isAdmin={isAdmin}
            onOpenPayModal={() => setIsPayModalOpen(true)}
            onOpenAdminBalanceModal={() => setIsAdminBalanceModalOpen(true)}
            mainBalance={financials.mainBalance}
            onApproveSubscription={handleApproveSubscription}
            onRejectSubscription={handleRejectSubscription}
          />
        )}

        {activeTab === 'members' && (
          <FamilyDirectoryView
            members={members}
            onAddMember={handleAddMember}
            isAdmin={isAdmin}
          />
        )}

        {activeTab === 'organizers' && (
          <OrganizersView
            isAdmin={isAdmin}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onRegisterAccount={handleRegisterAccount}
        authState={authState}
        members={members}
        accounts={accounts}
      />

      <PaymentModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        members={members}
        onConfirmPayment={handleConfirmPayment}
        defaultMemberName={authState.currentUser?.name}
      />

      <AdminBalanceModal
        isOpen={isAdminBalanceModalOpen}
        onClose={() => setIsAdminBalanceModalOpen(false)}
        currentMainBalance={financials.mainBalance}
        onAddAdjustment={handleAddAdjustment}
      />

      <NotificationModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteNotification={handleDeleteNotification}
        onClearAll={handleClearAllNotifications}
        onNavigateTab={setActiveTab}
        onOpenPayModal={() => setIsPayModalOpen(true)}
        currentUserEmail={authState.currentUser?.email}
        isAdmin={isAdmin}
      />

      {/* Footer */}
      <Footer
        isAdmin={isAdmin}
        onNavigate={setActiveTab}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />
    </div>
  );
}

