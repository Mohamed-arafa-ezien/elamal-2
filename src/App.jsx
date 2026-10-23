import React, { useState, useEffect } from 'react';

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

  // الحفظ التلقائي في الـ LocalStorage
  useEffect(() => { localStorage.setItem('nursery_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('nursery_children', JSON.stringify(children)); }, [children]);
  useEffect(() => { localStorage.setItem('nursery_revenues', JSON.stringify(revenues)); }, [revenues]);
  useEffect(() => { localStorage.setItem('nursery_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('nursery_classrooms', JSON.stringify(classrooms)); }, [classrooms]);
  useEffect(() => { localStorage.setItem('nursery_videos', JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem('nursery_activities', JSON.stringify(activities)); }, [activities]);

  // 💾 تصدير النسخة الاحتياطية
  const handleExportData = () => {
    const backupData = { users, children, revenues, expenses, classrooms, videos, activities };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nursery_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 💾 استرجاع البيانات من الملف
  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.children) setChildren(parsed.children);
        if (parsed.revenues) setRevenues(parsed.revenues);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.classrooms) setClassrooms(parsed.classrooms);
        if (parsed.videos) setVideos(parsed.videos);
        if (parsed.activities) setActivities(parsed.activities);
        if (parsed.users) setUsers(parsed.users);
        alert('تم استرجاع كافة البيانات بنجاح تام! ✨');
      } catch (err) {
        alert('حدث خطأ: ملف النسخة الاحتياطية غير صالح!');
      }
    };
    reader.readAsText(file);
  };

  // حساب الاستحقاق الشهري الآلي
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
      title: `تحصيل رسوم - ${child.name}`, amount: amount, date: new Date().toISOString().split('T')[0] }; setRevenues([...revenues, newRev]); alert(`تم تحصيل مبلغ ${amount} وتسجيله فوراً في قائمة الإيرادات!`);
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
        <div>
          <h1 className="text-lg font-bold">حضانة الأمل الخاصة ثنائية اللغة - بصنبو</h1>
          <p className="text-xs text-indigo-200">نظام الإدارة المالية الشاملة والاستحقاق الشهري</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold">{currentUser?.name || currentUser?.username}</span>
          <button
            onClick={() => { setIsLoggedIn(false); setCurrentUser(null); }}
            className="bg-indigo-800 hover:bg-indigo-900 px-3 py-1.5 rounded-xl text-xs transition"
          >
            خروج 🚪
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6">
        <aside className="w-full md:w-64 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm h-fit">
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>📊 لوحة التحكم</button>
            <button onClick={() => setActiveTab('children')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'children' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>👶 الأطفال والطلاب</button>
            <button onClick={() => setActiveTab('classrooms')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'classrooms' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>🏫 الفصول الدراسية</button>
            <button onClick={() => setActiveTab('attendance')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'attendance' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>📋 سجل الحضور</button>
            <button onClick={() => setActiveTab('fees')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'fees' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>💳 الرسوم والتحصيل</button>
            <button onClick={() => setActiveTab('accounting')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'accounting' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>📈 الإيرادات والمصروفات</button>
            <button onClick={() => setActiveTab('activities')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'activities' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>📅 الأنشطة اليومية</button>
            <button onClick={() => setActiveTab('videos')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'videos' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>🎥 الفيديوهات التعليمية</button>
            {currentUser?.role === 'admin' && (
              <button onClick={() => setActiveTab('permissions')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'permissions' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>🔐 إدارة الصلاحيات</button>
            )}
          </nav>
        </aside>

        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">مرحباً بك في لوحة تحكم حضانة الأمل ✨</h2>
                  <p className="text-indigo-100 text-xs">متابعة الاستحقاقات الشهرية والإيرادات والمصروفات تلقائياً.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleExportData} 
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow transition"
                  >
                    💾 حفظ نسخة احتياطية
                  </button>
                  <label className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow transition cursor-pointer">
                    📂 استرجاع بيانات
                    <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                  </label>
                </div>
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
                  <h3 className={`text-2
