import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, CheckCircle, Clock, AlertCircle, DollarSign, Calendar, 
  Plus, Trash2, Edit, Save, X, Search, Phone, Mail, 
  TrendingUp, Award, Smile, Bell, Lock, Key, LogOut, Shield, UserCheck
} from 'lucide-react';

export default function App() {
  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('nursery_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // System Users List
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('nursery_users');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'أحمد محمود', username: 'admin', password: '123', role: 'admin', roleName: 'مدير النظام' },
      { id: 2, name: 'فاطمة الزهراء', username: 'teacher', password: '123', role: 'teacher', roleName: 'معلمة' },
      { id: 3, name: 'سارة سمير', username: 'accountant', password: '123', role: 'accountant', roleName: 'محاسب' }
    ];
  });

  // --- Main App States ---
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('nursery_students');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'أحمد محمد', age: '4 سنوات', class: 'الزهور', parentPhone: '0501234567', status: 'حاضر', feeStatus: 'مدفوع' },
      { id: 2, name: 'سارة خالد', age: '3 سنوات', class: 'البراعم', parentPhone: '0507654321', status: 'غائب', feeStatus: 'معلق' },
      { id: 3, name: 'عمر علي', age: '5 سنوات', class: 'النجوم', parentPhone: '0551122334', status: 'حاضر', feeStatus: 'مدفوع' }
    ];
  });

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem('nursery_staff');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'فاطمة الزهراء', role: 'معلمة لغة عربية', phone: '0501112233', salary: '400' },
      { id: 2, name: 'سارة سمير', role: 'معلمة لغة إنجليزية', phone: '0504455667', salary: '450' }
    ];
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('nursery_activities');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'نشاط الرسم والتلوين', class: 'الزهور', time: '09:00 صباحاً', type: 'إنجاز' },
      { id: 2, title: 'وجبة الإفطار الجماعية', class: 'جميع الفصول', time: '10:30 صباحاً', type: 'وجبات' }
    ];
  });

  // Modals States
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', age: '', class: 'الزهور', parentPhone: '', feeStatus: 'معلق' });

  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', password: '', role: 'teacher' });

  const [showAddActivity, setShowAddActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: '', class: 'الزهور', time: '', type: 'إنجاز' });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('nursery_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nursery_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('nursery_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('nursery_staff', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('nursery_activities', JSON.stringify(activities));
  }, [activities]);

  // Auth Handlers
  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (foundUser) {
      setCurrentUser(foundUser);
      setLoginError('');
      setActiveTab('dashboard');
    } else {
      setLoginError('اسم المستخدم أو كلمة السر غير صحيحة');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginForm({ username: '', password: '' });
  };

  // User Management Handler
  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.password) return;
    const roleNames = { admin: 'مدير النظام', teacher: 'معلمة', accountant: 'محاسب' };
    setUsers([...users, { ...newUser, id: Date.now(), roleName: roleNames[newUser.role] }]);
    setNewUser({ name: '', username: '', password: '', role: 'teacher' });
    setShowAddUser(false);
  };

  const deleteUser = (id) => setUsers(users.filter(u => u.id !== id));

  // Data Handlers
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name) return;
    setStudents([...students, { ...newStudent, id: Date.now(), status: 'غائب' }]);
    setNewStudent({ name: '', age: '', class: 'الزهور', parentPhone: '', feeStatus: 'معلق' });
    setShowAddStudent(false);
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

  // Role Checker Function
  const hasAccess = (allowedRoles) => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true; // المدير يصل لكل شيء
    return allowedRoles.includes(currentUser.role);
  };

  // --- Login View ---
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans" dir="rtl">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-4 bg-indigo-50 text-indigo-600 rounded-2xl mb-2">
              <Smile className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">حضانة الأمل الخاصة</h1>
            <p className="text-sm text-slate-500">تسجيل الدخول لنظام الإدارة ورصد الصلاحيات</p>
          </div>

          {loginError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">اسم المستخدم</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={loginForm.username}
                  onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                  className="w-full p-3 pr-10 rounded-xl border border-slate-200 text-sm outline-indigo-600 bg-slate-50/50"
                  placeholder="أدخل اسم المستخدم"
                  required
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">كلمة السر</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full p-3 pr-10 rounded-xl border border-slate-200 text-sm outline-indigo-600 bg-slate-50/50"
                  placeholder="أدخل كلمة السر"
                  required
                />
                <Key className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold transition shadow-md shadow-indigo-200"
            >
              تسجيل الدخول
            </button>
          </form>

          {/* Quick Login Hint */}
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 mb-1">حسابات تجريبية افتراضية (كلمة السر: 123):</p>
            <p>• مدير النظام: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">admin</code></p>
            <p>• المعلمة: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">teacher</code></p>
            <p>• المحاسب: <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">accountant</code></p>
          </div>
        </div>
      </div>
    );
  }

  // --- Main Application View ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans" dir="rtl">
      
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
              <Smile className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">حضانة الأمل الخاصة ثنائية اللغة - بصنبو</h1>
              <p className="text-xs text-indigo-200">نظام الإدارة وإدارة الصلاحيات</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-left hidden sm:block border-l border-indigo-500/50 pl-4">
              <p className="text-sm font-bold">{currentUser.name}</p>
              <span className="text-xs bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full">
                {currentUser.roleName}
              </span>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 bg-indigo-600 hover:bg-rose-600 rounded-xl text-white transition flex items-center gap-1 text-xs font-semibold"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
            {[
              { id: 'dashboard', label: 'لوحة التحكم', icon: TrendingUp, roles: ['admin', 'teacher', 'accountant'] },
              { id: 'students', label: 'الأطفال والطلاب', icon: Users, roles: ['admin', 'teacher'] },
              { id: 'attendance', label: 'سجل الحضور', icon: CheckCircle, roles: ['admin', 'teacher'] },
              { id: 'fees', label: 'الرسوم والماليات', icon: DollarSign, roles: ['admin', 'accountant'] },
              { id: 'activities', label: 'الأنشطة اليومية', icon: Calendar, roles: ['admin', 'teacher'] },
              { id: 'users', label: 'إدارة الصلاحيات', icon: Shield, roles: ['admin'] },
            ].filter(tab => hasAccess(tab.roles)).map((tab) => {
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

        {/* Dynamic Content View */}
        <main className="lg:col-span-4 space-y-6">
          
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-indigo-900">مرحباً بك، {currentUser.name}!</h3>
                  <p className="text-xs text-indigo-700">أنت تسجل الدخول حالياً بصلاحية: <span className="font-bold">{currentUser.roleName}</span></p>
                </div>
                <UserCheck className="w-8 h-8 text-indigo-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">إجمالي الأطفال</p>
                    <h3 className="text-2xl font-bold text-slate-800">{students.length}</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">الحاضرون اليوم</p>
                    <h3 className="text-2xl font-bold text-slate-800">{students.filter(s => s.status === 'حاضر').length}</h3>
                  </div>
                </div>

                {hasAccess(['accountant']) && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">رسوم معلقة</p>
                      <h3 className="text-2xl font-bold text-slate-800">{students.filter(s => s.feeStatus === 'معلق').length}</h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User & Permissions Management (Admin Only) */}
          {activeTab === 'users' && hasAccess(['admin']) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">إدارة المستخدمين والصلاحيات</h2>
                  <p className="text-xs text-slate-500">إضافة مستخدمين وتحديد أدوارهم في النظام</p>
                </div>
                <button 
                  onClick={() => setShowAddUser(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> إضافة مستخدم جديد
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-100">
                      <th className="p-3">الاسم</th>
                      <th className="p-3">اسم المستخدم</th>
                      <th className="p-3">كلمة السر</th>
                      <th className="p-3">الدور / الصلاحية</th>
                      <th className="p-3 text-center">حذف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-800">{u.name}</td>
                        <td className="p-3 font-mono text-indigo-600">{u.username}</td>
                        <td className="p-3 font-mono text-slate-400">••••••</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            u.role === 'accountant' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.roleName}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {u.username !== 'admin' && (
                            <button onClick={() => deleteUser(u.id)} className="text-rose-500 hover:text-rose-700">
                              <Trash2 className="w-4 h-4" />
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

          {/* Students Tab */}
          {activeTab === 'students' && hasAccess(['teacher']) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">قائمة الأطفال</h2>
                <button 
                  onClick={() => setShowAddStudent(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> إضافة طفل جديد
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {students.map((student) => (
                  <div key={student.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-500">فصل: {student.class} | السن: {student.age}</p>
                    </div>
                    {currentUser.role === 'admin' && (
                      <button onClick={() => deleteStudent(student.id)} className="text-rose-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && hasAccess(['teacher']) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-800">سجل الحضور والغياب اليومي</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {students.map((student) => (
                  <div key={student.id} className="p-4 rounded-xl border border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <p className="font-bold text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-500">فصل: {student.class}</p>
                    </div>
                    <button 
                      onClick={() => toggleAttendance(student.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        student.status === 'حاضر' ? 'bg-emerald-600 text-white' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {student.status === 'حاضر' ? 'حاضر ✓' : 'تسجيل حضور'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fees Tab */}
          {activeTab === 'fees' && hasAccess(['accountant']) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-800">تحصيل الرسوم والماليات</h2>
              <div className="divide-y divide-slate-100">
                {students.map((student) => (
                  <div key={student.id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-500">الهاتف: {student.parentPhone}</p>
                    </div>
                    <button 
                      onClick={() => toggleFeeStatus(student.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        student.feeStatus === 'مدفوع' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {student.feeStatus} (تغيير)
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && hasAccess(['teacher']) && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">جدول الأنشطة اليومية</h2>
                <button 
                  onClick={() => setShowAddActivity(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> إضافة نشاط
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities.map((act) => (
                  <div key={act.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
                    <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">{act.type}</span>
                    <h4 className="font-bold text-slate-800">{act.title}</h4>
                    <p className="text-xs text-slate-500">فصل: {act.class} | الوقت: {act.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Modal Add User */}
      {showAddUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4" dir="rtl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">إضافة مستخدم جديد</h3>
              <button onClick={() => setShowAddUser(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-3">
              <input 
                type="text" 
                placeholder="الاسم الكامل" 
                value={newUser.name}
                onChange={e => setNewUser({...newUser, name: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-indigo-500"
                required
              />
              <input 
                type="text" 
                placeholder="اسم المستخدم (Username)" 
                value={newUser.username}
                onChange={e => setNewUser({...newUser, username: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-indigo-500"
                required
              />
              <input 
                type="password" 
                placeholder="كلمة السر" 
                value={newUser.password}
                onChange={e => setNewUser({...newUser, password: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-indigo-500"
                required
              />
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">الصلاحية / الدور:</label>
                <select 
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-indigo-500 bg-white"
                >
                  <option value="teacher">معلمة (حضور وأنشطة وأطفال)</option>
                  <option value="accountant">محاسب (ماليات ورسوم)</option>
                  <option value="admin">مدير النظام (صلاحيات كاملة)</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
                إضافة المستخدم
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 mt-auto">
        جميع الحقوق محفوظة © {new Date().getFullYear()} - حضانة الأمل الخاصة ثنائية اللغة ، بصنبو
      </footer>
    </div>
  );
}
