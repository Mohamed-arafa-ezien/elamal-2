import React, { useState, useEffect } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // 🛡️ تحديد صلاحيات المستخدم الحالي
  const isAdmin = currentUser?.role === 'admin';
  const isTeacher = currentUser?.role === 'teacher';
  const isAccountant = currentUser?.role === 'accountant';

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

  useEffect(() => { localStorage.setItem('nursery_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('nursery_children', JSON.stringify(children)); }, [children]);
  useEffect(() => { localStorage.setItem('nursery_revenues', JSON.stringify(revenues)); }, [revenues]);
  useEffect(() => { localStorage.setItem('nursery_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('nursery_classrooms', JSON.stringify(classrooms)); }, [classrooms]);
  useEffect(() => { localStorage.setItem('nursery_videos', JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem('nursery_activities', JSON.stringify(activities)); }, [activities]);

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
              <input type="text" value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm" placeholder="admin / teacher / accountant" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">كلمة المرور</label>
              <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm" placeholder="123" required />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition shadow-lg text-sm">تسجيل الدخول</button>
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
          <span className="text-xs bg-indigo-800 px-2 py-1 rounded-lg">{currentUser?.roleLabel}</span>
          <button onClick={() => { setIsLoggedIn(false); setCurrentUser(null); }} className="bg-indigo-800 hover:bg-indigo-900 px-3 py-1.5 rounded-xl text-xs transition">خروج 🚪</button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6">
        <aside className="w-full md:w-64 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm h-fit">
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>📊 لوحة التحكم</button>
            
            <button onClick={() => setActiveTab('children')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'children' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>👶 الأطفال والطلاب</button>
            
            {/* 🛡️ الفصول: مدير ومعلمة فقط */}
            {(isAdmin || isTeacher) && (
              <button onClick={() => setActiveTab('classrooms')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'classrooms' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>🏫 الفصول الدراسية</button>
            )}

            {/* 🛡️ الحضور: مدير ومعلمة فقط */}
            {(isAdmin || isTeacher) && (
              <button onClick={() => setActiveTab('attendance')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'attendance' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>📋 سجل الحضور</button>
            )}

            {/* 🛡️ الرسوم: مدير ومحاسب فقط */}
            {(isAdmin || isAccountant) && (
              <button onClick={() => setActiveTab('fees')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'fees' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>💳 الرسوم والتحصيل</button>
            )}

            {/* 🛡️ الحسابات: مدير ومحاسب فقط */}
            {(isAdmin || isAccountant) && (
              <button onClick={() => setActiveTab('accounting')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'accounting' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>📈 الإيرادات والمصروفات</button>
            )}

            {/* 🛡️ الأنشطة: مدير ومعلمة فقط */}
            {(isAdmin || isTeacher) && (
              <button onClick={() => setActiveTab('activities')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'activities' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>📅 الأنشطة اليومية</button>
            )}

            {/* 🛡️ الفيديوهات: مدير ومعلمة فقط */}
            {(isAdmin || isTeacher) && (
              <button onClick={() => setActiveTab('videos')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'videos' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>🎥 الفيديوهات التعليمية</button>
            )}

            {/* 🛡️ الصلاحيات: مدير فقط */}
            {isAdmin && (
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
                {/* 🛡️ النسخ الاحتياطي: مدير فقط */}
                {isAdmin && (
                  <div className="flex gap-2">
                    <button onClick={handleExportData} className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow transition">💾 حفظ نسخة</button>
                    <label className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow transition cursor-pointer">
                      📂 استرجاع
                      <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              {/* 🛡️ الأرقام المالية: مدير ومحاسب فقط */}
              {(isAdmin || isAccountant) ? (
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
              ) : (
                // لوحة تحكم مخصصة للمعلمة
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-3 py-12">
                  <span className="text-5xl">🌸</span>
                  <h3 className="text-xl font-bold text-slate-800">أهلاً بكِ أ/ {currentUser?.name}</h3>
                  <p className="text-slate-500 text-sm max-w-md">يمكنكِ من خلال القائمة الجانبية تسجيل حضور وغياب الأطفال، إضافة الأنشطة اليومية، ومتابعة الفيديوهات التعليمية.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'children' && (
            <div className="space-y-6">
              {/* 🛡️ إضافة طفل: مدير ومحاسب فقط (عشان القسط المالي) */}
              {(isAdmin || isAccountant) && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-800 mb-1">إضافة طفل جديد وتحديد القسط الشهري</h2>
                  <form onSubmit={handleAddChild} className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-4">
                    <input type="text" value={newChildName} onChange={(e) => setNewChildName(e.target.value)} placeholder="اسم الطفل..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                    <input type="date" value={newChildDob} onChange={(e) => setNewChildDob(e.target.value)} className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                    <input type="date" value={newChildJoinDate} onChange={(e) => setNewChildJoinDate(e.target.value)} className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                    <input type="tel" value={newChildPhone} onChange={(e) => setNewChildPhone(e.target.value)} placeholder="رقم ولي الأمر..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                    <input type="number" value={newChildMonthlyFee} onChange={(e) => setNewChildMonthlyFee(e.target.value)} placeholder="القسط الشهري..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm">إضافة طفل ➕</button>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-xs">
                      <th className="p-4 font-bold">اسم الطفل</th>
                      <th className="p-4 font-bold">تاريخ الدخول</th>
                      <th className="p-4 font-bold">رقم ولي الأمر</th>
                      {/* 🛡️ الأعمدة المالية تظهر للمدير والمحاسب فقط */}
                      {(isAdmin || isAccountant) && (
                        <>
                          <th className="p-4 font-bold">القسط الشهري</th>
                          <th className="p-4 font-bold">إجمالي المستحق</th>
                          <th className="p-4 font-bold">إجمالي المسدد</th>
                          <th className="p-4 font-bold">المتبقي (الصافي)</th>
                        </>
                      )}
                      {isAdmin && <th className="p-4 font-bold text-center">إجراءات</th>}
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
                          {(isAdmin || isAccountant) && (
                            <>
                              <td className="p-4 font-bold text-slate-700">{child.monthlyFee}</td>
                              <td className="p-4 font-bold text-indigo-600">{totalDue}</td>
                              <td className="p-4 font-bold text-emerald-600">{child.paidFee || 0}</td>
                              <td className="p-4 font-bold text-amber-600">{balance}</td>
                            </>
                          )}
                          {isAdmin && (
                            <td className="p-4 text-center">
                              <button onClick={() => deleteChild(child.id)} className="text-rose-600 hover:bg-rose-50 p-1 rounded-xl">🗑️ حذف</button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'fees' && (isAdmin || isAccountant) && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">تحصيل الرسوم وتسوية حسابات الطلاب</h2>
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
                              <button onClick={() => {
                                const pay = prompt(`أدخل المبلغ المسدد للطفل ${child.name} (المتبقي: ${balance}):`);
                                if (pay) handlePaymentUpdate(child.id, pay);
                              }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold">
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

          {activeTab === 'accounting' && (isAdmin || isAccountant) && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 text-xs font-semibold">إجمالي الإيرادات المحصلة</span>
                  <h3 className="text-2xl font-bold text-emerald-600 mt-1">{totalPaidRevenue}</h3>
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

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-emerald-50 border-b border-slate-100"><h4 className="font-bold text-emerald-800 text-sm">سجل الإيرادات والمقبوضات المحصلة</h4></div>
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
                      <tr key={rev.id}>
                        <td className="p-4 text-xs font-mono">{rev.date}</td>
                        <td className="p-4 font-semibold">{rev.title}</td>
                        <td className="p-4 font-bold text-emerald-600">{rev.amount}</td>
                        <td className="p-4 text-center"><button onClick={() => deleteRevenue(rev.id)} className="text-rose-600 hover:bg-rose-50 p-1 rounded-xl">🗑️ حذف</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-3">تسجيل مصروف جديد</h3>
                <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input type="text" value={newExpenseTitle} onChange={(e) => setNewExpenseTitle(e.target.value)} placeholder="بيان المصروف..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                  <input type="number" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} placeholder="المبلغ..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                  <select value={newExpenseCategory} onChange={(e) => setNewExpenseCategory(e.target.value)} className="px-4 py-2 border border-slate-300 rounded-xl text-sm bg-white">
                    <option value="أجور ورواتب">أجور ورواتب</option>
                    <option value="إيجار ومرافق">إيجار ومرافق</option>
                    <option value="مستلزمات تعليمية">مستلزمات تعليمية</option>
                    <option value="صيانة وتشغيل">صيانة وتشغيل</option>
                  </select>
                  <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded-xl text-sm">إضافة مصروف ➕</button>
                </form>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-rose-50 border-b border-slate-100"><h4 className="font-bold text-rose-800 text-sm">سجل المصروفات التشغيلية والعمومية</h4></div>
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
                      <tr key={exp.id}>
                        <td className="p-4 text-xs font-mono">{exp.date}</td>
                        <td className="p-4 font-semibold">{exp.title}</td>
                        <td className="p-4 text-xs">{exp.category}</td>
                        <td className="p-4 font-bold text-rose-600">{exp.amount}</td>
                        <td className="p-4 text-center"><button onClick={() => deleteExpense(exp.id)} className="text-rose-600 hover:bg-rose-50 p-1 rounded-xl">🗑️ حذف</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'classrooms' && (isAdmin || isTeacher) && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">إدارة الفصول الدراسية</h2>
                {isAdmin && (
                  <form onSubmit={handleAddClassroom} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
                    <input type="text" value={newClassroomName} onChange={(e) => setNewClassroomName(e.target.value)} placeholder="اسم الفصل..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                    <input type="text" value={newClassroomSupervisor} onChange={(e) => setNewClassroomSupervisor(e.target.value)} placeholder="المشرفة المسؤولة..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" />
                    <input type="text" value={newClassroomAge} onChange={(e) => setNewClassroomAge(e.target.value)} placeholder="الفئة العمرية..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm">إضافة فصل ➕</button>
                  </form>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {classrooms.map(cls => (
                  <div key={cls.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{cls.name}</h3>
                      <p className="text-slate-400 text-xs mt-1">المشرفة: {cls.supervisor}</p>
                    </div>
                    {isAdmin && <button onClick={() => deleteClassroom(cls.id)} className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl">🗑️ حذف</button>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'videos' && (isAdmin || isTeacher) && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">الفيديوهات التعليمية</h2>
                <form onSubmit={handleAddVideo} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
                  <input type="text" value={newVideoTitle} onChange={(e) => setNewVideoTitle(e.target.value)} placeholder="عنوان الفيديو..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                  <input type="url" value={newVideoUrl} onChange={(e) => setNewVideoUrl(e.target.value)} placeholder="رابط الفيديو..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                  <select value={newVideoCategory} onChange={(e) => setNewVideoCategory(e.target.value)} className="px-4 py-2 border border-slate-300 rounded-xl text-sm bg-white">
                    <option value="تعليمي">تعليمي</option>
                    <option value="ترفيهي">ترفيهي</option>
                  </select>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm">إضافة فيديو ➕</button>
                </form>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map(vid => (
                  <div key={vid.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base mb-2">{vid.title}</h3>
                      <a href={vid.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 font-semibold hover:underline">مشاهدة الفيديو 🎥</a>
                    </div>
                    <button onClick={() => deleteVideo(vid.id)} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl">🗑️ حذف</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activities' && (isAdmin || isTeacher) && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800">جدول الأنشطة اليومية</h2>
                <form onSubmit={handleAddActivity} className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input type="text" value={newActivityTitle} onChange={(e) => setNewActivityTitle(e.target.value)} placeholder="عنوان النشاط..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                  <select value={newActivityCategory} onChange={(e) => setNewActivityCategory(e.target.value)} className="px-4 py-2 border border-slate-300 rounded-xl text-sm bg-white">
                    <option value="إنجاز">إنجاز</option>
                    <option value="وجبات">وجبات</option>
                  </select>
                  <input type="text" value={newActivityTime} onChange={(e) => setNewActivityTime(e.target.value)} placeholder="الوقت..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm">إضافة نشاط ➕</button>
                </form>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activities.map(act => (
                  <div key={act.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-slate-800 text-base mb-1">{act.title}</h3>
                      <p className="text-slate-400 text-xs">الوقت: {act.time}</p>
                    </div>
                    <button onClick={() => deleteActivity(act.id)} className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl">🗑️ حذف</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (isAdmin || isTeacher) && (
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
                          <button onClick={() => handleStatusChange(child.id, 'present')} className={`px-3 py-1 rounded-xl text-xs font-bold transition ${child.status === 'present' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}>حاضر ✔️</button>
                          <button onClick={() => handleStatusChange(child.id, 'absent')} className={`px-3 py-1 rounded-xl text-xs font-bold transition ${child.status === 'absent' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}>غائب ✖️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'permissions' && isAdmin && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">إدارة الصلاحيات والمستخدمين</h2>
                <form onSubmit={handleAddUser} className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="الاسم الكامل..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                  <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="اسم المستخدم..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="كلمة المرور..." className="px-4 py-2 border border-slate-300 rounded-xl text-sm" required />
                  <div className="flex gap-2">
                    <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white">
                      <option value="admin">مدير النظام</option>
                      <option value="teacher">معلمة</option>
                      <option value="accountant">محاسب</option>
                    </select>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm">إضافة ➕</button>
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
                          <button onClick={() => deleteUser(u.id)} className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl">🗑️ حذف</button>
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
