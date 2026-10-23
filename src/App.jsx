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
  Trash2
} from 'lucide-react';

export default function NurseryManagementSystem() {
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

  // 2. إدارة الأطفال والطلاب (تاريخ الميلاد ورقم ولي الأمر والفصل)
  const [children, setChildren] = useState(() => {
    const saved = localStorage.getItem('nursery_children');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "يوسف محمد", dob: "2022-05-10", phone: "01012345678", classroom: "فصل الزهور", status: "present", checkIn: "07:45 ص", feeStatus: "paid" },
      { id: 2, name: "مريم أحمد", dob: "2021-08-15", phone: "01198765432", classroom: "فصل الزهور", status: "present", checkIn: "08:00 ص", feeStatus: "pending" },
      { id: 3, name: "عمر خالد", dob: "2022-02-20", phone: "01234567890", classroom: "فصل البراعم", status: "absent", checkIn: "-", feeStatus: "paid" }
    ];
  });
  const [newChildName, setNewChildName] = useState('');
  const [newChildDob, setNewChildDob] = useState('');
  const [newChildPhone, setNewChildPhone] = useState('');
  const [newChildClassroom, setNewChildClassroom] = useState('فصل الزهور');

  // 3. إدارة الفصول الدراسية (جديد)
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

  // 4. الفيديوهات التعليمية (جديد)
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

  // 5. الأنشطة اليومية
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
  useEffect(() => { localStorage.setItem('nursery_videos', JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem('nursery_activities', JSON.stringify(activities)); }, [activities]);

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

  // إضافة طفل جديد
  const handleAddChild = (e) => {
    e.preventDefault();
    if (!newChildName.trim() || !newChildDob.trim() || !newChildPhone.trim()) {
      alert('الرجاء إدخال اسم الطفل وتاريخ الميلاد ورقم ولي الأمر!');
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
      feeStatus: 'pending'
    };
    setChildren([...children, newChild]);
    setNewChildName('');
    setNewChildDob('');
    setNewChildPhone('');
    alert('تم إضافة الطفل بنجاح!');
  };

  // إضافة فصل دراسي جديد (جديد)
  const handleAddClassroom = (e) => {
    e.preventDefault();
    if (!newClassroomName.trim()) {
      alert('الرجاء إدخال اسم الفصل!');
      return;
    }
    const newClass = {
      id: Date.now(),
      name: newClassroomName,
      supervisor: newClassroomSupervisor || 'غير محدد',
      ageGroup: newClassroomAge || 'عام'
    };
    setClassrooms([...classrooms, newClass]);
    setNewClassroomName('');
    setNewClassroomSupervisor('');
    setNewClassroomAge('');
    alert('تم إضافة الفصل بنجاح!');
  };

  // إضافة فيديو تعليمي جديد (جديد)
  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!newVideoTitle.trim() || !newVideoUrl.trim()) {
      alert('الرجاء إدخال عنوان الفيديو ورابط العرض!');
      return;
    }
    const newVid = {
      id: Date.now(),
      title: newVideoTitle,
      url: newVideoUrl,
      category: newVideoCategory
    };
    setVideos([...videos, newVid]);
    setNewVideoTitle('');
    setNewVideoUrl('');
    alert('تم إضافة الفيديو التعليمي بنجاح!');
  };

  // إضافة مستخدم جديد
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim() || !newName.trim()) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    if (users.some(u => u.username === newUsername)) {
      alert('اسم المستخدم موجود بالفعل!');
      return;
    }
    const roleLabel = newRole === 'admin' ? 'مدير النظام' : newRole === 'teacher' ? 'معلمة' : 'محاسب';
    const newUser = { id: Date.now(), username: newUsername, password: newPassword, name: newName, role: newRole, roleLabel };
    setUsers([...users, newUser]);
    setNewUsername(''); setNewPassword(''); setNewName('');
    alert('تم إنشاء الحساب وإضافة الصلاحية بنجاح!');
  };

  // إضافة نشاط يومي
  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivityTitle.trim() || !newActivityTime.trim()) {
      alert('الرجاء إدخال عنوان النشاط والوقت');
      return;
    }
    const newAct = {
      id: Date.now(),
      title: newActivityTitle,
      category: newActivityCategory,
      classroom: newActivityClass,
      time: newActivityTime
    };
    setActivities([...activities, newAct]);
    setNewActivityTitle(''); setNewActivityTime('');
    alert('تم إضافة النشاط بنجاح!');
  };

  // تغيير حالة الحضور
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

  // تغيير حالة الرسوم
  const handleFeeStatusChange = (id, feeStatus) => {
    const updated = children.map(c => c.id === id ? { ...c, feeStatus } : c);
    setChildren(updated);
  };

  // شاشة تسجيل الدخول
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
          <p className="text-indigo-500 text-xs text-center mb-6">نظام الإدارة وإدارة الصلاحيات - بصنبو</p>
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

  // الشاشة الرئيسية
  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 text-indigo-900 p-2 rounded-2xl">
            <Smile className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">حضانة الأمل الخاصة ثنائية اللغة - بصنبو</h1>
            <p className="text-xs text-indigo-200">نظام الإدارة وإدارة الصلاحيات والفصول التعليمية</p>
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
              <DollarSign className="w-5 h-5" /> الرسوم والماليات
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
                <p className="text-indigo-100 text-xs">إدارة ومتابعة شؤون الحضانة، الفصول، الفيديوهات والأنشطة بكل سهولة.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 text-xs font-semibold">إجمالي الطلاب</span>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{children.length}</h3>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 text-xs font-semibold">الفصول الدراسية</span>
                  <h3 className="text-2xl font-bold text-indigo-600 mt-1">{classrooms.length}</h3>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 text-xs font-semibold">الفيديوهات التعليمية</span>
                  <h3 className="text-2xl font-bold text-purple-600 mt-1">{videos.length}</h3>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <span className="text-slate-400 text-xs font-semibold">الحاضرون اليوم</span>
                  <h3 className="text-2xl font-bold text-emerald-600 mt-1">{children.filter(c => c.status === 'present').length}</h3>
                </div>
              </div>
            </div>
          )}

          {/* 1. الفصول الدراسية (جديد) */}
          {activeTab === 'classrooms' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">إدارة الفصول الدراسية</h2>
                <p className="text-slate-400 text-xs mb-4">إضافة وتعديل الفصول التعليمية ومشرفاتها</p>

                <form onSubmit={handleAddClassroom} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newClassroomName}
                    onChange={(e) => setNewClassroomName(e.target.value)}
                    placeholder="اسم الفصل (مثل: فصل النجوم)..."
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
                    <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                      <School className="w-8 h-8" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. الفيديوهات التعليمية (جديد) */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">الفيديوهات التعليمية والترفيهية</h2>
                <p className="text-slate-400 text-xs mb-4">إضافة روابط الفيديوهات والشروحات للأطفال والمعلمات</p>

                <form onSubmit={handleAddVideo} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
                    placeholder="رابط الفيديو (URL)..."
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
                    <option value="أناشيد">أناشيد</option>
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
                      <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold mb-2 bg-purple-100 text-purple-600">
                        {vid.category}
                      </span>
                      <h3 className="font-bold text-slate-800 text-base mb-2">{vid.title}</h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                      <a 
                        href={vid.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-indigo-600 hover:underline font-semibold flex items-center gap-1"
                      >
                        <Video className="w-4 h-4" /> مشاهدة الفيديو
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* الأطفال والطلاب */}
          {activeTab === 'children' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">إدارة الأطفال والطلاب</h2>
                <p className="text-slate-400 text-xs mb-4">إضافة وتحديث بيانات الأطفال وتاريخ الميلاد والفصل</p>

                <form onSubmit={handleAddChild} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <input
                    type="text"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="اسم الطفل الثلاثي..."
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
                  <select
                    value={newChildClassroom}
                    onChange={(e) => setNewChildClassroom(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
                  >
                    {classrooms.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
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
                      <th className="p-4 font-bold text-center">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {children.map(child => (
                      <tr key={child.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-semibold text-slate-800">{child.name}</td>
                        <td className="p-4 text-xs text-slate-500">{child.dob}</td>
                        <td className="p-4 text-xs font-mono text-slate-600">{child.phone}</td>
                        <td className="p-4 text-xs text-slate-500">{child.classroom}</td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${child.status === 'present' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                            {child.status === 'present' ? 'حاضر' : 'غائب'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* الأنشطة اليومية */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800">جدول الأنشطة اليومية</h2>
                <p className="text-slate-400 text-xs">عرض وإضافة الأنشطة الخاصة بالأطفال والفصول</p>
              </div>

              <form onSubmit={handleAddActivity} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3">
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
                  <option value="تعليمي">تعليمي</option>
                  <option value="ترفيهي">ترفيهي</option>
                </select>
                <input
                  type="text"
                  value={newActivityTime}
                  onChange={(e) => setNewActivityTime(e.target.value)}
                  placeholder="الوقت (مثال: 09:00 صباحاً)..."
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activities.map(act => (
                  <div key={act.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold mb-2 ${act.category === 'وجبات' ? 'bg-purple-100 text-purple-600' : 'bg-pink-100 text-pink-600'}`}>
                      {act.category}
                    </span>
                    <h3 className="font-bold text-slate-800 text-base mb-1">{act.title}</h3>
                    <p className="text-slate-400 text-xs">فصل: {act.classroom} | الوقت: {act.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* إدارة الصلاحيات */}
          {activeTab === 'permissions' && currentUser?.role === 'admin' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">إدارة الصلاحيات والمستخدمين</h2>
                <p className="text-slate-400 text-xs mb-4">إنشاء حسابات جديدة وتحديد الأدوار</p>

                <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center justify-center transition shadow-md"
                    >
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
                      <span className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-bold">
                        {u.roleLabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* سجل الحضور */}
          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">سجل الحضور والغياب اليومي</h2>
                <p className="text-slate-400 text-xs">تسجيل حضور وغياب الأطفال بنقرة واحدة</p>
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

          {/* الرسوم والماليات */}
          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-1">متابعة الرسوم والماليات</h2>
                <p className="text-slate-400 text-xs">حالة سداد المصروفات الدراسية لكل طفل</p>
              </div>
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 text-xs">
                      <th className="p-4 font-bold">اسم الطفل</th>
                      <th className="p-4 font-bold">رقم ولي الأمر</th>
                      <th className="p-4 font-bold">حالة السداد</th>
                      <th className="p-4 font-bold text-center">تحديث الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {children.map(child => (
                      <tr key={child.id} className="hover:bg-slate-50 transition">
                        <td className="p-4 font-semibold text-slate-800">{child.name}</td>
                        <td className="p-4 text-xs font-mono text-slate-500">{child.phone}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${child.feeStatus === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                            {child.feeStatus === 'paid' ? 'تم السداد ✔️' : 'معلق ⏳'}
                          </span>
                        </td>
                        <td className="p-4 text-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => handleFeeStatusChange(child.id, 'paid')}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1 rounded-xl text-xs font-bold transition"
                          >
                            تحديد كمدفوع
                          </button>
                          <button
                            onClick={() => handleFeeStatusChange(child.id, 'pending')}
                            className="bg-amber-50 text-amber-600 hover:bg-amber-100 px-3 py-1 rounded-xl text-xs font-bold transition"
                          >
                            تحديد كمعلق
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
