import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, CheckCircle, Clock, AlertCircle, DollarSign, Calendar, 
  Plus, Trash2, Edit, Save, X, Search, Phone, Mail, 
  TrendingUp, Award, Smile, Bell
} from 'lucide-react';

export default function App() {
  // --- States ---
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Data States
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
      { id: 1, name: 'فاطمة الزهراء', role: 'معلمة لغة عربية', phone: '0501112233', salary: '400' },
      { id: 2, name: 'سارة سمير', role: 'معلمة لغة إنجليزية', phone: '0504455667', salary: '450' }
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
        
        {/* Sidebar */}
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

        {/* Dynamic Content */}
        <main className="lg:col-span-4 space-y-6">
          
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">إجمالي الأطفال</p>
                    <h3 className="text-2xl font-bold text-slate-800">{totalStudents}</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">الحاضرون اليوم</p>
                    <h3 className="text-2xl font-bold text-slate-800">{presentCount}</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">رسوم معلقة</p>
                    <h3 className="text-2xl font-bold text-slate-800">{pendingFeesCount}</h3>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">أنشطة اليوم</p>
                    <h3 className="text-2xl font-bold text-slate-800">{activities.length}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-4">قائمة الأطفال المسجلين مؤخراً</h3>
                <div className="divide-y divide-slate-100">
                  {students.slice(0, 4).map((student) => (
                    <div key={student.id} className="py-3 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-500">فصل: {student.class} | السن: {student.age}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        student.status === 'حاضر' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {student.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Students */}
          {activeTab === 'students' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-slate-800">قائمة الأطفال</h2>
                <button 
                  onClick={() => setShowAddStudent(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition"
                >
                  <UserPlus className="w-4 h-4" /> إضافة طفل جديد
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-semibold border-b border-slate-100">
                      <th className="p-3">اسم الطفل</th>
                      <th className="p-3">العمر</th>
                      <th className="p-3">الفصل</th>
                      <th className="p-3">هاتف ولي الأمر</th>
                      <th className="p-3">الحالة</th>
                      <th className="p-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-800">{student.name}</td>
                        <td className="p-3 text-slate-600">{student.age}</td>
                        <td className="p-3 text-slate-600">{student.class}</td>
                        <td className="p-3 text-slate-600">{student.parentPhone}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                            student.status === 'حاضر' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button 
                            onClick={() => deleteStudent(student.id)}
                            className="text-rose-500 hover:text-rose-700 p-1"
                          >
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

          {/* Attendance */}
          {activeTab === 'attendance' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-800">تسجيل الحضور والغياب اليومي</h2>
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
                        student.status === 'حاضر' 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      }`}
                    >
                      {student.status === 'حاضر' ? 'حاضر ✓' : 'تسجيل حضور'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fees */}
          {activeTab === 'fees' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-800">متابعة تحصيل الرسوم الدراسية</h2>
              <div className="divide-y divide-slate-100">
                {students.map((student) => (
                  <div key={student.id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{student.name}</p>
                      <p className="text-xs text-slate-500">ولي الأمر: {student.parentPhone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        student.feeStatus === 'مدفوع' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {student.feeStatus}
                      </span>
                      <button 
                        onClick={() => toggleFeeStatus(student.id)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 border border-indigo-200 px-3 py-1.5 rounded-lg"
                      >
                        تغيير الحالة
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activities */}
          {activeTab === 'activities' && (
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
                  <div key={act.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        act.type === 'إنجاز' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {act.type}
                      </span>
                      <button onClick={() => deleteActivity(act.id)} className="text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h4 className="font-bold text-slate-800">{act.title}</h4>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>الفصل: {act.class}</span>
                      <span>الوقت: {act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Staff */}
          {activeTab === 'staff' && (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">طاقم العمل والمدرسين</h2>
                <button 
                  onClick={() => setShowAddStaff(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> إضافة موظف
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {staff.map((member) => (
                  <div key={member.id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-800">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role} | هاتف: {member.phone}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-700">{member.salary} د.ك</span>
                      <button onClick={() => deleteStaff(member.id)} className="text-rose-500 hover:text-rose-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Modal Add Student */}
      {showAddStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">إضافة طفل جديد</h3>
              <button onClick={() => setShowAddStudent(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <input 
                type="text" 
                placeholder="اسم الطفل الثلاثي" 
                value={newStudent.name}
                onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-indigo-500"
                required
              />
              <input 
                type="text" 
                placeholder="العمر (مثال: 4 سنوات)" 
                value={newStudent.age}
                onChange={e => setNewStudent({...newStudent, age: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-indigo-500"
              />
              <input 
                type="text" 
                placeholder="رقم هاتف ولي الأمر" 
                value={newStudent.parentPhone}
                onChange={e => setNewStudent({...newStudent, parentPhone: e.target.value})}
                className="w-full p-3 rounded-xl border border-slate-200 text-sm outline-indigo-500"
              />
              <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition">
                حفظ البيانات
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
