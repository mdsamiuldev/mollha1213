import React, { useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  DollarSign,
  ShieldCheck,
  CreditCard,
  UserCheck,
  AlertCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  Phone,
  FileCheck,
} from 'lucide-react';
import { FamilyMember, SubscriptionRecord } from '../types.ts';
import {
  formatTaka,
  toBengaliNumerals,
  getCurrentMonthKey,
  getBengaliMonthTitle,
  MONTHLY_SUBSCRIPTION_AMOUNT,
} from '../utils/finance.ts';

interface MonthlySubscriptionViewProps {
  subscriptions: SubscriptionRecord[];
  members: FamilyMember[];
  isAdmin: boolean;
  onOpenPayModal: () => void;
  onOpenAdminBalanceModal: () => void;
  mainBalance: number;
  onApproveSubscription: (subscriptionId: string) => void;
  onRejectSubscription: (subscriptionId: string, reason: string) => void;
}

export const MonthlySubscriptionView: React.FC<MonthlySubscriptionViewProps> = ({
  subscriptions,
  members,
  isAdmin,
  onOpenPayModal,
  onOpenAdminBalanceModal,
  mainBalance,
  onApproveSubscription,
  onRejectSubscription,
}) => {
  const currentMonth = getCurrentMonthKey();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending_verification' | 'rejected'>('all');
  const [rejectingSubId, setRejectingSubId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Pending verification records for admin review
  const pendingVerifications = subscriptions.filter(
    (s) => s.status === 'pending_verification'
  );

  // Confirmed paid subscriptions for the selected month
  const paidSubscriptions = subscriptions.filter(
    (s) => s.status === 'paid' && s.monthYear === selectedMonth
  );

  const totalCollectedThisMonth = paidSubscriptions.reduce(
    (acc, curr) => acc + (curr.amount || 0),
    0
  );

  const filteredSubscriptions = subscriptions.filter((s) => {
    const matchesMonth = statusFilter === 'pending_verification' ? true : s.monthYear === selectedMonth;
    const matchesSearch =
      s.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.senderPhone && s.senderPhone.includes(searchTerm)) ||
      (s.transactionId && s.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || s.status === statusFilter;

    return matchesSearch && matchesStatus && (statusFilter === 'pending_verification' || matchesMonth);
  });

  const handleRejectConfirm = (id: string) => {
    onRejectSubscription(
      id,
      rejectionReasonInput.trim() || 'বিকাশ/নগদ স্টেটমেন্টে ট্রানজেকশন আইডি পাওয়া যায়নি।'
    );
    setRejectingSubId(null);
    setRejectionReasonInput('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <CalendarCheck2 className="w-3.5 h-3.5 text-amber-300" />
            <span>মাসিক চাঁদা তহবিল - প্রতি মাসে ৫০০ টাকা (বিকাশ যাচাই সাপেক্ষে)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            মাসিক চাঁদা সংগ্রহ ও মেইন ব্যালেন্স
          </h2>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            মোল্লা পরিবারের সদস্যরা প্রতি মাসে ৫০০ টাকা করে চাঁদা প্রদান করবেন। কেউ ট্রানজেকশন সাবমিট করলে অ্যাডমিন ও উদ্যোক্তাগণ বিকাশ/নগদ স্টেটমেন্ট মিলিয়ে কনফার্ম করার পর টাকাটি <strong>মেইন ব্যালেন্সে আনুষ্ঠানিকভাবে যোগ হবে</strong>।
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenPayModal}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-900 font-bold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-emerald-950" />
              <span>মাসিক চাঁদা প্রদান করুন (৳ ৫০০)</span>
            </button>

            {isAdmin && (
              <button
                onClick={onOpenAdminBalanceModal}
                className="px-4 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-950" />
                <span>মেইন ব্যালেন্স ম্যানুয়াল আপডেট</span>
              </button>
            )}
          </div>
        </div>

        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Main Balance & Monthly KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border-2 border-emerald-500/30 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase">
              মোট মেইন ব্যালেন্স (লাইভ)
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              ৳
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-2">
            {formatTaka(mainBalance)}
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            যাচাই শেষে অনুমোদন হলেই ব্যালেন্সে যোগ হয়
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase">
              {getBengaliMonthTitle(selectedMonth)} সংগৃহীত
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            {formatTaka(totalCollectedThisMonth)}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            অনুমোদিত চাঁদার পরিমাণ
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border-2 border-amber-300 shadow-xs bg-amber-50/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase">
              যাচাইয়ের অপেক্ষায়
            </span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-2">
            {toBengaliNumerals(pendingVerifications.length)} টি
          </div>
          <p className="text-[11px] text-amber-700 mt-1">
            বিকাশ দেখে কনফার্ম করতে হবে
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase">
              মাসিক ধার্য চাঁদা
            </span>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-stone-900 mt-2">
            ৳ ৫০০
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            সদস্য প্রতি প্রতি মাসে
          </p>
        </div>
      </div>

      {/* Admin Verification Notice / Review Section */}
      {isAdmin && pendingVerifications.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-100 rounded-xl text-amber-800">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  চাঁদা যাচাই ও অনুমোদন প্যানেল (বিকাশ/নগদ নিশ্চিতকরণ)
                </h3>
                <p className="text-xs text-stone-500">
                  {toBengaliNumerals(pendingVerifications.length)} টি পেমেন্ট যাচাইয়ের অপেক্ষায় রয়েছে
                </p>
              </div>
            </div>
            <span className="text-xs font-bold bg-amber-500 text-stone-950 px-2.5 py-1 rounded-full">
              অ্যাডমিন অ্যাকশন প্রয়োজন
            </span>
          </div>

          <div className="space-y-3">
            {pendingVerifications.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">
                      {item.memberName}
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                      ৳ {toBengaliNumerals(item.amount)}
                    </span>
                    <span className="text-xs text-stone-500">
                      • {getBengaliMonthTitle(item.monthYear)} এর চাঁদা
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-stone-600">
                    <span>মাধ্যম: <strong>{item.paymentMethod}</strong></span>
                    <span>প্রেরক নম্বর: <strong>{item.senderPhone}</strong></span>
                    <span>ট্রানজেকশন আইডি: <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-amber-300 text-stone-900">{item.transactionId}</strong></span>
                    <span>তারিখ: {item.paidAt}</span>
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-stone-500 mt-1">মন্তব্য: {item.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => {
                      setRejectingSubId(item.id);
                      setRejectionReasonInput('');
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                  >
                    প্রত্যাখ্যান
                  </button>

                  <button
                    onClick={() => onApproveSubscription(item.id)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>যাচাই সম্পন্ন (মেইন ব্যালেন্সে যোগ করুন)</span>
                  </button>
                </div>

                {/* Inline Rejection Box */}
                {rejectingSubId === item.id && (
                  <div className="w-full mt-3 p-3 bg-red-50 rounded-xl border border-red-200 space-y-2">
                    <label className="block text-xs font-bold text-red-900">
                      প্রত্যাখ্যানের কারণ লিখুন:
                    </label>
                    <input
                      type="text"
                      value={rejectionReasonInput}
                      onChange={(e) => setRejectionReasonInput(e.target.value)}
                      placeholder="যেমন: বিকাশ অ্যাকাউন্টে কোনো টাকা জমা হয়নি বা TrxID ভুল"
                      className="w-full px-3 py-1.5 rounded-lg border border-red-300 text-xs bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setRejectingSubId(null)}
                        className="px-2.5 py-1 text-xs rounded bg-stone-200 text-stone-700 font-semibold"
                      >
                        বাতিল
                      </button>
                      <button
                        onClick={() => handleRejectConfirm(item.id)}
                        className="px-3 py-1 text-xs rounded bg-red-700 text-white font-bold"
                      >
                        প্রত্যাখ্যান নিশ্চিত করুন
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month Selector Bar & Search Controls */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-xs font-bold text-stone-700 whitespace-nowrap">
              মাস নির্বাচন:
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:ring-2 focus:ring-emerald-600"
            />
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg font-bold">
              {getBengaliMonthTitle(selectedMonth)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="নাম, ফোন বা TrxID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  statusFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                সব রেকর্ড
              </button>
              <button
                onClick={() => setStatusFilter('paid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  statusFilter === 'paid'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                অনুমোদিত ({toBengaliNumerals(subscriptions.filter((s) => s.status === 'paid').length)})
              </button>
              <button
                onClick={() => setStatusFilter('pending_verification')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  statusFilter === 'pending_verification'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                যাচাইাধীন ({toBengaliNumerals(pendingVerifications.length)})
              </button>
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-700 text-xs font-bold uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3 px-4">নং</th>
                <th className="py-3 px-4">সদস্যের নাম</th>
                <th className="py-3 px-4">চাঁদার মাস</th>
                <th className="py-3 px-4">পরিমাণ</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4">মাধ্যম ও TrxID</th>
                <th className="py-3 px-4">প্রেরক ফোন</th>
                <th className="py-3 px-4">তারিখ ও যাচাইকারী</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredSubscriptions.map((item, idx) => (
                <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs text-stone-500">
                    {toBengaliNumerals(idx + 1)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">
                    {item.memberName}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-stone-700">
                    {getBengaliMonthTitle(item.monthYear)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-800">
                    ৳ {toBengaliNumerals(item.amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    {item.status === 'paid' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>অনুমোদিত ও যোগকৃত</span>
                      </span>
                    )}
                    {item.status === 'pending_verification' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>যাচাইয়ের অপেক্ষায়</span>
                      </span>
                    )}
                    {item.status === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>বাতিলকৃত</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <span className="font-bold text-stone-800">
                      {item.paymentMethod}
                    </span>
                    <div className="font-mono text-[11px] text-stone-500">
                      {item.transactionId}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-stone-600 font-mono">
                    {item.senderPhone || '-'}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-stone-600">
                    <div>{item.paidAt}</div>
                    {item.verifiedByEmail && (
                      <div className="text-[10px] text-emerald-700">যাচাইকারী: অ্যাডমিন</div>
                    )}
                    {item.rejectionReason && (
                      <div className="text-[10px] text-red-600">{item.rejectionReason}</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubscriptions.length === 0 && (
            <div className="text-center py-10 bg-white">
              <p className="text-stone-500 text-xs">এই মাসে এখনো কোনো চাঁদার রেকর্ড নেই।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
