import React, { useState } from 'react';
import {
  Moon,
  Sparkles,
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  Lock,
  PieChart,
  Tag,
  DollarSign,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { EidEvent, EidExpenseItem } from '../types.ts';
import { formatTaka, toBengaliNumerals } from '../utils/finance.ts';

interface EidFestivalsViewProps {
  eidEvents: EidEvent[];
  isAdmin: boolean;
  onAddExpense: (eventId: 'eid_ul_fitr' | 'eid_ul_adha', item: Omit<EidExpenseItem, 'id'>) => void;
  onDeleteExpense: (eventId: 'eid_ul_fitr' | 'eid_ul_adha', expenseId: string) => void;
  onUpdateBudget: (eventId: 'eid_ul_fitr' | 'eid_ul_adha', newBudget: number) => void;
}

export const EidFestivalsView: React.FC<EidFestivalsViewProps> = ({
  eidEvents,
  isAdmin,
  onAddExpense,
  onDeleteExpense,
  onUpdateBudget,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<'eid_ul_fitr' | 'eid_ul_adha'>('eid_ul_fitr');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Form states for new expense
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EidExpenseItem['category']>('food');
  const [amount, setAmount] = useState<number | ''>('');
  const [voucherNo, setVoucherNo] = useState('');
  const [notes, setNotes] = useState('');
  const [budgetInput, setBudgetInput] = useState<number | ''>('');

  const currentEvent = eidEvents.find((e) => e.id === selectedEventId) || eidEvents[0];

  const totalSpent = currentEvent.expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const remainingBudget = currentEvent.totalBudget - totalSpent;

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || amount <= 0) return;

    onAddExpense(selectedEventId, {
      title: title.trim(),
      category,
      amount: Number(amount),
      voucherNo: voucherNo.trim() || `V-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      notes: notes.trim(),
    });

    setTitle('');
    setAmount('');
    setVoucherNo('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (budgetInput && budgetInput > 0) {
      onUpdateBudget(selectedEventId, Number(budgetInput));
      setIsBudgetModalOpen(false);
    }
  };

  const categoryLabels: Record<string, { label: string; color: string }> = {
    food: { label: 'খাবার ও মহাভোজ', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    sound: { label: 'সাউন্ড ও প্যান্ডেল', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    gifts: { label: 'উপহার ও সালামি', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    qurbani: { label: 'কোরবানি ও বিতরণ', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    decoration: { label: 'মঞ্চ ও ডেকোরেশন', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    entertainment: { label: 'বিনোদন ও ক্রীড়া', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    other: { label: 'অন্যান্য আনুষঙ্গিক', color: 'bg-stone-100 text-stone-800 border-stone-200' },
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Moon className="w-3.5 h-3.5 text-amber-300" />
            <span>বাৎসরিক দুই ঈদের মহা-অনুষ্ঠান ও বাজেট</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            পবিত্র ঈদুল ফিতর ও ঈদুল আজহা পারিবারিক মহোৎসব
          </h2>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            মোল্লা পরিবারের সব শাখা ও প্রজন্মের সদস্যদের নিয়ে দুই ঈদে আয়োজন করা হয় বিশেষ মিলনমেলা, আপ্যায়ন ও কোরবানি বণ্টন। এখানে আয়োজনের যাবতীয় খরচ ও বাজেটের স্বচ্ছ হিসাব লিপিবদ্ধ রয়েছে।
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400 text-stone-900 text-xs font-bold shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-900" />
                <span>আপনি অ্যাডমিন হিসেবে খরচের হিসাব সম্পাদনা করতে পারবেন</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-emerald-200 text-xs font-medium border border-white/10">
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>খরচের হিসাব ও বাজেট শুধুমাত্র প্রধান অ্যাডমিন পরিবর্তন করতে পারেন</span>
              </span>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Tabs between Eid-ul-Fitr and Eid-ul-Adha */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex p-1 bg-stone-200/70 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setSelectedEventId('eid_ul_fitr')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              selectedEventId === 'eid_ul_fitr'
                ? 'bg-white text-emerald-900 shadow-md ring-1 ring-emerald-200'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>পবিত্র ঈদুল ফিতর</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
              {eidEvents.find((e) => e.id === 'eid_ul_fitr')?.expenses.length}টি খরচ
            </span>
          </button>

          <button
            onClick={() => setSelectedEventId('eid_ul_adha')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              selectedEventId === 'eid_ul_adha'
                ? 'bg-white text-emerald-900 shadow-md ring-1 ring-emerald-200'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Moon className="w-4 h-4 text-emerald-600" />
            <span>পবিত্র ঈদুল আজহা</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
              {eidEvents.find((e) => e.id === 'eid_ul_adha')?.expenses.length}টি খরচ
            </span>
          </button>
        </div>

        {isAdmin && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                setBudgetInput(currentEvent.totalBudget);
                setIsBudgetModalOpen(true);
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold shadow-xs transition-colors"
            >
              <DollarSign className="w-4 h-4 text-emerald-700" />
              <span>বাজেট আপডেট</span>
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm shadow-emerald-700/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন খরচ যুক্ত করুন</span>
            </button>
          </div>
        )}
      </div>

      {/* Event Details Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <span>{currentEvent.hijriYear}</span>
              <span>•</span>
              <span>{currentEvent.theme}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
              {currentEvent.title}
            </h3>
            <div className="flex flex-wrap items-center gap-4 mt-2.5 text-xs text-stone-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>{currentEvent.dateStr}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{currentEvent.venue}</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
              <span className="text-[11px] font-bold text-stone-500 uppercase block">
                ধার্যকৃত মোট বাজেট
              </span>
              <span className="text-lg font-bold text-stone-900">
                {formatTaka(currentEvent.totalBudget)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[11px] font-bold text-amber-700 uppercase block">
                এখন পর্যন্ত মোট খরচ
              </span>
              <span className="text-lg font-bold text-amber-900">
                {formatTaka(totalSpent)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase block">
                অবশিষ্ট উদ্বৃত্ত বাজেট
              </span>
              <span className={`text-lg font-bold ${remainingBudget >= 0 ? 'text-emerald-900' : 'text-red-700'}`}>
                {formatTaka(remainingBudget)}
              </span>
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <span>খরচের বিস্তারিত ভাউচার ও খাতসমূহ</span>
              <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full font-medium">
                {toBengaliNumerals(currentEvent.expenses.length)}টি আইটেম
              </span>
            </h4>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-700 text-xs font-bold uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">নং</th>
                  <th className="py-3 px-4">খরচের বিবরণ / খাত</th>
                  <th className="py-3 px-4">শ্রেণি / ক্যাটাগরি</th>
                  <th className="py-3 px-4">ভাউচার / মেমো</th>
                  <th className="py-3 px-4">তারিখ</th>
                  <th className="py-3 px-4 text-right">টাকার পরিমাণ (৳)</th>
                  {isAdmin && <th className="py-3 px-4 text-center">অ্যাকশন</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {currentEvent.expenses.map((expense, idx) => {
                  const cat = categoryLabels[expense.category] || categoryLabels.other;
                  return (
                    <tr key={expense.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs text-stone-500">
                        {toBengaliNumerals(idx + 1)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900">{expense.title}</div>
                        {expense.notes && (
                          <div className="text-xs text-stone-500 mt-0.5">{expense.notes}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cat.color}`}>
                          {cat.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-stone-600">
                        {expense.voucherNo || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-stone-600">
                        {expense.date}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-stone-900">
                        {formatTaka(expense.amount)}
                      </td>
                      {isAdmin && (
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => onDeleteExpense(selectedEventId, expense.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="মুছে ফেলুন"
                            aria-label="খরচ মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-stone-50/90 font-bold border-t border-stone-200">
                <tr>
                  <td colSpan={5} className="py-3.5 px-4 text-right text-stone-700">
                    সর্বমোট ব্যয়:
                  </td>
                  <td className="py-3.5 px-4 text-right text-base text-emerald-800">
                    {formatTaka(totalSpent)}
                  </td>
                  {isAdmin && <td></td>}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Add Expense Modal (Admin Only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold">
                  {currentEvent.title} - নতুন খরচ যোগ করুন
                </h4>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  খরচের খাত / শিরোনাম
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: খাসির মাংস ক্রয় ও বাবুর্চি খরচ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                  >
                    <option value="food">খাবার ও মহাভোজ</option>
                    <option value="sound">সাউন্ড ও প্যান্ডেল</option>
                    <option value="gifts">উপহার ও সালামি</option>
                    <option value="qurbani">কোরবানি ও মাংস বণ্টন</option>
                    <option value="decoration">মঞ্চ ও ডেকোরেশন</option>
                    <option value="entertainment">বিনোদন ও খেলাধূলা</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    টাকার পরিমাণ (৳)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="যেমন: ৩০০০"
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    ভাউচার / মেমো নং (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={voucherNo}
                    onChange={(e) => setVoucherNo(e.target.value)}
                    placeholder="যেমন: V-EID-108"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    তারিখ
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  অতিরিক্ত বিবরণ / নোট
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="বাজারের দোকান বা খরচের বিস্তারিত তথ্য..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md"
              >
                খরচ সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Update Budget Modal (Admin Only) */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <h4 className="font-bold text-base text-stone-900">
              {currentEvent.title} এর মোট বাজেট আপডেট
            </h4>
            <form onSubmit={handleBudgetSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1">
                  নতুন বাজেট নির্ধারণ করুন (৳)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-bold text-emerald-800"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
