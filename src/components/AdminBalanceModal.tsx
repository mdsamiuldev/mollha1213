import React, { useState } from 'react';
import { X, ShieldCheck, DollarSign, PlusCircle, MinusCircle, RefreshCw } from 'lucide-react';
import { BalanceAdjustment } from '../types.ts';
import { ADMIN_EMAIL } from '../data/initialData.ts';
import { formatTaka } from '../utils/finance.ts';

interface AdminBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMainBalance: number;
  onAddAdjustment: (adj: Omit<BalanceAdjustment, 'id'>) => void;
}

export const AdminBalanceModal: React.FC<AdminBalanceModalProps> = ({
  isOpen,
  onClose,
  currentMainBalance,
  onAddAdjustment,
}) => {
  const [amount, setAmount] = useState<number | ''>(5000);
  const [actionType, setActionType] = useState<'deposit' | 'withdrawal' | 'correction' | 'direct_donation'>('deposit');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    // If withdrawal, adjust amount to negative
    const finalAmount = actionType === 'withdrawal' ? -Math.abs(amount) : Math.abs(amount);

    onAddAdjustment({
      amount: finalAmount,
      type: actionType,
      reason: reason.trim() || 'অ্যাডমিন কর্তৃক মেইন ব্যালেন্স সমন্বয়',
      adjustedBy: ADMIN_EMAIL,
      date: new Date().toISOString().split('T')[0],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 rounded-2xl border border-amber-400/30">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">মেইন ব্যালেন্স সমন্বয় ও আপডেট</h3>
              <p className="text-xs text-amber-200">শুধুমাত্র প্রধান অ্যাডমিন প্যানেল</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 bg-stone-100 rounded-2xl flex items-center justify-between">
            <span className="text-xs text-stone-600 font-semibold">বর্তমান মেইন ব্যালেন্স:</span>
            <span className="text-lg font-bold text-emerald-800">{formatTaka(currentMainBalance)}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              আপডেটের ধরন নির্ধারণ করুন
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setActionType('deposit')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  actionType === 'deposit'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>তহবিলে অর্থ যোগ (+৳)</span>
              </button>

              <button
                type="button"
                onClick={() => setActionType('withdrawal')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  actionType === 'withdrawal'
                    ? 'border-red-600 bg-red-50 text-red-800 ring-1 ring-red-500'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <MinusCircle className="w-4 h-4 text-red-600" />
                <span>ব্যয় বা কর্তন (-৳)</span>
              </button>

              <button
                type="button"
                onClick={() => setActionType('direct_donation')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  actionType === 'direct_donation'
                    ? 'border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-500'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <DollarSign className="w-4 h-4 text-teal-600" />
                <span>বিশেষ এককালীন দান</span>
              </button>

              <button
                type="button"
                onClick={() => setActionType('correction')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  actionType === 'correction'
                    ? 'border-amber-600 bg-amber-50 text-amber-800 ring-1 ring-amber-500'
                    : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <RefreshCw className="w-4 h-4 text-amber-600" />
                <span>হিসাব সংশোধন</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              টাকার পরিমাণ (৳)
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="যেমন: ৫০০০"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 text-sm font-bold"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-stone-500 font-bold">টাকা</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              আপডেটের কারণ / বিবরণ
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="যেমন: ব্যাংক মুনাফা জমা, কল্যাণ তহবিলে বিশেষ স্পন্সর অনুদান অথবা জরুরি খরচ..."
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 text-sm"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
            <strong>অডিট ট্রেইল:</strong> এই ব্যালেন্স সমন্বয়ের লগটি সিস্টেমে স্থায়ীভাবে নথিভুক্ত থাকবে।
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white font-bold text-sm shadow-md active:scale-98 transition-all"
          >
            মেইন ব্যালেন্স আপডেট নিশ্চিত করুন
          </button>
        </form>
      </div>
    </div>
  );
};
