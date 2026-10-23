import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Baby, 
  School, 
  CalendarCheck, 
  Palette, 
  ClipboardList, 
  Wallet, 
  Users, 
  LogOut, 
  Plus, 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  BookOpen, 
  Music, 
  Menu,
  X,
  UserPlus,
  ChevronLeft,
  HeartHandshake
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initial Mock Data matching exact screenshot details & correct spelling "بصنبو"
  const [students, setStudents] = useState([
    { id: '1', name: 'محمد علي حسن محمد', classId: '1', className: 'فصل النحلات', guardian: 'علي حسن', phone: '01012345678', dob: '2021-05-12', feeStatus: 'معلق', amount: 1500, paid: 500 },
    { id: '2', name: 'يوسف عمر', classId: '1', className: 'فصل النحلات', guardian: 'عمر محمود', phone: '01122334455', dob: '2021-08-20', feeStatus: 'مدفوع', amount: 1500, paid: 1500 },
    { id: '3', name: 'أحمد محمد', classId: '2', className: 'فصل الأسود', guardian: 'محمد أحمد', phone: '01233445566', dob: '2020-11-03', feeStatus: 'مدفوع', amount: 1500, paid: 1500 },
    { id: '4', name: 'مريم محمود', classId: '2', className: 'فصل الأسود', guardian: 'محمود السعيد', phone: '01555667788', dob: '2021-01-15', feeStatus: 'مدفوع', amount: 1500, paid: 1500 },
    { id: '5', name: 'سارة خالد', classId: '3', className: 'فصل الزهور', guardian: 'خالد إبراهيم', phone: '01099887766', dob: '2022-02-10', feeStatus: 'مدفوع', amount: 1500, paid: 1500 },
  ]);

  const [classes] = useState([
    { id: '1', name: 'فصل النحلات', teacher: 'أ. أمل إبراهيم', capacity: 15, room: 'قاعة 101' },
    { id: '2', name: 'فصل الأسود', teacher: 'أ. فاطمة علي', capacity: 12, room: 'قاعة 102' },
    { id: '3', name: 'فصل الزهور', teacher: 'أ. نورة حسن', capacity: 10, room: 'قاعة 103' },
  ]);

  const [notes, setNotes] = useState([
    { id: '1', studentName: 'محمد علي حسن محمد', type: 'سلوك', text: 'محمد ضرب زميله النهاردة', date: '9 أكتوبر 2026', badgeBg: 'bg-[#e05638]', badgeText: 'text-white' },
    { id: '2', studentName: 'يوسف عمر', type: 'إنجاز', text: 'تعلم رسم الدائرة. أحسنت!', date: '9 أكتوبر 2026', badgeBg: 'bg-[#d94826]', badgeText: 'text-white' },
    { id: '3', studentName: 'أحمد محمد', type: 'وجبات', text: 'أكل وجبته كاملة اليوم وكان سعيداً', date: '9 أكتوبر 2026', badgeBg: 'bg-[#c2410c]', badgeText: 'text-white' },
  ]);

  const [activities, setActivities] = useState([
    { id: '1', title: 'الواجب', category: 'تعليمي · 9 أكتوبر 2026', icon: BookOpen, color: 'text-emerald-700 bg-emerald-50' },
    { id: '2', title: 'رسم وتلوين', category: 'فنون · فصل النحلات · 9 أكتوبر 2026', icon: Palette, color: 'text-amber-600 bg-amber-50' },
    { id: '3', title: 'حصة أناشيد', category: 'موسيقى · فصل الأسود · 9 أكتوبر 2026', icon: Music, color: 'text-purple-600 bg-purple-50' },
  ]);

  const [attendance, setAttendance] = useState({
    '1': 'غائب',
    '2': 'غائب',
    '3': 'غائب',
    '4': 'غائب',
    '5': 'غائب',
  });

  const [staff, setStaff] = useState([
    { id: '1', name: 'Mohamed Arafa', role: 'مدير', phone: '01000000000', status: 'نشط' },
    { id: '2', name: 'أمل إبراهيم', role: 'معلمة', phone: '01111111111', status: 'نشط' },
    { id: '3', name: 'فاطمة علي', role: 'معلمة', phone: '01222222222', status: 'نشط' },
    { id: '4', name: 'أمينة سالم', role: 'مشرفة', phone: '01555555555', status: 'نشط' },
  ]);

  // Modal Control States
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  // Form Field States
  const [newStudent, setNewStudent] = useState({ name: '', className: 'فصل النحلات', guardian: '', phone: '', amount: 1500 });
  const [newNote, setNewNote] = useState({ studentName: 'محمد علي حسن محمد', type: 'سلوك', text: '' });
  const [newActivity, setNewActivity] = useState({ title: '', category: 'تعليمي' });
  const [newUser, setNewUser] = useState({ name: '', role: 'معلمة', phone: '' });

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('الكل');

  // Stats Counters
  const totalStudents = students.length;
  const presentToday = Object.values(attendance).filter(status => status === 'حاضر').length;
  const pendingFees = students.filter(s => s.feeStatus === 'معلق').length;
  const todayActivities = activities.length;

  // Handlers
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name) return;
    const studentObj = {
      id: Date.now().toString(),
      name: newStudent.name,
      classId: '1',
      className: newStudent.className,
      guardian: newStudent.guardian,
      phone: newStudent.phone,
      feeStatus: 'معلق',
      amount: Number(newStudent.amount) || 1500,
      paid: 0
    };
    setStudents([...students, studentObj]);
    setNewStudent({ name: '', className: 'فصل النحلات', guardian: '', phone: '', amount: 1500 });
    setShowAddStudent(false);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.text) return;
    let badgeBg = 'bg-[#e05638]';
    if (newNote.type === 'إنجاز') badgeBg = 'bg-[#d94826]';
    if (newNote.type === 'وجبات') badgeBg = 'bg-[#c2410c]';
    if (newNote.type === 'صحة') badgeBg = 'bg-blue-600';

    const noteObj = {
      id: Date.now().toString(),
      studentName: newNote.studentName,
      type: newNote.type,
      text: newNote.text,
      date: 'اليوم',
      badgeBg
    };
    setNotes([noteObj, ...notes]);
    setNewNote({ studentName: students[0]?.name || '', type: 'سلوك', text: '' });
    setShowAddNote(false);
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivity.title) return;
    const actObj = {
      id: Date.now().toString(),
      title: newActivity.title,
      category: `${newActivity.category} · اليوم`,
      icon: BookOpen,
      color: 'text-orange-600 bg-orange-50'
    };
    setActivities([actObj, ...activities]);
    setNewActivity({ title: '', category: 'تعليمي' });
    setShowAddActivity(false);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.name) return;
    setStaff([...staff, { id: Date.now().toString(), name: newUser.name, role: newUser.role, phone: newUser.phone, status: 'نشط' }]);
    setNewUser({ name: '', role: 'معلمة', phone: '' });
    setShowAddUser(false);
  };

  const handleMarkPaid = (id) => {
    setStudents(students.map(s => {
      if (s.id === id) {
        return { ...s, feeStatus: 'مدفوع', paid: s.amount };
      }
      return s;
    }));
  };

  // Navigation Items matching the original sidebar
  const navItems = [
    { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'students', label: 'الأطفال', icon: Baby },
    { id: 'classes', label: 'الفصول', icon: School },
    { id: 'attendance', label: 'الحضور', icon: CalendarCheck },
    { id: 'activities', label: 'الأنشطة', icon: Palette },
    { id: 'notes', label: 'الملاحظات', icon: ClipboardList },
    { id: 'fees', label: 'الرسوم', icon: Wallet },
    { id: 'users', label: 'المستخدمون', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-800 flex flex-col md:flex-row font-sans dir-rtl" dir="rtl">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#e05638] flex items-center justify-center text-white font-bold text-xl shadow-sm">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-sm">حضانة الأمل الخاصة</h1>
            <p className="text-xs text-gray-500">ثنائية اللغة ، بصنبو</p>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-gray-600 rounded-xl hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Main Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 right-0 z-40 w-64 bg-white border-l border-gray-100 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:z-auto shadow-sm
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        <div>
          {/* Header & Title - Corrected Spelling: بصنبو */}
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#e05638] text-white flex items-center justify-center shadow-md shadow-orange-100">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-snug">حضانة الأمل الخاصة</h1>
              <p className="text-xs text-gray-500 font-medium">ثنائية اللغة ، بصنبو</p>
            </div>
          </div>

          {/* Navigation Options */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200
                    ${isActive 
                      ? 'bg-[#e05638] text-white shadow-md shadow-orange-200' 
                      : 'text-gray-600 hover:bg-orange-50/60 hover:text-[#e05638]'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card at bottom */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-gray-50/80 rounded-2xl p-3 flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-orange-100 text-[#e05638] font-bold flex items-center justify-center text-sm border border-orange-200">
                M
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900">Mohamed Arafa</p>
                <p className="text-[11px] text-gray-500">مدير</p>
              </div>
            </div>
            <button title="تسجيل الخروج" className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* MODULE 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Page Header */}
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">لوحة التحكم</h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1">نظرة عامة على حالة الحضانة اليوم</p>
            </div>

            {/* Stat Cards - Exact screenshot counts & icons */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1 */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">إجمالي الأطفال</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-2">{totalStudents}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center">
                  <Baby className="w-6 h-6" />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">الحاضرون اليوم</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-2">{presentToday}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-400 flex items-center justify-center">
                  <CalendarCheck className="w-6 h-6" />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">رسوم معلقة</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-2">{pendingFees}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
              </div>

              {/* Stat 4 */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">أنشطة اليوم</p>
                  <p className="text-3xl font-extrabold text-gray-900 mt-2">{todayActivities}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-400 flex items-center justify-center">
                  <Palette className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Notes & Activities Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Latest Notes Block */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-lg">أحدث الملاحظات</h3>
                  <button onClick={() => setActiveTab('notes')} className="text-xs text-gray-500 hover:text-[#e05638] flex items-center gap-1 font-semibold">
                    الكل <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-gray-50/80 p-4 rounded-2xl space-y-2 border border-gray-100/50">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-bold ${note.badgeBg} text-white`}>
                          {note.type}
                        </span>
                        <span className="font-bold text-sm text-gray-900">{note.studentName}</span>
                      </div>
                      <p className="text-xs text-gray-600 pr-1 leading-relaxed">{note.text}</p>
                      <p className="text-[11px] text-gray-400 text-left">{note.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Activities Block */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-lg">أحدث الأنشطة</h3>
                  <button onClick={() => setActiveTab('activities')} className="text-xs text-gray-500 hover:text-[#e05638] flex items-center gap-1 font-semibold">
                    الكل <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {activities.map((act) => {
                    const ActIcon = act.icon || Palette;
                    return (
                      <div key={act.id} className="bg-gray-50/80 p-4 rounded-2xl flex items-center justify-between border border-gray-100/50">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-gray-900">{act.title}</h4>
                          <p className="text-xs text-gray-500">{act.category}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${act.color}`}>
                          <ActIcon className="w-5 h-5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* MODULE 2: STUDENTS */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">إدارة الأطفال</h2>
                <p className="text-xs text-gray-500 mt-1">عرض وتسجيل بيانات جميع الأطفال بالحضانة</p>
              </div>
              <button 
                onClick={() => setShowAddStudent(true)}
                className="bg-[#e05638] text-white px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2 hover:bg-orange-600 transition shadow-sm"
              >
                <Plus className="w-4 h-4" /> إضافة طفل جديد
              </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-gray-400" />
                <input 
                  type="text"
                  placeholder="البحث باسم الطفل أو ولي الأمر..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638]"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={selectedClassFilter} 
                  onChange={(e) => setSelectedClassFilter(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638] font-medium"
                >
                  <option value="الكل">كل الفصول</option>
                  <option value="فصل النحلات">فصل النحلات</option>
                  <option value="فصل الأسود">فصل الأسود</option>
                  <option value="فصل الزهور">فصل الزهور</option>
                </select>
              </div>
            </div>

            {/* Student Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs">
                    <tr>
                      <th className="p-4 font-bold">اسم الطفل</th>
                      <th className="p-4 font-bold">الفصل</th>
                      <th className="p-4 font-bold">ولي الأمر</th>
                      <th className="p-4 font-bold">رقم الهاتف</th>
                      <th className="p-4 font-bold">حالة الرسوم</th>
                      <th className="p-4 font-bold">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {students
                      .filter(s => s.name.includes(searchTerm) || s.guardian.includes(searchTerm))
                      .filter(s => selectedClassFilter === 'الكل' || s.className === selectedClassFilter)
                      .map((st) => (
                        <tr key={st.id} className="hover:bg-gray-50/50 transition">
                          <td className="p-4 font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 text-[#e05638] flex items-center justify-center font-bold text-xs">
                              {st.name[0]}
                            </div>
                            {st.name}
                          </td>
                          <td className="p-4 text-gray-600">{st.className}</td>
                          <td className="p-4 text-gray-600">{st.guardian}</td>
                          <td className="p-4 text-gray-600 dir-ltr text-right">{st.phone}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              st.feeStatus === 'مدفوع' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {st.feeStatus}
                            </span>
                          </td>
                          <td className="p-4">
                            <button 
                              onClick={() => setActiveTab('attendance')} 
                              className="text-xs text-[#e05638] hover:underline font-semibold"
                            >
                              تسجيل حضور
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 3: CLASSES */}
        {activeTab === 'classes' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">الفصول الدراسية</h2>
              <p className="text-xs text-gray-500 mt-1">توزيع المعلمات والطلاب على الفصول</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {classes.map((cls) => {
                const count = students.filter(s => s.className === cls.name).length;
                return (
                  <div key={cls.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#e05638] flex items-center justify-center">
                        <School className="w-6 h-6" />
                      </div>
                      <span className="text-xs px-2.5 py-1 bg-gray-100 rounded-lg text-gray-600 font-medium">
                        {cls.room}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{cls.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">المعلمة المسؤول: <span className="font-semibold text-gray-700">{cls.teacher}</span></p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gray-50">
                      <div className="flex justify-between text-xs text-gray-500 font-medium">
                        <span>الاستيعاب</span>
                        <span>{count} / {cls.capacity} طفل</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-[#e05638] h-full rounded-full transition-all duration-300"
                          style={{ width: `${(count / cls.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODULE 4: ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">سجل الحضور والغياب اليومي</h2>
              <p className="text-xs text-gray-500 mt-1">تتبع حضور الطلاب لليوم ({new Date().toLocaleDateString('ar-EG')})</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <div className="divide-y divide-gray-100">
                {students.map((st) => (
                  <div key={st.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-gray-900">{st.name}</h4>
                      <p className="text-xs text-gray-500">{st.className}</p>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl">
                      <button
                        onClick={() => setAttendance({ ...attendance, [st.id]: 'حاضر' })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          attendance[st.id] === 'حاضر'
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> حاضر
                      </button>

                      <button
                        onClick={() => setAttendance({ ...attendance, [st.id]: 'غائب' })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          attendance[st.id] === 'غائب'
                            ? 'bg-red-500 text-white shadow-sm'
                            : 'text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> غائب
                      </button>

                      <button
                        onClick={() => setAttendance({ ...attendance, [st.id]: 'متأخر' })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                          attendance[st.id] === 'متأخر'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" /> متأخر
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODULE 5: ACTIVITIES */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">الأنشطة والفعاليات</h2>
                <p className="text-xs text-gray-500 mt-1">جدول الأنشطة التعليمية والترفيهية</p>
              </div>
              <button 
                onClick={() => setShowAddActivity(true)}
                className="bg-[#e05638] text-white px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2 hover:bg-orange-600 transition"
              >
                <Plus className="w-4 h-4" /> إضافة نشاط
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activities.map((act) => {
                const ActIcon = act.icon || Palette;
                return (
                  <div key={act.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${act.color}`}>
                      <ActIcon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-900">{act.title}</h4>
                      <p className="text-xs text-gray-500">{act.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODULE 6: NOTES */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">سجل الملاحظات والتقارير</h2>
                <p className="text-xs text-gray-500 mt-1">الملاحظات السلوكية والإنجازات اليومية</p>
              </div>
              <button 
                onClick={() => setShowAddNote(true)}
                className="bg-[#e05638] text-white px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2 hover:bg-orange-600 transition"
              >
                <Plus className="w-4 h-4" /> إضافة ملاحظة
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((nt) => (
                <div key={nt.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-white text-xs px-3 py-1 rounded-full font-bold ${nt.badgeBg}`}>
                      {nt.type}
                    </span>
                    <span className="text-xs text-gray-400">{nt.date}</span>
                  </div>
                  <h4 className="font-bold text-gray-900">{nt.studentName}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">{nt.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 7: FEES */}
        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">الرسوم والمستحقات المالية</h2>
              <p className="text-xs text-gray-500 mt-1">متابعة تحصيل الرسوم الدراسية للأطفال</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs">
                  <tr>
                    <th className="p-4 font-bold">اسم الطفل</th>
                    <th className="p-4 font-bold">المبلغ المطلوب</th>
                    <th className="p-4 font-bold">المبلغ المدفوع</th>
                    <th className="p-4 font-bold">الحالة</th>
                    <th className="p-4 font-bold">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900">{st.name}</td>
                      <td className="p-4 text-gray-600">{st.amount} ج.م</td>
                      <td className="p-4 text-gray-600">{st.paid} ج.م</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          st.feeStatus === 'مدفوع' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                        }`}>
                          {st.feeStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        {st.feeStatus === 'معلق' && (
                          <button 
                            onClick={() => handleMarkPaid(st.id)}
                            className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-xs font-semibold hover:bg-emerald-700 transition"
                          >
                            تأكيد الدفع
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 8: USERS */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">طاقم العمل والمستخدمون</h2>
                <p className="text-xs text-gray-500 mt-1">إدارة المعلمات والمشرفين والإداريين</p>
              </div>
              <button 
                onClick={() => setShowAddUser(true)}
                className="bg-[#e05638] text-white px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2 hover:bg-orange-600 transition"
              >
                <UserPlus className="w-4 h-4" /> إضافة مستخدم
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full text-right text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs">
                  <tr>
                    <th className="p-4 font-bold">الاسم</th>
                    <th className="p-4 font-bold">الدور</th>
                    <th className="p-4 font-bold">الهاتف</th>
                    <th className="p-4 font-bold">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {staff.map((usr) => (
                    <tr key={usr.id} className="hover:bg-gray-50/50">
                      <td className="p-4 font-bold text-gray-900">{usr.name}</td>
                      <td className="p-4 text-gray-600">{usr.role}</td>
                      <td className="p-4 text-gray-600 dir-ltr text-right">{usr.phone}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                          {usr.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD STUDENT */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-gray-900">إضافة طفل جديد</h3>
              <button onClick={() => setShowAddStudent(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">اسم الطفل الثلاثي</label>
                <input 
                  type="text" 
                  required
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">الفصل الدراسي</label>
                <select 
                  value={newStudent.className}
                  onChange={(e) => setNewStudent({...newStudent, className: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638]"
                >
                  <option value="فصل النحلات">فصل النحلات</option>
                  <option value="فصل الأسود">فصل الأسود</option>
                  <option value="فصل الزهور">فصل الزهور</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">اسم ولي الأمر</label>
                <input 
                  type="text"
                  required
                  value={newStudent.guardian}
                  onChange={(e) => setNewStudent({...newStudent, guardian: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">رقم الهاتف</label>
                <input 
                  type="tel" 
                  required
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638]"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-[#e05638] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition"
                >
                  حفظ البيانات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NOTE */}
      {showAddNote && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-gray-900">إضافة ملاحظة جديدة</h3>
              <button onClick={() => setShowAddNote(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">اختر الطفل</label>
                <select 
                  value={newNote.studentName}
                  onChange={(e) => setNewNote({...newNote, studentName: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638]"
                >
                  {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">نوع الملاحظة</label>
                <select 
                  value={newNote.type}
                  onChange={(e) => setNewNote({...newNote, type: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638]"
                >
                  <option value="سلوك">سلوك</option>
                  <option value="إنجاز">إنجاز</option>
                  <option value="وجبات">وجبات</option>
                  <option value="صحة">صحة</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">نص الملاحظة</label>
                <textarea 
                  required
                  rows="3"
                  value={newNote.text}
                  onChange={(e) => setNewNote({...newNote, text: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638]"
                ></textarea>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-[#e05638] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition"
                >
                  إضافة الملاحظة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ACTIVITY */}
      {showAddActivity && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-gray-900">إضافة نشاط جديد</h3>
              <button onClick={() => setShowAddActivity(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">عنوان النشاط</label>
                <input 
                  type="text" 
                  required
                  value={newActivity.title}
                  onChange={(e) => setNewActivity({...newActivity, title: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">التصنيف أو الفصل</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: تعليمي · فصل النحلات"
                  value={newActivity.category}
                  onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638]"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-[#e05638] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition"
                >
                  حفظ النشاط
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD USER */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-gray-900">إضافة مستخدم جديد</h3>
              <button onClick={() => setShowAddUser(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">الاسم الكامل</label>
                <input 
                  type="text" 
                  required
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">الدور / الوظيفة</label>
                <select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638]"
                >
                  <option value="معلمة">معلمة</option>
                  <option value="مشرفة">مشرفة</option>
                  <option value="مدير">مدير</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">رقم الهاتف</label>
                <input 
                  type="tel" 
                  required
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="w-full p-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-[#e05638]"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full bg-[#e05638] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition"
                >
                  حفظ المستخدم
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}