import React from 'react';
import {
  Wallet,
  Sparkles,
  Moon,
  HeartHandshake,
  Users,
  CalendarCheck2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Droplet,
  PhoneCall,
  Clock,
  TrendingUp,
  AlertCircle,
  UserPlus,
} from 'lucide-react';
import {
  CalculatedFinancials,
  FamilyCensusStats,
  formatTaka,
  toBengaliNumerals,
  getBengaliMonthTitle,
  getCurrentMonthKey,
} from '../utils/finance.ts';
import { EidEvent, KalyanTrustAid, FamilyMember } from '../types.ts';
import { INITIAL_ORGANIZERS } from '../data/initialData.ts';

interface DashboardOverviewProps {
  financials: CalculatedFinancials;
  census: FamilyCensusStats;
  eidEvents: EidEvent[];
  recentAids: KalyanTrustAid[];
  onNavigate: (tab: string) => void;
  onOpenPayModal: () => void;
  onOpenAdminBalanceModal: () => void;
  isAdmin: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  financials,
  census,
  eidEvents,
  recentAids,
  onNavigate,
  onOpenPayModal,
  onOpenAdminBalanceModal,
  isAdmin,
}) => {
  const currentMonthKey = getCurrentMonthKey();
  const eidFitr = eidEvents.find((e) => e.id === 'eid_ul_fitr');
  const eidAdha = eidEvents.find((e) => e.id === 'eid_ul_adha');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>স্বাগতম মোল্লা পরিবার ডিজিটাল প্ল্যাটফর্মে</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            মোল্লা পরিবার ঐক্য, উৎসব ও কল্যাণ ট্রাস্ট
          </h2>

          <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
            রক্তের টান, পারস্পরিক সহযোগিতা ও ঐতিহ্য সংরক্ষণের প্রত্যয়ে আমাদের এই পারিবারিক উদ্যোগ। দুই ঈদের উৎসবের স্বচ্ছ হিসাব, প্রতি মাসের ৫০০ টাকা চাঁদা তহবিল, বিপদে আপদে কল্যাণ ট্রাস্টের সাহায্য এবং পরিবারের প্রতিটি সদস্যের সঠিক পরিসংখ্যান।
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenPayModal}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-bold text-sm shadow-lg shadow-emerald-950/30 active:scale-95 transition-all flex items-center gap-2"
            >
              <CalendarCheck2 className="w-4 h-4 text-emerald-950" />
              <span>মাসিক চাঁদা প্রদান করুন (৳ ৫০০)</span>
            </button>

            <button
              onClick={() => onNavigate('kalyan')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-rose-300" />
              <span>সাহায্যের আবেদন</span>
            </button>

            {isAdmin && (
              <button
                onClick={onOpenAdminBalanceModal}
                className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-950" />
                <span>মেইন ব্যালেন্স সমন্বয়</span>
              </button>
            )}
          </div>
        </div>

        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Admin Notification Alert if Subscriptions are Pending Verification */}
      {isAdmin && financials.pendingSubscriptionsCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-200 text-amber-900 rounded-xl">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-950">
                বিকাশ/নগদ যাচাইয়ের অপেক্ষায় {toBengaliNumerals(financials.pendingSubscriptionsCount)} টি চাঁদার আবেদন
              </h4>
              <p className="text-xs text-amber-800">
                টাকা না মেরে ভুয়া TrxID রোধে অ্যাডমিনের স্টেটমেন্ট যাচাই সাপেক্ষে এগুলো মেইন ব্যালেন্সে যুক্ত হবে।
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('monthly')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold shrink-0 transition-colors"
          >
            যাচাই করুন
          </button>
        </div>
      )}

      {/* Primary Financial Overview - মেইন ব্যালেন্স ও অন্যান্য হিসাব */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-700" />
            <span>কেন্দ্রীয় তহবিল ও আর্থিক পরিস্থিতি</span>
          </h3>
          <span className="text-xs text-stone-500 font-medium">
            নিরাপদ যাচাইকৃত অটো-আপডেট
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Main Balance Highlight Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-teal-900 text-white p-6 rounded-3xl shadow-md relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                  মেইন ব্যালেন্স (Main Balance)
                </span>
                <span className="p-1.5 rounded-xl bg-white/10 text-amber-300">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
                {formatTaka(financials.mainBalance)}
              </div>
              <p className="text-xs text-emerald-200/90 mt-1">
                বিকাশ যাচাই ও নিশ্চিতের পর স্বয়ংক্রিয়ভাবে ক্রেডিট হয়
              </p>
            </div>

            {isAdmin && (
              <div className="mt-4 pt-3 border-t border-emerald-700/60">
                <button
                  onClick={onOpenAdminBalanceModal}
                  className="w-full py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors text-center"
                >
                  ব্যালেন্স পরিবর্তন করুন
                </button>
              </div>
            )}
          </div>

          {/* Monthly Collection Card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  অনুমোদিত চাঁদা সংগ্রহ
                </span>
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
                {formatTaka(financials.totalSubscriptionCollected)}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                যাচাইকৃত ৫০০৳ মাসিক চাঁদা
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">চলতি মাস: {getBengaliMonthTitle(currentMonthKey)}</span>
              <button
                onClick={() => onNavigate('monthly')}
                className="font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                <span>তালিকা</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Eid Expenses Total Card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  দুই ঈদের মোট ব্যয়
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
                {formatTaka(financials.totalEidSpent)}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                ঈদুল ফিতর ও ঈদুল আজহার মহাভোজ ও আয়োজন
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">শুধু অ্যাডমিন পরিবর্তনশীল</span>
              <button
                onClick={() => onNavigate('eid')}
                className="font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                <span>ভাউচার</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Kalyan Trust Disbursed Card */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  কল্যাণ ট্রাস্ট বিতরণ
                </span>
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                  <HeartHandshake className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
                {formatTaka(financials.totalAidDisbursed)}
              </div>
              <p className="text-xs text-stone-500 mt-1">
                অসুস্থতা, চিকিৎসা ও জরুরি বিপদে সহায়তা
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <span className="text-stone-500">স্বচ্ছ রেকর্ড বোর্ড</span>
              <button
                onClick={() => onNavigate('kalyan')}
                className="font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                <span>দেখুন</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Family Census & Demographics Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <span>পরিবারের সদস্য ডিরেক্টরি ও সুনির্দিষ্ট পরিসংখ্যান</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              পরিবারের ছেলে কয়জন, মেয়ে কয়জন, পিতা-মাতা কয়জন ও রক্তের গ্রুপ তালিকা
            </p>
          </div>

          <button
            onClick={() => onNavigate('members')}
            className="self-start sm:self-auto text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
          >
            <span>সদস্য ডিরেক্টরি খুলুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 text-center">
            <span className="text-xs font-bold text-stone-500 block uppercase">মোট সদস্য</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1 block">
              {toBengaliNumerals(census.totalMembers)} জন
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-center">
            <span className="text-xs font-bold text-blue-700 block uppercase">ছেলে (পুরুষ)</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-1 block">
              {toBengaliNumerals(census.maleCount)} জন
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 text-center">
            <span className="text-xs font-bold text-rose-700 block uppercase">মেয়ে (নারী)</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-950 mt-1 block">
              {toBengaliNumerals(census.femaleCount)} জন
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 text-center">
            <span className="text-xs font-bold text-amber-700 block uppercase">পিতা-মাতা</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-950 mt-1 block">
              {toBengaliNumerals(census.parentsCount)} জন
            </span>
          </div>
        </div>

        {census.totalMembers === 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <p className="text-xs text-emerald-900 font-medium">
              বর্তমানে সদস্য তালিকা খালি রয়েছে। সাইটটি পাবলিক করার পর সদস্যরা নিজ নিজ পরিবারের সদস্যের তথ্য যুক্ত করতে পারবেন।
            </p>
            <button
              onClick={() => onNavigate('members')}
              className="mt-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-1.5 rounded-xl inline-flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>পরিবারের সদস্য যোগ করুন</span>
            </button>
          </div>
        )}
      </div>

      {/* Two Eid Events Feature Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eid-ul-Fitr Spotlight */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                ঈদুল ফিতর উৎসব
              </span>
              <span className="text-xs text-stone-500 font-medium">১৪৪৭ হিজরি</span>
            </div>

            <h4 className="text-lg font-bold text-stone-900 mt-3">
              {eidFitr?.title}
            </h4>
            <p className="text-xs text-stone-600 mt-1 line-clamp-2">
              {eidFitr?.venue} • {eidFitr?.theme}
            </p>

            <div className="mt-4 p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-400 block font-medium">নির্ধারিত বাজেট:</span>
                <span className="font-bold text-stone-900">{formatTaka(eidFitr?.totalBudget || 0)}</span>
              </div>
              <div className="text-right">
                <span className="text-stone-400 block font-medium">মোট ব্যয়:</span>
                <span className="font-bold text-amber-800">
                  {formatTaka(eidFitr?.expenses.reduce((s, e) => s + (e.amount || 0), 0) || 0)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('eid')}
            className="mt-4 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>ঈদুল ফিতরের খরচের হিসাব দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Eid-ul-Adha Spotlight */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                ঈদুল আজহা ও কোরবানি
              </span>
              <span className="text-xs text-stone-500 font-medium">১৪৪৭ হিজরি</span>
            </div>

            <h4 className="text-lg font-bold text-stone-900 mt-3">
              {eidAdha?.title}
            </h4>
            <p className="text-xs text-stone-600 mt-1 line-clamp-2">
              {eidAdha?.venue} • {eidAdha?.theme}
            </p>

            <div className="mt-4 p-3.5 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-400 block font-medium">নির্ধারিত বাজেট:</span>
                <span className="font-bold text-stone-900">{formatTaka(eidAdha?.totalBudget || 0)}</span>
              </div>
              <div className="text-right">
                <span className="text-stone-400 block font-medium">মোট ব্যয়:</span>
                <span className="font-bold text-emerald-800">
                  {formatTaka(eidAdha?.expenses.reduce((s, e) => s + (e.amount || 0), 0) || 0)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('eid')}
            className="mt-4 w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>ঈদুল আজহার কোরবানির হিসাব দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Featured Organizers Preview */}
      <div className="bg-gradient-to-r from-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-7 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <span className="text-xs text-amber-300 font-bold uppercase tracking-wider block">
              উদ্যোক্তা ও পর্ষদ অ্যাডমিন
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              মোঃ আরিফুল ইসলাম ও মোঃ আনোয়ার
            </h3>
          </div>

          <button
            onClick={() => onNavigate('organizers')}
            className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors"
          >
            <span>পরিচালনা পর্ষদের তথ্য</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INITIAL_ORGANIZERS.map((org) => (
            <div
              key={org.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between"
            >
              <div>
                <div className="text-xs text-emerald-300 font-semibold">{org.role}</div>
                <div className="text-base font-bold text-white mt-0.5">{org.name}</div>
                <div className="text-[11px] text-stone-400 mt-1">মোল্লা পরিবার ঐক্য ও কল্যাণ ট্রাস্ট</div>
              </div>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                অ্যাডমিন
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
