import React, { useState, useEffect } from 'react';

const PERMISSION_LIST = [
  { key: 'viewDashboard', label: 'رؤية لوحة التحكم' },
  { key: 'viewChildren', label: 'رؤية قائمة الأطفال' },
  { key: 'addChild', label: 'إضافة طفل جديد' },
  { key: 'deleteChild', label: 'حذف طفل' },
  { key: 'viewFees', label: 'رؤية صفحة الرسوم' },
  { key: 'collectFees', label: 'تحصيل دفعة (تسجيل إيراد)' },
  { key: 'viewAccounting', label: 'رؤية الإيرادات والمصروفات' },
  { key: 'addExpense', label: 'إضافة مصروف' },
  { key: 'viewReports', label: 'رؤية التقارير (الحضور والمالية)' }, // 🛡️ صلاحية جديدة
  { key: 'manageClassrooms', label: 'إدارة الفصول' },
  { key: 'manageAttendance', label: 'تسجيل الحضور والغياب' },
  { key: 'manageActivities', label: 'إدارة الأنشطة' },
  { key: 'manageVideos', label: 'إدارة الفيديوهات' },
  { key: 'manageUsers', label: 'إدارة الصلاحيات والمستخدمين' },
  { key: 'backupData', label: 'النسخ الاحتياطي والاسترجاع' },
];

