import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Heart,
  Droplet,
  Phone,
  Briefcase,
  GraduationCap,
  Home,
  CheckCircle2,
  X,
  UserCheck,
} from 'lucide-react';
import { FamilyMember, BloodGroup, RelationType } from '../types.ts';
import { toBengaliNumerals, aggregateFamilyCensus } from '../utils/finance.ts';

interface FamilyDirectoryViewProps {
  members: FamilyMember[];
  onAddMember: (member: Omit<FamilyMember, 'id'>) => void;
  isAdmin: boolean;
}

export const FamilyDirectoryView: React.FC<FamilyDirectoryViewProps> = ({
  members,
  onAddMember,
  isAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('all');
  const [selectedRelation, setSelectedRelation] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Member Form State
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [relationType, setRelationType] = useState<RelationType>('son');
  const [age, setAge] = useState<number | ''>('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [address, setAddress] = useState('');
  const [branch, setBranch] = useState('প্রধান খানা');

  // Compute Census Stats
  const census = aggregateFamilyCensus(members);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !age) return;

    onAddMember({
      name: name.trim(),
      gender,
      relationType,
      age: Number(age),
      bloodGroup,
      phone: phone.trim() || '০১৭০০-০০০০০০',
      occupation: occupation.trim() || 'ব্যবসায়ী / শিক্ষার্থী',
      education: education.trim() || 'শিক্ষাগত যোগ্যতা',
      fatherName: fatherName.trim() || 'পিতার নাম',
      motherName: motherName.trim() || 'মাতার নাম',
      address: address.trim() || 'মোল্লা বাড়ি',
      branch: branch.trim() || 'মূল শাখা',
    });

    // Reset
    setName('');
    setAge('');
    setPhone('');
    setOccupation('');
    setEducation('');
    setFatherName('');
    setMotherName('');
    setAddress('');
    setIsAddModalOpen(false);
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      m.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.fatherName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = selectedGender === 'all' || m.gender === selectedGender;
    const matchesBlood = selectedBloodGroup === 'all' || m.bloodGroup === selectedBloodGroup;
    const matchesRelation =
      selectedRelation === 'all' ||
      (selectedRelation === 'parents' && (m.relationType === 'father' || m.relationType === 'mother')) ||
      (selectedRelation === 'sons' && m.relationType === 'son') ||
      (selectedRelation === 'daughters' && m.relationType === 'daughter') ||
      (selectedRelation === 'seniors' && (m.relationType === 'senior' || m.age >= 60));

    return matchesSearch && matchesGender && matchesBlood && matchesRelation;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5 text-amber-300" />
            <span>পারিবারিক বংশলতিকা ও পূর্ণাঙ্গ সদস্য ডিরেক্টরি</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            মোল্লা পরিবারের সদস্য পরিসংখ্যান ও ডিরেক্টরি
          </h2>
          <p className="mt-2 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            পরিবারের কতজন ছেলে, কতজন মেয়ে, কতজন পিতা-মাতা ও প্রবীণ মুরব্বি রয়েছেন এবং প্রত্যেকের নাম, বয়স ও রক্তের গ্রুপের সম্পূর্ণ নির্ভরযোগ্য ডেটাবেজ।
          </p>

          <div className="mt-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-emerald-950" />
              <span>নতুন পারিবারিক সদস্য যুক্ত করুন</span>
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Requested Census Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Members */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase">মোট সদস্য</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
            {toBengaliNumerals(census.totalMembers)} জন
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">মোল্লা বংশের সদস্য</span>
        </div>

        {/* Total Males / Sons */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 uppercase">ছেলে / পুরুষ</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 mt-2">
            {toBengaliNumerals(census.maleCount)} জন
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">পরিবারের ছেলে সন্তান</span>
        </div>

        {/* Total Females / Daughters */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 uppercase">মেয়ে / নারী</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-900 mt-2">
            {toBengaliNumerals(census.femaleCount)} জন
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">পরিবারের কন্যা সন্তান</span>
        </div>

        {/* Total Parents / Guardians */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase">পিতা-মাতা</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-2">
            {toBengaliNumerals(census.parentsCount)} জন
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">সম্মানিত অভিভাবক</span>
        </div>

        {/* Seniors */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase">প্রবীণ মুরব্বি</span>
            <Heart className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-2">
            {toBengaliNumerals(census.seniorsCount)} জন
          </div>
          <span className="text-[11px] text-stone-400 mt-0.5 block">৬০ বছরের ঊর্ধ্ব জ্যেষ্ঠ</span>
        </div>
      </div>

      {/* Emergency Blood Bank & Donor Quick Finder */}
      <div className="bg-gradient-to-r from-rose-50 to-red-50/50 p-5 rounded-3xl border border-rose-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center">
              <Droplet className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-950">
                পারিবারিক জরুরি ব্লাড ব্যাংক (রক্তের গ্রুপ তালিকা)
              </h4>
              <p className="text-xs text-rose-700">
                বিপদে যেকোনো গ্রুপের রক্তের প্রয়োজনে সদস্য নির্বাচন করে সরাসরি ফোন করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedBloodGroup('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedBloodGroup === 'all'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-white text-rose-800 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              সব গ্রুপ
            </button>
            {(['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'] as BloodGroup[]).map((group) => {
              const count = census.bloodGroupsCount[group] || 0;
              const isSelected = selectedBloodGroup === group;
              return (
                <button
                  key={group}
                  onClick={() => setSelectedBloodGroup(isSelected ? 'all' : group)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-rose-700 text-white shadow-xs scale-105'
                      : 'bg-white text-rose-900 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  <span>{group}</span>
                  <span className="text-[10px] px-1 rounded-full bg-rose-100 text-rose-800">
                    {toBengaliNumerals(count)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="নাম, ফোন, পেশা বা পিতার নাম দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              <button
                onClick={() => setSelectedGender('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  selectedGender === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                উভয়
              </button>
              <button
                onClick={() => setSelectedGender('male')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  selectedGender === 'male'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                ছেলে ({toBengaliNumerals(census.maleCount)})
              </button>
              <button
                onClick={() => setSelectedGender('female')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  selectedGender === 'female'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                মেয়ে ({toBengaliNumerals(census.femaleCount)})
              </button>
            </div>

            <select
              value={selectedRelation}
              onChange={(e) => setSelectedRelation(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white"
            >
              <option value="all">সকল সম্পর্ক</option>
              <option value="parents">পিতা-মাতা (অভিভাবক)</option>
              <option value="sons">ছেলে সন্তান</option>
              <option value="daughters">কন্যা সন্তান</option>
              <option value="seniors">প্রবীণ মুরব্বি</option>
            </select>
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${
                        member.gender === 'male'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {member.name.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-stone-900 leading-snug">
                        {member.name}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {member.branch} • {member.relationType === 'father' ? 'পিতা' : member.relationType === 'mother' ? 'মাতা' : member.relationType === 'son' ? 'ছেলে' : member.relationType === 'daughter' ? 'মেয়ে' : member.relationType === 'senior' ? 'প্রবীণ মুরব্বি' : 'সদস্য'}
                      </p>
                    </div>
                  </div>

                  {/* Blood Group Badge */}
                  <div className="px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-extrabold text-xs flex items-center gap-1 shadow-xs">
                    <Droplet className="w-3 h-3 fill-rose-600 text-rose-600" />
                    <span>{member.bloodGroup}</span>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="mt-4 space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3.5 rounded-2xl border border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-medium">বয়স:</span>
                    <span className="font-bold text-stone-800">{toBengaliNumerals(member.age)} বছর</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-medium">পিতার নাম:</span>
                    <span className="font-semibold text-stone-800">{member.fatherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-medium">মাতার নাম:</span>
                    <span className="font-semibold text-stone-800">{member.motherName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-medium">পেশা:</span>
                    <span className="text-stone-800">{member.occupation}</span>
                  </div>
                  {member.education && (
                    <div className="flex justify-between">
                      <span className="text-stone-400 font-medium">শিক্ষা:</span>
                      <span className="text-stone-800">{member.education}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-stone-400 font-medium">ঠিকানা:</span>
                    <span className="text-stone-800 truncate max-w-[180px]">{member.address}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Phone Action */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <a
                  href={`tel:${member.phone}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{member.phone}</span>
                </a>

                <span className="text-[11px] text-stone-400 font-medium">
                  আইডি: #{member.id.replace('mem-', '')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-stone-900">
              {members.length === 0 ? 'বর্তমানে কোনো সদস্যের তথ্য তালিকাভুক্ত নেই' : 'কোনো সদস্য পাওয়া যায়নি'}
            </h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              {members.length === 0
                ? 'পরিবার পাবলিক করার পর সকল সদস্য তাদের পরিবারের পিতা, মাতা, ছেলে ও মেয়েদের তথ্য এখানে আপডেট করতে পারবেন। এখনই আপনার পরিবারের সদস্যদের তথ্য যুক্ত করুন।'
                : 'আপনার অনুসন্ধানের সাথে মিল রেখে কোনো সদস্য পাওয়া যায়নি।'}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ পরিবারের সদস্য যুক্ত করুন</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add New Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <UserPlus className="w-5 h-5 text-emerald-300" />
                <h4 className="font-bold text-base">
                  মোল্লা পরিবারের নতুন সদস্য যোগ করুন
                </h4>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    পূর্ণ নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: মোঃ জাহিদ হাসান মোল্লা"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    লিঙ্গ (ছেলে / মেয়ে) *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                  >
                    <option value="male">ছেলে (পুরুষ)</option>
                    <option value="female">মেয়ে (নারী)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    সম্পর্ক / পদবী *
                  </label>
                  <select
                    value={relationType}
                    onChange={(e) => setRelationType(e.target.value as RelationType)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                  >
                    <option value="son">ছেলে</option>
                    <option value="daughter">মেয়ে</option>
                    <option value="father">পিতা</option>
                    <option value="mother">মাতা</option>
                    <option value="senior">প্রবীণ মুরব্বি</option>
                    <option value="guardian">অভিভাবক</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    বয়স (বছর) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="যেমন: ২৮"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    রক্তের গ্রুপ *
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white font-bold text-rose-700"
                  >
                    <option value="A+">A+ (এ পজিটিভ)</option>
                    <option value="B+">B+ (বি পজিটিভ)</option>
                    <option value="O+">O+ (ও পজিটিভ)</option>
                    <option value="AB+">AB+ (এবি পজিটিভ)</option>
                    <option value="A-">A- (এ নেগেটিভ)</option>
                    <option value="B-">B- (বি নেগেটিভ)</option>
                    <option value="O-">O- (ও নেগেটিভ)</option>
                    <option value="AB-">AB- (এবি নেগেটিভ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="০১৭১১-XXXXXX"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    পেশা / কর্মসংস্থান
                  </label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="যেমন: সফটওয়্যার ইঞ্জিনিয়ার / ব্যবসায়ী / শিক্ষার্থী"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    পিতার নাম
                  </label>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="পিতার নাম লিখুন"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    মাতার নাম
                  </label>
                  <input
                    type="text"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="মাতার নাম লিখুন"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    শিক্ষাগত যোগ্যতা (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="যেমন: বি.এসসি / এইচ.এস.সি"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                    পরিবারের খানা / শাখা
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="যেমন: পশ্চিম খানা / প্রধান খানা"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-1">
                  বর্তমান ও স্থায়ী ঠিকানা
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="যেমন: মোল্লা বাড়ি, থানা ও জেলা"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>সদস্য তথ্য ডাটাবেজে সংরক্ষণ করুন</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
