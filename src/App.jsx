import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, CheckCircle, Clock, AlertCircle, DollarSign, Calendar, 
  BookOpen, Plus, Trash2, Edit, Save, X, Search, Filter, Phone, Mail, 
  TrendingUp, Award, Smile, ChevronRight, LogOut, Settings, Bell, RefreshCw
} from 'lucide-react';

export default function App() {
  // --- States ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data States (with LocalStorage)
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('nursery_students');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'أحمد محمد', age: '4 سنوات', class: 'الزهور', parentPhone: '0501234567', status: 'حاضر', feeStatus: 'مدفوع' },
      { id: 2, name: 'سارة خالد', age: '3 سنوات', class: 'البراعم', parentPhone: '0507654321', status: 'غائب', feeStatus: 'معلق' },
      { id: 3, name: 'عمر علي', age: '5 سنوات', class: 'النجوم', parentPhone: '0551122334', status: 'حاضر', feeStatus: 'مدفوع' },
      { id: 4, name: 'مريم حسن', age: '4 سنوات', class: 'الزهور', parentPhone: '0549988776', status: 'غائب', feeStatus: 'معلق' },
      { id: 5, name: 'يوسف محمود', age: '3 سنوات', class: 'البراعم', parentPhone: '0563344556', status: 'حاضر', feeStatus: 'مدفوع' }
    ];
  });

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('nursery_staff');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'فاطمة الزهراء', role: 'معلمة لغة عربية', phone: '0501112233', salary: '4000' },
      { id: 2, name: 'سارة سمير', role: 'معلمة لغة إنجليزية', phone: '0504455667', salary: '4500' }
    ];
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('nursery_activities');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'نشاط الرسم والتلوين', class: 'الزهور', time: '09:00 صباحاً', type: 'إنجاز' },
      { id: 2, title: 'وجبة الإفطار الجماعية', class: 'جميع الفصول', time: '10:30 صباحاً', type: 'وجبات' },
      { id: 3, title: 'قراءة قصة تعليمية', class: 'البراعم', time: '11:30 صباحاً', type: 'سلوك' }
    ];
  });

  // Modals States
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', class: 'الزهور', parentPhone: '', feeStatus: 'معلق' });

  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', phone: '', salary: '' });

  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: '', class: 'الزهور', time: '', type: 'إنجاز' });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('nursery_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('nursery_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('nursery_activities', JSON.stringify(activities));
  }, [activities]);

  // Handlers
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name) return;
    setStudents([...students, { ...newStudent, id: Date.now(), status: 'غائب' }]);
    setNewStudent({ name: '', age: '', class: 'الزهور', parentPhone: '', feeStatus: 'معلق' });
    setShowAddStudent(false);
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name) return;
    setStaff([...staff, { ...newStaff, id: Date.now() }]);
    setNewStaff({ name: '', role: '', phone: '', salary: '' });
    setShowAddStaff(false);
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivity.title) return;
    setActivities([...activities, { ...newActivity, id: Date.now() }]);
    setNewActivity({ title: '', class: 'الزهور', time: '', type: 'إنجاز' });
    setShowAddActivity(false);
  };

  const toggleAttendance = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: s.status === 'حاضر' ? 'غائب' : 'حاضر' } : s));
  };

  const toggleFeeStatus = (id) => {
    setStudents(students.map(s => s.id === id ? { ...s, feeStatus: s.feeStatus === 'مدفوع' ? 'معلق' : 'مدفوع' } : s));
  };

  const deleteStudent = (id) => setStudents(students.filter(s => s.id !== id));
  const deleteStaff = (id) => setStaff(staff.filter(s => s.id !== id));
  const deleteActivity = (id) => setActivities(activities.filter(a => a.id !== id));

  // Stats Calculations
  const totalStudents = students.length;
  const presentCount = students.filter(s => s.status === 'حاضر').length;
  const pendingFeesCount = students.filter(s => s.feeStatus === 'معلق').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans dir-rtl" dir="rtl">
      
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
              <Smile className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">حضانة الأمل الخاصة ثنائية اللغة - بصنبو</h1>
              <p className="text-xs text-indigo-200">نظام الإدارة والرصد اليومي الشامل</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-indigo-100 transition">
              <Bell className="w-5 h-5" />
            </button>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold">إدارة الحضانة</p>
              <p className="text-xs text-indigo-200">المشرف العام</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {[
              { id: 'dashboard', label: 'لوحة التحكم', icon: TrendingUp },
              { id: 'students', label: 'الأطفال والطلاب', icon: Users },
              { id: 'attendance', label: 'سجل الحضور', icon: CheckCircle },
              { id: 'fees', label: 'الرسوم والماليات', icon: DollarSign },
              { id: 'activities', label: 'الأنشطة اليومية', icon: Calendar },
              { id: 'staff', label: 'طاقم العمل', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Dynamic Content Area */}
        <main className="lg:col-span-4 space-y-6">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-6
