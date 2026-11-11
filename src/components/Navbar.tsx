import React from 'react';
import {
  HeartHandshake,
  Moon,
  CalendarCheck2,
  Users,
  ShieldCheck,
  LogIn,
  LogOut,
  Sparkles,
  PhoneCall,
  Menu,
  X,
  Wallet,
  Bell,
} from 'lucide-react';
import { AuthState } from '../types.ts';
import { ADMIN_PRIMARY_EMAIL } from '../data/initialData.ts';
import { maskAdminEmail, isUserAdmin, formatTaka } from '../utils/finance.ts';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  authState: AuthState;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onOpenPayModal: () => void;
  pendingSubsCount: number;
  mainBalance: number;
  unreadNotificationsCount: number;
  onOpenNotificationsModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  authState,
  onOpenLoginModal,
  onLogout,
  onOpenPayModal,
  pendingSubsCount,
  mainBalance,
  unreadNotificationsCount,
  onOpenNotificationsModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isAdmin = isUserAdmin(authState.currentUser?.email) || authState.currentUser?.role === 'admin';

  const navItems = [
    { id: 'dashboard', label: 'মূল পাতা', icon: Sparkles },
    { id: 'eid', label: 'দুই ঈদের অনুষ্ঠান', icon: Moon },
    { id: 'kalyan', label: 'কল্যাণ ট্রাস্ট', icon: HeartHandshake },
    {
      id: 'monthly',
      label: 'মাসিক চাঁদা (৫০০৳)',
      icon: CalendarCheck2,
      badge: pendingSubsCount > 0 && isAdmin ? pendingSubsCount : undefined,
    },
    { id: 'members', label: 'পারিবারিক সদস্য', icon: Users },
    { id: 'organizers', label: 'উদ্যোক্তা ও অ্যাডমিন', icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner Notice for Admin & Security */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4 border-b border-emerald-900/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-emerald-200">মোল্লা পরিবার ঐক্য ও কল্যাণ ট্রাস্ট</span>
            <span className="hidden sm:inline text-emerald-500">•</span>
            <span className="hidden sm:inline text-emerald-300">মাসিক চাঁদা: ৫০০ টাকা (অ্যাডমিন যাচাই সাপেক্ষে তহবিলে যুক্ত)</span>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-900 border border-emerald-700/80 text-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>লগইনকৃত অ্যাডমিন: {authState.currentUser?.email}</span>
                <span className="text-[10px] text-emerald-300">(শুধুমাত্র আপনার নিকট দৃশ্যমান)</span>
              </span>
            ) : (
              <span className="text-emerald-300 text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>অ্যাডমিনের তথ্য: {maskAdminEmail(ADMIN_PRIMARY_EMAIL, false)}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
          {/* 1. Left: Brand Logo */}
          <div
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <span className="text-lg sm:text-xl font-bold font-serif">মো</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight leading-tight">
                  মোল্লা পরিবার
                </h1>
                <span className="hidden sm:inline-block text-[10px] sm:text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-semibold border border-amber-200">
                  তহবিল
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium">
                ঐক্য ও কল্যাণ ট্রাস্ট
              </p>
            </div>
          </div>

          {/* 2. Middle: Centered Main Balance Badge (ব্যবহারকারীর বিশেষ অনুরোধ: মাঝখানে মেইন ব্যালেন্স) */}
          <div className="flex items-center justify-center shrink-0">
            <div
              onClick={() => setActiveTab('monthly')}
              title="বর্তমান মূল তহবিল ব্যালেন্স দেখতে ক্লিক করুন"
              className="cursor-pointer group flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-950 to-emerald-950 text-white border-2 border-emerald-500/40 shadow-sm shadow-emerald-900/15 hover:border-emerald-400 hover:shadow-md transition-all"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
                <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-200 tracking-wide uppercase">
                    বর্তমান তহবিল ব্যালেন্স
                  </span>
                </div>
                <div className="text-sm sm:text-lg font-extrabold text-amber-300 font-sans tracking-tight leading-none group-hover:text-amber-200 transition-colors">
                  {formatTaka(mainBalance)}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Right: Desktop Nav Items & User Actions */}
          <div className="hidden xl:flex items-center gap-1">
            <nav className="flex items-center gap-1 mr-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-800 shadow-2xs ring-1 ring-emerald-200 font-bold'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-stone-950 rounded-full animate-bounce">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <button
              onClick={onOpenPayModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all shrink-0"
            >
              <CalendarCheck2 className="w-3.5 h-3.5" />
              <span>চাঁদা দিন</span>
            </button>

            {/* Notification Bell Button */}
            <button
              onClick={onOpenNotificationsModal}
              className="relative p-2 rounded-xl text-stone-600 hover:text-emerald-800 hover:bg-emerald-50 border border-stone-200 transition-colors shrink-0"
              title="বিজ্ঞপ্তি ও নোটিফিকেশন"
              aria-label="বিজ্ঞপ্তি"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {authState.isLoggedIn ? (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200 shrink-0">
                <div className="text-right">
                  <div className="text-xs font-bold text-stone-900 flex items-center justify-end gap-1">
                    {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{authState.currentUser?.name}</span>
                  </div>
                  <div className="text-[10px] text-stone-500 font-medium">
                    {isAdmin ? 'অ্যাডমিন' : 'সদস্য'}
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="লগআউট"
                  className="p-1.5 rounded-xl text-stone-500 hover:text-red-600 hover:bg-red-50 border border-stone-200 transition-colors"
                  aria-label="লগআউট"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold border border-stone-200 active:scale-95 transition-all shrink-0"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                <span>লগইন</span>
              </button>
            )}
          </div>

          {/* Medium screen and mobile actions */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2">
            <button
              onClick={onOpenNotificationsModal}
              className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 border border-stone-200"
              aria-label="বিজ্ঞপ্তি"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenPayModal}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
            >
              <CalendarCheck2 className="w-3.5 h-3.5" />
              <span>চাঁদা দিন</span>
            </button>

            {authState.isLoggedIn ? (
              <button
                onClick={onLogout}
                title="লগআউট"
                className="p-2 rounded-xl text-stone-600 hover:text-red-600 hover:bg-red-50 border border-stone-200"
                aria-label="লগআউট"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="p-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold border border-stone-200 hover:bg-stone-200 flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">লগইন</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 border border-stone-200"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="p-3 bg-gradient-to-r from-emerald-900 to-teal-950 rounded-2xl text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-300" />
              <div>
                <div className="text-[11px] text-emerald-200 font-medium">বর্তমান মূল তহবিল ব্যালেন্স</div>
                <div className="text-base font-extrabold text-amber-300 font-sans">{formatTaka(mainBalance)}</div>
              </div>
            </div>
            <button
              onClick={() => {
                onOpenPayModal();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-stone-950 text-xs font-bold hover:bg-emerald-400"
            >
              চাঁদা প্রদান
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500 text-stone-950 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            {authState.isLoggedIn ? (
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                    {isAdmin && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{authState.currentUser?.name}</span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {isAdmin ? 'পর্ষদ অ্যাডমিন (Admin)' : 'সদস্য'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs text-red-600 bg-red-50 rounded-lg font-medium border border-red-200"
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenLoginModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold"
              >
                <LogIn className="w-4 h-4" />
                <span>লগইন করুন</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

