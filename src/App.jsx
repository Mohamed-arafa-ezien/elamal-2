import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  Calendar, 
  ShieldCheck, 
  Plus, 
  LogOut, 
  LayoutDashboard,
  Smile,
  Video,
  School,
  Trash2,
  TrendingUp,
  TrendingDown,
  PieChart
} from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // 1. إدارة المستخدمين والصلاحيات
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('nursery_users');
    return saved ? JSON.parse(saved) : [
      { id: 1, username: 'admin', password: '123', name: 'أحمد محمود', role: 'admin', roleLabel: 'مدير النظام' },
      { id: 2, username: 'teacher', password: '123', name: 'سارة علي', role: 'teacher', roleLabel: 'معلمة' },
      { id: 3, username: 'accountant', password: '123', name: 'محمد حسن', role: 'accountant', roleLabel: 'محاسب' }
    ];
  });
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('teacher');

  // 2. إدارة الأطفال شاملة الرسوم المستحقة والمدفوعة والمتبقية
  const [children, setChildren] = useState(() => {
    const saved = localStorage.getItem('nursery_children');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "يوسف محمد", dob: "2022-05-10", phone: "01012345678", classroom: "فصل الزهور", status: "present", checkIn: "07:45 ص", dueFee: 1000, paidFee: 1000 },
      { id: 2, name: "مريم أحمد", dob: "2021-08-15", phone: "01198765432", classroom: "فصل الزهور", status: "present", checkIn: "08:00 ص", dueFee: 1200, paidFee: 500 },
      { id: 3, name: "عمر خالد", dob: "2022-02-20", phone: "01234567890", classroom: "فصل البراعم", status: "absent", checkIn: "-", dueFee: 1000, paidFee: 0 }
    ];
  });
  const [newChildName, setNewChildName] = useState('');
  const [newChildDob, setNewChildDob] = useState('');
  const [newChildPhone, setNewChildPhone] = useState('');
  const [newChildClassroom, setNewChildClassroom] = useState('فصل الزهور');
  const [newChildDueFee, setNewChildDueFee] = useState('');

  // 3. إدارة الفصول الدراسية
  const [classrooms, setClassrooms] = useState(() => {
    const saved = localStorage.getItem('nursery_classrooms');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "فصل البراعم", supervisor: "أستاذة فاطمة", ageGroup: "سنة إلى سنتين" },
      { id: 2, name: "فصل الزهور", supervisor: "أستاذة سارة", ageGroup: "سنتان إلى 3 سنوات" }
    ];
  });
  const [newClassroomName, setNewClassroomName] = useState('');
  const [newClassroomSupervisor, setNewClassroomSupervisor] = useState('');
  const [newClassroomAge, setNewClassroomAge] = useState('');

  // 4. سجل المصروفات التشغيلية والعمومية (المعايير المحاسبية)
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('nursery_expenses');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "أجور ورواتب المعلمات", amount: 1500, category: "أجور ورواتب", date: "2026-10-01" },
      { id: 2, title: "مستلزمات وأدوات تلوين", amount: 200, category: "مستلزمات تعليمية", date: "2026-10-05" }
    ];
  });
  const [newExpenseTitle, setNewExpenseTitle] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('أجور ورواتب');

  // 5. الفيديوهات التعليمية
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('nursery_videos');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "تعليم الحروف العربية للأطفال مع الأنشطة", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "تعليمي" },
      { id: 2, title: "أناشيد الحضانة الترفيهية والأرقام", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "ترفيهي" }
    ];
  });
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState('تعليمي');

  // 6. الأنشطة اليومية
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('nursery_activities');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "نشاط الرسم والتلوين", category: "إنجاز", classroom: "فصل الزهور", time: "09:00 صباحاً" },
      { id: 2, title: "وجبة الإفطار الجماعية", category: "وجبات", classroom: "جميع الفصول", time: "10:30 صباحاً" }
    ];
  });
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityCategory, setNewActivityCategory] = useState('إنجاز');
  const [newActivityClass, setNewActivityClass] = useState('جميع الفصول');
  const [newActivityTime, setNewActivityTime] = useState('');

  // الحفظ التلقائي في LocalStorage
  useEffect(() => { localStorage.setItem('nursery_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('nursery_children', JSON.stringify(children)); }, [children]);
  useEffect(() => { localStorage.setItem('nursery_classrooms', JSON.stringify(classrooms)); }, [classrooms]);
  useEffect(() => { localStorage.setItem('nursery_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('nursery_videos', JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem('nursery_activities', JSON.stringify(activities)); }, [activities]);

  // الحسابات المباشرة للمؤشرات المحاسبية
  const totalDueFees = children.reduce((sum, c) => sum + (Number(c.dueFee) || 0), 0);
  const totalPaidRevenue = children.reduce((sum, c) => sum + (Number(c.paidFee) || 0), 0);
  const totalReceivableBalance = totalDueFees - totalPaidRevenue; // المتبقي للتحصيل
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const netIncome = totalPaidRevenue - totalExpenses; // صافي الربح التشغيلي

  // تسجيل الدخول
  const handleLogin = (e) => {
    e.preventDefault();
    const found = users.find(u => u.username === usernameInput && u.password === passwordInput);
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
    } else {
      alert('اسم المستخدم أو كلمة المرور غير مسجلة بشكل صحيح!');
    }
  };

  // دالة إضافة الطفل مع القسط المستحق
  const handleAddChild = (e) => {
    e.preventDefault();
    if (!newChildName.trim() || !newChildDob.trim() || !newChildPhone.trim() || !newChildDueFee) {
      alert('الرجاء إدخال اسم الطفل، تاريخ الميلاد، رقم ولي الأمر، والمبلغ المستحق!');
      return;
    }
    const newChild = {
      id: Date.now(),
      name: newChildName,
      dob: newChildDob,
      phone: newChildPhone,
      classroom: newChildClassroom,
      status: 'absent',
      checkIn: '-',
      dueFee: Number(newChildDueFee),
      paidFee: 0
    };
    setChildren([...children, newChild]);
    setNewChildName(''); setNewChildDob(''); setNewChildPhone(''); setNewChildDueFee('');
    alert('تم إضافة الطفل وتسجيل المبلغ المستحق بنجاح!');
  };

  // تحديث الدفعات وحساب المتبقي الصافي
  const handlePaymentUpdate = (childId, addedAmount) => {
    const amount = Number(addedAmount);
    if (isNaN(amount) || amount <= 0) return;

    const updated = children.map(c => {
      if (c.id === childId) {
        const newPaid = (Number(c.paidFee) || 0) + amount;
        return { ...c, paidFee: Math.min(newPaid, c.dueFee) };
      }
      return c;
    });
    setChildren(updated);
  };

  // دالة إضافة المصروفات
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpenseTitle.trim() || !newExpenseAmount) {
      alert('الرجاء إدخال بيان المصروف والمبلغ!');
      return;
    }
    const newExp = {
      id: Date.now(),
      title: newExpenseTitle,
      amount: Number(newExpenseAmount),
      category: newExpenseCategory,
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([...expenses, newExp]);
    setNewExpenseTitle(''); setNewExpenseAmount('');
    alert('تم تسجيل المصروف بنجاح!');
  };

  // دالة إضافة الفصول
  const handleAddClassroom = (e) => {
    e.preventDefault();
    if (!newClassroomName.trim()) {
      alert('الرجاء إدخال اسم الفصل!');
      return;
    }
    setClassrooms([...classrooms, {
      id: Date.now(),
      name: newClassroomName,
      supervisor: newClassroomSupervisor || 'غير محدد',
      ageGroup: newClassroomAge || 'عام'
    }]);
    setNewClassroomName(''); setNewClassroomSupervisor(''); setNewClassroomAge('');
    alert('تم إضافة الفصل بنجاح!');
  };

  // دالة إضافة الفيديو
  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) return;
    setVideos([...videos, { id: Date.now(), title: newVideoTitle, url: newVideoUrl, category: newVideoCategory }]);
    setNewVideoTitle(''); setNewVideoUrl('');
    alert('تم إضافة الفيديو بنجاح!');
  };

  // دالة إضافة المستخدمين
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim() || !newName.trim()) return;
    const roleLabel = newRole === 'admin' ? 'مدير النظام' : newRole === 'teacher' ? 'معلمة' : 'محاسب';
    setUsers([...users, { id: Date.now(), username: newUsername, password: newPassword, name: newName, role: newRole, roleLabel }]);
    setNewUsername(''); setNewPassword(''); setNewName('');
    alert('تم إضافة المستخدم بنجاح!');
  };

  // دالة إضافة الأنشطة
  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivityTitle.trim() || !newActivityTime.trim()) return;
    setActivities([...activities, { id: Date.now(), title: newActivityTitle, category: newActivityCategory, classroom: newActivityClass, time: newActivityTime }]);
    setNewActivityTitle(''); setNewActivityTime('');
    alert('تم إضافة النشاط بنجاح!');
  };

  // 🗑️ دوال الحذف العامة لجميع الأقسام
  const deleteChild = (id) => { if (confirm('هل أنت تأكد من حذف الطفل؟')) setChildren(children.filter(c => c.id !== id)); };
  const deleteClassroom = (id) => { if (confirm('هل أنت تأكد من حذف الفصل؟')) setClassrooms(classrooms.filter(c => c.id !== id)); };
  const deleteExpense = (id) => { if (confirm('هل أنت تأكد من حذف هذا المصروف؟')) setExpenses(expenses.filter(e => e.id !== id)); };
  const deleteVideo = (id) => { if (confirm('هل أنت تأكد من حذف الفيديو؟')) setVideos(videos.filter(v => v.id !== id)); };
  const deleteActivity = (id) => { if (confirm('هل أنت تأكد من حذف النشاط؟')) setActivities(activities.filter(a => a.id !== id)); };
  const deleteUser = (id) => { if (confirm('هل أنت تأكد من حذف الحساب؟')) setUsers(users.filter(u => u.id !== id)); };

  const handleStatusChange = (id, status) => {
    const updated = children.map(c => {
      if (c.id === id) {
        const currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        return { ...c, status, checkIn: status !== 'absent' ? currentTime : '-' };
      }
      return c;
    });
    setChildren(updated);
  };

  if (!isLoggedIn) {
    return (
      <div dir="rtl" className="min-h-screen bg-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full border border-indigo-100">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-2xl text-white">
              <Smile className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-indigo-900 text-center mb-1">حضانة الأمل الخاصة ثنائية اللغة</h1>
          <p className="text-indigo-500 text-xs text-center mb-6">نظام الإدارة المالي والإداري - بصنبو</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">اسم المستخدم</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                placeholder="admin / teacher / accountant"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">كلمة المرور</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
                placeholder="123"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition shadow-lg text-sm"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 text-indigo-900 p-2 rounded-2xl">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">حضانة الأمل الخاصة ثنائية اللغة - بصنبو</h1>
            <p className="text-xs text-indigo-200">نظام الإدارة المالية الشاملة والفصول</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-left hidden sm:block">
            <span className="block text-sm font-bold">{currentUser?.name || currentUser?.username}</span>
            <span className="text-xs bg-indigo-800 px-2 py-0.5 rounded-full text-indigo-200">{currentUser?.roleLabel || currentUser?.role}</span>
          </div>
          <button
            onClick={() => { setIsLoggedIn(false); setCurrentUser(null); }}
            className="flex items-center gap-1 bg-indigo-800 hover:bg-indigo-900 px-3 py-1.5 rounded-xl text-xs transition"
          >
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6">
        {/* القائمة الجانبية */}
        <aside className="w-full md:w-64 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm h-fit">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <LayoutDashboard className="w-5 h-5" /> لوحة التحكم
            </button>
            <button
              onClick={() => setActiveTab('children')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'children' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Users className="w-5 h-5" /> الأطفال والطلاب
            </button>
            <button
              onClick={() => setActiveTab('classrooms')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'classrooms' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <School className="w-5 h-5" /> الفصول الدراسية
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'attendance' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <UserCheck className="w-5 h-5" /> سجل الحضور
            </button>
            <button
              onClick={() => setActiveTab('fees')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'fees' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <DollarSign className="w-5 h-5" /> الرسوم والتحصيل
            </button>
            <button
              onClick={() => setActiveTab('accounting')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'accounting' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <PieChart className="w-5 h-5" /> قائمة الإيرادات والمصروفات
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'activities' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Calendar className="w-5 h-5" /> الأنشطة اليومية
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'videos' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Video className="w-5 h-5" /> الفيديوهات التعليمية
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('permissions')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'permissions' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <ShieldCheck className="w-5 h-5" /> إدارة الصلاحيات
              </button>
            )}
          </nav>
        </aside>

        {/* المحتوى الرئيسي */}
        <main className="flex-1">
          {/* لوحة التحكم */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-md">
                <h2 className="text-xl font-bold mb-1">مرحباً بك في لوحة تحكم حضانة الأمل ✨</h2>
                <p className="text-indigo-100 text-xs">إدارة ومتابعة شؤون الحضانة، الموقف المالي، والأنشطة بكل سهولة.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 text-xs font-semibold">إجمالي الإيرادات المحصلة</span>
                  <h3 className="text-2xl font-bold text-emerald-600 mt-1">{totalPaidRevenue}</h3>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 text-xs font-semibold">الذمم والرسوم المتبقية</span>
                  <h3 className="text-2xl font-bold text-amber-600 mt-1">{totalReceivableBalance}</h3>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 text-xs font-semibold">إجمالي المصروفات</span>
                  <h3 className="text-2xl font-bold text-rose-600 mt-1">{totalExpenses}</h3>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 text-xs font-semibold">صافي الربح التشغيلي</span>
                  <h3 className={`text-2xl font-bold mt-1 ${netIncome >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>{netIncome}</h3>
                </div>
              </div>
            </div>
          )}

          {/* 1. الأطفال والطلاب + المبالغ المستحقة والحذف */}
          {activeTab === 'children' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">إدارة الأطفال والطلاب وتحديد الرسوم المستحقة</h2>
                <p className="text-slate-400 text-xs mb-4">إضافة طفل وتسجيل القسط المالي المستحق عليه فوراً</p>

                <form onSubmit={handleAddChild} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <input
                    type="text"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="اسم الطفل..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <input
                    type="date"
                    value={newChildDob}
                    onChange={(e) => setNewChildDob(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <input
                    type="tel"
                    value={newChildPhone}
                    onChange={(e) => setNewChildPhone(e.target.value)}
                    placeholder="رقم ولي الأمر..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <input
                    type="number"
                    value={newChildDueFee}
                    onChange={(e) => setNewChildDueFee(e.target.value)}
                    placeholder="المبلغ المستحق..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-1 transition shadow-md"
                  >
                    <Plus className="w-4 h-4" /> إضافة طفل
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-xs">
                      <th className="p-4 font-bold">اسم الطفل</th>
                      <th className="p-4 font-bold">تاريخ الميلاد</th>
                      <th className="p-4 font-bold">رقم ولي الأمر</th>
                      <th className="p-4 font-bold">الفصل</th>
                      <th className="p-4 font-bold">المستحق</th>
                      <th className="p-4 font-bold">المدفوع</th>
                      <th className="p-4 font-bold">المتبقي (الصافي)</th>
                      <th className="p-4 font-bold text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {children.map(child => {
                      const balance = (Number(child.dueFee) || 0) - (Number(child.paidFee) || 0);
                      return (
                        <tr key={child.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 font-semibold text-slate-800">{child.name}</td>
                          <td className="p-4 text-xs text-slate-500">{child.dob}</td>
                          <td className="p-4 text-xs font-mono text-slate-600">{child.phone}</td>
                          <td className="p-4 text-xs text-slate-500">{child.classroom}</td>
                          <td className="p-4 font-bold text-slate-800">{child.dueFee}</td>
                          <td className="p-4 font-bold text-emerald-600">{child.paidFee}</td>
                          <td className="p-4 font-bold text-amber-600">{balance}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => deleteChild(child.id)}
                              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                              title="حذف الطفل"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. الرسوم والتحصيل وحساب الصافي المستحق */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">تحصيل الرسوم وتسوية حسابات الطلاب</h2>
                <p className="text-slate-400 text-xs">إدخال المبالغ المسددة وحساب الرصيد الصافي المتبقي تلقائياً</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-xs">
                      <th className="p-4 font-bold">اسم الطفل</th>
                      <th className="p-4 font-bold">المبلغ المستحق</th>
                      <th className="p-4 font-bold">المدفوع حتى الآن</th>
                      <th className="p-4 font-bold">الصافي المتبقي</th>
                      <th className="p-4 font-bold text-center">تسجيل دفعة جديدة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {children.map(child => {
                      const balance = (Number(child.dueFee) || 0) - (Number(child.paidFee) || 0);
                      return (
                        <tr key={child.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 font-semibold text-slate-800">{child.name}</td>
                          <td className="p-4 font-bold text-slate-800">{child.dueFee}</td>
                          <td className="p-4 font-bold text-emerald-600">{child.paidFee}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${balance === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}> {balance === 0 ? 'مخالص بالكامل ✔️' : `${balance} متبقي`}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            {balance > 0 ? (
                              <button
                                onClick={() => {
                                  const pay = prompt(`أدخل المبلغ المسدد للطفل ${child.name} (المتبقي: ${balance}):`);
                                  if (pay) handlePaymentUpdate(child.id, pay);
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                              >
                                تحصيل دفعة 💳
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 font-semibold">لا يوجد مستحق</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. قائمة الإيرادات والمصروفات وفق المعايير المحاسبية */}
          {activeTab === 'accounting' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-xs font-semibold">إجمالي الإيرادات (المحصلة)</span>
                    <h3 className="text-2xl font-bold text-emerald-600 mt-1">{totalPaidRevenue}</h3>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-xs font-semibold">إجمالي المصروفات</span>
                    <h3 className="text-2xl font-bold text-rose-600 mt-1">{totalExpenses}</h3>
                  </div>
                  <div className="bg-rose-50 p-3 rounded-2xl text-rose-600">
                    <TrendingDown className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-xs font-semibold">صافي الربح التشغيلي</span>
                    <h3 className={`text-2xl font-bold mt-1