const DEFAULT_ROLE_PERMISSIONS = {
  admin: {
    viewDashboard: true, viewChildren: true, addChild: true, deleteChild: true,
    viewFees: true, collectFees: true, viewAccounting: true, addExpense: true,
    viewReports: true, manageClassrooms: true, manageAttendance: true, manageActivities: true,
    manageVideos: true, manageUsers: true, backupData: true
  },
  teacher: {
    viewDashboard: true, viewChildren: true, addChild: true, deleteChild: true,
    viewFees: false, collectFees: false, viewAccounting: false, addExpense: false,
    viewReports: false, manageClassrooms: true, manageAttendance: true, manageActivities: true,
    manageVideos: true, manageUsers: false, backupData: false
  },
  accountant: {
    viewDashboard: true, viewChildren: true, addChild: true, deleteChild: false,
    viewFees: true, collectFees: true, viewAccounting: true, addExpense: true,
    viewReports: true, manageClassrooms: false, manageAttendance: false, manageActivities: false,
    manageVideos: false, manageUsers: false, backupData: false
  }
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('nursery_users');
    return saved ? JSON.parse(saved) : [
      { id: 1, username: 'admin', password: '123', name: 'أحمد محمود', role: 'admin', roleLabel: 'مدير النظام' },
      { id: 2, username: 'teacher', password: '123', name: 'سارة علي', role: 'teacher', roleLabel: 'معلمة' },
      { id: 3, username: 'accountant', password: '123', name: 'محمد حسن', role: 'accountant', roleLabel: 'محاسب' }
    ];
  });

  const [userPermissions, setUserPermissions] = useState(() => {
    const saved = localStorage.getItem('nursery_user_permissions');
    if (saved) {
      const parsed = JSON.parse(saved);
      // تحديث الصلاحيات للمستخدمين القدامى عشان ياخدوا الصلاحية الجديدة
      const updated = { ...parsed };
      users.forEach(u => {
        if (updated[u.id] && updated[u.id].viewReports === undefined) {
          updated[u.id].viewReports = DEFAULT_ROLE_PERMISSIONS[u.role].viewReports;
        }
      });
      return updated;
    }
    
    const initialPerms = {};
    users.forEach(u => {
      initialPerms[u.id] = { ...DEFAULT_ROLE_PERMISSIONS[u.role] };
    });
    return initialPerms;
  });

  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => { localStorage.setItem('nursery_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('nursery_user_permissions', JSON.stringify(userPermissions)); }, [userPermissions]);

  const hasPermission = (permissionKey) => {
    if (!currentUser) return false;
    if (currentUser.username === 'admin') return true;
    
    const perms = userPermissions[currentUser.id] || DEFAULT_ROLE_PERMISSIONS[currentUser.role];
    return perms?.[permissionKey] === true;
  };

  const toggleUserPermission = (userId, permissionKey) => {
    const user = users.find(u => u.id === userId);
    if (user && user.username === 'admin') {
      alert('لا يمكن تعديل صلاحيات المدير الأساسي!');
      return;
    }

    setUserPermissions(prev => {
      const userPerms = prev[userId] || { ...DEFAULT_ROLE_PERMISSIONS[user.role] };
      return {
        ...prev,
        [userId]: {
          ...userPerms,
          [permissionKey]: !userPerms[permissionKey]
        }
      };
    });
  };

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

  useEffect(() => { localStorage.setItem('nursery_children', JSON.stringify(children)); }, [children]);
  useEffect(() => { localStorage.setItem('nursery_revenues', JSON.stringify(revenues)); }, [revenues]);
  useEffect(() => { localStorage.setItem('nursery_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('nursery_classrooms', JSON.stringify(classrooms)); }, [classrooms]);
  useEffect(() => { localStorage.setItem('nursery_videos', JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem('nursery_activities', JSON.stringify(activities)); }, [activities]);

  const handleExportData = () => {
    const backupData = { users, children, revenues, expenses, classrooms, videos, activities, userPermissions };
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
        if (parsed.userPermissions) setUserPermissions(parsed.userPermissions);
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
    if (today.getDate() >= join.getDate()) months += 1;
    months = Math.max(1, months);
    return months * Number(child.monthlyFee);
  };

  const totalPaidRevenue = revenues.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalDueFeesAll = children.reduce((sum, c) => sum + calculateTotalDueFee(c), 0);
  const totalReceivableBalance = totalDueFeesAll - totalPaidRevenue;
  const netIncome = totalPaidRevenue - totalExpenses;

  // حسابات تقرير الحضور
  const presentCount = children.filter(c => c.status === 'present').length;
  const absentCount = children.filter(c => c.status === 'absent').length;

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
    if (!newChildName.trim() || !newChildDob.trim() || !newChildPhone.trim() || !newChildMonthlyFee) return;
    const newChild = { id: Date.now(), name: newChildName, dob: newChildDob, joinDate: newChildJoinDate || new Date().toISOString().split('T')[0], phone: newChildPhone, classroom: newChildClassroom, status: 'absent', checkIn: '-', monthlyFee: Number(newChildMonthlyFee), paidFee: 0 };
    setChildren([...children, newChild]);
    setNewChildName(''); setNewChildDob(''); setNewChildJoinDate(''); setNewChildPhone(''); setNewChildMonthlyFee('');
    alert('تم إضافة الطفل بنجاح!');
  };

  const handlePaymentUpdate = (childId, addedAmount) => {
    const amount = Number(addedAmount);
    if (isNaN(amount) || amount <= 0) return;
    const child = children.find(c => c.id === childId);
    if (!child) return;
    setChildren(children.map(c => c.id === childId ? { ...c, paidFee: (Number(c.paidFee) || 0) + amount } : c));
    setRevenues([...revenues, { id: Date.now(), title: `تحصيل رسوم - ${child.name}`, amount: amount, date: new Date().toISOString().split('T')[0] }]);
    alert(`تم تحصيل مبلغ ${amount} وتسجيله فوراً في قائمة الإيرادات!`);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpenseTitle.trim() || !newExpenseAmount) return;
    setExpenses([...expenses, { id: Date.now(), title: newExpenseTitle, amount: Number(newExpenseAmount), category: newExpenseCategory, date: new Date().toISOString().split('T')[0] }]);
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
    
    const newUserId = Date.now();
    const roleLabel = newRole === 'admin' ? 'مدير النظام' : newRole === 'teacher' ? 'معلمة' : 'محاسب';
    
    setUsers([...users, { id: newUserId, username: newUsername, password: newPassword, name: newName, role: newRole, roleLabel }]);
    setUserPermissions(prev => ({
      ...prev,
      [newUserId]: { ...DEFAULT_ROLE_PERMISSIONS[newRole] }
    }));

    setNewUsername(''); setNewPassword(''); setNewName('');
    alert('تم إضافة المستخدم بنجاح وتم تفعيل صلاحياته الافتراضية!');
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
  
  const deleteUser = (id) => { 
    if (window.confirm('هل أنت متأكد من حذف الحساب؟')) {
      setUsers(users.filter(u => u.id !== id));
      setUserPermissions(prev => {
        const newPerms = { ...prev };
        delete newPerms[id];
        return newPerms;
      });
      if (selectedUserId === id) setSelectedUserId(null);
    }
  };

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
    <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col print:bg-white">
      {/* 🛡️ كلاس print:hidden بيخفي الهيدر وقت الطباعة */}
      <header className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md print:hidden">
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

      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 print:p-0 print:block">
        {/* 🛡️ الـ Sidebar بيختفي وقت الطباعة */}
        <aside className="w-full md:w-64 bg-white rounded-3xl p-4 border border-slate-200 shadow-sm h-fit print:hidden">
          <nav className="space-y-1">
            {hasPermission('viewDashboard') && (
              <button onClick={() => setActiveTab('dashboard')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>📊 لوحة التحكم</button>
            )}
            
            {hasPermission('viewChildren') && (
              <button onClick={() => setActiveTab('children')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'children' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>👶 الأطفال والطلاب</button>
            )}
            
            {hasPermission('manageClassrooms') && (
              <button onClick={() => setActiveTab('classrooms')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'classrooms' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>🏫 الفصول الدراسية</button>
            )}

            {hasPermission('manageAttendance') && (
              <button onClick={() => setActiveTab('attendance')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'attendance' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>📋 سجل الحضور</button>
            )}

            {hasPermission('viewFees') && (
              <button onClick={() => setActiveTab('fees')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'fees' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>💳 الرسوم والتحصيل</button>
            )}

            {hasPermission('viewAccounting') && (
              <button onClick={() => setActiveTab('accounting')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'accounting' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>📈 الإيرادات والمصروفات</button>
            )}

            {/* 🛡️ زرار التقارير الجديد */}
            {hasPermission('viewReports') && (
              <button onClick={() => setActiveTab('reports')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'reports' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>📄 التقارير والطباعة</button>
            )}

            {hasPermission('manageActivities') && (
              <button onClick={() => setActiveTab('activities')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'activities' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>📅 الأنشطة اليومية</button>
            )}

            {hasPermission('manageVideos') && (
              <button onClick={() => setActiveTab('videos')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'videos' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>🎥 الفيديوهات التعليمية</button>
            )}

            {hasPermission('manageUsers') && (
              <button onClick={() => setActiveTab('permissions')} className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition ${activeTab === 'permissions' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>🔐 إدارة الصلاحيات والمستخدمين</button>
            )}
          </nav>
        </aside>

        <main className="flex-1 print:w-full print:m-0">
          {activeTab === 'dashboard' && hasPermission('viewDashboard') && (
            <div className="space-y-6 print:hidden">
              <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">مرحباً بك في لوحة تحكم حضانة الأمل ✨</h2>
                  <p className="text-indigo-100 text-xs">متابعة الاستحقاقات الشهرية والإيرادات والمصروفات تلقائياً.</p>
                </div>
                {hasPermission('backupData') && (
                  <div className="flex gap-2">
                    <button onClick={handleExportData} className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow transition">💾 حفظ نسخة</button>
                    <label className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow transition cursor-pointer">
                      📂 استرجاع
                      <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              {(hasPermission('viewAccounting') || hasPermission('viewFees')) ? (
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
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-3 py-12">
                  <span className="text-5xl">🌸</span>
                  <h3 className="text-xl font-bold text-slate-800">أهلاً بك أ/ {currentUser?.name}</h3>
                  <p className="text-slate-500 text-sm max-w-md">استخدم القائمة الجانبية للوصول إلى الصفحات المسموح لك بها.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'children' && hasPermission('viewChildren') && (
            <div className="space-y-6 print:hidden">
              {hasPermission('addChild') && (
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
                      {(hasPermission('viewFees') || hasPermission('viewAccounting')) && (
                        <>
                          <th className="p-4 font-bold">القسط الشهري</th>
                          <th className="p-4 font-bold">إجمالي المستحق</th>
                          <th className="p-4 font-bold">إجمالي المسدد</th>
                          <th className="p-4 font-bold">المتبقي (الصافي)</th>
                        </>
                      )}
                      {hasPermission('deleteChild') && <th className="p-4 font-bold text-center">إجراءات</th>}
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
                          {(hasPermission('viewFees') || hasPermission('viewAccounting')) && (
                            <>
                              <td className="p-4 font-bold text-slate-700">{child.monthlyFee}</td>
                              <td className="p-4 font-bold text-indigo-600">{totalDue}</td>
                              <td className="p-4 font-bold text-emerald-600">{child.paidFee || 0}</td>
                              <td className="p-4 font-bold text-amber-600">{balance}</td>
                            </>
                          )}
                          {hasPermission('deleteChild') && (
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

          {activeTab === 'fees' && hasPermission('viewFees') && (
            <div className="space-y-6 print:hidden">
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
                      {hasPermission('collectFees') && <th className="p-4 font-bold text-center">تسجيل دفعة جديدة</th>}
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
                          {hasPermission('collectFees') && (
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
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'accounting' && hasPermission('viewAccounting') && (
            <div className="space-y-6 print:hidden">
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

              {hasPermission('addExpense') && (
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
              )}

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

          {/* 🛡️ صفحة التقارير والطباعة الجديدة */}
          {activeTab === 'reports' && hasPermission('viewReports') && (
            <div className="space-y-6">
              <div className="flex justify-between items-center print:hidden">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">التقارير الشاملة</h2>
                  <p className="text-sm text-slate-500 mt-1">يمكنك طباعة هذا التقرير أو حفظه بصيغة PDF.</p>
                </div>
                <button onClick={() => window.print()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2">
                  🖨️ طباعة / تصدير PDF
                </button>
              </div>

              {/* منطقة الطباعة */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm print:border-0 print:shadow-none print:p-0">
                <div className="text-center mb-8 border-b-2 border-slate-800 pb-4">
                  <h1 className="text-2xl font-bold text-slate-900">حضانة الأمل الخاصة ثنائية اللغة</h1>
                  <p className="text-slate-600 mt-1">تقرير إداري ومالي شامل</p>
                  <p className="text-sm text-slate-500 mt-1">تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</p>
                </div>

                {/* تقرير الحضور والغياب */}
                <div className="mb-10">
                  <h2 className="text-lg font-bold text-indigo-900 bg-indigo-50 p-2 rounded-lg mb-4 print:bg-transparent print:border-b">1. تقرير الحضور والغياب اليومي</h2>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="border border-slate-300 p-3 rounded-xl text-center">
                      <span className="block text-sm text-slate-500 font-bold">إجمالي الأطفال</span>
                      <span className="block text-xl font-bold text-slate-800">{children.length}</span>
                    </div>
                    <div className="border border-emerald-300 bg-emerald-50 p-3 rounded-xl text-center print:bg-transparent">
                      <span className="block text-sm text-emerald-700 font-bold">الحضور اليوم</span>
                      <span className="block text-xl font-bold text-emerald-800">{presentCount}</span>
                    </div>
                    <div className="border border-rose-300 bg-rose-50 p-3 rounded-xl text-center print:bg-transparent">
                      <span className="block text-sm text-rose-700 font-bold">الغياب اليوم</span>
                      <span className="block text-xl font-bold text-rose-800">{absentCount}</span>
                    </div>
                  </div>

                  <table className="w-full text-right border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-sm">
                        <th className="p-2 border border-slate-300">اسم الطفل</th>
                        <th className="p-2 border border-slate-300">الفصل</th>
                        <th className="p-2 border border-slate-300">الحالة</th>
                        <th className="p-2 border border-slate-300">وقت الحضور</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-800">
                      {children.map(c => (
                        <tr key={c.id}>
                          <td className="p-2 border border-slate-300">{c.name}</td>
                          <td className="p-2 border border-slate-300">{c.classroom}</td>
                          <td className={`p-2 border border-slate-300 font-bold ${c.status === 'present' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {c.status === 'present' ? 'حاضر ✔️' : 'غائب ✖️'}
                          </td>
                          <td className="p-2 border border-slate-300 text-slate-500">{c.checkIn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* التقرير المالي */}
                <div>
                  <h2 className="text-lg font-bold text-indigo-900 bg-indigo-50 p-2 rounded-lg mb-4 print:bg-transparent print:border-b">2. التقرير المالي والموقف العام</h2>
                  
                  <table className="w-full text-right border-collapse border border-slate-300 mb-6">
                    <tbody className="text-sm text-slate-800">
                      <tr>
                        <td className="p-3 border border-slate-300 font-bold bg-slate-50 w-1/2">إجمالي الإيرادات المحصلة</td>
                        <td className="p-3 border border-slate-300 text-emerald-700 font-bold">{totalPaidRevenue} ج.م</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-slate-300 font-bold bg-slate-50">إجمالي المصروفات التشغيلية</td>
                        <td className="p-3 border border-slate-300 text-rose-700 font-bold">{totalExpenses} ج.م</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-slate-300 font-bold bg-slate-50">صافي الربح التشغيلي</td>
                        <td className={`p-3 border border-slate-300 font-bold ${netIncome >= 0 ? 'text-indigo-700' : 'text-rose-700'}`}>{netIncome} ج.م</td>
                      </tr>
                      <tr>
                        <td className="p-3 border border-slate-300 font-bold bg-slate-50">إجمالي الذمم (المتأخرات المالية)</td>
                        <td className="p-3 border border-slate-300 text-amber-700 font-bold">{totalReceivableBalance} ج.م</td>
                      </tr>
                    </tbody>
                  </table>

                  <h3 className="font-bold text-slate-800 mb-2">تفاصيل المصروفات:</h3>
                  <table className="w-full text-right border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 text-sm">
                        <th className="p-2 border border-slate-300">التاريخ</th>
                        <th className="p-2 border border-slate-300">البيان</th>
                        <th className="p-2 border border-slate-300">التصنيف</th>
                        <th className="p-2 border border-slate-300">المبلغ</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-slate-800">
                      {expenses.map(exp => (
                        <tr key={exp.id}>
                          <td className="p-2 border border-slate-300">{exp.date}</td>
                          <td className="p-2 border border-slate-300">{exp.title}</td>
                          <td className="p-2 border border-slate-300">{exp.category}</td>
                          <td className="p-2 border border-slate-300 font-bold">{exp.amount} ج.م</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-12 pt-8 border-t border-slate-300 flex justify-between text-sm text-slate-500 print:mt-20">
                  <div>توقيع المدير: ..................................</div>
                  <div>توقيع المحاسب: ..................................</div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'classrooms' && hasPermission('manageClassrooms') && (
            <div className="space-y-6 print:hidden">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">إدارة الفصول الدراسية</h2>
                {hasPermission('manageUsers') && (
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
                    {hasPermission('manageUsers') && <button onClick={() => deleteClassroom(cls.id)} className="text-rose-600 hover:bg-rose-50 p-2 rounded-xl">🗑️ حذف</button>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'videos' && hasPermission('manageVideos') && (
            <div className="space-y-6 print:hidden">
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

          {activeTab === 'activities' && hasPermission('manageActivities') && (
            <div className="space-y-6 print:hidden">
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

          {activeTab === 'attendance' && hasPermission('manageAttendance') && (
            <div className="space-y-6 print:hidden">
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

          {activeTab === 'permissions' && hasPermission('manageUsers') && (
            <div className="space-y-6 print:hidden">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-4">إدارة الصلاحيات الشخصية (لكل مستخدم)</h2>
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 border-l border-slate-100 pl-4">
                    <h3 className="font-bold text-slate-700 mb-3 text-sm">اختر المستخدم:</h3>
                    <div className="space-y-2">
                      {users.map(u => (
                        <button
                          key={u.id}
                          onClick={() => setSelectedUserId(u.id)}
                          className={`w-full text-right px-4 py-3 rounded-xl text-sm font-semibold transition border ${selectedUserId === u.id ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{u.name}</span>
                            <span className="text-xs bg-slate-100 px-2 py-1 rounded-md">{u.roleLabel}</span>
                          </div>
                          <span className="text-xs text-slate-400 font-normal">اسم المستخدم: {u.username}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="w-full md:w-2/3">
                    {selectedUserId ? (
                      <>
                        <div className="mb-4 flex items-center gap-2">
                          <h3 className="font-bold text-slate-800 text-lg">
                            صلاحيات: {users.find(u => u.id === selectedUserId)?.name}
                          </h3>
                          {users.find(u => u.id === selectedUserId)?.username === 'admin' && (
                            <span className="text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-md font-bold">حساب أساسي (غير قابل للتعديل)</span>
                          )}
                        </div>
                        
                        <div className="overflow-x-auto border border-slate-200 rounded-xl">
                          <table className="w-full text-right border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-700 text-sm">
                                <th className="p-3 font-bold border-b">الصلاحية</th>
                                <th className="p-3 font-bold border-b text-center w-24">السماح</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                              {PERMISSION_LIST.map(perm => {
                                const user = users.find(u => u.id === selectedUserId);
                                const isAdmin = user?.username === 'admin';
                                const isAllowed = isAdmin ? true : (userPermissions[selectedUserId]?.[perm.key] ?? DEFAULT_ROLE_PERMISSIONS[user?.role]?.[perm.key] ?? false);
                                
                                return (
                                  <tr key={perm.key} className="hover:bg-slate-50">
                                    <td className="p-3 font-semibold">{perm.label}</td>
                                    <td className="p-3 text-center">
                                      <input 
                                        type="checkbox" 
                                        checked={isAllowed} 
                                        onChange={() => toggleUserPermission(selectedUserId, perm.key)} 
                                        disabled={isAdmin}
                                        className={`w-5 h-5 accent-indigo-600 ${isAdmin ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`} 
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-400 font-semibold min-h-[200px]">
                        👈 اختر مستخدم من القائمة لعرض وتعديل صلاحياته
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm mt-6">
                <h3 className="text-lg font-bold text-slate-800 mb-3">إضافة مستخدم جديد</h3>
                <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
                <h3 className="font-bold text-slate-800 text-base mb-4">قائمة مستخدمي النظام</h3>
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
