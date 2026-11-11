import React, { useState } from 'react';
import {
  HeartHandshake,
  CheckCircle,
  Clock,
  Send,
  ShieldCheck,
  AlertCircle,
  FileText,
  User,
  Phone,
  DollarSign,
  Activity,
  GraduationCap,
  Sparkles,
  Search,
} from 'lucide-react';
import { KalyanTrustAid } from '../types.ts';
import { formatTaka, toBengaliNumerals } from '../utils/finance.ts';

interface KalyanTrustViewProps {
  aids: KalyanTrustAid[];
  isAdmin: boolean;
  onApplyAid: (aid: Omit<KalyanTrustAid, 'id' | 'status' | 'applicationDate'>) => void;
  onDisburseAid: (aidId: string, grantedAmount: number, reviewNotes: string) => void;
  onRejectAid: (aidId: string, reviewNotes: string) => void;
}

export const KalyanTrustView: React.FC<KalyanTrustViewProps> = ({
  aids,
  isAdmin,
  onApplyAid,
  onDisburseAid,
  onRejectAid,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'transparency' | 'apply' | 'adminReview'>('transparency');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Application form state
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [relationOrBranch, setRelationOrBranch] = useState('');
  const [problemCategory, setProblemCategory] = useState<KalyanTrustAid['problemCategory']>('medical');
  const [problemTitle, setProblemTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requestedAmount, setRequestedAmount] = useState<number | ''>('');
  const [payoutMethod, setPayoutMethod] = useState('bKash');
  const [accountNumber, setAccountNumber] = useState('');
  const [showApplySuccess, setShowApplySuccess] = useState(false);

  // Admin action state
  const [reviewingAidId, setReviewingAidId] = useState<string | null>(null);
  const [grantedAmountInput, setGrantedAmountInput] = useState<number | ''>('');
  const [reviewNoteInput, setReviewNoteInput] = useState('');

  const disbursedList = aids.filter((a) => a.status === 'disbursed');
  const pendingList = aids.filter((a) => a.status === 'pending');

  const totalDisbursedAmount = disbursedList.reduce(
    (sum, a) => sum + (a.grantedAmount || a.requestedAmount || 0),
    0
  );

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !requestedAmount || requestedAmount <= 0) return;

    onApplyAid({
      applicantName: applicantName.trim(),
      applicantPhone: applicantPhone.trim(),
      relationOrBranch: relationOrBranch.trim() || 'মোল্লা পরিবার শাখা',
      problemCategory,
      problemTitle: problemTitle.trim() || 'জরুরি সহায়তা প্রয়োজন',
      description: description.trim(),
      requestedAmount: Number(requestedAmount),
      payoutMethod: `${payoutMethod} (${accountNumber.trim() || 'প্রযোজ্য নয়'})`,
      accountNumber: accountNumber.trim(),
      isPubliclyShown: true,
    });

    setShowApplySuccess(true);
    setApplicantName('');
    setApplicantPhone('');
    setRelationOrBranch('');
    setProblemTitle('');
    setDescription('');
    setRequestedAmount('');
    setAccountNumber('');

    setTimeout(() => {
      setShowApplySuccess(false);
      setActiveSubTab('transparency');
    }, 2500);
  };

  const handleDisburseConfirm = (aid: KalyanTrustAid) => {
    const grant = Number(grantedAmountInput) || aid.requestedAmount;
    onDisburseAid(
      aid.id,
      grant,
      reviewNoteInput.trim() || 'অ্যাডমিন কর্তৃক যাচাই শেষে সাহায্য অনুমোদন ও অর্থ ছাড়।'
    );
    setReviewingAidId(null);
    setGrantedAmountInput('');
    setReviewNoteInput('');
  };

  const categoryLabels: Record<string, { label: string; icon: any; color: string }> = {
    medical: { label: 'চিকিৎসা ও অসুস্থতা', icon: Activity, color: 'bg-rose-100 text-rose-800 border-rose-200' },
    education: { label: 'শিক্ষা ও পড়াশোনা', icon: GraduationCap, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    emergency_relief: { label: 'জরুরি বিপদ ও দুর্যোগ', icon: AlertCircle, color: 'bg-amber-100 text-amber-800 border-amber-200' },
    marriage: { label: 'কন্যা বিবাহ সহায়তা', icon: HeartHandshake, color: 'bg-purple-100 text-purple-800 border-purple-200' },
    business_support: { label: 'স্বাবলম্বী ক্ষুদ্র উদ্যোগ', icon: Sparkles, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    other: { label: 'অন্যান্য সহায়তা', icon: FileText, color: 'bg-stone-100 text-stone-800 border-stone-200' },
  };

  const filteredDisbursed = disbursedList.filter((item) => {
    const matchesSearch =
      item.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.relationOrBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.problemTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || item.problemCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-900 via-emerald-900 to-stone-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold mb-3">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
            <span>মোল্লা পরিবার ঐক্য ও কল্যাণ তহবিল</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            মোল্লা পরিবার কল্যাণ ট্রাস্ট
          </h2>
          <p className="mt-2 text-sm sm:text-base text-teal-100/90 leading-relaxed">
            আমাদের পরিবারের মধ্যে বা গুষ্টির মধ্যে কেউ যদি কোনো সমস্যা বা অসুস্থতায় পড়ে, তবে আমরা আমাদের ট্রাস্টের তহবিল থেকে তাৎক্ষণিক সহায়তা প্রদান করি। কাকে কত টাকা সাহায্য করা হয়েছে তা সম্পূর্ণ স্বচ্ছতার সাথে এখানে লিপিবদ্ধ থাকে।
          </p>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] text-teal-200 block uppercase font-bold">
                মোট সাহায্য বিতরণ
              </span>
              <span className="text-lg sm:text-xl font-bold text-white">
                {formatTaka(totalDisbursedAmount)}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
              <span className="text-[11px] text-teal-200 block uppercase font-bold">
                সাহায্যপ্রাপ্ত পরিবার সংখ্যা
              </span>
              <span className="text-lg sm:text-xl font-bold text-emerald-300">
                {toBengaliNumerals(disbursedList.length)} টি পরিবার
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-teal-200 block uppercase font-bold">
                পর্যালোচনায় অপেক্ষমাণ
              </span>
              <span className="text-lg sm:text-xl font-bold text-amber-300">
                {toBengaliNumerals(pendingList.length)} টি আবেদন
              </span>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Sub-nav Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex p-1 bg-stone-200/70 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveSubTab('transparency')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'transparency'
                ? 'bg-white text-emerald-900 shadow-md ring-1 ring-emerald-200'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>সাহায্যপ্রাপ্তদের তালিকা ({toBengaliNumerals(disbursedList.length)})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('apply')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'apply'
                ? 'bg-white text-emerald-900 shadow-md ring-1 ring-emerald-200'
                : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            <Send className="w-4 h-4 text-teal-600" />
            <span>সাহায্যের জন্য আবেদন ফরম</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setActiveSubTab('adminReview')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeSubTab === 'adminReview'
                  ? 'bg-white text-emerald-900 shadow-md ring-1 ring-emerald-200'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>আবেদন অনুমোদন প্যানেল ({toBengaliNumerals(pendingList.length)})</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Transparency List Tab */}
      {activeSubTab === 'transparency' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="নাম বা সমস্যা দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                সব খাত
              </button>
              {Object.entries(categoryLabels).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === key
                      ? 'bg-emerald-800 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid of Disbursed Aids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDisbursed.map((aid) => {
              const cat = categoryLabels[aid.problemCategory] || categoryLabels.other;
              const Icon = cat.icon;
              return (
                <div
                  key={aid.id}
                  className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cat.color}`}>
                            {cat.label}
                          </span>
                          <span className="text-[11px] text-stone-500 font-medium">
                            তারিখ: {aid.disbursedDate || aid.applicationDate}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-stone-900 mt-1">
                          {aid.applicantName}
                        </h4>
                        <p className="text-xs text-stone-500">
                          {aid.relationOrBranch}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-stone-400 block">
                        প্রদত্ত সাহায্য
                      </span>
                      <span className="text-lg font-bold text-emerald-800">
                        {formatTaka(aid.grantedAmount || aid.requestedAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
                    <div className="font-semibold text-xs text-stone-800">
                      বিষয়: {aid.problemTitle}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {aid.description}
                    </p>

                    {aid.reviewNotes && (
                      <div className="p-2.5 rounded-xl bg-stone-50 text-[11px] text-stone-600 border border-stone-200">
                        <strong className="text-stone-800">ট্রাস্টের সিদ্ধান্ত: </strong>
                        {aid.reviewNotes}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500">
                    <span>প্রদানের মাধ্যম: {aid.payoutMethod || 'সরাসরি হস্তান্তর'}</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>অর্থ ছাড়কৃত</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDisbursed.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-stone-800">
                বর্তমানে এখনো কাউকে সাহায্য প্রদান করা হয়নি
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                মোল্লা পরিবারের কোনো সদস্য বা আত্মীয় যদি অসুস্থতা, চিকিৎসা অথবা অন্য কোনো সংকটে পড়েন, তবে নিচের <strong>'সাহায্যের জন্য আবেদন ফরম'</strong> পূরণ করে ট্রাস্টে সাহায্যের আবেদন করতে পারেন।
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveSubTab('apply')}
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  সাহায্যের জন্য আবেদন করুন
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Assistance Application Form */}
      {activeSubTab === 'apply' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs max-w-2xl mx-auto">
          <div className="text-center max-w-md mx-auto mb-6">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-3">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              জরুরি আর্থিক সাহায্যের আবেদন
            </h3>
            <p className="text-xs text-stone-600 mt-1">
              মোল্লা পরিবারের যে কোনো সদস্য বা আত্মীয় বিপদে পড়লে নিঃসঙ্কোচে আবেদন করতে পারেন। আপনার আবেদনটি ট্রাস্ট কমিটি ও প্রধান অ্যাডমিন গোপনে ও দ্রুততার সাথে পর্যালোচনা করবেন।
            </p>
          </div>

          {showApplySuccess ? (
            <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-emerald-900">
                আপনার আবেদনটি সফলভাবে গৃহীত হয়েছে!
              </h4>
              <p className="text-xs text-emerald-700">
                ট্রাস্ট কমিটি ও অ্যাডমিন দ্রুতই আপনার সাথে যোগাযোগ করবেন।
              </p>
            </div>
          ) : (
            <form onSubmit={handleApplicationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    আবেদনকারীর পুরো নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="যেমন: মোঃ রফিকুল ইসলাম"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="০১৭১১-XXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    পারিবারিক শাখা / ঠিকানা *
                  </label>
                  <input
                    type="text"
                    required
                    value={relationOrBranch}
                    onChange={(e) => setRelationOrBranch(e.target.value)}
                    placeholder="যেমন: পশ্চিম পাড়া শাখা / আব্দুর রহিম মোল্লার নাতি"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    সমস্যার ধরন / ক্যাটাগরি *
                  </label>
                  <select
                    value={problemCategory}
                    onChange={(e) => setProblemCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                  >
                    <option value="medical">চিকিৎসা ও অসুস্থতা (Medical)</option>
                    <option value="education">শিক্ষা ও পড়াশোনা (Education)</option>
                    <option value="emergency_relief">জরুরি বিপদ ও দুর্যোগ (Relief)</option>
                    <option value="marriage">কন্যা বিবাহ সহায়তা (Marriage)</option>
                    <option value="business_support">স্বাবলম্বী ক্ষুদ্র উদ্যোগ</option>
                    <option value="other">অন্যান্য সমস্যা</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  সমস্যার সংক্ষিপ্ত শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={problemTitle}
                  onChange={(e) => setProblemTitle(e.target.value)}
                  placeholder="যেমন: হার্টের রিং পরানো বা চোখের অপারেশন খরচ"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  সমস্যা ও পরিস্থিতির বিস্তারিত বিবরণ *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="রোগীর বর্তমান অবস্থা, ডাক্তারের পরামর্শ, প্রয়োজনীয় খরচ ও আপনার পরিবারের আর্থিক সীমাবদ্ধতার বিবরণ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    প্রয়োজনীয় সাহায্যের পরিমাণ (৳) *
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    required
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="যেমন: ১৫০০০"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    অর্থ গ্রহণের মাধ্যম
                  </label>
                  <select
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white"
                  >
                    <option value="bKash">বিকাশ (bKash)</option>
                    <option value="Nagad">নগদ (Nagad)</option>
                    <option value="Rocket">রকেট (Rocket)</option>
                    <option value="Bank">ব্যাংক অ্যাকাউন্ট</option>
                    <option value="Cash">সরাসরি হাতে নগদ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    অ্যাকাউন্ট / মোবাইল নম্বর
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="নম্বর লিখুন"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-800 hover:from-teal-800 hover:to-emerald-900 text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>সাহায্যের আবেদন জমা দিন</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* 3. Admin Review Tab */}
      {activeSubTab === 'adminReview' && isAdmin && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <span>বিচারাধীন আবেদনসমূহ ({toBengaliNumerals(pendingList.length)})</span>
            </h3>
            <span className="text-xs text-stone-500">
              অনুমোদনের সাথে সাথে অর্থ মেইন ব্যালেন্স থেকে স্বয়ংক্রিয়ভাবে বাদ হবে
            </span>
          </div>

          {pendingList.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="text-stone-700 font-bold">বর্তমানে কোনো নতুন আবেদন অপেক্ষমাণ নেই।</p>
              <p className="text-xs text-stone-500">সকল আবেদন সফলভাবে নিষ্পত্তি করা হয়েছে।</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingList.map((aid) => (
                <div
                  key={aid.id}
                  className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          অপেক্ষমাণ আবেদন
                        </span>
                        <span className="text-xs text-stone-500">
                          আবেদনের তারিখ: {aid.applicationDate}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-stone-900 mt-1">
                        {aid.applicantName} ({aid.applicantPhone})
                      </h4>
                      <p className="text-xs text-stone-600">
                        {aid.relationOrBranch} • বিষয়: <strong>{aid.problemTitle}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-stone-500 block uppercase">
                        দাবীকৃত পরিমাণ
                      </span>
                      <span className="text-xl font-bold text-rose-700">
                        {formatTaka(aid.requestedAmount)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-stone-700 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    {aid.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-stone-500">
                      পেমেন্ট রিকোয়েস্ট: {aid.payoutMethod}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRejectAid(aid.id, 'দুঃখিত, ট্রাস্টের নীতিমালা অনুসারে আবেদনটি গৃহীত হয়নি।')}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200"
                      >
                        প্রত্যাখ্যান করুন
                      </button>

                      <button
                        onClick={() => {
                          setReviewingAidId(aid.id);
                          setGrantedAmountInput(aid.requestedAmount);
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs"
                      >
                        অনুমোদন ও অর্থ ছাড় করুন
                      </button>
                    </div>
                  </div>

                  {/* Inline Disburse Box */}
                  {reviewingAidId === aid.id && (
                    <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                      <h5 className="font-bold text-xs text-emerald-950">
                        অর্থ ছাড় নিশ্চিতকরণ
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                            অনুমোদিত টাকার পরিমাণ (৳)
                          </label>
                          <input
                            type="number"
                            value={grantedAmountInput}
                            onChange={(e) => setGrantedAmountInput(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-lg border border-emerald-300 text-sm font-bold bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                            পর্যালোচনা মন্তব্য
                          </label>
                          <input
                            type="text"
                            placeholder="যেমন: রোগীর প্রেসক্রিপশন যাচাই সাপেক্ষে ছাড়কৃত"
                            value={reviewNoteInput}
                            onChange={(e) => setReviewNoteInput(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-emerald-300 text-sm bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setReviewingAidId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-200 text-stone-700"
                        >
                          বাতিল
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDisburseConfirm(aid)}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-800 text-white"
                        >
                          হ্যাঁ, অর্থ প্রদান করুন (মেইন ব্যালেন্স থেকে কর্তন হবে)
                        </button>
                      </div>
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
};
