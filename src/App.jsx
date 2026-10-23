import React, { useState, useEffect } from 'react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // 1. نظام المستخدمين والصلاحيات
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('nursery_users');
    return saved ? JSON.parse(saved) : [
      { id: 1, username: 'admin', password: '123', role: 'admin' },
      { id: 2, username: 'teacher', password: '123', role: 'teacher' },
      { id: 3, username: 'accountant', password: '123', role: 'accountant' }
    ];
  });
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('teacher');

  // 2. حالة الأطفال (شاملة الاسم، تاريخ الميلاد، ورقم ولي الأمر)
  const [children, setChildren] = useState(() => {
    const saved = localStorage.getItem('nursery_children');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "يوسف محمد", dob: "2022-05-10", phone: "01012345678", status: "present", checkIn: "07:45 ص" },
      { id: 2, name: "مريم أحمد", dob: "2021-08-15", phone: "01198765432", status: "present", checkIn: "08:00 ص" },
      { id: 3, name: "عمر خالد", dob: "2022-02-20", phone: "01234567890", status: "absent", checkIn: "-" }
    ];
  });
  const [newChildName, setNewChildName] = useState('');
  const [newChildDob, setNewChildDob] = useState('');
  const [newChildPhone, setNewChildPhone] = useState('');

  // 3. حالة الفصول الدراسية
  const [classrooms, setClassrooms] = useState(() => {
    const saved = localStorage.getItem('nursery_classrooms');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "فصل البراعم" },
      { id: 2, name: "فصل الزهور" }
    ];
  });
  const [newClassroomName, setNewClassroomName] = useState('');

  // 4. حالة المعلمات
  const [teachers, setTeachers] = useState(() => {
    const saved = localStorage.getItem('nursery_teachers');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "أستاذة فاطمة", role: "معلمة أطفال" }
    ];
  });
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherRole, setNewTeacherRole] = useState('');

  // مزامنة الحفظ التلقائي مع الذاكرة المحلية
  useEffect(() => {
    localStorage.setItem('nursery_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('nursery_children', JSON.stringify(children));
  }, [children]);
  useEffect(() => {
    localStorage.setItem('nursery_classrooms', JSON.stringify(classrooms));
  }, [classrooms]);
  useEffect(() => {
    localStorage.setItem('nursery_teachers', JSON.stringify(teachers));
  }, [teachers]);

  // دالة تسجيل الدخول والتحقق من الصلاحيات
  const handleLogin = (e) => {
    e.preventDefault();
    const found = users.find(
      u => u.username === usernameInput && u.password === passwordInput
    );

    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      setActiveTab('dashboard');
    } else {
      alert('اسم المستخدم أو كلمة المرور غير مسجلة بشكل صحيح!');
    }
  };

  // إضافة مستخدم جديد وصلاحياته (مدير النظام فقط)
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUsername.trim() || !newPassword.trim()) {
      alert('الرجاء إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    if (users.some(u => u.username === newUsername)) {
      alert('اسم المستخدم موجود مسبقاً!');
      return;
    }
    const newUser = {
      id: Date.now(),
      username: newUsername,
      password: newPassword,
      role: newRole
    };
    setUsers([...users, newUser]);
    setNewUsername('');
    setNewPassword('');
    alert('تم إضافة المستخدم وصلاحياته بنجاح!');
  };

  // دالة إضافة الطفل بالبيانات الكاملة (الاسم، تاريخ الميلاد، رقم ولي الأمر)
  const handleAddChild = (e) => {
    e.preventDefault();
    if (!newChildName.trim() || !newChildDob.trim() || !newChildPhone.trim()) {
      alert('الرجاء إدخال جميع بيانات الطفل (الاسم، تاريخ الميلاد، ورقم ولي الأمر)');
      return;
    }
    const newChild = {
      id: Date.now(),
      name: newChildName,
      dob: newChildDob,
      phone: newChildPhone,
      status: 'absent',
      checkIn: '-'
    };
    setChildren([...children, newChild]);
    setNewChildName('');
    setNewChildDob('');
    setNewChildPhone('');
    alert('تم إضافة الطفل بنجاح!');
  };

  // إضافة فصل
  const handleAddClassroom = (e) => {
    e.preventDefault();
    if (!newClassroomName.trim()) {
      alert('الرجاء إدخال اسم الفصل');
      return;
    }
    setClassrooms([...classrooms, { id: Date.now(), name: newClassroomName }]);
    setNewClassroomName('');
    alert('تم إضافة الفصل بنجاح!');
  };

  // إضافة معلمة
  const handleAddTeacher = (e) => {
    e.preventDefault();
    if (!newTeacherName.trim()) {
      alert('الرجاء إدخال اسم المعلمة');
      return;
    }
    setTeachers([...teachers, { id: Date.now(), name: newTeacherName, role: newTeacherRole || 'معلمة' }]);
    setNewTeacherName('');
    setNewTeacherRole('');
    alert('تم إضافة المعلمة بنجاح!');
  };

  // تحديث الحضور
  const handleStatusChange = (id, status) => {
    const updated = children.map(child => {
      if (child.id === id) {
        const currentTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        return {
          ...child,
          status,
          checkIn: status !== 'absent' ? currentTime : '-'
        };
      }
      return child;
    });
    setChildren(updated);
  };

  // شاشة تسجيل الدخول
  if (!isLoggedIn) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200">
          <h1 className="text-2xl font-bold text-indigo-600 mb-2 text-center">حضانة الأمل الخاصة</h1>
          <p className="text-slate-500 text-sm mb-6 text-center">يرجى تسجيل الدخول للمتابعة</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">اسم المستخدم</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="admin / teacher / accountant"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="123"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition shadow-md"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  // الواجهة الرئيسية مع التحكم في الصلاحيات
  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* القائمة الجانبية */}
      <aside className="w-full md:w-64 bg-white border-l border-slate-200 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-indigo-600 mb-1">حضانة الأمل</h2>
          <p className="text-xs text-slate-400 mb-1">مرحباً، {currentUser?.username}</p>
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs px-2.5 py-0.5 rounded-full font-semibold mb-6">
            الصلاحية: {currentUser?.role}
          </span>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              📊 لوحة التحكم
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'attendance' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              📋 سجل الحضور والغياب
            </button>
            <button
              onClick={() => setActiveTab('children')}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'children' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              👶 إدارة الأطفال
            </button>
            <button
              onClick={() => setActiveTab('classrooms')}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'classrooms' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              🏫 إدارة الفصول
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'teachers' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              👩‍🏫 إدارة المعلمات
            </button>
            
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-right px-4 py-2.5 rounded-xl text-sm font-medium transition ${activeTab === 'users' ? 'bg-purple-50 text-purple-600' : 'text-purple-600 hover:bg-purple-50'}`}
              >
                🔐 إدارة المستخدمين والصلاحيات
              </button>
            )}
          </nav>
        </div>
        <button
          onClick={() => { setIsLoggedIn(false); setCurrentUser(null); }}
          className="w-full bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium py-2 rounded-xl text-sm transition mt-4"
        >
          تسجيل الخروج
        </button>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-md">
              <h1 className="text-2xl font-bold mb-1">مرحباً بك في نظام حضانة الأمل ✨</h1>
              <p className="text-indigo-100 text-sm">إدارة شؤون الأطفال، الصلاحيات، الفصول، والمعلمات بكل سهولة.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-slate-400 text-sm">إجمالي الأطفال</span>
                <h3 className="text-3xl font-bold text-slate-800 mt-1">{children.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-slate-400 text-sm">إجمالي الفصول</span>
                <h3 className="text-3xl font-bold text-indigo-600 mt-1">{classrooms.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-slate-400 text-sm">إجمالي المعلمات</span>
                <h3 className="text-3xl font-bold text-emerald-600 mt-1">{teachers.length}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <span className="text-slate-400 text-sm">إجمالي المستخدمين</span>
                <h3 className="text-3xl font-bold text-purple-600 mt-1">{users.length}</h3>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">سجل الحضور والغياب</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-sm">
                    <th className="p-4 font-semibold">اسم الطفل</th>
                    <th className="p-4 font-semibold">رقم ولي الأمر</th>
                    <th className="p-4 font-semibold">وقت الحضور</th>
                    <th className="p-4 font-semibold text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {children.map((child) => (
                    <tr key={child.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-medium text-slate-800">{child.name}</td>
                      <td className="p-4 text-slate-500 font-mono">{child.phone}</td>
                      <td className="p-4 text-slate-500">{child.checkIn}</td>
                      <td className="p-4 text-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => handleStatusChange(child.id, 'present')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${child.status === 'present' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'}`}
                        >
                          حاضر ✔️
                        </button>
                        <button
                          onClick={() => handleStatusChange(child.id, 'absent')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${child.status === 'absent' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'}`}
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

        {activeTab === 'children' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">إضافة وإدارة الأطفال</h2>
            
            {/* نموذج إضافة طفل جديد بالبيانات الكاملة */}
            <form onSubmit={handleAddChild} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newChildName}
                onChange={(e) => setNewChildName(e.target.value)}
                placeholder="اسم الطفل الثلاثي..."
                className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="date"
                value={newChildDob}
                onChange={(e) => setNewChildDob(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={newChildPhone}
                  onChange={(e) => setNewChildPhone(e.target.value)}
                  placeholder="رقم ولي الأمر..."
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-xl transition shadow-md whitespace-nowrap"
                >
                  إضافة طفل ➕
                </button>
              </div>
            </form>

            {/* جدول عرض بيانات الأطفال */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-slate-700">قائمة الأطفال المسجلين وبياناتهم</h3>
              </div>
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 text-sm">
                    <th className="p-4 font-semibold">اسم الطفل</th>
                    <th className="p-4 font-semibold">تاريخ الميلاد</th>
                    <th className="p-4 font-semibold">رقم ولي الأمر</th>
                    <th className="p-4 font-semibold">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {children.map(child => (
                    <tr key={child.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-medium text-slate-800">{child.name}</td>
                      <td className="p-4 text-slate-600">{child.dob}</td>
                      <td className="p-4 text-slate-600 font-mono">{child.phone}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${child.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
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

        {activeTab === 'classrooms' && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">إدارة الفصول الدراسية</h2>
            <form onSubmit={handleAddClassroom} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6 flex gap-3">
              <input
                type="text"
                value={newClassroomName}
                onChange={(e) => setNewClassroomName(e.target.value)}
                placeholder="أدخل اسم الفصل الجديد (مثل: فصل النجوم)..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-5
