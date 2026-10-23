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

  // 2. إدارة الأطفال والطلاب والتجديد الشهري
  const [children, setChildren] = useState(() => {
    const saved = localStorage.getItem('nursery_children');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "يوسف محمد", dob: "2022-05-10", joinDate: "2026-08-01", phone: "01012345678", classroom: "فصل الزهور", status: "present", checkIn: "07:45 ص", monthlyFee: 1000, paidFee: 2000 },
      { id: 2, name: "مريم أحمد", dob: "2021-08-15", joinDate: "2026-09-10", phone: "01198765432", classroom: "فصل الزهور", status: "present", checkIn: "08:00 ص", monthlyFee: 1200, paidFee: 1200 },
      { id: 3, name: "عمر خالد", dob: "2022-02-20", joinDate: "2026-10-01", phone: "01234567890", classroom: "فصل البراعم", status: "absent", checkIn: "-", monthlyFee: 1000, paidFee: 0 }
    ];
  });
  const [newChildName, setNewChildName] = useState('');
  const [newChildDob, setNewChildDob] = useState('');
  const [newChildJoinDate, setNewChildJoinDate] = useState('');
  const [newChildPhone, setNewChildPhone] = useState('');
  const [newChildClassroom, setNewChildClassroom] = useState('فصل الزهور');
  const [newChildMonthlyFee, setNewChildMonthlyFee] = useState('');

  // 3. الإيرادات والمصروفات
  const [revenues, setRevenues] = useState(() => {
    const saved = localStorage.getItem('nursery_revenues');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "تحصيل رسوم - يوسف محمد", amount: 1000, date: "2026-08-01" },
      { id: 2, title: "تحصيل رسوم - مريم أحمد", amount: 1200, date: "2026-09-10" }
    ];
  });

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

  // 4. الفصول الدراسية
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

  // 5. الفيديوهات والأنشطة
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('nursery_videos');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "تعليم الحروف العربية للأطفال", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", category: "تعليمي" }
    ];
  });
  const [newVideoTitle, setNewVideoTitle] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoCategory, setNewVideoCategory] = useState('تعليمي');

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('nursery_activities');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "نشاط الرسم والتلوين", category: "إنجاز", classroom: "فصل الزهور", time: "09:00 صباحاً" }
    ];
  });
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityCategory, setNewActivityCategory] = useState('إنجاز');
  const [newActivityTime, setNewActivityTime] = useState('');

  // الحفظ التلقائي
  useEffect(() => { localStorage.setItem('nursery_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('nursery_children', JSON.stringify(children)); }, [children]);
  useEffect(() => { localStorage.setItem('nursery_revenues', JSON.stringify(revenues)); }, [revenues]);
  useEffect(() => { localStorage.setItem('nursery_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('nursery_classrooms', JSON.stringify(classrooms)); }, [classrooms]);
  useEffect(() => { localStorage.setItem('nursery_videos', JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem('nursery_activities', JSON.stringify(activities)); }, [activities]);

  // حساب الاستحقاق الشهري
  const calculateTotalDueFee = (child) => {
    if (!child.joinDate || !child.monthlyFee) return Number(child.monthlyFee) || 0;
    const join = new Date(child.joinDate);
    const today = new Date();
    let months = (today.getFullYear() - join.getFullYear()) * 12 + (today.getMonth() - join.getMonth());
    if (today.getDate() >= join.getDate()) {
      months += 1;
    }
    months = Math.max(1, months);
    return months * Number(child.monthlyFee);
  };

  const totalPaidRevenue = revenues.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalDueFeesAll = children.reduce((sum, c) => sum + calculateTotalDueFee(c), 0);
  const totalReceivableBalance = totalDueFeesAll - totalPaidRevenue;
  const netIncome = totalPaidRevenue - totalExpenses;

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

  // إضافة طفل
  const handleAddChild = (e) => {
    e.preventDefault();
    if (!newChildName.trim() || !newChildDob.trim() || !newChildPhone.trim() || !newChildMonthlyFee) {
      alert('الرجاء إدخال جميع بيانات الطفل والقسط الشهري!');
      return;
    }
    const newChild = {
      id: Date.now(),
      name: newChildName,
      dob: newChildDob,
      joinDate: newChildJoinDate || new Date().toISOString().split('T')[0],
      phone: newChildPhone,
      classroom: newChildClassroom,
      status: 'absent',
      checkIn: '-',
      monthlyFee: Number(newChildMonthlyFee),
      paidFee: 0
    };
    setChildren([...children, newChild]);
    setNewChildName(''); setNewChildDob(''); setNewChildJoinDate(''); setNewChildPhone(''); setNewChildMonthlyFee('');
    alert('تم إضافة الطفل وتفعيل الاستحقاق الشهري بنجاح!');
  };

  // تحصيل دفعة وترحيل للإيرادات
  const handlePaymentUpdate = (childId, addedAmount) => {
    const amount = Number(addedAmount);
    if (isNaN(amount) || amount <= 0) return;

    const child = children.find(c => c.id === childId);
    if (!child) return;

    const updatedChildren = children.map(c => {
      if (c.id === childId) {
        return { ...c, paidFee: (Number(c.paidFee) || 0) + amount };
      }
      return c;
    });
    setChildren(updatedChildren);

    const newRev = {
      id: Date.now(),
      title: `تحصيل رسوم - ${child.name}`,
      amount: amount,
      date: new Date().toISOString().split('T')[0]
    };
    setRevenues([...revenues, newRev]);
    alert(`تم تحصيل مبلغ ${amount} وتسجيله فوراً في قائمة الإيرادات!`);
  };

  // إضافة مصروف
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpenseTitle.trim() || !newExpenseAmount) return;
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

  const handleAddClassroom = (e) => {
    e.preventDefault();
    if (!newClassroomName.trim()) return;
    setClassrooms([...classrooms, { id: Date.now(), name: newClassroomName, supervisor: newClassroomSupervisor || 'غير محدد', ageGroup: newClassroomAge || 'عام' }]);
    setNewClassroomName(''); setNewClassroomSupervisor(''); setNewClassroomAge('');
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) return;
    setVideos([...videos, { id: Date.now(), title: newVideoTitle, url: newVideoUrl, category: newVideoCategory }]);
    setNewVideoTitle(''); setNewVideoUrl('');
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim() || !newName.trim()) return;
    const roleLabel = newRole === 'admin' ? 'مدير النظام' : newRole === 'teacher' ? 'معلمة' : 'محاسب';
    setUsers([...users, { id: Date.now(), username: newUsername, password: newPassword, name: newName, role: newRole, roleLabel }]);
    setNewUsername(''); setNewPassword(''); setNewName('');
  };

  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivityTitle.trim() || !newActivityTime.trim()) return;
    setActivities([...activities, { id: Date.now(), title: newActivityTitle, category: newActivityCategory, classroom: 'جميع الفصول', time: newActivityTime }]);
    setNewActivityTitle(''); setNewActivityTime('');
  };

  // دوال الحذف
  const deleteChild = (id) => { if (window.confirm('هل أنت متأكد من حذف الطفل؟')) setChildren(children.filter(c => c.id !== id)); };
  const deleteClassroom = (id) => { if (window.confirm('هل أنت متأكد من حذف الفصل؟')) setClassrooms(classrooms.filter(c => c.id !== id)); };
  const deleteExpense = (id) => { if (window.confirm('هل أنت متأكد من حذف هذا المصروف؟')) setExpenses(expenses.filter(e => e.id !== id)); };
  const deleteRevenue = (id) => { if (window.confirm('هل أنت متأكد من حذف هذا الإيراد؟')) setRevenues(revenues.filter(r => r.id !== id)); };
  const deleteVideo = (id) => { if (window.confirm('هل أنت متأكد من حذف الفيديو؟')) setVideos(videos.filter(v => v.id !== id)); };
  const deleteActivity = (id) => { if (window.confirm('هل أنت متأكد من حذف النشاط؟')) setActivities(activities.filter(a => a.id !== id)); };
  const deleteUser = (id) => { if (window.confirm('هل أنت متأكد من حذف الحساب؟')) setUsers(users.filter(u => u.id !== id)); };

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
            <p className="text-xs text-indigo-200">نظام الإدارة المالية الشاملة والاستحقاق الشهري</p>
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

        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-md">
                <h2 className="text-xl font-bold mb-1">مرحباً بك في لوحة تحكم حضانة الأمل ✨</h2>
                <p className="text-indigo-100 text-xs">متابعة الاستحقاقات الشهرية والإيرادات والمصروفات تلقائياً.</p>
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

          {activeTab === 'children' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">إضافة طفل جديد وتحديد القسط الشهري</h2>
                <p className="text-slate-400 text-xs mb-4">يتجدد الاستحقاق المالي تلقائياً مع بداية كل شهر جديد للطفل بالحضانة</p>

                <form onSubmit={handleAddChild} className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-3">
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
                    title="تاريخ الميلاد"
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <input
                    type="date"
                    value={newChildJoinDate}
                    onChange={(e) => setNewChildJoinDate(e.target.value)}
                    title="تاريخ دخول الحضانة"
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
                    value={newChildMonthlyFee}
                    onChange={(e) => setNewChildMonthlyFee(e.target.value)}
                    placeholder="القسط الشهري..."
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
                      <th className="p-4 font-bold">تاريخ الدخول</th>
                      <th className="p-4 font-bold">رقم ولي الأمر</th>
                      <th className="p-4 font-bold">القسط الشهري</th>
                      <th className="p-4 font-bold">إجمالي المستحق</th>
                      <th className="p-4 font-bold">إجمالي المسدد</th>
                      <th className="p-4 font-bold">المتبقي (الصافي)</th>
                      <th className="p-4 font-bold text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {children.map(child => {
                      const totalDue = calculateTotalDueFee(child);
                      const balance = totalDue - (Number(child.paidFee) || 0);
                      return (
                        <tr key={child.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 font-semibold text-slate-800">{child.name}</td>
                          <td className="p-4 text-xs text-slate-500">{child.joinDate || '-'}</td>
                          <td className="p-4 text-xs font-mono text-slate-600">{child.phone}</td>
                          <td className="p-4 font-bold text-slate-700">{child.monthlyFee}</td>
                          <td className="p-4 font-bold text-indigo-600">{totalDue}</td>
                          <td className="p-4 font-bold text-emerald-600">{child.paidFee || 0}</td>
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

          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">تحصيل الرسوم وتسوية حسابات الطلاب</h2>
                <p className="text-slate-400 text-xs">أي مبلغ يتم تحصيله يرحل فوراً لجدول الإيرادات وحسابات الحضانة</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-xs">
                      <th className="p-4 font-bold">اسم الطفل</th>
                      <th className="p-4 font-bold">القسط الشهري</th>
                      <th className="p-4 font-bold">إجمالي المستحق</th>
                      <th className="p-4 font-bold">المدفوع</th>
                      <th className="p-4 font-bold">الصافي المتبقي</th>
                      <th className="p-4 font-bold text-center">تسجيل دفعة جديدة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {children.map(child => {
                      const totalDue = calculateTotalDueFee(child);
                      const balance = totalDue - (Number(child.paidFee) || 0);
                      return (
                        <tr key={child.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 font-semibold text-slate-800">{child.name}</td>
                          <td className="p-4 font-bold text-slate-700">{child.monthlyFee}</td>
                          <td className="p-4 font-bold text-indigo-600">{totalDue}</td>
                          <td className="p-4 font-bold text-emerald-600">{child.paidFee || 0}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${balance <= 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                              {balance <= 0 ? 'مخالص بالكامل ✔️' : `${balance} متبقي`}
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
                                تحصيل دفعة وترحيل للإيرادات 💳
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

          {activeTab === 'accounting' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 text-xs font-semibold">إجمالي الإيرادات المحصلة</span>
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
                    <h3 className={`text-2xl font-bold mt-1 ${netIncome >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>{netIncome}</h3>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                    <PieChart className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-emerald-50">
                  <h4 className="font-bold text-emerald-800 text-sm">سجل الإيرادات والمقبوضات المحصلة</h4>
                </div>
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-xs">
                      <th className="p-4 font-bold">التاريخ</th>
                      <th className="p-4 font-bold">بيان الإيراد / التحصيل</th>
                      <th className="p-4 font-bold">المبلغ المحصل</th>
                      <th className="p-4 font-bold text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {revenues.map(rev => (
                      <tr key={rev.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 text-xs text-slate-500 font-mono">{rev.date}</td>
                        <td className="p-4 font-semibold text-slate-800">{rev.title}</td>
                        <td className="p-4 font-bold text-emerald-600">{rev.amount}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => deleteRevenue(rev.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-3">تسجيل مصروف جديد</h3>
                <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newExpenseTitle}
                    onChange={(e) => setNewExpenseTitle(e.target.value)}
                    placeholder="بيان المصروف..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <input
                    type="number"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    placeholder="المبلغ..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <select
                    value={newExpenseCategory}
                    onChange={(e) => setNewExpenseCategory(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  >
                    <option value="أجور ورواتب">أجور ورواتب</option>
                    <option value="إيجار ومرافق">إيجار ومرافق</option>
                    <option value="مستلزمات تعليمية">مستلزمات تعليمية</option>
                    <option value="صيانة وتشغيل">صيانة وتشغيل</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-1 transition shadow-md"
                  >
                    <Plus className="w-4 h-4" /> إضافة مصروف
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-rose-50">
                  <h4 className="font-bold text-rose-800 text-sm">سجل المصروفات التشغيلية والعمومية</h4>
                </div>
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-xs">
                      <th className="p-4 font-bold">التاريخ</th>
                      <th className="p-4 font-bold">بيان المصروف</th>
                      <th className="p-4 font-bold">التصنيف</th>
                      <th className="p-4 font-bold">المبلغ</th>
                      <th className="p-4 font-bold text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {expenses.map(exp => (
                      <tr key={exp.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 text-xs text-slate-500 font-mono">{exp.date}</td>
                        <td className="p-4 font-semibold text-slate-800">{exp.title}</td>
                        <td className="p-4 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full w-fit">{exp.category}</td>
                        <td className="p-4 font-bold text-rose-600">{exp.amount}</td>
                        <td className="p-4 text-center">
                          <button onClick={() => deleteExpense(exp.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'classrooms' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">إدارة الفصول الدراسية</h2>
                <form onSubmit={handleAddClassroom} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
                  <input
                    type="text"
                    value={newClassroomName}
                    onChange={(e) => setNewClassroomName(e.target.value)}
                    placeholder="اسم الفصل..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <input
                    type="text"
                    value={newClassroomSupervisor}
                    onChange={(e) => setNewClassroomSupervisor(e.target.value)}
                    placeholder="المشرفة المسؤولة..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <input
                    type="text"
                    value={newClassroomAge}
                    onChange={(e) => setNewClassroomAge(e.target.value)}
                    placeholder="الفئة العمرية..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-1 transition shadow-md"
                  >
                    <Plus className="w-4 h-4" /> إضافة فصل
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classrooms.map(cls => (
                  <div key={cls.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <span className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full font-bold mb-2 inline-block">الفئة: {cls.ageGroup}</span>
                      <h3 className="font-bold text-slate-800 text-lg">{cls.name}</h3>
                      <p className="text-slate-400 text-xs mt-1">المشرفة: {cls.supervisor}</p>
                    </div>
                    <button
                      onClick={() => deleteClassroom(cls.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">الفيديوهات التعليمية والترفيهية</h2>
                <form onSubmit={handleAddVideo} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
                  <input
                    type="text"
                    value={newVideoTitle}
                    onChange={(e) => setNewVideoTitle(e.target.value)}
                    placeholder="عنوان الفيديو..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <input
                    type="url"
                    value={newVideoUrl}
                    onChange={(e) => setNewVideoUrl(e.target.value)}
                    placeholder="رابط الفيديو..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <select
                    value={newVideoCategory}
                    onChange={(e) => setNewVideoCategory(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  >
                    <option value="تعليمي">تعليمي</option>
                    <option value="ترفيهي">ترفيهي</option>
                  </select>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-1 transition shadow-md"
                  >
                    <Plus className="w-4 h-4" /> إضافة فيديو
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map(vid => (
                  <div key={vid.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-600">{vid.category}</span>
                        <button onClick={() => deleteVideo(vid.id)} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-bold text-slate-800 text-base mb-2">{vid.title}</h3>
                    </div>
                    <a href={vid.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1 mt-3">
                      <Video className="w-4 h-4" /> مشاهدة الفيديو
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800">جدول الأنشطة اليومية</h2>
                <form onSubmit={handleAddActivity} className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newActivityTitle}
                    onChange={(e) => setNewActivityTitle(e.target.value)}
                    placeholder="عنوان النشاط..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <select
                    value={newActivityCategory}
                    onChange={(e) => setNewActivityCategory(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  >
                    <option value="إنجاز">إنجاز</option>
                    <option value="وجبات">وجبات</option>
                  </select>
                  <input
                    type="text"
                    value={newActivityTime}
                    onChange={(e) => setNewActivityTime(e.target.value)}
                    placeholder="الوقت..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-1 transition shadow-md"
                  >
                    <Plus className="w-4 h-4" /> إضافة نشاط
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activities.map(act => (
                  <div key={act.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold mb-2 ${act.category === 'وجبات' ? 'bg-purple-100 text-purple-600' : 'bg-pink-100 text-pink-600'}`}>{act.category}</span>
                      <h3 className="font-bold text-slate-800 text-base mb-1">{act.title}</h3>
                      <p className="text-slate-400 text-xs">الوقت: {act.time}</p>
                    </div>
                    <button onClick={() => deleteActivity(act.id)} className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">سجل الحضور والغياب اليومي</h2>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-xs">
                      <th className="p-4 font-bold">اسم الطفل</th>
                      <th className="p-4 font-bold">وقت الحضور</th>
                      <th className="p-4 font-bold text-center">التحكم بالحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {children.map(child => (
                      <tr key={child.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-semibold text-slate-800">{child.name}</td>
                        <td className="p-4 text-xs text-slate-500">{child.checkIn}</td>
                        <td className="p-4 text-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleStatusChange(child.id, 'present')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${child.status === 'present' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                          >
                            حاضر ✔️
                          </button>
                          <button
                            onClick={() => handleStatusChange(child.id, 'absent')}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition ${child.status === 'absent' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                          >
                            غائب ✖️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && currentUser?.role === 'admin' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">إدارة الصلاحيات والمستخدمين</h2>
                <form onSubmit={handleAddUser} className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="الاسم الكامل..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="اسم المستخدم..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="كلمة المرور..."
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                  <div className="flex gap-2">
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                    >
                      <option value="admin">مدير النظام</option>
                      <option value="teacher">معلمة</option>
                      <option value="accountant">محاسب</option>
                    </select>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center justify-center transition shadow-md">
                      إضافة
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 text-base mb-4">قائمة مستخدمي النظام والصلاحيات</h3>
                <div className="space-y-2">
                  {users.map(u => (
                    <div key={u.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800 text-sm block">{u.name}</span>
                        <span className="text-xs text-slate-400">اسم المستخدم: {u.username}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold">{u.roleLabel}</span>
                        {u.username !== 'admin' && (
                          <button onClick={() => deleteUser(u.id)} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
