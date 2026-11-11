import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Wallet, ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { FamilyMember, SubscriptionRecord } from '../types.ts';
import { getCurrentMonthKey, getBengaliMonthTitle, toBengaliNumerals, formatTaka } from '../utils/finance.ts';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: FamilyMember[];
  onConfirmPayment: (payment: Omit<SubscriptionRecord, 'id'>) => void;
  currentUserId?: string;
  defaultMemberName?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  members,
  onConfirmPayment,
  currentUserId,
  defaultMemberName,
}) => {
  const currentMonthKey = getCurrentMonthKey();
  const [selectedMemberId, setSelectedMemberId] = useState(
    currentUserId || members[0]?.id || 'custom'
  );
  const [customMemberName, setCustomMemberName] = useState(defaultMemberName || '');
  const [targetMonth, setTargetMonth] = useState(currentMonthKey);
  const [amount, setAmount] = useState(500); // 500 Taka as requested
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank' | 'Cash'>('bKash');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let memberName = '';
    let memberId = '';

    if (selectedMemberId === 'custom' || members.length === 0) {
      if (!customMemberName.trim()) return;
      memberName = customMemberName.trim();
      memberId = `custom-${Date.now()}`;
    } else {
      const found = members.find((m) => m.id === selectedMemberId);
      memberName = found?.name || defaultMemberName || 'পারিবারিক সদস্য';
      memberId = found?.id || `mem-${Date.now()}`;
    }

    const enteredTrx = transactionId.trim() || `TRX-${Math.floor(100000 + Math.random() * 900000)}`;

    onConfirmPayment({
      memberId,
      memberName,
      monthYear: targetMonth,
      amount: Number(amount) || 500,
      status: 'pending_verification', // CRITICAL: Awaiting Admin/Organizer Verification!
      paymentMethod,
      transactionId: enteredTrx,
      senderPhone: senderPhone.trim() || '০১৭০০-০০০০০০',
      paidAt: new Date().toISOString().split('T')[0],
      verifiedByAdmin: false,
      notes: notes.trim() || `${getBengaliMonthTitle(targetMonth)} এর মাসিক চাঁদা`,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl">
              <Wallet className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">মাসিক চাঁদা প্রদান (৳ ৫০০)</h3>
              <p className="text-xs text-emerald-200">
                চলতি মাস: {getBengaliMonthTitle(currentMonthKey)}
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

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center animate-pulse">
              <Clock className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-stone-900">
              চাঁদার তথ্য সফলভাবে গৃহীত হয়েছে!
            </h4>
            <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
              আপনার সাবমিটকৃত ট্রানজেকশন আইডিটি <strong>অ্যাডমিন প্যানেলে অপেক্ষমাণ</strong> রয়েছে। অ্যাডমিন বা উদ্যোক্তাগণ তাদের বিকাশ/নগদ স্টেটমেন্টের সাথে TrxID মিলিয়ে কনফার্ম করার পর টাকাটি <span className="text-emerald-700 font-bold">মেইন ব্যালেন্সে আনুষ্ঠানিকভাবে যোগ হবে</span>।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Verification Security Notice */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">যাচাই ও নিরাপত্তা নীতি:</span>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  কেউ যেন ভুয়া TrxID দিয়ে ব্যালেন্স বাড়াতে না পারে, সেজন্য অ্যাডমিন বা উদ্যোক্তা তাদের বিকাশ/নগদ অ্যাকাউন্ট দেখে TrxID নিশ্চিত করার পরেই টাকাটি মেইন ব্যালেন্সে কার্যকরভাবে যুক্ত হবে।
                </p>
              </div>
            </div>

            {/* Member Selection / Direct Name */}
            {members.length > 0 ? (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  কার চাঁদা প্রদান করছেন?
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-medium bg-white"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.branch})
                    </option>
                  ))}
                  <option value="custom">+ নতুন সদস্য হিসেবে নাম লিখুন</option>
                </select>
              </div>
            ) : null}

            {(selectedMemberId === 'custom' || members.length === 0) && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  চাঁদা প্রদানকারীর পূর্ণ নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মোঃ সামিউল ইসলাম মোল্লা"
                  value={customMemberName}
                  onChange={(e) => setCustomMemberName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            )}

            {/* Month & Amount Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  চাঁদার মাস
                </label>
                <input
                  type="month"
                  value={targetMonth}
                  onChange={(e) => setTargetMonth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-medium"
                />
                <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                  {getBengaliMonthTitle(targetMonth)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  চাঁদার পরিমাণ
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    step="50"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold text-emerald-800"
                  />
                  <span className="absolute right-3 top-2 text-xs text-stone-500 font-bold">
                    টাকা
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 mt-0.5 block">
                  (নির্ধারিত ফি: ৫০০ টাকা)
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                পরিশোধের মাধ্যম বেছে নিন
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(['bKash', 'Nagad', 'Rocket', 'Bank', 'Cash'] as const).map((method) => {
                  const isSelected = paymentMethod === method;
                  return (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                          : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {method === 'bKash'
                        ? 'বিকাশ'
                        : method === 'Nagad'
                        ? 'নগদ'
                        : method === 'Rocket'
                        ? 'রকেট'
                        : method === 'Bank'
                        ? 'ব্যাংক'
                        : 'ক্যাশ (হাতে)'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instruction Notice regarding collection number */}
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600">
              <span className="font-bold text-stone-800">পেমেন্ট নির্দেশনা:</span> অ্যাডমিন বা উদ্যোক্তাগণের সাথে যোগাযোগ করে তাদের বিকাশ/নগদ নম্বরে ৫০০ টাকা Send Money করার পর নিচে প্রেরক নম্বর ও TrxID প্রদান করুন।
            </div>

            {/* Sender Phone & Transaction ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  যে নম্বর থেকে টাকা পাঠিয়েছেন *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="যেমন: ০১৭১২-XXXXXX"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ট্রানজেকশন আইডি (TrxID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: TRX987654"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                মন্তব্য (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: ভাইয়ার পক্ষ থেকে বা অগ্রিম চাঁদা"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-md shadow-emerald-800/20 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>চাঁদার তথ্য সাবমিট করুন (যাচাইয়ের জন্য পাঠান)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
